"use client"

import * as React from "react"
import {
  AlarmClockCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CircleEllipsis,
  CirclePause,
  CirclePlay,
  Clock,
  ListChecks,
  PlayCircle,
  RefreshCw,
  Settings2,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  metrics?: {
    tokens?: number
    cost?: string
    confidence?: number
  }
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

type StatusVisual = {
  label: string
  toneClass: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

type TimelineVisual = {
  dotClass: string
  connectorClass: string
}

const statusConfig: Record<AgentTaskStatus, StatusVisual> = {
  queued: {
    label: "Queued",
    toneClass:
      "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/40",
    icon: CircleEllipsis,
  },
  running: {
    label: "Running",
    toneClass:
      "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-900/50",
    icon: PlayCircle,
  },
  completed: {
    label: "Completed",
    toneClass:
      "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-900/40",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    toneClass:
      "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-900/40",
    icon: AlertTriangle,
  },
  blocked: {
    label: "Blocked",
    toneClass:
      "bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-900/50",
    icon: AlarmClockCheck,
  },
  paused: {
    label: "Paused",
    toneClass:
      "bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-900/40 dark:text-slate-200 dark:border-slate-800",
    icon: CirclePause,
  },
}

const timelineConfig: Record<AgentTaskTimelineStatus, TimelineVisual> = {
  completed: {
    dotClass: "bg-blue-600 border-blue-600",
    connectorClass: "bg-blue-200 dark:bg-blue-900/60",
  },
  active: {
    dotClass: "bg-blue-100 border-blue-600",
    connectorClass: "bg-blue-200 dark:bg-blue-900/60",
  },
  pending: {
    dotClass: "bg-muted border-muted-foreground/50",
    connectorClass: "bg-muted dark:bg-muted/50",
  },
}

const priorityBadgeClass: Record<AgentTaskPriority, string> = {
  high: "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-200",
  medium: "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-200",
  low: "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200",
}

function formatPercentage(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "0%"
  return `${Math.min(100, Math.max(0, Math.round(value)))}%`
}

export function AgentTaskQueue({
  tasks,
  activeTaskId = null,
  autoStart = true,
  concurrencyLimit = 1,
  isProcessing = false,
  showTimeline = true,
  timestamp = "Updated moments ago",
  className,
  onStartTask,
  onPauseTask,
  onResumeTask,
  onCancelTask,
  onReorder,
  onToggleAutoStart,
  onClearCompleted,
  onAddTask,
}: AgentTaskQueueProps) {
  const defaultTasks: AgentTask[] = React.useMemo(
    () => [
      {
        id: "1",
        title: "Gather competitor pricing",
        description: "Scrape pricing pages and normalize currency for dashboard ingest.",
        status: "running",
        progress: 62,
        priority: "high",
        createdAt: "2025-01-21T09:00:00Z",
        updatedAt: "2025-01-21T09:12:00Z",
        updatedLabel: "Updated 2 min ago",
        estimatedDuration: "~4 min remaining",
        tool: "Web crawler · Headless",
        checkpoints: [
          {
            id: "1",
            title: "Discover seed URLs",
            status: "completed",
            timestamp: "09:02",
          },
          {
            id: "2",
            title: "Extract pricing blocks",
            status: "active",
            timestamp: "09:08",
          },
          {
            id: "3",
            title: "Normalize currency",
            status: "pending",
          },
          {
            id: "4",
            title: "Generate summary",
            status: "pending",
          },
        ],
        relatedResources: [
          { label: "pricing-catalog.json" },
          { label: "open-ai-scraper-logs" },
        ],
        metrics: {
          tokens: 1840,
          cost: "$0.21",
          confidence: 0.84,
        },
      },
      {
        id: "2",
        title: "Summarize weekly standups",
        description: "Combine transcripts and highlight blockers for each squad.",
        status: "queued",
        priority: "medium",
        tool: "Speech-to-text",
        updatedLabel: "Queued · prioritizing transcripts",
        metrics: {
          tokens: 960,
          confidence: 0.72,
        },
      },
      {
        id: "3",
        title: "Generate release notes",
        description: "Draft release summary for v3.8 with customer facing highlights.",
        status: "queued",
        priority: "high",
        tool: "Docs agent",
        updatedLabel: "Queued behind 1 task",
      },
      {
        id: "4",
        title: "Red Team security prompts",
        description: "Evaluate jailbreak prompts for new policies.",
        status: "paused",
        progress: 34,
        priority: "high",
        tool: "Safety toolkit",
        updatedLabel: "Paused · awaiting policy review",
      },
      {
        id: "5",
        title: "Refresh analytics snapshot",
        description: "Rebuild agent performance metrics for weekly review.",
        status: "completed",
        progress: 100,
        priority: "medium",
        tool: "Metrics pipeline",
        updatedAt: "2025-01-20T18:40:00Z",
        updatedLabel: "Completed 18:40",
      },
      {
        id: "6",
        title: "Sync CRM contacts",
        description: "Resolve duplicates and push latest deal stages to warehouse.",
        status: "failed",
        priority: "medium",
        tool: "CRM connector",
        updatedLabel: "Failed · API timeout",
      },
    ],
    []
  )

  const displayTasks = tasks && tasks.length > 0 ? tasks : defaultTasks
  const queueTasks = displayTasks.filter((task) => task.status === "queued")
  const activeTask =
    displayTasks.find((task) => task.id === activeTaskId) ??
    displayTasks.find((task) => task.status === "running") ??
    null
  const pausedTasks = displayTasks.filter((task) => task.status === "paused")
  const completedTasks = displayTasks.filter((task) => task.status === "completed")
  const failedTasks = displayTasks.filter((task) => task.status === "failed")

  const totalTasks = displayTasks.length
  const completedCount = completedTasks.length
  const failedCount = failedTasks.length
  const runningCount = displayTasks.filter((task) => task.status === "running").length

  const successRate = completedCount + failedCount === 0
    ? 100
    : Math.round((completedCount / (completedCount + failedCount)) * 100)

  const handleReorder = () => {
    const queuedIds = queueTasks.map((task) => task.id)
    onReorder?.(queuedIds)
  }

  const renderTaskActions = (task: AgentTask) => {
    const isQueued = task.status === "queued"
    const isRunning = task.status === "running"
    const isPaused = task.status === "paused"

    return (
      <div className="flex items-center gap-2">
        {isQueued && (
          <Button
            size="sm"
            className="h-8"
            onClick={() => onStartTask?.(task.id)}
            disabled={isProcessing}
          >
            <CirclePlay className="mr-1 h-4 w-4" />
            Start
          </Button>
        )}
        {isRunning && (
          <Button
            size="sm"
            variant="secondary"
            className="h-8"
            onClick={() => onPauseTask?.(task.id)}
            disabled={isProcessing}
          >
            <CirclePause className="mr-1 h-4 w-4" />
            Pause
          </Button>
        )}
        {isPaused && (
          <Button
            size="sm"
            className="h-8"
            onClick={() => onResumeTask?.(task.id)}
            disabled={isProcessing}
          >
            <CirclePlay className="mr-1 h-4 w-4" />
            Resume
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="h-8"
          onClick={() => onCancelTask?.(task.id)}
          disabled={isProcessing}
        >
          <RefreshCw className="mr-1 h-4 w-4" />
          Reset
        </Button>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={cn("space-y-4 p-4 w-full", className)}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ListChecks className="h-4 w-4" />
              Multi-agent orchestration
            </div>
            <h2 className="text-xl font-semibold">Autonomous task pipeline</h2>
            <p className="text-sm text-muted-foreground">
              Track how your agent schedules, executes, and recovers complex workstreams across tools.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-900/40"
              )}
            >
              {timestamp}
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={autoStart ? "default" : "outline"}
                  size="sm"
                  className={cn("h-8", autoStart ? "bg-blue-600 hover:bg-blue-700" : "")}
                  onClick={() => onToggleAutoStart?.(!autoStart)}
                >
                  <Zap className="mr-1 h-4 w-4" />
                  Auto-start {autoStart ? "enabled" : "disabled"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Automatically launch queued tasks when slots free up</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={handleReorder}
                >
                  <Settings2 className="mr-1 h-4 w-4" />
                  Optimize order
                </Button>
              </TooltipTrigger>
              <TooltipContent>Let the agent reprioritize the queue by impact</TooltipContent>
            </Tooltip>
            <Button
              variant="secondary"
              size="sm"
              className="h-8"
              onClick={onAddTask}
            >
              <CircleEllipsis className="mr-1 h-4 w-4" />
              Add task
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border bg-muted/40 p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              In flight
              <span className="text-xs">Limit {concurrencyLimit}</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold">{runningCount}</span>
              <span className="text-xs text-muted-foreground">active</span>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/40 p-4 shadow-sm">
            <div className="text-sm text-muted-foreground">Queue depth</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold">{queueTasks.length}</span>
              <span className="text-xs text-muted-foreground">awaiting</span>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/40 p-4 shadow-sm">
            <div className="text-sm text-muted-foreground">Success rate</div>
            <div className="mt-2">
              <Progress value={successRate} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {successRate}% · {completedCount} completed · {failedCount} failed
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/40 p-4 shadow-sm">
            <div className="text-sm text-muted-foreground">Throughput</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold">{totalTasks}</span>
              <span className="text-xs text-muted-foreground">tracked this cycle</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-8 px-2"
              onClick={onClearCompleted}
            >
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Clear completed
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4 rounded-lg border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Active run</h3>
                <p className="text-xs text-muted-foreground">
                  {activeTask ? activeTask.title : "No task is executing right now."}
                </p>
              </div>
              {activeTask && (
                <Badge className={cn("flex items-center gap-1", statusConfig[activeTask.status].toneClass)}>
                  {React.createElement(statusConfig[activeTask.status].icon, {
                    className: "h-3 w-3",
                  })}
                  {statusConfig[activeTask.status].label}
                </Badge>
              )}
            </div>

            {activeTask ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{activeTask.description}</span>
                    <span>{activeTask.estimatedDuration}</span>
                  </div>
                  <Progress value={activeTask.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Tool: {activeTask.tool}</span>
                    <span>{formatPercentage(activeTask.progress)}</span>
                  </div>
                </div>

                {showTimeline && activeTask.checkpoints && activeTask.checkpoints.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Execution timeline</h4>
                    <div className="relative pl-4">
                      <div className="absolute left-1 top-0 h-full w-px bg-muted" aria-hidden />
                      <div className="space-y-4">
                        {activeTask.checkpoints.map((checkpoint, index) => {
                          const visual = timelineConfig[checkpoint.status]
                          const isLast = index === activeTask.checkpoints!.length - 1

                          return (
                            <div key={checkpoint.id} className="relative flex gap-4">
                              <div className="absolute -left-[21px] flex flex-col items-center">
                                <span
                                  className={cn(
                                    "flex h-3 w-3 items-center justify-center rounded-full border-2",
                                    visual.dotClass
                                  )}
                                />
                                {!isLast && (
                                  <span
                                    className={cn(
                                      "mt-1 h-full w-px",
                                      visual.connectorClass
                                    )}
                                  />
                                )}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">{checkpoint.title}</p>
                                  {checkpoint.timestamp && (
                                    <span className="text-xs text-muted-foreground">{checkpoint.timestamp}</span>
                                  )}
                                </div>
                                {checkpoint.description && (
                                  <p className="text-xs text-muted-foreground">{checkpoint.description}</p>
                                )}
                                <Badge
                                  className={cn(
                                    "w-fit bg-muted text-muted-foreground border border-muted-foreground/20"
                                  )}
                                >
                                  {checkpoint.status === "completed"
                                    ? "Completed"
                                    : checkpoint.status === "active"
                                    ? "In progress"
                                    : "Pending"}
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTask.metrics && (
                  <div className="grid gap-3 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground sm:grid-cols-3">
                    {typeof activeTask.metrics.tokens === "number" && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wide">Tokens</p>
                        <p className="text-sm font-medium text-foreground">{activeTask.metrics.tokens.toLocaleString()}</p>
                      </div>
                    )}
                    {activeTask.metrics.cost && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wide">Estimated cost</p>
                        <p className="text-sm font-medium text-foreground">{activeTask.metrics.cost}</p>
                      </div>
                    )}
                    {typeof activeTask.metrics.confidence === "number" && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wide">Confidence</p>
                        <p className="text-sm font-medium text-foreground">{Math.round(activeTask.metrics.confidence * 100)}%</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                Queue is idle · enable auto-start or add a new task to keep the agent busy.
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-lg border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Queue planner</h3>
                <p className="text-xs text-muted-foreground">Upcoming and paused tasks</p>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-900/40">
                {queueTasks.length + pausedTasks.length} tasks
              </Badge>
            </div>
            <ScrollArea className="max-h-[340px] pr-2">
              <div className="space-y-3">
                {[...queueTasks, ...pausedTasks].map((task) => {
                  const config = statusConfig[task.status]
                  return (
                    <div key={task.id} className="space-y-2 rounded-lg border bg-muted/20 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold leading-tight">{task.title}</h4>
                            {task.priority && (
                              <Badge className={cn("text-[10px] uppercase tracking-wide", priorityBadgeClass[task.priority])}>
                                {task.priority} priority
                              </Badge>
                            )}
                          </div>
                          {task.description && (
                            <p className="text-xs text-muted-foreground">{task.description}</p>
                          )}
                        </div>
                        <Badge className={cn("flex items-center gap-1", config.toneClass)}>
                          {React.createElement(config.icon, {
                            className: "h-3 w-3",
                          })}
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {task.updatedLabel || task.updatedAt || "Awaiting slot"}
                          {task.tool && (
                            <>
                              <ChevronRight className="h-3 w-3 text-muted-foreground/70" />
                              {task.tool}
                            </>
                          )}
                        </div>
                        {renderTaskActions(task)}
                      </div>
                    </div>
                  )
                })}

                {[...completedTasks.slice(0, 2), ...failedTasks.slice(0, 1)].length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Recent outcomes
                    </div>
                    {[...completedTasks.slice(0, 2), ...failedTasks.slice(0, 1)].map((task) => {
                      const config = statusConfig[task.status]
                      return (
                        <div key={task.id} className="flex items-center justify-between rounded-lg border bg-muted/10 p-3">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {task.updatedLabel || task.updatedAt || "Completed this cycle"}
                            </p>
                          </div>
                          <Badge className={cn("flex items-center gap-1", config.toneClass)}>
                            {React.createElement(config.icon, {
                              className: "h-3 w-3",
                            })}
                            {config.label}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentTaskQueue.displayName = "AgentTaskQueue"
