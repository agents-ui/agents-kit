"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { Check, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

export interface DiffTableRow {
  id: string
  field: string
  before: string
  after: string
  status?: "pending" | "accepted" | "rejected"
}
export interface DiffTableProps {
  rows: DiffTableRow[]
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
  onApplyAll?: () => void
  className?: string
}

export function DiffTable({
  rows,
  onAccept,
  onReject,
  onApplyAll,
  className,
}: DiffTableProps) {
  const reduce = useReducedMotion() ?? false
  const accepted = rows.filter((row) => row.status === "accepted").length
  const rejected = rows.filter((row) => row.status === "rejected").length
  const pending = rows.length - accepted - rejected
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex min-h-12 flex-wrap items-center justify-between gap-3 border-b px-4">
        <div>
          <h2 className="text-text-primary text-sm font-semibold">
            Review changes
          </h2>
          <p className="text-text-secondary text-xs">
            {rows.length} changed fields
          </p>
        </div>
        <div className="flex gap-3 text-xs tabular-nums" aria-live="polite">
          {[
            [accepted, "accepted", "text-green-700 dark:text-green-400"],
            [rejected, "rejected", "text-red-700 dark:text-red-400"],
            [pending, "pending", "text-text-secondary"],
          ].map(([count, label, color]) => (
            <span key={String(label)} className={String(color)}>
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={String(count)}
                  initial={reduce ? false : { opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -3 }}
                  transition={{ duration: reduce ? 0 : 0.14 }}
                  className="inline-block"
                >
                  {count} {label}
                </motion.span>
              </AnimatePresence>
            </span>
          ))}
        </div>
      </header>
      <div className="overflow-auto">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead className="bg-background-secondary-default text-text-secondary text-xs">
            <tr>
              <th className="px-4 py-2.5 font-medium">Field</th>
              <th className="px-4 py-2.5 font-medium">Change</th>
              <th className="px-4 py-2.5 font-medium">Decision</th>
            </tr>
          </thead>
          <motion.tbody layout>
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.tr
                  key={row.id}
                  layout="position"
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -4 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 430, damping: 38 }
                  }
                  className="border-separator-border border-t align-top"
                >
                  <th className="text-text-primary w-44 px-4 py-3 font-medium">
                    {row.field}
                  </th>
                  <td className="px-4 py-3">
                    <div className="grid gap-1">
                      <motion.div
                        animate={{
                          opacity: row.status === "accepted" ? 0.42 : 1,
                        }}
                        transition={{ duration: reduce ? 0 : 0.15 }}
                        className={cx(
                          "grid grid-cols-[1rem_1fr] rounded-sm bg-red-500/10 px-2 py-1.5 text-red-800 dark:text-red-300",
                          row.status === "accepted" && "line-through"
                        )}
                      >
                        <span aria-hidden>-</span>
                        <span className="break-words">{row.before}</span>
                      </motion.div>
                      <motion.div
                        animate={{
                          opacity: row.status === "rejected" ? 0.42 : 1,
                        }}
                        transition={{ duration: reduce ? 0 : 0.15 }}
                        className={cx(
                          "grid grid-cols-[1rem_1fr] rounded-sm bg-green-500/10 px-2 py-1.5 text-green-800 dark:text-green-300",
                          row.status === "rejected" && "line-through"
                        )}
                      >
                        <span aria-hidden>+</span>
                        <span className="break-words">{row.after}</span>
                      </motion.div>
                    </div>
                  </td>
                  <td className="w-44 px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        variant={
                          row.status === "rejected" ? "secondary" : "ghost"
                        }
                        size="xs"
                        leadingIcon={X}
                        aria-pressed={row.status === "rejected"}
                        onClick={() => onReject?.(row.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant={
                          row.status === "accepted" ? "secondary" : "ghost"
                        }
                        size="xs"
                        leadingIcon={Check}
                        aria-pressed={row.status === "accepted"}
                        onClick={() => onAccept?.(row.id)}
                      >
                        Accept
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
      <footer className="border-separator-border flex min-h-12 items-center justify-between gap-3 border-t px-4">
        <span className="text-text-secondary text-xs">
          Decisions apply only after confirmation.
        </span>
        {onApplyAll && (
          <Button size="small" onClick={onApplyAll}>
            Apply all {rows.length} changes
          </Button>
        )}
      </footer>
    </section>
  )
}
