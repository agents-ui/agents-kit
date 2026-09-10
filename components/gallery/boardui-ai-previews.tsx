"use client"

import { AgentChat } from "@/components/boardui/application/agent-chat/agent-chat"
import {
  AgentThinking,
  type AgentThinkingVariant,
} from "@/components/boardui/application/agent-thinking/agent-thinking"
import { ComposerLoader } from "@/components/boardui/application/composer-loader/composer-loader"

export function BoardUiAgentThinkingPreview({
  variant = "wave",
}: {
  variant?: AgentThinkingVariant
}) {
  const labels: Record<AgentThinkingVariant, string> = {
    wave: "Reviewing workspace context",
    spin: "Comparing evidence",
    stars: "Drafting the response",
    infinity: "Running the workflow",
  }
  return (
    <div className="bg-background-secondary-default flex min-h-64 w-full items-center justify-center rounded-xl p-6">
      <AgentThinking variant={variant} label={labels[variant]} />
    </div>
  )
}

export function BoardUiComposerLoaderPreview() {
  return (
    <div className="bg-background-secondary-default flex min-h-64 w-full items-center justify-center rounded-xl p-6">
      <ComposerLoader className="w-full max-w-xl">
        <div className="text-body-regular text-text-secondary flex h-[52px] items-center rounded-full bg-transparent px-5">
          Preparing your response…
        </div>
      </ComposerLoader>
    </div>
  )
}

export function BoardUiAgentChatPreview() {
  return (
    <div className="bg-background-full w-full overflow-x-auto rounded-xl">
      <AgentChat />
    </div>
  )
}
