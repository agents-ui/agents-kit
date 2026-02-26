"use client"

import * as React from "react"
import { ArrowRightLeft, Brain, CheckCircle2, Clock, Loader2, MessageSquareText, RefreshCw, Router, ShieldCheck, XCircle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type RouteStatus = "selected" | "available" | "unavailable"

export interface RouteClassification { intent: string; confidence: number; reasoning: string }

export interface AgentRoute { id: string; agentName: string; specialty: string; matchScore: number; status: RouteStatus; description: string }

export interface RoutingHistoryEntry { id: string; query: string; intent: string; agentName: string; timestamp: string }

export interface AgentRoutingHubProps {
  inputQuery?: string
  classification?: RouteClassification
  routes?: AgentRoute[]
  selectedRouteId?: string
  routingHistory?: RoutingHistoryEntry[]
  isClassifying?: boolean
  className?: string
  onReclassify?: () => void
  onOverrideRoute?: (routeId: string) => void
  onViewHistory?: () => void
}

/* ── colour palette per specialty keyword ─────────────────────────── */
const specialtyColors: Record<string, { border: string; bg: string; text: string; fill: string; ring: string }> = {
  technical: { border: "border-l-cyan-500", bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", fill: "bg-cyan-500", ring: "ring-cyan-500/30" },
  billing:   { border: "border-l-amber-500", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", fill: "bg-amber-500", ring: "ring-amber-500/30" },
  sales:     { border: "border-l-slate-500", bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", fill: "bg-slate-500", ring: "ring-slate-500/30" },
  pricing:   { border: "border-l-slate-500", bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", fill: "bg-slate-500", ring: "ring-slate-500/30" },
  general:   { border: "border-l-slate-400", bg: "bg-slate-400/10", text: "text-slate-500 dark:text-slate-400", fill: "bg-slate-400", ring: "ring-slate-400/30" },
  default:   { border: "border-l-blue-500", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", fill: "bg-blue-500", ring: "ring-blue-500/30" },
}

function getSpecialtyColor(specialty: string) {
  const lower = specialty.toLowerCase()
  for (const key of Object.keys(specialtyColors)) {
    if (key !== "default" && lower.includes(key)) return specialtyColors[key]
  }
  return specialtyColors.default
}

const statusVisual: Record<RouteStatus, { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; tone: string }> = {
  selected:    { label: "Selected", icon: CheckCircle2, tone: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-900/50" },
  available:   { label: "Available", icon: ShieldCheck, tone: "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-900/40" },
  unavailable: { label: "Offline", icon: XCircle, tone: "bg-slate-200 text-slate-600 border border-slate-300 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800" },
}

/* ── Semicircle gauge SVG ─────────────────────────────────────────── */
function ConfidenceGauge({ value, size = 120 }: { value: number; size?: number }) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2 + 4
  // semicircle arc length
  const circumference = Math.PI * radius
  const filled = (value / 100) * circumference
  const gap = circumference - filled

  const color = value >= 80 ? "stroke-emerald-500" : value >= 50 ? "stroke-amber-500" : "stroke-red-500"
  const textColor = value >= 80 ? "text-emerald-600 dark:text-emerald-400" : value >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"

  return (
    <svg width={size} height={size / 2 + 16} viewBox={`0 0 ${size} ${size / 2 + 16}`} className="shrink-0">
      {/* track */}
      <path
        d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-muted"
        strokeLinecap="round"
      />
      {/* filled arc */}
      <path
        d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
        fill="none"
        strokeWidth={strokeWidth}
        className={cn(color, "transition-all duration-700")}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${gap}`}
      />
      {/* value label */}
      <text x={cx} y={cy - 6} textAnchor="middle" className={cn("text-xl font-bold fill-current", textColor)}>
        {value}%
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" className="text-[9px] fill-muted-foreground uppercase tracking-widest">
        confidence
      </text>
    </svg>
  )
}

/* ── SVG arrow connector ──────────────────────────────────────────── */
function ConnectorArrow() {
  return (
    <div className="flex items-center justify-center py-1">
      <svg width="24" height="40" viewBox="0 0 24 40" className="text-blue-500 dark:text-blue-400">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
          </marker>
        </defs>
        <line x1="12" y1="2" x2="12" y2="34" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrowhead)" />
      </svg>
    </div>
  )
}

/* ── Network grid background pattern ─────────────────────────────── */
function NetworkGridBg() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.04] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="routing-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#routing-grid)" />
      {/* subtle node dots at intersections */}
      <circle cx="0" cy="0" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="32" cy="0" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="0" cy="32" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="32" cy="32" r="1.2" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════ */

export function AgentRoutingHub({ inputQuery, classification, routes, selectedRouteId, routingHistory, isClassifying = false, className, onReclassify, onOverrideRoute, onViewHistory }: AgentRoutingHubProps) {

  /* ── default demo data (useMemo) ──────────────────────────────── */
  const defaultRoutes: AgentRoute[] = React.useMemo(() => [
    { id: "tech", agentName: "Tech Support Agent", specialty: "Technical issues", matchScore: 94, status: "selected", description: "Handles debugging, error resolution, and technical troubleshooting for product issues." },
    { id: "billing", agentName: "Billing Agent", specialty: "Payments & invoices", matchScore: 42, status: "available", description: "Manages billing inquiries, payment failures, refund requests, and invoice generation." },
    { id: "sales", agentName: "Sales Agent", specialty: "Pricing & plans", matchScore: 18, status: "available", description: "Assists with plan upgrades, feature comparisons, and enterprise pricing questions." },
    { id: "general", agentName: "General Agent", specialty: "Broad Q&A", matchScore: 12, status: "unavailable", description: "Catches general queries that do not match a specialized agent category." },
  ], [])

  const defaultClassification: RouteClassification = React.useMemo(() => ({
    intent: "Technical Support", confidence: 96,
    reasoning: "Query mentions a specific product error related to payment processing, indicating a technical debugging need rather than a billing dispute.",
  }), [])

  const defaultHistory: RoutingHistoryEntry[] = React.useMemo(() => [
    { id: "h1", query: "How do I upgrade my plan?", intent: "Sales", agentName: "Sales Agent", timestamp: "2 min ago" },
    { id: "h2", query: "Invoice #4821 is incorrect", intent: "Billing", agentName: "Billing Agent", timestamp: "8 min ago" },
    { id: "h3", query: "API returns 500 on /auth", intent: "Technical Support", agentName: "Tech Support Agent", timestamp: "14 min ago" },
  ], [])

  const displayQuery = inputQuery ?? "How do I fix the payment processing error?"
  const cls = classification ?? defaultClassification
  const displayRoutes = routes && routes.length > 0 ? routes : defaultRoutes
  const selId = selectedRouteId ?? "tech"
  const history = routingHistory && routingHistory.length > 0 ? routingHistory : defaultHistory
  const selectedRoute = displayRoutes.find((r) => r.id === selId)

  return (
    <TooltipProvider>
      <div className={cn("w-full space-y-0", className)}>

        {/* ── Header with network grid background ───────────────────── */}
        <div className="relative overflow-hidden rounded-t-xl border border-b-0 bg-zinc-50 dark:bg-zinc-900 px-5 py-5">
          <NetworkGridBg />
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                  <Router className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Agent Routing Hub</h2>
                  <p className="text-xs text-muted-foreground">Intelligent query classification and agent dispatch</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onReclassify} disabled={isClassifying}>
                <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", isClassifying && "animate-spin")} />Reclassify
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onViewHistory}>
                <Clock className="mr-1.5 h-3.5 w-3.5" />History
              </Button>
            </div>
          </div>
        </div>

        {/* ── Classification ticker bar ─────────────────────────────── */}
        <div className="border border-b-0 bg-background px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-1 font-medium text-white shadow-sm">
              <MessageSquareText className="h-3 w-3" />Query
            </span>
            <span className="text-muted-foreground/60">&rsaquo;</span>
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">
              <Brain className="h-3 w-3" />
              Intent: {cls.intent}
              {isClassifying && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
            </span>
            <span className="text-muted-foreground/60">&rsaquo;</span>
            <span className={cn(
              "rounded-full px-2.5 py-1 font-medium",
              cls.confidence >= 80 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
              cls.confidence >= 50 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
              "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
            )}>
              Confidence: {cls.confidence}%
            </span>
            <span className="text-muted-foreground/60">&rsaquo;</span>
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">
              <Zap className="h-3 w-3 text-blue-500" />
              Route: {selectedRoute?.agentName ?? "Pending..."}
            </span>
          </div>
        </div>

        {/* ── Main content area ─────────────────────────────────────── */}
        <div className="rounded-b-xl border bg-background">
          <div className="grid gap-0 lg:grid-cols-[1fr,260px]">

            {/* ── LEFT: network visualization ───────────────────────── */}
            <div className="space-y-0 p-5 lg:border-r">

              {/* Central query node with pulsing ring */}
              <div className="relative mx-auto max-w-lg">
                <div className={cn(
                  "relative rounded-xl border-2 border-blue-500/70 bg-blue-50/50 p-4 shadow-sm",
                  "dark:bg-blue-950/20 dark:border-blue-400/50",
                  "before:absolute before:inset-0 before:rounded-xl before:border-2 before:border-blue-400/30 before:animate-ping before:pointer-events-none before:[animation-duration:2.5s]",
                )}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <MessageSquareText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Incoming Query</p>
                      <p className="text-sm font-medium leading-snug text-foreground">{displayQuery}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SVG arrow from query to routes */}
              <ConnectorArrow />

              {/* Route cards grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                {displayRoutes.map((route) => {
                  const isSelected = route.id === selId
                  const visual = statusVisual[route.status]
                  const color = getSpecialtyColor(route.specialty)

                  return (
                    <div
                      key={route.id}
                      className={cn(
                        "relative rounded-xl border-l-4 border bg-background p-4 transition-all duration-200",
                        color.border,
                        isSelected && "ring-2 ring-blue-500 shadow-sm dark:ring-blue-400 border-l-blue-500",
                        !isSelected && route.status === "unavailable" && "opacity-50",
                      )}
                    >
                      {/* selected indicator dot */}
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate text-foreground">{route.agentName}</p>
                          <p className={cn("text-xs font-medium truncate mt-0.5", color.text)}>{route.specialty}</p>
                        </div>
                        <Badge className={cn("shrink-0 text-[10px] px-1.5 py-0.5", visual.tone)}>
                          {React.createElement(visual.icon, { className: "h-2.5 w-2.5 mr-0.5" })}{visual.label}
                        </Badge>
                      </div>

                      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">{route.description}</p>

                      {/* Match score bar INSIDE the card */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[10px] mb-1.5">
                          <span className="font-medium text-muted-foreground uppercase tracking-wide">Match</span>
                          <span className={cn("font-bold tabular-nums", route.matchScore >= 70 ? "text-emerald-600 dark:text-emerald-400" : route.matchScore >= 40 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>{route.matchScore}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              route.matchScore >= 70 ? "bg-emerald-500" : route.matchScore >= 40 ? "bg-amber-500" : "bg-slate-400",
                            )}
                            style={{ width: `${route.matchScore}%` }}
                          />
                        </div>
                      </div>

                      {!isSelected && route.status === "available" && (
                        <Button variant="ghost" size="sm" className="mt-3 h-7 w-full text-[11px] hover:bg-muted/60" onClick={() => onOverrideRoute?.(route.id)}>
                          <ArrowRightLeft className="mr-1 h-3 w-3" />Override route
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Routing reasoning callout */}
              {selectedRoute && (
                <div className="mt-4 rounded-lg border border-blue-200/60 bg-blue-50/50 p-3 dark:border-blue-900/40 dark:bg-blue-900/10">
                  <div className="flex items-start gap-2.5">
                    <Brain className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground">
                        Routed to <span className="text-blue-700 dark:text-blue-300">{selectedRoute.agentName}</span>
                      </p>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">{cls.reasoning}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: gauge + history ─────────────────────────────── */}
            <div className="flex flex-col divide-y">

              {/* Confidence gauge */}
              <div className="flex flex-col items-center px-4 py-5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Routing Confidence</p>
                <ConfidenceGauge value={cls.confidence} size={140} />
                <p className="mt-1 text-[11px] text-muted-foreground text-center max-w-[200px] leading-relaxed">
                  {cls.confidence >= 80 ? "High confidence routing. No manual review needed." :
                   cls.confidence >= 50 ? "Moderate confidence. Consider reviewing the selection." :
                   "Low confidence. Manual override recommended."}
                </p>
              </div>

              {/* Recent routes mini table */}
              <div className="flex-1 px-4 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">Recent Routes</p>
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{history.length}</Badge>
                </div>
                <ScrollArea className="h-[200px]">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-1.5 font-medium">Query</th>
                        <th className="pb-1.5 font-medium text-right">Route</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((entry, i) => (
                        <Tooltip key={entry.id}>
                          <TooltipTrigger asChild>
                            <tr className={cn(
                              "border-b border-muted/40 transition-colors hover:bg-muted/30",
                              i % 2 === 0 ? "bg-muted/10" : "bg-transparent",
                            )}>
                              <td className="py-2 pr-2">
                                <p className="truncate max-w-[110px] font-medium text-foreground">{entry.query}</p>
                                <p className="text-[10px] text-muted-foreground">{entry.timestamp}</p>
                              </td>
                              <td className="py-2 text-right">
                                <Badge variant="outline" className="text-[9px] px-1.5 py-0">{entry.intent}</Badge>
                              </td>
                            </tr>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="text-xs">
                            <p className="font-medium">{entry.agentName}</p>
                            <p className="text-muted-foreground">Routed {entry.timestamp}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentRoutingHub.displayName = "AgentRoutingHub"
