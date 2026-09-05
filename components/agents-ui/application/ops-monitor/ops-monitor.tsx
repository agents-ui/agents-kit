"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, Download, TriangleAlert } from "lucide-react"

export interface OpsSignal {
  id: string
  title: string
  status: "healthy" | "warning" | "critical"
  detail: string
  owner?: string
  lastUpdated?: string
}
export interface OpsServiceMetric {
  label: string
  value: string
  threshold: string
  trend: "up" | "down" | "stable"
}
export interface IncidentEvent {
  id: string
  timestamp: string
  summary: string
  actionNeeded?: string
}
export interface AgentOpsMonitorProps {
  environment?: string
  uptime?: string
  signals?: OpsSignal[]
  metrics?: OpsServiceMetric[]
  incidents?: IncidentEvent[]
  onAcknowledge?: (signal: OpsSignal) => void
  onEscalate?: (signal: OpsSignal) => void
  onExportReport?: () => void
  className?: string
}
const signalsDefault: OpsSignal[] = [
  {
    id: "latency",
    title: "Latency increased in US East",
    status: "critical",
    detail: "P95 latency increased from 410 ms to 930 ms over five minutes.",
    owner: "Platform on-call",
    lastUpdated: "2 min ago",
  },
  {
    id: "drift",
    title: "Embedding quality drift",
    status: "warning",
    detail:
      "Evaluation accuracy decreased by 4.8 points against the reference set.",
    owner: "Search team",
    lastUpdated: "8 min ago",
  },
  {
    id: "backup",
    title: "Backup pipeline",
    status: "healthy",
    detail: "Nightly backup completed with no errors.",
    owner: "Infrastructure",
    lastUpdated: "Completed",
  },
]
const metricsDefault: OpsServiceMetric[] = [
  {
    label: "P95 latency",
    value: "930 ms",
    threshold: "Below 550 ms",
    trend: "up",
  },
  { label: "Error rate", value: "0.8%", threshold: "Below 1%", trend: "down" },
  {
    label: "Availability",
    value: "99.7%",
    threshold: "Above 99.9%",
    trend: "stable",
  },
]
const incidentsDefault: IncidentEvent[] = [
  {
    id: "1",
    timestamp: "06:42",
    summary: "Failover to EU West orchestrator",
    actionNeeded: "Monitor",
  },
  {
    id: "2",
    timestamp: "06:55",
    summary: "Customer impact flagged for priority accounts",
    actionNeeded: "Support notified",
  },
]
const signalTone: Record<OpsSignal["status"], string> = {
  healthy: "text-green-600",
  warning: "text-amber-700",
  critical: "text-red-600",
}
export function OpsMonitor({
  environment = "Production",
  uptime = "99.97%",
  signals = signalsDefault,
  metrics = metricsDefault,
  incidents = incidentsDefault,
  onAcknowledge,
  onEscalate,
  onExportReport,
  className,
}: AgentOpsMonitorProps) {
  return (
    <section
      className={cn(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-text-secondary text-xs font-medium">
            {environment} environment
          </p>
          <h2 className="text-text-primary mt-1 text-lg font-semibold">
            Operations status
          </h2>
          <p className="text-text-secondary mt-1 text-sm">
            Uptime {uptime} · {signals.length} active signals
          </p>
        </div>
        <Button
          size="small"
          variant="secondary"
          leadingIcon={Download}
          onClick={onExportReport}
        >
          Export report
        </Button>
      </header>
      <div>
        {signals.map((signal) => (
          <article
            key={signal.id}
            className="border-separator-border flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-start"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-x-3">
                <h3 className="text-text-primary text-sm font-medium">
                  {signal.title}
                </h3>
                <span
                  className={cn(
                    "text-xs capitalize",
                    signalTone[signal.status]
                  )}
                >
                  {signal.status}
                </span>
              </div>
              <p className="text-text-secondary mt-1 text-xs leading-5">
                {signal.detail}
              </p>
              <div className="text-text-secondary mt-2 flex gap-3 text-xs">
                <span>{signal.owner || "Unassigned"}</span>
                <span>{signal.lastUpdated || "Just now"}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="xs"
                variant="secondary"
                leadingIcon={Check}
                onClick={() => onAcknowledge?.(signal)}
              >
                Acknowledge
              </Button>
              {signal.status !== "healthy" && (
                <Button
                  size="xs"
                  variant="danger"
                  leadingIcon={TriangleAlert}
                  onClick={() => onEscalate?.(signal)}
                >
                  Escalate
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
      <details className="group border-separator-border border-t p-4">
        <summary className="text-text-primary flex cursor-pointer list-none items-center gap-1 text-xs">
          <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
          Service metrics and incidents
        </summary>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <div className="divide-separator-border bg-background-secondary-default divide-y rounded-lg px-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="grid grid-cols-[1fr_auto] gap-3 py-2.5 text-xs"
              >
                <span className="text-text-primary">{metric.label}</span>
                <span className="text-text-secondary text-right">
                  {metric.value}
                  <span className="ml-2">Target {metric.threshold}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="divide-separator-border bg-background-secondary-default divide-y rounded-lg px-3">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="grid grid-cols-[3.5rem_1fr] gap-3 py-2.5 text-xs"
              >
                <time className="text-text-secondary">
                  {incident.timestamp}
                </time>
                <span className="text-text-primary">
                  {incident.summary}
                  {incident.actionNeeded && (
                    <small className="text-text-secondary ml-2">
                      {incident.actionNeeded}
                    </small>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </details>
    </section>
  )
}
