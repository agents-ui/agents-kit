"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { Check, ChevronDown, Flag, ThumbsDown, ThumbsUp } from "lucide-react"
import { useState } from "react"

export type FeedbackType = "positive" | "negative" | "neutral"
export type FeedbackCategory =
  | "accuracy"
  | "helpfulness"
  | "speed"
  | "clarity"
  | "other"
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
const labels: Record<FeedbackCategory, string> = {
  accuracy: "Accuracy",
  helpfulness: "Helpfulness",
  speed: "Response speed",
  clarity: "Clarity",
  other: "Other",
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
  const [type, setType] = useState<FeedbackType | null>(null)
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [categories, setCategories] = useState<FeedbackCategory[]>([])
  const [comment, setComment] = useState("")
  const [reportOpen, setReportOpen] = useState(false)
  const [reason, setReason] = useState("")
  const choose = (next: FeedbackType) => {
    setType(next)
    if (next === "positive") onThumbsUp?.()
    else onThumbsDown?.()
    if (showDetailedFeedback) setExpanded(true)
    else onSubmit?.({ type: next, timestamp: new Date() })
  }
  const toggle = (category: FeedbackCategory) =>
    setCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    )
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-2xl border",
        className
      )}
    >
      {showQuickActions && (
        <header className="flex min-h-12 flex-wrap items-center justify-between gap-2 px-4 py-2">
          <p className="text-body-medium">Was this response helpful?</p>
          <div className="flex gap-1">
            <Button
              size="small"
              variant={type === "positive" ? "primary" : "ghost"}
              leadingIcon={ThumbsUp}
              aria-pressed={type === "positive"}
              onClick={() => choose("positive")}
            >
              Helpful
            </Button>
            <Button
              size="small"
              variant={type === "negative" ? "primary" : "ghost"}
              leadingIcon={ThumbsDown}
              aria-pressed={type === "negative"}
              onClick={() => choose("negative")}
            >
              Not helpful
            </Button>
            {showDetailedFeedback && (
              <Button
                size="small"
                variant="ghost"
                iconOnly
                leadingIcon={ChevronDown}
                aria-label="Toggle feedback details"
                aria-expanded={expanded}
                onClick={() => setExpanded((open) => !open)}
              />
            )}
            {onReport && (
              <Button
                size="small"
                variant="ghost"
                iconOnly
                leadingIcon={Flag}
                aria-label="Report response"
                aria-expanded={reportOpen}
                onClick={() => setReportOpen((open) => !open)}
              />
            )}
          </div>
        </header>
      )}
      {showDetailedFeedback && expanded && (
        <div className="border-separator-border space-y-4 border-t p-4">
          <fieldset>
            <legend className="text-caption-1-medium text-text-secondary mb-2">
              What influenced your rating?
            </legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(labels) as FeedbackCategory[]).map((category) => (
                <Button
                  key={category}
                  size="small"
                  variant={
                    categories.includes(category) ? "primary" : "secondary"
                  }
                  leadingIcon={
                    categories.includes(category) ? Check : undefined
                  }
                  aria-pressed={categories.includes(category)}
                  onClick={() => toggle(category)}
                >
                  {labels[category]}
                </Button>
              ))}
            </div>
          </fieldset>
          <label className="block">
            <span className="text-caption-1-medium text-text-secondary mb-1.5 block">
              Additional comments
            </span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              className="bg-background-tertiary-default text-body-2-regular focus:ring-border-button-active w-full resize-y rounded-lg px-3 py-2 ring-2 ring-transparent outline-none"
              placeholder="Describe what worked or what should change"
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button
              size="small"
              variant="secondary"
              onClick={() => setExpanded(false)}
            >
              Cancel
            </Button>
            <Button
              size="small"
              onClick={() => {
                onSubmit?.({
                  type: type ?? "neutral",
                  categories,
                  comment: comment.trim(),
                  timestamp: new Date(),
                })
                setExpanded(false)
              }}
            >
              Submit feedback
            </Button>
          </div>
        </div>
      )}
      {onReport && reportOpen && (
        <div className="border-separator-border space-y-3 border-t p-4">
          <label className="block">
            <span className="text-caption-1-medium mb-1.5 block">
              Report this response
            </span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              className="bg-background-tertiary-default text-body-2-regular focus:ring-border-button-active w-full resize-y rounded-lg px-3 py-2 ring-2 ring-transparent outline-none"
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button
              size="small"
              variant="secondary"
              onClick={() => setReportOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="danger"
              disabled={!reason.trim()}
              onClick={() => {
                onReport(reason.trim())
                setReason("")
                setReportOpen(false)
              }}
            >
              Submit report
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
