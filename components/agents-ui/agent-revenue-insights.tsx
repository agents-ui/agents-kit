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

export { AgentRevenueInsights } from "./application/revenue-insights/agent-revenue-insights"
