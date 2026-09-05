"use client"

import { StatusPanel } from "@/components/agents-ui/application/status-panel/status-panel"
import type { AgentStatusPanelProps } from "@/components/agents-ui/application/status-panel/status-panel"
import { createElement } from "react"

export type {
  AgentStatusPanelProps,
  ConnectionStatus,
  ModelCapability,
  ModelInfo,
  SystemResources,
} from "@/components/agents-ui/application/status-panel/status-panel"
export function AgentStatusPanel(props: AgentStatusPanelProps) {
  return createElement(StatusPanel, props)
}
