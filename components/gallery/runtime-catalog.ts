import * as React from "react"

import type { GalleryEntry } from "@/components/gallery/catalog"

const named = (name: string) => React.lazy(async () => {
  const mod = await import("@/components/gallery/runtime-previews")
  return { default: mod[name as keyof typeof mod] as React.ComponentType<Record<string, unknown>> }
})

export const runtimeEntries: GalleryEntry[] = [
  { slug: "agent-thinking-indicator", name: "Thinking Indicator", category: "Generative UI" as GalleryEntry["category"], source: "thinking-orbs (MIT), adapted", path: "components/agents-ui/agent-thinking-indicator.tsx", component: named("ThinkingIndicatorPreview") },
  { slug: "agent-context-meter", name: "Context Meter", category: "Generative UI" as GalleryEntry["category"], source: "Vercel AI Elements (Apache-2.0), adapted", path: "components/agents-ui/agent-context-meter.tsx", component: named("ContextMeterPreview") },
  { slug: "agent-checkpoint", name: "Checkpoint", category: "Generative UI" as GalleryEntry["category"], source: "Vercel AI Elements (Apache-2.0), adapted", path: "components/agents-ui/agent-checkpoint.tsx", component: named("CheckpointPreview") },
]
