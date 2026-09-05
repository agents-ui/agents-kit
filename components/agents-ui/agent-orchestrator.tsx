"use client"

import { Orchestrator } from "@/components/agents-ui/application/orchestrator/orchestrator"
import type { AgentOrchestratorProps } from "@/components/agents-ui/application/orchestrator/orchestrator"
import { createElement } from "react"

export type {
  AgentOrchestratorProps,
  CommLogEntry,
  SubAgent,
  SubAgentMetrics,
  SubAgentStatus,
} from "@/components/agents-ui/application/orchestrator/orchestrator"
export function AgentOrchestrator(props: AgentOrchestratorProps) {
  return createElement(Orchestrator, props)
}
