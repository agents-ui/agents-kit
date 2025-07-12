"use client"

import { AgentPromptComposer } from "@/components/agents-ui/agent-prompt-composer"
import { useState } from "react"

export default function AgentPromptComposerBasic() {
  const [value, setValue] = useState("")

  const handleSubmit = (prompt: string) => {
    console.log("Submitted prompt:", prompt)
    setValue("") // Clear after submit
  }

  return (
    <AgentPromptComposer
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      placeholder="Type your message here..."
    />
  )
}
