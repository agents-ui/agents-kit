"use client"

import { cx } from "@/components/boardui/utils/cx"
import {
  Check,
  ChevronDown,
  Circle,
  ExternalLink,
  FileEdit,
  FileText,
  LoaderCircle,
  Play,
  Search,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import * as React from "react"

export type ThinkingVariant = "steps" | "reasoning" | "search" | "coding"
export interface ThinkingRow {
  id: string
  label: string
  detail?: string
  status: "pending" | "running" | "complete"
}
export interface ThinkingSource {
  id: string
  title: string
  domain: string
  href: string
}
export interface ThinkingCodeTool {
  id: string
  action: "read" | "edit" | "run"
  target: string
  additions?: number
  deletions?: number
  detail?: string
}
export interface ThinkingStateProps {
  variant?: ThinkingVariant
  title?: string
  rows?: ThinkingRow[]
  reasoning?: string[]
  query?: string
  sources?: ThinkingSource[]
  codeTools?: ThinkingCodeTool[]
  expanded?: boolean
  status?: "running" | "complete"
  visibleCount?: number
  selectedToolId?: string
  onExpandedChange?: (expanded: boolean) => void
  onToolSelect?: (id: string | undefined) => void
  className?: string
}
export function ThinkingState({
  variant = "steps",
  title,
  rows = [],
  reasoning = [],
  query = "",
  sources = [],
  codeTools = [],
  expanded,
  status = "running",
  visibleCount,
  selectedToolId,
  onExpandedChange,
  onToolSelect,
  className,
}: ThinkingStateProps) {
  const [localExpanded, setLocalExpanded] = React.useState(true)
  const [localTool, setLocalTool] = React.useState<string>()
  const reduceMotion = useReducedMotion()
  const open = expanded ?? localExpanded
  const selected = selectedToolId ?? localTool
  const toggle = () => {
    if (expanded === undefined) setLocalExpanded(!open)
    onExpandedChange?.(!open)
  }
  const heading =
    title ??
    (variant === "search"
      ? "Searched the workspace"
      : variant === "coding"
        ? "Ran tools"
        : "Thinking")
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default max-w-xl rounded-xl border",
        className
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="flex min-h-9 w-full items-center gap-2 px-4 text-left"
      >
        {status === "running" ? (
          <LoaderCircle className="text-text-secondary size-4 animate-spin" />
        ) : (
          <Check className="text-text-secondary size-4" />
        )}
        <span className="flex-1 text-[13px] font-medium">{heading}</span>
        <span className="text-text-secondary text-xs capitalize">
          {variant}
        </span>
        <ChevronDown
          className={cx(
            "text-text-secondary size-4 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="trace"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-separator-border overflow-hidden border-t"
          >
            <motion.div
              key={variant}
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              className="p-4"
            >
              {variant === "steps" && (
                <div className="divide-separator-border divide-y">
                  {rows.slice(0, visibleCount).map((row) => {
                    const Icon =
                      row.status === "complete"
                        ? Check
                        : row.status === "running"
                          ? LoaderCircle
                          : Circle
                    return (
                      <div
                        key={row.id}
                        className="flex min-h-10 items-center gap-3"
                      >
                        <Icon
                          className={cx(
                            "text-text-secondary size-4",
                            row.status === "running" && "animate-spin"
                          )}
                        />
                        <span className="flex-1 text-[13px]">{row.label}</span>
                        {row.detail && (
                          <span className="text-text-secondary text-xs">
                            {row.detail}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              {variant === "reasoning" && (
                <div className="border-separator-border space-y-3 border-l pl-4">
                  {reasoning.slice(0, visibleCount).map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-text-secondary text-[13px] leading-5"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {variant === "search" && (
                <div>
                  <div className="bg-background-secondary-default flex items-center gap-2 rounded-lg px-3 py-2">
                    <Search className="text-text-secondary size-4" />
                    <span className="text-[13px]">{query}</span>
                  </div>
                  <div className="divide-separator-border mt-3 divide-y">
                    {sources.slice(0, visibleCount).map((source) => (
                      <a
                        key={source.id}
                        href={source.href}
                        className="flex min-h-9 items-center gap-3"
                      >
                        <ExternalLink className="text-text-secondary size-4" />
                        <span className="flex-1 text-[13px] font-medium">
                          {source.title}
                        </span>
                        <span className="text-text-secondary text-xs">
                          {source.domain}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {variant === "coding" && (
                <div className="divide-separator-border divide-y">
                  {codeTools.slice(0, visibleCount).map((tool) => {
                    const Icon =
                      tool.action === "read"
                        ? FileText
                        : tool.action === "edit"
                          ? FileEdit
                          : Play
                    return (
                      <div key={tool.id}>
                        <button
                          type="button"
                          aria-pressed={selected === tool.id}
                          onClick={() => {
                            const next =
                              selected === tool.id ? undefined : tool.id
                            if (selectedToolId === undefined) setLocalTool(next)
                            onToolSelect?.(next)
                          }}
                          className={cx(
                            "flex min-h-9 w-full items-center gap-3 px-2 text-left",
                            selected === tool.id &&
                              "bg-background-secondary-default"
                          )}
                        >
                          <Icon className="text-text-secondary size-4" />
                          <span className="text-text-secondary w-10 text-xs capitalize">
                            {tool.action}
                          </span>
                          <code className="flex-1 truncate text-xs">
                            {tool.target}
                          </code>
                          {tool.additions !== undefined && (
                            <span className="font-mono text-xs">
                              <span className="text-green-700 dark:text-green-400">
                                +{tool.additions}
                              </span>{" "}
                              <span className="text-red-700 dark:text-red-400">
                                -{tool.deletions ?? 0}
                              </span>
                            </span>
                          )}
                        </button>
                        {selected === tool.id && tool.detail && (
                          <pre className="bg-background-secondary-default overflow-auto p-3 text-xs">
                            {tool.detail}
                          </pre>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
