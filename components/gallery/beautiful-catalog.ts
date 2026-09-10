import { lazy, type ComponentType } from "react"

export interface BeautifulEntry {
  slug: string
  name: string
  category: "Beautiful UI"
  source: string
  path: string
  component: ComponentType
}
const families = [
  ["loading-state", "Loading State", "LoadingStatePreview", "LoadingState"],
  ["thinking-state", "Thinking", "ThinkingStatePreview", "ThinkingState"],
  ["streaming-text", "Streaming Text", "StreamingTextPreview", "StreamingText"],
  ["approval-card", "Approval Card", "ApprovalCardPreview", "ApprovalCard"],
  ["tool-chips", "Tool Chips", "ToolChipsPreview", "ToolChips"],
  ["task-rows", "Task Rows", "TaskRowsPreview", "TaskRows"],
  ["chat-composer", "Chat", "ChatComposerPreview", "ChatComposer"],
  ["prompt-bar", "Prompt Bar", "PromptBarPreview", "PromptBar"],
  ["recommendation-card", "Recommendation Card", "RecommendationCardPreview", "RecommendationCard"],
  ["context-cards", "Context Cards", "ContextCardsPreview", "ContextCards"],
  ["diff-table", "Diff Table", "DiffTablePreview", "DiffTable"],
  ["records-table", "Records Table", "RecordsTablePreview", "RecordsTable"],
  ["filter-table", "Filter Table", "FilterTablePreview", "FilterTable"],
  ["sidebar-nav", "Sidebar Nav", "SidebarNavPreview", "SidebarNav"],
  ["search-list", "Search", "SearchListPreview", "SearchList"],
  ["flowchart", "Flowchart", "FlowchartPreview", "Flowchart"],
  ["insight-cards", "Insight Cards", "InsightCardsPreview", "InsightCards"],
  ["code-block", "Code Block", "CodeBlockPreview", "CodeBlock"],
  ["fine-tune-card", "Fine-tune Card", "FineTuneCardPreview", "FineTuneCard"],
  ["selection-actions", "Selection Actions", "SelectionActionsPreview", "SelectionActions"],
  ["agent-screen", "Agent Screen", "AgentScreenPreview", "AgentScreen"],
] as const
export const beautifulEntries: BeautifulEntry[] = families.map(
  ([slug, name, preview, sourceFile]) => ({
    slug: `beautiful-${slug}`,
    name,
    category: "Beautiful UI",
    source: "Beautiful UI · MIT",
    path: `components/beautiful-ui/original/primitives/${sourceFile}.tsx`,
    component: lazy(async () => {
      const previews = await import("./beautiful-previews")
      return { default: previews[preview] }
    }),
  })
)
