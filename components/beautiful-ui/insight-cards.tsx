"use client"

import { cx } from "@/components/boardui/utils/cx"

export type InsightKind = "compare" | "anomaly" | "allocation"
export interface InsightCard {
  id: string
  title: string
  description: string
  value?: string
  kind: InsightKind
  series?: number[]
}
export interface InsightCardsProps {
  insights: InsightCard[]
  onSelect?: (id: string) => void
  className?: string
}
function Line({ data = [] }: { data?: number[] }) {
  if (data.length < 2) return null
  const max = Math.max(...data),
    min = Math.min(...data),
    range = max - min || 1
  const points = data
    .map(
      (value, index) =>
        `${(index / (data.length - 1)) * 100},${30 - ((value - min) / range) * 28}`
    )
    .join(" ")
  return (
    <svg
      viewBox="0 0 100 32"
      className="mt-3 h-8 w-full"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
function Graphic({ kind, data = [] }: { kind: InsightKind; data?: number[] }) {
  if (kind === "allocation") {
    const total = data.reduce((sum, value) => sum + Math.max(0, value), 0) || 1
    return (
      <div className="bg-background-secondary-default mt-4 flex h-2 overflow-hidden rounded-full">
        {data.map((value, index) => (
          <span
            key={index}
            className={cx(
              "h-full",
              index === 0
                ? "bg-accent-600"
                : index === 1
                  ? "bg-text-secondary"
                  : "bg-border-button-default"
            )}
            style={{ width: `${(Math.max(0, value) / total) * 100}%` }}
          />
        ))}
      </div>
    )
  }
  if (kind === "anomaly") {
    const max = Math.max(...data),
      index = data.indexOf(max)
    return (
      <div className="relative">
        <Line data={data} />
        {data.length > 1 && (
          <span
            className="absolute size-2 rounded-full bg-red-600"
            style={{
              left: `calc(${(index / (data.length - 1)) * 100}% - 4px)`,
              top: 10,
            }}
          />
        )}
      </div>
    )
  }
  return <Line data={data} />
}
export function InsightCards({
  insights,
  onSelect,
  className,
}: InsightCardsProps) {
  return (
    <div className={cx("grid gap-3 md:grid-cols-3", className)}>
      {insights.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect?.(item.id)}
          className="border-separator-border bg-background-primary-default rounded-xl border p-4 text-left"
        >
          <p className="text-text-secondary text-xs capitalize">{item.kind}</p>
          <h3 className="mt-1 text-[13px] font-semibold">{item.title}</h3>
          {item.value && (
            <p className="mt-3 text-2xl font-semibold tabular-nums">
              {item.value}
            </p>
          )}
          <p className="text-text-secondary mt-2 text-xs leading-5">
            {item.description}
          </p>
          <Graphic kind={item.kind} data={item.series} />
        </button>
      ))}
    </div>
  )
}
