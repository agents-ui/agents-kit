"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cn } from "@/lib/utils"
import { ChevronDown, RefreshCw } from "lucide-react"
import * as React from "react"

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
const checkpointDefaults: WorkflowCheckpoint[] = [
  {
    id: "scope",
    title: "Confirm requirements",
    owner: "Product team",
    eta: "Due today",
    status: "done",
    notes: "Validated against customer requests",
  },
  {
    id: "design",
    title: "Review design handoff",
    owner: "Design team",
    eta: "12:30 PM",
    status: "active",
    notes: "Review updated interaction notes",
  },
  {
    id: "enablement",
    title: "Prepare enablement",
    owner: "Operations",
    eta: "Tomorrow",
    status: "upcoming",
    notes: "Prepare launch documentation",
  },
]
const playbookDefaults: WorkflowPlaybook[] = [
  {
    label: "Agent onboarding",
    description: "Configure and validate a new agent",
    tasks: [
      "Provision credentials",
      "Sync policies",
      "Validate prompt behavior",
    ],
    handoff: "Human quality review",
  },
  {
    label: "Lifecycle announcement",
    description: "Prepare and schedule product communication",
    tasks: ["Draft copy", "Review localization", "Schedule rollout"],
  },
]
const actionDefaults: ActionItem[] = [
  {
    id: "design",
    label: "Upload annotated design document",
    detail: "The review is waiting for updated callouts",
    type: "human",
  },
  {
    id: "pricing",
    label: "Approve pricing adjustments",
    detail: "Three options are ready for review",
    type: "human",
  },
  {
    id: "email",
    label: "Generate onboarding email",
    detail: "A copy draft is queued",
    type: "agent",
  },
]
const statusText: Record<WorkflowCheckpoint["status"], string> = {
  upcoming: "Upcoming",
  active: "Active",
  done: "Complete",
}
const statusTone: Record<WorkflowCheckpoint["status"], string> = {
  upcoming: "text-text-secondary",
  active: "text-accent-600",
  done: "text-green-600",
}
export function WorkflowPlanner({
  programName = "Launch readiness",
  timeframe = "Week of March 17",
  checkpoints = checkpointDefaults,
  playbooks = playbookDefaults,
  nextActions = actionDefaults,
  onReplan,
  onAcknowledge,
  className,
}: AgentWorkflowPlannerProps) {
  const [expanded, setExpanded] = React.useState<string | undefined>(
    playbooks[0]?.label
  )
  return (
    <section
      className={cn(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-text-secondary text-xs font-medium">{timeframe}</p>
          <h2 className="text-text-primary mt-1 text-lg font-semibold">
            {programName}
          </h2>
          <p className="text-text-secondary mt-1 text-sm">
            Review milestones, reusable procedures, and the next required
            decisions.
          </p>
        </div>
        <Button
          size="small"
          variant="secondary"
          leadingIcon={RefreshCw}
          onClick={onReplan}
        >
          Replan
        </Button>
      </header>
      <div>
        {checkpoints.map((item, index) => (
          <article
            key={item.id}
            className="border-separator-border grid grid-cols-[2rem_1fr_auto] gap-3 border-b px-4 py-3"
          >
            <span className="text-text-secondary text-xs">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="flex flex-wrap gap-x-3">
                <h3 className="text-text-primary text-sm font-medium">
                  {item.title}
                </h3>
                <span className={cn("text-xs", statusTone[item.status])}>
                  {statusText[item.status]}
                </span>
              </div>
              <p className="text-text-secondary mt-1 text-xs">{item.notes}</p>
            </div>
            <div className="text-right text-xs">
              <p className="text-text-primary">{item.owner}</p>
              <p className="text-text-secondary mt-1">{item.eta}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="grid lg:grid-cols-2">
        <div className="border-separator-border border-b p-4 lg:border-r lg:border-b-0">
          <p className="text-text-primary text-sm font-medium">Playbooks</p>
          <div className="divide-separator-border bg-background-secondary-default mt-3 divide-y rounded-lg px-3">
            {playbooks.map((playbook) => (
              <div key={playbook.label}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 py-2.5 text-left"
                  aria-expanded={expanded === playbook.label}
                  onClick={() =>
                    setExpanded(
                      expanded === playbook.label ? undefined : playbook.label
                    )
                  }
                >
                  <span>
                    <strong className="text-text-primary block text-xs font-medium">
                      {playbook.label}
                    </strong>
                    <span className="text-text-secondary mt-1 block text-xs">
                      {playbook.description}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "text-text-secondary size-3.5",
                      expanded === playbook.label && "rotate-180"
                    )}
                  />
                </button>
                {expanded === playbook.label && (
                  <div className="pb-3">
                    <ol className="text-text-secondary space-y-1.5 text-xs">
                      {playbook.tasks.map((task, index) => (
                        <li key={task}>
                          {index + 1}. {task}
                        </li>
                      ))}
                    </ol>
                    {playbook.handoff && (
                      <p className="border-separator-border text-text-secondary mt-2 border-t pt-2 text-xs">
                        Handoff: {playbook.handoff}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4">
          <p className="text-text-primary text-sm font-medium">Next actions</p>
          <div className="divide-separator-border mt-3 divide-y">
            {nextActions.map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-text-primary text-xs font-medium">
                    {item.label}
                  </p>
                  <p className="text-text-secondary mt-1 text-xs">
                    {item.detail}
                  </p>
                </div>
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => onAcknowledge?.(item)}
                >
                  {item.type === "human" ? "Review" : "Start"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
