"use client"

import { cx } from "@/components/boardui/utils/cx"
import { Check, ChevronDown, LoaderCircle, Wrench } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import * as React from "react"

export interface ToolStep {
  id: string
  label: string
  detail?: string
  chip?: string
  additions?: number
  deletions?: number
  status: "running" | "complete" | "error"
}
export interface ToolDiff {
  file: string
  additions: number
  deletions: number
  lines?: string[]
}
export interface ToolChipsProps {
  steps: ToolStep[]
  diffs?: ToolDiff[]
  expandedId?: string
  onToggle?: (id: string) => void
  visibleStepCount?: number
  onDiffToggle?: (file: string, open: boolean) => void
  className?: string
}
export function ToolChips({
  steps,
  diffs = [],
  expandedId,
  onToggle,
  visibleStepCount,
  onDiffToggle,
  className,
}: ToolChipsProps) {
  const [localExpanded, setLocalExpanded] = React.useState<string>()
  const [openDiff, setOpenDiff] = React.useState<string>()
  const reduceMotion = useReducedMotion()
  const selected = expandedId ?? localExpanded
  return (
    <motion.div
      layout={!reduceMotion}
      className={cx(
        "divide-separator-border border-separator-border bg-background-primary-default divide-y rounded-xl border",
        className
      )}
    >
      {steps.slice(0, visibleStepCount).map((step) => {
        const open = step.id === selected
        const Icon =
          step.status === "running"
            ? LoaderCircle
            : step.status === "complete"
              ? Check
              : Wrench
        return (
          <motion.div
            layout={!reduceMotion}
            key={step.id}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            <button
              onClick={() => {
                const next = open ? undefined : step.id
                if (expandedId === undefined) setLocalExpanded(next)
                onToggle?.(next ?? "")
              }}
              className="flex min-h-9 w-full items-center gap-2 px-3 text-left"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={step.status}
                  initial={reduceMotion ? false : { opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -2 }}
                  className="inline-flex"
                >
                  <Icon
                    className={cx(
                      "text-text-secondary size-4",
                      step.status === "running" && "animate-spin"
                    )}
                  />
                </motion.span>
              </AnimatePresence>
              <span className="text-[13px] font-medium">{step.label}</span>
              {step.chip && (
                <code className="bg-background-secondary-default min-w-0 flex-1 truncate rounded-sm px-1.5 py-0.5 text-xs">
                  {step.chip}
                </code>
              )}
              {!step.chip && <span className="flex-1" />}
              {step.additions !== undefined && (
                <span className="font-mono text-xs">
                  <span className="text-green-700 dark:text-green-400">
                    +{step.additions}
                  </span>{" "}
                  <span className="text-red-700 dark:text-red-400">
                    -{step.deletions ?? 0}
                  </span>
                </span>
              )}
              <ChevronDown className={cx("size-4", open && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {open && step.detail && (
                <motion.div
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={
                    reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
                  }
                  className="overflow-hidden"
                >
                  <pre className="bg-background-secondary-default overflow-auto p-3 text-xs">
                    {step.detail}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
      {diffs.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3">
          {diffs.map((diff) => (
            <motion.div
              layout={!reduceMotion}
              key={diff.file}
              className="border-separator-border rounded-lg border px-2 py-1 text-xs"
            >
              <button
                type="button"
                aria-expanded={openDiff === diff.file}
                onClick={() => {
                  const next = openDiff === diff.file ? undefined : diff.file
                  setOpenDiff(next)
                  onDiffToggle?.(diff.file, next === diff.file)
                }}
                className="font-mono"
              >
                {diff.file}{" "}
                <span className="text-green-700 dark:text-green-400">
                  +{diff.additions}
                </span>{" "}
                <span className="text-red-700 dark:text-red-400">
                  -{diff.deletions}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openDiff === diff.file && diff.lines?.length ? (
                  <motion.pre
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={
                      reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
                    }
                    className="border-separator-border mt-2 max-w-sm overflow-auto border-t pt-2 leading-5"
                  >
                    {diff.lines.join("\n")}
                  </motion.pre>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
