"use client"

import { AgentActivity } from "@/components/beui/components/agents/agent-activity"
import { RotateCcw } from "lucide-react"
import { useReducedMotion } from "motion/react"
import * as React from "react"
import { useEffect, useState } from "react"

const STEPS = [
  { id: "brief", label: "Reading the research brief" },
  { id: "patterns", label: "Clustering rider interview themes" },
  {
    id: "states",
    label: "Linking findings to field evidence",
    meta: "12 interviews",
  },
  { id: "verify", label: "Checking consent and location privacy" },
]

function StepsDemo() {
  const reduce = useReducedMotion() ?? false
  const [visible, setVisible] = useState(reduce ? STEPS.length : 1)
  const [settled, setSettled] = useState(false)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    if (reduce) {
      setVisible(STEPS.length)
      setSettled(true)
      setComplete(true)
      return
    }

    const stepTimers = STEPS.slice(1).map((_, index) =>
      window.setTimeout(() => setVisible(index + 2), 850 + index * 800)
    )
    const settleTimer = window.setTimeout(() => setSettled(true), 3300)
    const completeTimer = window.setTimeout(() => setComplete(true), 4200)
    return () => {
      stepTimers.forEach(window.clearTimeout)
      window.clearTimeout(settleTimer)
      window.clearTimeout(completeTimer)
    }
  }, [reduce])

  return (
    <AgentActivity
      status={complete ? "complete" : "working"}
      contentType="step"
      duration={4.2}
      defaultOpen={reduce}
      collapseOnComplete={!reduce}
      maxHeight={220}
      items={STEPS.slice(0, visible).map((step, index) => ({
        ...step,
        type: "step" as const,
        status:
          settled || index < visible - 1
            ? ("complete" as const)
            : ("active" as const),
      }))}
    />
  )
}

export function AgentActivityStepsPreview() {
  const [run, setRun] = useState(0)

  return (
    <div className="relative h-[330px] w-full max-w-lg">
      <StepsDemo key={run} />
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
