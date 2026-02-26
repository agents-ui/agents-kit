"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardCheck, Compass, ListChecks, RefreshCw, Sparkles } from "lucide-react"

export interface WorkflowCheckpoint {
  id: string
  title: string
  owner: string
  eta: string
  status: "upcoming" | "active" | "done"
  notes?: string
}

export interface WorkflowPlaybook {
  label: string
  description: string
  tasks: string[]
  handoff?: string
}

export interface ActionItem {
  id: string
  label: string
  detail: string
  type: "agent" | "human"
}

export interface AgentWorkflowPlannerProps {
  programName?: string
  timeframe?: string
  checkpoints?: WorkflowCheckpoint[]
  playbooks?: WorkflowPlaybook[]
  nextActions?: ActionItem[]
  onReplan?: () => void
  onAcknowledge?: (item: ActionItem) => void
  className?: string
}

const defaultCheckpoints: WorkflowCheckpoint[] = [
  {
    id: "cp-1",
    title: "Scope requirements",
    owner: "Agent Meridian",
    eta: "Due today",
    status: "done",
    notes: "Validated against sales requests",
  },
  {
    id: "cp-2",
    title: "Design handoff",
    owner: "Agent Relay",
    eta: "12:30 PM",
    status: "active",
    notes: "Upload updated figma annotations",
  },
  {
    id: "cp-3",
    title: "Ops enablement",
    owner: "Agent Orbit",
    eta: "Tomorrow",
    status: "upcoming",
    notes: "Prep Notion page + Loom walkthrough",
  },
]

const defaultPlaybooks: WorkflowPlaybook[] = [
  {
    label: "Agent onboarding",
    description: "Spin up new agent in under 45 min",
    tasks: ["Provision API keys", "Sync policies", "Validate prompt stack"],
    handoff: "Human QA review",
  },
  {
    label: "Lifecycle announcements",
    description: "Ship in-product tooltip campaign",
    tasks: ["Draft copy", "Localize", "Schedule rollout"],
  },
]

const defaultActions: ActionItem[] = [
  {
    id: "act-1",
    label: "Upload annotated design doc",
    detail: "Agent Relay awaiting updated callouts",
    type: "human",
  },
  {
    id: "act-2",
    label: "Approve pricing adjustments",
    detail: "Agent Ledger prepared 3 tiered options",
    type: "human",
  },
  {
    id: "act-3",
    label: "Generate onboarding email",
    detail: "Agent Author queued copy draft for review",
    type: "agent",
  },
]

export function AgentWorkflowPlanner({
  programName = "Launch readiness",
  timeframe = "Week of March 17",
  checkpoints = defaultCheckpoints,
  playbooks = defaultPlaybooks,
  nextActions = defaultActions,
  onReplan,
  onAcknowledge,
  className,
}: AgentWorkflowPlannerProps) {
  const [expandedPlaybook, setExpandedPlaybook] = React.useState(playbooks[0]?.label)

  const statusStyles: Record<WorkflowCheckpoint["status"], string> = {
    done: "border-emerald-200 bg-emerald-50 text-emerald-700",
    active: "border-blue-200 bg-blue-50 text-blue-700",
    upcoming: "border-slate-200 bg-slate-50 text-slate-600",
  }

  return (
    <TooltipProvider>
      <div className={cn("space-y-5 p-4", className)}>
        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                {timeframe}
              </div>
              <div className="flex items-end gap-3">
                <h2 className="text-2xl font-semibold tracking-tight">{programName} workflow</h2>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Sparkles className="h-3.5 w-3.5" /> Agent-driven
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Checkpoints, playbooks, and next steps orchestrated between agents and humans.
              </p>
            </div>
            <Button className="h-9" onClick={onReplan}>
              <RefreshCw className="mr-2 h-4 w-4" /> Re-plan the week
            </Button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr,1fr]">
          <div className="space-y-4 rounded-xl border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-blue-500" /> Checkpoints
              </p>
              <Badge variant="outline">{checkpoints.length} milestones</Badge>
            </div>
            <div className="space-y-4">
              {checkpoints.map((checkpoint, index) => (
                <div key={checkpoint.id} className="space-y-3 rounded-lg border border-dashed p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold", statusStyles[checkpoint.status])}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{checkpoint.title}</p>
                        <p className="text-xs text-muted-foreground">Owner · {checkpoint.owner}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{checkpoint.eta}</Badge>
                  </div>
                  {checkpoint.notes && (
                    <p className="text-xs text-muted-foreground">{checkpoint.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <Compass className="h-4 w-4 text-indigo-500" /> Playbooks
                </p>
                <Badge variant="outline">{playbooks.length} templates</Badge>
              </div>
              <div className="mt-3 space-y-3">
                {playbooks.map((playbook) => {
                  const selected = expandedPlaybook === playbook.label
                  return (
                    <div key={playbook.label} className="rounded-lg border p-3 transition-all">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between text-left"
                        onClick={() => setExpandedPlaybook(selected ? undefined : playbook.label)}
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{playbook.label}</p>
                          <p className="text-xs text-muted-foreground">{playbook.description}</p>
                        </div>
                        <ArrowRight className={cn("h-4 w-4 transition-transform", selected && "rotate-90")}
                        />
                      </button>
                      {selected && (
                        <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                          <p className="font-medium text-foreground">Steps</p>
                          <ol className="list-decimal space-y-1 pl-4">
                            {playbook.tasks.map((task) => (
                              <li key={task}>{task}</li>
                            ))}
                          </ol>
                          {playbook.handoff && (
                            <p className="rounded-md bg-muted/50 p-2 text-xs">
                              <strong>Handoff:</strong> {playbook.handoff}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-xl border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-emerald-500" /> Next actions
                </p>
                <Badge variant="outline">{nextActions.length} queued</Badge>
              </div>
              <div className="mt-3 space-y-3">
                {nextActions.map((action) => (
                  <div key={action.id} className="rounded-lg border border-dashed p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{action.label}</p>
                      <Badge
                        className={cn(
                          action.type === "agent"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        )}
                      >
                        {action.type === "agent" ? "Agent" : "Human"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{action.detail}</p>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            onClick={() => onAcknowledge?.(action)}
                          >
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Mark done
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Mark handoff complete</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Workflow auto-updates every hour
          </div>
          <div>*Playbook data and checkpoints are fully mockable for documentation*</div>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentWorkflowPlanner.displayName = "AgentWorkflowPlanner"
