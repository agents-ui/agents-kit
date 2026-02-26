"use client"

import * as React from "react"
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  XCircle,
  ArrowUp,
  ArrowDown,
  MessageSquare,
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

export interface EvalCriterion {
  label: string
  score: number
  maxScore: number
}

export interface EvalIteration {
  id: string
  number: number
  output: string
  score: number
  feedback: string
  criteria: EvalCriterion[]
  status: "passed" | "failed" | "in-progress"
}

export interface AgentEvaluatorProps {
  taskDescription?: string
  iterations?: EvalIteration[]
  currentIteration?: number
  qualityThreshold?: number
  maxIterations?: number
  isRunning?: boolean
  className?: string
  onRunNext?: () => void
  onAccept?: () => void
  onReset?: () => void
  onAdjustThreshold?: (value: number) => void
}

const statusConfig: Record<EvalIteration["status"], { label: string; icon: React.ElementType; cls: string }> = {
  passed: {
    label: "Passed",
    icon: CheckCircle2,
    cls: "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-900/40",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    cls: "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-900/40",
  },
  "in-progress": {
    label: "In progress",
    icon: Loader2,
    cls: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-900/50",
  },
}

const defaultIterations: EvalIteration[] = [
  {
    id: "iter-1",
    number: 1,
    output: "Check out our new product features!",
    score: 45,
    feedback: "Too generic. Lacks specificity, urgency, and personalization. High spam-score due to exclamation mark.",
    criteria: [
      { label: "Clarity", score: 60, maxScore: 100 },
      { label: "Engagement", score: 35, maxScore: 100 },
      { label: "Length", score: 50, maxScore: 100 },
      { label: "Spam-score", score: 35, maxScore: 100 },
    ],
    status: "failed",
  },
  {
    id: "iter-2",
    number: 2,
    output: "3 workflow shortcuts your team hasn't tried yet",
    score: 72,
    feedback: "Better specificity and curiosity gap. Length is good. Reduce implied clickbait to improve spam-score.",
    criteria: [
      { label: "Clarity", score: 78, maxScore: 100 },
      { label: "Engagement", score: 82, maxScore: 100 },
      { label: "Length", score: 70, maxScore: 100 },
      { label: "Spam-score", score: 58, maxScore: 100 },
    ],
    status: "failed",
  },
  {
    id: "iter-3",
    number: 3,
    output: "Your Monday just got 2 hours shorter \u2014 here's how",
    score: 91,
    feedback: "Strong personal benefit, concrete value proposition, clean of spam triggers. Meets quality threshold.",
    criteria: [
      { label: "Clarity", score: 92, maxScore: 100 },
      { label: "Engagement", score: 95, maxScore: 100 },
      { label: "Length", score: 85, maxScore: 100 },
      { label: "Spam-score", score: 90, maxScore: 100 },
    ],
    status: "passed",
  },
]

function criterionBarColor(score: number) {
  if (score >= 80) return "from-emerald-400 to-emerald-500"
  if (score >= 60) return "from-blue-400 to-blue-500"
  if (score >= 40) return "from-amber-400 to-amber-500"
  return "from-red-400 to-red-500"
}

function criterionBarBg(score: number) {
  if (score >= 80) return "bg-emerald-500/10 dark:bg-emerald-500/5"
  if (score >= 60) return "bg-blue-500/10 dark:bg-blue-500/5"
  if (score >= 40) return "bg-amber-500/10 dark:bg-amber-500/5"
  return "bg-red-500/10 dark:bg-red-500/5"
}

function criterionTextColor(score: number) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400"
  if (score >= 60) return "text-blue-600 dark:text-blue-400"
  if (score >= 40) return "text-amber-600 dark:text-amber-400"
  return "text-red-600 dark:text-red-400"
}

/* ---- Radial Gauge Component ---- */
function RadialGauge({
  score,
  threshold,
  size = 220,
}: {
  score: number
  threshold: number
  size?: number
}) {
  const cx = size / 2
  const cy = size / 2 + 10
  const radius = size / 2 - 20
  const startAngle = Math.PI
  const endAngle = 2 * Math.PI
  const scoreAngle = startAngle + (score / 100) * (endAngle - startAngle)
  const thresholdAngle = startAngle + (threshold / 100) * (endAngle - startAngle)

  function polarToCartesian(angle: number) {
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  }

  function describeArc(from: number, to: number) {
    const start = polarToCartesian(from)
    const end = polarToCartesian(to)
    const largeArc = to - from > Math.PI ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  const gradientId = "gauge-gradient"
  const trackId = "gauge-track-bg"
  const glowId = "gauge-glow"
  const thresholdPos = polarToCartesian(thresholdAngle)

  const scoreLabel =
    score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Poor"
  const scoreLabelColor =
    score >= 80
      ? "text-emerald-500"
      : score >= 60
        ? "text-blue-500"
        : score >= 40
          ? "text-amber-500"
          : "text-red-500"

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="65%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id={trackId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.07" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.07" />
          </linearGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track background */}
        <path
          d={describeArc(startAngle, endAngle)}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Tick marks */}
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => {
          const angle = startAngle + (tick / 100) * (endAngle - startAngle)
          const innerR = radius - 14
          const outerR = radius + 14
          const isMajor = tick % 20 === 0
          const inner = {
            x: cx + innerR * Math.cos(angle),
            y: cy + innerR * Math.sin(angle),
          }
          const outer = {
            x: cx + outerR * Math.cos(angle),
            y: cy + outerR * Math.sin(angle),
          }
          return (
            <g key={tick}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="currentColor"
                strokeOpacity={isMajor ? 0.2 : 0.08}
                strokeWidth={isMajor ? 1.5 : 0.8}
              />
              {isMajor && (
                <text
                  x={cx + (radius + 24) * Math.cos(angle)}
                  y={cy + (radius + 24) * Math.sin(angle)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9"
                  fill="currentColor"
                  fillOpacity="0.35"
                  fontWeight="500"
                >
                  {tick}
                </text>
              )}
            </g>
          )
        })}

        {/* Score arc */}
        {score > 0 && (
          <path
            d={describeArc(startAngle, scoreAngle)}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="18"
            strokeLinecap="round"
            filter={`url(#${glowId})`}
          />
        )}

        {/* Threshold marker */}
        <line
          x1={cx + (radius - 16) * Math.cos(thresholdAngle)}
          y1={cy + (radius - 16) * Math.sin(thresholdAngle)}
          x2={cx + (radius + 16) * Math.cos(thresholdAngle)}
          y2={cy + (radius + 16) * Math.sin(thresholdAngle)}
          stroke="#ef4444"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />
        <text
          x={thresholdPos.x + 14 * Math.cos(thresholdAngle)}
          y={thresholdPos.y + 14 * Math.sin(thresholdAngle) - 6}
          textAnchor="middle"
          fontSize="8"
          fill="#ef4444"
          fontWeight="600"
        >
          {threshold}
        </text>
      </svg>

      {/* Central score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <span
          className="text-5xl font-bold tracking-tight"
          style={{ fontFeatureSettings: "'tnum'" }}
        >
          {score}
        </span>
        <span className={cn("text-xs font-semibold uppercase tracking-widest mt-0.5", scoreLabelColor)}>
          {scoreLabel}
        </span>
      </div>
    </div>
  )
}

/* ---- Sparkline Convergence Chart ---- */
function ConvergenceChart({
  scores,
  threshold,
}: {
  scores: number[]
  threshold: number
}) {
  const padding = { top: 12, right: 16, bottom: 20, left: 32 }
  const width = 400
  const height = 140
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const minVal = 0
  const maxVal = 100

  function toX(idx: number) {
    return padding.left + (scores.length === 1 ? chartW / 2 : (idx / (scores.length - 1)) * chartW)
  }

  function toY(val: number) {
    return padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH
  }

  const linePath = scores
    .map((s, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)} ${toY(s).toFixed(1)}`)
    .join(" ")

  const areaPath = `${linePath} L${toX(scores.length - 1).toFixed(1)} ${(padding.top + chartH).toFixed(1)} L${toX(0).toFixed(1)} ${(padding.top + chartH).toFixed(1)} Z`

  const thresholdY = toY(threshold)

  const gridLines = [0, 20, 40, 60, 80, 100]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id="convergence-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="convergence-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="dot-shadow">
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Grid lines */}
      {gridLines.map((val) => (
        <g key={val}>
          <line
            x1={padding.left}
            y1={toY(val)}
            x2={width - padding.right}
            y2={toY(val)}
            stroke="currentColor"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
          <text
            x={padding.left - 6}
            y={toY(val)}
            textAnchor="end"
            dominantBaseline="central"
            fontSize="9"
            fill="currentColor"
            fillOpacity="0.3"
            fontWeight="500"
          >
            {val}
          </text>
        </g>
      ))}

      {/* Threshold dashed line */}
      <line
        x1={padding.left}
        y1={thresholdY}
        x2={width - padding.right}
        y2={thresholdY}
        stroke="#ef4444"
        strokeWidth="1.2"
        strokeDasharray="6 4"
        strokeOpacity="0.6"
      />
      <text
        x={width - padding.right + 4}
        y={thresholdY}
        dominantBaseline="central"
        fontSize="9"
        fill="#ef4444"
        fontWeight="600"
        fillOpacity="0.8"
      >
        {threshold}
      </text>

      {/* Area fill */}
      <path d={areaPath} fill="url(#convergence-fill)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="url(#convergence-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data point dots */}
      {scores.map((s, i) => (
        <g key={i}>
          <circle
            cx={toX(i)}
            cy={toY(s)}
            r="5"
            fill="white"
            stroke="#3b82f6"
            strokeWidth="2.5"
            filter="url(#dot-shadow)"
            className="dark:fill-gray-900"
          />
          <text
            x={toX(i)}
            y={toY(s) - 10}
            textAnchor="middle"
            fontSize="9"
            fill="currentColor"
            fillOpacity="0.6"
            fontWeight="600"
          >
            {s}
          </text>
        </g>
      ))}

      {/* X-axis labels */}
      {scores.map((_, i) => (
        <text
          key={i}
          x={toX(i)}
          y={height - 4}
          textAnchor="middle"
          fontSize="9"
          fill="currentColor"
          fillOpacity="0.35"
          fontWeight="500"
        >
          #{i + 1}
        </text>
      ))}
    </svg>
  )
}

/* ---- Criteria Horizontal Bar Chart ---- */
function CriteriaBarChart({ criteria }: { criteria: EvalCriterion[] }) {
  return (
    <div className="space-y-2">
      {criteria.map((c) => {
        const pct = (c.score / c.maxScore) * 100
        return (
          <div key={c.label} className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground w-24 text-right shrink-0 truncate">
              {c.label}
            </span>
            <div className={cn("relative h-7 flex-1 rounded-md overflow-hidden", criterionBarBg(c.score))}>
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-md bg-gradient-to-r transition-all duration-500",
                  criterionBarColor(c.score)
                )}
                style={{ width: `${pct}%` }}
              />
              <div className="absolute inset-0 flex items-center px-2">
                <span
                  className={cn(
                    "text-[11px] font-bold ml-auto drop-shadow-sm",
                    pct > 20 ? "text-white" : criterionTextColor(c.score)
                  )}
                  style={{ fontFeatureSettings: "'tnum'" }}
                >
                  {c.score}/{c.maxScore}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function AgentEvaluator({
  taskDescription = "Email Subject Line Optimization",
  iterations = defaultIterations,
  currentIteration = 3,
  qualityThreshold = 85,
  maxIterations = 5,
  isRunning = false,
  className,
  onRunNext,
  onAccept,
  onReset,
  onAdjustThreshold,
}: AgentEvaluatorProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(
    () => iterations.find((i) => i.number === currentIteration)?.id ?? null
  )

  const latestScore = iterations.length > 0 ? iterations[iterations.length - 1].score : 0
  const hasPassed = iterations.some((i) => i.status === "passed")
  const scores = iterations.map((i) => i.score)

  // Compute deltas between iterations
  const deltas = React.useMemo(() => {
    const d: Record<string, number> = {}
    for (let i = 1; i < iterations.length; i++) {
      d[iterations[i].id] = iterations[i].score - iterations[i - 1].score
    }
    return d
  }, [iterations])

  return (
    <TooltipProvider>
      <div className={cn("space-y-4 p-4", className)}>

        {/* ===== Hero Section: Gauge + Meta ===== */}
        <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          <div className="flex flex-col items-center gap-0 px-6 pt-6 pb-4 md:flex-row md:items-start md:gap-8">

            {/* Left: Radial Gauge */}
            <div className="shrink-0">
              <RadialGauge score={latestScore} threshold={qualityThreshold} size={200} />
            </div>

            {/* Right: Meta info + actions */}
            <div className="flex-1 min-w-0 flex flex-col gap-4 py-2 w-full">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="uppercase tracking-widest font-medium">Evaluator-Optimizer Loop</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight truncate">{taskDescription}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Target className="h-3.5 w-3.5" />
                    <span>Threshold: <span className="font-semibold text-foreground">{qualityThreshold}</span></span>
                  </div>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="text-xs text-muted-foreground">
                    Iteration <span className="font-semibold text-foreground">{currentIteration}</span> of {maxIterations}
                  </span>
                  {latestScore >= qualityThreshold ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Threshold met
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      {qualityThreshold - latestScore} pts to go
                    </Badge>
                  )}
                </div>
              </div>

              {/* Score delta summary */}
              {iterations.length >= 2 && (
                <div className="flex items-center gap-4">
                  {(() => {
                    const totalDelta = iterations[iterations.length - 1].score - iterations[0].score
                    const isUp = totalDelta >= 0
                    return (
                      <div className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold",
                        isUp
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      )}>
                        {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span style={{ fontFeatureSettings: "'tnum'" }}>
                          {isUp ? "+" : ""}{totalDelta} pts
                        </span>
                        <span className="text-xs font-normal opacity-70">total improvement</span>
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      className="h-8 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      onClick={onRunNext}
                      disabled={isRunning || hasPassed || currentIteration >= maxIterations}
                    >
                      {isRunning ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Play className="mr-1.5 h-3.5 w-3.5" />
                      )}
                      Run next
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Generate and evaluate the next iteration</TooltipContent>
                </Tooltip>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={onAccept}
                  disabled={iterations.length === 0}
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Accept
                </Button>
                <Button size="sm" variant="ghost" className="h-8" onClick={onReset}>
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Reset
                </Button>
                <button
                  className="ml-auto text-xs text-blue-600 hover:underline dark:text-blue-400"
                  onClick={() => onAdjustThreshold?.(qualityThreshold)}
                >
                  Adjust threshold
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Convergence Chart ===== */}
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Score Convergence
            </h3>
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
              {scores.length} iteration{scores.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="h-36">
            {scores.length > 0 ? (
              <ConvergenceChart scores={scores} threshold={qualityThreshold} />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* ===== Criteria Bar Chart (latest iteration) ===== */}
        {iterations.length > 0 && (
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Evaluation Criteria</h3>
              <Badge variant="outline" className="text-[11px]">
                Iteration #{iterations[iterations.length - 1].number}
              </Badge>
            </div>
            <CriteriaBarChart criteria={iterations[iterations.length - 1].criteria} />
          </div>
        )}

        {/* ===== Iteration Timeline (Stepper) ===== */}
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Iteration Timeline</h3>

          {iterations.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No iterations yet. Click &quot;Run next&quot; to start the evaluator-optimizer loop.
            </div>
          ) : (
            <div className="relative">
              {iterations.map((iter, idx) => {
                const cfg = statusConfig[iter.status]
                const Icon = cfg.icon
                const isExpanded = expandedId === iter.id
                const isLast = idx === iterations.length - 1
                const delta = deltas[iter.id]

                return (
                  <div key={iter.id} className="relative flex gap-4">
                    {/* Stepper line + circle */}
                    <div className="flex flex-col items-center shrink-0 w-8">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : iter.id)}
                        className={cn(
                          "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                          iter.status === "passed"
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                            : iter.status === "in-progress"
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                              : "border-muted-foreground/30 bg-muted/40",
                          isExpanded && "ring-4 ring-blue-500/10"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            iter.status === "passed"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : iter.status === "in-progress"
                                ? "text-blue-600 dark:text-blue-400 animate-spin"
                                : "text-muted-foreground"
                          )}
                        />
                      </button>
                      {!isLast && (
                        <div className="w-0.5 flex-1 bg-border" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={cn("flex-1 min-w-0 pb-6", isLast && "pb-0")}>
                      {/* Title row */}
                      <button
                        className="flex w-full items-center gap-2 text-left group"
                        onClick={() => setExpandedId(isExpanded ? null : iter.id)}
                      >
                        <span className="text-xs font-bold text-muted-foreground">
                          #{iter.number}
                        </span>
                        <span className="flex-1 min-w-0 truncate text-sm font-medium group-hover:text-blue-600 transition-colors">
                          {iter.output}
                        </span>

                        {/* Score + delta */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="text-sm font-bold"
                            style={{ fontFeatureSettings: "'tnum'" }}
                          >
                            {iter.score}
                          </span>
                          {delta !== undefined && (
                            <span
                              className={cn(
                                "flex items-center gap-0.5 text-[11px] font-semibold rounded-full px-1.5 py-0.5",
                                delta > 0
                                  ? "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30"
                                  : delta < 0
                                    ? "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                                    : "text-muted-foreground bg-muted"
                              )}
                              style={{ fontFeatureSettings: "'tnum'" }}
                            >
                              {delta > 0 ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : delta < 0 ? (
                                <ArrowDown className="h-3 w-3" />
                              ) : null}
                              {delta > 0 ? "+" : ""}{delta}
                            </span>
                          )}
                          <Badge className={cn("shrink-0", cfg.cls)}>
                            {cfg.label}
                          </Badge>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-3 space-y-4 rounded-xl border bg-muted/20 p-4">
                          {/* Generator output */}
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                              Generator output
                            </p>
                            <div className="rounded-lg border border-dashed bg-background px-3 py-2 text-sm font-medium">
                              {iter.output}
                            </div>
                          </div>

                          {/* Criteria bar chart */}
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                              Evaluation criteria
                            </p>
                            <CriteriaBarChart criteria={iter.criteria} />
                          </div>

                          {/* Feedback callout */}
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                              Evaluator feedback
                            </p>
                            <div
                              className={cn(
                                "relative rounded-lg px-4 py-3 text-sm leading-relaxed",
                                "border-l-4",
                                iter.status === "passed"
                                  ? "border-l-emerald-500 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-900/10 dark:text-emerald-200"
                                  : iter.status === "in-progress"
                                    ? "border-l-blue-500 bg-blue-50/50 text-blue-900 dark:bg-blue-900/10 dark:text-blue-200"
                                    : "border-l-amber-500 bg-amber-50/50 text-amber-900 dark:bg-amber-900/10 dark:text-amber-200"
                              )}
                            >
                              <MessageSquare className="absolute top-3 right-3 h-4 w-4 opacity-20" />
                              {iter.feedback}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentEvaluator.displayName = "AgentEvaluator"
