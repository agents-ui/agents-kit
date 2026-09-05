"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { AlertCircle, Check, Copy, RefreshCw } from "lucide-react"
import { useState } from "react"

export type GrammarIssueType =
  | "grammar"
  | "spelling"
  | "style"
  | "clarity"
  | "punctuation"
export interface GrammarIssue {
  id: string
  type: GrammarIssueType
  message: string
  suggestion: string
  position: { start: number; end: number }
  severity: "error" | "warning" | "info"
}
export interface GrammarStats {
  wordsCount: number
  readabilityScore: number
  issuesFixed: number
  totalIssues: number
}
export interface AgentGrammarCheckerProps {
  text?: string
  originalText?: string
  issues?: GrammarIssue[]
  stats?: GrammarStats
  isAnalyzing?: boolean
  onTextChange?: (text: string) => void
  onAcceptSuggestion?: (issueId: string) => void
  onRejectSuggestion?: (issueId: string) => void
  onCopy?: () => void
  onReanalyze?: () => void
  onRegenerateResponse?: () => void
  className?: string
  timestamp?: string
}
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="text-text-secondary">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  )
}
export function AgentGrammarChecker({
  text = "",
  originalText = "",
  issues = [],
  stats,
  isAnalyzing = false,
  onTextChange,
  onAcceptSuggestion,
  onRejectSuggestion,
  onCopy,
  onReanalyze,
  onRegenerateResponse,
  className,
  timestamp = "Just now",
}: AgentGrammarCheckerProps) {
  const [selected, setSelected] = useState<string | null>(issues[0]?.id ?? null)
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-2xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h3 className="text-headline-semibold">Writing review</h3>
          <p className="text-caption-1-regular text-text-secondary">
            {isAnalyzing
              ? "Analyzing text"
              : `${issues.length} suggestions  |  ${timestamp}`}
          </p>
        </div>
        <Button
          size="small"
          variant="secondary"
          leadingIcon={RefreshCw}
          onClick={onReanalyze}
          disabled={isAnalyzing}
        >
          Analyze again
        </Button>
      </header>
      {stats && (
        <dl className="border-separator-border text-caption-1-regular flex flex-wrap gap-x-5 gap-y-2 border-b px-4 py-2.5">
          <Stat label="Words" value={stats.wordsCount} />
          <Stat label="Readability" value={`${stats.readabilityScore}/100`} />
          <Stat label="Fixed" value={stats.issuesFixed} />
          <Stat label="Remaining" value={stats.totalIssues} />
        </dl>
      )}
      <div className="grid md:grid-cols-[minmax(0,1fr)_300px]">
        <div className="p-4">
          <label className="block">
            <span className="text-caption-1-medium text-text-secondary mb-2 block">
              Edited text
            </span>
            <textarea
              value={text}
              onChange={(event) => onTextChange?.(event.target.value)}
              rows={10}
              className="bg-background-tertiary-default text-body-regular focus:ring-border-button-active w-full resize-y rounded-lg px-3 py-2.5 leading-6 ring-2 ring-transparent outline-none"
              placeholder="Your reviewed text appears here"
            />
          </label>
          {originalText && originalText !== text && (
            <details className="bg-background-secondary-default mt-3 rounded-lg px-3 py-2">
              <summary className="text-caption-1-medium text-text-secondary cursor-pointer">
                Original text
              </summary>
              <p className="text-body-2-regular text-text-secondary mt-2 leading-5 whitespace-pre-wrap">
                {originalText}
              </p>
            </details>
          )}
        </div>
        <aside className="border-separator-border border-t md:border-t-0 md:border-l">
          <header className="border-separator-border flex min-h-10 items-center gap-2 border-b px-3">
            <AlertCircle className="text-text-secondary size-4" />
            <span className="text-caption-1-medium">Suggestions</span>
          </header>
          <div className="max-h-[420px] overflow-y-auto">
            {issues.map((issue) => (
              <article
                key={issue.id}
                className={cx(
                  "border-separator-border border-b p-3",
                  selected === issue.id && "bg-background-secondary-default"
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelected(issue.id)}
                  className="w-full text-left"
                >
                  <div className="flex justify-between gap-2">
                    <span className="text-caption-1-medium capitalize">
                      {issue.type}
                    </span>
                    <span
                      className={cx(
                        "text-caption-1-regular capitalize",
                        issue.severity === "error"
                          ? "text-text-error-placeholder"
                          : "text-text-secondary"
                      )}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-body-2-regular text-text-secondary mt-1 leading-5">
                    {issue.message}
                  </p>
                  <p className="text-body-medium mt-2">{issue.suggestion}</p>
                </button>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="small"
                    leadingIcon={Check}
                    onClick={() => {
                      onAcceptSuggestion?.(issue.id)
                      setSelected(null)
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    variant="ghost"
                    onClick={() => {
                      onRejectSuggestion?.(issue.id)
                      setSelected(null)
                    }}
                  >
                    Ignore
                  </Button>
                </div>
              </article>
            ))}
            {issues.length === 0 && (
              <p className="text-body-2-regular text-text-secondary p-6 text-center">
                No suggestions found.
              </p>
            )}
          </div>
        </aside>
      </div>
      {(onCopy || onRegenerateResponse) && (
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
          {onRegenerateResponse && (
            <Button
              size="small"
              variant="ghost"
              leadingIcon={RefreshCw}
              onClick={onRegenerateResponse}
            >
              Regenerate
            </Button>
          )}
        </footer>
      )}
    </section>
  )
}
