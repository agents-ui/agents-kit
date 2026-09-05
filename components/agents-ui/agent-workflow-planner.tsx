"use client"

import { WorkflowPlanner } from "@/components/agents-ui/application/workflow-planner/workflow-planner"
import type { AgentWorkflowPlannerProps } from "@/components/agents-ui/application/workflow-planner/workflow-planner"
import { createElement } from "react"

export type {
  ActionItem,
  AgentWorkflowPlannerProps,
  WorkflowCheckpoint,
  WorkflowPlaybook,
} from "@/components/agents-ui/application/workflow-planner/workflow-planner"
export function AgentWorkflowPlanner(props: AgentWorkflowPlannerProps) {
  return createElement(WorkflowPlanner, props)
}
