"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cn } from "@/lib/utils"
import { ChevronDown, Play, RefreshCw, X } from "lucide-react"

export type ParallelLaneStatus = "waiting" | "processing" | "done" | "error"
export interface ParallelLane {
  id: string
  label: string
  agentName: string
  status: ParallelLaneStatus
  progress: number
  output?: string
  tokens?: number
}
export interface AgentParallelProcessorProps {
  taskDescription?: string
  lanes?: ParallelLane[]
  mergeStatus?: "idle" | "merging" | "complete"
  mergedOutput?: string
  totalTokens?: number
  totalCost?: string
  onStartAll?: () => void
  onCancelAll?: () => void
  onRetryFailed?: () => void
  onRetryLane?: (laneId: string) => void
  className?: string
}
const defaultLanes: ParallelLane[] = [
  {
    id: "sentiment",
    label: "Sentiment analysis",
    agentName: "Analysis worker",
    status: "done",
    progress: 100,
    output: "Positive sentiment with delivery speed as the strongest theme.",
    tokens: 1240,
  },
  {
    id: "entities",
    label: "Entity extraction",
    agentName: "Entity worker",
    status: "processing",
    progress: 64,
    tokens: 860,
  },
  {
    id: "topics",
    label: "Topic classification",
    agentName: "Classification worker",
    status: "processing",
    progress: 38,
    tokens: 520,
  },
  {
    id: "summary",
    label: "Summary generation",
    agentName: "Summary worker",
    status: "waiting",
    progress: 0,
    tokens: 0,
  },
]
const label: Record<ParallelLaneStatus, string> = {
  waiting: "Waiting",
  processing: "Running",
  done: "Complete",
  error: "Failed",
}
const tone: Record<ParallelLaneStatus, string> = {
  waiting: "text-text-secondary",
  processing: "text-accent-600",
  done: "text-green-600",
  error: "text-red-600",
}
export function ParallelProcessor({
  taskDescription = "Analyze product reviews and produce a structured report.",
  lanes,
  mergeStatus = "idle",
  mergedOutput,
  totalTokens,
  totalCost,
  onStartAll,
  onCancelAll,
  onRetryFailed,
  onRetryLane,
  className,
}: AgentParallelProcessorProps) {
  const items = lanes?.length ? lanes : defaultLanes
  const tokens =
    totalTokens ?? items.reduce((sum, item) => sum + (item.tokens || 0), 0)
  const cost = totalCost ?? `$${(tokens * 0.00015).toFixed(2)}`
  const failed = items.filter((item) => item.status === "error").length
  return (
    <section
      className={cn(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-text-secondary text-xs font-medium">
            Parallel execution
          </p>
          <h2 className="text-text-primary mt-1 text-lg font-semibold">
            Processing lanes
          </h2>
          <p className="text-text-secondary mt-1 max-w-2xl text-sm">
            {taskDescription}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="small" leadingIcon={Play} onClick={onStartAll}>
            Start all
          </Button>
          <Button
            size="small"
            variant="secondary"
            leadingIcon={X}
            onClick={onCancelAll}
          >
            Cancel
          </Button>
          {failed > 0 && (
            <Button
              size="small"
              variant="secondary"
              leadingIcon={RefreshCw}
              onClick={onRetryFailed}
            >
              Retry failed
            </Button>
          )}
        </div>
      </header>
      <ol>
        {items.map((lane, index) => (
          <li
            key={lane.id}
            className="border-separator-border border-b px-4 py-3 last:border-0"
          >
            <div className="flex items-start gap-3">
              <span className="text-text-secondary w-6 text-xs tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3">
                  <h3 className="text-text-primary text-sm font-medium">
                    {lane.label}
                  </h3>
                  <span className="text-text-secondary text-xs">
                    {lane.agentName}
                  </span>
                  <span className={cn("text-xs", tone[lane.status])}>
                    {label[lane.status]}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div
                    className="bg-background-secondary-default h-1.5 flex-1 overflow-hidden rounded-full"
                    role="progressbar"
                    aria-label={`${lane.label} progress`}
                    aria-valuenow={lane.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span
                      className="bg-accent-500 block h-full"
                      style={{ width: `${lane.progress}%` }}
                    />
                  </div>
                  <span className="text-text-secondary text-xs tabular-nums">
                    {lane.progress}%
                  </span>
                  {lane.tokens !== undefined && (
                    <span className="text-text-secondary text-xs">
                      {lane.tokens.toLocaleString()} tokens
                    </span>
                  )}
                </div>
                {lane.output && (
                  <details className="group mt-2">
                    <summary className="text-text-secondary flex cursor-pointer list-none items-center gap-1 text-xs">
                      <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
                      Output
                    </summary>
                    <p className="bg-background-secondary-default text-text-secondary mt-2 rounded-lg p-3 text-xs">
                      {lane.output}
                    </p>
                  </details>
                )}
              </div>
              {lane.status === "error" && (
                <Button
                  size="xs"
                  variant="secondary"
                  leadingIcon={RefreshCw}
                  onClick={() => onRetryLane?.(lane.id)}
                >
                  Retry
                </Button>
              )}
            </div>
          </li>
        ))}
      </ol>
      <footer className="p-4">
        <div className="bg-background-secondary-default rounded-lg p-3">
          <div className="flex gap-3 text-xs">
            <span className="text-text-primary font-medium">Merged result</span>
            <span
              className={cn(
                mergeStatus === "complete"
                  ? "text-green-600"
                  : mergeStatus === "merging"
                    ? "text-accent-600"
                    : "text-text-secondary"
              )}
            >
              {mergeStatus === "complete"
                ? "Ready"
                : mergeStatus === "merging"
                  ? "Merging"
                  : "Waiting"}
            </span>
          </div>
          {mergedOutput && (
            <p className="text-text-secondary mt-2 text-sm">{mergedOutput}</p>
          )}
        </div>
        <div className="border-separator-border text-text-secondary mt-3 flex gap-3 border-t pt-3 text-xs">
          <span>{items.length} lanes</span>
          <span>{tokens.toLocaleString()} tokens</span>
          <span>{cost}</span>
        </div>
      </footer>
    </section>
  )
}
