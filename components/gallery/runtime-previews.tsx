"use client"

import {
  AgentCheckpoint,
  type CheckpointStatus,
} from "@/components/agents-ui/agent-checkpoint"
import { AgentContextMeter } from "@/components/agents-ui/agent-context-meter"
import {
  ThinkingIndicator,
  ThinkingOrb,
  type ThinkingOrbSize,
  type ThinkingState,
} from "@/components/agents-ui/agent-thinking-indicator"
import * as React from "react"

const states: ThinkingState[] = [
  "working",
  "searching",
  "solving",
  "listening",
  "connecting",
  "weaving",
  "composing",
  "breathing",
  "shaping",
]

export function ThinkingIndicatorPreview() {
  const [state, setState] = React.useState<ThinkingState>("working")
  const [paused, setPaused] = React.useState(false)
  const [size, setSize] = React.useState<ThinkingOrbSize>(64)
  const [density, setDensity] = React.useState(1)
  const [ink, setInk] = React.useState("")
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div className="flex min-h-48 flex-col items-center justify-center gap-6">
        <ThinkingOrb
          state={state}
          size={size}
          dots={density}
          color={ink || undefined}
          paused={paused}
        />
        <ThinkingIndicator state={state} size={20} paused={paused} />
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {states.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={state === value}
            className={`rounded-md px-2 py-1.5 text-xs capitalize ${state === value ? "bg-background-primary-default shadow-sm" : "text-text-secondary"}`}
            onClick={() => setState(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="text-text-secondary mx-auto mt-5 grid max-w-sm grid-cols-3 gap-3 text-xs">
        <label>
          Size
          <select
            aria-label="Orb size"
            value={size}
            onChange={(event) =>
              setSize(Number(event.target.value) as ThinkingOrbSize)
            }
            className="border-separator-border bg-background-primary-default mt-1 h-8 w-full rounded-md border px-2"
          >
            {[20, 32, 64].map((value) => (
              <option key={value} value={value}>
                {value}px
              </option>
            ))}
          </select>
        </label>
        <label>
          Density
          <select
            aria-label="Orb density"
            value={density}
            onChange={(event) => setDensity(Number(event.target.value))}
            className="border-separator-border bg-background-primary-default mt-1 h-8 w-full rounded-md border px-2"
          >
            <option value={0.6}>Light</option>
            <option value={1}>Default</option>
            <option value={1.5}>Dense</option>
          </select>
        </label>
        <label>
          Ink
          <select
            aria-label="Orb ink"
            value={ink}
            onChange={(event) => setInk(event.target.value)}
            className="border-separator-border bg-background-primary-default mt-1 h-8 w-full rounded-md border px-2"
          >
            <option value="">Mono</option>
            <option value="#3b82f6">Blue</option>
            <option value="#10b981">Green</option>
          </select>
        </label>
      </div>
      <button
        type="button"
        className="text-text-secondary mx-auto mt-4 block rounded-md px-2 py-1 text-xs"
        onClick={() => setPaused(!paused)}
      >
        {paused ? "Resume motion" : "Pause motion"}
      </button>
    </div>
  )
}

export function ContextMeterPreview() {
  return (
    <div className="w-full max-w-xl">
      <AgentContextMeter
        usedTokens={42760}
        totalTokens={128000}
        sources={[
          {
            id: "system",
            label: "System instructions",
            tokens: 4200,
            kind: "system",
          },
          {
            id: "conversation",
            label: "Conversation",
            tokens: 18640,
            kind: "conversation",
          },
          {
            id: "retrieval",
            label: "Retrieved sources",
            tokens: 12480,
            kind: "retrieval",
          },
          { id: "tools", label: "Tool results", tokens: 7440, kind: "tools" },
        ]}
      />
    </div>
  )
}

export function CheckpointPreview() {
  const [status, setStatus] = React.useState<CheckpointStatus>("ready")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-4">
      <AgentCheckpoint
        id="research-review"
        label="Before the final changes"
        description="Return to the saved conversation and result versions."
        timestamp="Today, 14:32"
        messageCount={18}
        status={status}
        progress={status === "restoring" ? 64 : undefined}
        error={
          status === "error"
            ? "The saved revision could not be loaded. Try restoring it again."
            : undefined
        }
        onRestore={() => setStatus("restored")}
        onResume={() => setStatus("ready")}
      />
      <div className="flex flex-wrap justify-center gap-1">
        {(["ready", "restoring", "restored", "error"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            aria-pressed={status === value}
            className={`rounded-md px-2 py-1 text-xs capitalize ${status === value ? "bg-background-primary-default shadow-sm" : "text-text-secondary"}`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  )
}
