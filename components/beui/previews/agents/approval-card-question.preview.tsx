"use client"

import {
  ApprovalCard,
  type ApprovalCardAnswers,
  type ApprovalCardQuestion,
  type ApprovalCardStatus,
} from "@/components/beui/components/agents/approval-card"
import { RotateCcw } from "lucide-react"
import * as React from "react"
import { useEffect, useRef, useState } from "react"

const QUESTIONS: ApprovalCardQuestion[] = [
  {
    id: "scope",
    title: "How broad should the first interview round be?",
    options: [
      { value: "focused", label: "A focused starter set" },
      { value: "broad", label: "A broader collection" },
      { value: "flagship", label: "One flagship experience" },
    ],
    allowCustom: true,
    customPlaceholder: "Describe another scope…",
  },
  {
    id: "checks",
    title: "Which checks should block synthesis?",
    description:
      "Select every check the agent must pass before it can continue.",
    multiple: true,
    options: [
      { value: "consent", label: "Participant consent" },
      { value: "evidence", label: "Evidence links" },
      { value: "privacy", label: "Privacy review" },
    ],
  },
  {
    id: "preserve",
    title: "Anything the agent should preserve?",
    allowCustom: true,
    customPlaceholder: "Add a final constraint…",
  },
]

function QuestionFlow() {
  const [status, setStatus] = useState<ApprovalCardStatus>("pending")
  const timer = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    []
  )

  const submit = (_answers: ApprovalCardAnswers) => {
    void _answers
    setStatus("submitting")
    timer.current = window.setTimeout(() => setStatus("answered"), 750)
  }

  return (
    <ApprovalCard
      questions={QUESTIONS}
      status={status}
      onSubmit={submit}
      result="Three responses sent to the agent."
    />
  )
}

export function ApprovalCardQuestionPreview() {
  const [run, setRun] = useState(0)

  return (
    <div className="relative h-[470px] w-full max-w-lg">
      <QuestionFlow key={run} />
      <button
        type="button"
        onClick={() => setRun((value) => value + 1)}
        className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2"
      >
        <RotateCcw className="size-3" />
        Replay
      </button>
    </div>
  )
}
