import { lazy, type ComponentType, type LazyExoticComponent } from "react"

export interface BeuiGalleryEntry {
  slug: string
  name: string
  description: string
  category: "beUI"
  source: "beUI"
  path: string
  family?: string
  variant?: string
  component: LazyExoticComponent<ComponentType<Record<string, unknown>>>
}

const lazyPreview = (name: string) =>
  lazy(async () => {
    const previews = await import("@/components/gallery/beui-previews")
    return {
      default: previews[name as keyof typeof previews] as ComponentType<
        Record<string, unknown>
      >,
    }
  })

const entry = (
  slug: string,
  name: string,
  description: string,
  component: string,
  options: { path?: string; family?: string; variant?: string } = {}
): BeuiGalleryEntry => ({
  slug: `beui-${slug}`,
  name,
  description,
  category: "beUI",
  source: "beUI",
  path: options.path ?? `components/beui/components/agents/${slug}.tsx`,
  family: options.family,
  variant: options.variant,
  component: lazyPreview(component),
})

export const beuiEntries: BeuiGalleryEntry[] = [
  entry(
    "message-bubble-surfaces",
    "Message Bubble · Animated Surfaces",
    "Newly sent rows pop once while streamed content remains stable.",
    "BeuiMessageBubbleSurfacesPreview",
    {
      path: "components/beui/components/agents/message-bubble.tsx",
      family: "Messages",
      variant: "Animated surfaces",
    }
  ),
  entry(
    "message-bubble-avatars",
    "Message Bubble · With Avatars",
    "Progressive messages with avatars, metadata, delivery state, and grouped follow-ups.",
    "BeuiMessageBubbleAvatarsPreview",
    {
      path: "components/beui/components/agents/message-bubble.tsx",
      family: "Messages",
      variant: "Avatars",
    }
  ),
  entry(
    "message-bubble-show-more",
    "Message Bubble · Show More",
    "Long responses with a line-clamped preview and animated disclosure.",
    "BeuiMessageBubbleCollapsiblePreview",
    {
      path: "components/beui/components/agents/message-bubble.tsx",
      family: "Messages",
      variant: "Show more",
    }
  ),
  entry(
    "message",
    "Message",
    "Composable rows with avatars, metadata, grouped bubbles, live markers, and mount animation.",
    "BeuiMessagePreview",
    { family: "Messages", variant: "Message rows" }
  ),
  entry(
    "message-scroller",
    "Message Scroller",
    "Reader-aware streaming follow behavior with a navigable message rail.",
    "BeuiMessageScrollerPreview",
    { family: "Conversation scrolling" }
  ),
  entry(
    "prompt-input",
    "Prompt Input",
    "Auto-growing composer with actions, model selection, keyboard submit, and send or stop states.",
    "BeuiPromptInputPreview",
    { family: "Prompt Bar" }
  ),
  entry(
    "todo-list",
    "Todo List",
    "Streaming task progress with morphing marks, completion count, and smooth list updates.",
    "BeuiTodoListPreview",
    { family: "Task Rows" }
  ),
  entry(
    "code-block",
    "Code Block",
    "Stable streamed syntax highlighting with line numbers, focused lines, and copy feedback.",
    "BeuiCodeBlockPreview",
    { family: "Code Block" }
  ),
  entry(
    "approval-card-questions",
    "Approval Card · Questions",
    "Single-choice, multiple-choice, and freeform questions in a multi-step flow.",
    "BeuiApprovalCardQuestionPreview",
    {
      path: "components/beui/components/agents/approval-card/index.tsx",
      family: "Approval Card",
      variant: "Questions",
    }
  ),
  entry(
    "approval-card-review",
    "Approval Card · Review and Approve",
    "Approval, revision, rejection, and the collapsed recorded outcome.",
    "BeuiApprovalCardReviewPreview",
    {
      path: "components/beui/components/agents/approval-card/index.tsx",
      family: "Approval Card",
      variant: "Review",
    }
  ),
  entry(
    "file-diff",
    "File Diff",
    "Progressive diff rows with live change counts, smooth following, and completion collapse.",
    "BeuiFileDiffPreview",
    { family: "File Diff" }
  ),
  entry(
    "tool-result-terminal",
    "Tool Result · Terminal Output",
    "Streaming command output that follows new lines and collapses after completion.",
    "BeuiToolResultTerminalPreview",
    {
      path: "components/beui/components/agents/tool-result.tsx",
      family: "Tool Result",
      variant: "Terminal output",
    }
  ),
  entry(
    "tool-result-request",
    "Tool Result · Request Result",
    "An in-flight request and highlighted response payload with retry and copy actions.",
    "BeuiToolResultRequestPreview",
    {
      path: "components/beui/components/agents/tool-result.tsx",
      family: "Tool Result",
      variant: "Request result",
    }
  ),
  entry(
    "streaming-response",
    "Streaming Response",
    "A streamed answer that resolves into actions, feedback, and expandable sources.",
    "BeuiStreamingResponsePreview",
    { family: "Streaming Text" }
  ),
  entry(
    "image-generation",
    "Image Generation",
    "A stable media canvas moving through queued, generating, refining, complete, and error states.",
    "BeuiImageGenerationPreview",
    { family: "Image generation" }
  ),
  entry(
    "tool-approval",
    "Tool Approval",
    "Expandable tool parameters with allow once, remember access, deny, and execution states.",
    "BeuiToolApprovalPreview",
    { family: "Tool Approval" }
  ),
  entry(
    "citations",
    "Citations",
    "Inline markers paired with a progressively rendered, collapsible source collection.",
    "BeuiCitationsPreview",
    { family: "Sources and citations" }
  ),
  entry(
    "agent-activity-streaming-text",
    "Agent Activity · Streaming Text",
    "Freeform reasoning streamed into a capped viewport and retained behind a disclosure.",
    "BeuiAgentActivityTextPreview",
    {
      path: "components/beui/components/agents/agent-activity/index.tsx",
      family: "Agent Activity",
      variant: "Streaming text",
    }
  ),
  entry(
    "agent-activity-reasoning-steps",
    "Agent Activity · Reasoning Steps",
    "Completed, active, and pending reasoning steps with trailing metadata.",
    "BeuiAgentActivityStepsPreview",
    {
      path: "components/beui/components/agents/agent-activity/index.tsx",
      family: "Agent Activity",
      variant: "Reasoning steps",
    }
  ),
  entry(
    "agent-activity-web-search",
    "Agent Activity · Web Search",
    "A search query with progressively arriving results and an overflow count.",
    "BeuiAgentActivitySearchPreview",
    {
      path: "components/beui/components/agents/agent-activity/index.tsx",
      family: "Agent Activity",
      variant: "Web search",
    }
  ),
  entry(
    "agent-activity-tool-calls",
    "Agent Activity · Tool Calls",
    "Read, edit, and run events with targets and line-change counts.",
    "BeuiAgentActivityToolsPreview",
    {
      path: "components/beui/components/agents/agent-activity/index.tsx",
      family: "Agent Activity",
      variant: "Tool calls",
    }
  ),
  entry(
    "agent-activity-mixed",
    "Agent Activity · Mixed Activity",
    "Reasoning, search, and tool events in one chronological animated run.",
    "BeuiAgentActivityMixedPreview",
    {
      path: "components/beui/components/agents/agent-activity/index.tsx",
      family: "Agent Activity",
      variant: "Mixed activity",
    }
  ),
  entry(
    "agent-activity-trace",
    "Agent Activity · Agent Trace",
    "Messages and structured actions streamed into a compact execution ledger.",
    "BeuiAgentTracePreview",
    {
      path: "components/beui/components/agents/agent-activity/index.tsx",
      family: "Agent Activity",
      variant: "Agent trace",
    }
  ),
  entry(
    "reasoning-text",
    "Reasoning Text",
    "Shimmering reasoning copy with cascade, phrase-swap, and per-letter scramble variants.",
    "BeuiReasoningTextPreview",
    {
      path: "components/beui/components/agents/loading-states/reasoning-text.tsx",
      family: "Agent Loading States",
      variant: "Reasoning text",
    }
  ),
  entry(
    "thinking-shimmer",
    "Thinking Shimmer",
    "Readable status text with a quiet animated shimmer.",
    "BeuiThinkingShimmerPreview",
    {
      path: "components/beui/components/agents/loading-states/thinking-shimmer.tsx",
      family: "Agent Loading States",
      variant: "Thinking shimmer",
    }
  ),
  entry(
    "agent-progress",
    "Agent Progress",
    "A compact activity glyph, action label, and live tabular timer.",
    "BeuiAgentProgressPreview",
    {
      path: "components/beui/components/agents/loading-states/agent-progress.tsx",
      family: "Agent Loading States",
      variant: "Agent progress",
    }
  ),
  entry(
    "ai-sidebar",
    "AI Sidebar",
    "A collapsible workspace tree with keyboard navigation, moves, rename, and overflow labels.",
    "BeuiAISidebarPreview",
    { family: "Sidebar Nav" }
  ),
  entry(
    "chat-app",
    "Chat App",
    "A complete agent workspace composing navigation, messages, planning, tools, media, sources, and prompt input.",
    "BeuiChatAppPreview",
    { family: "Chat" }
  ),
]
