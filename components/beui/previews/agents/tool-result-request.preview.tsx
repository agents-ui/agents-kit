"use client"

import { AgentCode } from "@/components/beui/components/agents/agent-code"
import {
  ToolResult,
  ToolResultOutput,
} from "@/components/beui/components/agents/tool-result"
import { RotateCcw } from "lucide-react"
import * as React from "react"
import { useState } from "react"
import { useToolResultDemo } from "./use-tool-result-demo"

const RESPONSE = `{
  "error": "source_temporarily_unavailable",
  "retryAfter": 20,
  "sourceId": "transcript_14"
}`

function RequestRun({ onReplay }: { onReplay: () => void }) {
  const { visible, status } = useToolResultDemo(3, 600, "error")

  return (
    <ToolResult
      tool="http.request"
      title={
        status === "running"
          ? "Fetching transcript notes"
          : "Source request failed"
      }
      kind="request"
      status={status}
      meta={status === "error" ? "503" : "GET /fieldwork/transcripts/14"}
      copyText={RESPONSE}
      onRetry={onReplay}
      collapseOnComplete={false}
      maxHeight={150}
    >
      {visible < 3 ? (
        <ToolResultOutput>
          {visible === 0
            ? "Preparing request…"
            : visible === 1
              ? "GET /fieldwork/transcripts/14\nConnecting…"
              : "GET /fieldwork/transcripts/14\nWaiting for response…"}
        </ToolResultOutput>
      ) : (
        <AgentCode code={RESPONSE} language="json" />
      )}
    </ToolResult>
  )
}

export function ToolResultRequestPreview() {
  const [run, setRun] = useState(0)
  const replay = () => setRun((value) => value + 1)

  return (
    <div className="relative h-[330px] w-full max-w-lg">
      <RequestRun key={run} onReplay={replay} />
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
