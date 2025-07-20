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
import { AgentGrammarChecker } from "@/components/agents-ui/agent-grammar-checker"
import { useState } from "react"

export default function AgentGrammarCheckerChat() {
  const [text, setText] = useState("Their going to the store to buy some groceries for there family.")
  
  const issues = [
    {
      id: "1",
      type: "grammar" as const,
      text: "Their",
      suggestion: "They're",
      message: "Use 'They're' (they are) instead of 'Their' (possessive)",
      description: "Use 'They're' (they are) instead of 'Their' (possessive)",
      position: { start: 0, end: 5 },
      severity: "error" as const
    },
    {
      id: "2",
      type: "spelling" as const,
      text: "there",
      suggestion: "their",
      message: "Use 'their' (possessive) instead of 'there' (location)",
      description: "Use 'their' (possessive) instead of 'there' (location)",
      position: { start: 52, end: 57 },
      severity: "warning" as const
    }
  ]

  const messages = [
    {
      id: 1,
      role: "user" as const,
      content: "Can you check the grammar in this sentence for me? 'Their going to the store to buy some groceries for there family.'"
    },
    {
      id: 2,
      role: "assistant" as const,
      content: "I'll analyze your text for grammar and spelling issues.",
      component: (
        <AgentGrammarChecker
          text={text}
          issues={issues}
          onTextChange={setText}
          onAcceptSuggestion={(issueId) => console.log("Accept suggestion:", issueId)}
          onRejectSuggestion={(issueId) => console.log("Reject suggestion:", issueId)}
          onReanalyze={() => console.log("Analyze text")}
          onCopy={() => console.log("Copy text")}
          onRegenerateResponse={() => console.log("Regenerate")}
          className="max-w-2xl"
        />
      )
    }
  ]

  return (
    <div className="flex h-[700px] w-full flex-col overflow-hidden">
      <div className="border-b p-3">
        <h3 className="font-medium">Grammar Checking Chat</h3>
        <p className="text-sm text-muted-foreground">
          Showing how the grammar checker works in a chat context
        </p>
      </div>

      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="space-y-4 p-4">
          {messages.map((message) => {
            const isAssistant = message.role === "assistant"

            return (
              <Message
                key={message.id}
                className={
                  message.role === "user" ? "justify-end" : "justify-start"
                }
              >
                {isAssistant && (
                  <MessageAvatar
                    src="/avatars/ai.png"
                    alt="AI Assistant"
                    fallback="✍️"
                  />
                )}
                <div className="max-w-[90%] flex-1">
                  {isAssistant ? (
                    <div className="bg-secondary text-foreground rounded-lg p-3 space-y-3">
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