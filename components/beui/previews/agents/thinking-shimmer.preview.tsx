"use client"

import { ThinkingShimmer } from "@/components/beui/components/agents/loading-states/thinking-shimmer"
import * as React from "react"

export function ThinkingShimmerPreview() {
  return (
    <ThinkingShimmer className="text-lg" duration={1.8}>
      Synthesizing interviews…
    </ThinkingShimmer>
  )
}
