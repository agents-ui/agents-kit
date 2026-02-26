"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ArrowUpRight, ArrowDownRight, TrendingUp, RefreshCw, CalendarClock } from "lucide-react"

export interface RevenueForecastPoint {
  label: string
  value: number
}

export interface RevenueSegmentInsight {
  id: string
  segment: string
  arr: string
  trend: "up" | "down" | "flat"
  change: string
  confidence: number
  owner?: string
}

export interface AgentRevenueInsightsProps {
  currentArr?: string
  arrChange?: string
  periodLabel?: string
  forecastPoints?: RevenueForecastPoint[]
  segmentInsights?: RevenueSegmentInsight[]
  scenario?: "base" | "stretch" | "conservative"
  onRefresh?: () => void
  onScenarioChange?: (scenario: "base" | "stretch" | "conservative") => void
  onSegmentClick?: (segment: RevenueSegmentInsight) => void
  className?: string
}

const defaultPoints: RevenueForecastPoint[] = [
  { label: "Jan", value: 9.8 },
  { label: "Feb", value: 10.4 },
  { label: "Mar", value: 11.2 },
  { label: "Apr", value: 11.8 },
  { label: "May", value: 12.4 },
  { label: "Jun", value: 13.1 },
]

const defaultSegments: RevenueSegmentInsight[] = [
  {
    id: "ent-apac",
    segment: "Enterprise · APAC",
    arr: "$4.2M",
    trend: "up",
    change: "+14% QoQ",
    confidence: 0.86,
    owner: "Ivy Chen",
  },
  {
    id: "smb-na",
    segment: "SMB · North America",
    arr: "$2.1M",
    trend: "flat",
    change: "+2% QoQ",
    confidence: 0.74,
    owner: "Miguel Santos",
  },
  {
    id: "partner-emea",
    segment: "Partner Channel · EMEA",
    arr: "$1.9M",
    trend: "up",
    change: "+11% QoQ",
    confidence: 0.81,
    owner: "Ada Mensah",
  },
]

export function AgentRevenueInsights({
  currentArr = "$12.9M",
  arrChange = "+8.4%",
  periodLabel = "Trailing 6 months",
  forecastPoints,
  segmentInsights,
  scenario = "base",
  onRefresh,
  onScenarioChange,
  onSegmentClick,
  className,
}: AgentRevenueInsightsProps) {
  const [internalScenario, setInternalScenario] = React.useState(scenario)
  const [hoveredPoint, setHoveredPoint] = React.useState<RevenueForecastPoint | null>(null)
  const [hoveredSegment, setHoveredSegment] = React.useState<string | null>(null)
  const displayScenario = scenario ?? internalScenario
  const points = forecastPoints && forecastPoints.length > 2 ? forecastPoints : defaultPoints
  const segments = segmentInsights && segmentInsights.length > 0 ? segmentInsights : defaultSegments

  React.useEffect(() => {
    setInternalScenario(scenario)
  }, [scenario])

  const minValue = Math.min(...points.map((point) => point.value))
  const maxValue = Math.max(...points.map((point) => point.value))

  const pathD = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100
      const y = 60 - ((point.value - minValue) / (maxValue - minValue || 1)) * 50
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(" ")

  const handleScenarioChange = (nextScenario: "base" | "stretch" | "conservative") => {
    setInternalScenario(nextScenario)
    onScenarioChange?.(nextScenario)
  }

  const renderTrendIcon = (trend: RevenueSegmentInsight["trend"]) => {
    if (trend === "up") {
      return <ArrowUpRight className="h-4 w-4 text-emerald-500" />
    }
    if (trend === "down") {
      return <ArrowDownRight className="h-4 w-4 text-red-500" />
    }
    return <TrendingUp className="h-4 w-4 text-blue-500" />
  }

  return (
    <TooltipProvider>
      <div className={cn("space-y-4 p-4", className)}>
        <div className="flex flex-col gap-4 rounded-xl border bg-background p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              {periodLabel}
            </div>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-semibold tracking-tight">{currentArr}</h2>
              <Badge className={cn("bg-emerald-100 text-emerald-700 border border-emerald-200")}>{arrChange}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Projected annual recurring revenue with agent-led upsell programs.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Tabs value={displayScenario} onValueChange={(value) => handleScenarioChange(value as typeof scenario)}>
              <TabsList className="h-9">
                <TabsTrigger value="conservative">Conservative</TabsTrigger>
                <TabsTrigger value="base">Base</TabsTrigger>
                <TabsTrigger value="stretch">Stretch</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" className="h-9" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh signals
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
          <div className="rounded-xl border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold">Scenario forecast</p>
                <p className="text-muted-foreground">Agent upsell + retention gains</p>
              </div>
              <Badge variant="outline">{displayScenario.charAt(0).toUpperCase() + displayScenario.slice(1)} case</Badge>
            </div>
            <svg viewBox="0 0 100 60" className="mt-6 h-40 w-full">
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${pathD} L 100 60 L 0 60 Z`} fill="url(#revenueGradient)" />
              <path d={pathD} fill="none" stroke="#2563eb" strokeWidth={2.5} strokeLinecap="round" />
              {points.map((point, index) => {
                const x = (index / (points.length - 1)) * 100
                const y = 60 - ((point.value - minValue) / (maxValue - minValue || 1)) * 50
                return (
                  <circle
                    key={point.label}
                    cx={x}
                    cy={y}
                    r={hoveredPoint?.label === point.label ? 2.6 : 1.8}
                    fill={hoveredPoint?.label === point.label ? "#1d4ed8" : "#60a5fa"}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                )
              })}
            </svg>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{hoveredPoint ? `${hoveredPoint.label}` : "Hover points for detail"}</span>
              <span className="font-medium text-foreground">
                {hoveredPoint ? `${hoveredPoint.value.toFixed(1)}M ARR` : `${points[points.length - 1]?.value.toFixed(1)}M forecast`}
              </span>
            </div>
          </div>
          <div className="space-y-3 rounded-xl border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold">Segments to watch</p>
              <Badge variant="outline">Confidence ≥ 70%</Badge>
            </div>
            <div className="space-y-3">
              {segments.map((segment) => (
                <button
                  key={segment.id}
                  type="button"
                  onClick={() => onSegmentClick?.(segment)}
                  onMouseEnter={() => setHoveredSegment(segment.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className={cn(
                    "w-full rounded-lg border border-dashed p-3 text-left transition-colors hover:border-primary/60",
                    hoveredSegment === segment.id && "border-primary/70 bg-primary/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{segment.segment}</p>
                      <p className="text-xs text-muted-foreground">Owner · {segment.owner ?? "Unassigned"}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {segment.arr}
                      {renderTrendIcon(segment.trend)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{segment.change}</span>
                    <span>Confidence: {Math.round(segment.confidence * 100)}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentRevenueInsights.displayName = "AgentRevenueInsights"
