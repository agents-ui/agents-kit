"use client"

import { AgentStatusPanel, ModelInfo, SystemResources } from "@/components/agents-ui/agent-status-panel"
import { useState } from "react"

export default function AgentStatusPanelFull() {
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected" | "error">("connected")
  
  const modelInfo: ModelInfo = {
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    contextLength: 128000,
    capabilities: ["chat", "code", "vision", "function-calling"],
    costPer1kTokens: {
      input: 0.01,
      output: 0.03
    }
  }
  
  const systemResources: SystemResources = {
    cpu: 45,
    memory: 72,
    latency: 125,
    uptime: "14d 6h 32m"
  }
  
  return (
    <AgentStatusPanel
      connectionStatus={connectionStatus}
      modelInfo={modelInfo}
      systemResources={systemResources}
      version="2.1.0"
      onReconnect={() => {
        setConnectionStatus("connecting")
        setTimeout(() => setConnectionStatus("connected"), 2000)
      }}
      onRefresh={() => console.log("Refresh clicked")}
      onSettings={() => console.log("Settings clicked")}
    />
  )
}
