"use client"

import * as React from "react"
import {
  CheckCircle2,
  Clock,
  GitBranch,
  RotateCcw,
  ShieldCheck,
  Target,
  ThumbsDown,
  ThumbsUp,
  XCircle,
  Search,
  PenTool,
  Eye,
  Zap,
  Bot,
  Send,
  Database,
  FileText,
  Globe,
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

export type PlanStepStatus = "pending" | "approved" | "rejected" | "modified"

export interface PlanStep {
  id: string
  title: string
  description: string
  tool: string
  duration: string
  dependencies: number[]
  status: PlanStepStatus
}

export interface AgentPlanBuilderProps {
  planTitle?: string
  objective?: string
  totalEstimate?: string
  estimatedCost?: string
  steps?: PlanStep[]
  confidence?: number
  onApproveAll?: () => void
  onRejectPlan?: () => void
  onRevise?: () => void
  onApproveStep?: (stepId: string) => void
  onRejectStep?: (stepId: string) => void
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Agent-type icon resolver                                          */
/* ------------------------------------------------------------------ */
const toolIconMap: Record<string, { icon: React.ElementType; color: string }> = {
  "Web Crawler": { icon: Globe, color: "text-sky-500" },
  "Content Analyzer": { icon: PenTool, color: "text-slate-500" },
  "Backlink Agent": { icon: Database, color: "text-orange-500" },
  "Report Builder": { icon: FileText, color: "text-emerald-500" },
  "Notifier": { icon: Send, color: "text-sky-500" },
  researcher: { icon: Search, color: "text-sky-500" },
  writer: { icon: PenTool, color: "text-slate-500" },
  reviewer: { icon: Eye, color: "text-amber-500" },
  executor: { icon: Zap, color: "text-emerald-500" },
}

function getToolIcon(tool: string) {
  const entry = toolIconMap[tool]
  if (entry) return entry
  return { icon: Bot, color: "text-muted-foreground" }
}

/* ------------------------------------------------------------------ */
/*  Semicircle Gauge SVG                                              */
/* ------------------------------------------------------------------ */
function SemicircleGauge({ value, size = 120 }: { value: number; size?: number }) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)))
  const radius = 44
  const strokeWidth = 8
  // Semicircle arc length
  const circumference = Math.PI * radius
  const filled = (clamped / 100) * circumference
  const gap = circumference - filled

  // Color based on value
  let strokeColor = "stroke-red-400"
  if (clamped >= 70) strokeColor = "stroke-emerald-500"
  else if (clamped >= 40) strokeColor = "stroke-amber-400"

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size * 0.6 }}>
      <svg
        viewBox="0 0 100 55"
        className="w-full h-full overflow-visible"
      >
        {/* Background track */}
        <path
          d="M 6 50 A 44 44 0 0 1 94 50"
          fill="none"
          className="stroke-muted/40"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d="M 6 50 A 44 44 0 0 1 94 50"
          fill="none"
          className={cn(strokeColor, "transition-all duration-700 ease-out")}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${gap}`}
        />
      </svg>
      {/* Center label */}
      <div className="absolute bottom-0 flex flex-col items-center">
        <span className="text-2xl font-bold tracking-tight">{clamped}%</span>
        <span className="text-[10px] text-muted-foreground -mt-0.5">confidence</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Column definitions                                                */
/* ------------------------------------------------------------------ */
type ColumnKey = "pending" | "approved" | "rejected"

interface ColumnDef {
  key: ColumnKey
  label: string
  bg: string
  headerBg: string
  headerText: string
  dotColor: string
  emptyText: string
}

const columns: ColumnDef[] = [
  {
    key: "pending",
    label: "Pending Review",
    bg: "bg-amber-50/60 dark:bg-amber-950/10",
    headerBg: "bg-amber-100 dark:bg-amber-900/30",
    headerText: "text-amber-800 dark:text-amber-200",
    dotColor: "bg-amber-400",
    emptyText: "No pending steps",
  },
  {
    key: "approved",
    label: "Approved",
    bg: "bg-emerald-50/60 dark:bg-emerald-950/10",
    headerBg: "bg-emerald-100 dark:bg-emerald-900/30",
    headerText: "text-emerald-800 dark:text-emerald-200",
    dotColor: "bg-emerald-400",
    emptyText: "No approved steps",
  },
  {
    key: "rejected",
    label: "Rejected",
    bg: "bg-red-50/60 dark:bg-red-950/10",
    headerBg: "bg-red-100 dark:bg-red-900/30",
    headerText: "text-red-800 dark:text-red-200",
    dotColor: "bg-red-400",
    emptyText: "No rejected steps",
  },
]

/* ------------------------------------------------------------------ */
/*  Step card                                                         */
/* ------------------------------------------------------------------ */
function StepCard({
  step,
  stepIndex,
  onApprove,
  onReject,
}: {
  step: PlanStep
  stepIndex: number
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}) {
  const { icon: ToolIcon, color: toolColor } = getToolIcon(step.tool)

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-white p-3.5",
        "shadow-sm hover:shadow-md hover:-translate-y-0.5",
        "transition-all duration-200 ease-out",
        "dark:bg-zinc-900 dark:border-zinc-800"
      )}
    >
      {/* Large watermark step number */}
      <span
        className="pointer-events-none absolute -right-1 -top-2 select-none text-6xl font-black opacity-[0.04] dark:opacity-[0.06]"
        aria-hidden
      >
        {stepIndex}
      </span>

      {/* Top row: icon + title + actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Agent type icon */}
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
              "bg-muted/60 dark:bg-zinc-800"
            )}
          >
            <ToolIcon className={cn("h-3.5 w-3.5", toolColor)} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate text-foreground">
              {step.title}
            </p>
          </div>
        </div>

        {/* Step # badge */}
        <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
          {stepIndex}
        </span>
      </div>

      {/* Description */}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
        {step.description}
      </p>

      {/* Meta row */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 h-5 font-medium gap-1"
        >
          <GitBranch className="h-2.5 w-2.5" />
          {step.tool}
        </Badge>
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 h-5 font-medium gap-1"
        >
          <Clock className="h-2.5 w-2.5" />
          {step.duration}
        </Badge>
      </div>

      {/* Dependencies */}
      {step.dependencies.length > 0 && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground mr-0.5">Depends on</span>
          {step.dependencies.map((dep) => (
            <span
              key={dep}
              className="inline-flex h-4 w-4 items-center justify-center rounded border border-dashed border-muted-foreground/30 text-[9px] font-semibold text-muted-foreground"
            >
              {dep}
            </span>
          ))}
          {/* Dashed connection line visual */}
          <span className="flex-1 border-t border-dashed border-muted-foreground/20 ml-1" />
        </div>
      )}

      {/* Actions for pending/modified steps */}
      {(step.status === "pending" || step.status === "modified") && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-dashed pt-2.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 flex-1 text-xs gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                onClick={() => onApprove?.(step.id)}
              >
                <ThumbsUp className="h-3 w-3" />
                Approve
              </Button>
            </TooltipTrigger>
            <TooltipContent>Approve this step</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 flex-1 text-xs gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => onReject?.(step.id)}
              >
                <ThumbsDown className="h-3 w-3" />
                Reject
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reject this step</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export function AgentPlanBuilder({
  planTitle = "SEO Audit Pipeline",
  objective = "Run a full-site SEO audit, analyze content gaps, and deliver an actionable report to the marketing team.",
  totalEstimate = "~34 min",
  estimatedCost = "$1.20",
  steps: stepsProp,
  confidence = 87,
  onApproveAll,
  onRejectPlan,
  onRevise,
  onApproveStep,
  onRejectStep,
  className,
}: AgentPlanBuilderProps) {
  const defaultSteps: PlanStep[] = React.useMemo(
    () => [
      {
        id: "s1",
        title: "Crawl site pages",
        description:
          "Spider all public URLs and collect metadata, status codes, and page-load times.",
        tool: "Web Crawler",
        duration: "~8 min",
        dependencies: [],
        status: "approved",
      },
      {
        id: "s2",
        title: "Analyze content quality",
        description:
          "Score each page for keyword density, readability, and internal linking coverage.",
        tool: "Content Analyzer",
        duration: "~10 min",
        dependencies: [1],
        status: "pending",
      },
      {
        id: "s3",
        title: "Check backlink profile",
        description:
          "Pull referring domains, anchor-text distribution, and spam-score flagging.",
        tool: "Backlink Agent",
        duration: "~6 min",
        dependencies: [1],
        status: "pending",
      },
      {
        id: "s4",
        title: "Generate audit report",
        description:
          "Compile findings into a structured report with priority-ranked recommendations.",
        tool: "Report Builder",
        duration: "~7 min",
        dependencies: [2, 3],
        status: "rejected",
      },
      {
        id: "s5",
        title: "Send notifications",
        description:
          "Deliver the report via email and post a summary to the team Slack channel.",
        tool: "Notifier",
        duration: "~3 min",
        dependencies: [4],
        status: "pending",
      },
    ],
    []
  )

  const displaySteps =
    stepsProp && stepsProp.length > 0 ? stepsProp : defaultSteps

  const confidenceClamped = Math.min(100, Math.max(0, Math.round(confidence)))

  /* Build the step-index map (1-based) */
  const stepIndexMap = React.useMemo(() => {
    const map = new Map<string, number>()
    displaySteps.forEach((s, i) => map.set(s.id, i + 1))
    return map
  }, [displaySteps])

  /* Bucket steps into columns */
  const buckets = React.useMemo(() => {
    const pending: PlanStep[] = []
    const approved: PlanStep[] = []
    const rejected: PlanStep[] = []

    displaySteps.forEach((step) => {
      if (step.status === "approved") approved.push(step)
      else if (step.status === "rejected") rejected.push(step)
      else pending.push(step) // pending + modified go to pending column
    })

    return { pending, approved, rejected } as Record<ColumnKey, PlanStep[]>
  }, [displaySteps])

  /* Summary counts */
  const counts = React.useMemo(
    () => ({
      pending: buckets.pending.length,
      approved: buckets.approved.length,
      rejected: buckets.rejected.length,
      total: displaySteps.length,
    }),
    [buckets, displaySteps]
  )

  return (
    <TooltipProvider>
      <div className={cn("space-y-4", className)}>
        {/* ==================== HEADER CARD ==================== */}
        <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-zinc-200 dark:bg-zinc-700" />

          <div className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              {/* Left: Title + objective */}
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-muted-foreground">
                  <Target className="h-3.5 w-3.5" />
                  Plan Confirmation
                </div>
                <h2 className="text-xl font-bold tracking-tight truncate md:text-2xl">
                  {planTitle}
                </h2>
                <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                  {objective}
                </p>

                {/* Pill stats */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900/40 text-xs">
                    {counts.approved} approved
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-900/40 text-xs">
                    {counts.pending} pending
                  </Badge>
                  <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900/40 text-xs">
                    {counts.rejected} rejected
                  </Badge>
                  <span className="text-muted-foreground/40 mx-1">|</span>
                  <Badge
                    variant="outline"
                    className="text-xs gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    {totalEstimate}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {estimatedCost}
                  </Badge>
                </div>
              </div>

              {/* Right: Semicircle gauge */}
              <div className="flex flex-col items-center shrink-0 pt-1">
                <SemicircleGauge value={confidenceClamped} size={130} />
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                  <ShieldCheck className="h-3 w-3" />
                  Agent confidence score
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== KANBAN BOARD ==================== */}
        <ScrollArea className="w-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 min-w-[640px] pb-2">
            {columns.map((col) => {
              const items = buckets[col.key]
              return (
                <div
                  key={col.key}
                  className={cn(
                    "flex flex-col rounded-xl border overflow-hidden",
                    col.bg
                  )}
                >
                  {/* Column header */}
                  <div
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5",
                      col.headerBg
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn("h-2 w-2 rounded-full", col.dotColor)}
                      />
                      <span
                        className={cn(
                          "text-xs font-semibold tracking-wide",
                          col.headerText
                        )}
                      >
                        {col.label}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                        col.headerBg,
                        col.headerText
                      )}
                    >
                      {items.length}
                    </span>
                  </div>

                  {/* Column body */}
                  <div className="flex-1 space-y-2.5 p-2.5 min-h-[120px]">
                    {items.length === 0 ? (
                      <div className="flex h-full min-h-[100px] items-center justify-center">
                        <p className="text-xs text-muted-foreground/50 italic">
                          {col.emptyText}
                        </p>
                      </div>
                    ) : (
                      items.map((step) => (
                        <StepCard
                          key={step.id}
                          step={step}
                          stepIndex={stepIndexMap.get(step.id) ?? 0}
                          onApprove={onApproveStep}
                          onReject={onRejectStep}
                        />
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        {/* ==================== GLOBAL ACTIONS ==================== */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button
            className="bg-blue-600 hover:bg-blue-700 shadow-sm"
            onClick={onApproveAll}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve all
          </Button>
          <Button variant="outline" onClick={onRevise}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Request revision
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={onRejectPlan}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject plan
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentPlanBuilder.displayName = "AgentPlanBuilder"
