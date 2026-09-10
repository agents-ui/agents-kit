"use client"

import {
  ChatPreview,
  type ChatPreviewMessage,
} from "@/components/beui/previews/agents/chat-preview"
import * as React from "react"

const MESSAGES: ChatPreviewMessage[] = [
  {
    id: "scope-question",
    from: "user",
    content: "What should the first field study include?",
  },
  {
    id: "scope-answer",
    from: "assistant",
    content: "Start with eight rider interviews and two station walkthroughs.",
  },
  {
    id: "states-question",
    from: "user",
    content: "Include wheelchair users and people traveling with luggage.",
  },
  {
    id: "states-answer",
    from: "assistant",
    content: "Yes. Both groups encounter the same lift and signage failures.",
  },
  {
    id: "evidence-question",
    from: "user",
    content: "How should we present the findings?",
  },
  {
    id: "evidence-answer",
    from: "assistant",
    content:
      "Keep each finding beside the interview quote or field note that supports it.",
  },
  {
    id: "approval-question",
    from: "user",
    content: "What needs confirmation before the study begins?",
  },
  {
    id: "approval-answer",
    from: "assistant",
    content:
      "Confirm consent language, recording, and how precise locations may be shared.",
  },
  {
    id: "summary-question",
    from: "user",
    content: "Can the transcript stay easy to navigate?",
  },
  {
    id: "summary-answer",
    from: "assistant",
    content: "Use the rail to jump between turns without losing your place.",
  },
]

export function MessageScrollerPreview() {
  return (
    <ChatPreview
      initialMessages={MESSAGES}
      showRail
      reply="I’ll prepare the interview guide, flag unresolved consent questions, and keep every synthesis claim linked to its source."
      placeholder="Ask about the study…"
    />
  )
}
