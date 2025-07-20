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
import { AgentVideoEditor } from "@/components/agents-ui/agent-video-editor"
import { useState } from "react"

export default function AgentVideoEditorChat() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(45)
  
  const clips = [
    { id: "1", name: "Intro", startTime: 0, endTime: 30, duration: 30 },
    { id: "2", name: "Main Content", startTime: 30, endTime: 120, duration: 90 },
    { id: "3", name: "Outro", startTime: 120, endTime: 135, duration: 15 }
  ]

  const messages = [
    {
      id: 1,
      role: "user" as const,
      content: "Can you edit this marketing video for me? I need to trim it and add transitions."
    },
    {
      id: 2,
      role: "assistant" as const,
      content: "I'll help you edit your marketing video with professional transitions and trimming.",
      component: (
        <AgentVideoEditor
          videoUrl="sample-video.mp4"
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={135}
          clips={clips}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onSeek={(time) => setCurrentTime(time)}
          onTrim={() => console.log("Trim video")}
          onExport={() => console.log("Export video")}
          onCopy={() => console.log("Copy video")}
          onRegenerateResponse={() => console.log("Regenerate")}
          className="max-w-2xl"
        />
      )
    }
  ]

  return (
    <div className="flex h-[700px] w-full flex-col overflow-hidden">
      <div className="border-b p-3">
        <h3 className="font-medium">Video Editing Chat</h3>
        <p className="text-sm text-muted-foreground">
          Showing how the video editor works in a chat context
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
                    fallback="🎬"
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