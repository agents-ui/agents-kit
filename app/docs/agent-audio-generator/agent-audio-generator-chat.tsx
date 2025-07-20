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
import { AgentAudioGenerator } from "@/components/agents-ui/agent-audio-generator"
import { useState } from "react"

export default function AgentAudioGeneratorChat() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(21)
  
  const messages = [
    {
      id: 1,
      role: "user" as const,
      content: "Can you generate an audio narration for my presentation?"
    },
    {
      id: 2,
      role: "assistant" as const,
      content: "I'll create a professional audio narration for your presentation.",
      component: (
        <AgentAudioGenerator
          audioUrl="sample-audio.mp3"
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={62}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onSeek={(time) => setCurrentTime(time)}
          onExport={() => console.log("Export audio")}
          onCopy={() => console.log("Copy audio")}
          onEdit={() => console.log("Edit audio")}
          onRegenerateResponse={() => console.log("Regenerate")}
          language="English (US)"
          speed="Normal"
          tone="Professional"
          className="max-w-lg"
        />
      )
    }
  ]

  return (
    <div className="flex h-[600px] w-full flex-col overflow-hidden">
      <div className="border-b p-3">
        <h3 className="font-medium">Audio Generation Chat</h3>
        <p className="text-sm text-muted-foreground">
          Showing how the audio generator works in a chat context
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
                    fallback="🔊"
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