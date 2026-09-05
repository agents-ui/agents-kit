"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import {
  Check,
  Circle,
  LoaderCircle,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Radio,
  Square,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import * as React from "react"

export type AgentScreenVariant = "working" | "loading"
export interface AgentScreenStep {
  id: string
  label: string
  status: "pending" | "running" | "complete"
}
export interface AgentScreenProps {
  title: string
  description?: string
  steps?: AgentScreenStep[]
  variant?: AgentScreenVariant
  mediaSrc?: string
  mediaType?: "image" | "video"
  expanded?: boolean
  recording?: boolean
  recordingElapsed?: string
  paused?: boolean
  onExpandedChange?: (expanded: boolean) => void
  onStartRecording?: () => void
  onEndRecording?: () => void
  onPause?: () => void
  onResume?: () => void
  className?: string
}
function ScreenMedia({
  src,
  type,
  loading,
  expanded,
  reduce,
}: {
  src?: string
  type?: "image" | "video"
  loading: boolean
  expanded: boolean
  reduce: boolean
}) {
  const video =
    type === "video" || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(src ?? "")
  const key = loading ? "loading" : src ? `${type ?? "media"}-${src}` : "empty"
  return (
    <div
      className={cx(
        "aspect-video w-full overflow-hidden",
        expanded && "max-h-[calc(100vh-12rem)]"
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={key}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
          className="h-full w-full"
        >
          {loading ? (
            <div className="bg-background-secondary-default text-text-secondary flex h-full items-center justify-center gap-2 text-sm">
              <LoaderCircle
                className={cx("size-5", !reduce && "animate-spin")}
              />
              Connecting to agent screen
            </div>
          ) : !src ? (
            <div className="bg-background-secondary-default text-text-secondary flex h-full items-center justify-center text-sm">
              No screen media supplied
            </div>
          ) : video ? (
            <video
              src={src}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full bg-black object-contain"
            />
          ) : (
            // Caller-provided screen captures may be remote or data URLs and cannot use a fixed Next image loader.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt="Agent screen"
              className="bg-background-secondary-default h-full w-full object-contain"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
export function AgentScreen({
  title,
  description,
  steps = [],
  variant = "working",
  mediaSrc,
  mediaType,
  expanded,
  recording = false,
  recordingElapsed,
  paused = false,
  onExpandedChange,
  onStartRecording,
  onEndRecording,
  onPause,
  onResume,
  className,
}: AgentScreenProps) {
  const reduce = useReducedMotion() ?? false
  const [localExpanded, setLocalExpanded] = React.useState(false)
  const open = expanded ?? localExpanded
  const changeOpen = (next: boolean) => {
    if (expanded === undefined) setLocalExpanded(next)
    onExpandedChange?.(next)
  }
  return (
    <motion.section
      layout={!reduce}
      transition={
        reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 390, damping: 38 }
      }
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        open ? "w-full max-w-none" : "mx-auto w-full max-w-sm",
        className
      )}
    >
      <div className="group relative">
        <ScreenMedia
          src={mediaSrc}
          type={mediaType}
          loading={variant === "loading"}
          expanded={open}
          reduce={reduce}
        />
        {variant !== "loading" && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 0.16 }}
            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20"
          >
            <Button
              variant="secondary"
              size="small"
              leadingIcon={open ? Minimize2 : Maximize2}
              onClick={() => changeOpen(!open)}
            >
              {open ? "Collapse" : "Open screen"}
            </Button>
          </motion.div>
        )}
        <AnimatePresence initial={false}>
          {recording && variant !== "loading" && (
            <motion.span
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduce ? 0 : 0.15 }}
              className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
            >
              <Radio className="size-3" />
              Recording{recordingElapsed ? ` · ${recordingElapsed}` : ""}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <header className="border-separator-border flex flex-wrap items-start justify-between gap-3 border-t p-4">
        <div>
          <p className="text-text-secondary text-xs capitalize">{variant}</p>
          <h2 className="mt-1 text-base font-semibold">{title}</h2>
          {description && (
            <p className="text-text-secondary mt-1 text-sm">{description}</p>
          )}
        </div>
        {variant !== "loading" && (
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={recording ? (paused ? "paused" : "recording") : "idle"}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduce ? 0 : 0.15 }}
              className="flex gap-2"
            >
              {recording ? (
                <Button
                  variant="danger"
                  size="small"
                  leadingIcon={Square}
                  onClick={onEndRecording}
                >
                  End recording
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="small"
                  leadingIcon={Radio}
                  onClick={onStartRecording}
                >
                  Teach a task
                </Button>
              )}
              {recording &&
                (paused ? (
                  <Button
                    variant="ghost"
                    size="small"
                    leadingIcon={Play}
                    onClick={onResume}
                  >
                    Resume
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="small"
                    leadingIcon={Pause}
                    onClick={onPause}
                  >
                    Pause
                  </Button>
                ))}
            </motion.div>
          </AnimatePresence>
        )}
      </header>
      {steps.length > 0 && (
        <motion.div
          layout
          className="divide-separator-border border-separator-border divide-y border-t"
        >
          <AnimatePresence initial={false}>
            {steps.map((step) => {
              const Icon =
                step.status === "complete"
                  ? Check
                  : step.status === "running"
                    ? LoaderCircle
                    : Circle
              return (
                <motion.div
                  key={step.id}
                  layout="position"
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: reduce ? 0 : 0.14 }}
                  className="flex min-h-11 items-center gap-3 px-4"
                >
                  <Icon
                    className={cx(
                      "text-text-secondary size-4",
                      step.status === "running" && "animate-spin"
                    )}
                  />
                  <span className="text-sm">{step.label}</span>
                  <span className="text-text-secondary ml-auto text-xs capitalize">
                    {step.status}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.section>
  )
}
