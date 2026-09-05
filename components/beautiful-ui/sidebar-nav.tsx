"use client"

import { cx } from "@/components/boardui/utils/cx"
import { FileText, Search, Settings } from "lucide-react"

export interface SidebarNavItem {
  id: string
  label: string
  count?: number
}
export interface SidebarNavProps {
  title: string
  items: SidebarNavItem[]
  activeId?: string
  onSelect?: (id: string) => void
  onSearch?: (value: string) => void
  onSettings?: () => void
  className?: string
}
export function SidebarNav({
  title,
  items,
  activeId,
  onSelect,
  onSearch,
  onSettings,
  className,
}: SidebarNavProps) {
  return (
    <aside
      className={cx(
        "border-separator-border bg-background-primary-default w-full max-w-64 rounded-xl border p-3",
        className
      )}
    >
      <h3 className="px-2 py-2 text-[13px] font-semibold">{title}</h3>
      <label className="bg-background-secondary-default flex h-9 items-center gap-2 rounded-lg px-3">
        <Search className="text-text-secondary size-4" />
        <input
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Search"
          className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
        />
      </label>
      <nav className="mt-3 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect?.(item.id)}
            className={cx(
              "flex min-h-9 w-full items-center gap-2 rounded-lg px-2 text-[13px]",
              activeId === item.id &&
                "bg-background-secondary-default font-medium"
            )}
          >
            <FileText className="text-text-secondary size-4" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.count !== undefined && (
              <span className="text-text-secondary text-xs">{item.count}</span>
            )}
          </button>
        ))}
      </nav>
      {onSettings && (
        <button
          onClick={onSettings}
          className="border-separator-border mt-3 flex min-h-9 w-full items-center gap-2 border-t px-2 pt-3 text-[13px]"
        >
          <Settings className="size-4" />
          Settings
        </button>
      )}
    </aside>
  )
}
