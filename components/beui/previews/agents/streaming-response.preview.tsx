"use client"

import type { CitationItem } from "@/components/beui/components/agents/citations"
import { StreamingResponse } from "@/components/beui/components/agents/streaming-response"
import { RotateCcw } from "lucide-react"
import { useReducedMotion } from "motion/react"
import * as React from "react"
import { useEffect, useState } from "react"

const PIECES = [
  "The strongest access barrier appears in the ",
  "Station 4 walkthrough",
  ", where the only lift sits beyond an unsigned service corridor.",
  "Three findings recur across the evidence:",
  "Riders miss the accessible entrance on first arrival",
  "Transfer signs use inconsistent language",
  "Staff assistance varies by shift",
  "Mark the finding as ",
  "high confidence",
  " after the next walkthrough confirms the route.",
  'const confidence = evidence.length >= 3 ? "high" : "review";',
] as const

const STARTS = PIECES.map((_, index) =>
  PIECES.slice(0, index).reduce((total, piece) => total + piece.length, 0)
)
const RESPONSE_LENGTH = PIECES.reduce((total, piece) => total + piece.length, 0)
const RESPONSE_MARKDOWN = `The strongest access barrier appears in the [Station 4 walkthrough](https://example.com/fieldwork/walkthrough), where the only lift sits beyond an unsigned service corridor.

Three findings recur across the evidence:

- Riders miss the accessible entrance on first arrival
- Transfer signs use inconsistent language
- Staff assistance varies by shift

Mark the finding as \`high confidence\` after the next walkthrough confirms the route.

\`\`\`tsx
const confidence = evidence.length >= 3 ? "high" : "review";
\`\`\``

const CHARACTERS_PER_SECOND = 110

const RESPONSE_SOURCES: CitationItem[] = [
  {
    id: "walkthrough",
    title: "Station 4 accessibility walkthrough",
    domain: "fieldwork.local",
    url: "https://example.com/fieldwork/walkthrough",
  },
  {
    id: "interviews",
    title: "Rider interview synthesis",
    domain: "research.local",
    url: "https://example.com/fieldwork/interviews",
  },
  {
    id: "route-log",
    title: "Step-free route observation log",
    domain: "fieldwork.local",
    url: "https://example.com/fieldwork/routes",
  },
]

function ResponseDemo({ onReplay }: { onReplay: () => void }) {
  const reduce = useReducedMotion() ?? false
  const [cursor, setCursor] = useState(reduce ? RESPONSE_LENGTH : 0)
  const [complete, setComplete] = useState(reduce)

  const reveal = (index: number) =>
    PIECES[index].slice(0, Math.max(0, cursor - STARTS[index]))
  const started = (index: number) => cursor > STARTS[index]

  useEffect(() => {
    if (reduce) return

    const startedAt = performance.now()
    let frame = 0
    let completionTimer: number | undefined
    const stream = (now: number) => {
      const cursor = Math.min(
        RESPONSE_LENGTH,
        Math.floor(((now - startedAt) / 1000) * CHARACTERS_PER_SECOND)
      )
      setCursor(cursor)
      if (cursor < RESPONSE_LENGTH) frame = requestAnimationFrame(stream)
      else completionTimer = window.setTimeout(() => setComplete(true), 450)
    }

    frame = requestAnimationFrame(stream)
    return () => {
      cancelAnimationFrame(frame)
      if (completionTimer) window.clearTimeout(completionTimer)
    }
  }, [reduce])

  return (
    <StreamingResponse
      status={complete ? "complete" : "streaming"}
      copyText={RESPONSE_MARKDOWN}
      onRetry={onReplay}
      sources={RESPONSE_SOURCES}
    >
      <p>
        {reveal(0)}
        {started(1) ? (
          <a
            href="https://example.com/fieldwork/walkthrough"
            target="_blank"
            rel="noreferrer noopener"
          >
            {reveal(1)}
          </a>
        ) : null}
        {reveal(2)}
      </p>
      {started(3) ? <p>{reveal(3)}</p> : null}
      {started(4) ? (
        <ul>
          <li>{reveal(4)}</li>
          {started(5) ? <li>{reveal(5)}</li> : null}
          {started(6) ? <li>{reveal(6)}</li> : null}
        </ul>
      ) : null}
      {started(7) ? (
        <p>
          {reveal(7)}
          {started(8) ? <code>{reveal(8)}</code> : null}
          {reveal(9)}
        </p>
      ) : null}
      {started(10) ? (
        <pre>
          <code>{reveal(10)}</code>
        </pre>
      ) : null}
    </StreamingResponse>
  )
}

export function StreamingResponsePreview() {
  const [run, setRun] = useState(0)

  return (
    <div className="relative h-[500px] w-full max-w-xl">
      <ResponseDemo key={run} onReplay={() => setRun((value) => value + 1)} />
      <button
        type="button"
        onClick={() => setRun((value) => value + 1)}
        className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2"
      >
        <RotateCcw className="size-3" />
        Replay
      </button>
    </div>
  )
}
