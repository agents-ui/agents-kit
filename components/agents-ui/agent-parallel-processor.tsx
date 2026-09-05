"use client"

import { ParallelProcessor } from "@/components/agents-ui/application/parallel-processor/parallel-processor"
import type { AgentParallelProcessorProps } from "@/components/agents-ui/application/parallel-processor/parallel-processor"
import { createElement } from "react"

export type {
  AgentParallelProcessorProps,
  ParallelLane,
  ParallelLaneStatus,
} from "@/components/agents-ui/application/parallel-processor/parallel-processor"
export function AgentParallelProcessor(props: AgentParallelProcessorProps) {
  return createElement(ParallelProcessor, props)
}
