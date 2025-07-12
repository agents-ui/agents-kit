"use client"

import { AgentStatusPanel, ModelInfo } from "@/components/agents-ui/agent-status-panel"

export default function AgentStatusPanelCompact() {
  const modelInfo: ModelInfo = {
    name: "Claude 3 Opus",
    provider: "Anthropic",
    contextLength: 200000,
    capabilities: ["chat", "code", "vision"],
  }
  
  return (
    <div className="w-80">
      <AgentStatusPanel
        connectionStatus="connected"
        modelInfo={modelInfo}
        version="2.1.0"
        compact
        onRefresh={() => console.log("Refresh clicked")}
        onSettings={() => console.log("Settings clicked")}
      />
    </div>
  )
}
