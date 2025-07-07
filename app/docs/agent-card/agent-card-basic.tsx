"use client"

import { AgentCard } from "@/components/agents-ui/agent-card"
import { getAssetPath } from "@/lib/assets"

export default function AgentCardBasic() {
  return (
    <AgentCard
      name="Research Assistant"
      description="An AI agent specialized in gathering and analyzing information"
      avatar={getAssetPath("/openai_logo.png")}
    />
  )
}
