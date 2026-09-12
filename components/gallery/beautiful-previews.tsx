"use client"

import AgentScreen from "@/components/beautiful-ui/original/primitives/AgentScreen"
import ApprovalCard from "@/components/beautiful-ui/original/primitives/ApprovalCard"
import ChatComposer from "@/components/beautiful-ui/original/primitives/ChatComposer"
import CodeBlock, { type DiffRow as CodeDiffRow } from "@/components/beautiful-ui/original/primitives/CodeBlock"
import ContextCards from "@/components/beautiful-ui/original/primitives/ContextCards"
import DiffTable from "@/components/beautiful-ui/original/primitives/DiffTable"
import FilterTable from "@/components/beautiful-ui/original/primitives/FilterTable"
import FineTuneCard from "@/components/beautiful-ui/original/primitives/FineTuneCard"
import Flowchart from "@/components/beautiful-ui/original/primitives/Flowchart"
import InsightCards from "@/components/beautiful-ui/original/primitives/InsightCards"
import LoadingState from "@/components/beautiful-ui/original/primitives/LoadingState"
import PromptBar from "@/components/beautiful-ui/original/primitives/PromptBar"
import RecommendationCard, { type RecommendationOption } from "@/components/beautiful-ui/original/primitives/RecommendationCard"
import RecordsTable, { type RecordRow } from "@/components/beautiful-ui/original/primitives/RecordsTable"
import SearchList from "@/components/beautiful-ui/original/primitives/SearchList"
import SelectionActions from "@/components/beautiful-ui/original/primitives/SelectionActions"
import SidebarNav from "@/components/beautiful-ui/original/primitives/SidebarNav"
import StreamingText, { type StreamingSource, type StreamingToken } from "@/components/beautiful-ui/original/primitives/StreamingText"
import TaskRows, { type TaskRow } from "@/components/beautiful-ui/original/primitives/TaskRows"
import ThinkingState from "@/components/beautiful-ui/original/primitives/ThinkingState"
import ToolChips, { type ToolDiff, type ToolDiffLine, type ToolStep } from "@/components/beautiful-ui/original/primitives/ToolChips"
import * as React from "react"

const publicBase = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")

function Frame({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="beautiful-ui-scope w-full overflow-x-auto text-ink">
      <div className={wide ? "w-full min-w-[680px]" : "flex w-full justify-center"}>{children}</div>
    </div>
  )
}

function Variants({ values, children, wide }: { values: readonly string[]; children: (variant: string) => React.ReactNode; wide?: boolean }) {
  const [variant, setVariant] = React.useState(values[0])
  return (
    <div className="beautiful-ui-scope w-full text-ink">
      <div className={`overflow-x-auto ${wide ? "min-w-[680px]" : "flex justify-center"}`}>{children(variant)}</div>
      <div className="mt-3 flex flex-wrap justify-center gap-1" aria-label="Variants">
        {values.map((value) => (
          <button key={value} type="button" aria-pressed={variant === value} onClick={() => setVariant(value)} className={`h-7 rounded-full px-3 text-xs transition-colors ${variant === value ? "bg-ink text-canvas" : "bg-surface text-ink-2 shadow-btn hover:bg-hover"}`}>
            {value}
          </button>
        ))}
      </div>
    </div>
  )
}

const sourceIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%232f6fec'/%3E%3Cpath d='M15 43 27 31l8 7 14-18' fill='none' stroke='%23fff' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"
const streamingTokens: StreamingToken[] = [
  ..."Four high-value accounts need executive outreach this week. The forecast and account notes agree on the priority order.".split(" ").map((text) => ({ text })),
  { text: "", cite: true },
  ..."Two more accounts need refreshed owner notes before a recommendation is safe.".split(" ").map((text) => ({ text })),
]
const streamingSources: StreamingSource[] = [
  { name: "Renewal forecast", domain: "renewals_q3.csv", href: "#", image: sourceIcon },
  { name: "Account notes", domain: "account-notes.md", href: "#", image: sourceIcon },
]
const toolSteps: ToolStep[] = [
  { icon: "think", label: "Thinking", chip: "Planning the account review…", mono: false, detailMono: false, detail: [{ text: "The forecast identifies twelve accounts below threshold." }, { text: "Owner notes narrow the first outreach group to four." }] },
  { icon: "write", label: "Write 84 lines", chip: "briefing.tsx", mono: true, detailMono: true, detail: [{ text: "+ const priority = accounts.filter((a) => a.risk > 0.7)", tone: "add" }] },
  { icon: "run", label: "Build and verify", chip: "npm test", mono: true, detailMono: true, detail: [{ text: "✓ 34 checks passed" }] },
  { icon: "read", label: "Read table", chip: "renewals_q3.csv", mono: true, detailMono: false, detail: [{ text: "842 rows · current quarter." }] },
]
const toolDiffs: ToolDiff[] = [{ file: "briefing.tsx", add: 24, del: 6 }, { file: "priority.ts", add: 8, del: 2 }]
const toolDiffLines: Record<string, ToolDiffLine[]> = {
  "briefing.tsx": [{ text: "const audience = accounts;", tone: "del" }, { text: "const audience = priorityAccounts;", tone: "add" }],
  "priority.ts": [{ text: "export const threshold = 0.7;", tone: "add" }],
}
const taskRows: TaskRow[] = [
  { key: "verify", label: "Verify renewal records", amount: "842 accounts", status: "done", details: [{ label: "Matched forecast and CRM IDs", meta: "842/842" }] },
  { key: "index", label: "Build priority account list", amount: "12 accounts", status: "running", step: 2, details: [{ label: "Scoring renewal risk", meta: "68%" }] },
  { key: "draft", label: "Draft owner follow-ups", amount: "4 messages", status: "sequence", step: 3, details: [{ label: "Executive outreach", meta: "draft" }] },
]
const recordRows: RecordRow[] = [
  { id: "northwind", name: "Northwind", tags: ["B2B", "Wholesale"], last: "Today", strength: "strong", website: "northwind.example.com" },
  { id: "contoso", name: "Contoso", tags: ["B2B", "Local"], last: "3 days ago", strength: "weak", website: "contoso.example.com" },
  { id: "globex", name: "Globex", tags: ["B2C", "Seasonal"], last: "2 weeks ago", strength: "veryweak", website: "globex.example.com" },
  { id: "initech", name: "Initech", tags: ["B2B"], last: "No contact", strength: "none" },
]
const codeDiff: CodeDiffRow[] = [
  { old: 1, cur: 1, type: "ctx", pieces: [{ text: "export async function prioritizeRenewals() {" }] },
  { old: 2, cur: null, type: "del", pieces: [{ text: "  return getRenewals();" }] },
  { old: null, cur: 2, type: "add", pieces: [{ text: "  return getRenewals({ riskAbove: 0.7 });" }] },
  { old: 3, cur: 3, type: "ctx", pieces: [{ text: "}" }] },
]
const recommendations: RecommendationOption[] = [
  { key: "outreach", body: <>Start with the four accounts below the confidence threshold.</>, short: "Prioritize four at-risk accounts", signal: 3, tone: "var(--green)", label: "High confidence", cta: "Accept", ctaVariant: "accent" },
  { key: "notes", body: <>Refresh owner notes before assigning outreach.</>, short: "Refresh owner notes first", signal: 2, tone: "var(--orange)", label: "Needs review", cta: "Configure", ctaVariant: "primary" },
  { key: "all", body: <>Create a follow-up for every renewal this quarter.</>, short: "Follow up with every account", signal: 0, tone: "var(--ink-3)", label: "No signal", cta: "Accept all", ctaVariant: "primary" },
]

export function LoadingStatePreview() {
  return <Variants values={["Drive", "Dots", "Orbit", "Surfer"]}>{(variant) => <LoadingState variant={variant} label={variant === "Surfer" ? "Reviewing the recording" : "Preparing the workspace"} videoSrc={`${publicBase}/examples/research-screen.mp4`} />}</Variants>
}

export function ThinkingStatePreview() { return <Variants values={["Steps", "Reasoning", "Search", "Coding"]}>{(variant) => <ThinkingState variant={variant} rows={variant === "Search" ? [{ primary: "Renewal playbook", secondary: "docs.example", href: "#" }, { primary: "Account notes", secondary: "workspace", href: "#" }] : variant === "Coding" ? [{ primary: "Read", secondary: "renewals_q3.csv", mono: true }, { primary: "Edit", secondary: "briefing.tsx", mono: true, add: 24, del: 6 }, { primary: "Run", secondary: "npm test", mono: true }] : [{ primary: "Read the renewal forecast" }, { primary: "Compare account health", secondary: "12 accounts" }, { primary: "Draft the priority briefing" }]} />}</Variants> }
export function StreamingTextPreview() { return <Frame><StreamingText content={streamingTokens} sources={streamingSources} followUps={["Show the four priority accounts", "Explain the confidence threshold"]} labels={{ sources: "2 sources", followUps: "Follow-ups" }} /></Frame> }

export function ApprovalCardPreview() {
  return <Frame><ApprovalCard questions={[
    { q: "Which accounts should the agent update?", type: "radio", options: ["At-risk renewals", "All renewals", "One selected account"] },
    { q: "Which actions can it take?", type: "check", options: ["Create follow-ups", "Update due dates", "Notify owners"] },
    { q: "When should the changes run?", type: "radio", options: ["After approval", "Tomorrow morning", "Save as a draft"] },
  ]} /></Frame>
}

export function ToolChipsPreview() { return <Frame><ToolChips steps={toolSteps} diffs={toolDiffs} diffLines={toolDiffLines} /></Frame> }
export function TaskRowsPreview() { return <Variants values={["Capsules", "List"]}>{(variant) => <TaskRows variant={variant} rows={taskRows} />}</Variants> }

export function ChatComposerPreview() {
  return <Frame><ChatComposer suggestions={["Renewals", "Sources"]} labels={{ initialPrompt: "Compare account health with the renewal forecast", placeholder: "Prompt or tag a source with @" }} messages={[
    { label: "Forecast", sub: "Renewal data", time: "4s", body: "Loaded the current forecast and isolated twelve accounts below the confidence threshold." },
    { label: "Comparison", sub: "Account notes", time: "2s", body: "Four high-value accounts need executive outreach this week." },
  ]} /></Frame>
}

export function PromptBarPreview() { return <Variants values={["Rounded", "Pill"]}>{(variant) => <PromptBar variant={variant} placeholder="Ask about the renewal forecast…" />}</Variants> }
export function RecommendationCardPreview() { return <Frame><RecommendationCard options={recommendations} labels={{ title: "Prioritize executive outreach?", alternatives: "Alternatives", otherOptions: "Other approaches", accepted: "Accepted" }} /></Frame> }

export function ContextCardsPreview() {
  return <Frame><ContextCards labels={{ header: "Retrieved context", count: "2" }} chunks={[
    { title: "Renewal forecast", chars: "842 rows", body: "Twelve accounts fall below the confidence threshold for this quarter.", source: "renewals_q3.csv", badge: "CSV", tone: "bg-green" },
    { title: "Account notes", chars: "18 notes", body: "Sponsor coverage is missing for four high-value accounts.", source: "account-notes.md", badge: "MD", tone: "bg-accent" },
  ]} /></Frame>
}

export function DiffTablePreview() {
  return <Frame><DiffTable rows={[
    { key: "northwind", id: "Northwind", dept: "Enterprise", email: "owner@northwind.example", removed: true },
    { key: "contoso", id: "Contoso", dept: "Mid-market", email: "owner@contoso.example", removed: true },
    { key: "globex", id: "Globex", dept: "Enterprise", email: "owner@globex.example", removed: false },
  ]} /></Frame>
}

export function RecordsTablePreview() { return <Frame wide><RecordsTable rows={recordRows} /></Frame> }

export function FilterTablePreview() {
  return <Frame><FilterTable rows={[
    { task: "Review renewal forecast", date: "Today", status: "todo", owner: "Morgan" },
    { task: "Draft account briefing", date: "Friday", status: "progress", owner: "Jordan" },
    { task: "Confirm executive outreach", date: "Monday", status: "done", owner: "Taylor" },
  ]} /></Frame>
}

export function SidebarNavPreview() {
  return <Frame><SidebarNav footerLabel="Workspace settings" recents={[
    { id: "forecast", label: "Renewal forecast" },
    { id: "briefing", label: "Executive briefing" },
    { id: "sources", label: "Source review" },
    { id: "followups", label: "Account follow-ups" },
  ]} /></Frame>
}

export function SearchListPreview() { return <Frame><SearchList items={["Renewal forecast", "Account health notes", "Executive briefing", "Outreach plan", "Source review"]} labels={{ placeholder: "Search workspace…", ariaLabel: "Search workspace", emptyTitle: "No matching items", emptyHint: "Try another account, source, or task." }} /></Frame> }
export function FlowchartPreview() { return <Frame><Flowchart /></Frame> }
export function InsightCardsPreview() { return <Frame><InsightCards labels={{ title: "Account insights" }} /></Frame> }
export function CodeBlockPreview() { return <Variants values={["Code", "Diff"]}>{(variant) => <CodeBlock variant={variant} filename="renewals.ts" code={'const accounts = await getRenewals()\nreturn accounts.filter((account) => account.risk > 0.7)'} lines={["const accounts = await getRenewals()", "return accounts.filter((account) => account.risk > 0.7)"]} diff={codeDiff} />}</Variants> }
export function FineTuneCardPreview() { return <Frame><FineTuneCard labels={{ title: "Result card", layout: "Layout", type: "Type", placeholder: "Select type", adjust: "Adjust", edited: "Edited" }} options={["Summary", "Comparison", "Recommendation"]} /></Frame> }
export function SelectionActionsPreview() { return <Frame><SelectionActions text={{ lead: "Four high-value accounts need executive coverage. ", original: "Contact every account this afternoon.", rewrite: "Start with the four accounts below the confidence threshold, then schedule the remaining follow-ups." }} /></Frame> }
export function AgentScreenPreview() { return <Variants values={["Working", "Loading"]}>{(variant) => <AgentScreen variant={variant} agentName="Research agent" streamSrc={`${publicBase}/screenshots/agents-kit-v02-landing.png`} />}</Variants> }
