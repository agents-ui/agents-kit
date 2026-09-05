"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { Tab, TabList, Tabs } from "@/components/boardui/base/tabs/tabs"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import type { AgentRevenueInsightsProps } from "../../agent-revenue-insights"

const defaultPoints = [
  { label: "Jan", value: 9.8 },
  { label: "Feb", value: 10.4 },
  { label: "Mar", value: 11.2 },
  { label: "Apr", value: 11.8 },
  { label: "May", value: 12.4 },
  { label: "Jun", value: 13.1 },
]
const defaultSegments = [
  {
    id: "enterprise",
    segment: "Enterprise",
    arr: "$4.2M",
    trend: "up" as const,
    change: "+14% QoQ",
    confidence: 0.86,
    owner: "Account team",
  },
  {
    id: "smb",
    segment: "SMB",
    arr: "$2.1M",
    trend: "flat" as const,
    change: "+2% QoQ",
    confidence: 0.74,
    owner: "Growth team",
  },
]

export function AgentRevenueInsights({
  currentArr = "$12.9M",
  arrChange = "+8.4%",
  periodLabel = "Trailing 6 months",
  forecastPoints = defaultPoints,
  segmentInsights = defaultSegments,
  scenario = "base",
  onRefresh,
  onScenarioChange,
  onSegmentClick,
  className,
}: AgentRevenueInsightsProps) {
  const [selected, setSelected] = useState(scenario)
  useEffect(() => setSelected(scenario), [scenario])
  const points = forecastPoints.filter((point) => Number.isFinite(point.value))
  const min = Math.min(...points.map((point) => point.value)),
    max = Math.max(...points.map((point) => point.value))
  const path = points
    .map(
      (point, i) =>
        `${24 + (i / Math.max(1, points.length - 1)) * 552},${160 - ((point.value - min) / (max - min || 1)) * 136}`
    )
    .join(" ")
  return (
    <section
      aria-label="Revenue insights"
      className={cn(
        "agent-widget border-separator-border bg-background-primary-default text-text-primary w-full min-w-0 space-y-5 rounded-xl border p-5",
        className
      )}
    >
      <header className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-text-secondary text-xs">{periodLabel}</p>
          <h2 className="mt-1 text-lg font-semibold">Revenue outlook</h2>
        </div>
        {onRefresh && (
          <Button variant="secondary" size="small" onClick={onRefresh}>
            Refresh
          </Button>
        )}
      </header>
      <div className="border-separator-border flex flex-wrap items-end justify-between gap-4 border-y py-4">
        <div>
          <p className="text-text-secondary text-xs">
            Annual recurring revenue
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {currentArr}
            <span className="text-text-secondary ml-3 text-xs font-normal">
              {arrChange}
            </span>
          </p>
        </div>
        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => {
            const value = String(key) as typeof selected
            setSelected(value)
            onScenarioChange?.(value)
          }}
        >
          <TabList aria-label="Forecast scenario">
            {["conservative", "base", "stretch"].map((key) => (
              <Tab key={key} id={key} className="capitalize">
                {key}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </div>
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <section className="min-w-0">
          <h3 className="text-sm font-medium capitalize">
            {selected} forecast
          </h3>
          {points.length > 0 ? (
            <svg
              role="img"
              aria-label={`Forecast: ${points.map((p) => `${p.label} ${p.value} million`).join(", ")}`}
              viewBox="0 0 600 190"
              className="my-3 w-full"
            >
              <path d="M24 160 H576" stroke="currentColor" opacity=".12" />
              <polyline
                points={path}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((point, i) => (
                <text
                  key={point.label}
                  x={24 + (i / Math.max(1, points.length - 1)) * 552}
                  y="184"
                  textAnchor="middle"
                  fill="currentColor"
                  opacity=".65"
                  fontSize="12"
                >
                  {point.label}
                </text>
              ))}
            </svg>
          ) : (
            <p className="text-text-secondary py-8 text-sm">
              No forecast data available.
            </p>
          )}
          <details className="text-text-secondary text-xs">
            <summary className="focus-visible:outline-border-focus-ring cursor-pointer rounded py-2 focus-visible:outline-2">
              View forecast values
            </summary>
            <dl className="mt-2 space-y-2">
              {points.map((point) => (
                <div key={point.label} className="flex justify-between">
                  <dt>{point.label}</dt>
                  <dd className="tabular-nums">{point.value.toFixed(1)}M</dd>
                </div>
              ))}
            </dl>
          </details>
        </section>
        <section className="min-w-0">
          <h3 className="mb-2 text-sm font-medium">Segments to watch</h3>
          <ul className="divide-separator-border divide-y">
            {segmentInsights.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="hover:bg-background-primary-hover focus-visible:outline-border-focus-ring w-full rounded-lg py-3 text-left focus-visible:outline-2"
                  onClick={() => onSegmentClick?.(item)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-medium">{item.segment}</span>
                    <span className="shrink-0 text-sm tabular-nums">
                      {item.arr}
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1 text-xs">
                    {item.owner ?? "Unassigned"}
                  </p>
                  <div className="text-text-secondary mt-2 flex flex-wrap justify-between gap-2 text-xs">
                    <span>
                      {item.change} · {item.trend}
                    </span>
                    <span>Confidence {Math.round(item.confidence * 100)}%</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {segmentInsights.length === 0 && (
            <p className="text-text-secondary py-4 text-sm">
              No segment insights available.
            </p>
          )}
        </section>
      </div>
    </section>
  )
}
