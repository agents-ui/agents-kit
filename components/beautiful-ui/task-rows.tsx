"use client"

import { cx } from "@/components/boardui/utils/cx"
import { Check, ChevronDown } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import * as React from "react"

export type TaskRowsVariant = "capsules" | "list"
export interface TaskRow {
  id: string
  title: string
  meta?: string
  status: "pending" | "running" | "complete"
  progress?: number
  details?: { label: string; meta?: string }[]
}
export interface TaskRowsProps {
  tasks: TaskRow[]
  variant?: TaskRowsVariant
  onSelect?: (id: string) => void
  expandedId?: string
  onToggle?: (id: string, open: boolean) => void
  className?: string
}

function Marker({
  status,
  index,
}: {
  status: TaskRow["status"]
  index: number
}) {
  const reduceMotion = useReducedMotion()
  if (status === "complete")
    return (
      <span className="flex size-5 items-center justify-center rounded-full bg-green-600 text-white">
        <Check className="size-3" />
      </span>
    )
  if (status === "running")
    return (
      <span className="text-accent-600 relative flex size-5 items-center justify-center text-[11px] tabular-nums">
        <motion.span
          aria-hidden
          className="border-accent-200 border-t-accent-600 absolute inset-0 rounded-full border"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
        {index + 1}
      </span>
    )
  return (
    <span
      className={cx(
        "flex size-5 items-center justify-center rounded-full border text-[11px] tabular-nums",
        "border-separator-border text-text-secondary"
      )}
    >
      {index + 1}
    </span>
  )
}

export function TaskRows({
  tasks,
  variant = "list",
  onSelect,
  expandedId,
  onToggle,
  className,
}: TaskRowsProps) {
  const [localExpanded, setLocalExpanded] = React.useState<string>()
  const reduceMotion = useReducedMotion()
  const selected = expandedId ?? localExpanded
  return (
    <motion.div
      layout={!reduceMotion}
      className={cx(
        variant === "capsules"
          ? "flex w-full flex-col gap-2"
          : "divide-separator-border border-separator-border divide-y border-y",
        className
      )}
    >
      {tasks.map((task, index) => {
        const open = selected === task.id
        return (
          <motion.div
            layout={!reduceMotion}
            key={task.id}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.18,
              delay: reduceMotion ? 0 : index * 0.04,
            }}
            className="block w-full"
          >
            <button
              type="button"
              aria-expanded={Boolean(task.details?.length) ? open : undefined}
              onClick={() => {
                const next = !open
                if (expandedId === undefined)
                  setLocalExpanded(next ? task.id : undefined)
                onSelect?.(task.id)
                onToggle?.(task.id, next)
              }}
              className={cx(
                "group focus-visible:ring-border-focus-ring flex items-center gap-2.5 text-left outline-none focus-visible:ring-2",
                variant === "capsules"
                  ? "border-separator-border bg-background-primary-default min-h-10 w-full rounded-full border px-3"
                  : "min-h-10 w-full px-2"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={task.status}
                  initial={reduceMotion ? false : { opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -2 }}
                  className="inline-flex"
                >
                  <Marker status={task.status} index={index} />
                </motion.span>
              </AnimatePresence>
              <span className="text-text-primary min-w-0 flex-1 truncate text-[13px] font-medium">
                {task.title}
              </span>
              <span className="text-text-secondary ml-auto flex shrink-0 items-center gap-2 text-xs tabular-nums">
                {task.meta && <span>{task.meta}</span>}
                {task.progress !== undefined && <span>{task.progress}%</span>}
                {task.status === "complete" && (
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] text-green-600 dark:text-green-400">
                    Completed
                  </span>
                )}
                {task.details?.length ? (
                  <ChevronDown
                    className={cx(
                      "size-3.5 transition-transform",
                      open && "rotate-180"
                    )}
                  />
                ) : null}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && task.details?.length ? (
                <motion.div
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={
                    reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cx(
                    "bg-background-secondary-default overflow-hidden p-3",
                    variant === "capsules"
                      ? "w-full rounded-lg"
                      : "border-separator-border border-t"
                  )}
                >
                  <div className="divide-separator-border divide-y">
                    {task.details.map((detail) => (
                      <div
                        key={detail.label}
                        className="flex min-h-8 items-center justify-between gap-3 text-xs"
                      >
                        <span className="text-text-primary">
                          {detail.label}
                        </span>
                        <span className="text-text-secondary text-right">
                          {detail.meta}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
