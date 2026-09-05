import { lazy, type ComponentType, type LazyExoticComponent } from "react"

export interface BeuiGalleryEntry {
  slug: string
  name: string
  description: string
  category: "beUI"
  source: "beUI"
  path: string
  component: LazyExoticComponent<ComponentType<Record<string, unknown>>>
}

const lazyPreview = (name: string) => {
  return lazy(async () => {
    const previews = await import("@/components/gallery/beui-previews")
    return { default: previews[name as keyof typeof previews] as ComponentType<Record<string, unknown>> }
  })
}

const entry = (slug: string, name: string, description: string, component: string, path = `components/beui/components/agents/${slug}.tsx`): BeuiGalleryEntry => ({ slug: `beui-${slug}`, name, description, category: "beUI", source: "beUI", path, component: lazyPreview(component) })

export const beuiEntries: BeuiGalleryEntry[] = [
  entry("message-bubble", "Message Bubble", "Focused conversation bubbles with alignment, tone, grouping, and expandable content.", "BeuiMessageBubblePreview"),
  entry("message", "Message", "Composable message rows with avatar, metadata, content, and completion details.", "BeuiMessagePreview"),
  entry("message-scroller", "Message Scroller", "A reader-aware conversation viewport that follows streamed output at the live edge.", "BeuiMessageScrollerPreview"),
  entry("prompt-input", "Prompt Input", "An auto-growing composer with prompt actions, model selection, and send or stop states.", "BeuiPromptInputPreview"),
  entry("todo-list", "Todo List", "A collapsible task plan with status, progress, metadata, and completion handling.", "BeuiTodoListPreview"),
  entry("code-block", "Code Block", "Syntax-highlighted code with line numbers, focused lines, streaming stability, and copy feedback.", "BeuiCodeBlockPreview"),
  entry("approval-card", "Approval Card", "A human decision surface for approvals, questions, responses, and multi-step review.", "BeuiApprovalCardPreview", "components/beui/components/agents/approval-card/index.tsx"),
  entry("file-diff", "File Diff", "A syntax-highlighted file change disclosure with line numbers and change counts.", "BeuiFileDiffPreview"),
  entry("tool-result", "Tool Result", "A compact execution disclosure for terminal output and request responses.", "BeuiToolResultPreview"),
  entry("streaming-response", "Streaming Response", "A stable response surface with completion actions and expandable sources.", "BeuiStreamingResponsePreview"),
  entry("image-generation", "Image Generation", "A stable media surface from queued work through refinement and completion.", "BeuiImageGenerationPreview"),
  entry("tool-approval", "Tool Approval", "A permission card for reviewing tool scope, allowing once, or denying execution.", "BeuiToolApprovalPreview"),
  entry("citations", "Citations", "Inline reference markers paired with a progressively rendered source collection.", "BeuiCitationsPreview"),
  entry("agent-activity", "Agent Activity", "An adaptive stream for reasoning, searches, tool calls, and execution traces.", "BeuiAgentActivityPreview", "components/beui/components/agents/agent-activity/index.tsx"),
  entry("loading-states", "Agent Loading States", "Thinking shimmer, reasoning phrases, progress timing, and selectable loader variants.", "BeuiLoadingStatesPreview", "components/beui/components/agents/loading-states/index.ts"),
  entry("ai-sidebar", "AI Sidebar", "A navigable workspace tree for folders, projects, files, and bookmarks.", "BeuiAISidebarPreview"),
  entry("chat-app", "Chat App", "A complete conversation workspace combining navigation, messages, and prompt input.", "BeuiChatAppPreview"),
]
