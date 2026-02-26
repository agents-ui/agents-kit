"use client"

import { AgentAnalyticsPulse } from "@/components/agents-ui/agent-analytics-pulse"
import { AgentRevenueInsights } from "@/components/agents-ui/agent-revenue-insights"
import { AgentTaskQueue, type AgentTask } from "@/components/agents-ui/agent-task-queue"
import { AgentOpsMonitor, type IncidentEvent, type OpsServiceMetric, type OpsSignal } from "@/components/agents-ui/agent-ops-monitor"
import { AgentWorkflowPlanner, type WorkflowCheckpoint, type WorkflowPlaybook, type ActionItem } from "@/components/agents-ui/agent-workflow-planner"
import { Badge } from "@/components/ui/badge"

const funnelTasks: AgentTask[] = [
  {
    id: "mf-1",
    title: "Launch onboarding experiment",
    description: "Deploy variant B for signup flow",
    status: "running",
    progress: 62,
    priority: "high",
    estimatedDuration: "~7 min remaining",
    tool: "Experiment agent",
    updatedLabel: "Running • 6 min ago",
  },
  {
    id: "mf-2",
    title: "Produce retargeting creatives",
    description: "Generate video+static for TOFU",
    status: "queued",
    priority: "medium",
    tool: "Creative lab",
  },
  {
    id: "mf-3",
    title: "Update nurture emails",
    description: "Agent Compose awaiting copy approval",
    status: "paused",
    progress: 30,
    priority: "medium",
    tool: "Lifecycle agent",
    updatedLabel: "Paused • awaiting legal",
  },
]

const opsSignals: OpsSignal[] = [
  {
    id: "mf-s1",
    title: "Attribution API latency",
    status: "warning",
    detail: "P95 latency at 820ms versus 600ms target",
    owner: "Agent Atlas",
    lastUpdated: "4m ago",
  },
  {
    id: "mf-s2",
    title: "CRM webhook errors",
    status: "critical",
    detail: "5.4% failures on lead sync · auto-retry enabled",
    owner: "Agent Sync",
    lastUpdated: "1m ago",
  },
]

const opsMetrics: OpsServiceMetric[] = [
  { label: "Signup conversion", value: "12.8%", threshold: "> 11%", trend: "up" },
  { label: "Activation", value: "44.2%", threshold: "> 42%", trend: "up" },
  { label: "Paywall drop-off", value: "28%", threshold: "< 25%", trend: "up" },
]

const opsIncidents: IncidentEvent[] = [
  { id: "mf-i1", timestamp: "08:20", summary: "Retry CRM webhook", actionNeeded: "Monitor failover" },
]

const checkpoints: WorkflowCheckpoint[] = [
  {
    id: "mf-c1",
    title: "Audit funnel drop-offs",
    owner: "Agent Signal",
    eta: "Today 11:00",
    status: "done",
  },
  {
    id: "mf-c2",
    title: "Coordinate creative",
    owner: "Agent Canvas",
    eta: "Today 15:00",
    status: "active",
    notes: "Waiting on copy approval",
  },
  {
    id: "mf-c3",
    title: "Update sales scripts",
    owner: "Agent Relay",
    eta: "Tomorrow 09:30",
    status: "upcoming",
  },
]

const playbooks: WorkflowPlaybook[] = [
  {
    label: "Funnel health",
    description: "Run weekly funnel QA in < 30 min",
    tasks: ["Check data freshness", "Review conversion changes", "Assign follow-ups"],
    handoff: "Growth lead review",
  },
]

const actions: ActionItem[] = [
  {
    id: "mf-a1",
    label: "Approve nurture copy",
    detail: "Agent Compose flagged legal revisions",
    type: "human",
  },
  {
    id: "mf-a2",
    label: "Re-run attribution QA",
    detail: "Agent Atlas rerunning after webhook fix",
    type: "agent",
  },
]

export default function MarketingFunnelCommandCenter() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-2xl border bg-background p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-500">Marketing Funnel</p>
          <h2 className="text-2xl font-semibold tracking-tight">Command Center · Q2 Growth</h2>
          <p className="text-sm text-muted-foreground">Powered by funnel, lifecycle, and analytics agents</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700">Realtime snapshot</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <AgentAnalyticsPulse
          className="w-full"
          title="Funnel health"
          timeframe="Last 14 days"
          metrics={[
            { label: "Visitors", value: "912k", change: "+6.2%", positive: true },
            { label: "Signups", value: "116k", change: "+4.4%", positive: true },
            { label: "Paid conv.", value: "18.2%", change: "+1.8%", positive: true },
          ]}
          trendSeries={[62, 64, 66, 69, 72, 76, 81]}
          attribution={[
            { channel: "Lifecycle", value: 34, color: "#2563eb" },
            { channel: "Paid", value: 27, color: "#9333ea" },
            { channel: "Partnerships", value: 22, color: "#22c55e" },
            { channel: "Product-led", value: 17, color: "#f97316" },
          ]}
          highlights={[
            {
              id: "mf-h1",
              title: "Lifecycle nurtures deliver +3.2 pts",
              detail: "Agent Compose personalized nurture sequence for trials",
              impact: "high",
            },
            {
              id: "mf-h2",
              title: "Paid spend efficiency",
              detail: "Agent Bidder reduced CPA by 11% week-over-week",
              impact: "medium",
            },
          ]}
        />
        <AgentRevenueInsights
          className="w-full"
          currentArr="$3.4M"
          arrChange="+9.4%"
          periodLabel="Pipeline forecast · Next 90 days"
          forecastPoints={[
            { label: "Apr", value: 9.6 },
            { label: "May", value: 10.4 },
            { label: "Jun", value: 11.3 },
            { label: "Jul", value: 12.1 },
            { label: "Aug", value: 12.9 },
            { label: "Sep", value: 13.7 },
          ]}
          segmentInsights={[
            {
              id: "mid-market",
              segment: "Mid-market · Expansion",
              arr: "$1.8M",
              trend: "up",
              change: "+12%",
              confidence: 0.8,
              owner: "Agent Relay",
            },
            {
              id: "self-serve",
              segment: "Self-serve · Upsell",
              arr: "$920k",
              trend: "up",
              change: "+15%",
              confidence: 0.76,
              owner: "Agent Compose",
            },
          ]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <AgentTaskQueue
          className="w-full"
          tasks={funnelTasks}
          autoStart
          concurrencyLimit={2}
          timestamp="Growth backlog"
        />
        <AgentWorkflowPlanner
          className="w-full"
          programName="Weekly growth workflow"
          timeframe="Sprint 17"
          checkpoints={checkpoints}
          playbooks={playbooks}
          nextActions={actions}
        />
      </div>

      <AgentOpsMonitor
        className="w-full"
        environment="Growth stack"
        uptime="99.4%"
        signals={opsSignals}
        metrics={opsMetrics}
        incidents={opsIncidents}
      />
    </div>
  )
}
