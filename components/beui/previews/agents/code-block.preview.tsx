"use client"

import { CodeBlock } from "@/components/beui/components/agents/code-block"
import { RotateCcw } from "lucide-react"
import * as React from "react"
import { useEffect, useRef, useState } from "react"

const LINES = [
  'import { interviews } from "./jaipur-fieldwork";',
  "",
  "export function supportedThemes() {",
  "  return interviews.flatMap((interview) =>",
  "    interview.themes.map((theme) => ({",
  "      theme, evidence: interview.id,",
  "    })),",
  "  );",
  "",
  "  // Keep every finding traceable.",
  "}",
]

function StreamingCodeBlock() {
  const [visibleLines, setVisibleLines] = useState(1)
  const timer = useRef<number | undefined>(undefined)
  const complete = visibleLines === LINES.length

  useEffect(() => {
    if (visibleLines >= LINES.length) return
    timer.current = window.setTimeout(
      () => setVisibleLines((value) => value + 1),
      260
    )
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [visibleLines])

  return (
    <CodeBlock
      filename="supported-themes.ts"
      language="typescript"
      code={LINES.slice(0, visibleLines).join("\n")}
      status={complete ? "complete" : "streaming"}
      highlightLines={[4, 5, 6, 7]}
      maxHeight={224}
    />
  )
}

export function CodeBlockPreview() {
  const [run, setRun] = useState(0)

  return (
    <div className="relative h-[340px] w-full max-w-xl">
      <StreamingCodeBlock key={run} />
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
