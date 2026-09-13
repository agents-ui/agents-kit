import { PublicHeader } from "@/components/gallery/public-header"
import { readGallerySources } from "@/components/gallery/source"
import { VoiceCatalogue } from "@/components/gallery/voice-catalogue"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Voice agents | Agents Kit",
  description:
    "LiveKit, ElevenLabs, and OrbKit voice components: visualizers, session controls, playback, and transcripts in one shared design system.",
}

export default async function VoicePage() {
  const allSources: Record<string, string> = await readGallerySources()
  const sources = Object.fromEntries(
    Object.entries(allSources).filter(([path]) =>
      path.startsWith("components/voice-agents/")
    )
  )
  return (
    <>
      <PublicHeader />
      <VoiceCatalogue sources={sources} />
    </>
  )
}
