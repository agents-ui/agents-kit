"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { Check, Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react"
import * as React from "react"

export interface StreamingSource {
  name: string
  domain: string
  href: string
}
export interface StreamingToken {
  text: string
  citation?: number
}
export interface StreamingTextProps {
  children: string
  tokens?: StreamingToken[]
  visibleTokenCount?: number
  sources?: StreamingSource[]
  isStreaming?: boolean
  followUps?: string[]
  onCopy?: (text: string) => void
  onRetry?: () => void
  onFeedback?: (value: "up" | "down") => void
  onFollowUp?: (value: string) => void
  onComplete?: () => void
  className?: string
}

export function StreamingText({
  children,
  tokens,
  visibleTokenCount,
  sources = [],
  isStreaming = false,
  followUps = [],
  onCopy,
  onRetry,
  onFeedback,
  onFollowUp,
  onComplete,
  className,
}: StreamingTextProps) {
  const [copied, setCopied] = React.useState(false)
  const wasStreaming = React.useRef(isStreaming)
  const visible = tokens
    ? tokens.slice(
        0,
        visibleTokenCount === undefined
          ? tokens.length
          : Math.max(0, visibleTokenCount)
      )
    : undefined
  const renderedText = visible
    ? visible.map((token) => token.text).join("")
    : children
  React.useEffect(() => {
    if (wasStreaming.current && !isStreaming) onComplete?.()
    wasStreaming.current = isStreaming
  }, [isStreaming, onComplete])
  const copy = async () => {
    await navigator.clipboard.writeText(renderedText)
    setCopied(true)
    onCopy?.(renderedText)
    window.setTimeout(() => setCopied(false), 1500)
  }
  return (
    <article
      className={cx(
        "border-separator-border bg-background-primary-default rounded-xl border p-5",
        className
      )}
    >
      <p className="text-text-primary text-[13px] leading-6 whitespace-pre-wrap">
        {visible
          ? visible.map((token, index) => {
              const source = token.citation
                ? sources[token.citation - 1]
                : undefined
              return (
                <span key={index}>
                  {token.text}
                  {token.citation !== undefined &&
                    (source ? (
                      <a
                        href={source.href}
                        className="bg-background-secondary-default text-accent-600 ml-1 inline-flex rounded-sm px-1.5 font-mono text-[11px]"
                      >
                        {source.domain}
                      </a>
                    ) : (
                      <span className="text-text-secondary ml-1 text-xs">
                        [{token.citation}]
                      </span>
                    ))}
                </span>
              )
            })
          : children}
        {isStreaming && (
          <span
            className="bg-text-primary ml-1 inline-block h-3.5 w-0.5 translate-y-0.5 motion-safe:animate-pulse"
            aria-label="Streaming"
          />
        )}
      </p>
      {!isStreaming && sources.length > 0 && (
        <details className="group mt-3">
          <summary className="text-text-secondary cursor-pointer list-none text-xs">
            {sources.length} sources
          </summary>
          <div className="divide-separator-border bg-background-secondary-default mt-2 divide-y rounded-lg px-3">
            {sources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                className="flex items-center justify-between gap-3 py-2 text-xs"
              >
                <span className="text-text-primary">{source.name}</span>
                <span className="text-text-secondary font-mono">
                  {source.domain}
                </span>
              </a>
            ))}
          </div>
        </details>
      )}
      {!isStreaming && (
        <div className="border-separator-border mt-3 flex gap-1 border-t pt-3">
          <Button
            variant="ghost"
            size="xs"
            leadingIcon={copied ? Check : Copy}
            onClick={copy}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
          {onRetry && (
            <Button
              variant="ghost"
              size="xs"
              iconOnly
              leadingIcon={RotateCcw}
              aria-label="Retry response"
              onClick={onRetry}
            />
          )}
          {onFeedback && (
            <>
              <Button
                variant="ghost"
                size="xs"
                iconOnly
                leadingIcon={ThumbsUp}
                aria-label="Helpful"
                onClick={() => onFeedback("up")}
              />
              <Button
                variant="ghost"
                size="xs"
                iconOnly
                leadingIcon={ThumbsDown}
                aria-label="Not helpful"
                onClick={() => onFeedback("down")}
              />
            </>
          )}
        </div>
      )}
      {!isStreaming && followUps.length > 0 && (
        <div className="mt-4">
          <p className="text-text-secondary text-xs font-medium">Follow-ups</p>
          <div className="divide-separator-border mt-1 divide-y">
            {followUps.map((item) => (
              <button
                key={item}
                onClick={() => onFollowUp?.(item)}
                className="text-text-primary hover:bg-background-secondary-default block min-h-9 w-full text-left text-[13px]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
