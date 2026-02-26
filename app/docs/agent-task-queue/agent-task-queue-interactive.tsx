"use client"

import { AgentTaskQueue, type AgentTask } from "@/components/agents-ui/agent-task-queue"
import { useCallback, useMemo, useState } from "react"

export default function AgentTaskQueueInteractive() {
  const [autoStart, setAutoStart] = useState(true)
  const [activeTaskId, setActiveTaskId] = useState<string | null>("pipeline")
  const [isProcessing, setIsProcessing] = useState(false)
  const [tasks, setTasks] = useState<AgentTask[]>([
    {
      id: "pipeline",
      title: "Pipeline rollout",
      description: "Deploy the updated embeddings pipeline to production.",
      status: "running",
      progress: 42,
      priority: "high",
      estimatedDuration: "~6 min remaining",
      tool: "Deploy toolkit",
      updatedLabel: "Started 3 min ago",
      checkpoints: [
        {
          id: "pipeline-1",
          title: "Validate config",
          status: "completed",
          timestamp: "11:05",
        },
        {
          id: "pipeline-2",
          title: "Run smoke tests",
          status: "active",
          timestamp: "11:07",
        },
        {
          id: "pipeline-3",
          title: "Roll out",
          status: "pending",
        },
      ],
      metrics: {
        tokens: 640,
        confidence: 0.82,
      },
    },
    {
      id: "legal-review",
      title: "Summarize legal updates",
      description: "Digest new policy documents for compliance team.",
      status: "queued",
      priority: "medium",
      tool: "Knowledge agent",
      updatedLabel: "Queued · ETA 5 min",
    },
    {
      id: "demo-prep",
      title: "Prepare launch demo",
      description: "Generate talking points and slide outline.",
      status: "paused",
      progress: 24,
      priority: "high",
      tool: "Presentation assistant",
      updatedLabel: "Paused · awaiting assets",
    },
    {
      id: "reporting",
      title: "Generate adoption report",
      description: "Compile adoption metrics for Q4 stakeholders.",
      status: "completed",
      progress: 100,
      priority: "medium",
      tool: "Analytics agent",
      updatedLabel: "Completed 10:45",
    },
    {
      id: "shadow-test",
      title: "Shadow test new search",
      description: "Run red team prompts against updated search stack.",
      status: "failed",
      priority: "medium",
      tool: "Safety toolkit",
      updatedLabel: "Failed · validation error",
    },
  ])

  const updateTask = useCallback((taskId: string, updater: (task: AgentTask) => AgentTask) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? updater(task) : task)))
  }, [])

  const setProcessing = useCallback((value: boolean) => {
    setIsProcessing(value)
  }, [])

  const simulateAction = useCallback((action: () => void) => {
    setProcessing(true)
    setTimeout(() => {
      action()
      setProcessing(false)
    }, 400)
  }, [setProcessing])

  const handleStartTask = useCallback(
    (taskId: string) => {
      simulateAction(() => {
        updateTask(taskId, (task) => ({
          ...task,
          status: "running",
          progress: task.progress ?? 8,
          updatedLabel: "Running • just now",
        }))
        setActiveTaskId(taskId)
      })
    },
    [simulateAction, updateTask]
  )

  const handlePauseTask = useCallback(
    (taskId: string) => {
      simulateAction(() => {
        updateTask(taskId, (task) => ({
          ...task,
          status: "paused",
          updatedLabel: "Paused • user action",
        }))
        setActiveTaskId((current) => (current === taskId ? null : current))
      })
    },
    [simulateAction, updateTask]
  )

  const handleResumeTask = useCallback(
    (taskId: string) => {
      simulateAction(() => {
        updateTask(taskId, (task) => ({
          ...task,
          status: "running",
          updatedLabel: "Resumed • just now",
        }))
        setActiveTaskId(taskId)
      })
    },
    [simulateAction, updateTask]
  )

  const handleCancelTask = useCallback(
    (taskId: string) => {
      simulateAction(() => {
        updateTask(taskId, (task) => ({
          ...task,
          status: "queued",
          progress: undefined,
          updatedLabel: "Queued • reset",
        }))
        if (activeTaskId === taskId) {
          setActiveTaskId(null)
        }
      })
    },
    [activeTaskId, simulateAction, updateTask]
  )

  const handleReorder = useCallback((taskIds: string[]) => {
    setTasks((prev) => {
      const queue = prev.filter((task) => taskIds.includes(task.id))
      const nonQueue = prev.filter((task) => !taskIds.includes(task.id))
      const orderedQueue = taskIds
        .map((id) => queue.find((task) => task.id === id))
        .filter((task): task is AgentTask => Boolean(task))
      return [...nonQueue, ...orderedQueue]
    })
  }, [])

  const handleClearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => task.status !== "completed"))
  }, [])

  const handleAddTask = useCallback(() => {
    const id = `task-${Date.now()}`
    setTasks((prev) => [
      ...prev,
      {
        id,
        title: "Enrich CRM context",
        description: "Fill missing firmographic data for enterprise accounts.",
        status: "queued",
        priority: "medium",
        tool: "Enrichment agent",
        updatedLabel: "Added just now",
      },
    ])
  }, [])

  const concurrencyLimit = useMemo(() => (autoStart ? 2 : 1), [autoStart])

  return (
    <AgentTaskQueue
      tasks={tasks}
      activeTaskId={activeTaskId}
      autoStart={autoStart}
      concurrencyLimit={concurrencyLimit}
      isProcessing={isProcessing}
      className="mx-auto w-full max-w-5xl"
      onToggleAutoStart={setAutoStart}
      onStartTask={handleStartTask}
      onPauseTask={handlePauseTask}
      onResumeTask={handleResumeTask}
      onCancelTask={handleCancelTask}
      onReorder={handleReorder}
      onClearCompleted={handleClearCompleted}
      onAddTask={handleAddTask}
    />
  )
}
