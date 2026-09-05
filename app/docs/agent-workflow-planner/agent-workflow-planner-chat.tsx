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
import { AgentWorkflowPlanner } from "@/components/agents-ui/agent-workflow-planner"

const messages = [
  {
    id: 1,
    role: "user" as const,
    content: "Create a rollout workflow for the new onboarding bundle and show me the checkpoints.",
  },
  {
    id: 2,
    role: "assistant" as const,
    content: "Here’s the current plan. I’ll flag when handoffs need your signoff.",
  },
]

export default function AgentWorkflowPlannerChat() {
  return (
    <div className="flex h-[720px] w-full flex-col overflow-hidden">
      <div className="border-b p-3">
        <h3 className="font-medium">Workflow Coaching Chat</h3>
        <p className="text-sm text-muted-foreground">Planner surface embedded inside an agent conversation.</p>
      </div>

      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="space-y-4 p-4">
          {messages.map((message) => {
            const isAssistant = message.role === "assistant"
            return (
              <Message key={message.id} className={isAssistant ? "justify-start" : "justify-end"}>
                {isAssistant && <MessageAvatar src="" alt="Workflow Agent" fallback="WF" />}
                <div className="max-w-[90%] flex-1">
                  {isAssistant ? (
                    <div className="space-y-3 rounded-lg bg-secondary p-3 text-foreground">
                      <p>{message.content}</p>
                      <AgentWorkflowPlanner className="mx-auto max-w-3xl bg-background" />
                    </div>
                  ) : (
                    <MessageContent className="bg-primary text-primary-foreground">{message.content}</MessageContent>
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
