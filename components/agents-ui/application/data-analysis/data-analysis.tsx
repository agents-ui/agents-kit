"use client"

import type {
  AgentDataAnalysisProps,
  DataInsight,
  DataMetric,
  DataPreview,
  DistributionBar,
} from "@/components/agents-ui/agent-data-analysis"
import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import {
  AlertTriangle,
  Download,
  GitBranch,
  Lightbulb,
  MessageSquare,
  Search,
  TrendingUp,
} from "lucide-react"

const metrics0: DataMetric[] = [
  {
    label: "At-risk value",
    value: "$1.84M",
    change: "+12% QoQ",
    changeDirection: "up",
  },
  {
    label: "Accounts at risk",
    value: "12",
    change: "+3 QoQ",
    changeDirection: "up",
  },
  {
    label: "Executive action",
    value: "4",
    change: "This week",
    changeDirection: "neutral",
  },
]
const preview0: DataPreview = {
  headers: ["Account", "Renewal", "Health", "Owner"],
  rows: [
    ["Northwind", "$520K", "At risk", "Morgan Lee"],
    ["Acme Health", "$410K", "At risk", "Jordan Kim"],
    ["Contour Labs", "$360K", "At risk", "Priya Shah"],
  ],
}
const insights0: DataInsight[] = [
  {
    id: "1",
    title: "Sponsor coverage is the strongest risk signal",
    description: "Seven accounts do not have a confirmed executive sponsor.",
    confidence: 0.93,
    category: "correlation",
  },
  {
    id: "2",
    title: "Four accounts need action this week",
    description:
      "Their value and declining adoption exceed the escalation threshold.",
    confidence: 0.89,
    category: "recommendation",
  },
]
const dist0: DistributionBar[] = [
  { label: "Product adoption", value: 38, maxValue: 100, color: "#2563eb" },
  { label: "Sponsor coverage", value: 27, maxValue: 100, color: "#64748b" },
  { label: "Support pressure", value: 21, maxValue: 100, color: "#d97706" },
]
const icons = {
  trend: TrendingUp,
  anomaly: AlertTriangle,
  correlation: GitBranch,
  recommendation: Lightbulb,
}
const directionLabel: Record<DataMetric["changeDirection"], string> = {
  up: "Up",
  down: "Down",
  neutral: "No change",
}
export function DataAnalysis({
  datasetName = "renewals_q3.csv",
  description = "Renewal forecast joined with account health and CRM notes.",
  rowCount = 842,
  columnCount = 18,
  metrics = metrics0,
  dataPreview = preview0,
  insights = insights0,
  distribution = dist0,
  isAnalyzing = false,
  onExport,
  onDeeperAnalysis,
  onAskFollowUp,
  onDownload,
  className,
}: AgentDataAnalysisProps) {
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-wrap justify-between gap-3 border-b p-5">
        <div>
          <h2 className="text-lg font-semibold">{datasetName}</h2>
          <p className="text-text-secondary mt-1 text-sm">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            leadingIcon={Download}
            onClick={onDownload}
          >
            Download
          </Button>
          <Button variant="secondary" size="small" onClick={onExport}>
            Export report
          </Button>
        </div>
      </header>
      {isAnalyzing && (
        <p className="border-separator-border text-text-secondary border-b px-5 py-2 text-xs">
          Analyzing dataset
        </p>
      )}
      <div className="divide-separator-border border-separator-border grid divide-y border-b sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {metrics.map((x) => (
          <div key={x.label} className="p-4">
            <p className="text-text-secondary text-xs">{x.label}</p>
            <p className="mt-1 text-xl font-semibold">
              {x.value}
              <span
                className="text-text-secondary ml-2 text-xs font-normal"
                data-direction={x.changeDirection}
              >
                {x.change} · {directionLabel[x.changeDirection]}
              </span>
            </p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-[3fr_2fr]">
        <div className="p-5">
          <h3 className="mb-3 text-sm font-medium">Account preview</h3>
          <div className="border-separator-border overflow-auto rounded-lg border">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-background-secondary-default text-text-secondary text-xs">
                <tr>
                  {dataPreview.headers.map((x) => (
                    <th key={x} className="p-3">
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataPreview.rows.map((r, i) => (
                  <tr key={i} className="border-separator-border border-t">
                    {r.map((x, j) => (
                      <td key={j} className="p-3">
                        {x}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="border-separator-border border-t p-5 lg:border-t-0 lg:border-l">
          <h3 className="text-sm font-medium">Risk drivers</h3>
          {distribution.map((x) => {
            const p = x.maxValue ? (x.value / x.maxValue) * 100 : 0
            return (
              <div key={x.label} className="mt-4">
                <div className="flex justify-between text-xs">
                  <span>{x.label}</span>
                  <span>{Math.round(p)}%</span>
                </div>
                <div className="bg-background-secondary-default mt-1 h-1.5">
                  <div
                    className="h-full"
                    style={{ width: `${p}%`, backgroundColor: x.color }}
                  />
                </div>
              </div>
            )
          })}
        </aside>
      </div>
      <div className="border-separator-border border-t p-5">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium">Findings</h3>
          <Button
            variant="ghost"
            size="small"
            leadingIcon={Search}
            onClick={onDeeperAnalysis}
          >
            Deeper analysis
          </Button>
        </div>
        {insights.map((x) => {
          const I = icons[x.category]
          return (
            <article
              key={x.id}
              className="border-separator-border grid grid-cols-[20px_1fr_auto] gap-3 border-b py-3"
            >
              <I className="text-text-secondary size-4" />
              <div>
                <h4 className="text-sm font-medium">{x.title}</h4>
                <p className="text-text-secondary mt-1 text-sm">
                  {x.description}
                </p>
              </div>
              <span className="text-text-secondary text-xs">
                {Math.round(x.confidence * 100)}%
              </span>
            </article>
          )
        })}
        <div className="mt-4 flex justify-between">
          <span className="text-text-secondary text-xs">
            {rowCount} rows · {columnCount} columns
          </span>
          <Button
            variant="secondary"
            size="small"
            leadingIcon={MessageSquare}
            onClick={onAskFollowUp}
          >
            Ask follow-up
          </Button>
        </div>
      </div>
    </section>
  )
}
