"use client"

import {
  AgentActivity,
  type AgentActivityItem,
} from "@/components/beui/components/agents/agent-activity"
import { RotateCcw } from "lucide-react"
import { useReducedMotion } from "motion/react"
import * as React from "react"
import { useEffect, useState } from "react"

const TOOLS: AgentActivityItem[] = [
  {
    id: "read",
    type: "tool",
    action: "read",
    target: "field-notes.md",
  },
  {
    id: "edit",
    type: "tool",
    action: "edit",
    target: "study-plan.ts",
    additions: 42,
    deletions: 8,
  },
  {
    id: "run",
    type: "tool",
    action: "run",
    target: "npm test fieldwork",
  },
]

function ToolsDemo() {
  const reduce = useReducedMotion() ?? false
  const [visible, setVisible] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    if (reduce) {
      setVisible(TOOLS.length)
      setComplete(true)
      return
    }

    const toolTimers = TOOLS.map((_, index) =>
      window.setTimeout(() => setVisible(index + 1), 550 + index * 850)
    )
    const completeTimer = window.setTimeout(() => setComplete(true), 3600)
    return () => {
      toolTimers.forEach(window.clearTimeout)
      window.clearTimeout(completeTimer)
    }
  }, [reduce])

  return (
    <AgentActivity
      status={complete ? "complete" : "working"}
      contentType="tool"
      defaultOpen={reduce}
      collapseOnComplete={!reduce}
      maxHeight={220}
      items={TOOLS.slice(0, visible)}
    />
  )
}

export function AgentActivityToolsPreview() {
  const [run, setRun] = useState(0)

  return (
    <div className="relative h-[330px] w-full max-w-lg">
      <ToolsDemo key={run} />
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
