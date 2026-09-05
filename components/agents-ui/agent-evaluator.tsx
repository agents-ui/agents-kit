"use client"

import { Evaluator } from "@/components/agents-ui/application/evaluator/evaluator"

export interface EvalCriterion {
  label: string
  score: number
  maxScore: number
}
export interface EvalIteration {
  id: string
  number: number
  output: string
  score: number
  feedback: string
  criteria: EvalCriterion[]
  status: "passed" | "failed" | "in-progress"
}
export interface AgentEvaluatorProps {
  taskDescription?: string
  iterations?: EvalIteration[]
  currentIteration?: number
  qualityThreshold?: number
  maxIterations?: number
  isRunning?: boolean
  className?: string
  onRunNext?: () => void
  onAccept?: () => void
  onReset?: () => void
  onAdjustThreshold?: (value: number) => void
}
export function AgentEvaluator(props: AgentEvaluatorProps) {
  return <Evaluator {...props} />
}
