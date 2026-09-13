"use client"

import { AgentAudioVisualizerBar } from "@/components/voice-agents/livekit/agent-audio-visualizer-bar"
import { AgentAudioVisualizerGrid } from "@/components/voice-agents/livekit/agent-audio-visualizer-grid"
import { AgentAudioVisualizerRadial } from "@/components/voice-agents/livekit/agent-audio-visualizer-radial"
import { AgentAudioVisualizerWave } from "@/components/voice-agents/livekit/agent-audio-visualizer-wave"
import { AgentChatIndicator } from "@/components/voice-agents/livekit/agent-chat-indicator"
import { AgentChatTranscript } from "@/components/voice-agents/livekit/agent-chat-transcript"
import { AgentControlBar } from "@/components/voice-agents/livekit/agent-control-bar"
import { AgentDisconnectButton } from "@/components/voice-agents/livekit/agent-disconnect-button"
import { AgentSessionProvider } from "@/components/voice-agents/livekit/agent-session-provider"
import { AgentTrackControl } from "@/components/voice-agents/livekit/agent-track-control"
import { AgentTrackToggle } from "@/components/voice-agents/livekit/agent-track-toggle"
import { Trigger } from "@/components/voice-agents/livekit/blocks/agent-popup-01/components/trigger"
import { AgentSessionView_01 } from "@/components/voice-agents/livekit/blocks/agent-session-view-01/components/agent-session-block"
import { ReactShaderToy } from "@/components/voice-agents/livekit/react-shader-toy"
import { StartAudioButton } from "@/components/voice-agents/livekit/start-audio-button"
import { cn } from "@/lib/utils"
import {
  useSession,
  type AgentState,
  type ReceivedMessage,
} from "@livekit/components-react"
import { Room, TokenSource } from "livekit-client"
import { AudioLinesIcon } from "lucide-react"
import { useReducedMotion } from "motion/react"
import * as React from "react"

export type LiveKitVoicePreviewName =
  | "agent-disconnect-button"
  | "agent-track-toggle"
  | "agent-track-control"
  | "agent-control-bar"
  | "agent-audio-visualizer-bar"
  | "agent-audio-visualizer-radial"
  | "agent-audio-visualizer-grid"
  | "agent-session-provider"
  | "start-audio-button"
  | "agent-chat-indicator"
  | "agent-chat-transcript"
  | "react-shader-toy"
  | "agent-audio-visualizer-wave"
  | "agent-session-view-01"
  | "agent-popup-01"

const agentStates: AgentState[] = [
  "connecting",
  "listening",
  "thinking",
  "speaking",
]

// useSession prepares its Room on mount. This real Room instance keeps that
// supported lifecycle local while preventing a gallery preview from opening a
// network connection. No preview calls session.start() or captures media.
class OfflinePreviewRoom extends Room {
  override prepareConnection(): Promise<void> {
    return Promise.resolve()
  }
}

const offlineTokenSource = TokenSource.literal({
  serverUrl: "wss://example.invalid",
  participantToken: "",
})

function OfflineSession({ children }: { children: React.ReactNode }) {
  const [room] = React.useState(() => new OfflinePreviewRoom())
  const session = useSession(offlineTokenSource, { room })
  return (
    <AgentSessionProvider session={session}>{children}</AgentSessionProvider>
  )
}

function VoiceStage({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-40 w-full flex-col items-center justify-center gap-4 p-3 sm:p-4",
        className
      )}
    >
      {children}
    </div>
  )
}

function StatePicker({
  state,
  onChange,
}: {
  state: AgentState
  onChange: (state: AgentState) => void
}) {
  return (
    <div
      aria-label="Agent state"
      className="bg-background flex flex-wrap items-center justify-center gap-1 rounded-lg border p-1"
      role="group"
    >
      {agentStates.map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={state === value}
          className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring aria-pressed:bg-muted aria-pressed:text-foreground h-8 rounded-md px-2.5 text-xs font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:outline-none"
          onClick={() => onChange(value)}
        >
          {value}
        </button>
      ))}
    </div>
  )
}

function syntheticVoiceLevel(step: number, band = 0) {
  const primary = Math.abs(Math.sin(step * 0.43 + band * 0.91))
  const detail = Math.abs(Math.sin(step * 0.19 + band * 1.73))
  return Math.min(0.96, 0.16 + primary * 0.58 + detail * 0.2)
}

function useSyntheticVoiceSample(state: AgentState, bandCount: number) {
  const prefersReducedMotion = useReducedMotion()
  const [step, setStep] = React.useState(3)

  React.useEffect(() => {
    if (state !== "speaking" || prefersReducedMotion) return
    const timer = window.setInterval(() => setStep((value) => value + 1), 90)
    return () => window.clearInterval(timer)
  }, [prefersReducedMotion, state])

  const visibleStep = prefersReducedMotion ? 3 : step
  return React.useMemo(
    () => ({
      volume: syntheticVoiceLevel(visibleStep),
      volumeBands: Array.from({ length: bandCount }, (_, index) =>
        syntheticVoiceLevel(visibleStep, index)
      ),
    }),
    [bandCount, visibleStep]
  )
}

function VisualizerPreview({
  type,
}: {
  type: "bar" | "radial" | "grid" | "wave"
}) {
  const [state, setState] = React.useState<AgentState>("speaking")
  const bandCount = type === "radial" ? 28 : type === "grid" ? 81 : 5
  const sample = useSyntheticVoiceSample(state, bandCount)
  const visualizer = {
    bar: (
      <AgentAudioVisualizerBar
        aria-label="Bar audio visualizer"
        barCount={5}
        size="sm"
        state={state}
        volumeBands={sample.volumeBands}
      />
    ),
    radial: (
      <AgentAudioVisualizerRadial
        aria-label="Radial audio visualizer"
        barCount={28}
        radius={42}
        size="md"
        state={state}
        volumeBands={sample.volumeBands}
      />
    ),
    grid: (
      <AgentAudioVisualizerGrid
        aria-label="Grid audio visualizer"
        className="size-40 gap-1"
        columnCount={9}
        radius={3}
        rowCount={9}
        size="md"
        state={state}
        volumeBands={sample.volumeBands}
      />
    ),
    wave: (
      <AgentAudioVisualizerWave
        aria-label="Wave audio visualizer"
        className="size-48"
        color="#0d94ad"
        lineWidth={3}
        size="md"
        state={state}
        volume={sample.volume}
      />
    ),
  }[type]

  return (
    <VoiceStage className="min-h-64">
      <div className="text-primary grid min-h-40 place-items-center">
        {visualizer}
      </div>
      <StatePicker state={state} onChange={setState} />
    </VoiceStage>
  )
}

function TrackToggleGroup({ grouped = false }: { grouped?: boolean }) {
  const [tracks, setTracks] = React.useState({
    camera: false,
    microphone: true,
    screen_share: false,
  })
  const sources = ["microphone", "camera", "screen_share"] as const
  return (
    <>
      <div
        className={cn(
          "flex items-center gap-1",
          grouped && "bg-background rounded-[10px] border p-2 shadow-sm"
        )}
      >
        {sources.map((source) => (
          <AgentTrackToggle
            key={source}
            source={source}
            pressed={tracks[source]}
            variant="outline"
            onPressedChange={(pressed) =>
              setTracks((current) => ({ ...current, [source]: pressed }))
            }
          />
        ))}
      </div>
      <p aria-live="polite" className="text-muted-foreground text-xs">
        Offline control state. A LiveKit room connects device publishing.
      </p>
    </>
  )
}

function TrackTogglePreview({ grouped = false }: { grouped?: boolean }) {
  return (
    <VoiceStage>
      <TrackToggleGroup grouped={grouped} />
    </VoiceStage>
  )
}

const transcriptMessages = [
  {
    id: "voice-1",
    timestamp: Date.parse("2026-01-01T10:00:00Z"),
    from: { isLocal: true },
    message: "Summarize the deployment status.",
  },
  {
    id: "voice-2",
    timestamp: Date.parse("2026-01-01T10:00:04Z"),
    from: { isLocal: false },
    message: "The release is healthy. All checks passed in the last run.",
  },
] as ReceivedMessage[]

function TranscriptPreview() {
  return (
    <VoiceStage>
      <div className="bg-background h-64 w-full max-w-lg overflow-hidden rounded-[10px] border">
        <AgentChatTranscript
          agentState="thinking"
          messages={transcriptMessages}
          className="p-4"
        />
      </div>
    </VoiceStage>
  )
}

function DisconnectedControlPreview({
  type,
}: {
  type: "disconnect" | "start-audio" | "track-control"
}) {
  return (
    <VoiceStage>
      <OfflineSession>
        {type === "disconnect" ? (
          <AgentDisconnectButton disabled>End call</AgentDisconnectButton>
        ) : type === "start-audio" ? (
          <StartAudioButton
            label="Enable audio"
            variant="outline"
            disabled
            className="inline-flex!"
          />
        ) : (
          <AgentTrackControl
            disabled
            kind="audioinput"
            pressed={false}
            source="microphone"
            variant="outline"
          />
        )}
      </OfflineSession>
      <p className="text-muted-foreground text-center text-xs">
        {type === "start-audio"
          ? "Autoplay recovery preview. Appears when browser audio is blocked."
          : "Disconnected state. A real LiveKit session enables this control."}
      </p>
    </VoiceStage>
  )
}

function ProviderPreview() {
  return (
    <VoiceStage>
      <OfflineSession>
        <div className="bg-background flex w-full max-w-sm items-center gap-3 rounded-[10px] border p-4 shadow-sm">
          <div className="bg-muted grid size-9 place-items-center rounded-lg">
            <AudioLinesIcon className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Session context ready</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Disconnected until session.start() is called.
            </p>
          </div>
        </div>
      </OfflineSession>
    </VoiceStage>
  )
}

function DisconnectedSessionView() {
  return (
    <VoiceStage className="min-h-[440px]">
      <div className="bg-background h-[400px] w-full max-w-lg overflow-hidden rounded-[14px] border shadow-sm">
        <OfflineSession>
          <fieldset disabled className="h-full min-w-0 border-0 p-0">
            <AgentSessionView_01
              controls={{
                leave: true,
                microphone: true,
                camera: false,
                screenShare: false,
                chat: false,
              }}
              isPreConnectBufferEnabled
              preConnectMessage="Connect a LiveKit session to start talking"
              saveUserChoices={false}
            />
          </fieldset>
        </OfflineSession>
      </div>
    </VoiceStage>
  )
}

function PopupComposition() {
  const [open, setOpen] = React.useState(false)
  const sample = useSyntheticVoiceSample(open ? "speaking" : "disconnected", 5)
  return (
    <VoiceStage className="relative">
      <Trigger
        agentName="Support"
        isPressed={open}
        onToggle={() => setOpen((current) => !current)}
        className="relative right-auto bottom-auto"
      />
      {open && (
        <div className="bg-background flex w-full max-w-sm flex-col overflow-hidden rounded-[14px] border shadow-sm">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <span className="size-2 rounded-full bg-emerald-500" />
            <p className="text-sm font-medium">Voice agent</p>
            <span className="text-muted-foreground ml-auto text-xs">
              Preview
            </span>
          </div>
          <div className="text-primary grid min-h-40 place-items-center p-5">
            <AgentAudioVisualizerBar
              barCount={5}
              size="sm"
              state="speaking"
              volumeBands={sample.volumeBands}
            />
          </div>
          <div className="border-t p-3">
            <TrackToggleGroup />
          </div>
        </div>
      )}
      <p className="text-muted-foreground text-center text-xs">
        Interactive preview. Connect a session to enable audio.
      </p>
    </VoiceStage>
  )
}

const shaderSource = `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  float wave = 0.5 + 0.5 * sin((uv.x * 8.0) + iTime * 1.4);
  vec3 quiet = vec3(0.08, 0.20, 0.36);
  vec3 bright = vec3(0.12, 0.72, 0.90);
  fragColor = vec4(mix(quiet, bright, wave * uv.y), 1.0);
}`

export function LiveKitVoicePreview({
  preview,
}: {
  preview: LiveKitVoicePreviewName
}) {
  switch (preview) {
    case "agent-audio-visualizer-bar":
      return <VisualizerPreview type="bar" />
    case "agent-audio-visualizer-radial":
      return <VisualizerPreview type="radial" />
    case "agent-audio-visualizer-grid":
      return <VisualizerPreview type="grid" />
    case "agent-audio-visualizer-wave":
      return <VisualizerPreview type="wave" />
    case "agent-track-toggle":
      return <TrackTogglePreview />
    case "agent-track-control":
      return <DisconnectedControlPreview type="track-control" />
    case "agent-control-bar":
      return (
        <VoiceStage>
          <OfflineSession>
            <fieldset disabled className="w-full max-w-lg min-w-0 border-0 p-0">
              <AgentControlBar
                controls={{
                  leave: true,
                  microphone: true,
                  camera: false,
                  screenShare: false,
                  chat: true,
                }}
                isConnected={false}
                saveUserChoices={false}
                variant="livekit"
              />
            </fieldset>
          </OfflineSession>
          <p className="text-muted-foreground text-center text-xs">
            Disconnected state. Media controls require a real room.
          </p>
        </VoiceStage>
      )
    case "agent-chat-indicator":
      return (
        <VoiceStage>
          <div className="bg-background flex items-center gap-3 rounded-[10px] border px-4 py-3">
            <AgentChatIndicator size="sm" />
            <span className="text-muted-foreground text-sm">
              Agent is thinking
            </span>
          </div>
        </VoiceStage>
      )
    case "agent-chat-transcript":
      return <TranscriptPreview />
    case "react-shader-toy":
      return (
        <VoiceStage>
          <div className="size-52 overflow-hidden rounded-[14px] border">
            <ReactShaderToy
              aria-label="Animated voice shader"
              devicePixelRatio={2}
              fs={shaderSource}
            />
          </div>
        </VoiceStage>
      )
    case "agent-session-view-01":
      return <DisconnectedSessionView />
    case "agent-popup-01":
      return <PopupComposition />
    case "agent-session-provider":
      return <ProviderPreview />
    case "start-audio-button":
      return <DisconnectedControlPreview type="start-audio" />
    case "agent-disconnect-button":
      return <DisconnectedControlPreview type="disconnect" />
  }
}
