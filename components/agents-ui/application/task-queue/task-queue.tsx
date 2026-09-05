"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { Switch } from "@/components/boardui/base/switch/switch"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  Pause,
  Play,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react"

export type AgentTaskStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "blocked"
  | "paused"
export type AgentTaskPriority = "low" | "medium" | "high"
export type AgentTaskTimelineStatus = "pending" | "active" | "completed"
export interface AgentTaskTimelineEvent {
  id: string
  title: string
  description?: string
  status: AgentTaskTimelineStatus
  timestamp?: string
}
export interface AgentTaskAssignee {
  name: string
  avatarColor?: string
  initials?: string
}
export interface AgentTask {
  id: string
  title: string
  description?: string
  status: AgentTaskStatus
  progress?: number
  priority?: AgentTaskPriority
  createdAt?: string
  updatedAt?: string
  updatedLabel?: string
  estimatedDuration?: string
  tool?: string
  assignee?: AgentTaskAssignee
  checkpoints?: AgentTaskTimelineEvent[]
  relatedResources?: Array<{ label: string; href?: string }>
  metrics?: { tokens?: number; cost?: string; confidence?: number }
}
export interface AgentTaskQueueProps {
  tasks?: AgentTask[]
  activeTaskId?: string | null
  autoStart?: boolean
  concurrencyLimit?: number
  isProcessing?: boolean
  showTimeline?: boolean
  timestamp?: string
  className?: string
  onStartTask?: (taskId: string) => void
  onPauseTask?: (taskId: string) => void
  onResumeTask?: (taskId: string) => void
  onCancelTask?: (taskId: string) => void
  onReorder?: (taskIds: string[]) => void
  onToggleAutoStart?: (value: boolean) => void
  onClearCompleted?: () => void
  onAddTask?: () => void
}

const sampleTasks: AgentTask[] = [
  {
    id: "pricing",
    title: "Collect competitor pricing",
    description: "Review public pricing pages and normalize plan details.",
    status: "running",
    progress: 62,
    priority: "high",
    tool: "Web research",
    updatedLabel: "Updated 2 min ago",
    estimatedDuration: "4 min remaining",
    checkpoints: [
      {
        id: "urls",
        title: "Find primary sources",
        status: "completed",
        timestamp: "09:02",
      },
      {
        id: "extract",
        title: "Extract plan details",
        status: "active",
        timestamp: "09:08",
      },
      { id: "normalize", title: "Normalize pricing", status: "pending" },
    ],
    relatedResources: [
      { label: "pricing-data.json" },
      { label: "source-log.txt" },
    ],
    metrics: { tokens: 1840, cost: "$0.21", confidence: 0.84 },
  },
  {
    id: "standups",
    title: "Summarize weekly standups",
    description: "Combine transcripts and identify team blockers.",
    status: "queued",
    priority: "medium",
    tool: "Transcription",
    updatedLabel: "Next in queue",
  },
  {
    id: "release",
    title: "Draft release notes",
    description: "Prepare customer-facing highlights for the next release.",
    status: "queued",
    priority: "high",
    tool: "Documentation",
    updatedLabel: "Queued",
  },
  {
    id: "security",
    title: "Review security prompts",
    description: "Evaluate policy edge cases before publishing.",
    status: "paused",
    progress: 34,
    priority: "high",
    tool: "Safety review",
    updatedLabel: "Paused for approval",
  },
  {
    id: "analytics",
    title: "Refresh analytics snapshot",
    status: "completed",
    progress: 100,
    tool: "Metrics pipeline",
    updatedLabel: "Completed 18:40",
  },
  {
    id: "contacts",
    title: "Sync CRM contacts",
    status: "failed",
    tool: "CRM connector",
    updatedLabel: "API timeout",
  },
]

const taskStatusText: Record<AgentTaskStatus, string> = {
  queued: "Queued",
  running: "Running",
  completed: "Complete",
  failed: "Failed",
  blocked: "Blocked",
  paused: "Paused",
}
const taskStatusClass: Record<AgentTaskStatus, string> = {
  queued: "text-text-secondary",
  running: "text-accent-600",
  completed: "text-green-600",
  failed: "text-red-600",
  blocked: "text-amber-700",
  paused: "text-text-secondary",
}

function TaskControl({
  task,
  disabled,
  props,
}: {
  task: AgentTask
  disabled: boolean
  props: AgentTaskQueueProps
}) {
  if (task.status === "running")
    return (
      <Button
        size="xs"
        variant="secondary"
        leadingIcon={Pause}
        disabled={disabled}
        onClick={() => props.onPauseTask?.(task.id)}
      >
        Pause
      </Button>
    )
  if (task.status === "paused")
    return (
      <Button
        size="xs"
        variant="secondary"
        leadingIcon={Play}
        disabled={disabled}
        onClick={() => props.onResumeTask?.(task.id)}
      >
        Resume
      </Button>
    )
  if (task.status === "queued")
    return (
      <Button
        size="xs"
        variant="secondary"
        leadingIcon={Play}
        disabled={disabled}
        onClick={() => props.onStartTask?.(task.id)}
      >
        Start
      </Button>
    )
  if (task.status === "failed")
    return (
      <Button
        size="xs"
        variant="secondary"
        leadingIcon={RefreshCw}
        disabled={disabled}
        onClick={() => props.onCancelTask?.(task.id)}
      >
        Reset
      </Button>
    )
  return null
}

export function TaskQueue(props: AgentTaskQueueProps) {
  const {
    tasks,
    activeTaskId = null,
    autoStart = true,
    concurrencyLimit = 1,
    isProcessing = false,
    showTimeline = true,
    timestamp = "Updated moments ago",
    className,
  } = props
  const records = tasks?.length ? tasks : sampleTasks
  const ordered = activeTaskId
    ? [...records].sort((a, b) =>
        a.id === activeTaskId ? -1 : b.id === activeTaskId ? 1 : 0
      )
    : records
  const queued = records.filter((task) => task.status === "queued")
  const completed = records.filter((task) => task.status === "completed").length
  return (
    <section
      className={cn(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
      aria-label="Agent task queue"
    >
      <header className="border-separator-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-text-secondary text-xs font-medium">
            Execution queue
          </p>
          <h2 className="text-text-primary mt-1 text-lg font-semibold">
            Active work
          </h2>
          <p className="text-text-secondary mt-1 text-sm">
            Monitor current work and control the tasks waiting to run.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="small"
            variant="secondary"
            leadingIcon={SlidersHorizontal}
            onClick={() => props.onReorder?.(queued.map((task) => task.id))}
          >
            Optimize
          </Button>
          <Button size="small" leadingIcon={Plus} onClick={props.onAddTask}>
            Add task
          </Button>
        </div>
      </header>
      <div className="border-separator-border text-text-secondary flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5 text-xs">
        <span>
          {records.filter((task) => task.status === "running").length} running
        </span>
        <span>{queued.length} queued</span>
        <span>{completed} complete</span>
        <span>Limit {concurrencyLimit}</span>
        <Switch
          size="sm"
          isSelected={autoStart}
          onChange={props.onToggleAutoStart}
          className="ml-auto"
        >
          Auto-start
        </Switch>
      </div>
      <div>
        {ordered.map((task) => (
          <article
            key={task.id}
            className="border-separator-border border-b last:border-0"
          >
            <div className="flex items-start gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-text-primary text-sm font-medium">
                    {task.title}
                  </h3>
                  <span className={cn("text-xs", taskStatusClass[task.status])}>
                    {taskStatusText[task.status]}
                  </span>
                </div>
                {task.description && (
                  <p className="text-text-secondary mt-1 text-xs leading-5">
                    {task.description}
                  </p>
                )}
                <div className="text-text-secondary mt-2 flex flex-wrap gap-x-3 text-xs">
                  {task.tool && <span>{task.tool}</span>}
                  {task.updatedLabel && <span>{task.updatedLabel}</span>}
                  {task.estimatedDuration && (
                    <span>{task.estimatedDuration}</span>
                  )}
                </div>
                {typeof task.progress === "number" && (
                  <div className="mt-3 flex items-center gap-3">
                    <div
                      className="bg-background-secondary-default h-1.5 flex-1 overflow-hidden rounded-full"
                      role="progressbar"
                      aria-label={`${task.title} progress`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={task.progress}
                    >
                      <span
                        className="bg-accent-500 block h-full"
                        style={{
                          width: `${Math.max(0, Math.min(100, task.progress))}%`,
                        }}
                      />
                    </div>
                    <span className="text-text-secondary text-xs tabular-nums">
                      {task.progress}%
                    </span>
                  </div>
                )}
              </div>
              <TaskControl task={task} disabled={isProcessing} props={props} />
            </div>
            {(task.checkpoints?.length ||
              task.metrics ||
              task.relatedResources?.length) && (
              <details className="group px-4 pb-3">
                <summary className="text-text-secondary flex w-fit cursor-pointer list-none items-center gap-1 text-xs">
                  <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
                  Details
                </summary>
                <div className="bg-background-secondary-default mt-3 grid gap-4 rounded-lg p-3 text-xs sm:grid-cols-2">
                  {showTimeline && task.checkpoints && (
                    <ol className="space-y-2">
                      {task.checkpoints.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between gap-3"
                        >
                          <span className="text-text-primary">
                            {item.title}
                          </span>
                          <span className="text-text-secondary">
                            {item.timestamp || item.status}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                  <div className="text-text-secondary space-y-2">
                    {task.metrics?.tokens !== undefined && (
                      <p>{task.metrics.tokens.toLocaleString()} tokens</p>
                    )}
                    {task.metrics?.cost && (
                      <p>{task.metrics.cost} estimated cost</p>
                    )}
                    {task.metrics?.confidence !== undefined && (
                      <p>
                        {Math.round(task.metrics.confidence * 100)}% confidence
                      </p>
                    )}
                    {task.relatedResources?.map((resource) =>
                      resource.href ? (
                        <a
                          className="text-accent-600 block"
                          key={resource.label}
                          href={resource.href}
                        >
                          {resource.label}
                        </a>
                      ) : (
                        <p key={resource.label}>{resource.label}</p>
                      )
                    )}
                  </div>
                </div>
              </details>
            )}
          </article>
        ))}
      </div>
      <footer className="border-separator-border text-text-secondary flex flex-wrap items-center gap-3 border-t px-4 py-3 text-xs">
        <span>{timestamp}</span>
        <span>{records.length} tasks</span>
        {completed > 0 && (
          <button
            type="button"
            className="text-text-primary ml-auto"
            onClick={props.onClearCompleted}
          >
            Clear completed
          </button>
        )}
      </footer>
    </section>
  )
}
