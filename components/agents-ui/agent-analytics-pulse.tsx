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

export { AgentAnalyticsPulse } from "./application/analytics-pulse/agent-analytics-pulse"
