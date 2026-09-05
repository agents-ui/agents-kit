"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { CodeBlockCode } from "@/components/prompt-kit/code-block"
import { Markdown } from "@/components/prompt-kit/markdown"
import {
  Check,
  ChevronRight,
  Circle,
  Copy,
  Download,
  FileCode,
  FileText,
  Loader2,
  RefreshCw,
  Wrench,
  XCircle,
} from "lucide-react"
import { useState } from "react"

/* Tool payloads are intentionally provider-defined. */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type ToolCall = {
  id: string
  name: string
  input: any
  output?: any
  status: "pending" | "running" | "completed" | "failed"
  duration?: number
}
export type Artifact = {
  id: string
  type: "code" | "file" | "image" | "data"
  name: string
  content: string
  language?: string
  size?: string
}
export interface AgentResponseProps {
  message: string
  thinking?: string
  toolCalls?: ToolCall[]
  artifacts?: Artifact[]
  isStreaming?: boolean
  className?: string
  onRegenerate?: () => void
  onCopy?: () => void
}
const statusIcons = {
  pending: Circle,
  running: Loader2,
  completed: Check,
  failed: XCircle,
}

function ToolRow({ tool }: { tool: ToolCall }) {
  const [open, setOpen] = useState(false)
  const Icon = statusIcons[tool.status]
  return (
    <div className="border-separator-border border-b last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="hover:bg-background-secondary-hover flex min-h-11 w-full items-center gap-2 px-3 text-left"
      >
        <Icon
          className={cx(
            "text-text-secondary size-4",
            tool.status === "running" && "text-accent-600 animate-spin",
            tool.status === "failed" && "text-foreground-icon-error",
            tool.status === "completed" && "text-foreground-icon-positive"
          )}
        />
        <Wrench className="text-text-tertiary size-4" />
        <span className="text-body-medium min-w-0 flex-1 truncate">
          {tool.name}
        </span>
        <span className="text-caption-1-regular text-text-secondary tabular-nums">
          {tool.duration === undefined ? tool.status : `${tool.duration} ms`}
        </span>
        <ChevronRight
          className={cx(
            "text-text-tertiary size-4 transition-transform",
            open && "rotate-90"
          )}
        />
      </button>
      {open && (
        <div className="border-separator-border bg-background-secondary-default space-y-3 border-t p-3">
          <Payload label="Input" value={tool.input} />
          {tool.output !== undefined && (
            <Payload label="Output" value={tool.output} />
          )}
        </div>
      )}
    </div>
  )
}
function Payload({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <p className="text-caption-1-medium text-text-secondary mb-1">{label}</p>
      <pre className="text-caption-1-regular text-text-primary overflow-x-auto whitespace-pre-wrap">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}
function ArtifactView({ artifact }: { artifact: Artifact }) {
  const Icon = artifact.type === "code" ? FileCode : FileText
  return (
    <section className="border-separator-border overflow-hidden rounded-lg border">
      <header className="border-separator-border flex min-h-11 items-center gap-2 border-b px-3">
        <Icon className="text-text-secondary size-4" />
        <span className="text-body-medium min-w-0 flex-1 truncate">
          {artifact.name}
        </span>
        {artifact.size && (
          <span className="text-caption-1-regular text-text-secondary">
            {artifact.size}
          </span>
        )}
        <Button
          size="xs"
          variant="ghost"
          iconOnly
          leadingIcon={Download}
          aria-label={`Download ${artifact.name}`}
        />
      </header>
      <div className="bg-background-secondary-default max-h-96 overflow-auto">
        {artifact.type === "code" ? (
          <CodeBlockCode
            code={artifact.content}
            language={artifact.language || "plaintext"}
            className="rounded-none border-0"
          />
        ) : (
          <pre className="text-body-2-regular p-4 whitespace-pre-wrap">
            {artifact.content}
          </pre>
        )}
      </div>
    </section>
  )
}
export function AgentResponse({
  message,
  thinking,
  toolCalls = [],
  artifacts = [],
  isStreaming = false,
  className,
  onRegenerate,
  onCopy,
}: AgentResponseProps) {
  const [thinkingOpen, setThinkingOpen] = useState(false)
  return (
    <article
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-2xl border",
        className
      )}
    >
      <header className="border-separator-border flex min-h-12 items-center justify-between gap-3 border-b px-4">
        <div>
          <h3 className="text-body-medium">Assistant response</h3>
          <p className="text-caption-1-regular text-text-secondary">
            {isStreaming
              ? "Generating response"
              : `${toolCalls.length} tools  |  ${artifacts.length} artifacts`}
          </p>
        </div>
        {isStreaming && (
          <Loader2 className="text-text-secondary size-4 animate-spin" />
        )}
      </header>
      <div className="space-y-4 p-4">
        {thinking && (
          <div>
            <button
              type="button"
              aria-expanded={thinkingOpen}
              onClick={() => setThinkingOpen((open) => !open)}
              className="text-body-medium text-text-secondary hover:text-text-primary flex min-h-10 items-center gap-2"
            >
              <ChevronRight
                className={cx(
                  "size-4 transition-transform",
                  thinkingOpen && "rotate-90"
                )}
              />
              Reasoning summary
            </button>
            {thinkingOpen && (
              <p className="bg-background-secondary-default text-body-2-regular text-text-secondary rounded-lg p-3 leading-5">
                {thinking}
              </p>
            )}
          </div>
        )}
        {toolCalls.length > 0 && (
          <section>
            <h4 className="text-caption-1-medium text-text-secondary mb-2">
              Tool activity
            </h4>
            <div className="border-separator-border overflow-hidden rounded-lg border">
              {toolCalls.map((tool) => (
                <ToolRow key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}
        <div className="text-body-regular max-w-none leading-6">
          <Markdown>{message}</Markdown>
          {isStreaming && (
            <span className="bg-text-primary ml-1 inline-block h-4 w-px animate-pulse" />
          )}
        </div>
        {artifacts.length > 0 && (
          <section className="space-y-2">
            <h4 className="text-caption-1-medium text-text-secondary">
              Artifacts
            </h4>
            {artifacts.map((artifact) => (
              <ArtifactView key={artifact.id} artifact={artifact} />
            ))}
          </section>
        )}
      </div>
      {!isStreaming && (onCopy || onRegenerate) && (
        <footer className="border-separator-border flex gap-1 border-t px-3 py-2">
          {onCopy && (
            <Button
              size="small"
              variant="ghost"
              leadingIcon={Copy}
              onClick={onCopy}
            >
              Copy
            </Button>
          )}
          {onRegenerate && (
            <Button
              size="small"
              variant="ghost"
              leadingIcon={RefreshCw}
              onClick={onRegenerate}
            >
              Regenerate
            </Button>
          )}
        </footer>
      )}
    </article>
  )
}
