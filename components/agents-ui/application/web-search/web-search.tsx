"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { Input } from "@/components/boardui/base/input/input"
import { cx } from "@/components/boardui/utils/cx"
import {
  Calendar,
  Copy,
  ExternalLink,
  Filter,
  Globe,
  RefreshCw,
  Search,
} from "lucide-react"
import { useState } from "react"

export interface SearchResult {
  id: string
  title: string
  url: string
  domain: string
  snippet: string
  aiSummary?: string
  publishedDate?: string
  credibilityScore?: number
  relevanceScore?: number
  imageUrl?: string
}
export interface AgentWebSearchProps {
  query?: string
  results?: SearchResult[]
  isSearching?: boolean
  selectedDomains?: string[]
  dateFilter?: "all" | "day" | "week" | "month" | "year"
  onSearch?: (query: string) => void
  onResultClick?: (result: SearchResult) => void
  onCopyLink?: (url: string) => void
  onDomainFilter?: (domains: string[]) => void
  onDateFilter?: (filter: "all" | "day" | "week" | "month" | "year") => void
  onRefresh?: () => void
  showBottomActions?: boolean
  className?: string
  timestamp?: string
}
const dateOptions = ["all", "day", "week", "month", "year"] as const
export function AgentWebSearch({
  query = "AI agent interfaces",
  results = [],
  isSearching = false,
  selectedDomains = [],
  dateFilter = "all",
  onSearch,
  onResultClick,
  onCopyLink,
  onDomainFilter,
  onDateFilter,
  onRefresh,
  showBottomActions = true,
  className,
  timestamp = "2:34 PM",
}: AgentWebSearchProps) {
  const [localQuery, setLocalQuery] = useState(query)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const domains = Array.from(new Set(results.map((result) => result.domain)))
  const toggleDomain = (domain: string) =>
    onDomainFilter?.(
      selectedDomains.includes(domain)
        ? selectedDomains.filter((item) => item !== domain)
        : [...selectedDomains, domain]
    )
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-2xl border",
        className
      )}
    >
      <header className="border-separator-border border-b p-3">
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            onSearch?.(localQuery)
          }}
        >
          <Input
            aria-label="Search query"
            value={localQuery}
            onChange={setLocalQuery}
            placeholder="Search the web"
            isDisabled={isSearching}
            leadingIcon={Search}
          />
          <Button
            type="submit"
            size="medium"
            disabled={isSearching || !localQuery.trim()}
            leadingIcon={isSearching ? RefreshCw : undefined}
          >
            {isSearching ? "Searching" : "Search"}
          </Button>
          <Button
            size="medium"
            variant="secondary"
            iconOnly
            leadingIcon={Filter}
            aria-label="Search filters"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          />
        </form>
        {filtersOpen && (
          <div className="bg-background-secondary-default mt-3 grid gap-3 rounded-lg p-3 sm:grid-cols-2">
            <fieldset>
              <legend className="text-caption-1-medium text-text-secondary mb-2">
                Date
              </legend>
              <div className="flex flex-wrap gap-1">
                {dateOptions.map((date) => (
                  <Button
                    key={date}
                    size="small"
                    variant={dateFilter === date ? "primary" : "ghost"}
                    onClick={() => onDateFilter?.(date)}
                  >
                    {date === "all" ? "Any time" : `Past ${date}`}
                  </Button>
                ))}
              </div>
            </fieldset>
            {domains.length > 0 && (
              <fieldset>
                <legend className="text-caption-1-medium text-text-secondary mb-2">
                  Domains
                </legend>
                <div className="flex flex-wrap gap-1">
                  {domains.map((domain) => (
                    <Button
                      key={domain}
                      size="small"
                      variant={
                        selectedDomains.includes(domain) ? "primary" : "ghost"
                      }
                      onClick={() => toggleDomain(domain)}
                    >
                      {domain}
                    </Button>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        )}
      </header>
      <div className="divide-separator-border divide-y">
        {isSearching ? (
          <div className="text-body-2-regular text-text-secondary flex min-h-48 items-center justify-center gap-2">
            <RefreshCw className="size-4 animate-spin" />
            Searching the web
          </div>
        ) : (
          results.map((result, index) => (
            <article
              key={result.id}
              className="hover:bg-background-secondary-hover px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <span className="text-caption-1-regular text-text-tertiary pt-0.5 tabular-nums">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onResultClick?.(result)}
                  className="min-w-0 flex-1 text-left"
                >
                  <h3 className="text-body-medium">{result.title}</h3>
                  <p className="text-caption-1-regular text-text-secondary mt-0.5 flex flex-wrap gap-x-2">
                    <span className="inline-flex items-center gap-1">
                      <Globe className="size-3.5" />
                      {result.domain}
                    </span>
                    {result.publishedDate && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {new Date(result.publishedDate).toLocaleDateString()}
                      </span>
                    )}
                    {result.credibilityScore !== undefined && (
                      <span>
                        {Math.round(result.credibilityScore * 100)}% credibility
                      </span>
                    )}
                    {result.relevanceScore !== undefined && (
                      <span>
                        {Math.round(result.relevanceScore * 100)}% relevance
                      </span>
                    )}
                  </p>
                  <p className="text-body-2-regular text-text-secondary mt-2 leading-5">
                    {result.snippet}
                  </p>
                  {result.aiSummary && (
                    <p className="border-separator-border text-body-2-regular mt-2 border-l pl-3 leading-5">
                      {result.aiSummary}
                    </p>
                  )}
                </button>
                <div className="flex gap-1">
                  <Button
                    size="small"
                    variant="ghost"
                    iconOnly
                    leadingIcon={ExternalLink}
                    aria-label={`Open ${result.title}`}
                    onClick={() =>
                      window.open(result.url, "_blank", "noopener,noreferrer")
                    }
                  />
                  {onCopyLink && (
                    <Button
                      size="small"
                      variant="ghost"
                      iconOnly
                      leadingIcon={Copy}
                      aria-label={`Copy ${result.title} link`}
                      onClick={() => onCopyLink(result.url)}
                    />
                  )}
                </div>
              </div>
            </article>
          ))
        )}
        {!isSearching && results.length === 0 && (
          <div className="grid min-h-48 place-items-center p-8 text-center">
            <div>
              <p className="text-body-medium">No search results</p>
              <p className="text-body-2-regular text-text-secondary mt-1">
                Run a search to view sources.
              </p>
            </div>
          </div>
        )}
      </div>
      {showBottomActions && (
        <footer className="border-separator-border flex items-center justify-between gap-3 border-t px-4 py-2.5">
          <p className="text-caption-1-regular text-text-secondary">
            {results.length} results | Updated {timestamp}
          </p>
          {onRefresh && (
            <Button
              size="small"
              variant="ghost"
              leadingIcon={RefreshCw}
              onClick={onRefresh}
            >
              Refresh
            </Button>
          )}
        </footer>
      )}
    </section>
  )
}
