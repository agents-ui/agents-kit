"use client"

import { ChatPreview } from "@/components/beui/previews/agents/chat-preview"
import * as React from "react"

export function MessageBubblePreview() {
  return (
    <ChatPreview
      reply="I found three recurring barriers: unclear lift signage, uneven platform access, and inconsistent staff assistance."
      placeholder="Ask about the field notes…"
    />
  )
}
