import { lazy, type ComponentType } from "react"
import type { GalleryEntry } from "./catalog"
import type { ElevenLabsVoicePreviewName } from "./elevenlabs-voice-previews"

const preview = lazy(async () => {
  const mod = await import("./elevenlabs-voice-previews")
  return {
    default: mod.ElevenLabsVoicePreview as ComponentType<
      Record<string, unknown>
    >,
  }
})

const components = [
  ["audio-player", "Audio Player", "Voice playback"],
  ["bar-visualizer", "Bar Visualizer", "Voice visualizers"],
  ["conversation-bar", "Conversation Bar", "Voice controls"],
  ["conversation", "Conversation", "Voice conversation"],
  ["live-waveform", "Live Waveform", "Voice visualizers"],
  ["matrix", "Matrix", "Voice visualizers"],
  ["message", "Message", "Voice conversation"],
  ["mic-selector", "Mic Selector", "Voice controls"],
  ["orb", "Orb", "Voice visualizers"],
  ["response", "Response", "Voice conversation"],
  ["scrub-bar", "Scrub Bar", "Voice playback"],
  ["shimmering-text", "Shimmering Text", "Voice status"],
  ["speech-input", "Speech Input", "Voice controls"],
  ["transcript-viewer", "Transcript Viewer", "Voice transcript"],
  ["voice-button", "Voice Button", "Voice controls"],
  ["voice-picker", "Voice Picker", "Voice selection"],
  ["waveform", "Waveform", "Voice visualizers"],
] as const satisfies readonly [ElevenLabsVoicePreviewName, string, string][]

export const elevenLabsVoiceEntries: GalleryEntry[] = components.map(
  ([name, title, family]) => ({
    slug: `elevenlabs-${name}`,
    name: title,
    category: "Voice Agents" as GalleryEntry["category"],
    source: "ElevenLabs · MIT",
    path: `components/voice-agents/elevenlabs/${name}.tsx`,
    family,
    component: preview,
    props: { name },
  })
)

export const elevenlabsVoiceEntries = elevenLabsVoiceEntries
