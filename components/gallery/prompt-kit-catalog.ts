import { lazy, type ComponentType } from "react"

import type { GalleryEntry } from "./catalog"

const PromptKitPreview = lazy(async () => {
  const previews = await import("./prompt-kit-previews")
  return { default: previews.PromptKitPreview as ComponentType<Record<string, unknown>> }
})

const labels: Record<string, string> = {
  "chain-of-thought": "Chain of Thought",
  "chat-container": "Chat Container",
  "code-block": "Code Block",
  "feedback-bar": "Feedback Bar",
  "file-upload": "File Upload",
  image: "Image",
  "jsx-preview": "JSX Preview",
  loader: "Loader",
  markdown: "Markdown",
  message: "Message",
  "prompt-input": "Prompt Input",
  "prompt-suggestion": "Prompt Suggestion",
  reasoning: "Reasoning",
  "response-stream": "Response Stream",
  "scroll-button": "Scroll Button",
  source: "Source",
  steps: "Steps",
  "system-message": "System Message",
  "text-shimmer": "Text Shimmer",
  "thinking-bar": "Thinking Bar",
  tool: "Tool",
  chatbot: "Chatbot",
  "tool-calling": "Tool Calling",
}

const documentedExamples = [
  ["chain-of-thought", "basic"], ["chain-of-thought", "advanced"],
  ["chat-container", "basic"], ["chat-container", "custom-scroll"],
  ["code-block", "basic"], ["code-block", "css"], ["code-block", "nord"], ["code-block", "python"], ["code-block", "themed"], ["code-block", "with-header"],
  ["feedback-bar", "basic"], ["file-upload", "custom"], ["image", "basic"],
  ["jsx-preview", "basic"], ["jsx-preview", "streaming"],
  ["loader", "basic"], ["loader", "sizes"], ["loader", "with-text"],
  ["markdown", "basic"], ["markdown", "custom-components"],
  ["message", "basic"], ["message", "with-actions"], ["message", "with-markdown"],
  ["prompt-input", "basic"], ["prompt-input", "with-actions"],
  ["prompt-suggestion", "basic"], ["prompt-suggestion", "highlight"], ["prompt-suggestion", "variants"],
  ["reasoning", "basic"], ["reasoning", "markdown"],
  ["response-stream", "fade"], ["response-stream", "typewriter"], ["response-stream", "with-markdown"], ["response-stream", "use-text-stream"],
  ["scroll-button", "basic"], ["scroll-button", "custom"], ["scroll-button", "with-chat"],
  ["source", "basic"], ["source", "custom"],
  ["steps", "basic"], ["steps", "icon-swap"], ["steps", "with-loader"], ["steps", "with-source"],
  ["system-message", "basic"], ["system-message", "variants"], ["system-message", "with-cta"],
  ["text-shimmer", "basic"], ["text-shimmer", "custom-duration"], ["text-shimmer", "custom-spread"],
  ["thinking-bar", "interactive"], ["tool", "basic"], ["tool", "states"],
  ["chatbot", "local-flow"], ["tool-calling", "local-tool-flow"],
] as const

const title = (value: string) =>
  value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())

export const promptKitEntries: GalleryEntry[] = documentedExamples.map(([family, variant]) => ({
  category: "Prompt Kit",
  component: PromptKitPreview,
  description: family === "chatbot" || family === "tool-calling"
    ? "Interactive local composition of the upstream full-stack interface; no backend or API key required."
    : `Official Prompt Kit ${title(variant).toLowerCase()} example state.`,
  family: labels[family],
  name: labels[family],
  path: family === "chatbot" || family === "tool-calling"
    ? "components/gallery/prompt-kit-examples/primitives.tsx"
    : `components/prompt-kit/${family}.tsx`,
  props: { family, variant },
  slug: `prompt-kit-${family}-${variant}`,
  source: "Prompt Kit · MIT",
  variant: title(variant),
}))

export const promptKitDocumentedExamples = documentedExamples
