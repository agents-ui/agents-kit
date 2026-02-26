"use client"

import { AgentOpsMonitor, type OpsSignal } from "@/components/agents-ui/agent-ops-monitor"

const stagingSignals: OpsSignal[] = [
  {
    id: "stg-1",
    title: "Staging data refresh",
    status: "warning",
    detail: "Refresh pending security approval. Tokens expire in 4h",
    owner: "Agent Relay",
    lastUpdated: "Pending",
  },
  {
    id: "stg-2",
    title: "Preview environment",
    status: "healthy",
    detail: "Preview deployment succeeded · build #812",
    owner: "Agent Forge",
    lastUpdated: "Now",
  },
]

export default function AgentOpsMonitorStaging() {
  return (
    <AgentOpsMonitor
      environment="Staging"
      uptime="99.5%"
      signals={stagingSignals}
      metrics={[
        { label: "Deploy success", value: "97.1%", threshold: "> 95%", trend: "up" },
        { label: "Preview latency", value: "420ms", threshold: "< 600ms", trend: "down" },
        { label: "QA coverage", value: "84%", threshold: "> 80%", trend: "stable" },
      ]}
      incidents={[]}
      onExportReport={() => console.log("export staging report")}
    />
  )
}
