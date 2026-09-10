"use client"

import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/beui/components/agents/message"
import {
  MessageBubble,
  MessageBubbleCollapsible,
  MessageBubbleContent,
} from "@/components/beui/components/agents/message-bubble"
import { StreamingResponse } from "@/components/beui/components/agents/streaming-response"
import { Bot } from "lucide-react"
import * as React from "react"

export function MessageBubbleCollapsiblePreview() {
  return (
    <div className="flex h-[410px] w-full max-w-xl items-start px-3 pt-14">
      <Message from="assistant">
        <MessageAvatar>
          <Bot />
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>
            <span className="text-foreground/70 font-medium">Assistant</span>
            <span>Summary</span>
          </MessageHeader>
          <MessageBubble variant="soft" animateIn={false}>
            <MessageBubbleContent className="max-w-[90%]">
              <StreamingResponse status="complete" showActions={false}>
                <MessageBubbleCollapsible collapsedLines={4}>
                  <p>
                    The field report is ready for review. Twelve rider
                    interviews and two station walkthroughs point to the same
                    three barriers: unclear lift signage, uneven platform
                    access, and inconsistent staff assistance.
                  </p>
                  <p>
                    The evidence is strongest around signage because nine
                    participants described the same failure point. Platform
                    access remains provisional until the second walkthrough is
                    complete.
                  </p>
                  <p>
                    Before sharing the readout, remove exact home locations and
                    ask the local team to validate the translated participant
                    quotes.
                  </p>
                </MessageBubbleCollapsible>
              </StreamingResponse>
            </MessageBubbleContent>
          </MessageBubble>
        </MessageContent>
      </Message>
    </div>
  )
}
