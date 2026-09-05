"use client"

import {
  AgentChatHistory,
  type ChatSession,
} from "@/components/agents-ui/agent-chat-history"
import {
  AgentGrammarChecker,
  type GrammarIssue,
} from "@/components/agents-ui/agent-grammar-checker"
import {
  AgentToolkit,
  type AgentTool,
} from "@/components/agents-ui/agent-tool-palette"
import {
  AgentWebSearch,
  type SearchResult,
} from "@/components/agents-ui/agent-web-search"
import { Database, FileSearch, Globe, MessageSquareText } from "lucide-react"
import * as React from "react"

const syntheticNote = (
  message: string
) => <p className="mb-3 text-caption-1-regular text-text-tertiary">Synthetic example  |  {message}</p>

const sessionFixtures: ChatSession[] = [
  {
    id: "renewal-review",
    title: "Q3 renewal review",
    createdAt: new Date("2026-09-05T08:00:00Z"),
    updatedAt: new Date("2026-09-05T09:18:00Z"),
    starred: true,
    messages: [
      { id: "r1", role: "user", content: "Review the renewal workbook and identify accounts that need executive outreach.", timestamp: new Date("2026-09-05T09:12:00Z") },
      { id: "r2", role: "assistant", content: "Twelve accounts are at risk. Four require executive outreach this week.", timestamp: new Date("2026-09-05T09:18:00Z"), tokens: 1840, model: "Analysis" },
    ],
  },
  {
    id: "support-trends",
    title: "Support trend analysis",
    createdAt: new Date("2026-09-04T11:00:00Z"),
    updatedAt: new Date("2026-09-04T11:42:00Z"),
    messages: [
      { id: "s1", role: "user", content: "Summarize the main causes of escalations this month.", timestamp: new Date("2026-09-04T11:00:00Z") },
      { id: "s2", role: "assistant", content: "Billing configuration and delayed provisioning account for most escalations.", timestamp: new Date("2026-09-04T11:42:00Z"), tokens: 920 },
    ],
  },
  {
    id: "archived-brief",
    title: "August account briefing",
    createdAt: new Date("2026-08-29T10:00:00Z"),
    updatedAt: new Date("2026-08-29T10:25:00Z"),
    archived: true,
    messages: [{ id: "a1", role: "assistant", content: "The archived briefing contains six account summaries.", timestamp: new Date("2026-08-29T10:25:00Z") }],
  },
]

export function AgentChatHistoryPreview() {
  const [sessions, setSessions] = React.useState(sessionFixtures)
  const [selected, setSelected] = React.useState(sessionFixtures[0].id)
  const [activity, setActivity] = React.useState("Select, star, archive, export, or delete a conversation")
  return <div>{syntheticNote(activity)}<AgentChatHistory sessions={sessions} selectedSessionId={selected} onSelectSession={(session) => setSelected(session.id)} onDeleteSession={(id) => { setSessions((current) => current.filter((session) => session.id !== id)); setActivity("Conversation removed") }} onStarSession={(id) => setSessions((current) => current.map((session) => session.id === id ? { ...session, starred: !session.starred } : session))} onArchiveSession={(id) => setSessions((current) => current.map((session) => session.id === id ? { ...session, archived: !session.archived } : session))} onExportSession={() => setActivity("Export prepared locally")} /></div>
}

const toolFixtures: AgentTool[] = [
  { id: "files", name: "Document search", description: "Search approved workspace files and return cited passages.", category: "data", icon: <FileSearch className="size-4" />, enabled: true, usageCount: 18, lastUsed: new Date("2026-09-05T09:05:00Z"), parameters: [{ name: "query", type: "string", required: true }] },
  { id: "crm", name: "CRM records", description: "Read account notes and renewal status from connected records.", category: "data", icon: <Database className="size-4" />, enabled: true, usageCount: 11, lastUsed: new Date("2026-09-05T08:42:00Z") },
  { id: "web", name: "Web research", description: "Review public sources and retain links for verification.", category: "utility", icon: <Globe className="size-4" />, enabled: true, usageCount: 7 },
  { id: "draft", name: "Draft response", description: "Prepare a structured response for operator review.", category: "communication", icon: <MessageSquareText className="size-4" />, enabled: false, usageCount: 4 },
]

export function AgentToolkitPreview() {
  const [tools, setTools] = React.useState(toolFixtures)
  const [activity, setActivity] = React.useState("Choose a tool or change its availability")
  return <div>{syntheticNote(activity)}<AgentToolkit tools={tools} showUsageStats onToolClick={(tool) => setActivity(`${tool.name} selected`)} onToolToggle={(id, enabled) => { setTools((current) => current.map((tool) => tool.id === id ? { ...tool, enabled } : tool)); setActivity(enabled ? "Tool enabled" : "Tool disabled") }} /></div>
}

const grammarFixtures: GrammarIssue[] = [
  { id: "clarity", type: "clarity", message: "The sentence can state the result more directly.", suggestion: "Four accounts require executive outreach this week.", position: { start: 0, end: 74 }, severity: "warning" },
  { id: "style", type: "style", message: "Use a specific owner instead of a broad team reference.", suggestion: "Assign each account to its executive sponsor.", position: { start: 75, end: 130 }, severity: "info" },
]

export function AgentGrammarCheckerPreview() {
  const initial = "There are four accounts that should probably receive executive outreach this week. The team should assign owners."
  const [text, setText] = React.useState(initial)
  const [issues, setIssues] = React.useState(grammarFixtures)
  const accept = (id: string) => { if (id === "clarity") setText("Four accounts require executive outreach this week. Assign each account to its executive sponsor."); if (id === "style") setText((current) => current.replace("The team should assign owners.", "Assign each account to its executive sponsor.")); setIssues((current) => current.filter((issue) => issue.id !== id)) }
  return <div>{syntheticNote("Edit the text, accept a suggestion, or run the review again")}<AgentGrammarChecker text={text} originalText={initial} issues={issues} stats={{ wordsCount: text.trim().split(/\s+/).length, readabilityScore: 82, issuesFixed: grammarFixtures.length - issues.length, totalIssues: issues.length }} onTextChange={setText} onAcceptSuggestion={accept} onRejectSuggestion={(id) => setIssues((current) => current.filter((issue) => issue.id !== id))} onReanalyze={() => setIssues(grammarFixtures)} onCopy={() => void navigator.clipboard?.writeText(text)} /></div>
}

const searchFixtures: SearchResult[] = [
  { id: "forecast", title: "Q3 renewal forecast methodology", url: "https://example.com/renewal-forecast", domain: "example.com", snippet: "A public methodology for combining renewal value, product health, and sponsor coverage.", aiSummary: "Useful for validating the structure of the risk model.", publishedDate: "2026-08-28", credibilityScore: 0.91, relevanceScore: 0.95 },
  { id: "playbook", title: "Enterprise renewal playbook", url: "https://docs.example.org/renewal-playbook", domain: "docs.example.org", snippet: "Recommended actions for renewals with declining usage or missing executive sponsorship.", aiSummary: "Provides escalation criteria and owner expectations.", publishedDate: "2026-08-17", credibilityScore: 0.88, relevanceScore: 0.9 },
  { id: "benchmark", title: "Customer health scoring benchmark", url: "https://research.example.net/customer-health", domain: "research.example.net", snippet: "Benchmarks common health signals across enterprise software accounts.", publishedDate: "2026-07-30", credibilityScore: 0.84, relevanceScore: 0.78 },
]

export function AgentWebSearchPreview() {
  const [query, setQuery] = React.useState("enterprise renewal risk")
  const [results, setResults] = React.useState(searchFixtures)
  const [domains, setDomains] = React.useState<string[]>([])
  const [date, setDate] = React.useState<"all" | "day" | "week" | "month" | "year">("all")
  const [activity, setActivity] = React.useState("Search uses a fixed local fixture set")
  const search = (next: string) => { setQuery(next); const terms = next.toLowerCase().split(/\s+/).filter(Boolean); setResults(terms.length ? searchFixtures.filter((result) => terms.some((term) => `${result.title} ${result.snippet}`.toLowerCase().includes(term))) : searchFixtures); setActivity("Local results updated") }
  return <div>{syntheticNote(activity)}<AgentWebSearch query={query} results={results} selectedDomains={domains} dateFilter={date} onSearch={search} onDomainFilter={setDomains} onDateFilter={setDate} onResultClick={(result) => setActivity(`${result.title} selected`)} onCopyLink={(url) => { void navigator.clipboard?.writeText(url); setActivity("Link copied") }} onRefresh={() => { setResults(searchFixtures); setActivity("Synthetic results restored") }} /></div>
}
