"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit2,
  Flag,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { useState } from "react"

export type FeedbackType = "positive" | "negative" | "neutral"
export type FeedbackCategory = "accuracy" | "helpfulness" | "speed" | "clarity" | "other"

export interface FeedbackData {
  type: FeedbackType
  rating?: number
  categories?: FeedbackCategory[]
  comment?: string
  timestamp?: Date
}

export interface AgentFeedbackProps {
  onSubmit?: (feedback: FeedbackData) => void
  onThumbsUp?: () => void
  onThumbsDown?: () => void
  onReport?: (reason: string) => void
  showDetailedFeedback?: boolean
  showQuickActions?: boolean
  defaultExpanded?: boolean
  className?: string
}

const categoryLabels: Record<FeedbackCategory, string> = {
  accuracy: "Accuracy",
  helpfulness: "Helpfulness",
  speed: "Response Speed",
  clarity: "Clarity",
  other: "Other",
}

const categoryDescriptions: Record<FeedbackCategory, string> = {
  accuracy: "Information was correct and factual",
  helpfulness: "Response addressed my needs",
  speed: "Got a response quickly",
  clarity: "Easy to understand",
  other: "Other feedback",
}

export function AgentFeedback({
  onSubmit,
  onThumbsUp,
  onThumbsDown,
  onReport,
  showDetailedFeedback = true,
  showQuickActions = true,
  defaultExpanded = false,
  className,
}: AgentFeedbackProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [selectedCategories, setSelectedCategories] = useState<FeedbackCategory[]>([])
  const [comment, setComment] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState("")

  const handleThumbsUp = () => {
    setFeedbackType("positive")
    onThumbsUp?.()
    if (!showDetailedFeedback) {
      handleSubmit("positive")
    } else {
      setIsExpanded(true)
    }
  }

  const handleThumbsDown = () => {
    setFeedbackType("negative")
    onThumbsDown?.()
    if (!showDetailedFeedback) {
      handleSubmit("negative")
    } else {
      setIsExpanded(true)
    }
  }

  const toggleCategory = (category: FeedbackCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleSubmit = (type?: FeedbackType) => {
    const feedback: FeedbackData = {
      type: type || feedbackType || "neutral",
      categories: selectedCategories,
      comment: comment.trim(),
      timestamp: new Date(),
    }
    
    onSubmit?.(feedback)
    setIsSubmitted(true)
    
    // Reset after a delay
    setTimeout(() => {
      setIsSubmitted(false)
      setIsExpanded(false)
      setFeedbackType(null)
      setSelectedCategories([])
      setComment("")
    }, 2000)
  }

  const handleReport = () => {
    if (reportReason.trim()) {
      onReport?.(reportReason)
      setShowReportDialog(false)
      setReportReason("")
    }
  }

  if (isSubmitted) {
    return (
      <div className={cn(
        "rounded-lg border bg-card p-4 text-center",
        className
      )}>
        <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
        <p className="font-medium">Thank you for your feedback!</p>
        <p className="text-sm text-muted-foreground mt-1">
          Your input helps us improve
        </p>
      </div>
    )
  }

  return (
    <div className={cn(
      "rounded-lg border bg-card",
      className
    )}>
      {/* Quick Actions */}
      {showQuickActions && (
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Was this response helpful?</p>
            
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={feedbackType === "positive" ? "default" : "outline"}
                      onClick={handleThumbsUp}
                      className="h-8"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Helpful</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={feedbackType === "negative" ? "default" : "outline"}
                      onClick={handleThumbsDown}
                      className="h-8"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Not helpful</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {showDetailedFeedback && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="h-8"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isExpanded ? "Hide details" : "More feedback options"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {onReport && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowReportDialog(true)}
                        className="h-8 text-red-600 hover:text-red-700"
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Report issue</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Detailed Feedback */}
      {showDetailedFeedback && isExpanded && (
        <div className="p-4 space-y-4">
          {/* Categories */}
          <div>
            <p className="text-sm font-medium mb-3">
              What aspects were {feedbackType === "positive" ? "good" : "problematic"}?
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const category = key as FeedbackCategory
                const isSelected = selectedCategories.includes(category)
                
                return (
                  <TooltipProvider key={category}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => toggleCategory(category)}
                          className="h-8"
                        >
                          {isSelected && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{categoryDescriptions[category]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </div>
          
          {/* Comment */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Additional comments (optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share more details about your experience..."
              className="min-h-[80px] resize-none"
              rows={3}
            />
          </div>
          
          {/* Submit */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsExpanded(false)
                setSelectedCategories([])
                setComment("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit()}
              disabled={!feedbackType && selectedCategories.length === 0 && !comment}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </div>
      )}
      
      {/* Report Dialog */}
      {showReportDialog && (
        <div className="p-4 border-t bg-red-50 dark:bg-red-950/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="font-medium text-sm">Report an issue</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Help us understand what went wrong
                </p>
              </div>
              
              <Textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the issue (e.g., harmful content, incorrect information, etc.)"
                className="min-h-[80px] resize-none"
                rows={3}
              />
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowReportDialog(false)
                    setReportReason("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReport}
                  disabled={!reportReason.trim()}
                >
                  Submit Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
