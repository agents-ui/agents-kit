"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Check,
  Download,
  Loader2,
  RefreshCw,
  Search,
  ShieldAlert,
  Telescope,
  X,
  Zap,
} from "lucide-react"

export type ResearchDepth = "quick" | "standard" | "deep"
export type ThreatLevel = "low" | "medium" | "high"

export interface Competitor {
  name: string
  description: string
  category: string
  strengths: string[]
  weaknesses: string[]
  threatLevel: ThreatLevel
  marketPosition: string
}

export interface ComparisonFeature {
  feature: string
  competitorScores: Record<string, boolean>
}

export interface AgentCompetitorResearchProps {
  query?: string
  researchDepth?: ResearchDepth
  competitors?: Competitor[]
  comparisonFeatures?: ComparisonFeature[]
  keyFindings?: string[]
  sourcesCount?: number
  lastUpdated?: string
  isResearching?: boolean
  onExport?: () => void
  onDeepenResearch?: () => void
  onRefresh?: () => void
  onCompareFeature?: (feature: string) => void
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Radar dimension scores per competitor (derived from demo data)     */
/* ------------------------------------------------------------------ */
interface RadarDimension {
  label: string
  key: string
}

const RADAR_DIMS: RadarDimension[] = [
  { label: "Features", key: "features" },
  { label: "Pricing", key: "pricing" },
  { label: "UX", key: "ux" },
  { label: "Market Share", key: "marketShare" },
  { label: "Innovation", key: "innovation" },
]

const COMPETITOR_COLORS = [
  { stroke: "#6366f1", fill: "rgba(99,102,241,0.15)", ring: "ring-indigo-500", bg: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400", label: "indigo" },
  { stroke: "#f59e0b", fill: "rgba(245,158,11,0.13)", ring: "ring-amber-500", bg: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", label: "amber" },
  { stroke: "#10b981", fill: "rgba(16,185,129,0.13)", ring: "ring-emerald-500", bg: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", label: "emerald" },
  { stroke: "#ef4444", fill: "rgba(239,68,68,0.13)", ring: "ring-red-500", bg: "bg-red-500", text: "text-red-600 dark:text-red-400", label: "red" },
  { stroke: "#64748b", fill: "rgba(100,116,139,0.13)", ring: "ring-slate-500", bg: "bg-slate-500", text: "text-slate-600 dark:text-slate-400", label: "slate" },
]

/* default radar scores per competitor name */
const DEFAULT_RADAR_SCORES: Record<string, number[]> = {
  "Asana":       [0.85, 0.55, 0.80, 0.90, 0.65],
  "Monday.com":  [0.80, 0.50, 0.90, 0.75, 0.70],
  "ClickUp":     [0.92, 0.85, 0.60, 0.55, 0.90],
}

/* ------------------------------------------------------------------ */
/*  Utility: polar → cartesian for SVG radar                          */
/* ------------------------------------------------------------------ */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function radarPoints(cx: number, cy: number, maxR: number, values: number[]): string {
  const step = 360 / values.length
  return values
    .map((v, i) => {
      const { x, y } = polarToCartesian(cx, cy, maxR * v, step * i)
      return `${x},${y}`
    })
    .join(" ")
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Inline SVG radar / spider chart */
function RadarChart({
  competitors,
  dimensions,
  scores,
}: {
  competitors: Competitor[]
  dimensions: RadarDimension[]
  scores: Record<string, number[]>
}) {
  const size = 280
  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - 36
  const levels = 4
  const step = 360 / dimensions.length

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
      {/* concentric rings */}
      {Array.from({ length: levels }, (_, i) => {
        const r = (maxR / levels) * (i + 1)
        const pts = dimensions.map((_, di) => {
          const { x, y } = polarToCartesian(cx, cy, r, step * di)
          return `${x},${y}`
        })
        return (
          <polygon
            key={i}
            points={pts.join(" ")}
            fill="none"
            stroke="currentColor"
            className="text-zinc-200 dark:text-zinc-700/60"
            strokeWidth={i === levels - 1 ? 1.2 : 0.6}
          />
        )
      })}

      {/* axis lines */}
      {dimensions.map((_, i) => {
        const { x, y } = polarToCartesian(cx, cy, maxR, step * i)
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="currentColor"
            className="text-zinc-200 dark:text-zinc-700/60"
            strokeWidth={0.6}
          />
        )
      })}

      {/* competitor polygons */}
      {competitors.map((c, ci) => {
        const vals = scores[c.name] ?? dimensions.map(() => 0.5)
        const color = COMPETITOR_COLORS[ci % COMPETITOR_COLORS.length]
        return (
          <polygon
            key={c.name}
            points={radarPoints(cx, cy, maxR, vals)}
            fill={color.fill}
            stroke={color.stroke}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        )
      })}

      {/* dots on vertices */}
      {competitors.map((c, ci) => {
        const vals = scores[c.name] ?? dimensions.map(() => 0.5)
        const color = COMPETITOR_COLORS[ci % COMPETITOR_COLORS.length]
        return vals.map((v, di) => {
          const { x, y } = polarToCartesian(cx, cy, maxR * v, step * di)
          return (
            <circle key={`${c.name}-${di}`} cx={x} cy={y} r={3} fill={color.stroke} />
          )
        })
      })}

      {/* axis labels */}
      {dimensions.map((d, i) => {
        const { x, y } = polarToCartesian(cx, cy, maxR + 22, step * i)
        return (
          <text
            key={d.key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-zinc-500 dark:fill-zinc-400 text-[9px] font-medium"
          >
            {d.label}
          </text>
        )
      })}
    </svg>
  )
}

/** Circular progress ring for research depth */
function DepthRing({ depth }: { depth: ResearchDepth }) {
  const pct = depth === "quick" ? 33 : depth === "standard" ? 66 : 100
  const r = 20
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const colorClass = depth === "quick" ? "stroke-zinc-400" : depth === "standard" ? "stroke-blue-500" : "stroke-indigo-500"

  return (
    <div className="relative flex items-center justify-center" style={{ width: 52, height: 52 }}>
      <svg width={52} height={52} className="-rotate-90">
        <circle cx={26} cy={26} r={r} fill="none" strokeWidth={4} className="stroke-zinc-100 dark:stroke-zinc-800" />
        <circle
          cx={26}
          cy={26}
          r={r}
          fill="none"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className={cn(colorClass, "transition-all duration-700")}
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{pct}%</span>
    </div>
  )
}

/** Threat level gradient meter */
function ThreatMeter({ level }: { level: ThreatLevel }) {
  const position = level === "low" ? 15 : level === "medium" ? 50 : 85

  return (
    <div className="w-full max-w-[180px]">
      <div className="relative h-2.5 rounded-full overflow-hidden">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, #22c55e 0%, #eab308 50%, #ef4444 100%)",
          }}
        />
        {/* marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-white dark:border-zinc-900 shadow-md transition-all duration-500"
          style={{
            left: `${position}%`,
            background:
              level === "low"
                ? "#22c55e"
                : level === "medium"
                  ? "#eab308"
                  : "#ef4444",
          }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-muted-foreground font-medium">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export function AgentCompetitorResearch({
  query: queryProp,
  researchDepth: depthProp,
  competitors: competitorsProp,
  comparisonFeatures: featuresProp,
  keyFindings: findingsProp,
  sourcesCount: sourcesProp,
  lastUpdated: updatedProp,
  isResearching = false,
  onExport,
  onDeepenResearch,
  onRefresh,
  onCompareFeature,
  className,
}: AgentCompetitorResearchProps) {
  /* ---------- demo data via useMemo ---------- */
  const defaultCompetitors: Competitor[] = React.useMemo(
    () => [
      {
        name: "Asana",
        description: "Work management platform focused on team coordination and project tracking.",
        category: "Project Management",
        strengths: ["Intuitive timeline views", "Strong integrations ecosystem", "Enterprise-grade permissions"],
        weaknesses: ["Steep pricing at scale", "Limited native time tracking", "Complex onboarding for large teams"],
        threatLevel: "high",
        marketPosition: "Market leader",
      },
      {
        name: "Monday.com",
        description: "Visual work OS enabling teams to build custom workflows without code.",
        category: "Work Management",
        strengths: ["Highly customizable boards", "No-code automations", "Attractive visual interface"],
        weaknesses: ["Can feel overwhelming for simple use cases", "Expensive per-seat pricing", "Reporting limitations"],
        threatLevel: "medium",
        marketPosition: "Strong challenger",
      },
      {
        name: "ClickUp",
        description: "All-in-one productivity platform combining docs, tasks, and goals.",
        category: "Productivity Suite",
        strengths: ["Feature-rich free tier", "Built-in docs and whiteboards", "Aggressive product velocity"],
        weaknesses: ["Performance issues on large workspaces", "Inconsistent UX across features", "Notification overload"],
        threatLevel: "medium",
        marketPosition: "Fast mover",
      },
    ],
    []
  )

  const defaultFeatures: ComparisonFeature[] = React.useMemo(
    () => [
      { feature: "Custom workflows", competitorScores: { Asana: true, "Monday.com": true, ClickUp: true } },
      { feature: "Native time tracking", competitorScores: { Asana: false, "Monday.com": true, ClickUp: true } },
      { feature: "Built-in docs", competitorScores: { Asana: false, "Monday.com": false, ClickUp: true } },
      { feature: "Gantt charts", competitorScores: { Asana: true, "Monday.com": true, ClickUp: true } },
      { feature: "Free tier available", competitorScores: { Asana: true, "Monday.com": false, ClickUp: true } },
    ],
    []
  )

  const defaultFindings: string[] = React.useMemo(
    () => [
      "Asana dominates enterprise adoption with superior permission controls and SSO integrations.",
      "Monday.com is winning mid-market deals through no-code automation and visual appeal.",
      "ClickUp threatens incumbents with aggressive free-tier strategy and rapid feature shipping.",
      "All three competitors lack native AI-powered task prioritization, representing a key differentiator opportunity.",
    ],
    []
  )

  const query = queryProp ?? "Project management tools"
  const researchDepth = depthProp ?? "standard"
  const competitors = competitorsProp ?? defaultCompetitors
  const comparisonFeatures = featuresProp ?? defaultFeatures
  const keyFindings = findingsProp ?? defaultFindings
  const sourcesCount = sourcesProp ?? 42
  const lastUpdated = updatedProp ?? "Updated 5 min ago"

  const competitorNames = competitors.map((c) => c.name)

  /* ---------- SWOT opportunities / threats per competitor ---------- */
  const swotData = React.useMemo(() => {
    const map: Record<string, { opportunities: string[]; threats: string[] }> = {
      Asana: {
        opportunities: ["Enterprise AI integrations", "Government / compliance verticals"],
        threats: ["Feature-rich free competitors", "Market saturation in PM space"],
      },
      "Monday.com": {
        opportunities: ["Expanding CRM adjacency", "Vertical-specific templates"],
        threats: ["ClickUp undercutting on price", "Notion expanding into PM"],
      },
      ClickUp: {
        opportunities: ["All-in-one platform consolidation", "Developer workflow capture"],
        threats: ["Quality perception issues", "Enterprise trust gap"],
      },
    }
    return map
  }, [])

  /* ---------- selected competitor ---------- */
  const [selectedIdx, setSelectedIdx] = React.useState(0)
  const selected = competitors[selectedIdx] ?? competitors[0]

  /* ---------- number gradient classes ---------- */
  const numberColors = [
    "bg-blue-500",
    "bg-slate-500",
    "bg-amber-500",
    "bg-emerald-500",
  ]

  return (
    <TooltipProvider>
      <div className={cn("space-y-5 p-4", className)}>
        {/* ============================================================ */}
        {/*  HEADER                                                       */}
        {/* ============================================================ */}
        <div className="relative overflow-hidden rounded-2xl border bg-card dark:bg-zinc-900 p-5 shadow-sm">
          {/* decorative glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Telescope className="h-3.5 w-3.5" />
                Competitor Intelligence
                {isResearching && <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />}
              </div>
              <h2 className="text-lg font-semibold tracking-tight">&ldquo;{query}&rdquo;</h2>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  {sourcesCount} sources
                </span>
                <span>{lastUpdated}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <DepthRing depth={researchDepth} />
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-tight">
                {researchDepth}
                <br />
                depth
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  COMPETITOR AVATAR SELECTOR                                   */}
        {/* ============================================================ */}
        <div className="flex items-center justify-center gap-3">
          {competitors.map((c, i) => {
            const color = COMPETITOR_COLORS[i % COMPETITOR_COLORS.length]
            const isActive = i === selectedIdx
            return (
              <Tooltip key={c.name}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSelectedIdx(i)}
                    className={cn(
                      "relative flex items-center justify-center rounded-full font-bold transition-all duration-300 select-none",
                      isActive
                        ? "h-14 w-14 text-base ring-[3px] shadow-lg scale-110"
                        : "h-10 w-10 text-xs ring-1 ring-zinc-200 dark:ring-zinc-700 hover:ring-2 opacity-70 hover:opacity-100",
                      isActive && color.ring,
                      color.bg,
                      "text-white"
                    )}
                  >
                    {c.name.charAt(0)}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{c.name} &middot; {c.marketPosition}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {/* ============================================================ */}
        {/*  RADAR CHART + SWOT GRID — side by side on lg                */}
        {/* ============================================================ */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Radar chart */}
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-1">Competitive Radar</h3>
            <p className="text-[11px] text-muted-foreground mb-3">Multi-dimensional comparison across all competitors</p>

            <RadarChart competitors={competitors} dimensions={RADAR_DIMS} scores={DEFAULT_RADAR_SCORES} />

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3">
              {competitors.map((c, i) => {
                const color = COMPETITOR_COLORS[i % COMPETITOR_COLORS.length]
                return (
                  <span key={c.name} className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: color.stroke }} />
                    {c.name}
                  </span>
                )
              })}
            </div>
          </div>

          {/* SWOT Quadrant for selected competitor */}
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">SWOT Analysis</h3>
                <p className="text-[11px] text-muted-foreground">{selected.name} &middot; {selected.category}</p>
              </div>
              <ThreatMeter level={selected.threatLevel} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Strengths */}
              <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 p-3">
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mb-1.5 uppercase tracking-wider">
                  <Check className="h-3 w-3" /> Strengths
                </div>
                <ul className="space-y-1">
                  {selected.strengths.slice(0, 3).map((s) => (
                    <li key={s} className="text-[11px] text-emerald-900/80 dark:text-emerald-200/80 leading-tight">{s}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 p-3">
                <div className="flex items-center gap-1 text-[11px] font-bold text-red-700 dark:text-red-400 mb-1.5 uppercase tracking-wider">
                  <X className="h-3 w-3" /> Weaknesses
                </div>
                <ul className="space-y-1">
                  {selected.weaknesses.slice(0, 3).map((w) => (
                    <li key={w} className="text-[11px] text-red-900/80 dark:text-red-200/80 leading-tight">{w}</li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30 p-3">
                <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 mb-1.5 uppercase tracking-wider">
                  <Zap className="h-3 w-3" /> Opportunities
                </div>
                <ul className="space-y-1">
                  {(swotData[selected.name]?.opportunities ?? ["Emerging market segments", "Product differentiation"]).map((o) => (
                    <li key={o} className="text-[11px] text-blue-900/80 dark:text-blue-200/80 leading-tight">{o}</li>
                  ))}
                </ul>
              </div>

              {/* Threats */}
              <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 p-3">
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-1.5 uppercase tracking-wider">
                  <ShieldAlert className="h-3 w-3" /> Threats
                </div>
                <ul className="space-y-1">
                  {(swotData[selected.name]?.threats ?? ["Increasing competition", "Market consolidation"]).map((t) => (
                    <li key={t} className="text-[11px] text-amber-900/80 dark:text-amber-200/80 leading-tight">{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  FEATURE COMPARISON — DOT MATRIX                             */}
        {/* ============================================================ */}
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Feature Comparison</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Capability dot matrix across competitors</p>

          <ScrollArea className="max-h-[260px]">
            <div className="space-y-0">
              {/* column headers */}
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                <div className="w-36 shrink-0 text-[11px] font-medium text-muted-foreground">Feature</div>
                {competitorNames.map((name, ci) => {
                  const color = COMPETITOR_COLORS[ci % COMPETITOR_COLORS.length]
                  return (
                    <div key={name} className="flex-1 text-center">
                      <span className="text-[10px] font-semibold" style={{ color: color.stroke }}>{name}</span>
                    </div>
                  )
                })}
              </div>

              {/* rows */}
              {comparisonFeatures.map((row) => (
                <div
                  key={row.feature}
                  className="flex items-center gap-2 py-2 border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 group hover:bg-zinc-50 dark:hover:bg-zinc-900/40 rounded-lg transition-colors px-1"
                >
                  <div className="w-36 shrink-0">
                    <button
                      className="text-[11px] font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                      onClick={() => onCompareFeature?.(row.feature)}
                    >
                      {row.feature}
                    </button>
                  </div>
                  {competitorNames.map((name, ci) => {
                    const color = COMPETITOR_COLORS[ci % COMPETITOR_COLORS.length]
                    const has = row.competitorScores[name]
                    return (
                      <div key={name} className="flex-1 flex justify-center">
                        <span
                          className={cn(
                            "h-3.5 w-3.5 rounded-full border-2 transition-all duration-300",
                            has
                              ? "scale-100"
                              : "scale-75 opacity-30"
                          )}
                          style={{
                            borderColor: color.stroke,
                            background: has ? color.stroke : "transparent",
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* legend */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" /> Has feature
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-zinc-300 dark:border-zinc-600" /> Missing
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  KEY FINDINGS — Numbered insight cards in 2x2 grid           */}
        {/* ============================================================ */}
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-indigo-500" />
            Key Findings
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {keyFindings.map((finding, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border bg-background p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* large gradient number */}
                <span
                  className="absolute -top-2 -left-1 text-5xl font-black text-zinc-300 dark:text-zinc-700 opacity-20 group-hover:opacity-30 transition-opacity select-none"
                >
                  {index + 1}
                </span>
                <div className="relative">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center h-6 w-6 rounded-full text-[11px] font-bold text-white mb-2",
                      numberColors[index % numberColors.length]
                    )}
                  >
                    {index + 1}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{finding}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/*  ACTIONS                                                      */}
        {/* ============================================================ */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={onExport}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export report
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download the full competitive analysis as PDF</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8" onClick={onDeepenResearch}>
                <Telescope className="mr-1.5 h-3.5 w-3.5" />
                Deepen research
              </Button>
            </TooltipTrigger>
            <TooltipContent>Run a deeper pass with more sources and analysis</TooltipContent>
          </Tooltip>
          <Button variant="outline" size="sm" className="h-8" onClick={() => onCompareFeature?.("")}>
            <Search className="mr-1.5 h-3.5 w-3.5" />
            Compare features
          </Button>
          <Button variant="ghost" size="sm" className="h-8" onClick={onRefresh}>
            <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", isResearching && "animate-spin")} />
            Refresh data
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentCompetitorResearch.displayName = "AgentCompetitorResearch"
