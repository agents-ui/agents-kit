import assert from "node:assert/strict"
import test from "node:test"
import * as ReactRuntime from "react"
import { createElement, type ElementType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { AgentAnalyticsPulse } from "../components/agents-ui/agent-analytics-pulse"
import { AgentArtifact } from "../components/agents-ui/agent-artifact"
import { AgentAudioGenerator } from "../components/agents-ui/agent-audio-generator"
import { AgentCard } from "../components/agents-ui/agent-card"
import { AgentChatHistory } from "../components/agents-ui/agent-chat-history"
import { AgentCodeExecutor } from "../components/agents-ui/agent-code-executor"
import { AgentCompetitorResearch } from "../components/agents-ui/agent-competitor-research"
import { AgentDataAnalysis } from "../components/agents-ui/agent-data-analysis"
import { AgentDocScanner } from "../components/agents-ui/agent-doc-scanner"
import { AgentEvaluator } from "../components/agents-ui/agent-evaluator"
import { AgentFeedback } from "../components/agents-ui/agent-feedback"
import { AgentFormGenerator } from "../components/agents-ui/agent-form-generator"
import { AgentGrammarChecker } from "../components/agents-ui/agent-grammar-checker"
import { AgentImageEditor } from "../components/agents-ui/agent-image-editor"
import { AgentInquiry } from "../components/agents-ui/agent-inquiry"
import { AgentOpsMonitor } from "../components/agents-ui/agent-ops-monitor"
import { AgentOrchestrator } from "../components/agents-ui/agent-orchestrator"
import { AgentParallelProcessor } from "../components/agents-ui/agent-parallel-processor"
import { AgentPlanBuilder } from "../components/agents-ui/agent-plan-builder"
import { AgentPromptComposer } from "../components/agents-ui/agent-prompt-composer"
import { AgentResponse } from "../components/agents-ui/agent-response"
import { AgentRevenueInsights } from "../components/agents-ui/agent-revenue-insights"
import { AgentRoutingHub } from "../components/agents-ui/agent-routing-hub"
import { AgentSequentialWorkflow } from "../components/agents-ui/agent-sequential-workflow"
import { AgentSourcesCitations } from "../components/agents-ui/agent-sources-citations"
import { AgentStatusPanel } from "../components/agents-ui/agent-status-panel"
import { AgentTaskQueue } from "../components/agents-ui/agent-task-queue"
import { AgentToolApproval } from "../components/agents-ui/agent-tool-approval"
import { AgentToolPalette } from "../components/agents-ui/agent-tool-palette"
import { AgentVideoEditor } from "../components/agents-ui/agent-video-editor"
import { AgentWebSearch } from "../components/agents-ui/agent-web-search"
import { AgentWorkflowPlanner } from "../components/agents-ui/agent-workflow-planner"
import { FileQueue } from "../components/blocks-so/file-queue"
import { SetupChecklist } from "../components/blocks-so/setup-checklist"
import { TaskTable } from "../components/blocks-so/task-table"
import { WorkspaceComposer } from "../components/blocks-so/workspace-composer"

Object.assign(globalThis, { React: ReactRuntime })

type RenderEntry = {
  name: string
  component: ElementType
  props?: Record<string, unknown>
}

const agentEntries: RenderEntry[] = [
  { name: "AgentAnalyticsPulse", component: AgentAnalyticsPulse },
  { name: "AgentArtifact", component: AgentArtifact },
  { name: "AgentAudioGenerator", component: AgentAudioGenerator },
  {
    name: "AgentCard",
    component: AgentCard,
    props: { name: "Research assistant" },
  },
  {
    name: "AgentChatHistory",
    component: AgentChatHistory,
    props: { sessions: [] },
  },
  { name: "AgentCodeExecutor", component: AgentCodeExecutor },
  { name: "AgentCompetitorResearch", component: AgentCompetitorResearch },
  { name: "AgentDataAnalysis", component: AgentDataAnalysis },
  { name: "AgentDocScanner", component: AgentDocScanner },
  { name: "AgentEvaluator", component: AgentEvaluator },
  { name: "AgentFeedback", component: AgentFeedback },
  { name: "AgentFormGenerator", component: AgentFormGenerator },
  { name: "AgentGrammarChecker", component: AgentGrammarChecker },
  { name: "AgentImageEditor", component: AgentImageEditor },
  { name: "AgentInquiry", component: AgentInquiry },
  { name: "AgentOpsMonitor", component: AgentOpsMonitor },
  { name: "AgentOrchestrator", component: AgentOrchestrator },
  { name: "AgentParallelProcessor", component: AgentParallelProcessor },
  { name: "AgentPlanBuilder", component: AgentPlanBuilder },
  { name: "AgentPromptComposer", component: AgentPromptComposer },
  {
    name: "AgentResponse",
    component: AgentResponse,
    props: { message: "A verified response." },
  },
  { name: "AgentRevenueInsights", component: AgentRevenueInsights },
  { name: "AgentRoutingHub", component: AgentRoutingHub },
  { name: "AgentSequentialWorkflow", component: AgentSequentialWorkflow },
  { name: "AgentSourcesCitations", component: AgentSourcesCitations },
  { name: "AgentStatusPanel", component: AgentStatusPanel },
  { name: "AgentTaskQueue", component: AgentTaskQueue },
  { name: "AgentToolApproval", component: AgentToolApproval },
  {
    name: "AgentToolPalette",
    component: AgentToolPalette,
    props: { tools: [] },
  },
  { name: "AgentVideoEditor", component: AgentVideoEditor },
  { name: "AgentWebSearch", component: AgentWebSearch },
  { name: "AgentWorkflowPlanner", component: AgentWorkflowPlanner },
]

function render(component: ElementType, props: Record<string, unknown> = {}) {
  return renderToStaticMarkup(createElement(component, props))
}

test("all 32 public agent components render from their stable entry points", async (t) => {
  assert.equal(agentEntries.length, 32)
  for (const entry of agentEntries) {
    await t.test(entry.name, () => {
      const html = render(entry.component, entry.props)
      assert.match(html, /^<(article|div|section)/)
      assert.ok(
        html.length > 100,
        `${entry.name} returned an unexpectedly small view`
      )
    })
  }
})

test("tool approval distinguishes default, explicit empty, and supplied requests", () => {
  const fallback = render(AgentToolApproval)
  assert.match(fallback, /Approval required/)

  const empty = render(AgentToolApproval, { pendingApproval: null })
  assert.match(empty, /No approvals waiting/)
  assert.doesNotMatch(empty, /Allow once/)

  const supplied = render(AgentToolApproval, {
    pendingApproval: {
      id: "approval-17",
      toolName: "crm.update_account",
      description: "Update the renewal owner",
      parameters: { scope: "Current workspace", target: "Account 4821" },
      riskLevel: "medium",
      reasoning: "The assigned owner changed in the approved renewal plan.",
    },
    approvalHistory: [],
  })
  assert.match(supplied, /Update the renewal owner/)
  assert.match(supplied, /crm.update_account/)
  assert.match(supplied, /Account 4821/)
  assert.match(supplied, /Decline/)
  assert.match(supplied, /Allow once/)
})

test("artifact keeps supplied content visible while generating a new version", () => {
  const marker = "CUSTOM_ARTIFACT_CONTENT_4821"
  const html = render(AgentArtifact, {
    title: "Renewal analysis",
    artifactType: "document",
    content: marker,
    isGenerating: true,
    versions: [
      {
        id: "v1",
        label: "Initial",
        timestamp: "09:10",
        content: "older content",
      },
    ],
    currentVersion: "v1",
  })
  assert.match(html, new RegExp(marker))
  assert.match(html, /Generating new version/)
  assert.match(html, /Versions/)
  assert.match(html, /Initial/)
})

test("code executor keeps complete prior-run records available for inspection", () => {
  const html = render(AgentCodeExecutor, {
    executionHistory: [
      {
        id: "history-4821",
        code: "print('historical command')",
        output: {
          stdout: "historical standard output",
          stderr: "historical diagnostic",
          exitCode: 2,
          executionTime: "0.42s",
          memoryUsage: "31 MB",
        },
        timestamp: "09:42",
        status: "error",
      },
    ],
  })
  for (const value of [
    "Previous runs",
    "history-4821",
    "historical command",
    "historical standard output",
    "historical diagnostic",
    "Exit 2",
    "0.42s",
    "31 MB",
    "09:42",
    "Failed",
  ]) {
    assert.match(html, new RegExp(value))
  }

  const empty = render(AgentCodeExecutor, { executionHistory: [] })
  assert.doesNotMatch(empty, /Previous runs/)
})

test("evaluator history keeps iteration output, criteria, and feedback together", () => {
  const html = render(AgentEvaluator, {
    iterations: [
      {
        id: "iteration-4",
        number: 4,
        output: "ITERATION_OUTPUT_4821",
        score: 78,
        feedback: "ITERATION_FEEDBACK_4821",
        criteria: [
          { label: "Source fidelity", score: 17, maxScore: 20 },
          { label: "Actionability", score: 14, maxScore: 20 },
        ],
        status: "failed",
      },
    ],
  })
  assert.match(html, /Generator output/)
  assert.match(html, /ITERATION_OUTPUT_4821/)
  assert.match(html, /Evaluation criteria/)
  assert.match(html, /Source fidelity/)
  assert.match(html, /17\/20/)
  assert.match(html, /Actionability/)
  assert.match(html, /Evaluator feedback/)
  assert.match(html, /ITERATION_FEEDBACK_4821/)
})

test("data analysis exposes every supplied metric direction", () => {
  const html = render(AgentDataAnalysis, {
    metrics: [
      {
        label: "Escalations",
        value: "12",
        change: "+3",
        changeDirection: "up",
      },
      {
        label: "Latency",
        value: "420 ms",
        change: "-80 ms",
        changeDirection: "down",
      },
      {
        label: "Coverage",
        value: "94%",
        change: "0 pts",
        changeDirection: "neutral",
      },
    ],
  })
  assert.match(html, /data-direction="up"[^>]*>\+3 · Up/)
  assert.match(html, /data-direction="down"[^>]*>-80 ms · Down/)
  assert.match(html, /data-direction="neutral"[^>]*>0 pts · No change/)
})

test("task queue preserves status labels and distinct task controls", () => {
  const html = render(AgentTaskQueue, {
    tasks: [
      { id: "q", title: "Queued task", status: "queued" },
      { id: "r", title: "Running task", status: "running", progress: 42 },
      { id: "p", title: "Paused task", status: "paused", progress: 19 },
      { id: "f", title: "Failed task", status: "failed" },
      { id: "c", title: "Completed task", status: "completed", progress: 100 },
    ],
  })
  for (const value of [
    "Queued",
    "Running",
    "Paused",
    "Failed",
    "Complete",
    "Start",
    "Pause",
    "Resume",
    "Reset",
  ]) {
    assert.match(html, new RegExp(`>${value}<`))
  }
})

test("disabled workspace composer exposes a disabled send control", () => {
  const html = render(WorkspaceComposer, {
    value: "Prepare the renewal brief",
    onValueChange: () => {},
    onSubmit: () => {},
    model: "balanced",
    models: [{ id: "balanced", label: "Balanced" }],
    onModelChange: () => {},
    disabled: true,
  })
  assert.match(html, /aria-label="Send message"[^>]*disabled=""/)
})

test("all four Blocks.so public compositions render representative states", () => {
  const blocks: RenderEntry[] = [
    {
      name: "WorkspaceComposer",
      component: WorkspaceComposer,
      props: {
        value: "Review this",
        onValueChange: () => {},
        onSubmit: () => {},
        model: "balanced",
        models: [{ id: "balanced", label: "Balanced" }],
        onModelChange: () => {},
      },
    },
    {
      name: "FileQueue",
      component: FileQueue,
      props: {
        files: [
          {
            id: "f1",
            name: "renewals.csv",
            size: "842 KB",
            status: "uploading",
            progress: 62,
          },
        ],
        onFilesSelected: () => {},
        onRemove: () => {},
      },
    },
    {
      name: "SetupChecklist",
      component: SetupChecklist,
      props: {
        title: "Workspace setup",
        steps: [
          {
            id: "s1",
            title: "Add source",
            description: "Attach the approved workbook.",
            completed: false,
          },
        ],
      },
    },
    {
      name: "TaskTable",
      component: TaskTable,
      props: {
        tasks: [
          {
            id: "t1",
            title: "Review accounts",
            status: "in-progress",
            assignee: "Renewal analyst",
          },
        ],
      },
    },
  ]
  for (const entry of blocks) {
    const html = render(entry.component, entry.props)
    assert.ok(
      html.length > 100,
      `${entry.name} returned an unexpectedly small view`
    )
  }
})
