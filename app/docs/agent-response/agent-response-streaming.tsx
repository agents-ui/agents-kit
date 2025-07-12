"use client"

import { AgentResponse } from "@/components/agents-ui/agent-response"
import { useState, useEffect } from "react"

export default function AgentResponseStreaming() {
  const [message, setMessage] = useState("")
  const [isStreaming, setIsStreaming] = useState(true)
  
  const fullMessage = `I'm analyzing your request in real-time. Let me process this information for you...

Based on the current data:
- System performance is optimal
- All services are running smoothly
- No critical issues detected

I'll continue monitoring and provide updates as needed.`

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < fullMessage.length) {
        setMessage(fullMessage.slice(0, currentIndex + 10))
        currentIndex += 10
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <AgentResponse
      message={message}
      isStreaming={isStreaming}
      onRegenerate={isStreaming ? undefined : () => {
        setMessage("")
        setIsStreaming(true)
        // Re-run the streaming effect
        let currentIndex = 0
        const interval = setInterval(() => {
          if (currentIndex < fullMessage.length) {
            setMessage(fullMessage.slice(0, currentIndex + 10))
            currentIndex += 10
          } else {
            setIsStreaming(false)
            clearInterval(interval)
          }
        }, 50)
      }}
    />
  )
}
