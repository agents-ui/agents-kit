"use client"

import * as React from "react"
import {
  BookOpen,
  CheckCircle2,
  ClipboardCopy,
  Database,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Globe,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

export type SourceType = "web" | "document" | "database" | "api"

export interface CitationSource {
  id: string
  number: number
  title: string
  url: string
  type: SourceType
  relevance: number
  snippet: string
  verified: boolean
}

export interface AgentSourcesCitationsProps {
  content?: string
  sources?: CitationSource[]
  activeCitationId?: string | null
  className?: string
  onCitationClick?: (sourceId: string) => void
  onSourceClick?: (sourceId: string) => void
  onVerifySource?: (sourceId: string) => void
  onCopyWithCitations?: () => void
  onExportSources?: () => void
}

const sourceTypeConfig: Record<
  SourceType,
  {
    label: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    accentColor: string
    accentBg: string
    accentGradient: string
    pillBg: string
    pillText: string
    iconBg: string
  }
> = {
  web: {
    label: "Web",
    icon: Globe,
    accentColor: "bg-blue-500",
    accentBg: "bg-blue-50 dark:bg-blue-950/40",
    accentGradient: "from-blue-500/20 via-blue-400/10 to-transparent",
    pillBg: "bg-blue-100 dark:bg-blue-900/40",
    pillText: "text-blue-700 dark:text-blue-300",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
  },
  document: {
    label: "Document",
    icon: FileText,
    accentColor: "bg-amber-500",
    accentBg: "bg-amber-50 dark:bg-amber-950/40",
    accentGradient: "from-amber-500/20 via-amber-400/10 to-transparent",
    pillBg: "bg-amber-100 dark:bg-amber-900/40",
    pillText: "text-amber-700 dark:text-amber-300",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
  },
  database: {
    label: "Database",
    icon: Database,
    accentColor: "bg-slate-500",
    accentBg: "bg-slate-50 dark:bg-slate-950/40",
    accentGradient: "from-slate-500/20 via-slate-400/10 to-transparent",
    pillBg: "bg-slate-100 dark:bg-slate-900/40",
    pillText: "text-slate-700 dark:text-slate-300",
    iconBg: "bg-slate-100 dark:bg-slate-800/50",
  },
  api: {
    label: "API",
    icon: Zap,
    accentColor: "bg-emerald-500",
    accentBg: "bg-emerald-50 dark:bg-emerald-950/40",
    accentGradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
    pillBg: "bg-emerald-100 dark:bg-emerald-900/40",
    pillText: "text-emerald-700 dark:text-emerald-300",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
  },
}

const citationColors: Record<number, { bg: string; text: string; ring: string }> = {
  1: {
    bg: "bg-blue-500",
    text: "text-white",
    ring: "ring-blue-400",
  },
  2: {
    bg: "bg-amber-500",
    text: "text-white",
    ring: "ring-amber-400",
  },
  3: {
    bg: "bg-slate-500",
    text: "text-white",
    ring: "ring-slate-400",
  },
  4: {
    bg: "bg-emerald-500",
    text: "text-white",
    ring: "ring-emerald-400",
  },
}

function getCitationColor(num: number) {
  return citationColors[num] ?? { bg: "bg-zinc-500", text: "text-white", ring: "ring-zinc-400" }
}

export function AgentSourcesCitations({
  content,
  sources,
  activeCitationId = null,
  className,
  onCitationClick,
  onSourceClick,
  onVerifySource,
  onCopyWithCitations,
  onExportSources,
}: AgentSourcesCitationsProps) {
  const defaultSources: CitationSource[] = React.useMemo(
    () => [
      {
        id: "src-1",
        number: 1,
        title: "Microservices Best Practices — Martin Fowler",
        url: "https://martinfowler.com/articles/microservices.html",
        type: "web",
        relevance: 0.95,
        snippet:
          "Microservices enable independent deployment and scaling of individual components, reducing coordination overhead across teams.",
        verified: true,
      },
      {
        id: "src-2",
        number: 2,
        title: "Building Distributed Systems — O'Reilly",
        url: "https://oreilly.com/library/distributed-systems",
        type: "document",
        relevance: 0.88,
        snippet:
          "Fault isolation is a key advantage: a failure in one service does not cascade to the entire system when proper circuit-breaker patterns are used.",
        verified: true,
      },
      {
        id: "src-3",
        number: 3,
        title: "Cloud-native Architectures — CNCF Survey 2024",
        url: "https://cncf.io/reports/survey-2024",
        type: "web",
        relevance: 0.82,
        snippet:
          "78% of organizations running microservices reported faster release cycles compared to their previous monolithic deployments.",
        verified: false,
      },
      {
        id: "src-4",
        number: 4,
        title: "Internal Service Mesh Metrics — Platform DB",
        url: "internal://platform-db/mesh-metrics",
        type: "database",
        relevance: 0.76,
        snippet:
          "Average request latency dropped 34% after decomposing the billing monolith into four bounded-context services.",
        verified: true,
      },
    ],
    []
  )

  const defaultContent = React.useMemo(
    () =>
      "Microservices architecture offers several compelling benefits for modern software teams. First, it enables independent deployment, allowing teams to ship features without coordinating monolithic releases [1]. Each service can be scaled, tested, and deployed on its own cadence.\n\nFault isolation is another major advantage. When a single service encounters an error, circuit-breaker patterns prevent cascading failures across the platform [2]. This leads to higher overall system resilience.\n\nOrganizations adopting microservices consistently report faster release cycles. Industry surveys indicate that nearly four out of five teams experience measurably shorter time-to-production after migrating from a monolith [3].\n\nFinally, measurable performance gains are common. Internal benchmarks show significant latency reductions after decomposing tightly coupled modules into well-defined bounded contexts [4].",
    []
  )

  const displayContent = content ?? defaultContent
  const displaySources = sources && sources.length > 0 ? sources : defaultSources
  const [activeId, setActiveId] = React.useState<string | null>(activeCitationId)
  const [activeFilter, setActiveFilter] = React.useState<string>("all")

  React.useEffect(() => {
    setActiveId(activeCitationId)
  }, [activeCitationId])

  const handleCitationClick = (sourceId: string) => {
    setActiveId((prev) => (prev === sourceId ? null : sourceId))
    onCitationClick?.(sourceId)
  }

  const verifiedCount = displaySources.filter((s) => s.verified).length

  const filteredSources = React.useMemo(() => {
    if (activeFilter === "all") return displaySources
    return displaySources.filter((s) => s.type === activeFilter)
  }, [displaySources, activeFilter])

  const sourceTypeCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: displaySources.length }
    for (const s of displaySources) {
      counts[s.type] = (counts[s.type] ?? 0) + 1
    }
    return counts
  }, [displaySources])

  const renderedContent = React.useMemo(() => {
    const parts = displayContent.split(/(\[\d+\])/)
    return parts.map((part, i) => {
      const match = part.match(/^\[(\d+)\]$/)
      if (match) {
        const num = parseInt(match[1], 10)
        const source = displaySources.find((s) => s.number === num)
        if (!source) return <span key={i}>{part}</span>
        const isActive = activeId === source.id
        const colors = getCitationColor(num)
        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleCitationClick(source.id)}
                className={cn(
                  "relative -top-1 mx-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none transition-all duration-200 cursor-pointer",
                  colors.bg,
                  colors.text,
                  isActive
                    ? "ring-2 ring-offset-1 scale-125 shadow-lg " + colors.ring
                    : "opacity-90 hover:opacity-100 hover:scale-110"
                )}
              >
                {num}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="max-w-[260px] text-xs"
            >
              <p className="font-semibold">{source.title}</p>
              <p className="mt-1 text-muted-foreground">{Math.round(source.relevance * 100)}% relevance</p>
            </TooltipContent>
          </Tooltip>
        )
      }
      return <span key={i}>{part}</span>
    })
  }, [displayContent, displaySources, activeId])

  return (
    <TooltipProvider>
      <div className={cn("space-y-5", className)}>
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              Research Assistant
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Sources & Citations</h2>
          </div>

          {/* Citation count badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <div className="text-3xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">
                {verifiedCount}
                <span className="text-lg text-emerald-400 dark:text-emerald-600">/{displaySources.length}</span>
              </div>
              <div className="text-[11px] font-medium leading-tight text-emerald-700 dark:text-emerald-300">
                sources
                <br />
                verified
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={onCopyWithCitations}
          >
            <ClipboardCopy className="h-3.5 w-3.5" />
            Copy with citations
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={onExportSources}
          >
            <Download className="h-3.5 w-3.5" />
            Export sources
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
            onClick={() =>
              displaySources.forEach((s) => !s.verified && onVerifySource?.(s.id))
            }
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Verify all
          </Button>
        </div>

        {/* Main content area */}
        <div className="grid gap-5 lg:grid-cols-[1.4fr,1fr] overflow-hidden">
          {/* Response panel */}
          <div className="relative rounded-2xl border bg-background shadow-sm overflow-hidden">
            {/* Top decorative bar */}
            <div className="h-1 bg-zinc-200 dark:bg-zinc-700" />

            <div className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <BookOpen className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                </div>
                <h3 className="text-sm font-semibold tracking-tight">
                  Response
                </h3>
                <div className="ml-auto flex gap-1">
                  {displaySources.map((s) => {
                    const colors = getCitationColor(s.number)
                    return (
                      <span
                        key={s.id}
                        className={cn(
                          "inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold",
                          colors.bg,
                          colors.text,
                          "opacity-60"
                        )}
                      >
                        {s.number}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className="text-sm leading-[1.8] text-foreground/90 whitespace-pre-line break-words">
                {renderedContent}
              </div>
            </div>
          </div>

          {/* Sources panel - frosted glass */}
          <div className="relative rounded-2xl border shadow-sm overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90">
            {/* Panel header */}
            <div className="border-b px-4 pt-4 pb-0">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
                    <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight">Sources</h3>
                </div>
                <Badge className="rounded-full bg-zinc-100 text-zinc-600 border-0 text-[11px] dark:bg-zinc-800 dark:text-zinc-300">
                  {filteredSources.length} result{filteredSources.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              {/* Source type filter tabs */}
              <Tabs
                value={activeFilter}
                onValueChange={setActiveFilter}
              >
                <TabsList className="h-9 border-b-0 gap-0">
                  <TabsTrigger value="all" className="text-xs px-3 h-9">
                    All
                    <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-zinc-200/80 px-1 text-[10px] font-medium tabular-nums dark:bg-zinc-700">
                      {sourceTypeCounts.all ?? 0}
                    </span>
                  </TabsTrigger>
                  {(["web", "document", "database", "api"] as SourceType[]).map((type) => {
                    const config = sourceTypeConfig[type]
                    const count = sourceTypeCounts[type] ?? 0
                    if (count === 0) return null
                    return (
                      <TabsTrigger
                        key={type}
                        value={type}
                        className="text-xs px-3 h-9 gap-1"
                      >
                        {React.createElement(config.icon, {
                          className: "h-3 w-3",
                        })}
                        {config.label}
                        <span className="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-zinc-200/80 px-1 text-[10px] font-medium tabular-nums dark:bg-zinc-700">
                          {count}
                        </span>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>

                {/* Render the same masonry grid for all tab values */}
                {["all", "web", "document", "database", "api"].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="mt-0">
                    <SourcesGrid
                      sources={filteredSources}
                      activeId={activeId}
                      onCitationClick={handleCitationClick}
                      onSourceClick={onSourceClick}
                      onVerifySource={onVerifySource}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

/* -------------------------------------------------------------------------- */
/*  Masonry-style source grid                                                 */
/* -------------------------------------------------------------------------- */

function SourcesGrid({
  sources,
  activeId,
  onCitationClick,
  onSourceClick,
  onVerifySource,
}: {
  sources: CitationSource[]
  activeId: string | null
  onCitationClick: (id: string) => void
  onSourceClick?: (id: string) => void
  onVerifySource?: (id: string) => void
}) {
  // Split sources into two columns for masonry effect
  const col1 = sources.filter((_, i) => i % 2 === 0)
  const col2 = sources.filter((_, i) => i % 2 === 1)

  return (
    <ScrollArea className="max-h-[480px]">
      <div className="grid grid-cols-2 gap-2.5 p-3">
        <div className="flex flex-col gap-2.5">
          {col1.map((source, i) => (
            <SourceCard
              key={source.id}
              source={source}
              isActive={activeId === source.id}
              stagger={i}
              onCitationClick={onCitationClick}
              onSourceClick={onSourceClick}
              onVerifySource={onVerifySource}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2.5 pt-4">
          {col2.map((source, i) => (
            <SourceCard
              key={source.id}
              source={source}
              isActive={activeId === source.id}
              stagger={i}
              onCitationClick={onCitationClick}
              onSourceClick={onSourceClick}
              onVerifySource={onVerifySource}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

/* -------------------------------------------------------------------------- */
/*  Individual source card                                                    */
/* -------------------------------------------------------------------------- */

function SourceCard({
  source,
  isActive,
  stagger,
  onCitationClick,
  onSourceClick,
  onVerifySource,
}: {
  source: CitationSource
  isActive: boolean
  stagger: number
  onCitationClick: (id: string) => void
  onSourceClick?: (id: string) => void
  onVerifySource?: (id: string) => void
}) {
  const config = sourceTypeConfig[source.type]
  const relevancePct = Math.round(source.relevance * 100)

  // Vary card height based on snippet length + stagger index for masonry look
  const isExpanded = source.snippet.length > 100 || stagger % 2 === 0

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        onCitationClick(source.id)
        onSourceClick?.(source.id)
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onCitationClick(source.id)
          onSourceClick?.(source.id)
        }
      }}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border transition-all duration-300",
        isActive
          ? "ring-2 ring-blue-400 shadow-lg shadow-black/5 border-blue-300 dark:border-blue-600"
          : "border-zinc-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
      )}
    >
      {/* Large colored accent band at top */}
      <div className={cn("h-1.5", config.accentColor)} />

      {/* Verified checkmark overlay */}
      {source.verified && (
        <div className="absolute top-3 right-2 z-10">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-900">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          </div>
        </div>
      )}

      {/* Card body */}
      <div className="relative p-3">
        {/* Background gradient for icon area */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-b opacity-50",
            config.accentGradient
          )}
        />

        <div className="relative">
          {/* Icon + source number row */}
          <div className="mb-2.5 flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                config.iconBg
              )}
            >
              {React.createElement(config.icon, {
                className: cn("h-4 w-4", config.pillText),
              })}
            </div>
            <div className="flex-1 min-w-0">
              <Badge
                className={cn(
                  "rounded-full border-0 text-[10px] font-semibold",
                  config.pillBg,
                  config.pillText
                )}
              >
                {config.label}
              </Badge>
            </div>
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black",
                getCitationColor(source.number).bg,
                getCitationColor(source.number).text
              )}
            >
              {source.number}
            </span>
          </div>

          {/* Title */}
          <p className="text-[13px] font-semibold leading-snug text-foreground line-clamp-2">
            {source.title}
          </p>

          {/* Snippet - vary height for masonry effect */}
          <p
            className={cn(
              "mt-1.5 text-[11px] leading-relaxed text-muted-foreground",
              isExpanded ? "line-clamp-4" : "line-clamp-2"
            )}
          >
            {source.snippet}
          </p>

          {/* URL */}
          <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground/70">
            <ExternalLink className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{source.url}</span>
          </div>

          {/* Verify button for unverified sources */}
          {!source.verified && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onVerifySource?.(source.id)
                  }}
                  className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 cursor-pointer"
                >
                  <ShieldCheck className="h-3 w-3" />
                  Verify source
                </button>
              </TooltipTrigger>
              <TooltipContent>Click to verify this source</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Relevance bar at bottom */}
      <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className={cn("h-full transition-all duration-500", config.accentColor)}
          style={{ width: `${relevancePct}%` }}
        />
      </div>

      {/* Relevance label */}
      <div className="flex items-center justify-between px-3 py-1.5 text-[10px] bg-zinc-50/80 dark:bg-zinc-900/50">
        <span className="text-muted-foreground">Relevance</span>
        <span className="font-bold tabular-nums text-foreground">
          {relevancePct}%
        </span>
      </div>
    </div>
  )
}

AgentSourcesCitations.displayName = "AgentSourcesCitations"
