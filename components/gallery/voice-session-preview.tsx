"use client"

import { Button } from "@/components/ui/button"
import {
  VoiceAgentSession,
  type VoiceSessionState,
} from "@/components/voice-agents/session"
import type { ReceivedMessage } from "@livekit/components-react"
import { useState } from "react"

const messages = [
  {
    id: "voice-user",
    timestamp: Date.parse("2026-09-13T10:00:00Z"),
    from: { isLocal: true },
    message: "What is ready for the workshop?",
  },
  {
    id: "voice-agent",
    timestamp: Date.parse("2026-09-13T10:00:04Z"),
    from: { isLocal: false },
    message:
      "The studio is booked and the materials are ready. We still need to confirm the guest list.",
  },
] as ReceivedMessage[]

export function VoiceSessionPreview() {
  const [state, setState] = useState<VoiceSessionState>("listening")
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true)
  const [speakerEnabled, setSpeakerEnabled] = useState(true)
  const [level, setLevel] = useState(0.45)
  return (
    <div className="w-full space-y-4">
      <VoiceAgentSession
        name="Fieldwork assistant"
        state={state}
        messages={messages}
        microphoneEnabled={microphoneEnabled}
        speakerEnabled={speakerEnabled}
        inputLevel={state === "listening" ? level : 0}
        outputLevel={state === "speaking" ? level : 0}
        onMicrophoneChange={setMicrophoneEnabled}
        onSpeakerChange={setSpeakerEnabled}
        onDisconnect={() => setState("disconnected")}
        onConnect={() => setState("listening")}
        statusText={
          state === "listening" ? "Listening for your next question" : undefined
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Preview voice state"
          className="flex flex-wrap gap-1"
        >
          {(["listening", "thinking", "speaking", "failed"] as const).map(
            (value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={state === value ? "secondary" : "ghost"}
                aria-pressed={state === value}
                onClick={() => setState(value)}
                className="rounded-lg capitalize"
              >
                {value}
              </Button>
            )
          )}
        </div>
        <label className="text-muted-foreground flex items-center gap-2 text-xs">
          Audio level
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={level}
            onChange={(event) => setLevel(Number(event.target.value))}
            className="w-24 accent-current"
          />
        </label>
      </div>
      <p className="text-muted-foreground text-xs">
        Interactive preview. No microphone or live agent connection.
      </p>
    </div>
  )
}
