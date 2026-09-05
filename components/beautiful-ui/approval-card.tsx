"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { Check } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import * as React from "react"

export type ApprovalAnswer = string | string[]
export interface ApprovalQuestion {
  id: string
  label: string
  type?: "text" | "radio" | "check"
  options?: string[]
  required?: boolean
  value?: ApprovalAnswer
  placeholder?: string
}
export interface ApprovalCardProps {
  title: string
  description?: string
  questions?: ApprovalQuestion[]
  currentStep?: number
  answers?: Record<string, ApprovalAnswer>
  submitted?: boolean
  allowSkip?: boolean
  onStepChange?: (step: number) => void
  onAnswerChange?: (id: string, value: ApprovalAnswer) => void
  onSubmit?: (answers: Record<string, ApprovalAnswer>) => void
  onSkip?: (id: string) => void
  onBack?: (step: number) => void
  onApprove?: () => void
  onDecline?: () => void
  onChange?: (id: string, value: string) => void
  className?: string
}
export function isApprovalAnswerValid(
  question: ApprovalQuestion,
  answer: ApprovalAnswer | undefined
) {
  if (!question.required) return true
  return Array.isArray(answer) ? answer.length > 0 : Boolean(answer?.trim())
}
export function ApprovalCard({
  title,
  description,
  questions = [],
  currentStep,
  answers,
  submitted,
  allowSkip = true,
  onStepChange,
  onAnswerChange,
  onSubmit,
  onSkip,
  onBack,
  onApprove,
  onDecline,
  onChange,
  className,
}: ApprovalCardProps) {
  const reduce = useReducedMotion() ?? false
  const [localStep, setLocalStep] = React.useState(0)
  const [localAnswers, setLocalAnswers] = React.useState<
    Record<string, ApprovalAnswer>
  >(() =>
    Object.fromEntries(
      questions
        .filter((question) => question.value !== undefined)
        .map((question) => [question.id, question.value!])
    )
  )
  const [localSubmitted, setLocalSubmitted] = React.useState(false)
  const step = Math.min(
    Math.max(currentStep ?? localStep, 0),
    Math.max(questions.length - 1, 0)
  )
  const values = answers ?? localAnswers
  const done = submitted ?? localSubmitted
  const question = questions[step]
  const answer = question ? values[question.id] : undefined
  const valid = question ? isApprovalAnswerValid(question, answer) : true
  const changeStep = (next: number) => {
    if (currentStep === undefined) setLocalStep(next)
    onStepChange?.(next)
  }
  const changeAnswer = (id: string, value: ApprovalAnswer) => {
    if (answers === undefined)
      setLocalAnswers((current) => ({ ...current, [id]: value }))
    onAnswerChange?.(id, value)
    if (typeof value === "string") onChange?.(id, value)
  }
  const finish = () => {
    if (!valid) return
    if (submitted === undefined) setLocalSubmitted(true)
    onSubmit?.(values)
    onApprove?.()
  }
  const next = () => {
    if (!valid) return
    if (step >= questions.length - 1) finish()
    else changeStep(step + 1)
  }
  if (done)
    return (
      <section
        className={cx(
          "border-separator-border bg-background-primary-default max-w-sm rounded-xl border p-4",
          className
        )}
      >
        <p className="flex items-center gap-2 text-sm font-medium">
          <Check className="size-4 text-green-600" />
          Answers submitted
        </p>
      </section>
    )
  if (!question)
    return (
      <section
        className={cx(
          "border-separator-border bg-background-primary-default max-w-sm rounded-xl border p-4",
          className
        )}
      >
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-text-secondary mt-2 text-[13px]">
          No questions provided.
        </p>
        {onApprove && (
          <div className="mt-4 flex justify-end">
            <Button size="small" onClick={finish}>
              Approve
            </Button>
          </div>
        )}
      </section>
    )
  const type = question.type ?? "text"
  const selected = Array.isArray(answer) ? answer : []
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default w-full max-w-sm rounded-xl border p-4",
        className
      )}
    >
      <header>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className="text-text-secondary text-xs tabular-nums">
            {step + 1} / {questions.length}
          </span>
        </div>
        {description && (
          <p className="text-text-secondary mt-1 text-[13px] leading-5">
            {description}
          </p>
        )}
      </header>
      <div className="mt-4 min-h-[104px]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={question.id}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: reduce ? 0 : 0.16 }}
          >
            <p className="text-sm font-medium">
              {question.label}
              {question.required && (
                <span className="ml-1 text-red-600">*</span>
              )}
            </p>
            {type === "text" ? (
              <input
                value={typeof answer === "string" ? answer : ""}
                placeholder={question.placeholder}
                onChange={(event) =>
                  changeAnswer(question.id, event.target.value)
                }
                className="bg-background-tertiary-default focus:ring-border-focus-ring mt-2 h-9 w-full rounded-lg px-3 text-[13px] outline-none focus:ring-2"
              />
            ) : (
              <div
                role={type === "radio" ? "radiogroup" : "group"}
                aria-label={question.label}
                className="mt-2 flex flex-wrap gap-2"
              >
                {question.options?.map((option) => {
                  const on = selected.includes(option) || answer === option
                  return (
                    <button
                      key={option}
                      type="button"
                      role={type === "radio" ? "radio" : "checkbox"}
                      aria-checked={on}
                      onClick={() =>
                        changeAnswer(
                          question.id,
                          type === "radio"
                            ? option
                            : on
                              ? selected.filter((item) => item !== option)
                              : [...selected, option]
                        )
                      }
                      className={cx(
                        "min-h-8 rounded-full border px-3 text-xs",
                        on
                          ? "border-text-primary bg-button-primary text-text-white"
                          : "border-separator-border hover:bg-background-secondary-default"
                      )}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            )}
            {!valid && (
              <p className="mt-2 text-xs text-red-700 dark:text-red-400">
                Choose or enter an answer to continue.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <footer className="border-separator-border mt-5 flex items-center justify-between border-t pt-3">
        <div className="flex gap-1">
          {onDecline && (
            <Button variant="ghost" size="xs" onClick={onDecline}>
              Decline
            </Button>
          )}
          {step > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                onBack?.(step - 1)
                changeStep(step - 1)
              }}
            >
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-1">
          {allowSkip && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                onSkip?.(question.id)
                if (step >= questions.length - 1) {
                  if (submitted === undefined) setLocalSubmitted(true)
                  onSubmit?.(values)
                  onApprove?.()
                } else changeStep(step + 1)
              }}
            >
              Skip
            </Button>
          )}
          <Button size="xs" disabled={!valid} onClick={next}>
            {step >= questions.length - 1 ? "Submit" : "Continue"}
          </Button>
        </div>
      </footer>
    </section>
  )
}
