"use client"

import * as React from "react"

import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/prompt-kit/chat-container"
import { CodeBlock, CodeBlockCode } from "@/components/prompt-kit/code-block"
import {
  FileUpload,
  FileUploadContent,
  FileUploadTrigger,
} from "@/components/prompt-kit/file-upload"
import { JSXPreview } from "@/components/prompt-kit/jsx-preview"
import { Loader } from "@/components/prompt-kit/loader"
import { Markdown } from "@/components/prompt-kit/markdown"
import { Message, MessageContent } from "@/components/prompt-kit/message"
import {
  PromptInput,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { PromptSuggestion } from "@/components/prompt-kit/prompt-suggestion"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/prompt-kit/reasoning"
import { ResponseStream } from "@/components/prompt-kit/response-stream"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"

export const ChatContainerPreview = () => (
  <ChatContainerRoot className="h-64">
    <ChatContainerContent>
      <p className="p-4 text-sm">
        A contained conversation with anchored scrolling.
      </p>
    </ChatContainerContent>
  </ChatContainerRoot>
)
export const CodeBlockPreview = () => (
  <CodeBlock>
    <CodeBlockCode
      code={"const result = await agent.run(task)"}
      language="typescript"
    />
  </CodeBlock>
)
export function FileUploadPreview() {
  const [files, setFiles] = React.useState<File[]>([])
  return (
    <FileUpload onFilesAdded={(selected) => setFiles((current) => [...current, ...selected])}>
      <div className="max-w-md space-y-3">
        <FileUploadTrigger asChild>
          <button type="button" className="border-separator-border bg-background-primary-default w-full rounded-lg border border-dashed p-8 text-sm">
            Choose files
          </button>
        </FileUploadTrigger>
        {files.length > 0 ? (
          <ul className="divide-separator-border border-separator-border divide-y border-y text-sm">
            {files.map((file, index) => (
              <li key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center justify-between gap-3 py-2.5">
                <span className="truncate">{file.name}</span>
                <span className="text-text-secondary shrink-0 text-xs">{Math.max(1, Math.round(file.size / 1024))} KB</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary text-xs">No files selected.</p>
        )}
      </div>
      <FileUploadContent />
    </FileUpload>
  )
}
export const JSXPreviewPreview = () => (
  <JSXPreview
    jsx={
      '<section><h3 className="text-base font-semibold">Generated interface</h3><p className="mt-2 text-sm text-text-secondary">Previewed safely with the supplied JSX.</p></section>'
    }
  />
)
export const LoaderPreview = () => <Loader />
export const MarkdownPreview = () => (
  <Markdown className="prose prose-sm dark:prose-invert max-w-none">
    {"## Renewal summary\n\nFour accounts need executive outreach this week."}
  </Markdown>
)
export const MessagePreview = () => (
  <Message>
    <MessageContent>
      Review completed with four cited recommendations.
    </MessageContent>
  </Message>
)
export const PromptInputPreview = () => (
  <PromptInput>
    <PromptInputTextarea placeholder="Ask about this workspace" />
  </PromptInput>
)
export const PromptSuggestionPreview = () => (
  <div className="flex flex-wrap gap-2">
    <PromptSuggestion>Summarize sources</PromptSuggestion>
    <PromptSuggestion>Draft next steps</PromptSuggestion>
  </div>
)
export const ReasoningPreview = () => (
  <Reasoning>
    <ReasoningTrigger>View reasoning</ReasoningTrigger>
    <ReasoningContent>
      Compared renewal value, health, and sponsor coverage.
    </ReasoningContent>
  </Reasoning>
)
export const ResponseStreamPreview = () => (
  <ResponseStream textStream="The analysis is ready for review." speed={100} />
)
export const ScrollButtonPreview = () => (
  <div className="space-y-3">
    <p className="text-text-secondary text-xs">
      Scroll up to reveal the latest-message action.
    </p>
    <ChatContainerRoot className="border-separator-border bg-background-primary-default relative h-40 rounded-lg border">
      <ChatContainerContent className="space-y-3 p-3">
        <p className="bg-background-secondary-default rounded-lg p-3 text-sm">
          Review the renewal workbook and account notes.
        </p>
        <p className="bg-background-secondary-default rounded-lg p-3 text-sm">
          Twelve accounts fall below the renewal confidence threshold.
        </p>
        <p className="bg-background-secondary-default rounded-lg p-3 text-sm">
          Four accounts need executive outreach this week.
        </p>
        <p className="bg-background-secondary-default rounded-lg p-3 text-sm">
          The prioritized action plan is ready for review.
        </p>
      </ChatContainerContent>
      <ScrollButton
        aria-label="Scroll to latest message"
        className="absolute right-3 bottom-3"
      />
    </ChatContainerRoot>
  </div>
)
