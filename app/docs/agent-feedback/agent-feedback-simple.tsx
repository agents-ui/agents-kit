"use client"

import { AgentFeedback } from "@/components/agents-ui/agent-feedback"

export default function AgentFeedbackSimple() {
  return (
    <AgentFeedback
      onSubmit={(feedback) => {
        console.log("Quick feedback:", feedback)
      }}
      showDetailedFeedback={false}
      showQuickActions={true}
    />
  )
}
