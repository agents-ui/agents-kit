import { lazy } from "react"
import type { GalleryEntry } from "./catalog"
import { elevenlabsVoiceEntries } from "./elevenlabs-voice-catalog"
import { livekitVoiceEntries } from "./livekit-voice-catalog"
import { orbkitVoiceEntries } from "./orbkit-voice-catalog"

export const voiceEntries: GalleryEntry[] = [
  {
    slug: "voice-agent-session",
    name: "Voice Session",
    family: "Voice session",
    variant: "Combined session",
    category: "Voice Agents",
    source: "Agents Kit · LiveKit + ElevenLabs",
    path: "components/voice-agents/session.tsx",
    component: lazy(async () => ({
      default: (await import("./voice-session-preview")).VoiceSessionPreview,
    })),
  },
  ...livekitVoiceEntries,
  ...elevenlabsVoiceEntries,
  ...orbkitVoiceEntries,
]
