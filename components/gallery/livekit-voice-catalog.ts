import { lazy, type ComponentType } from "react"
import type { GalleryEntry } from "./catalog"
import type { LiveKitVoicePreviewName } from "./livekit-voice-previews"

const preview = lazy(async () => {
  const mod = await import("./livekit-voice-previews")
  return {
    default: mod.LiveKitVoicePreview as ComponentType<Record<string, unknown>>,
  }
})

const entries = [
  [
    "agent-disconnect-button",
    "Disconnect Button",
    "Voice controls",
    "Disconnect",
    "Ends an active agent session.",
  ],
  [
    "agent-track-toggle",
    "Track Toggle",
    "Voice controls",
    "Controlled",
    "Controls microphone, camera, or screen-share state.",
  ],
  [
    "agent-track-control",
    "Track Control",
    "Voice controls",
    "Device",
    "Combines track state with media-device selection.",
  ],
  [
    "agent-control-bar",
    "Control Bar",
    "Voice controls",
    "Complete",
    "Groups agent media, chat, and disconnect controls.",
  ],
  [
    "agent-audio-visualizer-bar",
    "Audio Visualizer",
    "Voice visualizers",
    "Bar",
    "Displays multiband voice activity as linear bars.",
  ],
  [
    "agent-audio-visualizer-radial",
    "Audio Visualizer",
    "Voice visualizers",
    "Radial",
    "Arranges multiband voice activity around a circle.",
  ],
  [
    "agent-audio-visualizer-grid",
    "Audio Visualizer",
    "Voice visualizers",
    "Grid",
    "Maps multiband voice activity into a responsive grid.",
  ],
  [
    "agent-session-provider",
    "Session Provider",
    "Voice foundations",
    "Provider",
    "Provides LiveKit agent session and room audio context.",
  ],
  [
    "start-audio-button",
    "Start Audio Button",
    "Voice controls",
    "Autoplay recovery",
    "Lets a user resume audio blocked by browser autoplay rules.",
  ],
  [
    "agent-chat-indicator",
    "Chat Indicator",
    "Voice transcript",
    "Thinking",
    "Shows that the voice agent is preparing a reply.",
  ],
  [
    "agent-chat-transcript",
    "Chat Transcript",
    "Voice transcript",
    "Conversation",
    "Renders agent and user transcript messages with follow behavior.",
  ],
  [
    "react-shader-toy",
    "React Shader Toy",
    "Voice foundations",
    "Shader",
    "Renders the WebGL shader foundation used by visualizers.",
  ],
  [
    "agent-audio-visualizer-wave",
    "Audio Visualizer",
    "Voice visualizers",
    "Wave",
    "Displays voice activity as an animated shader wave.",
  ],
  [
    "agent-session-view-01",
    "Agent Session View",
    "Voice session",
    "Full view",
    "Composes transcript, media tiles, visualizer, and controls.",
  ],
  [
    "agent-popup-01",
    "Agent Popup",
    "Voice session",
    "Popup",
    "Embeds an expandable voice-agent session on an existing page.",
  ],
] as const satisfies readonly [
  LiveKitVoicePreviewName,
  string,
  string,
  string,
  string,
][]

const pathFor = (name: LiveKitVoicePreviewName) => {
  if (name === "agent-session-view-01") {
    return "components/voice-agents/livekit/blocks/agent-session-view-01/components/agent-session-block.tsx"
  }
  if (name === "agent-popup-01") {
    return "components/voice-agents/livekit/blocks/agent-popup-01/components/agent-popup-block.tsx"
  }
  return `components/voice-agents/livekit/${name}.tsx`
}

export const livekitVoiceEntries: GalleryEntry[] = entries.map(
  ([name, title, family, variant, description]) => ({
    slug: `livekit-${name}`,
    name: title,
    family,
    variant,
    category: "Voice Agents" as GalleryEntry["category"],
    source:
      name === "react-shader-toy" ? "LiveKit · MIT" : "LiveKit · Apache-2.0",
    description,
    path: pathFor(name),
    component: preview,
    props: { preview: name },
  })
)
