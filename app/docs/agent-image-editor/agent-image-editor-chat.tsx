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
import { AgentImageEditor } from "@/components/agents-ui/agent-image-editor"
import { useState } from "react"

export default function AgentImageEditorChat() {
  const [currentVariation, setCurrentVariation] = useState("1")
  
  const variations = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      label: "Variation one",
      timestamp: "2 minutes ago"
    },
    {
      id: "2", 
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      label: "Variation two",
      timestamp: "3 minutes ago"
    }
  ]

  const messages = [
    {
      id: 1,
      role: "user" as const,
      content: "Can you create a landscape image for my website header?"
    },
    {
      id: 2,
      role: "assistant" as const,
      content: "I'll create a beautiful landscape image for your website header.",
      component: (
        <AgentImageEditor
          imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
          variations={variations}
          currentVariation={currentVariation}
          onExport={() => console.log("Export image")}
          onCopy={() => console.log("Copy image")}
          onCreateVariation={() => console.log("Create variation")}
          onAdjust={() => console.log("Adjust image")}
          onEnhance={() => console.log("Enhance image")}
          onRegenerateResponse={() => console.log("Regenerate")}
          className="max-w-md"
        />
      )
    }
  ]

  return (
    <div className="flex h-[600px] w-full flex-col overflow-hidden">
      <div className="border-b p-3">
        <h3 className="font-medium">Image Generation Chat</h3>
        <p className="text-sm text-muted-foreground">
          Showing how the image editor works in a chat context
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
                    fallback="🎨"
                  />
                )}
                <div className="max-w-[85%] flex-1 sm:max-w-[75%]">
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