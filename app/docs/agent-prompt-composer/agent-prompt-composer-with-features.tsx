"use client"

import { AgentPromptComposer, PromptTemplate, Persona } from "@/components/agents-ui/agent-prompt-composer"
import { useState } from "react"

export default function AgentPromptComposerWithFeatures() {
  const [value, setValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const templates: PromptTemplate[] = [
    {
      id: "1",
      name: "Code Review",
      prompt: "Please review the following code and provide feedback on:\n- Code quality\n- Performance optimizations\n- Security concerns\n- Best practices\n\n[Paste your code here]",
      description: "Comprehensive code review template"
    },
    {
      id: "2",
      name: "Bug Report Analysis",
      prompt: "Analyze this bug report:\n\nSteps to reproduce:\n1. \n2. \n\nExpected behavior:\n\nActual behavior:\n\nEnvironment:",
      description: "Structured bug analysis"
    },
    {
      id: "3",
      name: "Feature Explanation",
      prompt: "Explain how [feature name] works in simple terms. Include:\n- Main purpose\n- How to use it\n- Common use cases\n- Best practices",
      description: "Feature documentation helper"
    }
  ]

  const personas: Persona[] = [
    {
      id: "1",
      name: "Technical Expert",
      systemPrompt: "You are a senior software engineer with deep expertise in system architecture and best practices.",
      description: "For technical deep-dives"
    },
    {
      id: "2",
      name: "Friendly Teacher",
      systemPrompt: "You explain complex concepts in simple, easy-to-understand terms with examples.",
      description: "For learning and tutorials"
    },
    {
      id: "3",
      name: "Code Reviewer",
      systemPrompt: "You are a meticulous code reviewer who focuses on quality, performance, and maintainability.",
      description: "For code analysis"
    }
  ]

  const handleSubmit = async (prompt: string, options?: { persona?: Persona }) => {
    console.log("Submitted:", { prompt, persona: options?.persona })
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setValue("")
    }, 2000)
  }

  return (
    <AgentPromptComposer
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      placeholder="Ask me anything about coding, debugging, or software development..."
      isLoading={isLoading}
      templates={templates}
      personas={personas}
      showVoiceInput={true}
      showFileAttachment={true}
      showSettings={true}
    />
  )
}
