"use client"

import { AgentCard } from "@/components/agents-ui/agent-card"

export default function AgentCardBasic() {
  return (
    <AgentCard
      name="Research Assistant"
      description="An AI agent specialized in gathering and analyzing information"
      avatar="/openai_logo.png"
    />
  )
}
