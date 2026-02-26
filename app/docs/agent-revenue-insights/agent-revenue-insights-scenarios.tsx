"use client"

import { useState } from "react"
import { AgentRevenueInsights, type RevenueForecastPoint, type RevenueSegmentInsight } from "@/components/agents-ui/agent-revenue-insights"

const baseForecast: RevenueForecastPoint[] = [
  { label: "Jan", value: 9.8 },
  { label: "Feb", value: 10.1 },
  { label: "Mar", value: 10.5 },
  { label: "Apr", value: 11.1 },
  { label: "May", value: 11.7 },
  { label: "Jun", value: 12.4 },
]

const stretchForecast: RevenueForecastPoint[] = [
  { label: "Jan", value: 9.8 },
  { label: "Feb", value: 10.4 },
  { label: "Mar", value: 11.2 },
  { label: "Apr", value: 12.4 },
  { label: "May", value: 13.5 },
  { label: "Jun", value: 14.8 },
]

const conservativeForecast: RevenueForecastPoint[] = [
  { label: "Jan", value: 9.8 },
  { label: "Feb", value: 9.9 },
  { label: "Mar", value: 10.1 },
  { label: "Apr", value: 10.3 },
  { label: "May", value: 10.6 },
  { label: "Jun", value: 10.9 },
]

const enterpriseSegments: RevenueSegmentInsight[] = [
  {
    id: "ent-us",
    segment: "Enterprise · US",
    arr: "$5.6M",
    trend: "up",
    change: "+16% QoQ",
    confidence: 0.88,
    owner: "Jordan Lee",
  },
  {
    id: "ent-emea",
    segment: "Enterprise · EMEA",
    arr: "$3.1M",
    trend: "up",
    change: "+9% QoQ",
    confidence: 0.8,
    owner: "Marta Rossi",
  },
  {
    id: "ent-apac",
    segment: "Enterprise · APAC",
    arr: "$2.8M",
    trend: "flat",
    change: "+1% QoQ",
    confidence: 0.7,
    owner: "Hiro Tanaka",
  },
]

export default function AgentRevenueInsightsScenarios() {
  const [scenario, setScenario] = useState<"base" | "stretch" | "conservative">("base")

  const forecastByScenario = {
    base: baseForecast,
    stretch: stretchForecast,
    conservative: conservativeForecast,
  }

  return (
    <AgentRevenueInsights
      currentArr="$13.9M"
      arrChange={scenario === "stretch" ? "+12.4%" : scenario === "conservative" ? "+4.1%" : "+8.6%"}
      periodLabel="Enterprise ARR forecast"
      scenario={scenario}
      forecastPoints={forecastByScenario[scenario]}
      segmentInsights={enterpriseSegments}
      onScenarioChange={setScenario}
      onSegmentClick={(segment) => console.log("open segment", segment.id)}
      onRefresh={() => console.log("refresh revenue data")}
    />
  )
}
