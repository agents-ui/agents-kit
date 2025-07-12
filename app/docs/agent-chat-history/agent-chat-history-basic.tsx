"use client"

import { AgentChatHistory, ChatSession } from "@/components/agents-ui/agent-chat-history"
import { useState } from "react"

export default function AgentChatHistoryBasic() {
  const [selectedId, setSelectedId] = useState("1")
  
  const sessions: ChatSession[] = [
    {
      id: "1",
      title: "Building a React App",
      messages: [
        {
          id: "1-1",
          role: "user",
          content: "Can you help me build a simple React app with TypeScript?",
          timestamp: new Date(Date.now() - 3600000),
          tokens: 15
        },
        {
          id: "1-2",
          role: "assistant",
          content: "I'd be happy to help you build a React app with TypeScript! Let me guide you through the process step by step.",
          timestamp: new Date(Date.now() - 3500000),
          tokens: 28,
          model: "gpt-4"
        }
      ],
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3500000),
      starred: true
    },
    {
      id: "2",
      title: "Debugging JavaScript Error",
      messages: [
        {
          id: "2-1",
          role: "user",
          content: "I'm getting 'Cannot read property of undefined' error in my code",
          timestamp: new Date(Date.now() - 86400000),
          tokens: 12
        },
        {
          id: "2-2",
          role: "assistant",
          content: "This error typically occurs when you're trying to access a property on a value that is undefined. Let me help you debug this.",
          timestamp: new Date(Date.now() - 86300000),
          tokens: 35,
          model: "claude-3"
        }
      ],
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86300000)
    },
    {
      id: "3",
      title: "Python Data Analysis",
      messages: [
        {
          id: "3-1",
          role: "user",
          content: "How can I analyze CSV data using pandas in Python?",
          timestamp: new Date(Date.now() - 172800000),
          tokens: 11
        },
        {
          id: "3-2",
          role: "assistant",
          content: "Pandas is excellent for CSV data analysis! I'll show you the essential operations you need to know.",
          timestamp: new Date(Date.now() - 172700000),
          tokens: 24,
          model: "gpt-4"
        }
      ],
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172700000),
      archived: true
    }
  ]

  return (
    <div className="h-[500px] border rounded-lg overflow-hidden">
      <AgentChatHistory
        sessions={sessions}
        selectedSessionId={selectedId}
        onSelectSession={(session) => {
          setSelectedId(session.id)
          console.log("Selected session:", session.title)
        }}
        onDeleteSession={(id) => console.log("Delete session:", id)}
        onStarSession={(id) => console.log("Star session:", id)}
        onArchiveSession={(id) => console.log("Archive session:", id)}
        onExportSession={(id) => console.log("Export session:", id)}
      />
    </div>
  )
}
