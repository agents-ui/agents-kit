"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AgentState, ReceivedMessage } from "@livekit/components-react"
import { MessageSquare, PhoneOff, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"
import { Orb } from "./elevenlabs/orb"
import { AgentChatTranscript } from "./livekit/agent-chat-transcript"
import { AgentTrackToggle } from "./livekit/agent-track-toggle"
import { voiceOrbState, type VoiceSessionState } from "./state"

export { voiceOrbState, type VoiceSessionState } from "./state"

export interface VoiceAgentSessionProps {
  name?: string
  state: VoiceSessionState
  messages?: ReceivedMessage[]
  microphoneEnabled: boolean
  speakerEnabled: boolean
  inputLevel?: number
  outputLevel?: number
  onMicrophoneChange: (enabled: boolean) => void
  onSpeakerChange: (enabled: boolean) => void
  onDisconnect: () => void
  onConnect?: () => void
  statusText?: string
  className?: string
}

/** Controlled composition: the host owns connection, capture, playback, and agent execution. */
export function VoiceAgentSession({
  name = "Voice assistant",
  state,
  messages = [],
  microphoneEnabled,
  speakerEnabled,
  inputLevel = 0,
  outputLevel = 0,
  onMicrophoneChange,
  onSpeakerChange,
  onDisconnect,
  onConnect,
  statusText,
  className,
}: VoiceAgentSessionProps) {
  const [showTranscript, setShowTranscript] = useState(true)
  const connected = !["idle", "disconnected", "failed"].includes(state)
  const labels: Record<VoiceSessionState, string> = {
    idle: "Ready when you are",
    connecting: "Connecting",
    listening: "Listening",
    thinking: "Thinking",
    speaking: "Speaking",
    disconnected: "Session ended",
    failed: "Connection interrupted",
  }
  return (
    <section
      className={cn(
        "border-border bg-background w-full overflow-hidden rounded-[14px] border",
        className
      )}
      aria-label={`${name} session`}
    >
      <header className="border-border flex items-center justify-between gap-3 border-b px-4 py-3">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-muted-foreground text-xs" aria-live="polite">
          {labels[state]}
        </span>
      </header>
      <div
        className={cn(
          "grid",
          showTranscript && "min-[700px]:grid-cols-[1fr_1fr]"
        )}
      >
        <div className="flex min-h-80 flex-col items-center justify-center gap-4 p-5">
          <div className="size-40" aria-hidden="true">
            <Orb
              agentState={voiceOrbState(state)}
              volumeMode="manual"
              manualInput={microphoneEnabled ? inputLevel : 0}
              manualOutput={speakerEnabled ? outputLevel : 0}
              seed={13}
            />
          </div>
          <p className="text-muted-foreground text-center text-[13px]">
            {statusText ?? labels[state]}
          </p>
          {!connected && onConnect && (
            <Button
              type="button"
              size="sm"
              onClick={onConnect}
              className="rounded-lg"
            >
              {state === "failed" ? "Reconnect" : "Start session"}
            </Button>
          )}
          <div
            className="flex items-center justify-center gap-2"
            role="group"
            aria-label="Voice session controls"
          >
            <AgentTrackToggle
              source="microphone"
              size="default"
              pressed={microphoneEnabled}
              onPressedChange={onMicrophoneChange}
              disabled={!connected}
              className="rounded-lg"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={speakerEnabled ? "Mute speaker" : "Unmute speaker"}
              aria-pressed={speakerEnabled}
              onClick={() => onSpeakerChange(!speakerEnabled)}
              disabled={!connected}
              className="rounded-lg"
            >
              {speakerEnabled ? <Volume2 /> : <VolumeX />}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Show transcript"
              aria-pressed={showTranscript}
              onClick={() => setShowTranscript(!showTranscript)}
              className="rounded-lg"
            >
              <MessageSquare />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              aria-label="End session"
              onClick={onDisconnect}
              disabled={!connected}
              className="rounded-lg"
            >
              <PhoneOff />
            </Button>
          </div>
        </div>
        {showTranscript && (
          <div className="border-border min-w-0 border-t min-[700px]:border-t-0 min-[700px]:border-l">
            <p className="text-muted-foreground border-border border-b px-4 py-3 text-xs">
              Transcript
            </p>
            <AgentChatTranscript
              messages={messages}
              agentState={state as AgentState}
              className="h-64 p-4"
            />
          </div>
        )}
      </div>
    </section>
  )
}
