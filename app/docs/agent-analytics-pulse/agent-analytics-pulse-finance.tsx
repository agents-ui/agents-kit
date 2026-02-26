"use client"

import { AgentAnalyticsPulse, type PulseMetric, type AttributionSlice, type InsightHighlight } from "@/components/agents-ui/agent-analytics-pulse"

const financeMetrics: PulseMetric[] = [
  { label: "Net revenue retention", value: "118%", change: "+4.2 pts", positive: true },
  { label: "Gross margin", value: "72.4%", change: "+1.8 pts", positive: true },
  { label: "OpEx coverage", value: "6.2 mo", change: "+0.4 mo", positive: true },
]

const financeAttribution: AttributionSlice[] = [
  { channel: "Upsell agents", value: 44, color: "#2563eb" },
  { channel: "Pricing experiments", value: 26, color: "#7c3aed" },
  { channel: "Expansion playbooks", value: 18, color: "#0ea5e9" },
  { channel: "Other", value: 12, color: "#16a34a" },
]

const financeHighlights: InsightHighlight[] = [
  {
    id: "fin-1",
    title: "Agents contributed $1.4M incremental ARR",
    detail: "Finance automation identified high-LTV accounts and coordinated outreach across CSM + marketing",
    impact: "high",
  },
  {
    id: "fin-2",
    title: "Churn trending below 3%",
    detail: "Agent-led renewal prep flagged 86 at-risk customers and mitigated 71 of them",
    impact: "medium",
  },
]

export default function AgentAnalyticsPulseFinance() {
  return (
    <AgentAnalyticsPulse
      title="Revenue analytics pulse"
      timeframe="Quarter to date"
      metrics={financeMetrics}
      trendSeries={[112, 113, 114, 116, 118, 120, 123]}
      attribution={financeAttribution}
      highlights={financeHighlights}
      segmentFilter="Enterprise"
      onDrilldown={() => console.log("open finance drilldown")}
    />
  )
}
