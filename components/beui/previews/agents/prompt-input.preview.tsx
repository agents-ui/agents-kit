"use client"

import { PromptInput } from "@/components/beui/components/agents/prompt-input"
import { EASE_OUT } from "@/components/beui/lib/ease"
import {
  Bot,
  FileText,
  ImagePlus,
  ListChecks,
  PencilLine,
  Puzzle,
  Search,
  Sparkles,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import * as React from "react"
import { useEffect, useRef, useState } from "react"

const MODELS = [
  {
    value: "fieldwork",
    label: "Fieldwork",
    icon: <Bot />,
  },
  {
    value: "interview",
    label: "Interview guide",
    icon: <ListChecks />,
  },
  {
    value: "research",
    label: "Desk research",
    icon: <Search />,
  },
  {
    value: "synthesis",
    label: "Synthesis",
    icon: <Sparkles />,
  },
  {
    value: "writing",
    label: "Report writer",
    icon: <PencilLine />,
  },
]

const ACTIONS = [
  {
    value: "image",
    label: "Attach image",
    description: "Add a screenshot or visual reference.",
    icon: <ImagePlus />,
  },
  {
    value: "skill",
    label: "Use a skill",
    description: "Give the agent a specialized workflow.",
    icon: <Puzzle />,
  },
  {
    value: "context",
    label: "Add context",
    description: "Include a file with supporting details.",
    icon: <FileText />,
  },
]

export function PromptInputPreview() {
  const reduce = useReducedMotion() ?? false
  const timer = useRef<number | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState<string>()
  const [notice, setNotice] = useState<string>()

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    []
  )

  const submit = (prompt: string) => {
    setSent(undefined)
    setNotice(undefined)
    setLoading(true)
    timer.current = window.setTimeout(() => {
      setLoading(false)
      setSent(prompt)
    }, 900)
  }

  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current)
    setLoading(false)
  }

  return (
    <div className="flex h-[360px] w-full max-w-xl flex-col justify-center">
      <PromptInput
        models={MODELS}
        actions={ACTIONS}
        defaultModel="fieldwork"
        defaultValue="Review the current interview guide and suggest the next improvement."
        loading={loading}
        onSubmit={submit}
        onStop={stop}
        onAction={(action) => {
          const selected = ACTIONS.find((item) => item.value === action)
          setSent(undefined)
          setNotice(selected ? `${selected.label} selected.` : undefined)
        }}
      />
      <div className="text-muted-foreground h-8 px-2 pt-2 text-xs">
        <AnimatePresence mode="wait">
          {sent || notice ? (
            <motion.p
              key={sent ?? notice}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.18, ease: EASE_OUT }}
            >
              {sent ? "Prompt sent to the selected model." : notice}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
