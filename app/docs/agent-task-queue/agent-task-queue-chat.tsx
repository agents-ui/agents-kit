"use client"

import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/prompt-kit/chat-container"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/prompt-kit/message"
import { AgentTaskQueue, type AgentTask } from "@/components/agents-ui/agent-task-queue"

const chatTasks: AgentTask[] = [
  {
    id: "task-01",
    title: "Summarize customer escalations",
    description: "Aggregate insights from last 200 escalations for leadership brief.",
    status: "running",
    progress: 68,
    priority: "high",
    estimatedDuration: "~2 min remaining",
    tool: "Inbox connector",
    updatedLabel: "Running • just now",
    checkpoints: [
      {
        id: "c-1",
        title: "Ingest conversations",
        status: "completed",
        timestamp: "14:20",
      },
      {
        id: "c-2",
        title: "Detect product themes",
        status: "active",
        timestamp: "14:23",
      },
      {
        id: "c-3",
        title: "Generate summary",
        status: "pending",
      },
    ],
    metrics: {
      tokens: 980,
      cost: "$0.09",
      confidence: 0.87,
    },
  },
  {
    id: "task-02",
    title: "Draft product brief",
    description: "Outline launch narrative for onboarding rework.",
    status: "queued",
    priority: "medium",
    tool: "Docs writer",
    updatedLabel: "Queued behind 1 task",
  },
  {
    id: "task-03",
    title: "Compose weekly customer digest",
    description: "Generate customer story highlights for marketing",
    status: "paused",
    progress: 52,
    priority: "medium",
    tool: "Story crafter",
    updatedLabel: "Paused • awaiting approval",
  },
  {
    id: "task-04",
    title: "Send adoption report",
    description: "Package adoption metrics with insights for leadership.",
    status: "completed",
    progress: 100,
    priority: "medium",
    tool: "Analytics agent",
    updatedLabel: "Completed 14:05",
  },
]

export default function AgentTaskQueueChat() {
  const messages = [
    {
      id: 1,
      role: "user" as const,
      content: "Give me a snapshot of everything the research agent is working on right now.",
    },
    {
      id: 2,
      role: "assistant" as const,
      content: "Here’s the real-time task queue with live progress, blockers, and recent completions.",
      component: (
        <AgentTaskQueue
          tasks={chatTasks}
          concurrencyLimit={2}
          autoStart
          onToggleAutoStart={() => undefined}
          onStartTask={(taskId) => console.log("Start", taskId)}
          onPauseTask={(taskId) => console.log("Pause", taskId)}
          onResumeTask={(taskId) => console.log("Resume", taskId)}
          onCancelTask={(taskId) => console.log("Reset", taskId)}
          onReorder={(taskIds) => console.log("Reorder", taskIds)}
          onClearCompleted={() => console.log("Clear completed")}
          onAddTask={() => console.log("Add task")}
          className="max-w-3xl"
        />
      ),
    },
  ]

  return (
    <div className="flex h-[720px] w-full flex-col overflow-hidden">
      <div className="border-b p-3">
        <h3 className="font-medium">Task Queue Monitoring Chat</h3>
        <p className="text-sm text-muted-foreground">
          Demonstrates how the queue appears inside an agent conversation
        </p>
      </div>

      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="space-y-4 p-4">
          {messages.map((message) => {
            const isAssistant = message.role === "assistant"

            return (
              <Message
                key={message.id}
                className={isAssistant ? "justify-start" : "justify-end"}
              >
                {isAssistant && (
                  <MessageAvatar
                    src="/avatars/ai.png"
                    alt="AI Agent"
                    fallback="AG"
                  />
                )}
                <div className="max-w-[90%] flex-1">
                  {isAssistant ? (
                    <div className="space-y-3 rounded-lg bg-secondary p-3 text-foreground">
                      <p>{message.content}</p>
                      {message.component}
                    </div>
                  ) : (
                    <MessageContent className="bg-primary text-primary-foreground">
                      {message.content}
                    </MessageContent>
                  )}
                </div>
              </Message>
            )
          })}
        </ChatContainerContent>
      </ChatContainerRoot>
    </div>
  )
}
