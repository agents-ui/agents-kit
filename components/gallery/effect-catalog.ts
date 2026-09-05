import { lazy, type ComponentType } from "react"
import type { GalleryEntry } from "./catalog"

const preview = (name: "BorderBeamPreview" | "GooeyPreview") =>
  lazy(async () => {
    const previews = await import("./effect-previews")
    return { default: previews[name] as ComponentType<Record<string, unknown>> }
  })
export const effectEntries: GalleryEntry[] = [
  {
    slug: "border-beam",
    name: "Border Beam",
    category: "Effects",
    source: "Libraries.dev · MIT",
    description: "An optional border treatment for active work.",
    path: "components/effects/border-beam/upstream/BorderBeam.tsx",
    component: preview("BorderBeamPreview"),
  },
  {
    slug: "liquid-gooey",
    name: "Gooey",
    category: "Effects",
    source: "Libraries.dev · MIT",
    description:
      "Optional liquid transitions for shapes and moving indicators.",
    path: "components/effects/liquid-gooey/upstream/Gooey.tsx",
    component: preview("GooeyPreview"),
  },
]
