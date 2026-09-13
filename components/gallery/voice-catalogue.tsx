"use client"

import { Catalogue } from "./catalogue"
import { voiceEntries } from "./voice-catalog"

export function VoiceCatalogue({
  sources,
}: {
  sources: Record<string, string>
}) {
  return <Catalogue sources={sources} entries={voiceEntries} voice />
}
