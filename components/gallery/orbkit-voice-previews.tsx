"use client"

import { Button } from "@/components/ui/button"
import type { OrbState } from "@/components/voice-agents/orbkit/core"
import { Shdr11 } from "@/components/voice-agents/orbkit/shdr-11"
import { Shdr13 } from "@/components/voice-agents/orbkit/shdr-13"
import { Shdr14 } from "@/components/voice-agents/orbkit/shdr-14"
import { Shdr21 } from "@/components/voice-agents/orbkit/shdr-21"
import { useState, type ComponentType } from "react"

export type OrbkitVoicePreviewName =
  | "shdr-11"
  | "shdr-13"
  | "shdr-14"
  | "shdr-21"

type OrbComponent = ComponentType<{
  size?: number
  state?: OrbState
  maxDpr?: number
  pauseOffscreen?: boolean
}>

const orbs: Record<OrbkitVoicePreviewName, OrbComponent> = {
  "shdr-11": Shdr11,
  "shdr-13": Shdr13,
  "shdr-14": Shdr14,
  "shdr-21": Shdr21,
}

export function OrbkitVoicePreview({ name }: { name: OrbkitVoicePreviewName }) {
  const [state, setState] = useState<OrbState>("idle")
  const Orb = orbs[name]

  return (
    <div className="mx-auto flex min-h-52 w-full max-w-2xl flex-col items-center justify-center gap-3 p-3 text-sm">
      <Orb size={160} state={state} maxDpr={2} pauseOffscreen />
      <div
        role="group"
        aria-label="Agent state"
        className="bg-background flex flex-wrap justify-center gap-1 rounded-lg border p-1"
      >
        {(["idle", "thinking", "speaking"] as const).map((nextState) => (
          <Button
            key={nextState}
            type="button"
            size="sm"
            variant={state === nextState ? "secondary" : "ghost"}
            aria-pressed={state === nextState}
            className="h-8 rounded-md px-2.5 text-xs capitalize"
            onClick={() => setState(nextState)}
          >
            {nextState}
          </Button>
        ))}
      </div>
    </div>
  )
}
