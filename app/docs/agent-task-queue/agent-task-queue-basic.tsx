"use client"

import { AgentTaskQueue, type AgentTask } from "@/components/agents-ui/agent-task-queue"
import { useState } from "react"

export default function AgentTaskQueueBasic() {
  const [autoStart, setAutoStart] = useState(true)

  const tasks: AgentTask[] = [
    {
      id: "launch-1",
      title: "Finalize launch checklist",
      description: "Verify copy, pricing, and compliance sign-off for launch.",
      status: "running",
      progress: 64,
      priority: "high",
      estimatedDuration: "~4 min remaining",
      tool: "Launch planner",
      updatedLabel: "Running • 1 min ago",
      checkpoints: [
        {
          id: "launch-1-1",
          title: "Legal & compliance pass",
          status: "completed",
          timestamp: "08:05",
        },
        {
          id: "launch-1-2",
          title: "Website content refresh",
          status: "active",
          timestamp: "08:11",
        },
        {
          id: "launch-1-3",
          title: "Schedule announcement",
          status: "pending",
        },
      ],
      metrics: {
        tokens: 980,
        cost: "$0.09",
        confidence: 0.88,
      },
    },
    {
      id: "launch-2",
      title: "Prep customer email",
      description: "Draft segmented announcement copy for existing customers.",
      status: "queued",
      priority: "medium",
      tool: "Lifecycle writer",
      updatedLabel: "Queued • Auto start",
    },
    {
      id: "launch-3",
      title: "Refresh demo environment",
      description: "Update product walkthrough with new features enabled.",
      status: "queued",
      priority: "medium",
      tool: "Demo orchestrator",
      updatedLabel: "Queued behind 1 task",
    },
    {
      id: "launch-4",
      title: "QA staging smoke test",
      description: "Run smoke tests across critical user journeys.",
      status: "completed",
      progress: 100,
      priority: "high",
      tool: "QA runner",
      updatedLabel: "Completed 07:42",
    },
  ]

  return (
    <AgentTaskQueue
      tasks={tasks}
      autoStart={autoStart}
      concurrencyLimit={2}
      className="mx-auto w-full max-w-4xl"
      timestamp="Updated moments ago"
      onToggleAutoStart={setAutoStart}
      onStartTask={(taskId) => console.log("start", taskId)}
      onPauseTask={(taskId) => console.log("pause", taskId)}
      onResumeTask={(taskId) => console.log("resume", taskId)}
      onCancelTask={(taskId) => console.log("reset", taskId)}
      onReorder={(taskIds) => console.log("reorder", taskIds)}
      onClearCompleted={() => console.log("clear completed")}
      onAddTask={() => console.log("add task")}
    />
  )
}
