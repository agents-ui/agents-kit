import assert from "node:assert/strict"
import test from "node:test"
import * as ReactRuntime from "react"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { elevenLabsVoiceEntries } from "../components/gallery/elevenlabs-voice-catalog"
import { acquireMediaStream } from "../components/voice-agents/elevenlabs/media"
import { Orb } from "../components/voice-agents/elevenlabs/orb"
import {
  SpeechInput,
  SpeechInputPreview,
  SpeechInputRecordButton,
} from "../components/voice-agents/elevenlabs/speech-input"
import {
  shouldCaptureVoiceButton,
  VoiceButton,
} from "../components/voice-agents/elevenlabs/voice-button"
import {
  AudioScrubber,
  StaticWaveform,
  Waveform,
} from "../components/voice-agents/elevenlabs/waveform"

Object.assign(globalThis, { React: ReactRuntime })

test("ElevenLabs catalogue exposes all 17 pinned component families", () => {
  assert.deepEqual(
    elevenLabsVoiceEntries.map((entry) => entry.slug),
    [
      "elevenlabs-audio-player",
      "elevenlabs-bar-visualizer",
      "elevenlabs-conversation-bar",
      "elevenlabs-conversation",
      "elevenlabs-live-waveform",
      "elevenlabs-matrix",
      "elevenlabs-message",
      "elevenlabs-mic-selector",
      "elevenlabs-orb",
      "elevenlabs-response",
      "elevenlabs-scrub-bar",
      "elevenlabs-shimmering-text",
      "elevenlabs-speech-input",
      "elevenlabs-transcript-viewer",
      "elevenlabs-voice-button",
      "elevenlabs-voice-picker",
      "elevenlabs-waveform",
    ]
  )
  assert.ok(
    elevenLabsVoiceEntries.every(
      (entry) =>
        entry.category === "Voice Agents" &&
        entry.source === "ElevenLabs · MIT" &&
        entry.path.startsWith("components/voice-agents/elevenlabs/")
    )
  )
})

test("controlled voice visuals render without opening media capture", () => {
  const button = renderToStaticMarkup(
    createElement(VoiceButton, {
      state: "recording",
      label: "Listening",
    })
  )
  const waveform = renderToStaticMarkup(
    createElement(Waveform, {
      data: [0.2, 0.7, 0.4],
      "aria-label": "Recorded waveform",
    })
  )
  const staticWaveform = renderToStaticMarkup(
    createElement(StaticWaveform, {
      bars: 12,
      seed: 7,
      "aria-label": "Static waveform",
    })
  )

  assert.match(button, /Listening/)
  assert.match(waveform, /aria-label="Recorded waveform"/)
  assert.match(staticWaveform, /aria-label="Static waveform"/)
  assert.doesNotMatch(button + waveform + staticWaveform, /getUserMedia/)
})

test("audio scrubber keeps one height and exposes a native range control", () => {
  const markup = renderToStaticMarkup(
    createElement(AudioScrubber, {
      data: [0.2, 0.7, 0.4],
      currentTime: 4,
      duration: 10,
      height: 42,
    })
  )

  assert.equal(markup.match(/height:42px/g)?.length, 2)
  assert.match(markup, /type="range"/)
  assert.match(markup, /aria-label="Audio waveform scrubber"/)
  assert.match(markup, /value="4"/)
})

test("disabled recording visuals cannot activate microphone capture", () => {
  assert.equal(shouldCaptureVoiceButton("recording", true), false)
  assert.equal(shouldCaptureVoiceButton("recording", false), true)
  assert.equal(shouldCaptureVoiceButton("idle", false), false)

  const markup = renderToStaticMarkup(
    createElement(VoiceButton, {
      state: "recording",
      disabled: true,
      label: "Listening",
    })
  )
  assert.match(markup, /disabled/)
})

test("late microphone permission is stopped after cancellation", async () => {
  let resolveStream: ((stream: MediaStream) => void) | undefined
  let stopped = 0
  const stream = {
    getTracks: () => [{ stop: () => (stopped += 1) }],
  } as unknown as MediaStream
  const pending = new Promise<MediaStream>((resolve) => {
    resolveStream = resolve
  })
  const originalNavigator = Object.getOwnPropertyDescriptor(
    globalThis,
    "navigator"
  )
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      mediaDevices: {
        getUserMedia: () => pending,
      },
    },
  })

  try {
    let cancelled = false
    const acquisition = acquireMediaStream({ audio: true }, () => cancelled)
    cancelled = true
    resolveStream?.(stream)

    assert.equal(await acquisition, null)
    assert.equal(stopped, 1)
  } finally {
    if (originalNavigator) {
      Object.defineProperty(globalThis, "navigator", originalNavigator)
    } else {
      Reflect.deleteProperty(globalThis, "navigator")
    }
  }
})

test("speech input stays disconnected until its control is activated", () => {
  let tokenRequests = 0
  const speech = renderToStaticMarkup(
    <SpeechInput
      getToken={async () => {
        tokenRequests += 1
        return "unused"
      }}
    >
      <SpeechInputRecordButton />
      <SpeechInputPreview />
    </SpeechInput>
  )

  assert.equal(tokenRequests, 0)
  assert.match(speech, /aria-label="Start recording"/)
  assert.doesNotMatch(speech, /unused/)
})

test("orb provides a stable SSR shell before WebGL initializes", () => {
  const markup = renderToStaticMarkup(
    createElement(Orb, {
      seed: 42,
      agentState: "thinking",
      volumeMode: "manual",
      manualInput: 0.3,
      manualOutput: 0.6,
      className: "size-32",
    })
  )

  assert.match(markup, /data-orb-renderer="webgl"/)
  assert.match(markup, /size-32/)
  assert.doesNotMatch(markup, /canvas/)
})
