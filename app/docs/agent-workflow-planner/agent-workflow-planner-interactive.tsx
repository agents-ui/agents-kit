"use client"

import { useState } from "react"
import {
  AgentWorkflowPlanner,
  type AgentWorkflowPlannerProps,
  type WorkflowCheckpoint,
  type WorkflowPlaybook,
  type ActionItem,
} from "@/components/agents-ui/agent-workflow-planner"

const checkpoints: WorkflowCheckpoint[] = [
  {
    id: "cx-1",
    title: "Map risk signals",
    owner: "Agent Radar",
    eta: "Now",
    status: "active",
    notes: "Pulling churn risk cohorts",
  },
  {
    id: "cx-2",
    title: "Prep outreach sequences",
    owner: "Agent Story",
    eta: "15:30",
    status: "upcoming",
    notes: "Draft sequences for top 50 accounts",
  },
  {
    id: "cx-3",
    title: "Enable playbooks",
    owner: "Agent Relay",
    eta: "Tomorrow",
    status: "upcoming",
  },
]

const playbooks: WorkflowPlaybook[] = [
  {
    label: "Churn mitigation",
    description: "Triage at-risk accounts in < 2h",
    tasks: ["Cluster signals", "Recommend offers", "Sync outreach"],
    handoff: "Human CSM review",
  },
  {
    label: "Expansion prep",
    description: "Prep expansion script + deck",
    tasks: ["Analyze usage", "Draft pricing", "Push slides"],
  },
]

const initialActions: ActionItem[] = [
  {
    id: "cx-action-1",
    label: "Approve outreach copy",
    detail: "Agent Story awaiting legal go-ahead",
    type: "human",
  },
  {
    id: "cx-action-2",
    label: "Generate offer matrix",
    detail: "Agent Ledger building pricing flow",
    type: "agent",
  },
]

export default function AgentWorkflowPlannerInteractive() {
  const [actions, setActions] = useState<ActionItem[]>(initialActions)
  const [lastAcknowledged, setLastAcknowledged] = useState<string | null>(null)

  const handleAcknowledge: AgentWorkflowPlannerProps["onAcknowledge"] = (item) => {
    setLastAcknowledged(item.label)
    setActions((prev) => prev.filter((action) => action.id !== item.id))
  }

  return (
    <div className="space-y-4">
      <AgentWorkflowPlanner
        className="mx-auto max-w-4xl"
        programName="Customer health rescue"
        timeframe="Sprint 14"
        checkpoints={checkpoints}
        playbooks={playbooks}
        nextActions={actions}
        onReplan={() => console.log("Replan CX workflow")}
        onAcknowledge={handleAcknowledge}
      />
      {lastAcknowledged && (
        <p className="text-center text-sm text-muted-foreground">
          Marked complete: {lastAcknowledged}
        </p>
      )}
    </div>
  )
}
