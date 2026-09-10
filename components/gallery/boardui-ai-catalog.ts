import { lazy, type ComponentType } from "react"
import type { GalleryEntry } from "./catalog"

const preview = (name: string) =>
  lazy(async () => {
    const previews = await import("./boardui-ai-previews")
    return {
      default: previews[name as keyof typeof previews] as ComponentType<
        Record<string, unknown>
      >,
    }
  })

const thinking = ([variant, name, description]: [
  string,
  string,
  string,
]): GalleryEntry => ({
  slug: `boardui-agent-thinking-${variant}`,
  name,
  category: "BoardUI",
  source: "BoardUI · MIT",
  path: "components/boardui/application/agent-thinking/agent-thinking.tsx",
  family: "BoardUI Agent Thinking",
  variant,
  description,
  component: preview("BoardUiAgentThinkingPreview"),
  props: { variant },
})

export const boardUiAiEntries: GalleryEntry[] = [
  [
    "wave",
    "Agent Thinking · Wave",
    "A diagonal wavefront travels across a dot grid.",
  ],
  ["spin", "Agent Thinking · Spin", "A bright head orbits a dot grid."],
  [
    "stars",
    "Agent Thinking · Stars",
    "Five sparkles twinkle with a staggered rhythm.",
  ],
  [
    "infinity",
    "Agent Thinking · Infinity",
    "A comet traces a continuous figure eight.",
  ],
]
  .map((entry) => thinking(entry as [string, string, string]))
  .concat([
    {
      slug: "boardui-composer-loader",
      name: "Composer Loader",
      category: "BoardUI",
      source: "BoardUI · MIT",
      path: "components/boardui/application/composer-loader/composer-loader.tsx",
      description: "An iridescent light band travels around a chat composer.",
      component: preview("BoardUiComposerLoaderPreview"),
    },
    {
      slug: "boardui-agent-chat",
      name: "Agent Chat Starter",
      category: "BoardUI",
      source: "BoardUI · MIT, local demo transport",
      path: "components/boardui/application/agent-chat/agent-chat.tsx",
      description:
        "A complete local streaming chat with history, export and message actions.",
      component: preview("BoardUiAgentChatPreview"),
    },
  ])
