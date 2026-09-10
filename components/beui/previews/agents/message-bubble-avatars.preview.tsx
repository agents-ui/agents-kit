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
import { StreamingResponse } from "@/components/beui/components/agents/streaming-response"
import { Bot, RotateCcw, User } from "lucide-react"
import { AnimatePresence } from "motion/react"
import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"

export function MessageBubbleAvatarsPreview() {
  const timer = useRef<number | undefined>(undefined)
  const [run, setRun] = useState(0)
  const [step, setStep] = useState(0)

  const replay = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current)
    setStep(0)
    setRun((value) => value + 1)
  }, [])

  useEffect(() => {
    if (step >= 2) return
    timer.current = window.setTimeout(
      () => setStep((value) => value + 1),
      step === 0 ? 650 : 900
    )
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [step])

  return (
    <div className="flex h-[410px] w-full max-w-xl flex-col justify-center px-3">
      <MessageGroup key={run} spacing="default">
        <Message from="user">
          <MessageAvatar className="bg-foreground text-background">
            <User />
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>
              <span className="text-foreground/70 font-medium">You</span>
              <span>Now</span>
            </MessageHeader>
            <MessageBubble variant="solid">
              <MessageBubbleContent>
                Can you group these rider interviews into evidence-backed
                themes?
              </MessageBubbleContent>
            </MessageBubble>
            <MessageFooter>Delivered</MessageFooter>
          </MessageContent>
        </Message>

        <AnimatePresence mode="popLayout">
          {step >= 1 ? (
            <Message key="draft" from="assistant">
              <MessageAvatar>
                <Bot />
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>
                  <span className="text-foreground/70 font-medium">
                    Assistant
                  </span>
                  <span>Just now</span>
                </MessageHeader>
                <MessageBubble variant="soft">
                  <MessageBubbleContent>
                    <StreamingResponse status="complete" showActions={false}>
                      Yes. I’ll preserve each quote and show which interviews
                      support every theme.
                    </StreamingResponse>
                  </MessageBubbleContent>
                </MessageBubble>
              </MessageContent>
            </Message>
          ) : null}

          {step >= 2 ? (
            <Message key="follow-up" from="assistant">
              <MessageAvatar placeholder />
              <MessageContent>
                <MessageBubble variant="soft">
                  <MessageBubbleContent>
                    <StreamingResponse status="complete" showActions={false}>
                      Should the readout prioritize station design or staff
                      assistance?
                    </StreamingResponse>
                  </MessageBubbleContent>
                </MessageBubble>
              </MessageContent>
            </Message>
          ) : null}
        </AnimatePresence>
      </MessageGroup>

      <div className="flex h-11 items-end justify-center">
        <button
          type="button"
          onClick={replay}
          className="border-border text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors outline-none focus-visible:ring-2"
        >
          <RotateCcw className="size-3.5" />
          Replay
        </button>
      </div>
    </div>
  )
}
