import { lazy, type ComponentType } from "react"
import type { GalleryEntry } from "./catalog"
import type { OrbkitVoicePreviewName } from "./orbkit-voice-previews"

const preview = lazy(async () => {
  const mod = await import("./orbkit-voice-previews")
  return {
    default: mod.OrbkitVoicePreview as ComponentType<Record<string, unknown>>,
  }
})

const variants = [
  ["shdr-11", "Hydrogen", "Quantum orbital with chromatic bands"],
  ["shdr-13", "Ion", "Plasma filaments inside a glass sphere"],
  ["shdr-14", "Dither", "Two-tone ordered-dither plasma"],
  ["shdr-21", "Nimbus", "Volumetric cloud with diffused light"],
] as const satisfies readonly [OrbkitVoicePreviewName, string, string][]

export const orbkitVoiceEntries: GalleryEntry[] = variants.map(
  ([name, title, description]) => ({
    slug: `orbkit-${name}`,
    name: title,
    category: "Voice Agents" as GalleryEntry["category"],
    source: "OrbKit · MIT",
    path: `components/voice-agents/orbkit/${name}.tsx`,
    family: "Voice visualizers",
    description,
    component: preview,
    props: { name },
  })
)
