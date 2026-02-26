"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Database,
  Download,
  FileText,
  Loader2,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  GitBranch,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// Progress available but using custom gradient bars for this layout
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface DataMetric {
  label: string
  value: string
  change: string
  changeDirection: "up" | "down" | "neutral"
}

export interface DataPreview {
  headers: string[]
  rows: string[][]
}

export interface DataInsight {
  id: string
  title: string
  description: string
  confidence: number
  category: "trend" | "anomaly" | "correlation" | "recommendation"
}

export interface DistributionBar {
  label: string
  value: number
  maxValue: number
  color: string
}

export interface AgentDataAnalysisProps {
  datasetName?: string
  description?: string
  rowCount?: number
  columnCount?: number
  metrics?: DataMetric[]
  dataPreview?: DataPreview
  insights?: DataInsight[]
  distribution?: DistributionBar[]
  isAnalyzing?: boolean
  onExport?: () => void
  onDeeperAnalysis?: () => void
  onAskFollowUp?: () => void
  onDownload?: () => void
  className?: string
}

/* ---------- tiny inline SVG helpers ---------- */

function Sparkline({
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
  const w = 80
  const h = 28
  const pad = 2
  const points = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2)
      const y = h - pad - ((v - min) / range) * (h - pad * 2)
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      className={cn("w-20 h-7", className)}
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
        points={`${pad},${h} ${points} ${w - pad},${h}`}
        fill={color}
        fillOpacity="0.08"
      />
    </svg>
  )
}

function DonutChart({
  value,
  max,
  color = "#3b82f6",
  size = 56,
}: {
  value: number
  max: number
  color?: string
  size?: number
}) {
  const pct = Math.min(value / max, 1)
  const r = 22
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference * (1 - pct)

  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className="shrink-0">
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        className="text-muted/40"
      />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 28 28)"
        className="transition-all duration-700"
      />
      <text
        x="28"
        y="30"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-foreground text-[10px] font-semibold"
        style={{ fontFamily: "var(--font-sans, system-ui)" }}
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  )
}

/* ---------- style maps ---------- */

const categoryIcon: Record<DataInsight["category"], React.ReactNode> = {
  trend: <TrendingUp className="h-3.5 w-3.5" />,
  anomaly: <AlertTriangle className="h-3.5 w-3.5" />,
  correlation: <GitBranch className="h-3.5 w-3.5" />,
  recommendation: <Lightbulb className="h-3.5 w-3.5" />,
}

const categoryStyle: Record<DataInsight["category"], string> = {
  trend:
    "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50",
  anomaly:
    "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50",
  correlation:
    "bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-950/40 dark:text-slate-300 dark:border-slate-900/50",
  recommendation:
    "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50",
}

const impactShadow = (confidence: number) => {
  if (confidence >= 85) return "shadow-sm"
  if (confidence >= 70) return "shadow-sm"
  return "shadow-sm"
}

/* ---------- distribution gradient map ---------- */

const distColors = [
  "bg-blue-500",
  "bg-sky-500",
  "bg-zinc-500",
  "bg-emerald-500",
  "bg-amber-500",
]

/* ---------- main component ---------- */

export function AgentDataAnalysis({
  datasetName: nameProp,
  description: descProp,
  rowCount: rowsProp,
  columnCount: colsProp,
  metrics: metricsProp,
  dataPreview: previewProp,
  insights: insightsProp,
  distribution: distProp,
  isAnalyzing = false,
  onExport,
  onDeeperAnalysis,
  onAskFollowUp,
  onDownload,
  className,
}: AgentDataAnalysisProps) {
  const defaults = React.useMemo(
    () => ({
      datasetName: "E-commerce Sales Q4 2024",
      description:
        "Transactional data across all channels for Oct-Dec 2024",
      rowCount: 48572,
      columnCount: 23,
      metrics: [
        {
          label: "Revenue",
          value: "$2.4M",
          change: "+12.3%",
          changeDirection: "up" as const,
        },
        {
          label: "Orders",
          value: "18,429",
          change: "+8.1%",
          changeDirection: "up" as const,
        },
        {
          label: "AOV",
          value: "$130.22",
          change: "-2.4%",
          changeDirection: "down" as const,
        },
        {
          label: "Conversion",
          value: "3.8%",
          change: "+0.5%",
          changeDirection: "up" as const,
        },
      ],
      dataPreview: {
        headers: ["Order ID", "Date", "Channel", "Revenue", "Status"],
        rows: [
          ["#10421", "2024-12-01", "Web", "$142.50", "Completed"],
          ["#10422", "2024-12-01", "Mobile", "$89.00", "Completed"],
          ["#10423", "2024-12-02", "Web", "$215.30", "Refunded"],
          ["#10424", "2024-12-02", "In-store", "$67.80", "Completed"],
          ["#10425", "2024-12-03", "Mobile", "$178.90", "Completed"],
        ],
      },
      insights: [
        {
          id: "i1",
          title: "Revenue spike on weekends",
          description:
            "Weekend revenue is 34% higher than weekdays, driven by mobile channel promotions.",
          confidence: 92,
          category: "trend" as const,
        },
        {
          id: "i2",
          title: "Unusual refund cluster",
          description:
            "Refund rate jumped to 8.2% in the second week of December, concentrated in electronics category.",
          confidence: 87,
          category: "anomaly" as const,
        },
        {
          id: "i3",
          title: "AOV correlates with free shipping",
          description:
            "Orders with free shipping threshold have 22% higher AOV compared to standard orders.",
          confidence: 78,
          category: "correlation" as const,
        },
        {
          id: "i4",
          title: "Optimize mobile checkout",
          description:
            "Mobile cart abandonment is 18% higher than web. Simplifying checkout could recover ~$180K.",
          confidence: 84,
          category: "recommendation" as const,
        },
      ],
      distribution: [
        {
          label: "Electronics",
          value: 820000,
          maxValue: 1000000,
          color: "#2563eb",
        },
        {
          label: "Apparel",
          value: 640000,
          maxValue: 1000000,
          color: "#0ea5e9",
        },
        {
          label: "Home & Garden",
          value: 480000,
          maxValue: 1000000,
          color: "#71717a",
        },
        {
          label: "Sports",
          value: 310000,
          maxValue: 1000000,
          color: "#16a34a",
        },
        {
          label: "Books",
          value: 150000,
          maxValue: 1000000,
          color: "#eab308",
        },
      ],
    }),
    []
  )

  const datasetName = nameProp ?? defaults.datasetName
  const description = descProp ?? defaults.description
  const rowCount = rowsProp ?? defaults.rowCount
  const columnCount = colsProp ?? defaults.columnCount
  const metrics = metricsProp ?? defaults.metrics
  const dataPreview = previewProp ?? defaults.dataPreview
  const insights = insightsProp ?? defaults.insights
  const distribution = distProp ?? defaults.distribution

  /* sparkline mock data per metric index */
  const sparkData = React.useMemo(
    () => [
      [32, 44, 38, 52, 48, 62, 58],
      [20, 28, 25, 35, 40, 38, 45],
      [55, 52, 48, 50, 46, 44, 42],
      [18, 22, 20, 26, 30, 28, 34],
    ],
    []
  )

  const sparkColors = ["#3b82f6", "#64748b", "#f59e0b", "#10b981"]

  const metricBgColors = [
    "bg-blue-50/50 dark:bg-blue-950/20",
    "bg-slate-50/50 dark:bg-slate-950/20",
    "bg-amber-50/50 dark:bg-amber-950/20",
    "bg-emerald-50/50 dark:bg-emerald-950/20",
  ]

  const metricRingColors = [
    "ring-blue-500/10",
    "ring-slate-500/10",
    "ring-amber-500/10",
    "ring-emerald-500/10",
  ]

  const changeIcon = (dir: DataMetric["changeDirection"]) => {
    if (dir === "up") return <ArrowUp className="h-3 w-3 text-emerald-600" />
    if (dir === "down") return <ArrowDown className="h-3 w-3 text-red-500" />
    return <ArrowRight className="h-3 w-3 text-muted-foreground" />
  }

  const changeBadgeStyle = (dir: DataMetric["changeDirection"]) => {
    if (dir === "up")
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50"
    if (dir === "down")
      return "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/50"
    return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-700/50"
  }

  /* total distribution for donut */
  const totalDist = distribution.reduce((s, d) => s + d.value, 0)

  /* missing data percentage (simulated) */
  const missingPct = 2.3

  return (
    <TooltipProvider>
      <div className={cn("space-y-3 p-4", className)}>
        {/* ========== HEADER ========== */}
        <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-600 text-white">
                <Database className="h-3 w-3" />
              </div>
              Data Analysis Agent
            </div>
            <h2 className="text-lg font-semibold tracking-tight truncate">
              {datasetName}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Badge
              variant="outline"
              className="font-mono tabular-nums text-xs"
            >
              {rowCount.toLocaleString()} rows
            </Badge>
            <Badge
              variant="outline"
              className="font-mono tabular-nums text-xs"
            >
              {columnCount} cols
            </Badge>
            <Badge
              className={cn(
                "text-xs",
                isAnalyzing
                  ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
              )}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />{" "}
                  Analyzing
                </>
              ) : (
                <>
                  <Zap className="mr-1 h-3 w-3" />
                  Complete
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* ========== BENTO GRID ========== */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto]">
          {/* ---------- ROW 1: Large metric (2 cols) + Data preview (2 cols) ---------- */}

          {/* Primary metric - large card */}
          <div
            className={cn(
              "col-span-1 sm:col-span-2 rounded-2xl border p-5 shadow-sm ring-1",
              metricBgColors[0],
              metricRingColors[0]
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {metrics[0]?.label ?? "Revenue"}
                </p>
                <p className="text-3xl font-bold tracking-tight tabular-nums">
                  {metrics[0]?.value ?? "--"}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums",
                      changeBadgeStyle(
                        metrics[0]?.changeDirection ?? "neutral"
                      )
                    )}
                  >
                    {changeIcon(metrics[0]?.changeDirection ?? "neutral")}
                    {metrics[0]?.change ?? "--"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    vs prev. period
                  </span>
                </div>
              </div>
              <Sparkline
                data={sparkData[0]}
                color={sparkColors[0]}
                className="w-28 h-10 opacity-80"
              />
            </div>
            {/* secondary metrics row */}
            {metrics.length > 1 && (
              <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-3 gap-3">
                {metrics.slice(1, 4).map((m, idx) => (
                  <div key={m.label} className="space-y-0.5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">
                      {m.label}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-semibold tabular-nums">
                        {m.value}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 text-[10px] font-semibold tabular-nums",
                          m.changeDirection === "up"
                            ? "text-emerald-600"
                            : m.changeDirection === "down"
                            ? "text-red-500"
                            : "text-muted-foreground"
                        )}
                      >
                        {changeIcon(m.changeDirection)}
                        {m.change}
                      </span>
                    </div>
                    <Sparkline
                      data={sparkData[(idx + 1) % sparkData.length]}
                      color={sparkColors[(idx + 1) % sparkColors.length]}
                      className="w-full h-4 mt-0.5 opacity-60"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Data preview mini-table */}
          <div className="col-span-1 sm:col-span-2 rounded-2xl border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                Data Preview
              </div>
              <Badge
                variant="outline"
                className="text-[10px] tabular-nums"
              >
                {dataPreview.rows.length} of {rowCount.toLocaleString()}
              </Badge>
            </div>
            <ScrollArea className="h-[156px]">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b bg-muted/50 backdrop-blur-sm">
                    {dataPreview.headers.map((h) => (
                      <th
                        key={h}
                        className="pb-2 pt-1 pr-4 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataPreview.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      className="border-b last:border-0 hover:bg-blue-50/50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={cn(
                            "py-2 pr-4 tabular-nums",
                            ci === 0
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {ci === row.length - 1 ? (
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium border",
                                cell === "Completed"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/40"
                                  : cell === "Refunded"
                                  ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/40"
                                  : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                              )}
                            >
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>

          {/* ---------- ROW 2: Donut (1 col) + Distribution (2 cols) + Trend card (1 col) ---------- */}

          {/* Donut chart card */}
          <div
            className={cn(
              "col-span-1 rounded-2xl border p-4 shadow-sm ring-1 flex flex-col items-center justify-center gap-2",
              "bg-amber-50/50 dark:bg-amber-950/20 ring-amber-500/10"
            )}
          >
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Data Quality
            </p>
            <DonutChart
              value={100 - missingPct}
              max={100}
              color="#f59e0b"
              size={64}
            />
            <div className="text-center space-y-0.5">
              <p className="text-xs font-semibold tabular-nums">
                {missingPct}% missing
              </p>
              <p className="text-[10px] text-muted-foreground">
                across {columnCount} columns
              </p>
            </div>
          </div>

          {/* Distribution bars */}
          <div className="col-span-1 sm:col-span-2 rounded-2xl border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
                Revenue by Category
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                Total ${(totalDist / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="space-y-2.5">
              {distribution.map((d, i) => {
                const pct = (d.value / d.maxValue) * 100
                return (
                  <div key={d.label} className="group space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">
                        {d.label}
                      </span>
                      <span className="font-semibold tabular-nums text-muted-foreground group-hover:text-foreground transition-colors">
                        ${(d.value / 1000).toFixed(0)}K
                        <span className="text-[10px] ml-1 text-muted-foreground">
                          ({pct.toFixed(0)}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/60">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          distColors[i % distColors.length]
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Trend card */}
          <div
            className={cn(
              "col-span-1 rounded-2xl border p-4 shadow-sm ring-1 flex flex-col justify-between",
              "bg-emerald-50/50 dark:bg-emerald-950/20 ring-emerald-500/10"
            )}
          >
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Trend
              </p>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                  +12.3%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Revenue trending upward over the last 7 periods
              </p>
            </div>
            <Sparkline
              data={[28, 35, 32, 42, 48, 45, 58]}
              color="#10b981"
              className="w-full h-8 mt-2 opacity-70"
            />
          </div>

          {/* ---------- ROW 3: Insights (4 cols) ---------- */}

          <div className="col-span-1 sm:col-span-2 lg:col-span-4 rounded-2xl border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Search className="h-3.5 w-3.5 text-zinc-500" />
                Insights
              </div>
              <Badge className="bg-zinc-50 text-zinc-700 border border-zinc-200 text-[10px] dark:bg-zinc-950/40 dark:text-zinc-300 dark:border-zinc-800/50">
                {insights.length} findings
              </Badge>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={cn(
                    "rounded-xl border p-3.5 space-y-2.5 transition-shadow hover:shadow-lg",
                    impactShadow(insight.confidence)
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={cn(
                        "flex items-center justify-center h-6 w-6 rounded-lg shrink-0",
                        categoryStyle[insight.category]
                      )}
                    >
                      {categoryIcon[insight.category]}
                    </div>
                    <Badge
                      className={cn(
                        "text-[10px] shrink-0 px-1.5 py-0",
                        categoryStyle[insight.category]
                      )}
                    >
                      {insight.category}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold leading-tight">
                      {insight.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {insight.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="flex-1 h-1.5 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          insight.confidence >= 85
                            ? "bg-blue-500"
                            : insight.confidence >= 70
                            ? "bg-sky-500"
                            : "bg-slate-400"
                        )}
                        style={{
                          width: `${insight.confidence}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                      {insight.confidence}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== ACTIONS ========== */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                className="h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium"
                onClick={onExport}
              >
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                Export insights
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export all insights as a report</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-lg text-xs font-medium"
                onClick={onDeeperAnalysis}
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Deeper analysis
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Perform advanced statistical analysis
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-lg text-xs font-medium"
                onClick={onAskFollowUp}
              >
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                Follow-up
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Ask the agent a follow-up question about the data
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 rounded-lg text-xs font-medium"
                onClick={onDownload}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download the analyzed dataset</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentDataAnalysis.displayName = "AgentDataAnalysis"
