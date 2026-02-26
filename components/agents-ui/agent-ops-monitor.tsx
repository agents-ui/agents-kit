"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle2, Cpu, Gauge, Network, ShieldCheck, Signal, WifiOff } from "lucide-react"

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

const defaultSignals: OpsSignal[] = [
  {
    id: "ops-1",
    title: "Latency spike in us-east",
    status: "critical",
    detail: "P95 latency increased from 410ms → 930ms over the last 5 minutes",
    owner: "Agent Atlas",
    lastUpdated: "2m ago",
  },
  {
    id: "ops-2",
    title: "Drift detected in embedding model",
    status: "warning",
    detail: "Sentiment accuracy decreased by 4.8 pts vs. reference dataset",
    owner: "Agent Mira",
    lastUpdated: "8m ago",
  },
  {
    id: "ops-3",
    title: "Backup pipeline",
    status: "healthy",
    detail: "Nightly backups completed · 0 errors",
    owner: "Agent Nova",
    lastUpdated: "Completed",
  },
]

const defaultMetrics: OpsServiceMetric[] = [
  { label: "P95 latency", value: "930ms", threshold: "< 550ms", trend: "up" },
  { label: "Error rate", value: "0.8%", threshold: "< 1%", trend: "down" },
  { label: "Agent availability", value: "99.7%", threshold: "> 99.9%", trend: "stable" },
]

const defaultIncidents: IncidentEvent[] = [
  { id: "evt-1", timestamp: "06:42", summary: "Failover to eu-west orchestrator", actionNeeded: "Monitor" },
  { id: "evt-2", timestamp: "06:55", summary: "Customer impact flagged for tier-1 accounts", actionNeeded: "CS notified" },
]

export function AgentOpsMonitor({
  environment = "Production",
  uptime = "99.97%",
  signals = defaultSignals,
  metrics = defaultMetrics,
  incidents = defaultIncidents,
  onAcknowledge,
  onEscalate,
  onExportReport,
  className,
}: AgentOpsMonitorProps) {
  const statusBadge = (status: OpsSignal["status"]) => {
    if (status === "critical") {
      return <Badge className="bg-red-100 text-red-700 border border-red-200">Critical</Badge>
    }
    if (status === "warning") {
      return <Badge className="bg-amber-100 text-amber-700 border border-amber-200">Warning</Badge>
    }
    return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Healthy</Badge>
  }

  const trendIcon = (trend: OpsServiceMetric["trend"]) => {
    if (trend === "up") return <Signal className="h-4 w-4 text-red-500" />
    if (trend === "down") return <Signal className="h-4 w-4 rotate-180 text-emerald-500" />
    return <Signal className="h-4 w-4 text-blue-500" />
  }

  return (
    <TooltipProvider>
      <div className={cn("space-y-4 p-4", className)}>
        <div className="flex flex-col gap-3 rounded-xl border bg-background p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              {environment} infrastructure
            </div>
            <div className="flex items-end gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">Operations command center</h2>
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Gauge className="h-3 w-3" /> Uptime {uptime}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="h-9" onClick={onExportReport}>
              Export report
            </Button>
            <Badge variant="outline" className="h-9 gap-1 text-sm">
              <Cpu className="h-4 w-4" /> {signals.length} signals
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
          <div className="space-y-3 rounded-xl border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold flex items-center gap-2">
                <WifiOff className="h-4 w-4 text-red-500" /> Live signals
              </p>
              <Badge variant="outline">Agent routed</Badge>
            </div>
            <ScrollArea className="max-h-[320px] pr-2">
              <div className="space-y-3">
                {signals.map((signal) => (
                  <div key={signal.id} className="space-y-2 rounded-lg border border-dashed p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{signal.title}</p>
                      {statusBadge(signal.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{signal.detail}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Owner · {signal.owner ?? "Unassigned"}</span>
                      <span>{signal.lastUpdated ?? "Just now"}</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            onClick={() => onAcknowledge?.(signal)}
                          >
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Acknowledge
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Confirm agent is handling it</TooltipContent>
                      </Tooltip>
                      {signal.status !== "healthy" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              className="h-7"
                              onClick={() => onEscalate?.(signal)}
                            >
                              <AlertTriangle className="mr-1 h-3.5 w-3.5" /> Escalate
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Route to human on-call</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <Network className="h-4 w-4 text-blue-500" /> Service metrics
                </p>
                <Badge variant="outline">Targets</Badge>
              </div>
              <div className="mt-3 space-y-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-dashed p-3">
                    <div className="flex items-center justify-between text-sm font-medium">
                      {metric.label}
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        {trendIcon(metric.trend)}
                        Target {metric.threshold}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-xl font-semibold text-foreground">{metric.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-background p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Signal className="h-4 w-4 text-emerald-500" /> Latest incidents
              </div>
              <div className="mt-3 space-y-2 text-xs">
                {incidents.map((incident) => (
                  <div key={incident.id} className="rounded-lg border border-dashed p-3">
                    <div className="flex items-center justify-between font-medium text-foreground">
                      {incident.summary}
                      <span className="text-muted-foreground">{incident.timestamp}</span>
                    </div>
                    {incident.actionNeeded && (
                      <p className="mt-1 text-muted-foreground">Action · {incident.actionNeeded}</p>
                    )}
                  </div>
                ))}
                {incidents.length === 0 && (
                  <p className="rounded-lg border border-dashed p-4 text-muted-foreground">
                    No recent incidents.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentOpsMonitor.displayName = "AgentOpsMonitor"
