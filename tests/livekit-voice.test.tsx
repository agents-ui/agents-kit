import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"
import * as ReactRuntime from "react"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { livekitVoiceEntries } from "../components/gallery/livekit-voice-catalog"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "../components/voice-agents/livekit/_ui/message-scroller"
import {
  AgentAudioVisualizerBar,
  normalizeVolumeBands,
} from "../components/voice-agents/livekit/agent-audio-visualizer-bar"
import { AgentTrackToggle } from "../components/voice-agents/livekit/agent-track-toggle"

Object.assign(globalThis, { React: ReactRuntime })

test("LiveKit catalogue exposes every distributable upstream registry entry", () => {
  assert.deepEqual(
    livekitVoiceEntries.map((entry) => entry.slug),
    [
      "livekit-agent-disconnect-button",
      "livekit-agent-track-toggle",
      "livekit-agent-track-control",
      "livekit-agent-control-bar",
      "livekit-agent-audio-visualizer-bar",
      "livekit-agent-audio-visualizer-radial",
      "livekit-agent-audio-visualizer-grid",
      "livekit-agent-session-provider",
      "livekit-start-audio-button",
      "livekit-agent-chat-indicator",
      "livekit-agent-chat-transcript",
      "livekit-react-shader-toy",
      "livekit-agent-audio-visualizer-wave",
      "livekit-agent-session-view-01",
      "livekit-agent-popup-01",
    ]
  )
  assert.ok(livekitVoiceEntries.every((entry) => entry.path.endsWith(".tsx")))
  assert.ok(
    livekitVoiceEntries.every((entry) =>
      existsSync(new URL(`../${entry.path}`, import.meta.url))
    )
  )
  assert.ok(livekitVoiceEntries.every((entry) => !entry.slug.endsWith("aura")))

  const source = JSON.parse(
    readFileSync(
      new URL(
        "../components/voice-agents/livekit/SOURCE.json",
        import.meta.url
      ),
      "utf8"
    )
  ) as {
    components: { name: string }[]
    excluded: { name: string; reason: string }[]
  }
  assert.equal(source.components.length, 15)
  assert.equal(source.excluded[0]?.name, "agent-audio-visualizer-aura")
  assert.match(source.excluded[0]?.reason ?? "", /PolyForm Non-Resale 1\.0\.0/)
})

test("bar visualizer honors explicit offline volume bands", () => {
  assert.deepEqual(normalizeVolumeBands([0.2, 0.8], 4), [0.2, 0.8, 0.8, 0.8])
  assert.deepEqual(normalizeVolumeBands([], 3), [0, 0, 0])

  const markup = renderToStaticMarkup(
    createElement(AgentAudioVisualizerBar, {
      "aria-label": "Voice level",
      barCount: 3,
      state: "speaking",
      volumeBands: [0.25, 0.5, 0.75],
    })
  )
  assert.match(markup, /aria-label="Voice level"/)
  assert.match(markup, /height:25%/)
  assert.match(markup, /height:50%/)
  assert.match(markup, /height:75%/)
})

test("track toggle exposes controlled state without opening media capture", () => {
  const markup = renderToStaticMarkup(
    createElement(AgentTrackToggle, {
      source: "microphone",
      pressed: false,
    })
  )
  assert.match(markup, /aria-label="Toggle microphone"/)
  assert.match(markup, /aria-pressed="false"/)
  assert.doesNotMatch(markup, /getUserMedia|MediaStream/)
})

test("message scroller preserves custom controls and spacer content", () => {
  const markup = renderToStaticMarkup(
    createElement(
      MessageScrollerProvider,
      null,
      createElement(
        MessageScroller,
        null,
        createElement(
          MessageScrollerViewport,
          { preserveScrollOnPrepend: true },
          createElement(
            MessageScrollerContent,
            { spacerClassName: "history-spacer" },
            createElement("p", null, "Latest response")
          )
        ),
        createElement(MessageScrollerButton, {
          render: createElement(
            "button",
            { "data-custom-scroll": true },
            "Jump"
          ),
        })
      )
    )
  )

  assert.match(markup, /history-spacer/)
  assert.match(markup, /data-custom-scroll="true"/)
  assert.match(markup, />Jump<\/button>/)
})
