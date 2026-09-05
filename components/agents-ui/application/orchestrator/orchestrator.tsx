"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cn } from "@/lib/utils"
import { ChevronDown, Pause, Play, RefreshCw } from "lucide-react"

export type SubAgentStatus = "idle" | "running" | "completed" | "failed"
export interface SubAgentMetrics {
  tokens?: number
  cost?: string
  latency?: string
}
export interface SubAgent {
  id: string
  name: string
  role: string
  status: SubAgentStatus
  task: string
  progress: number
  metrics?: SubAgentMetrics
}
export interface CommLogEntry {
  id: string
  timestamp: string
  from: string
  to: string
  message: string
}
export interface AgentOrchestratorProps {
  orchestratorName?: string
  description?: string
  subAgents?: SubAgent[]
  communicationLog?: CommLogEntry[]
  aggregatedResult?: string
  isProcessing?: boolean
  timestamp?: string
  className?: string
  onStart?: () => void
  onPauseAll?: () => void
  onRedistribute?: () => void
  onRetryAgent?: (agentId: string) => void
}

const workers: SubAgent[] = [
  {
    id: "research",
    name: "Research",
    role: "Source collection",
    status: "completed",
    task: "Collect and rank primary sources",
    progress: 100,
    metrics: { tokens: 3420, cost: "$0.04", latency: "12s" },
  },
  {
    id: "analysis",
    name: "Analysis",
    role: "Evidence review",
    status: "running",
    task: "Compare claims and group related evidence",
    progress: 64,
    metrics: { tokens: 1860, cost: "$0.02", latency: "8s" },
  },
  {
    id: "writing",
    name: "Writer",
    role: "Brief production",
    status: "idle",
    task: "Draft the brief from approved findings",
    progress: 0,
    metrics: { tokens: 0, cost: "$0.00" },
  },
]
const log: CommLogEntry[] = [
  {
    id: "1",
    timestamp: "09:01",
    from: "Coordinator",
    to: "Research",
    message: "Collect sources and flag conflicting claims.",
  },
  {
    id: "2",
    timestamp: "09:13",
    from: "Research",
    to: "Coordinator",
    message: "Twenty sources are ready for analysis.",
  },
  {
    id: "3",
    timestamp: "09:14",
    from: "Coordinator",
    to: "Analysis",
    message: "Rank evidence by relevance and confidence.",
  },
]
const statusText: Record<SubAgentStatus, string> = {
  idle: "Waiting",
  running: "Running",
  completed: "Complete",
  failed: "Failed",
}
const statusClass: Record<SubAgentStatus, string> = {
  idle: "text-text-secondary",
  running: "text-accent-600",
  completed: "text-green-600",
  failed: "text-red-600",
}

export function Orchestrator({
  orchestratorName = "Content research run",
  description = "Coordinate research, analysis, and writing as one accountable run.",
  subAgents = workers,
  communicationLog = log,
  aggregatedResult = "Research is complete. Analysis is comparing four themes across twenty sources.",
  isProcessing = true,
  timestamp = "Updated moments ago",
  className,
  onStart,
  onPauseAll,
  onRedistribute,
  onRetryAgent,
}: AgentOrchestratorProps) {
  const progress = subAgents.length
    ? Math.round(
        subAgents.reduce((sum, item) => sum + item.progress, 0) /
          subAgents.length
      )
    : 0
  const tokens = subAgents.reduce(
    (sum, item) => sum + (item.metrics?.tokens || 0),
    0
  )
  return (
    <section
      className={cn(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
      aria-label="Agent orchestrator"
    >
      <header className="border-separator-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-text-primary text-lg font-semibold">
              {orchestratorName}
            </h2>
            <span
              className={cn(
                "text-xs",
                isProcessing ? "text-accent-600" : "text-green-600"
              )}
            >
              {isProcessing ? "Run active" : "Run complete"}
            </span>
          </div>
          <p className="text-text-secondary mt-1 max-w-2xl text-sm">
            {description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="small"
            leadingIcon={Play}
            disabled={isProcessing}
            onClick={onStart}
          >
            Start
          </Button>
          <Button
            size="small"
            variant="secondary"
            leadingIcon={Pause}
            onClick={onPauseAll}
          >
            Pause all
          </Button>
          <Button
            size="small"
            variant="secondary"
            leadingIcon={RefreshCw}
            onClick={onRedistribute}
          >
            Reassign
          </Button>
        </div>
      </header>
      <div className="border-separator-border border-b px-4 py-3">
        <div className="text-text-secondary flex justify-between text-xs">
          <span>
            {subAgents.filter((item) => item.status === "completed").length} of{" "}
            {subAgents.length} workers complete
          </span>
          <span>{progress}%</span>
        </div>
        <div
          className="bg-background-secondary-default mt-2 h-1.5 overflow-hidden rounded-full"
          role="progressbar"
          aria-label="Run progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className="bg-accent-500 block h-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div>
        {subAgents.map((worker) => (
          <article
            key={worker.id}
            className="border-separator-border flex items-start gap-3 border-b px-4 py-3 last:border-0"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-text-primary text-sm font-medium">
                  {worker.name}
                </h3>
                <span className="text-text-secondary text-xs">
                  {worker.role}
                </span>
                <span className={cn("text-xs", statusClass[worker.status])}>
                  {statusText[worker.status]}
                </span>
              </div>
              <p className="text-text-secondary mt-1 text-xs">{worker.task}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="bg-background-secondary-default h-1.5 flex-1 overflow-hidden rounded-full">
                  <span
                    className="bg-accent-500 block h-full"
                    style={{ width: `${worker.progress}%` }}
                  />
                </div>
                <span className="text-text-secondary text-xs tabular-nums">
                  {worker.progress}%
                </span>
              </div>
              {worker.metrics && (
                <div className="text-text-secondary mt-2 flex gap-3 text-xs">
                  {worker.metrics.tokens !== undefined && (
                    <span>{worker.metrics.tokens.toLocaleString()} tokens</span>
                  )}
                  {worker.metrics.cost && <span>{worker.metrics.cost}</span>}
                  {worker.metrics.latency && (
                    <span>{worker.metrics.latency}</span>
                  )}
                </div>
              )}
            </div>
            {worker.status === "failed" && (
              <Button
                size="xs"
                variant="secondary"
                leadingIcon={RefreshCw}
                onClick={() => onRetryAgent?.(worker.id)}
              >
                Retry
              </Button>
            )}
          </article>
        ))}
      </div>
      <div className="p-4">
        <div className="bg-background-secondary-default rounded-lg p-3">
          <p className="text-text-primary text-xs font-medium">
            Current result
          </p>
          <p className="text-text-secondary mt-1 text-sm">{aggregatedResult}</p>
        </div>
        <details className="group mt-3">
          <summary className="text-text-secondary flex cursor-pointer list-none items-center gap-1 text-xs">
            <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
            Communication log
          </summary>
          <ol className="divide-separator-border bg-background-secondary-default mt-3 divide-y rounded-lg px-3">
            {communicationLog.map((entry) => (
              <li
                key={entry.id}
                className="grid gap-1 py-2 text-xs sm:grid-cols-[4rem_10rem_1fr]"
              >
                <time className="text-text-secondary">{entry.timestamp}</time>
                <span className="text-text-primary">
                  {entry.from} to {entry.to}
                </span>
                <span className="text-text-secondary">{entry.message}</span>
              </li>
            ))}
          </ol>
        </details>
        <div className="border-separator-border text-text-secondary mt-3 flex flex-wrap gap-3 border-t pt-3 text-xs">
          <span>{subAgents.length} workers</span>
          <span>{tokens.toLocaleString()} tokens</span>
          <span>{timestamp}</span>
        </div>
      </div>
    </section>
  )
}
