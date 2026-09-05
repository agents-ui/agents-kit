"use client"

import { SequentialWorkflow } from "@/components/agents-ui/application/sequential-workflow/sequential-workflow"
import type { AgentSequentialWorkflowProps } from "@/components/agents-ui/application/sequential-workflow/sequential-workflow"
import { createElement } from "react"

export type {
  AgentSequentialWorkflowProps,
  WorkflowStep,
  WorkflowStepStatus,
} from "@/components/agents-ui/application/sequential-workflow/sequential-workflow"
export function AgentSequentialWorkflow(props: AgentSequentialWorkflowProps) {
  return createElement(SequentialWorkflow, props)
}
