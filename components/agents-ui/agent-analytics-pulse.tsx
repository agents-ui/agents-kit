"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Lightbulb, PieChart, Target } from "lucide-react"

export interface PulseMetric {
  label: string
  value: string
  change: string
  positive?: boolean
}

export interface AttributionSlice {
  channel: string
  value: number
  color?: string
}

export interface InsightHighlight {
  id: string
  title: string
  detail: string
  impact: "high" | "medium" | "low"
}

export interface AgentAnalyticsPulseProps {
  title?: string
  timeframe?: string
  metrics?: PulseMetric[]
  trendSeries?: number[]
  attribution?: AttributionSlice[]
  highlights?: InsightHighlight[]
  segmentFilter?: string
  onSegmentChange?: (segment: string) => void
  onDrilldown?: () => void
  className?: string
}

const segmentOptions = ["All", "Enterprise", "Growth", "Self-serve"]

const defaultMetrics: PulseMetric[] = [
  { label: "Active users", value: "148k", change: "+5.1%", positive: true },
  { label: "Activation rate", value: "42.7%", change: "+3.4%", positive: true },
  { label: "Churn", value: "3.2%", change: "-0.6%", positive: true },
]

const defaultTrend = [62, 64, 66, 70, 74, 78, 81]

const defaultAttribution: AttributionSlice[] = [
  { channel: "Agents", value: 38, color: "#2563eb" },
  { channel: "Lifecycle", value: 24, color: "#0ea5e9" },
  { channel: "Paid", value: 18, color: "#7c3aed" },
  { channel: "Organic", value: 14, color: "#16a34a" },
  { channel: "Other", value: 6, color: "#eab308" },
]

const defaultHighlights: InsightHighlight[] = [
  {
    id: "insight-1",
    title: "Agents drive 38% of new ARR",
    detail: "Upsell agent closed 61 deals with 82% win rate vs control routes at 55%",
    impact: "high",
  },
  {
    id: "insight-2",
    title: "Activation spike from workflows",
    detail: "Workflow automation beta improved activation by +6.4 pts for Growth segment",
    impact: "medium",
  },
]

export function AgentAnalyticsPulse({
  title = "Growth analytics pulse",
  timeframe = "Last 30 days",
  metrics = defaultMetrics,
  trendSeries = defaultTrend,
  attribution = defaultAttribution,
  highlights = defaultHighlights,
  segmentFilter = "All",
  onSegmentChange,
  onDrilldown,
  className,
}: AgentAnalyticsPulseProps) {
  const [activeSegment, setActiveSegment] = React.useState(segmentFilter)
  const [hoveredTrendIndex, setHoveredTrendIndex] = React.useState<number | null>(null)
  const [hoveredSlice, setHoveredSlice] = React.useState<string | null>(null)

  React.useEffect(() => {
    setActiveSegment(segmentFilter)
  }, [segmentFilter])

  const totalAttribution = attribution.reduce((sum, slice) => sum + slice.value, 0) || 1
  const trendMin = Math.min(...trendSeries)
  const trendMax = Math.max(...trendSeries)

  const pathD = trendSeries
    .map((value, index) => {
      const x = (index / (trendSeries.length - 1)) * 100
      const y = 60 - ((value - trendMin) / (trendMax - trendMin || 1)) * 50
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(" ")

  const handleSegmentChange = (segment: string) => {
    setActiveSegment(segment)
    onSegmentChange?.(segment)
  }

  return (
    <TooltipProvider>
      <div className={cn("space-y-4 p-4", className)}>
        <div className="flex flex-col gap-3 rounded-xl border bg-background p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              {timeframe}
            </div>
            <div className="flex items-end gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
              <Badge variant="outline">Segment · {activeSegment}</Badge>
            </div>
          </div>
          <Tabs value={activeSegment} onValueChange={handleSegmentChange}>
            <TabsList className="h-9 flex-nowrap overflow-x-auto">
              {segmentOptions.map((segment) => (
                <TabsTrigger key={segment} value={segment} className="whitespace-nowrap">
                  {segment}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.5fr,1fr]">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border bg-background p-3 shadow-sm">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-semibold">{metric.value}</span>
                    <span className={cn("text-xs font-medium", metric.positive === false ? "text-red-500" : "text-emerald-600")}>{metric.change}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">Engagement trend</p>
                  <p className="text-muted-foreground">Agent-assisted outcomes vs. baseline</p>
                </div>
                <Button variant="outline" size="sm" className="h-8" onClick={onDrilldown}>
                  Open drilldown
                </Button>
              </div>
              <svg viewBox="0 0 100 60" className="mt-4 h-36 w-full">
                <path d={`${pathD} L 100 60 L 0 60 Z`} fill="rgba(99,102,241,0.16)" />
                <path d={pathD} fill="none" stroke="#6366f1" strokeWidth={2.5} strokeLinecap="round" />
                {trendSeries.map((value, index) => {
                  const x = (index / (trendSeries.length - 1)) * 100
                  const y = 60 - ((value - trendMin) / (trendMax - trendMin || 1)) * 50
                  const isActive = hoveredTrendIndex === index
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r={isActive ? 2.4 : 1.6}
                      fill={isActive ? "#312e81" : "#4f46e5"}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredTrendIndex(index)}
                      onMouseLeave={() => setHoveredTrendIndex(null)}
                    />
                  )
                })}
              </svg>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {hoveredTrendIndex != null
                    ? `Point ${hoveredTrendIndex + 1}`
                    : "Lift vs. control"}
                </span>
                <span className="font-medium text-foreground">
                  {hoveredTrendIndex != null
                    ? `${trendSeries[hoveredTrendIndex]} pts`
                    : "+9.3 pts"}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <PieChart className="h-4 w-4" /> Attribution
                </p>
                <span className="text-xs text-muted-foreground">Breakdown of lift drivers</span>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="h-32 w-32">
                  <circle cx="60" cy="60" r="42" fill="#f4f4f5" />
                  {(() => {
                    let cumulative = 0
                    return attribution.map((slice, index) => {
                      const portion = slice.value / totalAttribution
                      const startAngle = cumulative * 2 * Math.PI - Math.PI / 2
                      cumulative += portion
                      const endAngle = cumulative * 2 * Math.PI - Math.PI / 2
                      const largeArc = portion > 0.5 ? 1 : 0
                      const x1 = 60 + 42 * Math.cos(startAngle)
                      const y1 = 60 + 42 * Math.sin(startAngle)
                      const x2 = 60 + 42 * Math.cos(endAngle)
                      const y2 = 60 + 42 * Math.sin(endAngle)
                      const pathData = `M 60 60 L ${x1} ${y1} A 42 42 0 ${largeArc} 1 ${x2} ${y2} Z`
                      const isHovered = hoveredSlice === slice.channel
                      return (
                        <path
                          key={slice.channel + index}
                          d={pathData}
                          fill={slice.color ?? "#2563eb"}
                          opacity={isHovered ? 1 : 0.9 - index * 0.1}
                          className="cursor-pointer transition-opacity"
                          onMouseEnter={() => setHoveredSlice(slice.channel)}
                          onMouseLeave={() => setHoveredSlice(null)}
                        />
                      )
                    })
                  })()}
                </svg>
              </div>
              <div className="space-y-2 text-xs">
                {attribution.map((slice) => (
                  <div
                    key={slice.channel}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2 py-1 transition-colors",
                      hoveredSlice === slice.channel && "bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: slice.color ?? "#2563eb" }}
                      />
                      {slice.channel}
                    </span>
                    <span className="font-medium text-foreground">{slice.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-background p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-amber-500" /> Highlights
              </div>
              <div className="mt-3 space-y-3">
                {highlights.map((insight) => (
                  <div key={insight.id} className="rounded-lg border border-dashed p-3">
                    <div className="flex items-center justify-between text-sm font-medium text-foreground">
                      {insight.title}
                      <Badge
                        variant="outline"
                        className={cn(
                          insight.impact === "high" && "border-amber-400 text-amber-600",
                          insight.impact === "medium" && "border-blue-300 text-blue-500",
                          insight.impact === "low" && "border-slate-300 text-slate-500"
                        )}
                      >
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{insight.detail}</p>
                  </div>
                ))}
                {highlights.length === 0 && (
                  <p className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
                    No highlights generated yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentAnalyticsPulse.displayName = "AgentAnalyticsPulse"
