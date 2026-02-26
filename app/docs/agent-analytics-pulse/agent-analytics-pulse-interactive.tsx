"use client"

import { useState } from "react"
import { AgentAnalyticsPulse, type PulseMetric, type AttributionSlice, type InsightHighlight } from "@/components/agents-ui/agent-analytics-pulse"

const metricsBySegment: Record<string, PulseMetric[]> = {
  All: [
    { label: "Active users", value: "148k", change: "+5.1%", positive: true },
    { label: "Activation rate", value: "42.7%", change: "+3.4%", positive: true },
    { label: "Churn", value: "3.2%", change: "-0.6%", positive: true },
  ],
  Enterprise: [
    { label: "Accounts", value: "420", change: "+2.4%", positive: true },
    { label: "Adoption", value: "78.1%", change: "+5.6%", positive: true },
    { label: "Expansion", value: "$580k", change: "+18%", positive: true },
  ],
  Growth: [
    { label: "Active users", value: "52k", change: "+7.1%", positive: true },
    { label: "Onboarding", value: "36.4%", change: "+4.9%", positive: true },
    { label: "Churn", value: "2.1%", change: "-0.3%", positive: true },
  ],
  "Self-serve": [
    { label: "Signups", value: "18k", change: "+11.2%", positive: true },
    { label: "Conversion", value: "9.4%", change: "+1.2%", positive: true },
    { label: "Support tickets", value: "612", change: "-13%", positive: true },
  ],
}

const attributionBySegment: Record<string, AttributionSlice[]> = {
  All: [
    { channel: "Agents", value: 38, color: "#2563eb" },
    { channel: "Lifecycle", value: 24, color: "#0ea5e9" },
    { channel: "Paid", value: 18, color: "#7c3aed" },
    { channel: "Organic", value: 14, color: "#16a34a" },
    { channel: "Other", value: 6, color: "#eab308" },
  ],
  Enterprise: [
    { channel: "Agents", value: 52, color: "#2563eb" },
    { channel: "CSM", value: 26, color: "#7c3aed" },
    { channel: "Events", value: 12, color: "#0ea5e9" },
    { channel: "Other", value: 10, color: "#eab308" },
  ],
  Growth: [
    { channel: "Agents", value: 33, color: "#2563eb" },
    { channel: "Lifecycle", value: 31, color: "#0ea5e9" },
    { channel: "Paid", value: 24, color: "#7c3aed" },
    { channel: "Community", value: 12, color: "#16a34a" },
  ],
  "Self-serve": [
    { channel: "Lifecycle", value: 42, color: "#0ea5e9" },
    { channel: "Product-led", value: 28, color: "#2563eb" },
    { channel: "SEO", value: 20, color: "#16a34a" },
    { channel: "Other", value: 10, color: "#eab308" },
  ],
}

const highlightsBySegment: Record<string, InsightHighlight[]> = {
  All: [
    {
      id: "insight-1",
      title: "Agents drive 38% of new ARR",
      detail: "Upsell agent closed 61 deals with 82% win rate vs control routes at 55%",
      impact: "high",
    },
  ],
  Enterprise: [
    {
      id: "ent-1",
      title: "Automation saves CSM 12h/week",
      detail: "Agent-led QBR prep removed 14 manual steps per account",
      impact: "high",
    },
    {
      id: "ent-2",
      title: "Adoption lift from workflow library",
      detail: "Library usage correlates with +9pts activation",
      impact: "medium",
    },
  ],
  Growth: [
    {
      id: "gr-1",
      title: "Conversion uplift in onboarding experiments",
      detail: "Agent-optimized tours increased conversion by +3.8 pts",
      impact: "high",
    },
  ],
  "Self-serve": [
    {
      id: "ss-1",
      title: "Lifecycle triggers outperform paid",
      detail: "Emails curated by AI drive 2.1x retention compared to ads",
      impact: "medium",
    },
  ],
}

export default function AgentAnalyticsPulseInteractive() {
  const [segment, setSegment] = useState("All")

  return (
    <AgentAnalyticsPulse
      title="Growth analytics pulse"
      timeframe="Last 30 days"
      metrics={metricsBySegment[segment]}
      trendSeries={[62, 64, 68, 72, 78, 81, 86]}
      attribution={attributionBySegment[segment]}
      highlights={highlightsBySegment[segment]}
      segmentFilter={segment}
      onSegmentChange={setSegment}
      onDrilldown={() => console.log("open drilldown for", segment)}
    />
  )
}
