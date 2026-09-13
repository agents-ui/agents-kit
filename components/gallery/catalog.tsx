"use client"

import * as React from "react"
import { aiElementsEntries } from "./ai-elements-catalog"
import { beautifulEntries } from "./beautiful-catalog"
import { beuiEntries } from "./beui-catalog"
import { blocksAiEntries } from "./blocks-ai-catalog"
import { boardUiAiEntries } from "./boardui-ai-catalog"
import { effectEntries } from "./effect-catalog"
import { GenerativeShowcase } from "./generative-previews"
import { promptKitEntries } from "./prompt-kit-catalog"
import { runtimeEntries } from "./runtime-catalog"
import { voiceEntries } from "./voice-catalog"

export type GalleryCategory =
  | "Beautiful UI"
  | "beUI"
  | "Generative UI"
  | "Blocks.so"
  | "Effects"
  | "AI Elements"
  | "Prompt Kit"
  | "BoardUI"
  | "Voice Agents"
export interface GalleryEntry {
  slug: string
  name: string
  category: GalleryCategory
  source: string
  path: string
  description?: string
  family?: string
  variant?: string
  component: React.ComponentType<Record<string, unknown>>
  props?: Record<string, unknown>
}
const named = (name: string) =>
  React.lazy(async () => {
    const previews = await import("./blocks-so-previews")
    return {
      default: previews[name as keyof typeof previews] as React.ComponentType<
        Record<string, unknown>
      >,
    }
  })
export const galleryEntries: GalleryEntry[] = [
  ...beautifulEntries,
  ...beuiEntries,
  ...runtimeEntries,
  ...effectEntries,
  ...blocksAiEntries,
  ...aiElementsEntries,
  ...promptKitEntries,
  ...boardUiAiEntries,
  ...voiceEntries,
  {
    slug: "agent-generative-surface",
    name: "Generated results",
    category: "Generative UI",
    source: "Agents Kit",
    path: "components/agents-ui/agent-generative-surface.tsx",
    component: GenerativeShowcase,
  },
  ...[
    ["workspace-composer", "Workspace composer", "WorkspaceComposerPreview"],
    ["file-queue", "File queue", "FileQueuePreview"],
    ["setup-checklist", "Setup checklist", "SetupChecklistPreview"],
    ["task-table", "Task table", "TaskTablePreview"],
  ].map(([slug, name, preview]) => ({
    slug: `blocks-so-${slug}`,
    name,
    category: "Blocks.so" as const,
    source: "Blocks.so",
    path: `components/blocks-so/${slug}.tsx`,
    component: named(preview),
  })),
]
