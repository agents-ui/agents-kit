"use client"

import { cx } from "@/components/boardui/utils/cx"

export type FilterStatus = "todo" | "progress" | "done"
export interface FilterTableRow {
  id: string
  task: string
  date: string
  status: FilterStatus
  owner: string
}
export interface FilterTableProps {
  rows: FilterTableRow[]
  filter?: FilterStatus | "all"
  onFilterChange?: (value: FilterStatus | "all") => void
  className?: string
}
export function FilterTable({
  rows,
  filter = "all",
  onFilterChange,
  className,
}: FilterTableProps) {
  const visible =
    filter === "all" ? rows : rows.filter((row) => row.status === filter)
  return (
    <section
      className={cx("border-separator-border rounded-xl border", className)}
    >
      <div className="border-separator-border flex gap-1 border-b p-2">
        {(["all", "todo", "progress", "done"] as const).map((value) => (
          <button
            key={value}
            onClick={() => onFilterChange?.(value)}
            className={cx(
              "min-h-8 rounded-lg px-3 text-xs capitalize",
              filter === value && "bg-background-secondary-default font-medium"
            )}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="divide-separator-border divide-y">
        {visible.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[1fr_auto_auto] gap-4 p-3 text-[13px]"
          >
            <span>
              {row.task}
              <span className="text-text-secondary block text-xs">
                {row.owner}
              </span>
            </span>
            <span className="text-text-secondary text-xs">{row.date}</span>
            <span className="text-xs capitalize">{row.status}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
