import type { ComponentType } from "react"
import * as previews from "./beautiful-previews"

export interface BeautifulEntry {
  slug: string
  name: string
  category: "Beautiful UI"
  source: string
  path: string
  component: ComponentType
}
const families = [
  ["loading-state", "Loading State", "LoadingStatePreview"],
  ["thinking-state", "Thinking", "ThinkingStatePreview"],
  ["streaming-text", "Streaming Text", "StreamingTextPreview"],
  ["approval-card", "Approval Card", "ApprovalCardPreview"],
  ["tool-chips", "Tool Chips", "ToolChipsPreview"],
  ["task-rows", "Task Rows", "TaskRowsPreview"],
  ["chat-composer", "Chat", "ChatComposerPreview"],
  ["prompt-bar", "Prompt Bar", "PromptBarPreview"],
  ["recommendation-card", "Recommendation Card", "RecommendationCardPreview"],
  ["context-cards", "Context Cards", "ContextCardsPreview"],
  ["diff-table", "Diff Table", "DiffTablePreview"],
  ["records-table", "Records Table", "RecordsTablePreview"],
  ["filter-table", "Filter Table", "FilterTablePreview"],
  ["sidebar-nav", "Sidebar Nav", "SidebarNavPreview"],
  ["search-list", "Search", "SearchListPreview"],
  ["flowchart", "Flowchart", "FlowchartPreview"],
  ["insight-cards", "Insight Cards", "InsightCardsPreview"],
  ["code-block", "Code Block", "CodeBlockPreview"],
  ["fine-tune-card", "Fine-tune Card", "FineTuneCardPreview"],
  ["selection-actions", "Selection Actions", "SelectionActionsPreview"],
  ["agent-screen", "Agent Screen", "AgentScreenPreview"],
] as const
export const beautifulEntries: BeautifulEntry[] = families.map(
  ([slug, name, preview]) => ({
    slug: `beautiful-${slug}`,
    name,
    category: "Beautiful UI",
    source: "Beautiful UI · MIT",
    path: `components/beautiful-ui/${slug}.tsx`,
    component: previews[preview],
  })
)
