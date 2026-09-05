"use client"

import { cx } from "@/components/boardui/utils/cx"
import { Search } from "lucide-react"
import * as React from "react"

export interface SearchListItem {
  id: string
  label: string
  description?: string
}
export interface SearchListProps {
  value: string
  items: SearchListItem[]
  onValueChange: (value: string) => void
  onSelect?: (id: string) => void
  placeholder?: string
  className?: string
}
export function SearchList({
  value,
  items,
  onValueChange,
  onSelect,
  placeholder = "Search",
  className,
}: SearchListProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const visible = items.filter((item) =>
    `${item.label} ${item.description ?? ""}`
      .toLowerCase()
      .includes(value.toLowerCase())
  )
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default max-w-xl rounded-xl border p-3",
        className
      )}
    >
      <label className="border-separator-border flex h-10 items-center gap-2 border-b px-2">
        <Search className="text-text-secondary size-4" />
        <input
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault()
              setActiveIndex((index) => Math.min(visible.length - 1, index + 1))
            } else if (event.key === "ArrowUp") {
              event.preventDefault()
              setActiveIndex((index) => Math.max(0, index - 1))
            } else if (event.key === "Enter" && visible[activeIndex]) {
              event.preventDefault()
              onSelect?.(visible[activeIndex].id)
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[13px] outline-none"
        />
      </label>
      <div className="divide-separator-border mt-2 divide-y">
        {visible.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect?.(item.id)}
            className={cx(
              "min-h-10 w-full px-2 text-left",
              index === activeIndex && "bg-background-secondary-default"
            )}
          >
            <span className="block text-[13px] font-medium">{item.label}</span>
            {item.description && (
              <span className="text-text-secondary block text-xs">
                {item.description}
              </span>
            )}
          </button>
        ))}
        {visible.length === 0 && (
          <p className="text-text-secondary p-6 text-center text-[13px]">
            No results
          </p>
        )}
      </div>
    </section>
  )
}
