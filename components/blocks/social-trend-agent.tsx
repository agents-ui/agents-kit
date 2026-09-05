"use client"

import { AgentAnalyticsPulse, type PulseMetric, type AttributionSlice, type InsightHighlight } from "@/components/agents-ui/agent-analytics-pulse"
import { AgentTaskQueue, type AgentTask } from "@/components/agents-ui/agent-task-queue"
import { AgentResponse } from "@/components/agents-ui/agent-response"
import { Badge } from "@/components/ui/badge"

const metrics: PulseMetric[] = [
  { label: "Followers", value: "312k", change: "+8.2%", positive: true },
  { label: "Engagement", value: "5.8%", change: "+1.4%", positive: true },
  { label: "Mentions", value: "1.9k", change: "+12%", positive: true },
]

const attribution: AttributionSlice[] = [
  { channel: "Agent threads", value: 42, color: "#1DA1F2" },
  { channel: "Live spaces", value: 26, color: "#60a5fa" },
  { channel: "Creator collabs", value: 18, color: "#9333ea" },
  { channel: "Organic", value: 14, color: "#22c55e" },
]

const highlights: InsightHighlight[] = [
  {
    id: "tw-1",
    title: "AI launch thread reached 1.2M impressions",
    detail: "Agent Compose optimized hook + CTA; retention +43% vs baseline thread.",
    impact: "high",
  },
  {
    id: "tw-2",
    title: "Spaces converted 430 signups",
    detail: "Agent Host coordinated Q&A with design team; signup-to-trial 18%.",
    impact: "medium",
  },
]

const tasks: AgentTask[] = [
  {
    id: "tw-queue-1",
    title: "Draft launch recap thread",
    description: "Summarize launch metrics with carousel",
    status: "running",
    progress: 46,
    priority: "high",
    estimatedDuration: "~5 min remaining",
    tool: "Threadsmith",
    updatedLabel: "Running • 3 min ago",
  },
  {
    id: "tw-queue-2",
    title: "Schedule partner shout-outs",
    description: "Line up co-marketing mentions",
    status: "queued",
    priority: "medium",
    tool: "Scheduler",
    updatedLabel: "Queued behind 1 task",
  },
  {
    id: "tw-queue-3",
    title: "Prep Spaces deck",
    description: "Agent Host needs stories for Friday stream",
    status: "queued",
    priority: "medium",
    tool: "Stories",
  },
]

const trendingTopics = [
  {
    title: "Agent-first launch playbooks",
    summary: "Thread performing 2.1x baseline - highlight automation clips + case studies.",
  },
  {
    title: "Design AMA snippets",
    summary: "Clipped from Spaces, trending under #buildinpublic. Repurpose into carousel.",
  },
  {
    title: "Customer wins",
    summary: "Agent stitched 7 testimonials; schedule as quote-tweet series tomorrow.",
  },
]

export default function SocialTrendAgent() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-2xl border bg-background p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-500">Social Pulse</p>
          <h2 className="text-2xl font-semibold tracking-tight">Twitter agent · Week-at-a-glance</h2>
          <p className="text-sm text-muted-foreground">Sources: Agent Compose, Agent Host, Creator CRM</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">Live · refreshed 5m ago</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <AgentAnalyticsPulse
          className="w-full"
          title="Audience growth"
          timeframe="Last 7 days"
          metrics={metrics}
          trendSeries={[58, 62, 64, 69, 71, 75, 79]}
          attribution={attribution}
          highlights={highlights}
          segmentFilter="All"
        />

        <AgentTaskQueue
          className="w-full"
          tasks={tasks}
          autoStart
          concurrencyLimit={2}
          timestamp="Content queue"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4 rounded-xl border bg-background p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Trending threads</h3>
            <Badge variant="outline">Monitored by Agent Radar</Badge>
          </div>
          <div className="space-y-3">
            {trendingTopics.map((topic) => (
              <div key={topic.title} className="rounded-lg border border-dashed p-3">
                <p className="text-sm font-medium text-foreground">{topic.title}</p>
                <p className="text-xs text-muted-foreground">{topic.summary}</p>
              </div>
            ))}
          </div>
        </div>
        <AgentResponse
          className="h-full border border-dashed"
          message={`### What to post next
1. Thread recap of Spaces highlights with video snippets.
2. Customer win carousel scheduled for Wednesday 10AM PST.
3. AMA follow-up tweet storm featuring 3 design tips.
          `}
          thinking="Cross-reference trending topics, backlog tasks, and engagement lift before summarizing."
        />
      </div>
    </div>
  )
}
