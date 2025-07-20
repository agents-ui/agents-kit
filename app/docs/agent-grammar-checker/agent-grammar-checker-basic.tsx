"use client"

import { AgentGrammarChecker } from "@/components/agents-ui/agent-grammar-checker"
import { useState } from "react"

export default function AgentGrammarCheckerBasic() {
  const [text, setText] = useState("Your corrected text will appear here with improved grammar, style, and clarity.")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const mockIssues = [
    {
      id: "1",
      type: "grammar" as const,
      message: "Subject-verb agreement error",
      suggestion: "The verb should agree with the subject in number",
      position: { start: 15, end: 20 },
      severity: "error" as const
    },
    {
      id: "2", 
      type: "style" as const,
      message: "Consider using a more active voice",
      suggestion: "Rewrite in active voice for better clarity",
      position: { start: 30, end: 45 },
      severity: "warning" as const
    },
    {
      id: "3",
      type: "spelling" as const,
      message: "Possible spelling error",
      suggestion: "Check the spelling of this word",
      position: { start: 60, end: 67 },
      severity: "error" as const
    }
  ]

  const mockStats = {
    wordsCount: 156,
    readabilityScore: 78,
    issuesFixed: 2,
    totalIssues: 5
  }

  const originalText = "Your original text with some gramatical errors and style issues that need to be fix."

  const handleReanalyze = async () => {
    setIsAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsAnalyzing(false)
  }

  return (
    <AgentGrammarChecker
      text={text}
      originalText={originalText}
      issues={mockIssues}
      stats={mockStats}
      isAnalyzing={isAnalyzing}
      onTextChange={setText}
      onAcceptSuggestion={(issueId) => {
        console.log("Accepted suggestion:", issueId)
        // Remove the issue from the list
      }}
      onRejectSuggestion={(issueId) => {
        console.log("Rejected suggestion:", issueId)
        // Remove the issue from the list
      }}
      onCopy={() => console.log("Text copied")}
      onReanalyze={handleReanalyze}
      onRegenerateResponse={() => console.log("Regenerating analysis")}
    />
  )
}