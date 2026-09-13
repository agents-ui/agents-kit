"use client"

import { Button } from "@/components/ui/button"
import {
  AudioPlayerButton,
  AudioPlayerDuration,
  AudioPlayerProgress,
  AudioPlayerProvider,
  AudioPlayerTime,
} from "@/components/voice-agents/elevenlabs/audio-player"
import { BarVisualizer } from "@/components/voice-agents/elevenlabs/bar-visualizer"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/voice-agents/elevenlabs/conversation"
import { ConversationBar } from "@/components/voice-agents/elevenlabs/conversation-bar"
import { LiveWaveform } from "@/components/voice-agents/elevenlabs/live-waveform"
import { loader, Matrix } from "@/components/voice-agents/elevenlabs/matrix"
import {
  Message,
  MessageContent,
} from "@/components/voice-agents/elevenlabs/message"
import { MicSelector } from "@/components/voice-agents/elevenlabs/mic-selector"
import { Orb } from "@/components/voice-agents/elevenlabs/orb"
import { Response } from "@/components/voice-agents/elevenlabs/response"
import {
  ScrubBarContainer,
  ScrubBarProgress,
  ScrubBarThumb,
  ScrubBarTimeLabel,
  ScrubBarTrack,
} from "@/components/voice-agents/elevenlabs/scrub-bar"
import { ShimmeringText } from "@/components/voice-agents/elevenlabs/shimmering-text"
import {
  SpeechInput,
  SpeechInputPreview,
  SpeechInputRecordButton,
} from "@/components/voice-agents/elevenlabs/speech-input"
import {
  TranscriptViewerAudio,
  TranscriptViewerContainer,
  TranscriptViewerPlayPauseButton,
  TranscriptViewerScrubBar,
  TranscriptViewerWords,
} from "@/components/voice-agents/elevenlabs/transcript-viewer"
import { VoiceButton } from "@/components/voice-agents/elevenlabs/voice-button"
import { VoicePicker } from "@/components/voice-agents/elevenlabs/voice-picker"
import {
  AudioScrubber,
  LiveMicrophoneWaveform,
  MicrophoneWaveform,
  RecordingWaveform,
  ScrollingWaveform,
  StaticWaveform,
  Waveform,
} from "@/components/voice-agents/elevenlabs/waveform"
import { getBaseUrl } from "@/lib/utils"
import { ConversationProvider } from "@elevenlabs/react"
import { AudioLines, Mic } from "lucide-react"
import { useState } from "react"

export type ElevenLabsVoicePreviewName =
  | "audio-player"
  | "bar-visualizer"
  | "conversation-bar"
  | "conversation"
  | "live-waveform"
  | "matrix"
  | "message"
  | "mic-selector"
  | "orb"
  | "response"
  | "scrub-bar"
  | "shimmering-text"
  | "speech-input"
  | "transcript-viewer"
  | "voice-button"
  | "voice-picker"
  | "waveform"

const samples = [
  0.2, 0.42, 0.68, 0.34, 0.8, 0.56, 0.3, 0.72, 0.46, 0.62, 0.26, 0.5,
]

function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-40 w-full max-w-2xl items-center justify-center p-3 text-sm">
      {children}
    </div>
  )
}

function LiveSessionRequired({
  feature,
  children,
}: {
  feature: string
  children: React.ReactNode
}) {
  return (
    <PreviewFrame>
      <div className="w-full max-w-lg space-y-3">
        {children}
        <div className="bg-muted/30 flex items-start gap-2 rounded-lg border px-3 py-2">
          <Mic className="mt-0.5 size-3.5 shrink-0" />
          <p className="text-muted-foreground text-xs leading-5">
            <span className="text-foreground font-medium">{feature}.</span> Live
            session required. This preview never requests microphone access or
            provider credentials.
          </p>
        </div>
      </div>
    </PreviewFrame>
  )
}

function AudioPlayerPreview() {
  const sample = {
    id: "preview-tone",
    src: `${getBaseUrl()}/examples/voice-preview-tone.wav`,
    data: { name: "Generated preview tone" },
  }
  return (
    <PreviewFrame>
      <AudioPlayerProvider>
        <div className="flex w-full max-w-lg items-center gap-3 rounded-lg border p-3">
          <AudioPlayerButton
            item={sample}
            aria-label="Play generated preview tone"
          />
          <AudioPlayerTime />
          <AudioPlayerProgress className="flex-1" />
          <AudioPlayerDuration />
        </div>
      </AudioPlayerProvider>
    </PreviewFrame>
  )
}

function ConversationPreview() {
  return (
    <PreviewFrame>
      <Conversation className="h-48 w-full">
        <ConversationContent>
          <Message from="user">
            <MessageContent variant="flat">
              Summarize the customer call.
            </MessageContent>
          </Message>
          <Message from="assistant">
            <MessageContent variant="flat">
              The customer confirmed the rollout and requested a Friday
              check-in.
            </MessageContent>
          </Message>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    </PreviewFrame>
  )
}

function ScrubBarPreview() {
  const [value, setValue] = useState(42)
  return (
    <PreviewFrame>
      <ScrubBarContainer
        className="w-full max-w-lg gap-3"
        duration={120}
        value={value}
        onScrub={setValue}
      >
        <ScrubBarTimeLabel time={value} />
        <ScrubBarTrack className="flex-1">
          <ScrubBarProgress />
          <ScrubBarThumb />
        </ScrubBarTrack>
        <ScrubBarTimeLabel time={120 - value} />
      </ScrubBarContainer>
    </PreviewFrame>
  )
}

function TranscriptPreview() {
  const text = "Your voice agent is ready for the next customer."
  const characters = [...text]
  const alignment = {
    characters,
    characterStartTimesSeconds: characters.map((_, index) => index * 0.08),
    characterEndTimesSeconds: characters.map((_, index) => (index + 1) * 0.08),
  }
  return (
    <PreviewFrame>
      <div className="w-full max-w-xl space-y-2">
        <p className="text-muted-foreground text-xs">
          Synthetic timing demo · the generated tone is not speech
        </p>
        <TranscriptViewerContainer
          className="space-y-3"
          audioSrc={`${getBaseUrl()}/examples/voice-preview-tone.wav`}
          audioType="audio/wav"
          alignment={alignment}
        >
          <TranscriptViewerWords />
          <div className="flex items-center gap-3">
            <TranscriptViewerPlayPauseButton />
            <TranscriptViewerScrubBar className="flex-1" />
          </div>
          <TranscriptViewerAudio />
        </TranscriptViewerContainer>
      </div>
    </PreviewFrame>
  )
}

function VoicePickerPreview() {
  const [voice, setVoice] = useState("aria")
  return (
    <PreviewFrame>
      <div className="w-full max-w-sm">
        <VoicePicker
          value={voice}
          onValueChange={setVoice}
          voices={[
            {
              voiceId: "aria",
              name: "Aria",
              labels: { accent: "American", gender: "female" },
            },
            {
              voiceId: "liam",
              name: "Liam",
              labels: { accent: "British", gender: "male" },
            },
            {
              voiceId: "maya",
              name: "Maya",
              labels: { accent: "Australian", gender: "female" },
            },
          ]}
        />
      </div>
    </PreviewFrame>
  )
}

function VoiceButtonPreview() {
  const [state, setState] = useState<
    "idle" | "recording" | "processing" | "success"
  >("idle")
  return (
    <PreviewFrame>
      <div className="space-y-3">
        <VoiceButton
          state={state}
          disabled={state === "recording"}
          label={
            state === "idle"
              ? "Talk"
              : state === "recording"
                ? "Listening"
                : state === "processing"
                  ? "Processing"
                  : "Captured"
          }
          icon={<Mic className="size-4" />}
        />
        <div
          role="group"
          aria-label="Voice button state"
          className="bg-background flex flex-wrap justify-center gap-1 rounded-lg border p-1"
        >
          {(["idle", "recording", "processing", "success"] as const).map(
            (nextState) => (
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
            )
          )}
        </div>
        {state === "recording" ? (
          <p className="text-muted-foreground text-xs">
            Visual state only. Microphone capture is disabled in the gallery.
          </p>
        ) : null}
      </div>
    </PreviewFrame>
  )
}

function OrbPreview() {
  const [state, setState] = useState<"thinking" | "listening" | "talking">(
    "thinking"
  )
  return (
    <PreviewFrame>
      <div className="flex flex-col items-center gap-3">
        <Orb seed={42} agentState={state} className="size-40" />
        <div
          role="group"
          aria-label="Agent state"
          className="bg-background flex flex-wrap justify-center gap-1 rounded-lg border p-1"
        >
          {(["listening", "thinking", "talking"] as const).map((nextState) => (
            <Button
              key={nextState}
              type="button"
              size="sm"
              variant={state === nextState ? "secondary" : "ghost"}
              aria-pressed={state === nextState}
              className="h-8 rounded-md px-2.5 text-xs capitalize"
              onClick={() => setState(nextState)}
            >
              {nextState === "talking" ? "speaking" : nextState}
            </Button>
          ))}
        </div>
      </div>
    </PreviewFrame>
  )
}

function WaveformPreview() {
  const [position, setPosition] = useState(34)
  return (
    <PreviewFrame>
      <div className="grid w-full gap-3 sm:grid-cols-2">
        <WaveformSpecimen label="Waveform">
          <Waveform data={samples} height={42} aria-label="Waveform" />
        </WaveformSpecimen>
        <WaveformSpecimen label="Static">
          <StaticWaveform
            bars={32}
            seed={7}
            height={42}
            aria-label="Static waveform"
          />
        </WaveformSpecimen>
        <WaveformSpecimen label="Scrolling">
          <ScrollingWaveform
            data={samples}
            speed={18}
            height={42}
            aria-label="Scrolling waveform"
          />
        </WaveformSpecimen>
        <WaveformSpecimen label="Audio scrubber">
          <AudioScrubber
            data={samples}
            currentTime={position}
            duration={90}
            height={42}
            onSeek={setPosition}
          />
        </WaveformSpecimen>
        <WaveformSpecimen label="Microphone · disconnected">
          <MicrophoneWaveform
            active={false}
            height={42}
            aria-label="Microphone waveform"
          />
        </WaveformSpecimen>
        <WaveformSpecimen label="Live microphone · disconnected">
          <LiveMicrophoneWaveform
            active={false}
            height={42}
            aria-label="Live microphone waveform"
          />
        </WaveformSpecimen>
        <WaveformSpecimen label="Recording · stopped">
          <RecordingWaveform
            recording={false}
            height={42}
            aria-label="Recording waveform"
          />
        </WaveformSpecimen>
      </div>
    </PreviewFrame>
  )
}

function WaveformSpecimen({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0 rounded-lg border p-3">
      <p className="text-muted-foreground mb-2 text-xs font-medium">{label}</p>
      {children}
    </div>
  )
}

export function ElevenLabsVoicePreview({
  name,
}: {
  name: ElevenLabsVoicePreviewName
}) {
  switch (name) {
    case "audio-player":
      return <AudioPlayerPreview />
    case "bar-visualizer":
      return (
        <PreviewFrame>
          <BarVisualizer
            state="speaking"
            barCount={18}
            demo
            className="h-16 w-full max-w-md"
          />
        </PreviewFrame>
      )
    case "conversation-bar":
      return (
        <LiveSessionRequired feature="Conversation bar">
          <ConversationProvider>
            <ConversationBar agentId="" disabled />
          </ConversationProvider>
        </LiveSessionRequired>
      )
    case "conversation":
      return <ConversationPreview />
    case "live-waveform":
      return (
        <PreviewFrame>
          <LiveWaveform
            active={false}
            processing
            height={54}
            className="w-full max-w-lg"
          />
        </PreviewFrame>
      )
    case "matrix":
      return (
        <PreviewFrame>
          <Matrix
            rows={7}
            cols={7}
            frames={loader}
            fps={12}
            size={7}
            gap={2}
            ariaLabel="Voice activity"
          />
        </PreviewFrame>
      )
    case "message":
      return (
        <PreviewFrame>
          <Message from="assistant" className="max-w-lg">
            <MessageContent variant="contained">
              I found three moments that need a human follow-up.
            </MessageContent>
          </Message>
        </PreviewFrame>
      )
    case "mic-selector":
      return (
        <LiveSessionRequired feature="Microphone selector">
          <MicSelector disabled className="mx-auto" />
        </LiveSessionRequired>
      )
    case "orb":
      return <OrbPreview />
    case "response":
      return (
        <PreviewFrame>
          <Response className="w-full max-w-lg">
            {
              "### Call brief\nThe customer approved the rollout and asked for a Friday update."
            }
          </Response>
        </PreviewFrame>
      )
    case "scrub-bar":
      return <ScrubBarPreview />
    case "shimmering-text":
      return (
        <PreviewFrame>
          <ShimmeringText text="Preparing the voice response" repeat={false} />
        </PreviewFrame>
      )
    case "speech-input":
      return (
        <LiveSessionRequired feature="Speech input">
          <div className="flex justify-center">
            <SpeechInput
              getToken={async () => {
                throw new Error("Live credentials required")
              }}
            >
              <SpeechInputRecordButton disabled />
              <SpeechInputPreview />
            </SpeechInput>
          </div>
        </LiveSessionRequired>
      )
    case "transcript-viewer":
      return <TranscriptPreview />
    case "voice-button":
      return <VoiceButtonPreview />
    case "voice-picker":
      return <VoicePickerPreview />
    case "waveform":
      return <WaveformPreview />
    default:
      return (
        <PreviewFrame>
          <ConversationEmptyState
            icon={<AudioLines className="size-5" />}
            title="Voice component"
          />
        </PreviewFrame>
      )
  }
}
