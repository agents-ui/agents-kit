"use client"

import { AgentScreen } from "@/components/beautiful-ui/agent-screen"
import {
  ApprovalCard,
  type ApprovalAnswer,
} from "@/components/beautiful-ui/approval-card"
import {
  ChatComposer,
  type ChatMessage,
} from "@/components/beautiful-ui/chat-composer"
import { CodeBlock } from "@/components/beautiful-ui/code-block"
import { ContextCards } from "@/components/beautiful-ui/context-cards"
import {
  DiffTable,
  type DiffTableRow,
} from "@/components/beautiful-ui/diff-table"
import {
  FilterTable,
  type FilterStatus,
} from "@/components/beautiful-ui/filter-table"
import { FineTuneCard } from "@/components/beautiful-ui/fine-tune-card"
import {
  Flowchart,
  type FlowchartNode,
} from "@/components/beautiful-ui/flowchart"
import { InsightCards } from "@/components/beautiful-ui/insight-cards"
import { LoadingState } from "@/components/beautiful-ui/loading-state"
import { PromptBar } from "@/components/beautiful-ui/prompt-bar"
import { RecommendationCard } from "@/components/beautiful-ui/recommendation-card"
import { RecordsTable } from "@/components/beautiful-ui/records-table"
import { SearchList } from "@/components/beautiful-ui/search-list"
import { SelectionActions } from "@/components/beautiful-ui/selection-actions"
import { SidebarNav } from "@/components/beautiful-ui/sidebar-nav"
import { StreamingText } from "@/components/beautiful-ui/streaming-text"
import { TaskRows } from "@/components/beautiful-ui/task-rows"
import {
  ThinkingState,
  type ThinkingRow,
} from "@/components/beautiful-ui/thinking-state"
import { ToolChips } from "@/components/beautiful-ui/tool-chips"
import { Button } from "@/components/boardui/base/buttons/button"
import * as React from "react"

const rows: ThinkingRow[] = [
  {
    id: "1",
    label: "Read renewal workbook",
    detail: "842 rows loaded",
    status: "complete",
  },
  {
    id: "2",
    label: "Compare account health",
    detail: "12 accounts require review",
    status: "running",
  },
  { id: "3", label: "Draft action plan", status: "pending" },
]
const publicBase = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
function VariantFrame<T extends string>({
  options,
  value,
  onChange,
  children,
}: {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[260px] flex-col">
      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        <div className="w-full max-w-[560px]">{children}</div>
      </div>
      <div className="flex flex-wrap justify-center gap-1 pt-4">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            size="xs"
            variant={value === option ? "secondary" : "ghost"}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            <span className="capitalize">{option}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
export function LoadingStatePreview() {
  const [startTime] = React.useState(() => Date.now())
  const [variant, setVariant] = React.useState<
    "drive" | "dots" | "orbit" | "surfer"
  >("drive")
  return (
    <VariantFrame
      options={["drive", "dots", "orbit", "surfer"] as const}
      value={variant}
      onChange={setVariant}
    >
      <div className="flex justify-center">
        <LoadingState
          variant={variant}
          label={
            variant === "surfer"
              ? "Reviewing screen recording"
              : "Preparing workspace"
          }
          startTime={startTime}
          mediaUrl={
            variant === "surfer"
              ? `${publicBase}/examples/research-screen.mp4`
              : undefined
          }
        />
      </div>
    </VariantFrame>
  )
}
export function ApprovalCardPreview() {
  const [step, setStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, ApprovalAnswer>>({
    owner: "Account owner",
    scope: ["Create tasks"],
  })
  const [submitted, setSubmitted] = React.useState(false)
  const [status, setStatus] = React.useState("Complete the review")
  const questions = [
    {
      id: "owner",
      label: "Default owner",
      type: "text" as const,
      required: true,
      placeholder: "Enter an owner",
    },
    {
      id: "priority",
      label: "Task priority",
      type: "radio" as const,
      options: ["High", "Normal", "Low"],
      required: true,
    },
    {
      id: "scope",
      label: "Allowed changes",
      type: "check" as const,
      options: ["Create tasks", "Update due dates", "Notify owners"],
      required: true,
    },
  ]
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <ApprovalCard
        title="Review task creation"
        description="Confirm the proposed account follow-ups."
        questions={questions}
        currentStep={step}
        answers={answers}
        submitted={submitted}
        onStepChange={setStep}
        onBack={setStep}
        onAnswerChange={(id, value) =>
          setAnswers((current) => ({ ...current, [id]: value }))
        }
        onSkip={(id) => setStatus(`Skipped ${id}`)}
        onDecline={() => setStatus("Request declined")}
        onSubmit={() => {
          setSubmitted(true)
          setStatus("Answers submitted")
        }}
      />
      <p className="text-text-secondary text-center text-xs">{status}</p>
    </div>
  )
}
export function ThinkingStatePreview() {
  const [variant, setVariant] = React.useState<
    "steps" | "reasoning" | "search" | "coding"
  >("search")
  const [expanded, setExpanded] = React.useState(true)
  const [tool, setTool] = React.useState<string | undefined>("edit")
  return (
    <VariantFrame
      options={["steps", "reasoning", "search", "coding"] as const}
      value={variant}
      onChange={setVariant}
    >
      <div className="mx-auto max-w-xl">
        <ThinkingState
          variant={variant}
          rows={rows}
          query="Open-source agent interface components"
          reasoning={[
            "Compare the public component APIs and their interaction states.",
            "Keep each distinct capability while combining overlapping presentation variants.",
          ]}
          expanded={expanded}
          onExpandedChange={setExpanded}
          selectedToolId={tool}
          onToolSelect={setTool}
          codeTools={[
            {
              id: "read",
              action: "read",
              target: "renewals_q3.csv",
              detail: "842 rows loaded",
            },
            {
              id: "edit",
              action: "edit",
              target: "briefing.md",
              additions: 24,
              deletions: 6,
              detail: "Updated the priority account section.",
            },
            {
              id: "run",
              action: "run",
              target: "validate-briefing",
              detail: "Validation passed.",
            },
          ]}
          sources={[
            {
              id: "beautiful",
              title: "Beautiful UI",
              domain: "beautifului.dev",
              href: "https://www.beautifului.dev",
            },
            {
              id: "beui",
              title: "BeUI components",
              domain: "beui.dev",
              href: "https://beui.dev",
            },
          ]}
        />
      </div>
    </VariantFrame>
  )
}
export function StreamingTextPreview() {
  const text =
    "The public references cover thinking, approvals, tools, and structured outputs. The components share one control foundation and preserve their source attribution."
  const tokens = React.useMemo(
    () => text.split(/(?<=\s)/).map((text) => ({ text })),
    [text]
  )
  const [visible, setVisible] = React.useState(0)
  const streaming = visible < tokens.length
  React.useEffect(() => {
    if (!streaming) return
    const timer = window.setInterval(
      () => setVisible((value) => Math.min(tokens.length, value + 1)),
      100
    )
    return () => window.clearInterval(timer)
  }, [streaming, tokens.length])
  const [status, setStatus] = React.useState("Ready for review")
  const [attempt, setAttempt] = React.useState(1)
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <StreamingText
        tokens={tokens}
        visibleTokenCount={visible}
        isStreaming={streaming}
        onComplete={() => setStatus("Ready for review")}
        sources={[
          {
            name: "Beautiful UI",
            domain: "beautifului.dev",
            href: "https://www.beautifului.dev",
          },
        ]}
        followUps={["Compare the component approaches"]}
        onCopy={() => setStatus("Response copied")}
        onRetry={() => {
          setAttempt((value) => value + 1)
          setStatus("Generating response")
          setVisible(0)
        }}
        onFeedback={(value) =>
          setStatus(value === "up" ? "Marked helpful" : "Marked for review")
        }
        onFollowUp={(value) => setStatus(`Follow-up selected: ${value}`)}
      >
        {text}
      </StreamingText>
      <p className="text-text-secondary text-center text-xs">
        {status} | Version {attempt}
      </p>
    </div>
  )
}
export function ToolChipsPreview() {
  const [open, setOpen] = React.useState("1")
  return (
    <ToolChips
      className="mx-auto w-full max-w-[560px]"
      steps={[
        {
          id: "1",
          label: "Read renewals_q3.csv",
          detail: "842 records",
          status: "complete",
          chip: "renewals_q3.csv",
        },
        {
          id: "2",
          label: "Edit briefing",
          status: "running",
          chip: "briefing.md",
          additions: 24,
          deletions: 6,
        },
      ]}
      expandedId={open}
      onToggle={setOpen}
      diffs={[
        {
          file: "briefing.md",
          additions: 24,
          deletions: 6,
          lines: ["- General follow-up", "+ Executive outreach this week"],
        },
      ]}
    />
  )
}
export function TaskRowsPreview() {
  const [variant, setVariant] = React.useState<"capsules" | "list">("capsules")
  const [selected, setSelected] = React.useState("2")
  return (
    <VariantFrame
      options={["capsules", "list"] as const}
      value={variant}
      onChange={setVariant}
    >
      <TaskRows
        variant={variant}
        onSelect={setSelected}
        expandedId={selected}
        tasks={[
          {
            id: "1",
            title: "Read workbook",
            status: "complete",
            meta: "842 rows",
          },
          {
            id: "2",
            title: "Compare health",
            status: "running",
            meta: "12 accounts",
            progress: 68,
            details: [
              { label: "Current action", meta: "Comparing health signals" },
            ],
          },
          {
            id: "3",
            title: "Draft action plan",
            status: "pending",
            meta: "Waiting",
          },
        ]}
      />
      <p className="text-text-secondary mt-2 text-center text-xs">
        Selected task {selected}
      </p>
    </VariantFrame>
  )
}
export function ChatComposerPreview() {
  const [value, setValue] = React.useState("")
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "1",
      role: "user",
      content: "Summarize the research and show the next decision.",
    },
    {
      id: "2",
      role: "assistant",
      content:
        "The comparison is ready. Two approaches meet the requirements, with different rollout costs.",
    },
    {
      id: "3",
      role: "assistant",
      content:
        "Review the tradeoffs before choosing an approach. The source brief is attached to the result.",
    },
  ])
  const [tab, setTab] = React.useState("Workspace")
  return (
    <ChatComposer
      className="mx-auto w-full max-w-[560px]"
      messages={
        tab === "Sources"
          ? [
              {
                id: "sources",
                role: "assistant",
                content:
                  "Source brief: public documentation, interface references, and the current design requirements.",
              },
            ]
          : messages
      }
      value={value}
      onValueChange={setValue}
      tabs={["Workspace", "Sources"]}
      activeTab={tab}
      onTabChange={setTab}
      onSubmit={(text) => {
        setMessages((current) => [
          ...current,
          { id: String(current.length + 1), role: "user", content: text },
        ])
        setValue("")
      }}
    />
  )
}
export function PromptBarPreview() {
  const [value, setValue] = React.useState("")
  const [variant, setVariant] = React.useState<"rounded" | "pill">("rounded")
  const [model, setModel] = React.useState("balanced")
  const [listening, setListening] = React.useState(false)
  const [running, setRunning] = React.useState(false)
  const [status, setStatus] = React.useState(
    "Choose a source, command, or model"
  )
  return (
    <VariantFrame
      options={["rounded", "pill"] as const}
      value={variant}
      onChange={setVariant}
    >
      <PromptBar
        variant={variant}
        value={value}
        onValueChange={setValue}
        onSubmit={(text) => {
          setStatus(`Submitted: ${text}`)
          setRunning(true)
        }}
        onAttach={() => setStatus("Attachment picker requested")}
        sources={[
          { id: "renewals", label: "renewals_q3.csv", description: "842 rows" },
          { id: "notes", label: "account notes", description: "CRM source" },
        ]}
        commands={[
          {
            id: "summarize",
            label: "summarize",
            description: "Create a concise brief",
          },
          {
            id: "compare",
            label: "compare",
            description: "Compare account risk",
          },
        ]}
        models={[
          { id: "balanced", label: "Balanced" },
          { id: "fast", label: "Fast" },
        ]}
        selectedModel={model}
        onModelChange={(id) => {
          setModel(id)
          setStatus(`Model selected: ${id}`)
        }}
        onSourceSelect={(source) =>
          setStatus(`Source selected: ${source.label}`)
        }
        onCommandSelect={(command) =>
          setStatus(`Command selected: ${command.label}`)
        }
        isListening={listening}
        onDictationToggle={() => {
          setListening((active) => !active)
          setStatus(listening ? "Dictation stopped" : "Dictation started")
        }}
        isRunning={running}
        onStop={() => {
          setRunning(false)
          setStatus("Generation stopped")
        }}
      />
      <p className="text-text-secondary mt-2 text-center text-xs">{status}</p>
    </VariantFrame>
  )
}
export function RecommendationCardPreview() {
  const [result, setResult] = React.useState("Choose a recommendation")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <RecommendationCard
        title="Prioritize executive outreach"
        description="Begin with the four highest-value accounts that lack sponsor coverage."
        confidence={0.91}
        alternatives={[
          {
            id: "adoption",
            label: "Start with adoption recovery",
            description: "Prioritize accounts with the sharpest usage decline.",
          },
          {
            id: "sponsors",
            label: "Start with sponsor coverage",
            description: "Prioritize accounts without an executive sponsor.",
          },
        ]}
        onAccept={() => setResult("Recommendation accepted")}
        onSelectAlternative={(id) => setResult(`Alternative selected: ${id}`)}
      />
      <p className="text-text-secondary text-center text-xs">{result}</p>
    </div>
  )
}
export function ContextCardsPreview() {
  const [selected, setSelected] = React.useState("1")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <ContextCards
        selectedId={selected}
        onSelect={setSelected}
        chunks={[
          {
            id: "1",
            title: "Renewal forecast",
            source: "renewals_q3.csv",
            content: "Twelve accounts fall below the confidence threshold.",
            score: 0.96,
          },
          {
            id: "2",
            title: "Account notes",
            source: "CRM",
            content: "Sponsor coverage is missing for two high-value accounts.",
            score: 0.9,
          },
        ]}
      />
      <p className="text-text-secondary text-center text-xs">
        Selected source {selected}
      </p>
    </div>
  )
}
export function DiffTablePreview() {
  const [rows, setRows] = React.useState<DiffTableRow[]>([
    {
      id: "1",
      field: "Owner",
      before: "Unassigned",
      after: "Morgan Lee",
      status: "pending" as const,
    },
    {
      id: "2",
      field: "Due date",
      before: "None",
      after: "Friday",
      status: "pending" as const,
    },
  ])
  const decide = (id: string, status: "accepted" | "rejected") =>
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, status } : row))
    )
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <DiffTable
        rows={rows}
        onAccept={(id) => decide(id, "accepted")}
        onReject={(id) => decide(id, "rejected")}
        onApplyAll={() =>
          setRows((current) =>
            current.map((row) => ({ ...row, status: "accepted" as const }))
          )
        }
      />
      <p className="text-text-secondary text-center text-xs">
        {rows.filter((row) => row.status === "accepted").length} accepted |{" "}
        {rows.filter((row) => row.status === "rejected").length} rejected
      </p>
    </div>
  )
}
const recordFixtures = [
  {
    id: "1",
    name: "Northwind",
    categories: ["Enterprise"],
    updated: "Today",
    strength: "At risk",
    links: 8,
  },
  {
    id: "2",
    name: "Acme Health",
    categories: ["Healthcare"],
    updated: "Yesterday",
    strength: "Watch",
    links: 5,
  },
]
export function RecordsTablePreview() {
  const [sortKey, setSortKey] =
    React.useState<keyof (typeof recordFixtures)[number]>("name")
  const [direction, setDirection] = React.useState<"asc" | "desc">("asc")
  const [selected, setSelected] = React.useState("1")
  const records = [...recordFixtures].sort(
    (left, right) =>
      String(left[sortKey] ?? "").localeCompare(String(right[sortKey] ?? "")) *
      (direction === "asc" ? 1 : -1)
  )
  const sort = (key: keyof (typeof recordFixtures)[number]) => {
    if (key === sortKey)
      setDirection((value) => (value === "asc" ? "desc" : "asc"))
    else {
      setSortKey(key)
      setDirection("asc")
    }
  }
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <RecordsTable
        records={records}
        sortKey={sortKey}
        sortDirection={direction}
        onSort={sort}
        onSelect={setSelected}
      />
      <p className="text-text-secondary text-center text-xs">
        Selected record {selected}
      </p>
    </div>
  )
}
export function FilterTablePreview() {
  const [filter, setFilter] = React.useState<FilterStatus | "all">("all")
  return (
    <FilterTable
      className="mx-auto w-full max-w-[560px]"
      filter={filter}
      onFilterChange={setFilter}
      rows={[
        {
          id: "1",
          task: "Review forecast",
          date: "Today",
          status: "done",
          owner: "Morgan",
        },
        {
          id: "2",
          task: "Draft briefing",
          date: "Friday",
          status: "progress",
          owner: "Jordan",
        },
      ]}
    />
  )
}
export function SidebarNavPreview() {
  const [active, setActive] = React.useState("1")
  const [status, setStatus] = React.useState("Briefing selected")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <SidebarNav
        title="Renewal workspace"
        items={[
          { id: "1", label: "Briefing" },
          { id: "2", label: "Sources", count: 4 },
          { id: "3", label: "Tasks", count: 12 },
        ]}
        activeId={active}
        onSelect={(id) => {
          setActive(id)
          setStatus(`Section ${id} selected`)
        }}
        onSearch={(value) =>
          setStatus(value ? `Searching for ${value}` : "Search cleared")
        }
        onSettings={() => setStatus("Workspace settings opened")}
      />
      <p className="text-text-secondary text-center text-xs">{status}</p>
    </div>
  )
}
export function SearchListPreview() {
  const [value, setValue] = React.useState("")
  const [selected, setSelected] = React.useState("No result selected")
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <SearchList
        value={value}
        onValueChange={setValue}
        onSelect={(id) => setSelected(`Selected ${id}`)}
        items={[
          {
            id: "1",
            label: "Q3 renewal forecast",
            description: "CSV document",
          },
          { id: "2", label: "Account health notes", description: "CRM source" },
        ]}
      />
      <p className="text-text-secondary mt-2 text-center text-xs">{selected}</p>
    </div>
  )
}
const flowNodes: FlowchartNode[] = [
  {
    id: "1",
    label: "New renewal review",
    detail: "Workspace trigger",
    kind: "Trigger",
    x: 70,
    y: 34,
    status: "complete",
  },
  {
    id: "2",
    label: "Renewal value exceeds threshold",
    kind: "If / Else",
    x: 320,
    y: 150,
    status: "running",
    condition: { field: "renewal_value", operator: ">", value: "250000" },
  },
  {
    id: "3",
    label: "Draft action plan",
    kind: "Action",
    x: 70,
    y: 260,
    status: "pending",
  },
]
export function FlowchartPreview() {
  const [nodes, setNodes] = React.useState(
    flowNodes.map((node) => ({ ...node }))
  )
  const [status, setStatus] = React.useState("Select or move a node")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2 overflow-x-auto">
      <Flowchart
        nodes={nodes}
        edges={[
          { from: "1", to: "2" },
          { from: "2", to: "3" },
        ]}
        onSelect={(id) => setStatus(`Node ${id} selected`)}
        onNodeMove={(id, position) => {
          setNodes((current) =>
            current.map((node) =>
              node.id === id ? { ...node, ...position } : node
            )
          )
          setStatus(`Node ${id} moved`)
        }}
        onConditionChange={(id, condition) => {
          setNodes((current) =>
            current.map((node) =>
              node.id === id ? { ...node, condition } : node
            )
          )
          setStatus(`Condition ${id} updated`)
        }}
      />
      <p className="text-text-secondary text-center text-xs">{status}</p>
    </div>
  )
}
export function InsightCardsPreview() {
  const [selected, setSelected] = React.useState("1")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <InsightCards
        onSelect={setSelected}
        insights={[
          {
            id: "1",
            title: "At-risk value",
            description: "Value across 12 accounts",
            value: "$1.84M",
            kind: "compare",
            series: [42, 55, 51, 68],
          },
          {
            id: "2",
            title: "Sponsor gap",
            description: "Two high-value accounts lack coverage",
            value: "2",
            kind: "anomaly",
            series: [3, 2, 4, 2],
          },
          {
            id: "3",
            title: "Risk allocation",
            description: "Share requiring action this week",
            value: "33%",
            kind: "allocation",
            series: [18, 22, 29, 33],
          },
        ]}
      />
      <p className="text-text-secondary text-center text-xs">
        Selected insight {selected}
      </p>
    </div>
  )
}
export function CodeBlockPreview() {
  const [variant, setVariant] = React.useState<"code" | "diff">("code")
  const [copied, setCopied] = React.useState(false)
  const code =
    variant === "code"
      ? 'at_risk = renewals.query("risk_score >= 0.7")\nprint(at_risk.shape)'
      : '- owner = None\n+ owner = "Morgan Lee"'
  return (
    <VariantFrame
      options={["code", "diff"] as const}
      value={variant}
      onChange={setVariant}
    >
      <CodeBlock
        variant={variant}
        language={variant === "code" ? "python" : "diff"}
        code={code}
        onCopy={() => {
          void navigator.clipboard?.writeText(code)
          setCopied(true)
        }}
      />
      <p className="text-text-secondary mt-2 text-center text-xs">
        {copied ? "Code copied" : "Copy the visible code"}
      </p>
    </VariantFrame>
  )
}
export function FineTuneCardPreview() {
  const [values, setValues] = React.useState({
    tone: "Direct",
    length: "Short",
  })
  const [status, setStatus] = React.useState("Adjust response settings")
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <FineTuneCard
        title="Fine-tune response"
        fields={[
          {
            id: "tone",
            label: "Tone",
            value: values.tone,
            options: ["Direct", "Detailed"],
          },
          {
            id: "length",
            label: "Length",
            value: values.length,
            options: ["Short", "Long"],
          },
        ]}
        onChange={(id, value) =>
          setValues((current) => ({ ...current, [id]: String(value) }))
        }
        onApply={() =>
          setStatus(
            `Applied ${values.tone.toLowerCase()}, ${values.length.toLowerCase()}`
          )
        }
        onReset={() => {
          setValues({ tone: "Direct", length: "Short" })
          setStatus("Settings reset")
        }}
      />
      <p className="text-text-secondary mt-2 text-center text-xs">{status}</p>
    </div>
  )
}
export function SelectionActionsPreview() {
  const [result, setResult] = React.useState("")
  return (
    <SelectionActions
      className="mx-auto w-full max-w-[560px]"
      selectedText="The accounts may need outreach."
      actions={[
        { id: "specific", label: "Make specific" },
        { id: "shorter", label: "Shorten" },
      ]}
      result={result}
      onAction={() =>
        setResult("Four accounts need executive outreach this week.")
      }
      onReplace={(value) => setResult(`Replacement applied: ${value}`)}
    />
  )
}
export function AgentScreenPreview() {
  const [variant, setVariant] = React.useState<"working" | "loading">("working")
  const [expanded, setExpanded] = React.useState(false)
  const [recording, setRecording] = React.useState(false)
  const [paused, setPaused] = React.useState(false)
  const [mediaType, setMediaType] = React.useState<"image" | "video">("image")
  const [status, setStatus] = React.useState("Screen ready")
  return (
    <VariantFrame
      options={["working", "loading"] as const}
      value={variant}
      onChange={(next) => {
        setVariant(next)
        if (next === "loading") {
          setRecording(false)
          setPaused(false)
          setStatus("Connecting to screen")
        } else setStatus("Screen ready")
      }}
    >
      <div className="mx-auto max-w-xl">
        <AgentScreen
          variant={variant}
          title={
            variant === "working"
              ? "Preparing renewal briefing"
              : "Loading workspace"
          }
          steps={
            variant === "working"
              ? rows
              : [{ id: "11", label: "Loading sources", status: "running" }]
          }
          expanded={expanded}
          recording={recording}
          paused={paused}
          recordingElapsed={recording ? "00:12" : undefined}
          mediaType={mediaType}
          mediaSrc={
            variant === "working"
              ? `${publicBase}/examples/research-screen.${mediaType === "video" ? "mp4" : "jpg"}`
              : undefined
          }
          onExpandedChange={(open) => {
            setExpanded(open)
            setStatus(open ? "Screen expanded" : "Screen collapsed")
          }}
          onStartRecording={() => {
            setRecording(true)
            setPaused(false)
            setStatus("Recording started")
          }}
          onEndRecording={() => {
            setRecording(false)
            setPaused(false)
            setStatus("Recording saved")
          }}
          onPause={() => {
            setPaused(true)
            setStatus("Recording paused")
          }}
          onResume={() => {
            setPaused(false)
            setStatus("Recording resumed")
          }}
        />
        {variant === "working" && (
          <div className="mt-2 flex items-center justify-center gap-1">
            <Button
              size="xs"
              variant={mediaType === "image" ? "secondary" : "ghost"}
              onClick={() => setMediaType("image")}
            >
              Image
            </Button>
            <Button
              size="xs"
              variant={mediaType === "video" ? "secondary" : "ghost"}
              onClick={() => setMediaType("video")}
            >
              Video
            </Button>
            <span className="text-text-secondary ml-2 text-xs">{status}</span>
          </div>
        )}
      </div>
    </VariantFrame>
  )
}
