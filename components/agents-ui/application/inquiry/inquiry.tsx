"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { Input } from "@/components/boardui/base/input/input"
import { cx } from "@/components/boardui/utils/cx"
import { Check, ChevronRight, Send, SkipForward } from "lucide-react"
import { useState } from "react"

export type InquiryType = "multipleChoice" | "text" | "confirmation" | "scale"
export interface Inquiry {
  id: string
  question: string
  type: InquiryType
  options?: string[]
  required?: boolean
}
export interface InquiryHistoryItem {
  question: string
  answer: string
  timestamp: string
}
export interface AgentInquiryProps {
  agentName?: string
  taskContext?: string
  inquiry?: Inquiry
  inquiryHistory?: InquiryHistoryItem[]
  remainingInquiries?: number
  className?: string
  onSubmit?: (inquiryId: string, answer: string) => void
  onSkip?: (inquiryId: string) => void
}
const defaultInquiry: Inquiry = {
  id: "inq-1",
  question: "Which migration strategy do you prefer?",
  type: "multipleChoice",
  options: ["Blue-green deployment", "Rolling migration", "Canary release"],
  required: true,
}
export function AgentInquiry({
  agentName = "Migration agent",
  taskContext = "Database migration plan",
  inquiry = defaultInquiry,
  inquiryHistory = [],
  remainingInquiries = 0,
  className,
  onSubmit,
  onSkip,
}: AgentInquiryProps) {
  const [selected, setSelected] = useState("")
  const [text, setText] = useState("")
  const answer = inquiry.type === "text" ? text : selected
  const canSubmit = !inquiry.required || Boolean(answer)
  const submit = () => {
    if (canSubmit) onSubmit?.(inquiry.id, answer)
  }
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-2xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h3 className="text-headline-semibold">Input required</h3>
          <p className="text-caption-1-regular text-text-secondary">
            {agentName} | {taskContext}
          </p>
        </div>
        <span className="text-caption-1-regular text-text-secondary">
          {remainingInquiries > 0
            ? `${remainingInquiries + 1} decisions remaining`
            : "Final decision"}
        </span>
      </header>
      {inquiryHistory.length > 0 && (
        <details className="border-separator-border border-b">
          <summary className="text-caption-1-medium text-text-secondary flex min-h-10 cursor-pointer items-center gap-2 px-4">
            Previous decisions <span>{inquiryHistory.length}</span>
            <ChevronRight className="ml-auto size-4" />
          </summary>
          <dl className="divide-separator-border bg-background-secondary-default divide-y">
            {inquiryHistory.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className="grid gap-1 px-4 py-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <dt className="text-body-2-regular text-text-secondary">
                  {item.question}
                </dt>
                <dd className="text-body-medium">{item.answer}</dd>
                <dd className="text-caption-1-regular text-text-tertiary">
                  {item.timestamp}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )}
      <div className="space-y-4 p-4">
        <div>
          <p className="text-body-medium leading-6">{inquiry.question}</p>
          {inquiry.required && (
            <p className="text-caption-1-regular text-text-secondary mt-1">
              A response is required to continue.
            </p>
          )}
        </div>
        {inquiry.type === "multipleChoice" && (
          <div className="divide-separator-border border-separator-border divide-y overflow-hidden rounded-lg border">
            {inquiry.options?.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelected(option)}
                className={cx(
                  "hover:bg-background-secondary-hover flex min-h-11 w-full items-center gap-3 px-3 text-left",
                  selected === option && "bg-background-secondary-default"
                )}
              >
                <span
                  className={cx(
                    "border-border-button-default grid size-4 place-items-center rounded-full border",
                    selected === option &&
                      "border-button-primary bg-button-primary text-text-white"
                  )}
                >
                  {selected === option && <Check className="size-3" />}
                </span>
                <span className="text-body-2-regular">{option}</span>
              </button>
            ))}
          </div>
        )}
        {inquiry.type === "confirmation" && (
          <div className="flex gap-2">
            <Button
              size="small"
              variant={selected === "Yes" ? "primary" : "secondary"}
              onClick={() => setSelected("Yes")}
            >
              Yes, proceed
            </Button>
            <Button
              size="small"
              variant={selected === "No" ? "primary" : "secondary"}
              onClick={() => setSelected("No")}
            >
              No, skip
            </Button>
          </div>
        )}
        {inquiry.type === "scale" && (
          <div className="flex gap-2" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                size="small"
                variant={selected === String(rating) ? "primary" : "secondary"}
                onClick={() => setSelected(String(rating))}
              >
                {rating}
              </Button>
            ))}
          </div>
        )}
        {inquiry.type === "text" && (
          <Input
            value={text}
            onChange={setText}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit()
            }}
            placeholder="Enter your response"
          />
        )}
      </div>
      <footer className="border-separator-border flex gap-2 border-t px-4 py-3">
        <Button
          size="small"
          leadingIcon={Send}
          disabled={!canSubmit}
          onClick={submit}
        >
          Submit answer
        </Button>
        {!inquiry.required && (
          <Button
            size="small"
            variant="ghost"
            leadingIcon={SkipForward}
            onClick={() => onSkip?.(inquiry.id)}
          >
            Skip
          </Button>
        )}
      </footer>
    </section>
  )
}
AgentInquiry.displayName = "AgentInquiry"
