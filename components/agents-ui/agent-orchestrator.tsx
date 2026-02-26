"use client"

import * as React from "react"
import {
  AlertTriangle,
  ArrowDownUp,
  Bot,
  CheckCircle2,
  CirclePause,
  Layers,
  Loader2,
  MessageSquare,
  Network,
  Play,
  RefreshCw,
  Zap,
  Clock,
  Coins,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

/* ------------------------------------------------------------------ */
/*  Status config with border colors                                  */
/* ------------------------------------------------------------------ */
const statusConfig: Record<
  SubAgentStatus,
  {
    label: string
    dotCls: string
    borderCls: string
    icon: React.ElementType
    accentText: string
    progressCls: string
  }
> = {
  idle: {
    label: "Idle",
    dotCls: "bg-slate-400",
    borderCls: "border-l-amber-400",
    icon: Bot,
    accentText: "text-amber-500",
    progressCls: "[&>div]:bg-amber-500",
  },
  running: {
    label: "Running",
    dotCls: "bg-blue-500 animate-pulse",
    borderCls: "border-l-blue-500",
    icon: Loader2,
    accentText: "text-blue-500",
    progressCls: "[&>div]:bg-blue-500",
  },
  completed: {
    label: "Completed",
    dotCls: "bg-emerald-500",
    borderCls: "border-l-emerald-500",
    icon: CheckCircle2,
    accentText: "text-emerald-500",
    progressCls: "[&>div]:bg-emerald-500",
  },
  failed: {
    label: "Failed",
    dotCls: "bg-red-500",
    borderCls: "border-l-red-500",
    icon: AlertTriangle,
    accentText: "text-red-500",
    progressCls: "[&>div]:bg-red-500",
  },
}

/* ------------------------------------------------------------------ */
/*  Tiny sparkline SVG helper                                         */
/* ------------------------------------------------------------------ */
function MiniSparkline({
  data,
  color = "#3b82f6",
  className,
}: {
  data: number[]
  color?: string
  className?: string
}) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 48
  const h = 20
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 4) - 2
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("inline-block", className)}
      width={w}
      height={h}
      fill="none"
    >
      <polyline
        points={points}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polyline
        points={`0,${h} ${points} ${w},${h}`}
        fill={color}
        opacity="0.08"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Agent avatar color palette                                        */
/* ------------------------------------------------------------------ */
const agentColors: Record<string, { bg: string; text: string; ring: string }> =
  {
    Orchestrator: {
      bg: "bg-zinc-100 dark:bg-zinc-800",
      text: "text-zinc-700 dark:text-zinc-300",
      ring: "ring-zinc-300 dark:ring-zinc-700",
    },
    "Research Agent": {
      bg: "bg-blue-100 dark:bg-blue-900/40",
      text: "text-blue-700 dark:text-blue-300",
      ring: "ring-blue-300 dark:ring-blue-700",
    },
    "Analysis Agent": {
      bg: "bg-amber-100 dark:bg-amber-900/40",
      text: "text-amber-700 dark:text-amber-300",
      ring: "ring-amber-300 dark:ring-amber-700",
    },
    "Writer Agent": {
      bg: "bg-emerald-100 dark:bg-emerald-900/40",
      text: "text-emerald-700 dark:text-emerald-300",
      ring: "ring-emerald-300 dark:ring-emerald-700",
    },
  }

const fallbackColor = {
  bg: "bg-slate-100 dark:bg-slate-800",
  text: "text-slate-700 dark:text-slate-300",
  ring: "ring-slate-300 dark:ring-slate-700",
}

function getAgentColor(name: string) {
  return agentColors[name] ?? fallbackColor
}

/* ------------------------------------------------------------------ */
/*  Demo data                                                         */
/* ------------------------------------------------------------------ */
const defaultSubAgents: SubAgent[] = [
  {
    id: "sa-1",
    name: "Research Agent",
    role: "Web search",
    status: "completed",
    task: "Gather top 20 sources on AI-driven content workflows",
    progress: 100,
    metrics: { tokens: 3420, cost: "$0.04", latency: "12s" },
  },
  {
    id: "sa-2",
    name: "Analysis Agent",
    role: "Data processing",
    status: "running",
    task: "Extract key themes and cluster by relevance",
    progress: 64,
    metrics: { tokens: 1860, cost: "$0.02", latency: "8s" },
  },
  {
    id: "sa-3",
    name: "Writer Agent",
    role: "Content synthesis",
    status: "idle",
    task: "Draft 1500-word brief from clustered findings",
    progress: 0,
    metrics: { tokens: 0, cost: "$0.00" },
  },
]

const defaultLog: CommLogEntry[] = [
  {
    id: "log-1",
    timestamp: "09:01",
    from: "Orchestrator",
    to: "Research Agent",
    message: "Begin source collection for AI content workflows",
  },
  {
    id: "log-2",
    timestamp: "09:13",
    from: "Research Agent",
    to: "Orchestrator",
    message: "20 sources collected, passing to analysis",
  },
  {
    id: "log-3",
    timestamp: "09:14",
    from: "Orchestrator",
    to: "Analysis Agent",
    message: "Cluster sources by theme and rank by relevance",
  },
  {
    id: "log-4",
    timestamp: "09:22",
    from: "Analysis Agent",
    to: "Orchestrator",
    message: "64% complete -- 4 clusters identified so far",
  },
]

/* ------------------------------------------------------------------ */
/*  Sparkline demo data per metric type                               */
/* ------------------------------------------------------------------ */
const sparkTokens = [120, 580, 1340, 2100, 3420]
const sparkCost = [0, 0.01, 0.02, 0.03, 0.04]
const sparkLatency = [2, 5, 8, 11, 12]

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export function AgentOrchestrator({
  orchestratorName = "Content Research Pipeline",
  description = "Orchestrates research, analysis, and writing sub-agents to produce a structured content brief.",
  subAgents = defaultSubAgents,
  communicationLog = defaultLog,
  aggregatedResult = "Research complete. Analysis in progress -- 4 thematic clusters identified across 20 sources. Writer Agent queued for final synthesis.",
  isProcessing = true,
  timestamp = "Updated moments ago",
  className,
  onStart,
  onPauseAll,
  onRedistribute,
  onRetryAgent,
}: AgentOrchestratorProps) {
  const completedCount = subAgents.filter(
    (a) => a.status === "completed"
  ).length
  const overallProgress =
    subAgents.length > 0
      ? Math.round(
          subAgents.reduce((s, a) => s + a.progress, 0) / subAgents.length
        )
      : 0
  const totalTokens = subAgents.reduce(
    (s, a) => s + (a.metrics?.tokens ?? 0),
    0
  )
  const totalCost = subAgents.reduce(
    (s, a) => s + parseFloat((a.metrics?.cost ?? "$0").replace("$", "")),
    0
  )

  return (
    <TooltipProvider>
      <div className={cn("space-y-5 p-4", className)}>
        {/* ============================================ */}
        {/*  HEADER                                       */}
        {/* ============================================ */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm dark:bg-card">

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                <Network className="h-3.5 w-3.5" />
                Orchestrator-worker pattern
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-zinc-900 dark:text-zinc-100 text-2xl font-semibold tracking-tight">
                  {orchestratorName}
                </h2>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    isProcessing
                      ? "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20 dark:text-blue-400"
                      : "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      isProcessing
                        ? "animate-pulse bg-blue-500"
                        : "bg-emerald-500"
                    )}
                  />
                  {isProcessing ? "Processing" : "Complete"}
                </span>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-muted-foreground dark:bg-zinc-800">
                {timestamp}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="h-8 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 shadow-sm"
                    onClick={onStart}
                    disabled={isProcessing}
                  >
                    <Play className="mr-1 h-3.5 w-3.5" /> Start
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Launch orchestration pipeline</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-lg"
                    onClick={onPauseAll}
                  >
                    <CirclePause className="mr-1 h-3.5 w-3.5" /> Pause all
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Pause all running sub-agents</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-lg"
                    onClick={onRedistribute}
                  >
                    <ArrowDownUp className="mr-1 h-3.5 w-3.5" /> Redistribute
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Rebalance work across sub-agents
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="relative mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                {completedCount}/{subAgents.length} agents completed
              </span>
              <span className="font-semibold text-foreground">
                {overallProgress}%
              </span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-zinc-200/60 dark:bg-zinc-800/60">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-700 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/*  BENTO GRID -- Sub-agents                    */}
        {/* ============================================ */}
        <div className="grid auto-rows-fr gap-4 md:grid-cols-3 md:grid-rows-[auto]">
          {subAgents.map((agent, idx) => {
            const cfg = statusConfig[agent.status]
            const Icon = cfg.icon
            const isFirst = idx === 0
            return (
              <div
                key={agent.id}
                className={cn(
                  "group relative overflow-hidden rounded-lg border border-border border-l-4 bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
                  cfg.borderCls,
                  isFirst && "md:col-span-2 md:row-span-1"
                )}
              >
                <div className="relative space-y-3">
                  {/* Name + status dot */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {agent.name}
                        </p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className={cn(
                                "inline-block h-2 w-2 shrink-0 rounded-full",
                                cfg.dotCls
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent>{cfg.label}</TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="truncate text-[11px] uppercase tracking-wider text-muted-foreground/70">
                        {agent.role}
                      </p>
                    </div>
                    {agent.status === "running" && (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-500" />
                    )}
                    {agent.status === "completed" && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    )}
                    {agent.status === "failed" && (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                    )}
                  </div>

                  {/* Task description */}
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {agent.task}
                  </p>

                  {/* Animated progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">
                        {agent.progress}%
                      </span>
                    </div>
                    <Progress
                      value={agent.progress}
                      className={cn(
                        "h-1.5 bg-zinc-100 transition-all duration-700 dark:bg-zinc-800",
                        cfg.progressCls
                      )}
                    />
                  </div>

                  {/* Metrics with sparklines -- shown in first (wider) card as a row, else stacked */}
                  {agent.metrics && (
                    <div
                      className={cn(
                        "grid gap-2 rounded-lg bg-muted/50 p-2.5",
                        isFirst ? "grid-cols-3" : "grid-cols-3"
                      )}
                    >
                      {/* Tokens */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                          <Zap className="h-2.5 w-2.5" /> Tokens
                        </div>
                        <p className="text-xs font-semibold text-foreground">
                          {(agent.metrics.tokens ?? 0).toLocaleString()}
                        </p>
                        <MiniSparkline
                          data={sparkTokens.map((v) =>
                            Math.round(
                              v *
                                ((agent.metrics?.tokens ?? 0) /
                                  (sparkTokens[sparkTokens.length - 1] || 1))
                            )
                          )}
                          color={
                            agent.status === "completed" ? "#10b981" : "#3b82f6"
                          }
                          className="mt-0.5"
                        />
                      </div>

                      {/* Cost */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                          <Coins className="h-2.5 w-2.5" /> Cost
                        </div>
                        <p className="text-xs font-semibold text-foreground">
                          {agent.metrics.cost ?? "--"}
                        </p>
                        <MiniSparkline
                          data={sparkCost.map((v) =>
                            Number(
                              (
                                v *
                                (parseFloat(
                                  (agent.metrics?.cost ?? "$0").replace("$", "")
                                ) /
                                  (sparkCost[sparkCost.length - 1] || 1))
                              ).toFixed(4)
                            )
                          )}
                          color="#3b82f6"
                          className="mt-0.5"
                        />
                      </div>

                      {/* Latency */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                          <Clock className="h-2.5 w-2.5" /> Latency
                        </div>
                        <p className="text-xs font-semibold text-foreground">
                          {agent.metrics.latency ?? "--"}
                        </p>
                        <MiniSparkline
                          data={sparkLatency.map((v) =>
                            Math.round(
                              v *
                                (parseFloat(
                                  (agent.metrics?.latency ?? "0s").replace(
                                    "s",
                                    ""
                                  )
                                ) /
                                  (sparkLatency[sparkLatency.length - 1] || 1))
                            )
                          )}
                          color="#f59e0b"
                          className="mt-0.5"
                        />
                      </div>
                    </div>
                  )}

                  {/* Retry button for failed agents */}
                  {agent.status === "failed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-full rounded-lg border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-900/20"
                      onClick={() => onRetryAgent?.(agent.id)}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" /> Retry agent
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ============================================ */}
        {/*  BOTTOM SECTION -- Chat log + Result         */}
        {/* ============================================ */}
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* ---- Communication log as chat bubbles ---- */}
          <div className="overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 shadow-sm">
                  <MessageSquare className="h-3.5 w-3.5 text-white dark:text-zinc-900" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Communication Log
                </p>
              </div>
              <Badge
                variant="outline"
                className="rounded-full text-[10px] font-medium"
              >
                {communicationLog.length} messages
              </Badge>
            </div>

            <ScrollArea className="max-h-[240px] pr-1">
              <div className="space-y-3">
                {communicationLog.map((entry, i) => {
                  const isFromOrchestrator =
                    entry.from === "Orchestrator"
                  const fromColor = getAgentColor(entry.from)
                  const initials = entry.from
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)

                  return (
                    <div
                      key={entry.id}
                      className={cn(
                        "flex gap-2.5",
                        isFromOrchestrator
                          ? "flex-row"
                          : "flex-row-reverse"
                      )}
                    >
                      {/* Avatar */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-1",
                              fromColor.bg,
                              fromColor.text,
                              fromColor.ring
                            )}
                          >
                            {initials}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{entry.from}</TooltipContent>
                      </Tooltip>

                      {/* Bubble */}
                      <div
                        className={cn(
                          "max-w-[80%] space-y-1 rounded-lg px-3 py-2",
                          isFromOrchestrator
                            ? "rounded-tl-sm bg-zinc-100 dark:bg-zinc-800"
                            : "rounded-tr-sm bg-zinc-50 dark:bg-zinc-800/60"
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center gap-2 text-[10px]",
                            isFromOrchestrator
                              ? "flex-row"
                              : "flex-row-reverse"
                          )}
                        >
                          <span className="font-semibold text-foreground/80">
                            {entry.from}
                          </span>
                          <span className="text-muted-foreground/50">
                            {entry.timestamp}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {entry.message}
                        </p>
                      </div>
                    </div>
                  )
                })}
                {communicationLog.length === 0 && (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground">
                      No messages yet.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* ---- Aggregated result + summary stats ---- */}
          <div className="overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 shadow-sm">
                <Layers className="h-3.5 w-3.5 text-white dark:text-zinc-900" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Aggregated Result
              </p>
            </div>

            {aggregatedResult ? (
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {aggregatedResult}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">
                  Waiting for sub-agents to complete before aggregating.
                </p>
              </div>
            )}

            {/* Summary metrics */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                {
                  value: subAgents.length,
                  label: "Agents",
                  icon: Bot,
                  color: "bg-muted/50",
                  iconColor: "text-blue-600",
                },
                {
                  value: totalTokens.toLocaleString(),
                  label: "Total tokens",
                  icon: Zap,
                  color: "bg-muted/50",
                  iconColor: "text-amber-500",
                },
                {
                  value: `$${totalCost.toFixed(2)}`,
                  label: "Total cost",
                  icon: Coins,
                  color: "bg-muted/50",
                  iconColor: "text-emerald-500",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg p-3 text-center",
                    item.color
                  )}
                >
                  <item.icon className={cn("h-3.5 w-3.5", item.iconColor)} />
                  <p className="text-lg font-bold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentOrchestrator.displayName = "AgentOrchestrator"
