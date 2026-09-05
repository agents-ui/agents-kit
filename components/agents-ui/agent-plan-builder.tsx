"use client"

import { PlanBuilder } from "@/components/agents-ui/application/plan-builder/plan-builder"
import type { AgentPlanBuilderProps } from "@/components/agents-ui/application/plan-builder/plan-builder"
import { createElement } from "react"

export type {
  AgentPlanBuilderProps,
  PlanStep,
  PlanStepStatus,
} from "@/components/agents-ui/application/plan-builder/plan-builder"
export function AgentPlanBuilder(props: AgentPlanBuilderProps) {
  return createElement(PlanBuilder, props)
}
