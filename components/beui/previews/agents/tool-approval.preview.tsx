"use client"

import {
  ToolApproval,
  ToolApprovalCode,
  type ToolApprovalStatus,
} from "@/components/beui/components/agents/tool-approval"
import { RotateCcw } from "lucide-react"
import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"

export function ToolApprovalPreview() {
  const [status, setStatus] = useState<ToolApprovalStatus>("pending")
  const [detailsOpen, setDetailsOpen] = useState(true)
  const timers = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const finish = (next: ToolApprovalStatus) => {
    clearTimers()
    setStatus(next)
  }

  const approve = () => {
    clearTimers()
    setStatus("approving")
    timers.current = [
      window.setTimeout(() => setStatus("approved"), 600),
      window.setTimeout(() => setStatus("running"), 1150),
      window.setTimeout(() => setStatus("complete"), 2200),
    ]
  }

  const replay = () => {
    clearTimers()
    setStatus("pending")
    setDetailsOpen(true)
  }

  return (
    <div className="relative h-[360px] w-full max-w-lg">
      <ToolApproval
        tool="terminal.run"
        title={
          status === "pending" ? "Allow this tool to run?" : "Terminal access"
        }
        description="The agent wants to validate the interview evidence in the current project."
        status={status}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        parameters={[
          {
            id: "command",
            label: "Command",
            value: (
              <ToolApprovalCode
                code="npm test -- fieldwork-evidence"
                language="bash"
              />
            ),
          },
          { id: "directory", label: "Project", value: "jaipur-mobility" },
        ]}
        onApprove={approve}
        onAlwaysAllow={approve}
        onDeny={() => finish("denied")}
      />
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
