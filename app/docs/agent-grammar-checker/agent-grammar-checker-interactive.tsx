"use client"

import { AgentGrammarChecker, type GrammarIssue } from "@/components/agents-ui/agent-grammar-checker"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function AgentGrammarCheckerInteractive() {
  const [text, setText] = useState("Your corrected text will appear here with improved grammar, style, and clarity.")
  const [originalText, setOriginalText] = useState("Your original text with some gramatical errors and style issues that need to be fix.")
  const [inputText, setInputText] = useState("Your original text with some gramatical errors and style issues that need to be fix.")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const [issues, setIssues] = useState<GrammarIssue[]>([
    {
      id: "1",
      type: "spelling",
      message: "Possible spelling error: 'gramatical' should be 'grammatical'",
      suggestion: "grammatical",
      position: { start: 35, end: 45 },
      severity: "error"
    },
    {
      id: "2",
      type: "grammar",
      message: "Subject-verb agreement: 'need' should be 'needs'",
      suggestion: "needs",
      position: { start: 75, end: 79 },
      severity: "error"
    },
    {
      id: "3",
      type: "grammar",
      message: "Incorrect verb form: 'fix' should be 'fixed'",
      suggestion: "fixed",
      position: { start: 83, end: 86 },
      severity: "error"
    },
    {
      id: "4",
      type: "style",
      message: "Consider using more formal language",
      suggestion: "Consider rephrasing for better clarity",
      position: { start: 0, end: 20 },
      severity: "info"
    }
  ])

  const mockStats = {
    wordsCount: 156,
    readabilityScore: 78,
    issuesFixed: 2,
    totalIssues: issues.length
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setOriginalText(inputText)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate corrected text
    let corrected = inputText
      .replace(/gramatical/g, "grammatical")
      .replace(/need to be fix/g, "need to be fixed")
      .replace(/issues that need/g, "issues that needs")
    
    setText(corrected)
    setIsAnalyzing(false)
  }

  const handleAcceptSuggestion = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId)
    if (!issue) return
    
    // Apply the suggestion to the text
    const beforeText = text.substring(0, issue.position.start)
    const afterText = text.substring(issue.position.end)
    const newText = beforeText + issue.suggestion + afterText
    
    setText(newText)
    
    // Remove the issue from the list
    setIssues(prev => prev.filter(i => i.id !== issueId))
  }

  const handleRejectSuggestion = (issueId: string) => {
    setIssues(prev => prev.filter(i => i.id !== issueId))
  }

  const addRandomIssue = () => {
    const newIssues: GrammarIssue[] = [
      {
        id: `${Date.now()}-1`,
        type: "punctuation",
        message: "Missing comma in compound sentence",
        suggestion: "Add a comma before the conjunction",
        position: { start: 20, end: 25 },
        severity: "warning"
      },
      {
        id: `${Date.now()}-2`,
        type: "clarity",
        message: "This sentence could be clearer",
        suggestion: "Consider breaking into shorter sentences",
        position: { start: 40, end: 60 },
        severity: "info"
      }
    ]
    
    const randomIssue = newIssues[Math.floor(Math.random() * newIssues.length)]
    setIssues(prev => [...prev, randomIssue])
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Input Text to Analyze:</label>
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-24"
          placeholder="Enter text to check for grammar, style, and clarity issues..."
        />
        <Button onClick={handleAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? "Analyzing..." : "Analyze Text"}
        </Button>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={addRandomIssue}
          disabled={isAnalyzing}
        >
          Add Sample Issue
        </Button>
        <Button
          variant="outline"
          onClick={() => setIssues([])}
          disabled={isAnalyzing}
        >
          Clear All Issues
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsAnalyzing(!isAnalyzing)}
        >
          Toggle Analysis State
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputText("The quick brown fox jumps over the lazy dog. This sentence contains no errors.")
            setOriginalText("The quick brown fox jumps over the lazy dog. This sentence contains no errors.")
            setText("The quick brown fox jumps over the lazy dog. This sentence contains no errors.")
            setIssues([])
          }}
        >
          Load Perfect Text
        </Button>
      </div>
      
      <AgentGrammarChecker
        text={text}
        originalText={originalText}
        issues={issues}
        stats={{
          ...mockStats,
          totalIssues: issues.length,
          issuesFixed: mockStats.totalIssues - issues.length
        }}
        isAnalyzing={isAnalyzing}
        onTextChange={setText}
        onAcceptSuggestion={handleAcceptSuggestion}
        onRejectSuggestion={handleRejectSuggestion}
        onCopy={() => {
          navigator.clipboard.writeText(text)
          console.log("Corrected text copied to clipboard")
        }}
        onReanalyze={handleAnalyze}
        onRegenerateResponse={() => {
          console.log("Regenerating analysis with different approach")
          handleAnalyze()
        }}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Quick Actions:</p>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                issues.slice(0, 2).forEach(issue => handleAcceptSuggestion(issue.id))
              }}
              disabled={issues.length === 0}
            >
              Accept First 2 Suggestions
            </Button>
            <Button
              size="sm" 
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const errorIssues = issues.filter(i => i.severity === "error")
                errorIssues.forEach(issue => handleAcceptSuggestion(issue.id))
              }}
              disabled={issues.filter(i => i.severity === "error").length === 0}
            >
              Accept All Errors
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Sample Texts:</p>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                const sampleText = "Their going to there house over they're to see the new car that there buying."
                setInputText(sampleText)
              }}
            >
              Load Sample (Errors)
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const complexText = "The utilization of sophisticated vernacular in professional discourse can oftentimes obfuscate the intended meaning, resulting in communicative inefficacy."
                setInputText(complexText)
              }}
            >
              Load Complex Text
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Status: {issues.length} issues remaining • {Math.max(0, mockStats.totalIssues - issues.length)} fixed • {mockStats.readabilityScore}/100 readability score
      </div>
    </div>
  )
}