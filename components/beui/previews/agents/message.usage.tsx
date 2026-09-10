"use client"

import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/beui/components/agents/message"
import {
  MessageBubble,
  MessageBubbleContent,
} from "@/components/beui/components/agents/message-bubble"
import * as React from "react"

export function MessageUsage() {
  return (
    <MessageGroup spacing="default">
      <Message from="user" animateIn>
        <MessageAvatar>Y</MessageAvatar>
        <MessageContent>
          <MessageHeader>
            <span>You</span>
            <span>Now</span>
          </MessageHeader>
          <MessageBubble variant="solid">
            <MessageBubbleContent>
              Can you summarize the field report?
            </MessageBubbleContent>
          </MessageBubble>
          <MessageFooter>Delivered</MessageFooter>
        </MessageContent>
      </Message>

      <Message from="assistant">
        <MessageAvatar>AI</MessageAvatar>
        <MessageContent>
          <MessageHeader>
            <span>Assistant</span>
            <span>Just now</span>
          </MessageHeader>
          <MessageBubble variant="soft">
            <MessageBubbleContent>
              The report connects recurring access barriers, rider quotes, and
              open questions.
            </MessageBubbleContent>
          </MessageBubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
