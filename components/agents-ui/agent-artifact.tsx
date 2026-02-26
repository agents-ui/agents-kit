"use client"

import * as React from "react"
import {
  ArrowDownToLine,
  Check,
  Code2,
  Copy,
  FileText,
  GitBranch,
  Loader2,
  Pencil,
  RefreshCw,
  Share2,
  Sparkles,
  Table2,
  X,
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

export type ArtifactType = "code" | "table" | "document" | "chart"

export interface ArtifactVersion {
  id: string
  label: string
  timestamp: string
  content: string
}

export interface ArtifactMetadata {
  generationTime?: string
  model?: string
  tokens?: number
  size?: string
}

export interface AgentArtifactProps {
  title?: string
  artifactType?: ArtifactType
  content?: string
  language?: string
  versions?: ArtifactVersion[]
  currentVersion?: string
  isGenerating?: boolean
  metadata?: ArtifactMetadata
  className?: string
  onCopy?: () => void
  onDownload?: () => void
  onEdit?: () => void
  onRegenerate?: () => void
  onShare?: () => void
  onVersionChange?: (versionId: string) => void
}

const typeConfig: Record<
  ArtifactType,
  { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; ext: string }
> = {
  code: { label: "Code", icon: Code2, ext: ".tsx" },
  table: { label: "Table", icon: Table2, ext: ".csv" },
  document: { label: "Document", icon: FileText, ext: ".md" },
  chart: { label: "Chart", icon: Sparkles, ext: ".svg" },
}

const defaultVersions: ArtifactVersion[] = [
  {
    id: "v1",
    label: "v1",
    timestamp: "10:02 AM",
    content:
      "Region,Revenue,Deals,Win Rate,Avg Deal\nNorth America,$1.24M,86,74%,$14.4k\nEurope,$980K,72,68%,$13.6k\nAPAC,$640K,54,71%,$11.8k\nLATAM,$310K,31,62%,$10.0k\nMEA,$185K,18,58%,$10.3k",
  },
  {
    id: "v2",
    label: "v2",
    timestamp: "10:14 AM",
    content:
      "Region,Revenue,Deals,Win Rate,Avg Deal,QoQ Growth\nNorth America,$1.24M,86,74%,$14.4k,+12%\nEurope,$980K,72,68%,$13.6k,+8%\nAPAC,$640K,54,71%,$11.8k,+18%\nLATAM,$310K,31,62%,$10.0k,+5%\nMEA,$185K,18,58%,$10.3k,+22%",
  },
]

const defaultMetadata: ArtifactMetadata = {
  generationTime: "1.4s",
  model: "Claude Opus 4",
  tokens: 1240,
  size: "2.1 KB",
}

function parseCSV(csv: string): { headers: string[]; rows: string[][] } {
  const lines = csv.trim().split("\n")
  const headers = lines[0]?.split(",") ?? []
  const rows = lines.slice(1).map((line) => line.split(","))
  return { headers, rows }
}

/* ------------------------------------------------------------------ */
/*  Syntax-highlighted code renderer (no external deps)               */
/* ------------------------------------------------------------------ */
function highlightLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = []
  let remaining = line
  let key = 0

  const rules: { regex: RegExp; className: string }[] = [
    // comments
    { regex: /^(\/\/.*)/, className: "text-zinc-500 italic" },
    // strings (double and single quoted)
    { regex: /^("[^"]*"|'[^']*'|`[^`]*`)/, className: "text-emerald-400" },
    // numbers
    { regex: /^(\b\d+\.?\d*\b)/, className: "text-amber-300" },
    // keywords
    {
      regex:
        /^(\b(?:import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|extends|implements|new|this|async|await|default|null|undefined|true|false)\b)/,
      className: "text-slate-400 font-medium",
    },
    // types / capitalized words
    { regex: /^(\b[A-Z][a-zA-Z0-9]*\b)/, className: "text-cyan-300" },
    // punctuation
    { regex: /^([{}()\[\];:,.<>=!&|?+\-*/]+)/, className: "text-zinc-400" },
  ]

  while (remaining.length > 0) {
    let matched = false
    for (const rule of rules) {
      const m = remaining.match(rule.regex)
      if (m) {
        tokens.push(
          <span key={key++} className={rule.className}>
            {m[1]}
          </span>
        )
        remaining = remaining.slice(m[1].length)
        matched = true
        break
      }
    }
    if (!matched) {
      // consume one character as plain text
      const nextSpecial = remaining.slice(1).search(/[/"'`\d\b{}()\[\];:,.<>=!&|?+\-*/A-Z]/)
      const end = nextSpecial === -1 ? remaining.length : nextSpecial + 1
      tokens.push(
        <span key={key++} className="text-zinc-200">
          {remaining.slice(0, end)}
        </span>
      )
      remaining = remaining.slice(end)
    }
  }
  return tokens
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export function AgentArtifact({
  title = "Q4 Sales Performance",
  artifactType = "table",
  content,
  language = "typescript",
  versions = defaultVersions,
  currentVersion = "v2",
  isGenerating = false,
  metadata = defaultMetadata,
  className,
  onCopy,
  onDownload,
  onEdit,
  onRegenerate,
  onShare,
  onVersionChange,
}: AgentArtifactProps) {
  const [activeTab, setActiveTab] = React.useState<"preview" | "code" | "raw">("preview")
  const [activeVersion, setActiveVersion] = React.useState(currentVersion)
  const [copied, setCopied] = React.useState(false)
  const [showVersions, setShowVersions] = React.useState(false)

  React.useEffect(() => {
    setActiveVersion(currentVersion)
  }, [currentVersion])

  const resolvedContent = React.useMemo(() => {
    if (content) return content
    const match = versions.find((v) => v.id === activeVersion)
    return match?.content ?? versions[versions.length - 1]?.content ?? ""
  }, [content, versions, activeVersion])

  const config = typeConfig[artifactType]
  const TypeIcon = config.icon

  const handleVersionChange = (id: string) => {
    setActiveVersion(id)
    onVersionChange?.(id)
  }

  const handleCopy = () => {
    onCopy?.()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = React.useMemo(
    () => [
      { id: "preview" as const, label: "Preview" },
      { id: "code" as const, label: "Code" },
      { id: "raw" as const, label: "Raw" },
    ],
    []
  )

  /* ---- Code view ---- */
  const renderCodeView = () => {
    const lines = resolvedContent.split("\n")
    return (
      <div className="bg-zinc-950 font-mono text-[13px] leading-6">
        <ScrollArea className="max-h-[420px]">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="hover:bg-white/[0.03]">
                  <td className="select-none border-r border-zinc-800 px-4 py-0 text-right align-top text-zinc-600 w-[1%] whitespace-nowrap">
                    {i + 1}
                  </td>
                  <td className="px-4 py-0 whitespace-pre">
                    {highlightLine(line)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    )
  }

  /* ---- Table/spreadsheet view ---- */
  const renderTableView = () => {
    if (artifactType === "table") {
      const { headers, rows } = parseCSV(resolvedContent)
      return (
        <ScrollArea className="max-h-[420px]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse font-mono">
              <thead className="sticky top-0 z-10">
                <tr className="bg-zinc-100 dark:bg-zinc-800">
                  <th className="border-b border-r border-zinc-200 dark:border-zinc-700 px-1.5 py-2 text-center text-[10px] font-medium text-zinc-400 dark:text-zinc-500 w-[1%]">
                    #
                  </th>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      className="border-b border-r border-zinc-200 dark:border-zinc-700 px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-200 whitespace-nowrap"
                    >
                      {h.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "transition-colors hover:bg-blue-50/60 dark:hover:bg-blue-900/10",
                      i % 2 === 0
                        ? "bg-white dark:bg-zinc-950"
                        : "bg-zinc-50/80 dark:bg-zinc-900/50"
                    )}
                  >
                    <td className="border-b border-r border-zinc-100 dark:border-zinc-800 px-1.5 py-1.5 text-center text-[10px] text-zinc-400 dark:text-zinc-600">
                      {i + 1}
                    </td>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="border-b border-r border-zinc-100 dark:border-zinc-800 px-4 py-1.5 text-sm text-zinc-800 dark:text-zinc-200 whitespace-nowrap"
                      >
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      )
    }

    if (artifactType === "code") {
      return renderCodeView()
    }

    // document / chart preview
    return (
      <ScrollArea className="max-h-[420px]">
        <div className="bg-white dark:bg-zinc-950 px-8 py-6">
          <div className="mx-auto max-w-2xl space-y-1">
            {resolvedContent.split("\n").map((line, i) => {
              if (line.startsWith("# "))
                return (
                  <h1 key={i} className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-0 mb-3">
                    {line.slice(2)}
                  </h1>
                )
              if (line.startsWith("## "))
                return (
                  <h2 key={i} className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-6 mb-2">
                    {line.slice(3)}
                  </h2>
                )
              if (line.startsWith("### "))
                return (
                  <h3 key={i} className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-4 mb-1">
                    {line.slice(4)}
                  </h3>
                )
              if (line.startsWith("- "))
                return (
                  <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 ml-5 list-disc leading-relaxed">
                    {line.slice(2)}
                  </li>
                )
              if (line.trim() === "") return <div key={i} className="h-3" />
              return (
                <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {line}
                </p>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    )
  }

  /* ---- Raw view ---- */
  const renderRawView = () => (
    <div className="bg-zinc-950 font-mono text-[13px] leading-6">
      <ScrollArea className="max-h-[420px]">
        <pre className="px-5 py-4 whitespace-pre-wrap text-zinc-400">{resolvedContent}</pre>
      </ScrollArea>
    </div>
  )

  /* ---- Version timeline panel ---- */
  const renderVersionTimeline = () => (
    <div
      className={cn(
        "absolute right-0 top-0 bottom-0 z-20 w-64 border-l border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm transition-transform duration-200",
        showVersions ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <GitBranch className="h-3 w-3" />
          Version History
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setShowVersions(false)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="p-4 space-y-0">
        {[...versions].reverse().map((v, i) => {
          const isActive = v.id === activeVersion
          const isLast = i === versions.length - 1
          return (
            <div key={v.id} className="flex gap-3 relative">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "h-3 w-3 rounded-full border-2 shrink-0 mt-0.5 transition-colors",
                    isActive
                      ? "bg-blue-500 border-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]"
                      : "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600"
                  )}
                />
                {!isLast && (
                  <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-700 min-h-[28px]" />
                )}
              </div>
              {/* Version details */}
              <button
                onClick={() => handleVersionChange(v.id)}
                className={cn(
                  "flex-1 text-left rounded-md px-2.5 py-1.5 -mt-0.5 mb-2 transition-colors",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      isActive
                        ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800"
                        : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                    )}
                  >
                    {v.label}
                  </Badge>
                  {isActive && (
                    <span className="text-[9px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      current
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {v.timestamp}
                </p>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-lg bg-white dark:bg-zinc-950",
          className
        )}
      >
        {/* ===== Title bar (macOS window chrome) ===== */}
        <div className="flex items-center h-10 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 select-none shrink-0">
          {/* Traffic lights */}
          <div className="flex items-center gap-[7px] mr-4">
            <div className="h-[11px] w-[11px] rounded-full bg-[#FF5F57] border border-[#E0443E]" />
            <div className="h-[11px] w-[11px] rounded-full bg-[#FEBC2E] border border-[#DEA123]" />
            <div className="h-[11px] w-[11px] rounded-full bg-[#28C840] border border-[#1AAB29]" />
          </div>

          {/* Title centered */}
          <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
            <TypeIcon className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 truncate">
              {title}{config.ext}
            </span>
            {isGenerating && (
              <Badge className="bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 text-[10px] py-0 px-1.5 animate-pulse">
                <Loader2 className="mr-1 h-2.5 w-2.5 animate-spin" />
                Generating
              </Badge>
            )}
          </div>

          {/* Version toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 px-2 text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200",
                  showVersions && "bg-zinc-200/80 dark:bg-zinc-700"
                )}
                onClick={() => setShowVersions(!showVersions)}
              >
                <GitBranch className="h-3 w-3 mr-1" />
                {activeVersion}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Version history</TooltipContent>
          </Tooltip>
        </div>

        {/* ===== Tab bar (browser-style file tabs) ===== */}
        <div className="flex items-end h-9 bg-zinc-100 dark:bg-zinc-800 px-2 gap-0 select-none shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative group flex items-center gap-1.5 px-4 h-[30px] text-[12px] font-medium rounded-t-lg transition-colors outline-none",
                  isActive
                    ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 z-10 border-t border-x border-zinc-200 dark:border-zinc-700 -mb-px"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                  </span>
                )}
              </button>
            )
          })}
          {/* Fill the rest of the tab bar */}
          <div className="flex-1 border-b border-zinc-200 dark:border-zinc-700" />
        </div>

        {/* ===== Content area ===== */}
        <div className="relative overflow-hidden">
          {/* Active tab content */}
          <div className="min-h-[200px]">
            {activeTab === "preview" && renderTableView()}
            {activeTab === "code" && renderCodeView()}
            {activeTab === "raw" && renderRawView()}
          </div>

          {/* Version timeline overlay */}
          {renderVersionTimeline()}

          {/* ===== Floating action bar ===== */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30">
            <div className="flex items-center gap-1 rounded-full border border-zinc-200/80 dark:border-zinc-700/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-lg px-2 py-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">{copied ? "Copied!" : "Copy"}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={onDownload}
                  >
                    <ArrowDownToLine className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Download</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={onEdit}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Edit</TooltipContent>
              </Tooltip>

              <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={onShare}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Share</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="h-7 rounded-full px-3 text-[11px] bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={onRegenerate}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Regenerate
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Generate new version</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* ===== Status bar (VS Code style) ===== */}
        <div className="flex items-center h-6 bg-blue-600 dark:bg-blue-700 text-white text-[11px] px-3 select-none shrink-0 overflow-hidden">
          <div className="flex items-center gap-3 mr-auto">
            <span className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {activeVersion}
            </span>
            {isGenerating && (
              <span className="flex items-center gap-1 animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" />
                Generating...
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-blue-100">
            {metadata.model && (
              <span>{metadata.model}</span>
            )}
            {typeof metadata.tokens === "number" && (
              <span>{metadata.tokens.toLocaleString()} tokens</span>
            )}
            {metadata.size && <span>{metadata.size}</span>}
            {metadata.generationTime && (
              <span>{metadata.generationTime}</span>
            )}
            <span className="text-white font-medium">
              {config.label}
            </span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentArtifact.displayName = "AgentArtifact"
