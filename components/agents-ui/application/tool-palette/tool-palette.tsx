"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { Input } from "@/components/boardui/base/input/input"
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/components/boardui/base/tabs/tabs"
import { cx } from "@/components/boardui/utils/cx"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"

export type ToolCategory =
  | "all"
  | "data"
  | "creative"
  | "utility"
  | "communication"
export interface AgentTool {
  id: string
  name: string
  description: string
  category: ToolCategory
  icon?: React.ReactNode
  enabled?: boolean
  usageCount?: number
  lastUsed?: Date
  parameters?: {
    name: string
    type: string
    required: boolean
    description?: string
  }[]
}
export interface AgentToolPaletteProps {
  tools: AgentTool[]
  onToolClick?: (tool: AgentTool) => void
  onToolToggle?: (toolId: string, enabled: boolean) => void
  showUsageStats?: boolean
  gridView?: boolean
  className?: string
}
const categories: { id: ToolCategory; label: string }[] = [
  { id: "all", label: "All tools" },
  { id: "data", label: "Data" },
  { id: "creative", label: "Creative" },
  { id: "utility", label: "Utility" },
  { id: "communication", label: "Communication" },
]
function lastUsed(date: Date) {
  const hours = Math.floor((Date.now() - date.getTime()) / 3600000)
  return hours < 1
    ? "Just now"
    : hours < 24
      ? `${hours}h ago`
      : `${Math.floor(hours / 24)}d ago`
}
function ToolRow({
  tool,
  grid,
  usage,
  onOpen,
  onToggle,
}: {
  tool: AgentTool
  grid: boolean
  usage: boolean
  onOpen?: () => void
  onToggle?: () => void
}) {
  const enabled = tool.enabled !== false
  return (
    <article
      className={cx(
        "border-separator-border flex min-w-0 gap-3 p-3",
        grid
          ? "flex-col rounded-lg border"
          : "items-start border-b last:border-b-0",
        !enabled && "opacity-60"
      )}
    >
      <button
        type="button"
        disabled={!enabled}
        onClick={onOpen}
        className={cx("min-w-0 flex-1 text-left", grid && "w-full")}
      >
        <div className="flex items-center gap-2">
          {tool.icon && (
            <span className="text-text-secondary">{tool.icon}</span>
          )}
          <h3 className="text-body-medium truncate">{tool.name}</h3>
          {!enabled && (
            <span className="text-caption-1-medium text-text-secondary ml-auto">
              Disabled
            </span>
          )}
        </div>
        <p className="text-caption-1-regular text-text-secondary mt-1 leading-4">
          {tool.description}
        </p>
        {usage && (
          <p className="text-caption-1-regular text-text-tertiary mt-2">
            {tool.usageCount ?? 0} uses
            {tool.lastUsed ? `  |  ${lastUsed(tool.lastUsed)}` : ""}
          </p>
        )}
        {tool.parameters && tool.parameters.length > 0 && (
          <p className="text-caption-1-regular text-text-tertiary mt-2">
            {tool.parameters.length} parameters
          </p>
        )}
      </button>
      {onToggle && (
        <Button size="small" variant="secondary" onClick={onToggle}>
          {enabled ? "Disable" : "Enable"}
        </Button>
      )}
    </article>
  )
}
export function AgentToolkit({
  tools,
  onToolClick,
  onToolToggle,
  showUsageStats = false,
  gridView = true,
  className,
}: AgentToolPaletteProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<ToolCategory>("all")
  const filtered = useMemo(
    () =>
      tools
        .filter(
          (tool) =>
            (category === "all" || tool.category === category) &&
            (!query ||
              `${tool.name} ${tool.description}`
                .toLowerCase()
                .includes(query.toLowerCase()))
        )
        .sort(
          (a, b) =>
            Number(b.enabled !== false) - Number(a.enabled !== false) ||
            (showUsageStats ? (b.usageCount ?? 0) - (a.usageCount ?? 0) : 0)
        ),
    [tools, query, category, showUsageStats]
  )
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-2xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h2 className="text-headline-semibold">Available tools</h2>
          <p className="text-caption-1-regular text-text-secondary">
            {tools.filter((tool) => tool.enabled !== false).length} enabled |{" "}
            {tools.length} total
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Input
            value={query}
            onChange={setQuery}
            placeholder="Search tools"
            leadingIcon={Search}
          />
        </div>
      </header>
      <Tabs
        selectedKey={category}
        onSelectionChange={(key) => setCategory(key as ToolCategory)}
      >
        <TabList className="overflow-x-auto px-2">
          {categories.map((item) => (
            <Tab key={item.id} id={item.id}>
              {item.label}
            </Tab>
          ))}
        </TabList>
        <TabPanel id={category} className="p-3">
          {filtered.length > 0 ? (
            <div
              className={cx(
                gridView
                  ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                  : "border-separator-border overflow-hidden rounded-lg border"
              )}
            >
              {filtered.map((tool) => (
                <ToolRow
                  key={tool.id}
                  tool={tool}
                  grid={gridView}
                  usage={showUsageStats}
                  onOpen={
                    tool.enabled === false
                      ? undefined
                      : () => onToolClick?.(tool)
                  }
                  onToggle={
                    onToolToggle
                      ? () => onToolToggle(tool.id, tool.enabled === false)
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <div className="grid min-h-40 place-items-center text-center">
              <div>
                <p className="text-body-medium">No tools found</p>
                <p className="text-body-2-regular text-text-secondary mt-1">
                  Try another search or category.
                </p>
              </div>
            </div>
          )}
        </TabPanel>
      </Tabs>
    </section>
  )
}
export const AgentToolPalette = AgentToolkit
