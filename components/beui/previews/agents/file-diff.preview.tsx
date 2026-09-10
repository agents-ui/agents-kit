"use client"

import {
  FileDiff,
  type FileDiffLine,
} from "@/components/beui/components/agents/file-diff"
import { RotateCcw } from "lucide-react"
import * as React from "react"
import { useState } from "react"
import { useToolResultDemo } from "./use-tool-result-demo"

const DIFF_LINES: FileDiffLine[] = [
  {
    id: "1",
    oldLine: 18,
    newLine: 18,
    content: "export async function summarizeInterview() {",
  },
  {
    id: "2",
    type: "removed",
    oldLine: 19,
    content: "  return summarize(transcript);",
  },
  {
    id: "3",
    type: "added",
    newLine: 19,
    content: "  const result = await summarize(transcript);",
  },
  {
    id: "4",
    type: "added",
    newLine: 20,
    content: "  return linkEvidence(result);",
  },
  { id: "5", oldLine: 20, newLine: 21, content: "}" },
]

function FileRun() {
  const { visible, status } = useToolResultDemo(DIFF_LINES.length, 360)

  return (
    <FileDiff
      file="research/summarize-interview.ts"
      lines={DIFF_LINES.slice(0, visible)}
      status={status === "success" ? "complete" : "streaming"}
      copyText={DIFF_LINES.map((line) => line.content).join("\n")}
      maxHeight={150}
    />
  )
}

export function FileDiffPreview() {
  const [run, setRun] = useState(0)

  return (
    <div className="relative h-[300px] w-full max-w-lg">
      <FileRun key={run} />
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
