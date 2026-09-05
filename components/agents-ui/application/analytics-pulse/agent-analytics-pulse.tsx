"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { Tab, TabList, Tabs } from "@/components/boardui/base/tabs/tabs"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import type { AgentAnalyticsPulseProps } from "../../agent-analytics-pulse"

const metricsDefault = [
  { label: "Active users", value: "148k", change: "+5.1%", positive: true },
  { label: "Activation rate", value: "42.7%", change: "+3.4%", positive: true },
  { label: "Churn", value: "3.2%", change: "-0.6%", positive: true },
]
const attributionDefault = [
  { channel: "Agents", value: 38 },
  { channel: "Lifecycle", value: 24 },
  { channel: "Paid", value: 18 },
  { channel: "Organic", value: 14 },
  { channel: "Other", value: 6 },
]
const highlightsDefault = [
  {
    id: "agents",
    title: "Agents drive 38% of new ARR",
    detail: "Upsell workflows closed 61 deals with an 82% win rate.",
    impact: "high" as const,
  },
  {
    id: "activation",
    title: "Activation improved",
    detail: "Workflow adoption increased activation in the Growth segment.",
    impact: "medium" as const,
  },
]

export function AgentAnalyticsPulse({
  title = "Growth analytics",
  timeframe = "Last 30 days",
  metrics = metricsDefault,
  trendSeries = [62, 64, 66, 70, 74, 78, 81],
  attribution = attributionDefault,
  highlights = highlightsDefault,
  segmentFilter = "All",
  onSegmentChange,
  onDrilldown,
  className,
}: AgentAnalyticsPulseProps) {
  const [segment, setSegment] = useState(segmentFilter)
  useEffect(() => setSegment(segmentFilter), [segmentFilter])
  const values = trendSeries.filter(Number.isFinite)
  const min = Math.min(...values),
    max = Math.max(...values)
  const points = values
    .map(
      (value, index) =>
        `${24 + (index / Math.max(1, values.length - 1)) * 552},${160 - ((value - min) / (max - min || 1)) * 136}`
    )
    .join(" ")
  const total = attribution.reduce((sum, item) => sum + item.value, 0) || 1
  return (
    <section
      aria-label={title}
      className={cn(
        "agent-widget border-separator-border bg-background-primary-default text-text-primary w-full min-w-0 space-y-5 rounded-xl border p-5",
        className
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-text-secondary text-xs">{timeframe}</p>
          <h2 className="mt-1 text-lg font-semibold">{title}</h2>
        </div>
        <Tabs
          selectedKey={segment}
          onSelectionChange={(key) => {
            setSegment(String(key))
            onSegmentChange?.(String(key))
          }}
        >
          <TabList
            aria-label="Audience segment"
            className="max-w-full overflow-x-auto"
          >
            {["All", "Enterprise", "Growth", "Self-serve"].map((label) => (
              <Tab key={label} id={label}>
                {label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </header>
      <dl className="border-separator-border grid gap-4 border-y py-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="text-text-secondary text-xs">{metric.label}</dt>
            <dd className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-semibold tabular-nums">
                {metric.value}
              </span>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  metric.positive === false
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-700 dark:text-green-400"
                )}
              >
                {metric.change}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-medium">Engagement trend</h3>
            {onDrilldown && (
              <Button variant="secondary" size="small" onClick={onDrilldown}>
                Open drilldown
              </Button>
            )}
          </div>
          {values.length ? (
            <svg
              role="img"
              aria-label={`Engagement values: ${values.join(", ")}`}
              viewBox="0 0 600 184"
              className="text-text-primary my-3 w-full"
            >
              <path
                d="M24 160 H576"
                fill="none"
                stroke="currentColor"
                opacity=".12"
              />
              <polyline
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {values.map((value, index) => (
                <circle
                  key={index}
                  cx={24 + (index / Math.max(1, values.length - 1)) * 552}
                  cy={160 - ((value - min) / (max - min || 1)) * 136}
                  r="3"
                  fill="currentColor"
                />
              ))}
            </svg>
          ) : (
            <p className="text-text-secondary py-8 text-sm">
              No trend data available.
            </p>
          )}
          <details className="text-text-secondary text-xs">
            <summary className="focus-visible:outline-border-focus-ring cursor-pointer rounded py-2 focus-visible:outline-2">
              View {values.length} data points
            </summary>
            <ol className="mt-2 grid grid-cols-2 gap-2 tabular-nums">
              {values.map((value, i) => (
                <li key={i}>
                  Point {i + 1}: {value}
                </li>
              ))}
            </ol>
          </details>
        </div>
        <div className="min-w-0">
          <h3 className="mb-3 text-sm font-medium">Attribution</h3>
          <ul className="space-y-3">
            {attribution.map((item) => (
              <li key={item.channel}>
                <div className="flex justify-between gap-3 text-xs">
                  <span>{item.channel}</span>
                  <span className="text-text-secondary tabular-nums">
                    {Math.round((item.value / total) * 100)}%
                  </span>
                </div>
                <div className="bg-background-secondary-default mt-1.5 h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-text-secondary h-full rounded-full"
                    style={{
                      width: `${Math.max(0, Math.min(100, (item.value / total) * 100))}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {highlights.length > 0 && (
        <section className="border-separator-border border-t pt-4">
          <h3 className="text-sm font-medium">Highlights</h3>
          <ul className="divide-separator-border mt-2 divide-y">
            {highlights.map((item) => (
              <li key={item.id} className="py-3">
                <div className="flex flex-wrap justify-between gap-2">
                  <h4 className="text-sm font-medium">{item.title}</h4>
                  <span className="text-text-secondary text-xs">
                    {item.impact} impact
                  </span>
                </div>
                <p className="text-text-secondary mt-1 text-sm leading-6">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <footer className="border-separator-border text-text-secondary border-t pt-3 text-xs">
        {segment} segment · {timeframe}
      </footer>
    </section>
  )
}
