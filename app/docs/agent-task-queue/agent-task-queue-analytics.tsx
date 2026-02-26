"use client"

import { useMemo } from "react"
import { AgentTaskQueue, type AgentTask } from "@/components/agents-ui/agent-task-queue"

const analyticsTasks: AgentTask[] = [
  {
    id: "an-1",
    title: "Refresh weekly KPI deck",
    description: "Blend product, revenue, and retention metrics for leadership readout.",
    status: "running",
    progress: 72,
    priority: "high",
    estimatedDuration: "~3 min remaining",
    tool: "Insights composer",
    updatedLabel: "Running • 58s ago",
    checkpoints: [
      { id: "an-1-1", title: "Pull data warehouse queries", status: "completed", timestamp: "06:42" },
      { id: "an-1-2", title: "Generate visuals", status: "active", timestamp: "06:45" },
      { id: "an-1-3", title: "Draft narrative", status: "pending" },
    ],
    metrics: { tokens: 1320, cost: "$0.14", confidence: 0.9 },
  },
  {
    id: "an-2",
    title: "Run churn segmentation",
    description: "Segment churn risk by cohort and product surface for CS action.",
    status: "queued",
    priority: "medium",
    tool: "Retention analyst",
    updatedLabel: "Queued behind 1 task",
  },
  {
    id: "an-3",
    title: "Publish experiment scorecard",
    description: "Summarize A/B experiment lift and statistical significance.",
    status: "queued",
    priority: "medium",
    tool: "Experiment hub",
    updatedLabel: "Queued • needs data sync",
  },
  {
    id: "an-4",
    title: "Archive stale dashboards",
    description: "Tag dashboards with <5% usage for cleanup.",
    status: "completed",
    progress: 100,
    priority: "low",
    tool: "Ops tidy",
    updatedLabel: "Completed 06:20",
  },
]

const trend = [68, 74, 79, 83, 88, 92, 97]

function UsageTrend() {
  const pathD = useMemo(() => {
    const min = Math.min(...trend)
    const max = Math.max(...trend)
    return trend
      .map((value, index) => {
        const x = (index / (trend.length - 1)) * 100
        const y = 40 - ((value - min) / (max - min)) * 30
        return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
      })
      .join(" ")
  }, [])

  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="font-semibold">Insights shipped</p>
          <p className="text-muted-foreground">Last 7 days</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
          +29%
        </span>
      </div>
      <svg viewBox="0 0 100 40" className="mt-4 h-24 w-full">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} L 100 40 L 0 40 Z`}
          fill="url(#trendFill)"
          stroke="none"
        />
        <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Insights delivered</span>
        <span className="font-medium text-foreground">97 this week</span>
      </div>
    </div>
  )
}

export default function AgentTaskQueueAnalytics() {
  return (
    <div className="space-y-4">
      <UsageTrend />
      <AgentTaskQueue
        tasks={analyticsTasks}
        autoStart
        concurrencyLimit={3}
        className="mx-auto w-full max-w-4xl"
        timestamp="Analytics pipeline · 06:47"
        onStartTask={(taskId) => console.log("start", taskId)}
        onPauseTask={(taskId) => console.log("pause", taskId)}
        onResumeTask={(taskId) => console.log("resume", taskId)}
        onCancelTask={(taskId) => console.log("reset", taskId)}
        onReorder={(taskIds) => console.log("reorder", taskIds)}
        onClearCompleted={() => console.log("clear completed")}
        onAddTask={() => console.log("add task")}
      />
    </div>
  )
}
