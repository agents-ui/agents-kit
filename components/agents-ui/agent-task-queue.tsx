"use client"

import { TaskQueue } from "@/components/agents-ui/application/task-queue/task-queue"
import type { AgentTaskQueueProps } from "@/components/agents-ui/application/task-queue/task-queue"
import { createElement } from "react"

export type {
  AgentTask,
  AgentTaskAssignee,
  AgentTaskPriority,
  AgentTaskQueueProps,
  AgentTaskStatus,
  AgentTaskTimelineEvent,
  AgentTaskTimelineStatus,
} from "@/components/agents-ui/application/task-queue/task-queue"
export function AgentTaskQueue(props: AgentTaskQueueProps) {
  return createElement(TaskQueue, props)
}
