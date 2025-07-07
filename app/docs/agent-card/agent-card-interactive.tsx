"use client"

import { AgentCard } from "@/components/agents-ui/agent-card"
import { Bot, Brain, FileSearch, MessageSquare } from "lucide-react"
import { useState } from "react"

export default function AgentCardInteractive() {
  const [status, setStatus] = useState<"idle" | "thinking" | "running" | "paused" | "error" | "completed">("idle")

  const handleAction = (action: string) => {
    switch (action) {
      case "start":
        setStatus("running")
        // Simulate task completion after 3 seconds
        setTimeout(() => setStatus("completed"), 3000)
        break
      case "pause":
        setStatus("paused")
        break
      case "resume":
        setStatus("running")
        break
      case "stop":
        setStatus("idle")
        break
      case "restart":
        setStatus("running")
        setTimeout(() => setStatus("completed"), 3000)
        break
    }
  }

  const capabilities = [
    { 
      name: "Research", 
      description: "Can search and analyze information from various sources",
      icon: <FileSearch className="h-3 w-3" />
    },
    { 
      name: "Analysis", 
      description: "Performs deep analysis and provides insights",
      icon: <Brain className="h-3 w-3" />
    },
    { 
      name: "Chat", 
      description: "Engages in natural conversations",
      icon: <MessageSquare className="h-3 w-3" />
    },
  ]

  return (
    <AgentCard
      name="AI Assistant"
      description="A versatile AI agent that can help with research, analysis, and conversation"
      avatar="/mistral_logo.png"
      status={status}
      capabilities={capabilities}
      onAction={handleAction}
    />
  )
}
