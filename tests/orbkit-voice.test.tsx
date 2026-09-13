import assert from "node:assert/strict"
import test from "node:test"
import * as ReactRuntime from "react"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { orbkitVoiceEntries } from "../components/gallery/orbkit-voice-catalog"
import {
  defaultValuesFor,
  hexToRgb,
} from "../components/voice-agents/orbkit/core"
import { Shdr11, shdr11Orb } from "../components/voice-agents/orbkit/shdr-11"
import { Shdr13 } from "../components/voice-agents/orbkit/shdr-13"
import { Shdr14 } from "../components/voice-agents/orbkit/shdr-14"
import { Shdr21 } from "../components/voice-agents/orbkit/shdr-21"
import source from "../components/voice-agents/orbkit/SOURCE.json"

Object.assign(globalThis, { React: ReactRuntime })

test("OrbKit catalogue exposes only the four approved MIT variants", () => {
  assert.deepEqual(
    orbkitVoiceEntries.map((entry) => entry.slug),
    ["orbkit-shdr-11", "orbkit-shdr-13", "orbkit-shdr-14", "orbkit-shdr-21"]
  )
  assert.equal(source.components.length, 4)
  assert.ok(source.exclusions.some((entry) => entry.name === "shdr-19"))
  assert.ok(
    orbkitVoiceEntries.every(
      (entry) =>
        entry.category === "Voice Agents" &&
        entry.source === "OrbKit · MIT" &&
        entry.family === "Voice visualizers"
    )
  )
})

test("each approved orb renders a dependency-free canvas shell", () => {
  for (const Orb of [Shdr11, Shdr13, Shdr14, Shdr21]) {
    const markup = renderToStaticMarkup(
      createElement(Orb, {
        size: 160,
        state: "thinking",
        paused: true,
        pauseOffscreen: true,
      })
    )
    assert.match(markup, /<canvas/)
    assert.match(markup, /width:160px/)
    assert.match(markup, /height:160px/)
  }
})

test("shared core retains schema defaults and color parsing", () => {
  const defaults = defaultValuesFor(shdr11Orb)
  assert.equal(defaults.params.radius, 0.9)
  assert.deepEqual(hexToRgb("#ff8000"), [1, 128 / 255, 0])
  assert.deepEqual(hexToRgb("bad"), [187 / 255, 170 / 255, 221 / 255])
})
