"use client"

import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react"

const previews = {
  agent: lazy(() => import("@/components/ai-elements/examples/agent")),
  artifact: lazy(() => import("@/components/ai-elements/examples/artifact")),
  attachments: lazy(
    () => import("@/components/ai-elements/examples/attachments")
  ),
  "attachments-inline": lazy(
    () => import("@/components/ai-elements/examples/attachments-inline")
  ),
  "attachments-list": lazy(
    () => import("@/components/ai-elements/examples/attachments-list")
  ),
  "audio-player": lazy(
    () => import("@/components/ai-elements/examples/audio-player")
  ),
  "audio-player-remote": lazy(
    () => import("@/components/ai-elements/examples/audio-player-remote")
  ),
  "chain-of-thought": lazy(
    () => import("@/components/ai-elements/examples/chain-of-thought")
  ),
  checkpoint: lazy(
    () => import("@/components/ai-elements/examples/checkpoint")
  ),
  "code-block": lazy(
    () => import("@/components/ai-elements/examples/code-block")
  ),
  "code-block-dark": lazy(
    () => import("@/components/ai-elements/examples/code-block-dark")
  ),
  commit: lazy(() => import("@/components/ai-elements/examples/commit")),
  confirmation: lazy(
    () => import("@/components/ai-elements/examples/confirmation")
  ),
  "confirmation-accepted": lazy(
    () => import("@/components/ai-elements/examples/confirmation-accepted")
  ),
  "confirmation-rejected": lazy(
    () => import("@/components/ai-elements/examples/confirmation-rejected")
  ),
  "confirmation-request": lazy(
    () => import("@/components/ai-elements/examples/confirmation-request")
  ),
  context: lazy(() => import("@/components/ai-elements/examples/context")),
  conversation: lazy(
    () => import("@/components/ai-elements/examples/conversation")
  ),
  "environment-variables": lazy(
    () => import("@/components/ai-elements/examples/environment-variables")
  ),
  "file-tree": lazy(
    () => import("@/components/ai-elements/examples/file-tree")
  ),
  "file-tree-basic": lazy(
    () => import("@/components/ai-elements/examples/file-tree-basic")
  ),
  "file-tree-expanded": lazy(
    () => import("@/components/ai-elements/examples/file-tree-expanded")
  ),
  "file-tree-selection": lazy(
    () => import("@/components/ai-elements/examples/file-tree-selection")
  ),
  image: lazy(() => import("@/components/ai-elements/examples/image")),
  "inline-citation": lazy(
    () => import("@/components/ai-elements/examples/inline-citation")
  ),
  "jsx-preview": lazy(
    () => import("@/components/ai-elements/examples/jsx-preview")
  ),
  message: lazy(() => import("@/components/ai-elements/examples/message")),
  "mic-selector": lazy(
    () => import("@/components/ai-elements/examples/mic-selector")
  ),
  "model-selector": lazy(
    () => import("@/components/ai-elements/examples/model-selector")
  ),
  "open-in-chat": lazy(
    () => import("@/components/ai-elements/examples/open-in-chat")
  ),
  "package-info": lazy(
    () => import("@/components/ai-elements/examples/package-info")
  ),
  "persona-command": lazy(
    () => import("@/components/ai-elements/examples/persona-command")
  ),
  "persona-glint": lazy(
    () => import("@/components/ai-elements/examples/persona-glint")
  ),
  "persona-halo": lazy(
    () => import("@/components/ai-elements/examples/persona-halo")
  ),
  "persona-mana": lazy(
    () => import("@/components/ai-elements/examples/persona-mana")
  ),
  "persona-obsidian": lazy(
    () => import("@/components/ai-elements/examples/persona-obsidian")
  ),
  "persona-opal": lazy(
    () => import("@/components/ai-elements/examples/persona-opal")
  ),
  plan: lazy(() => import("@/components/ai-elements/examples/plan")),
  "prompt-input": lazy(
    () => import("@/components/ai-elements/examples/prompt-input")
  ),
  "prompt-input-cursor": lazy(
    () => import("@/components/ai-elements/examples/prompt-input-cursor")
  ),
  "prompt-input-tooltip": lazy(
    () => import("@/components/ai-elements/examples/prompt-input-tooltip")
  ),
  question: lazy(() => import("@/components/ai-elements/examples/question")),
  "question-freeform": lazy(
    () => import("@/components/ai-elements/examples/question-freeform")
  ),
  "question-multi-select": lazy(
    () => import("@/components/ai-elements/examples/question-multi-select")
  ),
  "question-single-select": lazy(
    () => import("@/components/ai-elements/examples/question-single-select")
  ),
  queue: lazy(() => import("@/components/ai-elements/examples/queue")),
  "queue-prompt-input": lazy(
    () => import("@/components/ai-elements/examples/queue-prompt-input")
  ),
  reasoning: lazy(() => import("@/components/ai-elements/examples/reasoning")),
  sandbox: lazy(() => import("@/components/ai-elements/examples/sandbox")),
  "schema-display": lazy(
    () => import("@/components/ai-elements/examples/schema-display")
  ),
  "schema-display-basic": lazy(
    () => import("@/components/ai-elements/examples/schema-display-basic")
  ),
  "schema-display-body": lazy(
    () => import("@/components/ai-elements/examples/schema-display-body")
  ),
  "schema-display-nested": lazy(
    () => import("@/components/ai-elements/examples/schema-display-nested")
  ),
  "schema-display-params": lazy(
    () => import("@/components/ai-elements/examples/schema-display-params")
  ),
  shimmer: lazy(() => import("@/components/ai-elements/examples/shimmer")),
  "shimmer-duration": lazy(
    () => import("@/components/ai-elements/examples/shimmer-duration")
  ),
  "shimmer-elements": lazy(
    () => import("@/components/ai-elements/examples/shimmer-elements")
  ),
  snippet: lazy(() => import("@/components/ai-elements/examples/snippet")),
  "snippet-plain": lazy(
    () => import("@/components/ai-elements/examples/snippet-plain")
  ),
  sources: lazy(() => import("@/components/ai-elements/examples/sources")),
  "sources-custom": lazy(
    () => import("@/components/ai-elements/examples/sources-custom")
  ),
  "speech-input": lazy(
    () => import("@/components/ai-elements/examples/speech-input")
  ),
  "stack-trace": lazy(
    () => import("@/components/ai-elements/examples/stack-trace")
  ),
  "stack-trace-collapsed": lazy(
    () => import("@/components/ai-elements/examples/stack-trace-collapsed")
  ),
  "stack-trace-no-internal": lazy(
    () => import("@/components/ai-elements/examples/stack-trace-no-internal")
  ),
  suggestion: lazy(
    () => import("@/components/ai-elements/examples/suggestion")
  ),
  "suggestion-input": lazy(
    () => import("@/components/ai-elements/examples/suggestion-input")
  ),
  task: lazy(() => import("@/components/ai-elements/examples/task")),
  terminal: lazy(() => import("@/components/ai-elements/examples/terminal")),
  "terminal-basic": lazy(
    () => import("@/components/ai-elements/examples/terminal-basic")
  ),
  "terminal-clear": lazy(
    () => import("@/components/ai-elements/examples/terminal-clear")
  ),
  "terminal-streaming": lazy(
    () => import("@/components/ai-elements/examples/terminal-streaming")
  ),
  "test-results": lazy(
    () => import("@/components/ai-elements/examples/test-results")
  ),
  "test-results-basic": lazy(
    () => import("@/components/ai-elements/examples/test-results-basic")
  ),
  "test-results-errors": lazy(
    () => import("@/components/ai-elements/examples/test-results-errors")
  ),
  "test-results-suites": lazy(
    () => import("@/components/ai-elements/examples/test-results-suites")
  ),
  tool: lazy(() => import("@/components/ai-elements/examples/tool")),
  "tool-input-available": lazy(
    () => import("@/components/ai-elements/examples/tool-input-available")
  ),
  "tool-input-streaming": lazy(
    () => import("@/components/ai-elements/examples/tool-input-streaming")
  ),
  "tool-output-available": lazy(
    () => import("@/components/ai-elements/examples/tool-output-available")
  ),
  "tool-output-error": lazy(
    () => import("@/components/ai-elements/examples/tool-output-error")
  ),
  transcription: lazy(
    () => import("@/components/ai-elements/examples/transcription")
  ),
  "voice-selector": lazy(
    () => import("@/components/ai-elements/examples/voice-selector")
  ),
  "web-preview": lazy(
    () => import("@/components/ai-elements/examples/web-preview")
  ),
  workflow: lazy(() => import("@/components/ai-elements/examples/workflow")),
} satisfies Record<string, LazyExoticComponent<ComponentType>>

export type AIElementsPreviewName = keyof typeof previews

export function AIElementsPreview({
  preview,
}: {
  preview: AIElementsPreviewName
}) {
  const Preview = previews[preview]
  return (
    <div className="ai-elements-preview bg-background text-foreground relative isolate flex w-full items-center justify-center-safe overflow-x-auto p-2 sm:p-3">
      <Suspense
        fallback={
          <p className="text-muted-foreground text-sm">Loading preview</p>
        }
      >
        <Preview />
      </Suspense>
    </div>
  )
}
