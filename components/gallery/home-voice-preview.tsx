"use client"

import { LivePreview } from "./catalogue"
import { voiceEntries } from "./voice-catalog"

export function HomeVoicePreview() {
  return <LivePreview entry={voiceEntries[0]} />
}
