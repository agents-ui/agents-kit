import { lazy, type ComponentType } from "react"
import type { AIElementsPreviewName } from "./ai-elements-previews"
import type { GalleryEntry } from "./catalog"

const preview = lazy(async () => {
  const mod = await import("./ai-elements-previews")
  return {
    default: mod.AIElementsPreview as ComponentType<Record<string, unknown>>,
  }
})

const documentedPreviews = [
  "agent",
  "artifact",
  "attachments",
  "attachments-inline",
  "attachments-list",
  "audio-player",
  "audio-player-remote",
  "chain-of-thought",
  "checkpoint",
  "code-block",
  "code-block-dark",
  "commit",
  "confirmation",
  "confirmation-accepted",
  "confirmation-rejected",
  "confirmation-request",
  "context",
  "conversation",
  "environment-variables",
  "file-tree",
  "file-tree-basic",
  "file-tree-expanded",
  "file-tree-selection",
  "image",
  "inline-citation",
  "jsx-preview",
  "message",
  "mic-selector",
  "model-selector",
  "open-in-chat",
  "package-info",
  "persona-command",
  "persona-glint",
  "persona-halo",
  "persona-mana",
  "persona-obsidian",
  "persona-opal",
  "plan",
  "prompt-input",
  "prompt-input-cursor",
  "prompt-input-tooltip",
  "question",
  "question-freeform",
  "question-multi-select",
  "question-single-select",
  "queue",
  "queue-prompt-input",
  "reasoning",
  "sandbox",
  "schema-display",
  "schema-display-basic",
  "schema-display-body",
  "schema-display-nested",
  "schema-display-params",
  "shimmer",
  "shimmer-duration",
  "shimmer-elements",
  "snippet",
  "snippet-plain",
  "sources",
  "sources-custom",
  "speech-input",
  "stack-trace",
  "stack-trace-collapsed",
  "stack-trace-no-internal",
  "suggestion",
  "suggestion-input",
  "task",
  "terminal",
  "terminal-basic",
  "terminal-clear",
  "terminal-streaming",
  "test-results",
  "test-results-basic",
  "test-results-errors",
  "test-results-suites",
  "tool",
  "tool-input-available",
  "tool-input-streaming",
  "tool-output-available",
  "tool-output-error",
  "transcription",
  "voice-selector",
  "web-preview",
] as const satisfies readonly AIElementsPreviewName[]

const publicComponents = [
  "agent",
  "artifact",
  "attachments",
  "audio-player",
  "canvas",
  "chain-of-thought",
  "checkpoint",
  "code-block",
  "commit",
  "confirmation",
  "connection",
  "context",
  "controls",
  "conversation",
  "edge",
  "environment-variables",
  "file-tree",
  "image",
  "inline-citation",
  "jsx-preview",
  "message",
  "mic-selector",
  "model-selector",
  "node",
  "open-in-chat",
  "package-info",
  "panel",
  "persona",
  "plan",
  "prompt-input",
  "question",
  "queue",
  "reasoning",
  "sandbox",
  "schema-display",
  "shimmer",
  "snippet",
  "sources",
  "speech-input",
  "stack-trace",
  "suggestion",
  "task",
  "terminal",
  "test-results",
  "tool",
  "toolbar",
  "transcription",
  "voice-selector",
  "web-preview",
] as const

const displayName = (slug: string) =>
  slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())

const sourceComponent = (previewName: string) =>
  [...publicComponents]
    .sort((left, right) => right.length - left.length)
    .find(
      (component) =>
        previewName === component || previewName.startsWith(`${component}-`)
    ) ?? previewName

export const aiElementsEntries: GalleryEntry[] = [
  ...documentedPreviews.map((previewName) => {
    const family = sourceComponent(previewName)
    const variant =
      previewName === family
        ? "Default"
        : displayName(previewName.slice(family.length + 1))
    return {
      slug: `ai-elements-${previewName}`,
      name: displayName(family),
      family: displayName(family),
      variant,
      category: "AI Elements" as const,
      source: "Vercel AI Elements · Apache-2.0 · 6a9d5b1",
      description: `Official ${displayName(family)} ${variant.toLowerCase()} example.`,
      path: `components/ai-elements/${family}.tsx`,
      component: preview,
      props: { preview: previewName },
    }
  }),
  ...(
    [
      "canvas",
      "connection",
      "controls",
      "edge",
      "node",
      "panel",
      "toolbar",
    ] as const
  ).map((component) => ({
    slug: `ai-elements-${component}`,
    name: displayName(component),
    family: displayName(component),
    variant: "Workflow",
    category: "AI Elements" as const,
    source: "Vercel AI Elements · Apache-2.0 · 6a9d5b1",
    description: `Official ${displayName(component)} workflow element.`,
    path: `components/ai-elements/${component}.tsx`,
    component: preview,
    props: { preview: "workflow" },
  })),
]
