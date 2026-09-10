"use client"

import {
  AgentActivity,
  type AgentActivityItem,
} from "@/components/beui/components/agents/agent-activity"
import { RotateCcw } from "lucide-react"
import { useReducedMotion } from "motion/react"
import * as React from "react"
import { useEffect, useState } from "react"

const REASONING = [
  "Reading twelve rider interviews and separating direct quotes from researcher notes.",
  "Nine participants describe missing or unclear signs at the south entrance.",
  "Five participants mention platform gaps, but only at two of the four observed stations.",
  "The station walkthrough confirms the signage issue and leaves the platform finding provisional.",
  "Exact home locations are omitted from the shared synthesis for participant privacy.",
  "Each retained claim links back to its transcript segment and observation record.",
  "The completed disclosure preserves the full reasoning trail for the research team.",
  "Preparing a concise readout with confidence and evidence attached to every theme.",
].join("\n")

const CHARACTERS_PER_SECOND = 90
const STREAM_SECONDS = REASONING.length / CHARACTERS_PER_SECOND

function StreamingTextDemo() {
  const reduce = useReducedMotion() ?? false
  const [stream, setStream] = useState("")
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    if (reduce) {
      setStream(REASONING)
      setComplete(true)
      return
    }

    const startedAt = performance.now()
    let frame = 0
    let completionTimer: number | undefined

    const streamNextFrame = (now: number) => {
      const cursor = Math.min(
        REASONING.length,
        Math.floor(((now - startedAt) / 1000) * CHARACTERS_PER_SECOND)
      )
      const next = REASONING.slice(0, cursor)
      setStream((current) => (current === next ? current : next))

      if (cursor === REASONING.length) {
        completionTimer = window.setTimeout(() => setComplete(true), 500)
      } else {
        frame = requestAnimationFrame(streamNextFrame)
      }
    }

    frame = requestAnimationFrame(streamNextFrame)
    return () => {
      cancelAnimationFrame(frame)
      if (completionTimer) window.clearTimeout(completionTimer)
    }
  }, [reduce])

  const items: AgentActivityItem[] = stream
    .split("\n")
    .filter(Boolean)
    .map((content, index) => ({
      id: `reasoning-${index}`,
      type: "text",
      content,
    }))

  return (
    <AgentActivity
      items={items}
      contentType="text"
      status={complete ? "complete" : "working"}
      duration={STREAM_SECONDS}
      defaultOpen={reduce}
      collapseOnComplete={!reduce}
      maxHeight={180}
    />
  )
}

export function AgentActivityTextPreview() {
  const [run, setRun] = useState(0)

  return (
    <div className="relative h-[330px] w-full max-w-lg">
      <StreamingTextDemo key={run} />
      <button
        type="button"
        onClick={() => setRun((current) => current + 1)}
        className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2"
      >
        <RotateCcw className="size-3" />
        Replay
      </button>
    </div>
  )
}
