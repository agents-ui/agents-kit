"use client"

import * as React from "react"
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Database,
  Fingerprint,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  XCircle,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export type RiskLevel = "low" | "medium" | "high"

export interface ToolApprovalRequest {
  toolName: string
  description: string
  parameters: Record<string, string>
  riskLevel: RiskLevel
  reasoning: string
}

export interface ToolApprovalHistoryItem {
  id: string
  toolName: string
  decision: "approved" | "rejected"
  timestamp: string
  actor?: string
}

export interface ToolExecutionResult {
  success: boolean
  output: string
  duration?: string
}

export interface AgentToolApprovalProps {
  pendingApproval?: ToolApprovalRequest | null
  approvalHistory?: ToolApprovalHistoryItem[]
  executionResult?: ToolExecutionResult | null
  onApprove?: () => void
  onReject?: () => void
  onAlwaysAllow?: (toolName: string) => void
  className?: string
}

const riskBannerConfig: Record<
  RiskLevel,
  { label: string; bannerClass: string; iconColor: string; dotClass: string }
> = {
  low: {
    label: "Low Risk",
    bannerClass: "bg-emerald-600 dark:bg-emerald-700",
    iconColor: "text-emerald-100",
    dotClass: "bg-emerald-400",
  },
  medium: {
    label: "Medium Risk",
    bannerClass: "bg-amber-500 dark:bg-amber-600",
    iconColor: "text-amber-100",
    dotClass: "bg-amber-400",
  },
  high: {
    label: "High Risk",
    bannerClass: "bg-red-600 dark:bg-red-700",
    iconColor: "text-red-100",
    dotClass: "bg-red-400",
  },
}

export function AgentToolApproval({
  pendingApproval,
  approvalHistory,
  executionResult,
  onApprove,
  onReject,
  onAlwaysAllow,
  className,
}: AgentToolApprovalProps) {
  const [alwaysAllow, setAlwaysAllow] = React.useState(false)
  const [resultOpen, setResultOpen] = React.useState(true)

  const defaultApproval: ToolApprovalRequest = React.useMemo(
    () => ({
      toolName: "database_query",
      description:
        "Execute a read-only SQL query against the analytics database",
      parameters: {
        query:
          "SELECT user_id, COUNT(*) AS sessions FROM events WHERE ts > NOW() - INTERVAL '7 days' GROUP BY user_id ORDER BY sessions DESC LIMIT 20",
        database: "analytics_prod",
        timeout: "30s",
      },
      riskLevel: "medium",
      reasoning:
        "The user asked for the most active users this week. This query fetches the top 20 users by session count from the production analytics database over the last 7 days.",
    }),
    []
  )

  const defaultHistory: ToolApprovalHistoryItem[] = React.useMemo(
    () => [
      {
        id: "h1",
        toolName: "web_search",
        decision: "approved",
        timestamp: "2 min ago",
        actor: "You",
      },
      {
        id: "h2",
        toolName: "send_email",
        decision: "rejected",
        timestamp: "8 min ago",
        actor: "You",
      },
      {
        id: "h3",
        toolName: "database_query",
        decision: "approved",
        timestamp: "14 min ago",
        actor: "You",
      },
    ],
    []
  )

  const defaultResult: ToolExecutionResult = React.useMemo(
    () => ({
      success: true,
      output:
        '[\n  { "user_id": "u_38291", "sessions": 142 },\n  { "user_id": "u_10482", "sessions": 118 },\n  { "user_id": "u_92841", "sessions": 97 }\n]',
      duration: "230ms",
    }),
    []
  )

  const approval =
    pendingApproval === undefined ? defaultApproval : pendingApproval
  const history =
    approvalHistory && approvalHistory.length > 0
      ? approvalHistory
      : defaultHistory
  const result =
    executionResult === undefined ? defaultResult : executionResult

  const riskConf = approval ? riskBannerConfig[approval.riskLevel] : null

  return (
    <TooltipProvider>
      {/* Outer wrapper with subtle dot-grid pattern */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60",
          className
        )}
      >
        {/* Subtle dot grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgb(148 163 184 / 0.5) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative z-10 space-y-5 p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Tool Approval Required
              </h2>
              <p className="text-sm text-muted-foreground">
                The agent needs your permission before executing a tool.
              </p>
            </div>
          </div>

          {approval ? (
            <div className="grid gap-5 lg:grid-cols-[1fr,340px]">
              {/* -------- Main approval card (glass) -------- */}
              <div className="space-y-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700">
                {/* Risk banner */}
                <div
                  className={cn(
                    "flex items-center justify-between gap-2 px-4 py-2.5 text-white",
                    riskConf!.bannerClass
                  )}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span
                      className={cn(
                        "inline-block h-2 w-2 rounded-full animate-pulse",
                        riskConf!.dotClass
                      )}
                    />
                    {riskConf!.label}
                  </div>
                  <Fingerprint
                    className={cn("h-4 w-4", riskConf!.iconColor)}
                  />
                </div>

                {/* Card body */}
                <div className="space-y-4 bg-card p-5">
                  {/* Tool name + description */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Database className="h-4.5 w-4.5 shrink-0 text-blue-600 dark:text-blue-400" />
                      <span className="font-mono text-sm font-bold text-foreground">
                        {approval.toolName}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {approval.description}
                    </p>
                  </div>

                  {/* Parameters (dark code panel) */}
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <Terminal className="h-3 w-3" />
                      Parameters
                    </h4>
                    <div className="overflow-hidden rounded-lg bg-zinc-950 p-3 shadow-inner">
                      {Object.entries(approval.parameters).map(
                        ([key, value]) => (
                          <div key={key} className="flex gap-2 py-1 font-mono text-xs">
                            <span className="shrink-0 text-sky-400">
                              {key}
                              <span className="text-zinc-500">:</span>
                            </span>
                            <span className="break-all text-zinc-100">
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Agent reasoning */}
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Agent Reasoning
                    </h4>
                    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/80 p-3.5 text-sm leading-relaxed text-muted-foreground dark:border-zinc-700 dark:bg-zinc-800/50">
                      {approval.reasoning}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-4 border-t border-zinc-200/80 pt-4 dark:border-zinc-700/60 sm:flex-row sm:items-center sm:justify-between">
                    {/* Always-allow toggle */}
                    <button
                      type="button"
                      onClick={() => setAlwaysAllow((v) => !v)}
                      className="group flex items-center gap-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {/* Modern toggle switch */}
                      <span
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
                          alwaysAllow
                            ? "bg-emerald-500"
                            : "bg-zinc-300 dark:bg-zinc-600"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200",
                            alwaysAllow ? "translate-x-[18px]" : "translate-x-[3px]"
                          )}
                        />
                      </span>
                      <span>
                        Always allow{" "}
                        <span className="font-semibold text-foreground">
                          {approval.toolName}
                        </span>
                      </span>
                    </button>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2.5">
                      <Button
                        size="lg"
                        className="h-10 rounded-lg bg-red-600 px-5 text-white shadow-sm transition-colors hover:bg-red-700"
                        onClick={onReject}
                      >
                        <XCircle className="mr-1.5 h-4 w-4" />
                        Reject
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="lg"
                            className="h-10 rounded-lg bg-emerald-600 px-5 text-white shadow-sm transition-colors hover:bg-emerald-700"
                            onClick={() => {
                              if (alwaysAllow)
                                onAlwaysAllow?.(approval.toolName)
                              onApprove?.()
                            }}
                          >
                            <CheckCircle2 className="mr-1.5 h-4 w-4" />
                            Approve
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Allow the agent to execute this tool call
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>

              {/* -------- Right column -------- */}
              <div className="space-y-5">
                {/* Execution result (collapsible) */}
                {result && (
                  <Collapsible open={resultOpen} onOpenChange={setResultOpen}>
                    <div className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700">
                      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-semibold text-foreground">
                            Execution Result
                          </span>
                          <Badge
                            className={cn(
                              "ml-1 text-[10px]",
                              result.success
                                ? "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/30 dark:text-emerald-300"
                                : "border-red-200 bg-red-100 text-red-700 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-300"
                            )}
                          >
                            {result.success ? "Success" : "Failed"}
                            {result.duration && ` \u00b7 ${result.duration}`}
                          </Badge>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform duration-200",
                            resultOpen && "rotate-180"
                          )}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="border-t border-zinc-200/60 dark:border-zinc-700/40">
                          <div className="p-3">
                            <div className="overflow-hidden rounded-lg bg-zinc-950 p-3 font-mono text-xs leading-relaxed text-zinc-100 shadow-inner">
                              <pre className="whitespace-pre-wrap break-all">
                                {result.output}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                )}

                {/* Timeline-style history */}
                <div className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700">
                  <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">
                        Approval Timeline
                      </span>
                    </div>
                    <Badge className="border-blue-200 bg-blue-50 text-[10px] text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-300">
                      {history.length} decisions
                    </Badge>
                  </div>

                  <ScrollArea className="max-h-[280px]">
                    <div className="px-4 py-3">
                      <div className="relative">
                        {/* Connecting line */}
                        <div className="absolute left-[7px] top-2.5 bottom-2.5 w-px bg-zinc-200 dark:bg-zinc-700" />

                        <div className="space-y-0">
                          {history.map((item, index) => {
                            const isApproved = item.decision === "approved"
                            return (
                              <div
                                key={item.id}
                                className="relative flex items-start gap-3 py-2.5"
                              >
                                {/* Timeline dot */}
                                <div className="relative z-10 mt-0.5">
                                  <div
                                    className={cn(
                                      "flex h-[15px] w-[15px] items-center justify-center rounded-full ring-2 ring-white dark:ring-zinc-900",
                                      isApproved
                                        ? "bg-emerald-500"
                                        : "bg-red-500"
                                    )}
                                  >
                                    {isApproved ? (
                                      <ThumbsUp className="h-2 w-2 text-white" />
                                    ) : (
                                      <ThumbsDown className="h-2 w-2 text-white" />
                                    )}
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                                  <div className="min-w-0">
                                    <span className="block truncate font-mono text-xs font-semibold text-foreground">
                                      {item.toolName}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                      {isApproved ? "Approved" : "Rejected"}
                                      {item.actor && ` by ${item.actor}`}
                                    </span>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {item.timestamp}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-muted px-6 py-10 dark:border-zinc-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <ShieldCheck className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium text-foreground">
                  No pending approvals
                </p>
                <p className="text-xs text-muted-foreground">
                  The agent will request permission when it needs to execute a
                  tool.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentToolApproval.displayName = "AgentToolApproval"
