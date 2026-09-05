"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { Check, Circle, Download, ExternalLink, FileText } from "lucide-react"
import * as React from "react"

export interface GeneratedComparisonAttribute {
  label: string
  value: string
}

export interface GeneratedComparisonOption {
  id: string
  title: string
  description?: string
  attributes: GeneratedComparisonAttribute[]
  recommended?: boolean
}

export interface GeneratedRecommendationAlternative {
  id: string
  label: string
}

export interface GeneratedChecklistItem {
  id: string
  label: string
  detail?: string
  completed: boolean
}

export interface GeneratedBriefSource {
  id: string
  title: string
  origin?: string
  url?: string
}

export type GeneratedWorkContent =
  | {
      type: "comparison"
      title: string
      description?: string
      options: GeneratedComparisonOption[]
      selectedId?: string
    }
  | {
      type: "recommendation"
      id: string
      title: string
      summary: string
      reasoning?: string[]
      confidence?: number
      acceptLabel?: string
      alternatives?: GeneratedRecommendationAlternative[]
    }
  | {
      type: "document"
      id: string
      title: string
      format: string
      size: string
      excerpt: string
      updated?: string
    }
  | {
      type: "checklist"
      title: string
      description?: string
      items: GeneratedChecklistItem[]
    }
  | {
      type: "source-brief"
      title: string
      summary: string
      sources: GeneratedBriefSource[]
    }

export interface GeneratedWorkCardContentProps {
  content: GeneratedWorkContent
  onAction?: (action: string, id?: string) => void
}

const secondary = "text-[13px] leading-[1.55] text-text-secondary"

function ComparisonContent({
  content,
  onAction,
}: {
  content: Extract<GeneratedWorkContent, { type: "comparison" }>
  onAction?: GeneratedWorkCardContentProps["onAction"]
}) {
  return (
    <div>
      <header className="mb-5">
        <h3 className="text-[15px] font-semibold tracking-tight">
          {content.title}
        </h3>
        {content.description && (
          <p className={cx("mt-1", secondary)}>{content.description}</p>
        )}
      </header>
      <div className="result-comparison-grid grid gap-3">
        {content.options.map((option) => {
          const selected = option.id === content.selectedId
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onAction?.("select", option.id)}
              className={cx(
                "min-w-0 rounded-xl border p-4 text-left transition-colors",
                selected
                  ? "border-border-focus-ring bg-background-secondary-default"
                  : "border-separator-border hover:bg-background-secondary-hover"
              )}
            >
              <div className="flex flex-col items-start gap-1">
                <div>
                  <h4 className="text-[13px] font-medium">{option.title}</h4>
                  {option.description && (
                    <p className="text-text-secondary mt-1 text-xs leading-5">
                      {option.description}
                    </p>
                  )}
                </div>
                {option.recommended && (
                  <span className="text-text-secondary bg-background-secondary-default rounded-md px-1.5 py-0.5 text-[11px] font-medium">
                    Recommended
                  </span>
                )}
              </div>
              <dl className="divide-separator-border border-separator-border mt-4 divide-y border-y">
                {option.attributes.map((attribute) => (
                  <div
                    key={attribute.label}
                    className="flex justify-between gap-4 py-2 text-xs"
                  >
                    <dt className="text-text-secondary">{attribute.label}</dt>
                    <dd className="text-right font-medium">
                      {attribute.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RecommendationContent({
  content,
  onAction,
}: {
  content: Extract<GeneratedWorkContent, { type: "recommendation" }>
  onAction?: GeneratedWorkCardContentProps["onAction"]
}) {
  const confidence =
    content.confidence === undefined
      ? undefined
      : Math.max(0, Math.min(100, content.confidence))
  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-text-secondary text-xs font-medium">
            Recommendation
          </p>
          <h3 className="mt-1 text-[15px] font-semibold tracking-tight">
            {content.title}
          </h3>
        </div>
        {confidence !== undefined && (
          <span className="text-text-secondary text-xs tabular-nums">
            {confidence}% confidence
          </span>
        )}
      </header>
      <p className="mt-4 text-[13px] leading-[1.55]">{content.summary}</p>
      {content.reasoning?.length ? (
        <div className="border-separator-border mt-5 border-y py-3">
          <p className="text-text-secondary text-xs font-medium">
            Reasoning summary
          </p>
          <ul className="mt-2 space-y-2">
            {content.reasoning.map((reason) => (
              <li key={reason} className="flex gap-2 text-[13px] leading-5">
                <span
                  aria-hidden="true"
                  className="bg-text-secondary mt-2 size-1 shrink-0 rounded-full"
                />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <footer className="mt-5 flex flex-wrap gap-2">
        <Button
          size="small"
          onClick={() => onAction?.("accept", content.id)}
          disabled={!onAction}
        >
          {content.acceptLabel ?? "Accept recommendation"}
        </Button>
        {content.alternatives?.map((alternative) => (
          <Button
            key={alternative.id}
            size="small"
            variant="secondary"
            onClick={() => onAction?.("alternative", alternative.id)}
            disabled={!onAction}
          >
            {alternative.label}
          </Button>
        ))}
      </footer>
    </div>
  )
}

function DocumentContent({
  content,
  onAction,
}: {
  content: Extract<GeneratedWorkContent, { type: "document" }>
  onAction?: GeneratedWorkCardContentProps["onAction"]
}) {
  return (
    <div>
      <header className="flex flex-wrap items-start gap-3">
        <FileText
          aria-hidden="true"
          className="text-text-secondary mt-0.5 size-5 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold tracking-tight break-words">
            {content.title}
          </h3>
          <p className="text-text-secondary mt-1 text-xs leading-5">
            {content.format} | {content.size}
            {content.updated ? `  |  ${content.updated}` : ""}
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-2 pl-7">
          <Button
            size="small"
            variant="ghost"
            leadingIcon={ExternalLink}
            onClick={() => onAction?.("open", content.id)}
            disabled={!onAction}
          >
            Open
          </Button>
          <Button
            size="small"
            variant="secondary"
            leadingIcon={Download}
            onClick={() => onAction?.("download", content.id)}
            disabled={!onAction}
          >
            Download
          </Button>
        </div>
      </header>
      <div className="border-separator-border mt-5 border-t pt-4">
        <p className="text-text-secondary line-clamp-5 text-[13px] leading-[1.55] whitespace-pre-wrap">
          {content.excerpt}
        </p>
      </div>
    </div>
  )
}

function ChecklistContent({
  content,
  onAction,
}: {
  content: Extract<GeneratedWorkContent, { type: "checklist" }>
  onAction?: GeneratedWorkCardContentProps["onAction"]
}) {
  const complete = content.items.filter((item) => item.completed).length
  return (
    <div>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">
            {content.title}
          </h3>
          {content.description && (
            <p className={cx("mt-1", secondary)}>{content.description}</p>
          )}
        </div>
        <span className="text-text-secondary shrink-0 text-xs tabular-nums">
          {complete} of {content.items.length}
        </span>
      </header>
      <div className="divide-separator-border border-separator-border divide-y border-y">
        {content.items.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.completed}
            onClick={() => onAction?.("toggle", item.id)}
            disabled={!onAction}
            className="flex min-h-10 w-full items-start gap-3 py-3 text-left disabled:cursor-default"
          >
            <span
              className={cx(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                item.completed
                  ? "border-button-primary bg-button-primary text-text-white"
                  : "border-border-button-default text-text-tertiary"
              )}
            >
              {item.completed ? (
                <Check className="size-3.5" />
              ) : (
                <Circle className="size-3" />
              )}
            </span>
            <span className="min-w-0">
              <span
                className={cx(
                  "block text-[13px] font-medium",
                  item.completed && "text-text-secondary line-through"
                )}
              >
                {item.label}
              </span>
              {item.detail && (
                <span className="text-text-secondary mt-1 block text-xs leading-5">
                  {item.detail}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function SourceBriefContent({
  content,
  onAction,
}: {
  content: Extract<GeneratedWorkContent, { type: "source-brief" }>
  onAction?: GeneratedWorkCardContentProps["onAction"]
}) {
  return (
    <div>
      <header>
        <p className="text-text-secondary text-xs font-medium">Source brief</p>
        <h3 className="mt-1 text-[15px] font-semibold tracking-tight">
          {content.title}
        </h3>
      </header>
      <p className="mt-4 text-[13px] leading-[1.55]">{content.summary}</p>
      <div className="divide-separator-border border-separator-border mt-5 divide-y border-y">
        {content.sources.map((source, index) => (
          <button
            key={source.id}
            type="button"
            onClick={() => onAction?.("source", source.id)}
            disabled={!onAction}
            className="flex min-h-10 w-full items-center gap-3 py-3 text-left disabled:cursor-default"
          >
            <span className="text-text-tertiary text-xs tabular-nums">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">
                {source.title}
              </span>
              {source.origin && (
                <span className="text-text-secondary mt-0.5 block truncate text-xs">
                  {source.origin}
                </span>
              )}
            </span>
            {source.url && (
              <ExternalLink
                aria-hidden="true"
                className="text-text-tertiary size-4 shrink-0"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export function GeneratedWorkCardContent({
  content,
  onAction,
}: GeneratedWorkCardContentProps) {
  switch (content.type) {
    case "comparison":
      return <ComparisonContent content={content} onAction={onAction} />
    case "recommendation":
      return <RecommendationContent content={content} onAction={onAction} />
    case "document":
      return <DocumentContent content={content} onAction={onAction} />
    case "checklist":
      return <ChecklistContent content={content} onAction={onAction} />
    case "source-brief":
      return <SourceBriefContent content={content} onAction={onAction} />
  }
}
