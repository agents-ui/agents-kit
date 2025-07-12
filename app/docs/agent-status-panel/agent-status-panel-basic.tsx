"use client"

import { AgentStatusPanel } from "@/components/agents-ui/agent-status-panel"

export default function AgentStatusPanelBasic() {
  return (
    <AgentStatusPanel
      connectionStatus="connected"
      version="2.1.0"
      onRefresh={() => console.log("Refresh clicked")}
      onSettings={() => console.log("Settings clicked")}
    />
  )
}
