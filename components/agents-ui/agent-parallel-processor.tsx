"use client"

import * as React from "react"
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  CircleDot,
  Coins,
  GitFork,
  GitMerge,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  XCircle,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

const LANE_COLORS = [
  { accent: "border-l-sky-500", ring: "#0ea5e9", bg: "bg-sky-50/60 dark:bg-sky-950/20", glow: "shadow-sm", badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300", dot: "bg-sky-500" },
  { accent: "border-l-amber-500", ring: "#f59e0b", bg: "bg-amber-50/60 dark:bg-amber-950/20", glow: "shadow-sm", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", dot: "bg-amber-500" },
  { accent: "border-l-rose-500", ring: "#f43f5e", bg: "bg-rose-50/60 dark:bg-rose-950/20", glow: "shadow-sm", badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300", dot: "bg-rose-500" },
  { accent: "border-l-cyan-500", ring: "#06b6d4", bg: "bg-cyan-50/60 dark:bg-cyan-950/20", glow: "shadow-sm", badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300", dot: "bg-cyan-500" },
  { accent: "border-l-emerald-500", ring: "#10b981", bg: "bg-emerald-50/60 dark:bg-emerald-950/20", glow: "shadow-sm", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", dot: "bg-emerald-500" },
  { accent: "border-l-slate-500", ring: "#64748b", bg: "bg-slate-50/60 dark:bg-slate-950/20", glow: "shadow-sm", badge: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300", dot: "bg-slate-500" },
]

const laneStatusConfig: Record<
  ParallelLaneStatus,
  { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; className: string }
> = {
  waiting: {
    label: "Queued",
    icon: Pause,
    className:
      "bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-400 dark:border-zinc-700",
  },
  processing: {
    label: "Running",
    icon: Loader2,
    className:
      "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
  },
  done: {
    label: "Complete",
    icon: CheckCircle2,
    className:
      "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  },
  error: {
    label: "Failed",
    icon: AlertTriangle,
    className:
      "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  },
}

/* ---------- SVG ring progress indicator ---------- */
function RingProgress({
  progress,
  color,
  size = 40,
  strokeWidth = 3.5,
}: {
  progress: number
  color: string
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-zinc-200 dark:text-zinc-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground rotate-90 origin-center"
        style={{ fontSize: size * 0.26, fontWeight: 600 }}
      >
        {progress}%
      </text>
    </svg>
  )
}

/* ---------- SVG connection paths ---------- */
function ConnectionSVG({ laneCount, laneColors }: { laneCount: number; laneColors: string[] }) {
  // These measurements are layout-relative — they render inside a positioned overlay
  const laneSpacing = 100 / (laneCount + 1)

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <defs>
        {laneColors.map((color, i) => (
          <linearGradient key={`lg-${i}`} id={`lane-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="50%" stopColor={color} stopOpacity={0.5} />
            <stop offset="100%" stopColor={color} stopOpacity={0.3} />
          </linearGradient>
        ))}
      </defs>
      {/* Fan-out lines: left column (18%) → center lanes */}
      {Array.from({ length: laneCount }).map((_, i) => {
        const yEnd = laneSpacing * (i + 1)
        return (
          <path
            key={`fan-out-${i}`}
            d={`M 18 50 C 28 50, 30 ${yEnd}, 38 ${yEnd}`}
            fill="none"
            stroke={`url(#lane-grad-${i})`}
            strokeWidth={0.6}
            strokeDasharray="2 1.5"
            opacity={0.6}
          />
        )
      })}
      {/* Fan-in lines: center lanes → right column (82%) */}
      {Array.from({ length: laneCount }).map((_, i) => {
        const yStart = laneSpacing * (i + 1)
        return (
          <path
            key={`fan-in-${i}`}
            d={`M 62 ${yStart} C 72 ${yStart}, 74 50, 82 50`}
            fill="none"
            stroke={`url(#lane-grad-${i})`}
            strokeWidth={0.6}
            strokeDasharray="2 1.5"
            opacity={0.6}
          />
        )
      })}
    </svg>
  )
}

/* ---------- Main component ---------- */
export function AgentParallelProcessor({
  taskDescription,
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
  const defaultLanes: ParallelLane[] = React.useMemo(
    () => [
      { id: "lane-1", label: "Sentiment Analysis", agentName: "Agent Lyra", status: "done", progress: 100, output: "Overall positive (0.82). Key phrases: 'excellent quality', 'fast shipping'.", tokens: 1240 },
      { id: "lane-2", label: "Entity Extraction", agentName: "Agent Orion", status: "processing", progress: 64, tokens: 860 },
      { id: "lane-3", label: "Topic Classification", agentName: "Agent Nova", status: "processing", progress: 38, tokens: 520 },
      { id: "lane-4", label: "Summary Generation", agentName: "Agent Vega", status: "waiting", progress: 0, tokens: 0 },
    ],
    []
  )

  const displayTask =
    taskDescription ??
    "Analyze 2,400 product reviews from Q4 launch and generate a structured report with sentiment, entities, topics, and an executive summary."
  const displayLanes = lanes && lanes.length > 0 ? lanes : defaultLanes
  const doneCount = displayLanes.filter((l) => l.status === "done").length
  const errorCount = displayLanes.filter((l) => l.status === "error").length
  const overallProgress =
    displayLanes.length > 0
      ? Math.round(displayLanes.reduce((sum, l) => sum + l.progress, 0) / displayLanes.length)
      : 0
  const computedTokens = totalTokens ?? displayLanes.reduce((sum, l) => sum + (l.tokens ?? 0), 0)
  const computedCost = totalCost ?? `$${(computedTokens * 0.00015).toFixed(2)}`

  const activeLaneColors = displayLanes.map((_, i) => LANE_COLORS[i % LANE_COLORS.length])

  return (
    <TooltipProvider>
      <div className={cn("w-full space-y-5 p-4", className)}>
        {/* ── Header bar ─────────────────────────────────────── */}
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-900 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
              <GitFork className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Fan-out / Fan-in
              </p>
              <h2 className="text-lg font-bold tracking-tight">Parallel Processor</h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              className="h-8 gap-1.5 rounded-lg bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              onClick={onStartAll}
            >
              <Play className="h-3.5 w-3.5" />
              Start all
            </Button>
            <Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-lg" onClick={onCancelAll}>
              <XCircle className="h-3.5 w-3.5" />
              Cancel
            </Button>
            {errorCount > 0 && (
              <Button size="sm" variant="secondary" className="h-8 gap-1.5 rounded-lg" onClick={onRetryFailed}>
                <RefreshCw className="h-3.5 w-3.5" />
                Retry failed
              </Button>
            )}
          </div>
        </div>

        {/* ── Pipeline visualization ─────────────────────────── */}
        <div className="relative">
          {/* SVG connection lines - only visible on md+ */}
          <div className="hidden md:block">
            <ConnectionSVG
              laneCount={displayLanes.length}
              laneColors={activeLaneColors.map((c) => c.ring)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr_1fr] md:gap-0">
            {/* ── LEFT: Input card ──────────────────────────── */}
            <div className="flex items-center justify-center md:pr-6 md:relative md:z-10">
              <div className="w-full rounded-xl border-l-4 border-l-transparent bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm" style={{ borderLeftColor: "rgb(99 102 241)" }}>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  <CircleDot className="h-3 w-3" />
                  Input Task
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-foreground/90">
                  {displayTask}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px] dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                    <Zap className="mr-1 h-2.5 w-2.5" />
                    {displayLanes.length} lanes
                  </Badge>
                </div>

                {/* Arrow indicator for mobile */}
                <div className="mt-3 flex justify-center text-muted-foreground md:hidden">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ── CENTER: Parallel lanes ────────────────────── */}
            <div className="space-y-3 md:px-2 md:relative md:z-10">
              {displayLanes.map((lane, index) => {
                const config = laneStatusConfig[lane.status]
                const StatusIcon = config.icon
                const colorSet = activeLaneColors[index]
                const isActive = lane.status === "processing"
                const laneTokenCost =
                  lane.tokens != null ? `$${(lane.tokens * 0.00015).toFixed(3)}` : null

                return (
                  <div
                    key={lane.id}
                    className={cn(
                      "relative rounded-xl border border-zinc-200 p-3.5 shadow-sm transition-all duration-300 dark:border-zinc-800",
                      colorSet.bg,
                      "border-l-[3.5px]",
                      colorSet.accent,
                      isActive && "shadow-md animate-pulse"
                    )}
                    style={{ animationDuration: isActive ? "2.5s" : undefined }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Ring progress */}
                      <RingProgress
                        progress={lane.progress}
                        color={colorSet.ring}
                        size={44}
                        strokeWidth={3.5}
                      />

                      {/* Lane content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate text-sm font-semibold text-foreground">
                            {lane.label}
                          </h3>
                          <Badge
                            className={cn(
                              "flex shrink-0 items-center gap-1 text-[10px]",
                              config.className
                            )}
                          >
                            <StatusIcon
                              className={cn("h-2.5 w-2.5", isActive && "animate-spin")}
                            />
                            {config.label}
                          </Badge>
                        </div>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Bot className="h-3 w-3" />
                          <span>{lane.agentName}</span>
                        </div>

                        {lane.status === "done" && lane.output && (
                          <p className="mt-2 rounded-md border border-dashed border-emerald-300/60 bg-emerald-50/50 p-2 text-[11px] leading-relaxed text-muted-foreground line-clamp-2 dark:border-emerald-800/40 dark:bg-emerald-950/20">
                            {lane.output}
                          </p>
                        )}

                        {lane.status === "error" && (
                          <div className="mt-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 gap-1 rounded-md border-red-200 px-2 text-[11px] text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                                  onClick={() => onRetryLane?.(lane.id)}
                                >
                                  <RefreshCw className="h-2.5 w-2.5" />
                                  Retry lane
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Re-run this lane from the beginning</TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Floating metric badges */}
                    {lane.tokens != null && lane.tokens > 0 && (
                      <div className="absolute -right-1 -top-2 flex gap-1">
                        <span
                          className={cn(
                            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold shadow-sm border",
                            colorSet.badge
                          )}
                        >
                          {lane.tokens.toLocaleString()} tok
                        </span>
                        {laneTokenCost && (
                          <span className="inline-flex items-center rounded-full border bg-white px-1.5 py-0.5 text-[9px] font-semibold text-zinc-600 shadow-sm dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700">
                            {laneTokenCost}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* ── RIGHT: Merge / fan-in card ────────────────── */}
            <div className="flex items-center justify-center md:pl-6 md:relative md:z-10">
              {/* Arrow indicator for mobile */}
              <div className="flex flex-col items-center w-full">
                <div className="mb-3 flex justify-center text-muted-foreground md:hidden">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </div>

                <div className="w-full rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-800/30 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                      <GitMerge className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                        Merge
                      </p>
                    </div>
                  </div>

                  {/* Progress ring for overall */}
                  <div className="mt-3 flex items-center justify-center">
                    <RingProgress
                      progress={overallProgress}
                      color="#10b981"
                      size={56}
                      strokeWidth={4}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="mr-0.5 h-2.5 w-2.5" />
                      {doneCount}/{displayLanes.length}
                    </Badge>
                    <Badge className="border bg-white text-zinc-600 text-[10px] dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700">
                      <Coins className="mr-0.5 h-2.5 w-2.5" />
                      {computedTokens.toLocaleString()}
                    </Badge>
                  </div>

                  <p className="mt-2 text-center text-[10px] font-medium text-muted-foreground">
                    {computedCost}
                  </p>

                  {/* Merge result content */}
                  <div className="mt-3">
                    {mergeStatus === "complete" && mergedOutput ? (
                      <div className="rounded-lg border border-dashed border-emerald-300/70 bg-white/60 p-2.5 dark:border-emerald-800/40 dark:bg-zinc-900/40">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                          Result
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-foreground/80">
                          {mergedOutput}
                        </p>
                      </div>
                    ) : mergeStatus === "merging" ? (
                      <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed p-2.5 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                        <span>Merging...</span>
                      </div>
                    ) : (
                      <p className="rounded-lg border border-dashed p-2.5 text-center text-[11px] text-muted-foreground">
                        Awaiting lane completion
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentParallelProcessor.displayName = "AgentParallelProcessor"
