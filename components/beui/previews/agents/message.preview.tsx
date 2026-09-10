"use client"

import { ChatPreview } from "@/components/beui/previews/agents/chat-preview"
import * as React from "react"

export function MessagePreview() {
  return (
    <ChatPreview
      showAvatars
      showMetadata
      assistantVariant="ghost"
      placeholder="Ask a follow-up…"
    />
  )
}
