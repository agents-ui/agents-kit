"use client"

import * as React from "react"
import { beautifulEntries } from "./beautiful-catalog"
import { beuiEntries } from "./beui-catalog"
import { GenerativeShowcase } from "./generative-previews"
import { runtimeEntries } from "./runtime-catalog"
import { effectEntries } from "./effect-catalog"

export type GalleryCategory =
  | "Beautiful UI"
  | "beUI"
  | "Generative UI"
  | "Blocks.so"
  | "Effects"
export interface GalleryEntry {
  slug: string
  name: string
  category: GalleryCategory
  source: string
  path: string
  description?: string
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
