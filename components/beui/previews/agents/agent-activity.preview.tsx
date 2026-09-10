"use client"

import {
  AgentActivity,
  type AgentActivityItem,
} from "@/components/beui/components/agents/agent-activity"
import { RotateCcw } from "lucide-react"
import { useReducedMotion } from "motion/react"
import * as React from "react"
import { useEffect, useState } from "react"

const ACTIVE_BRIEF: AgentActivityItem = {
  id: "brief",
  type: "step",
  label: "Reading the research brief",
  status: "active",
}

const COMPLETE_BRIEF: AgentActivityItem = {
  ...ACTIVE_BRIEF,
  status: "complete",
}

const PENDING_SEARCH: AgentActivityItem = {
  id: "search",
  type: "search",
  query: "accessible public transit in Jaipur",
  results: [],
}

const COMPLETE_SEARCH: AgentActivityItem = {
  ...PENDING_SEARCH,
  results: [
    {
      id: "metro",
      title: "Jaipur Metro access map",
      domain: "transport.rajasthan.gov.in",
    },
    {
      id: "street",
      title: "Street crossing field notes",
      domain: "fieldwork.local",
    },
    {
      id: "riders",
      title: "Rider interview synthesis",
      domain: "research.local",
    },
  ],
  moreCount: 5,
}

const READ_TOOL: AgentActivityItem = {
  id: "read",
  type: "tool",
  action: "read",
  target: "field-notes.md",
}

const ACTIVITY_FRAMES: AgentActivityItem[][] = [
  [ACTIVE_BRIEF],
  [COMPLETE_BRIEF, PENDING_SEARCH],
  [COMPLETE_BRIEF, COMPLETE_SEARCH],
  [COMPLETE_BRIEF, COMPLETE_SEARCH, READ_TOOL],
  [
    COMPLETE_BRIEF,
    COMPLETE_SEARCH,
    READ_TOOL,
    {
      id: "edit",
      type: "tool",
      action: "edit",
      target: "study-plan.ts",
      additions: 42,
      deletions: 8,
    },
    { id: "run", type: "tool", action: "run", target: "npm test fieldwork" },
    {
      id: "verify",
      type: "step",
      label: "Checking the final research plan",
      status: "complete",
    },
  ],
]

function ActivityDemo() {
  const reduce = useReducedMotion() ?? false
  const [frame, setFrame] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    if (reduce) {
      setFrame(ACTIVITY_FRAMES.length - 1)
      setComplete(true)
      return
    }

    const timers = ACTIVITY_FRAMES.slice(1).map((_, index) =>
      window.setTimeout(() => setFrame(index + 1), 850 + index * 1050)
    )
    const finalFrameAt = 850 + (ACTIVITY_FRAMES.length - 2) * 1050
    const completeTimer = window.setTimeout(
      () => setComplete(true),
      finalFrameAt + 900
    )
    return () => {
      timers.forEach(window.clearTimeout)
      window.clearTimeout(completeTimer)
    }
  }, [reduce])

  return (
    <AgentActivity
      items={ACTIVITY_FRAMES[frame]}
      status={complete ? "complete" : "working"}
      duration={5.1}
      defaultOpen={reduce}
      collapseOnComplete={!reduce}
      maxHeight={220}
    />
  )
}

export function AgentActivityMixedPreview() {
  const [run, setRun] = useState(0)

  return (
    <div className="relative h-[330px] w-full max-w-xl">
      <ActivityDemo key={run} />
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
