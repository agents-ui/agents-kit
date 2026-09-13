import assert from "node:assert/strict"
import test from "node:test"
import { groupEntries } from "../components/gallery/families"
import { voiceEntries } from "../components/gallery/voice-catalog"
import { voiceOrbState } from "../components/voice-agents/state"

test("combined voice session maps host states to the ElevenLabs Orb", () => {
  assert.equal(voiceOrbState("speaking"), "talking")
  assert.equal(voiceOrbState("listening"), "listening")
  assert.equal(voiceOrbState("thinking"), "thinking")
  assert.equal(voiceOrbState("connecting"), "thinking")
  for (const state of ["idle", "disconnected", "failed"] as const)
    assert.equal(voiceOrbState(state), null)
})

test("voice catalog keeps source collections and the combined session discoverable", () => {
  assert.equal(
    voiceEntries.filter((e) => e.slug.startsWith("livekit-")).length,
    15
  )
  assert.equal(
    voiceEntries.filter((e) => e.slug.startsWith("elevenlabs-")).length,
    17
  )
  assert.ok(voiceEntries.some((e) => e.slug === "voice-agent-session"))
  assert.equal(
    voiceEntries.filter((e) => e.slug.startsWith("orbkit-")).length,
    4
  )
  assert.equal(
    new Set(voiceEntries.map((e) => e.slug)).size,
    voiceEntries.length
  )
  assert.ok(voiceEntries.every((e) => e.category === "Voice Agents"))
  const groups = groupEntries(voiceEntries)
  assert.equal(groups[0].name, "Voice session")
  assert.ok(groups.some((group) => group.name === "Voice visualizers"))
})
