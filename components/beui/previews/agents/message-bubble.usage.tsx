"use client"

import {
  MessageBubble,
  MessageBubbleContent,
  MessageBubbleGroup,
} from "@/components/beui/components/agents/message-bubble"
import * as React from "react"

export function MessageBubbleUsage() {
  return (
    <MessageBubbleGroup spacing="default">
      <MessageBubble align="end" variant="solid">
        <MessageBubbleContent>
          Can you summarize the field report?
        </MessageBubbleContent>
      </MessageBubble>

      <MessageBubble align="start" variant="soft">
        <MessageBubbleContent>
          The report connects recurring access barriers, rider quotes, and open
          questions.
        </MessageBubbleContent>
      </MessageBubble>
    </MessageBubbleGroup>
  )
}
