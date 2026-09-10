"use client"

import { AgentProgress } from "@/components/beui/components/agents/loading-states/agent-progress"
import * as React from "react"

export function AgentProgressPreview() {
  return (
    <AgentProgress
      label="Synthesizing"
      initialSeconds={151.6}
      className="text-base"
    />
  )
}
