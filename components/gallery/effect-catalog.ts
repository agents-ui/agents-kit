import { lazy, type ComponentType } from "react"
import type { GalleryEntry } from "./catalog"

const preview = (
  name:
    | "BorderBeamPreview"
    | "GooeyPreview"
    | "MetalPreview"
    | "MetalV1Preview"
    | "ImageFxPreview"
) =>
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
  {
    slug: "metal-fx",
    name: "Metal",
    family: "Metal",
    variant: "v2",
    category: "Effects",
    source: "Libraries.dev · MIT",
    description: "Liquid metal for buttons, icons, text, and badges.",
    path: "components/effects/metal-fx/upstream/MetalFx.tsx",
    component: preview("MetalPreview"),
  },
  {
    slug: "metal-fx-v1",
    name: "Metal",
    family: "Metal",
    variant: "v1",
    category: "Effects",
    source: "Libraries.dev · MIT",
    description: "The original plasma metal engine retained by Libraries.dev.",
    path: "components/effects/metal-fx-v1.tsx",
    component: preview("MetalV1Preview"),
  },
  {
    slug: "img-fx",
    name: "Image",
    category: "Effects",
    source: "Libraries.dev · MIT",
    description: "A shader-driven image generation and reveal surface.",
    path: "components/effects/img-fx/upstream/ImageGeneration.tsx",
    component: preview("ImageFxPreview"),
  },
]
