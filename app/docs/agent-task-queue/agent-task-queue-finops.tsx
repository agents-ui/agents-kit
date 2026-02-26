"use client"

import { AgentTaskQueue, type AgentTask } from "@/components/agents-ui/agent-task-queue"

const finopsTasks: AgentTask[] = [
  {
    id: "fin-1",
    title: "Forecast infrastructure spend",
    description: "Blend usage telemetry with vendor rate changes for next quarter forecast.",
    status: "running",
    progress: 47,
    priority: "high",
    estimatedDuration: "~6 min remaining",
    tool: "Spend modeller",
    updatedLabel: "Running • 2 min ago",
    checkpoints: [
      { id: "fin-1-1", title: "Collect billing exports", status: "completed", timestamp: "07:18" },
      { id: "fin-1-2", title: "Normalize currency", status: "active", timestamp: "07:21" },
      { id: "fin-1-3", title: "Apply growth scenarios", status: "pending" },
    ],
    metrics: { tokens: 1580, cost: "$0.17", confidence: 0.82 },
  },
  {
    id: "fin-2",
    title: "Flag runaway services",
    description: "Detect workloads exceeding cost guardrails and route to owners.",
    status: "queued",
    priority: "high",
    tool: "Anomaly detector",
    updatedLabel: "Queued • SLA 10 min",
  },
  {
    id: "fin-3",
    title: "Negotiate committed spend",
    description: "Draft vendor negotiation packet with projected savings.",
    status: "paused",
    progress: 32,
    priority: "medium",
    tool: "Vendor liaison",
    updatedLabel: "Paused • awaiting finance review",
  },
  {
    id: "fin-4",
    title: "Close variance tickets",
    description: "Resolve variance tickets from last month's board meeting.",
    status: "completed",
    progress: 100,
    priority: "medium",
    tool: "Variance tracker",
    updatedLabel: "Completed 06:55",
  },
]

export default function AgentTaskQueueFinOps() {
  return (
    <AgentTaskQueue
      tasks={finopsTasks}
      autoStart
      concurrencyLimit={2}
      className="mx-auto w-full max-w-4xl"
      timestamp="Finance ops sync · 07:24"
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
