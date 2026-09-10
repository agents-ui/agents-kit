import { lazy, type ComponentType } from "react"

import type { GalleryEntry } from "./catalog"

const preview = (name: string) =>
  lazy(async () => {
    const previews = await import("./blocks-ai-previews")
    return { default: previews[name as keyof typeof previews] as ComponentType<Record<string, unknown>> }
  })

export const blocksAiEntries: GalleryEntry[] = [
  ["01", "AI Chat with Voice Input", "Expandable voice, tools, attachments, and send states."],
  ["02", "AI Chat with Model Selection", "A model picker, workspace context, attachments, and quick prompts."],
  ["03", "AI Chat Compact Interface", "Compact agent, model, performance, auto-mode, and tool controls."],
  ["04", "AI Chat with File Attachments", "Drag-and-drop previews, attachment actions, and generation settings."],
  ["05", "AI Elements Chat", "A complete scrolling conversation with suggestions and response states."],
].map(([number, name, description]) => ({
  category: "Blocks.so" as const,
  component: preview(`BlocksAi${number}Preview`),
  description,
  name,
  path: `components/blocks-so/ai/ai-${number}.tsx`,
  slug: `blocks-so-ai-${number}`,
  source: "Blocks.so · MIT",
}))
