"use client"

import { cx } from "@/components/boardui/utils/cx"
import { ChevronDown, ChevronUp } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

export interface RecordRow {
  id: string
  name: string
  categories?: string[]
  updated?: string
  strength?: string
  links?: number
}
export interface RecordsTableProps {
  records: RecordRow[]
  sortKey?: keyof RecordRow
  sortDirection?: "asc" | "desc"
  onSort?: (key: keyof RecordRow) => void
  onSelect?: (id: string) => void
  className?: string
}

const columns = ["name", "categories", "updated", "strength", "links"] as const
const labels: Record<(typeof columns)[number], string> = {
  name: "Record",
  categories: "Categories",
  updated: "Updated",
  strength: "Strength",
  links: "Links",
}

export function RecordsTable({
  records,
  sortKey,
  sortDirection = "asc",
  onSort,
  onSelect,
  className,
}: RecordsTableProps) {
  const reduce = useReducedMotion() ?? false
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <div className="overflow-auto">
        <table className="w-full min-w-[680px] text-left text-[13px]">
          <thead className="bg-background-secondary-default text-text-secondary text-xs">
            <tr>
              {columns.map((key) => (
                <th key={key} className="h-9 px-3 font-medium">
                  <button
                    type="button"
                    onClick={() => onSort?.(key)}
                    className="focus-visible:ring-border-focus-ring flex items-center gap-1 rounded-sm outline-none focus-visible:ring-2"
                  >
                    {labels[key]}
                    <AnimatePresence initial={false} mode="wait">
                      {sortKey === key && (
                        <motion.span
                          key={sortDirection}
                          initial={reduce ? false : { opacity: 0, y: 2 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduce ? undefined : { opacity: 0, y: -2 }}
                          transition={{ duration: reduce ? 0 : 0.12 }}
                        >
                          {sortDirection === "asc" ? (
                            <ChevronUp className="size-3" />
                          ) : (
                            <ChevronDown className="size-3" />
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody layout className="divide-separator-border divide-y">
            <AnimatePresence initial={false}>
              {records.map((record) => (
                <motion.tr
                  key={record.id}
                  layout="position"
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -4 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 460, damping: 40 }
                  }
                  className="hover:bg-background-secondary-default"
                >
                  <td className="h-11 px-3">
                    <button
                      type="button"
                      className="text-text-primary focus-visible:ring-border-focus-ring font-medium underline-offset-2 hover:underline focus-visible:ring-2"
                      onClick={() => onSelect?.(record.id)}
                    >
                      {record.name}
                    </button>
                  </td>
                  <td className="h-11 px-3">
                    <div className="flex max-w-64 flex-wrap gap-1">
                      {record.categories?.map((category) => (
                        <span
                          key={category}
                          className="bg-background-secondary-default text-text-secondary rounded-sm px-1.5 py-0.5 text-xs"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-text-secondary h-11 px-3">
                    {record.updated ?? "Not updated"}
                  </td>
                  <td className="text-text-secondary h-11 px-3">
                    {record.strength ?? "Not scored"}
                  </td>
                  <td className="text-text-primary h-11 px-3 tabular-nums">
                    {record.links ?? 0}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
      <footer className="border-separator-border text-text-secondary flex min-h-10 items-center justify-between border-t px-3 text-xs">
        <span>{records.length} records</span>
        <span>
          {records.reduce((sum, record) => sum + (record.links ?? 0), 0)} links
        </span>
      </footer>
    </section>
  )
}
