"use client"

import { AgentOpsMonitor, type OpsSignal, type OpsServiceMetric, type IncidentEvent } from "@/components/agents-ui/agent-ops-monitor"

const signals: OpsSignal[] = [
  {
    id: "sig-1",
    title: "Vector db replica lag",
    status: "critical",
    detail: "Replica lag is 28s (> 10s threshold). Agents throttled to 60 req/min",
    owner: "Agent Atlas",
    lastUpdated: "1m ago",
  },
  {
    id: "sig-2",
    title: "API 500s",
    status: "warning",
    detail: "Tool execution route returning 2.6% 500 errors for tier-1 customers",
    owner: "Agent Pulse",
    lastUpdated: "3m ago",
  },
  {
    id: "sig-3",
    title: "Backup pipeline",
    status: "healthy",
    detail: "Nightly snapshot completed. Verifying restore checksums",
    owner: "Agent Nova",
    lastUpdated: "Completed",
  },
]

const metrics: OpsServiceMetric[] = [
  { label: "P95 latency", value: "780ms", threshold: "< 550ms", trend: "up" },
  { label: "Error rate", value: "1.2%", threshold: "< 1%", trend: "up" },
  { label: "Agent availability", value: "99.3%", threshold: "> 99.9%", trend: "down" },
]

const incidents: IncidentEvent[] = [
  { id: "inc-1", timestamp: "06:30", summary: "Triggered read-only mode", actionNeeded: "Monitor lag" },
  { id: "inc-2", timestamp: "06:42", summary: "Routed backups to secondary region", actionNeeded: "Confirm ETL status" },
]

export default function AgentOpsMonitorIncidents() {
  return (
    <AgentOpsMonitor
      environment="Production"
      uptime="99.92%"
      signals={signals}
      metrics={metrics}
      incidents={incidents}
      onAcknowledge={(signal) => console.log("ack", signal.id)}
      onEscalate={(signal) => console.log("escalate", signal.id)}
      onExportReport={() => console.log("export ops report")}
    />
  )
}
