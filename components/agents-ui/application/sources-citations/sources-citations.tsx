"use client"

import type {
  AgentSourcesCitationsProps,
  CitationSource,
} from "@/components/agents-ui/agent-sources-citations"
import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { Check, Copy, Download, ExternalLink, FileText } from "lucide-react"
import * as React from "react"

const fallbackSources: CitationSource[] = [
  {
    id: "1",
    number: 1,
    title: "Q3 renewal forecast",
    url: "renewals_q3.csv",
    type: "document",
    relevance: 0.96,
    snippet: "Twelve accounts are below the renewal confidence threshold.",
    verified: true,
  },
  {
    id: "2",
    number: 2,
    title: "Account health notes",
    url: "Salesforce",
    type: "database",
    relevance: 0.91,
    snippet: "Four accounts have unresolved adoption or sponsor risks.",
    verified: true,
  },
  {
    id: "3",
    number: 3,
    title: "Executive sponsor coverage",
    url: "CRM report",
    type: "api",
    relevance: 0.84,
    snippet: "Sponsor coverage is missing for two high-value renewals.",
    verified: true,
  },
  {
    id: "4",
    number: 4,
    title: "Renewal playbook",
    url: "Internal handbook",
    type: "document",
    relevance: 0.79,
    snippet: "Escalate combined value and sponsor-risk signals this week.",
    verified: false,
  },
]
const fallbackContent =
  "The review identified 12 at-risk accounts representing $1.84M in renewal value [1]. Four need executive outreach this week because adoption has slowed or sponsor coverage is incomplete [2]. The highest priority is restoring executive ownership for the largest renewals [3]. The action plan follows the internal escalation criteria [4]."

export function SourcesCitations({
  content,
  sources,
  activeCitationId = null,
  onCitationClick,
  onSourceClick,
  onVerifySource,
  onCopyWithCitations,
  onExportSources,
  className,
}: AgentSourcesCitationsProps) {
  const useFallback = content === undefined && sources === undefined
  const displayContent = useFallback ? fallbackContent : (content ?? "")
  const displaySources = useFallback ? fallbackSources : (sources ?? [])
  const [selected, setSelected] = React.useState(activeCitationId)
  React.useEffect(() => setSelected(activeCitationId), [activeCitationId])
  const answer = displayContent.split(/(\[\d+\])/).map((part, index) => {
    const match = /^\[(\d+)\]$/.exec(part)
    const source = match
      ? displaySources.find((item) => item.number === Number(match[1]))
      : undefined
    return source ? (
      <button
        key={index}
        type="button"
        aria-label={`View source ${source.number}: ${source.title}`}
        onClick={() => {
          setSelected(source.id)
          onCitationClick?.(source.id)
        }}
        className={cx(
          "text-accent-600 focus:ring-border-focus-ring mx-0.5 min-h-6 rounded-sm px-1 text-xs underline outline-none focus:ring-2",
          selected === source.id && "bg-background-secondary-default"
        )}
      >
        [{source.number}]
      </button>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  })

  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default w-full max-w-[880px] rounded-xl border p-5",
        className
      )}
    >
      <header className="border-separator-border flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="text-text-primary text-lg font-semibold">Sources</h2>
          <p className="text-text-secondary mt-1 text-xs">
            {displaySources.length} references
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            leadingIcon={Copy}
            onClick={onCopyWithCitations}
          >
            Copy answer
          </Button>
          <Button
            variant="secondary"
            size="small"
            leadingIcon={Download}
            onClick={onExportSources}
          >
            Export
          </Button>
        </div>
      </header>
      <div className="grid gap-6 py-5 md:grid-cols-[3fr_2fr]">
        <article className="text-text-primary text-sm leading-7">
          {displayContent ? (
            answer
          ) : (
            <p className="text-text-secondary">No answer content provided.</p>
          )}
        </article>
        <div>
          {displaySources.length === 0 ? (
            <div className="border-separator-border border-y py-6 text-center">
              <p className="text-text-primary text-sm font-medium">
                No sources provided
              </p>
              <p className="text-text-secondary mt-1 text-xs">
                References will appear here when they are available.
              </p>
            </div>
          ) : (
            <div className="divide-separator-border border-separator-border divide-y border-y md:border-l md:pl-5">
              {displaySources.map((source) => (
                <div
                  key={source.id}
                  className={cx(
                    "py-3",
                    selected === source.id && "bg-background-secondary-default"
                  )}
                >
                  <div className="flex gap-3">
                    <FileText className="text-text-secondary mt-0.5 size-4 shrink-0" />
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => {
                        setSelected(source.id)
                        onSourceClick?.(source.id)
                      }}
                    >
                      <span className="block text-sm font-medium">
                        {source.number}. {source.title}
                      </span>
                      <span className="text-text-secondary block text-xs">
                        {source.url}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Open ${source.title}`}
                      onClick={() => onSourceClick?.(source.id)}
                    >
                      <ExternalLink className="text-text-secondary size-4" />
                    </button>
                  </div>
                  <p className="text-text-secondary mt-2 pl-7 text-xs leading-5">
                    {source.snippet}
                  </p>
                  <div className="text-text-secondary mt-2 flex gap-3 pl-7 text-xs">
                    {source.verified ? (
                      <span className="flex items-center gap-1">
                        <Check className="size-3 text-green-600" />
                        Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="underline"
                        onClick={() => onVerifySource?.(source.id)}
                      >
                        Verify source
                      </button>
                    )}
                    {Number.isFinite(source.relevance) && (
                      <span>
                        {Math.round(source.relevance * 100)}% relevance
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="border-separator-border text-text-secondary border-t pt-3 text-xs">
        {displaySources.length} sources ·{" "}
        {displaySources.filter((source) => source.verified).length} verified
      </p>
    </section>
  )
}
