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
import { AgentRevenueInsights } from "@/components/agents-ui/agent-revenue-insights"

const messages = [
  {
    id: 1,
    role: "user" as const,
    content: "Give me a quick forecast for enterprise ARR this summer."
  },
  {
    id: 2,
    role: "assistant" as const,
    content: "Here’s the forecast we’re tracking. Base case is +8.6% with stretch levers aiming for +12%.",
  }
]

export default function AgentRevenueInsightsChat() {
  return (
    <div className="flex h-[720px] w-full flex-col overflow-hidden">
      <div className="border-b p-3">
        <h3 className="font-medium">Revenue Strategy Chat</h3>
        <p className="text-sm text-muted-foreground">Agent drops revenue module directly in the thread.</p>
      </div>

      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="space-y-4 p-4">
          {messages.map((message) => {
            const isAssistant = message.role === "assistant"
            return (
              <Message key={message.id} className={isAssistant ? "justify-start" : "justify-end"}>
                {isAssistant && (
                  <MessageAvatar alt="Revenue Agent" fallback="💹" />
                )}
                <div className="max-w-[90%] flex-1">
                  {isAssistant ? (
                    <div className="space-y-3 rounded-lg bg-secondary p-3 text-foreground">
                      <p>{message.content}</p>
                      <AgentRevenueInsights className="bg-background" />
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
