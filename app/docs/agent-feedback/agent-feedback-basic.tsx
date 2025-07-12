"use client"

import { AgentFeedback } from "@/components/agents-ui/agent-feedback"

export default function AgentFeedbackBasic() {
  return (
    <AgentFeedback
      onSubmit={(feedback) => {
        console.log("Feedback submitted:", feedback)
      }}
      onThumbsUp={() => console.log("Thumbs up clicked")}
      onThumbsDown={() => console.log("Thumbs down clicked")}
      onReport={(reason) => console.log("Report submitted:", reason)}
    />
  )
}
