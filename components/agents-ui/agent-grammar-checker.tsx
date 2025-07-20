"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { 
  Copy,
  RefreshCw,
  Check,
  AlertCircle,
  BookOpen,
  Lightbulb,
  Target,
  Settings2,
  FileText,
  Zap
} from "lucide-react"
import { useState } from "react"

export type GrammarIssueType = "grammar" | "spelling" | "style" | "clarity" | "punctuation"

export interface GrammarIssue {
  id: string
  type: GrammarIssueType
  message: string
  suggestion: string
  position: { start: number; end: number }
  severity: "error" | "warning" | "info"
}

export interface GrammarStats {
  wordsCount: number
  readabilityScore: number
  issuesFixed: number
  totalIssues: number
}

export interface AgentGrammarCheckerProps {
  text?: string
  originalText?: string
  issues?: GrammarIssue[]
  stats?: GrammarStats
  isAnalyzing?: boolean
  onTextChange?: (text: string) => void
  onAcceptSuggestion?: (issueId: string) => void
  onRejectSuggestion?: (issueId: string) => void
  onCopy?: () => void
  onReanalyze?: () => void
  onRegenerateResponse?: () => void
  className?: string
  timestamp?: string
}

const issueTypeConfig: Record<GrammarIssueType, { icon: React.ReactNode; color: string; label: string }> = {
  grammar: { icon: <BookOpen className="h-3 w-3" />, color: "bg-red-100 text-red-800", label: "Grammar" },
  spelling: { icon: <AlertCircle className="h-3 w-3" />, color: "bg-orange-100 text-orange-800", label: "Spelling" },
  style: { icon: <Lightbulb className="h-3 w-3" />, color: "bg-blue-100 text-blue-800", label: "Style" },
  clarity: { icon: <Target className="h-3 w-3" />, color: "bg-purple-100 text-purple-800", label: "Clarity" },
  punctuation: { icon: <FileText className="h-3 w-3" />, color: "bg-green-100 text-green-800", label: "Punctuation" },
}

export function AgentGrammarChecker({
  text = "",
  originalText = "",
  issues = [],
  stats,
  isAnalyzing = false,
  onTextChange,
  onAcceptSuggestion,
  onRejectSuggestion,
  onCopy,
  onReanalyze,
  onRegenerateResponse,
  className,
  timestamp = "Just now",
}: AgentGrammarCheckerProps) {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)

  const handleAcceptSuggestion = (issueId: string) => {
    onAcceptSuggestion?.(issueId)
    setSelectedIssue(null)
  }

  const handleRejectSuggestion = (issueId: string) => {
    onRejectSuggestion?.(issueId)
    setSelectedIssue(null)
  }

  const highlightedText = (text: string, issues: GrammarIssue[]) => {
    if (!issues.length) return text

    let result = text
    const sortedIssues = [...issues].sort((a, b) => b.position.start - a.position.start)

    sortedIssues.forEach((issue) => {
      const beforeText = result.substring(0, issue.position.start)
      const highlightedPart = result.substring(issue.position.start, issue.position.end)
      const afterText = result.substring(issue.position.end)
      
      const colorClass = issue.severity === "error" ? "bg-red-200" : 
                        issue.severity === "warning" ? "bg-yellow-200" : "bg-blue-200"
      
      result = `${beforeText}<span class="${colorClass} cursor-pointer underline decoration-wavy" data-issue-id="${issue.id}">${highlightedPart}</span>${afterText}`
    })

    return result
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Analysis Status */}
      {isAnalyzing ? (
        <div className="text-sm text-foreground flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Analyzing your text for grammar, style, and clarity...
        </div>
      ) : (
        <div className="text-sm text-foreground">
          Text analysis complete. {issues.length > 0 ? `Found ${issues.length} suggestions for improvement.` : "No issues found - great writing!"}
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-lg font-semibold">{stats.wordsCount}</div>
            <div className="text-xs text-muted-foreground">Words</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="text-lg font-semibold">{stats.readabilityScore}/100</div>
            <div className="text-xs text-muted-foreground">Readability</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="text-lg font-semibold">{stats.issuesFixed}</div>
            <div className="text-xs text-muted-foreground">Fixed</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="text-lg font-semibold">{stats.totalIssues}</div>
            <div className="text-xs text-muted-foreground">Total Issues</div>
          </div>
        </div>
      )}

      {/* Text Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Corrected Text</span>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={onReanalyze}>
                    <Zap className="h-4 w-4 mr-1" />
                    Re-analyze
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Re-analyze text</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => onTextChange?.(e.target.value)}
            className="min-h-32 resize-y"
            placeholder="Your corrected text will appear here..."
          />
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Analyzing...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Issues List */}
      {issues.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Suggestions ({issues.length})</span>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={cn(
                  "border rounded-lg p-3 space-y-2",
                  selectedIssue === issue.id && "ring-2 ring-primary"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", issueTypeConfig[issue.type].color)}
                      >
                        {issueTypeConfig[issue.type].icon}
                        {issueTypeConfig[issue.type].label}
                      </Badge>
                      
                      {issue.severity === "error" && (
                        <Badge variant="destructive" className="text-xs">Error</Badge>
                      )}
                      {issue.severity === "warning" && (
                        <Badge variant="outline" className="text-xs">Warning</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-1">{issue.message}</p>
                    
                    <div className="text-sm">
                      <span className="font-medium">Suggestion:</span>{" "}
                      <span className="text-green-700">{issue.suggestion}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptSuggestion(issue.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectSuggestion(issue.id)}
                  >
                    Ignore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Original Text Comparison */}
      {originalText && text !== originalText && (
        <div className="space-y-2">
          <span className="text-sm font-medium">Original Text</span>
          <div className="bg-muted rounded-lg p-3 text-sm">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: highlightedText(originalText, issues) 
              }}
            />
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              <Settings2 className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{timestamp}</span>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={onCopy}>
                  Copy
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy corrected text</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={onRegenerateResponse}>
                  Regenerate response
                </Button>
              </TooltipTrigger>
              <TooltipContent>Re-analyze with different approach</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex gap-1">
            <span className="text-lg">😊</span>
            <span className="text-lg">😔</span>
          </div>
        </div>
      </div>
    </div>
  )
}