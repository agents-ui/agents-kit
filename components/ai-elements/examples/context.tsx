"use client"

import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from "@/components/ai-elements/context"

const Example = () => (
  <div className="flex items-center justify-center p-8">
    <Context
      maxTokens={128_000}
      modelId="openai:gpt-5"
      usage={{
        cachedInputTokens: 0,
        inputTokens: 32_000,
        outputTokens: 8000,
        reasoningTokens: 0,
        totalTokens: 40_000,
        inputTokenDetails: {
          cacheReadTokens: 0,
          cacheWriteTokens: 0,
          noCacheTokens: 32_000,
        },
        outputTokenDetails: { reasoningTokens: 0, textTokens: 8000 },
      }}
      usedTokens={40_000}
    >
      <ContextTrigger />
      <ContextContent>
        <ContextContentHeader />
        <ContextContentBody>
          <ContextInputUsage />
          <ContextOutputUsage />
          <ContextReasoningUsage />
          <ContextCacheUsage />
        </ContextContentBody>
        <ContextContentFooter />
      </ContextContent>
    </Context>
  </div>
)

export default Example
