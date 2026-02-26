"use client"

import * as React from "react"
import {
  Check,
  Clock,
  Cpu,
  FastForward,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  SkipForward,
  Train,
  X,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type WorkflowStepStatus = "waiting" | "running" | "completed" | "failed" | "skipped"

export interface WorkflowStep {
  id: string
  number: number
  title: string
  agentName: string
  inputSummary: string
  outputSummary: string
  status: WorkflowStepStatus
  duration?: string
  tokens?: number
}

export interface AgentSequentialWorkflowProps {
  workflowName?: string
  description?: string
  steps?: WorkflowStep[]
  currentStepId?: string
  totalDuration?: string
  totalTokens?: number
  isRunning?: boolean
  onStart?: () => void
  onPause?: () => void
  onRetryStep?: (stepId: string) => void
  onSkipStep?: (stepId: string) => void
  onReset?: () => void
  className?: string
}

const defaultSteps: WorkflowStep[] = [
  { id: "s1", number: 1, title: "Research", agentName: "Research Agent", inputSummary: "Topic: AI trends 2026", outputSummary: "12 sources, 3,200-word brief", status: "completed", duration: "1m 42s", tokens: 4820 },
  { id: "s2", number: 2, title: "Draft", agentName: "Writer Agent", inputSummary: "Research brief (3,200 words)", outputSummary: "1,800-word blog draft", status: "completed", duration: "2m 18s", tokens: 6140 },
  { id: "s3", number: 3, title: "Edit", agentName: "Editor Agent", inputSummary: "Blog draft (1,800 words)", outputSummary: "", status: "running", tokens: 2300 },
  { id: "s4", number: 4, title: "SEO Optimize", agentName: "SEO Agent", inputSummary: "Edited draft", outputSummary: "", status: "waiting" },
  { id: "s5", number: 5, title: "Publish", agentName: "Publisher Agent", inputSummary: "SEO-optimized article", outputSummary: "", status: "waiting" },
]

/* ------------------------------------------------------------------ */
/*  Station node (circle on the metro line)                           */
/* ------------------------------------------------------------------ */
function StationNode({ status }: { status: WorkflowStepStatus }) {
  const size = status === "running" ? 40 : 28
  const half = size / 2

  if (status === "completed") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle cx={half} cy={half} r={half - 2} fill="#10b981" stroke="#059669" strokeWidth={2} />
        <Check className="text-white" x={half - 6} y={half - 6} width={12} height={12} />
      </svg>
    )
  }

  if (status === "running") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        {/* outer pulse ring */}
        <circle cx={half} cy={half} r={half - 2} fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.4}>
          <animate attributeName="r" from={String(half - 6)} to={String(half - 2)} dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* solid inner */}
        <circle cx={half} cy={half} r={half - 6} fill="#3b82f6" stroke="#2563eb" strokeWidth={2} />
        <Loader2 className="text-white animate-spin" x={half - 7} y={half - 7} width={14} height={14} />
      </svg>
    )
  }

  if (status === "failed") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle cx={half} cy={half} r={half - 2} fill="#ef4444" stroke="#dc2626" strokeWidth={2} />
        <X className="text-white" x={half - 6} y={half - 6} width={12} height={12} />
      </svg>
    )
  }

  if (status === "skipped") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle
          cx={half}
          cy={half}
          r={half - 3}
          fill="none"
          stroke="#9ca3af"
          strokeWidth={2}
          strokeDasharray="4 3"
        />
        <FastForward className="text-gray-400" x={half - 6} y={half - 6} width={12} height={12} />
      </svg>
    )
  }

  // waiting
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={half} cy={half} r={half - 3} fill="none" stroke="#d1d5db" strokeWidth={2} className="dark:stroke-slate-600" />
      <circle cx={half} cy={half} r={3} fill="#d1d5db" className="dark:fill-slate-600" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Segment color helpers                                             */
/* ------------------------------------------------------------------ */
function segmentColor(fromStatus: WorkflowStepStatus, toStatus: WorkflowStepStatus): string {
  if (fromStatus === "completed" && toStatus === "completed") return "#10b981"
  if (fromStatus === "completed" && toStatus === "running") return "#3b82f6"
  return "#d1d5db"
}

function segmentColorDark(fromStatus: WorkflowStepStatus, toStatus: WorkflowStepStatus): string {
  if (fromStatus === "completed" && toStatus === "completed") return "#34d399"
  if (fromStatus === "completed" && toStatus === "running") return "#60a5fa"
  return "#4b5563"
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export function AgentSequentialWorkflow({
  workflowName = "Content Publishing Pipeline",
  description = "Sequential agent chain where each step feeds into the next.",
  steps,
  currentStepId = "s3",
  totalDuration = "4m 00s",
  totalTokens = 13260,
  isRunning = true,
  onStart,
  onPause,
  onRetryStep,
  onSkipStep,
  onReset,
  className,
}: AgentSequentialWorkflowProps) {
  const displaySteps = React.useMemo(() => (steps && steps.length > 0 ? steps : defaultSteps), [steps])
  const completedCount = displaySteps.filter((s) => s.status === "completed").length
  const runningCount = displaySteps.filter((s) => s.status === "running").length
  const failedCount = displaySteps.filter((s) => s.status === "failed").length
  const progressPercent = Math.round(((completedCount + runningCount * 0.5) / displaySteps.length) * 100)

  const [selectedStepId, setSelectedStepId] = React.useState<string | null>(null)
  const activeDetailId = selectedStepId ?? currentStepId

  /* station card widths */
  const stationWidth = 180
  const gap = 80
  const nodeAreaWidth = displaySteps.length * stationWidth + (displaySteps.length - 1) * gap

  /* Avg tokens per step */
  const avgTokens = React.useMemo(() => {
    const stepsWithTokens = displaySteps.filter((s) => s.tokens != null)
    if (stepsWithTokens.length === 0) return 0
    return Math.round(stepsWithTokens.reduce((sum, s) => sum + (s.tokens ?? 0), 0) / stepsWithTokens.length)
  }, [displaySteps])

  return (
    <TooltipProvider>
      <div className={cn("w-full space-y-0 overflow-hidden rounded-2xl border bg-background shadow-lg", className)}>

        {/* ── Gradient progress bar at top ── */}
        <div className="relative h-1.5 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPercent}%`,
              background: "#3b82f6",
            }}
          />
          {isRunning && (
            <div
              className="absolute top-0 h-full w-24 animate-[shimmer_2s_infinite]"
              style={{
                left: `${progressPercent - 4}%`,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              }}
            />
          )}
        </div>

        {/* ── Header ── */}
        <div className="flex flex-col gap-3 border-b px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
              <Train className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">{workflowName}</h2>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1 font-mono text-xs tabular-nums">
              <Clock className="h-3 w-3" />
              {totalDuration}
            </Badge>
            <Badge variant="outline" className="gap-1 font-mono text-xs tabular-nums">
              <Zap className="h-3 w-3" />
              {totalTokens.toLocaleString()} tok
            </Badge>
            <Badge
              className={cn(
                "gap-1 text-xs",
                isRunning
                  ? "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800"
                  : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              )}
            >
              <span className={cn("inline-block h-1.5 w-1.5 rounded-full", isRunning ? "bg-blue-500 animate-pulse" : "bg-slate-400")} />
              {isRunning ? "Running" : "Idle"}
            </Badge>
            <div className="flex items-center gap-1 ml-1">
              {isRunning ? (
                <Button size="sm" variant="secondary" className="h-8 gap-1" onClick={onPause}>
                  <Pause className="h-3.5 w-3.5" /> Pause
                </Button>
              ) : (
                <Button size="sm" className="h-8 gap-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={onStart}>
                  <Play className="h-3.5 w-3.5" /> Start
                </Button>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onReset}>
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset pipeline</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* ── Metro map ── */}
        <div className="px-5 pt-6 pb-2">
          <ScrollArea className="w-full">
            <div className="relative" style={{ minWidth: nodeAreaWidth, height: 280 }}>

              {/* --- SVG rail lines + arrows --- */}
              <svg
                className="absolute inset-0 pointer-events-none"
                width={nodeAreaWidth}
                height={280}
                viewBox={`0 0 ${nodeAreaWidth} 280`}
              >
                <defs>
                  {/* Glow filter for active segments */}
                  <filter id="rail-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  {/* Arrow marker */}
                  <marker id="flow-arrow-green" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6" fill="#10b981" />
                  </marker>
                  <marker id="flow-arrow-blue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6" fill="#3b82f6" />
                  </marker>
                  <marker id="flow-arrow-gray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6" fill="#d1d5db" />
                  </marker>
                </defs>

                {displaySteps.map((step, i) => {
                  if (i === displaySteps.length - 1) return null
                  const nextStep = displaySteps[i + 1]
                  const x1 = i * (stationWidth + gap) + stationWidth / 2 + (step.status === "running" ? 6 : 0)
                  const x2 = (i + 1) * (stationWidth + gap) + stationWidth / 2 - (nextStep.status === "running" ? 6 : 0)
                  const railY = 40
                  const color = segmentColor(step.status, nextStep.status)
                  const colorDark = segmentColorDark(step.status, nextStep.status)
                  const isActive = step.status === "completed" && nextStep.status === "running"
                  const arrowColor = color === "#10b981" ? "green" : color === "#3b82f6" ? "blue" : "gray"

                  return (
                    <g key={`rail-${step.id}`}>
                      {/* light mode rail */}
                      <line
                        x1={x1 + 18}
                        y1={railY}
                        x2={x2 - 18}
                        y2={railY}
                        stroke={color}
                        strokeWidth={isActive ? 4 : 3}
                        strokeLinecap="round"
                        className="dark:hidden"
                        filter={isActive ? "url(#rail-glow)" : undefined}
                        markerEnd={`url(#flow-arrow-${arrowColor})`}
                      />
                      {/* dark mode rail */}
                      <line
                        x1={x1 + 18}
                        y1={railY}
                        x2={x2 - 18}
                        y2={railY}
                        stroke={colorDark}
                        strokeWidth={isActive ? 4 : 3}
                        strokeLinecap="round"
                        className="hidden dark:block"
                        filter={isActive ? "url(#rail-glow)" : undefined}
                      />
                      {/* data flow pulse for active */}
                      {isActive && (
                        <circle r="4" fill="#3b82f6">
                          <animateMotion
                            dur="1.8s"
                            repeatCount="indefinite"
                            path={`M${x1 + 18},${railY} L${x2 - 18},${railY}`}
                          />
                          <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.8s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* --- Station nodes + cards --- */}
              <div className="relative flex" style={{ height: 280 }}>
                {displaySteps.map((step, i) => {
                  const isCurrent = step.id === currentStepId
                  const isSelected = step.id === activeDetailId
                  const nodeSize = step.status === "running" ? 40 : 28
                  const config = statusConfig[step.status]
                  const xPos = i * (stationWidth + gap)

                  return (
                    <div
                      key={step.id}
                      className="absolute flex flex-col items-center"
                      style={{ left: xPos, width: stationWidth, top: 0 }}
                    >
                      {/* Station circle */}
                      <button
                        onClick={() => setSelectedStepId(step.id === selectedStepId ? null : step.id)}
                        className={cn(
                          "relative z-10 flex items-center justify-center transition-transform hover:scale-110",
                          step.status === "running" ? "h-10 w-10" : "h-7 w-7"
                        )}
                        style={{ marginTop: step.status === "running" ? 20 : 26 }}
                      >
                        <StationNode status={step.status} />
                      </button>

                      {/* Station label */}
                      <p className={cn(
                        "mt-2 text-center text-xs font-semibold leading-tight",
                        step.status === "running" ? "text-blue-600 dark:text-blue-400" :
                        step.status === "completed" ? "text-emerald-600 dark:text-emerald-400" :
                        step.status === "failed" ? "text-red-600 dark:text-red-400" :
                        "text-muted-foreground"
                      )}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 text-center">{step.agentName}</p>

                      {/* Floating detail card */}
                      <div
                        className={cn(
                          "mt-2 w-full rounded-lg border p-3 text-left transition-all duration-300",
                          isSelected
                            ? "bg-background shadow-md ring-1 scale-[1.02]"
                            : "bg-muted/40 shadow-sm opacity-80 hover:opacity-100",
                          isCurrent && step.status === "running"
                            ? "ring-blue-400/50 dark:ring-blue-500/40 border-blue-200 dark:border-blue-800"
                            : step.status === "completed"
                            ? "ring-emerald-300/40 dark:ring-emerald-600/30 border-emerald-200 dark:border-emerald-800"
                            : step.status === "failed"
                            ? "ring-red-300/40 dark:ring-red-600/30 border-red-200 dark:border-red-800"
                            : "ring-transparent"
                        )}
                      >
                        {/* Status badge */}
                        <div className="mb-2 flex items-center justify-between">
                          <Badge className={cn("text-[10px] px-1.5 py-0 h-4 gap-0.5", config.badge)}>
                            {config.icon && <config.icon className={cn("h-2.5 w-2.5", step.status === "running" && "animate-spin")} />}
                            {config.label}
                          </Badge>
                          {step.duration && (
                            <span className="text-[10px] text-muted-foreground font-mono tabular-nums">{step.duration}</span>
                          )}
                        </div>

                        {/* I/O summary */}
                        {step.inputSummary && (
                          <div className="mb-1 flex items-start gap-1">
                            <span className="mt-px inline-block h-3 w-3 shrink-0 rounded-sm bg-blue-100 dark:bg-blue-900/40 text-center text-[8px] font-bold leading-3 text-blue-700 dark:text-blue-300">I</span>
                            <p className="text-[10px] leading-tight text-muted-foreground truncate">{step.inputSummary}</p>
                          </div>
                        )}
                        {step.outputSummary && (
                          <div className="mb-1 flex items-start gap-1">
                            <span className="mt-px inline-block h-3 w-3 shrink-0 rounded-sm bg-emerald-100 dark:bg-emerald-900/40 text-center text-[8px] font-bold leading-3 text-emerald-700 dark:text-emerald-300">O</span>
                            <p className="text-[10px] leading-tight text-muted-foreground truncate">{step.outputSummary}</p>
                          </div>
                        )}

                        {/* Tokens */}
                        {step.tokens != null && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Zap className="h-2.5 w-2.5" />
                            <span className="font-mono tabular-nums">{step.tokens.toLocaleString()} tokens</span>
                          </div>
                        )}

                        {/* Running indicator */}
                        {isCurrent && step.status === "running" && (
                          <div className="mt-2 flex items-center gap-1.5 rounded-md bg-blue-50 dark:bg-blue-950/40 px-2 py-1 text-[10px] text-blue-600 dark:text-blue-400">
                            <span className="inline-block h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                            Processing...
                          </div>
                        )}

                        {/* Actions */}
                        {step.status === "failed" && (
                          <Button size="sm" variant="outline" className="mt-2 h-6 text-[10px] w-full" onClick={() => onRetryStep?.(step.id)}>
                            <RefreshCw className="mr-1 h-2.5 w-2.5" /> Retry
                          </Button>
                        )}
                        {step.status === "waiting" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost" className="mt-2 h-6 text-[10px] w-full gap-1" onClick={() => onSkipStep?.(step.id)}>
                                <SkipForward className="h-2.5 w-2.5" /> Skip
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Skip this step</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* ── Metrics dashboard ── */}
        <div className="grid grid-cols-2 gap-3 border-t px-5 py-4 sm:grid-cols-4">
          {/* Progress */}
          <div className="rounded-xl border bg-emerald-50/60 dark:bg-emerald-950/20 p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Check className="h-3 w-3" />
              Progress
            </div>
            <p className="mt-1 text-xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
              {completedCount}<span className="text-sm font-normal text-muted-foreground">/{displaySteps.length}</span>
            </p>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-emerald-200/60 dark:bg-emerald-800/40">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${Math.round((completedCount / displaySteps.length) * 100)}%` }}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="rounded-xl border bg-blue-50/60 dark:bg-blue-950/20 p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Clock className="h-3 w-3" />
              Duration
            </div>
            <p className="mt-1 text-xl font-bold tabular-nums text-blue-700 dark:text-blue-300">
              {totalDuration}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Total elapsed time
            </p>
          </div>

          {/* Tokens */}
          <div className="rounded-xl border bg-zinc-50/80 dark:bg-zinc-900/30 p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              <Zap className="h-3 w-3" />
              Tokens
            </div>
            <p className="mt-1 text-xl font-bold tabular-nums text-zinc-700 dark:text-zinc-300">
              {totalTokens.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              ~{avgTokens.toLocaleString()} avg/step
            </p>
          </div>

          {/* Status */}
          <div className="rounded-xl border bg-amber-50/60 dark:bg-amber-950/20 p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Cpu className="h-3 w-3" />
              Status
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-xl font-bold tabular-nums text-amber-700 dark:text-amber-300">
                {progressPercent}%
              </p>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
              {runningCount > 0 && <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" />{runningCount} active</span>}
              {failedCount > 0 && <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />{failedCount} failed</span>}
              {failedCount === 0 && runningCount === 0 && <span>Pipeline idle</span>}
              {failedCount === 0 && runningCount > 0 && <span>On track</span>}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

/* ------------------------------------------------------------------ */
/*  Status config (for badge styling in cards)                        */
/* ------------------------------------------------------------------ */
const statusConfig: Record<WorkflowStepStatus, {
  label: string
  badge: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { className?: string }>
}> = {
  waiting: {
    label: "Waiting",
    badge: "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700",
    icon: Clock,
  },
  running: {
    label: "Running",
    badge: "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
    icon: Loader2,
  },
  completed: {
    label: "Done",
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    icon: Check,
  },
  failed: {
    label: "Failed",
    badge: "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    icon: X,
  },
  skipped: {
    label: "Skipped",
    badge: "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    icon: FastForward,
  },
}

AgentSequentialWorkflow.displayName = "AgentSequentialWorkflow"
