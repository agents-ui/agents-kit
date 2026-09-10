"use client"

import {
  ToolResult,
  ToolResultOutput,
} from "@/components/beui/components/agents/tool-result"
import { RotateCcw } from "lucide-react"
import * as React from "react"
import { useState } from "react"
import { useToolResultDemo } from "./use-tool-result-demo"

const OUTPUT = [
  "$ npm test -- fieldwork-evidence",
  "checking 12 interview records",
  "✓ participant consent attached",
  "✓ quotes linked to transcripts",
  "✓ location notes normalized",
  "12 records · 0 unresolved",
] as const

function TerminalRun({ onReplay }: { onReplay: () => void }) {
  const { visible, status } = useToolResultDemo(OUTPUT.length)
  const output = OUTPUT.slice(0, visible).join("\n")

  return (
    <ToolResult
      tool="terminal.run"
      title={
        status === "running"
          ? "Checking field evidence"
          : "Evidence checks passed"
      }
      kind="terminal"
      status={status}
      meta={status === "success" ? "2.9s" : undefined}
      copyText={output}
      onRetry={onReplay}
      maxHeight={150}
    >
      <ToolResultOutput>{output}</ToolResultOutput>
    </ToolResult>
  )
}

export function ToolResultTerminalPreview() {
  const [run, setRun] = useState(0)
  const replay = () => setRun((value) => value + 1)

  return (
    <div className="relative h-[330px] w-full max-w-lg">
      <TerminalRun key={run} onReplay={replay} />
      <button
        type="button"
        onClick={replay}
        className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2"
      >
        <RotateCcw className="size-3" />
        Replay
      </button>
    </div>
  )
}
