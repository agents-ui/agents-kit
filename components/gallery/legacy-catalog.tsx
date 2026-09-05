"use client"

import * as React from "react"

export type LegacyCategory = "Agents" | "Prompt Kit" | "Blocks"
export interface LegacyEntry {
  slug: string
  name: string
  category: LegacyCategory
  source: string
  path: string
  component: React.ComponentType<Record<string, unknown>>
  props?: Record<string, unknown>
}

const lazyNamed = (
  loader: () => Promise<Record<string, unknown>>,
  exportName: string
) => React.lazy(async () => {
  const loaded = await loader()
  return { default: loaded[exportName] as React.ComponentType<Record<string, unknown>> }
})

const agent = (
  slug: string,
  name: string,
  loader: () => Promise<Record<string, unknown>>,
  exportName: string,
  props?: Record<string, unknown>
): LegacyEntry => ({ slug, name, category: "Agents", source: "Agents Kit v0.1", path: `components/agents-ui/${slug}.tsx`, component: lazyNamed(loader, exportName), props })

const agents: LegacyEntry[] = [
  agent("agent-analytics-pulse", "Agent Analytics Pulse", () => import("@/components/agents-ui/agent-analytics-pulse"), "AgentAnalyticsPulse"),
  agent("agent-artifact", "Agent Artifact", () => import("@/components/agents-ui/agent-artifact"), "AgentArtifact"),
  agent("agent-audio-generator", "Agent Audio Generator", () => import("@/components/agents-ui/agent-audio-generator"), "AgentAudioGenerator"),
  agent("agent-card", "Agent Card", () => import("@/components/agents-ui/agent-card"), "AgentCard", { name: "Research analyst", description: "Reviews supplied evidence and prepares an operator-ready briefing.", status: "running" }),
  agent("agent-chat-history", "Agent Chat History", () => import("@/components/gallery/agent-previews"), "AgentChatHistoryPreview"),
  agent("agent-code-executor", "Agent Code Executor", () => import("@/components/agents-ui/agent-code-executor"), "AgentCodeExecutor"),
  agent("agent-competitor-research", "Agent Competitor Research", () => import("@/components/agents-ui/agent-competitor-research"), "AgentCompetitorResearch"),
  agent("agent-data-analysis", "Agent Data Analysis", () => import("@/components/agents-ui/agent-data-analysis"), "AgentDataAnalysis"),
  agent("agent-doc-scanner", "Agent Document Scanner", () => import("@/components/agents-ui/agent-doc-scanner"), "AgentDocScanner"),
  agent("agent-evaluator", "Agent Evaluator", () => import("@/components/agents-ui/agent-evaluator"), "AgentEvaluator"),
  agent("agent-feedback", "Agent Feedback", () => import("@/components/agents-ui/agent-feedback"), "AgentFeedback"),
  agent("agent-form-generator", "Agent Form Generator", () => import("@/components/agents-ui/agent-form-generator"), "AgentFormGenerator"),
  agent("agent-grammar-checker", "Agent Grammar Checker", () => import("@/components/gallery/agent-previews"), "AgentGrammarCheckerPreview"),
  agent("agent-image-editor", "Agent Image Editor", () => import("@/components/agents-ui/agent-image-editor"), "AgentImageEditor"),
  agent("agent-inquiry", "Agent Inquiry", () => import("@/components/agents-ui/agent-inquiry"), "AgentInquiry"),
  agent("agent-ops-monitor", "Agent Operations Monitor", () => import("@/components/agents-ui/agent-ops-monitor"), "AgentOpsMonitor"),
  agent("agent-orchestrator", "Agent Orchestrator", () => import("@/components/agents-ui/agent-orchestrator"), "AgentOrchestrator"),
  agent("agent-parallel-processor", "Agent Parallel Processor", () => import("@/components/agents-ui/agent-parallel-processor"), "AgentParallelProcessor"),
  agent("agent-plan-builder", "Agent Plan Builder", () => import("@/components/agents-ui/agent-plan-builder"), "AgentPlanBuilder"),
  agent("agent-prompt-composer", "Agent Prompt Composer", () => import("@/components/agents-ui/agent-prompt-composer"), "AgentPromptComposer"),
  agent("agent-response", "Agent Response", () => import("@/components/agents-ui/agent-response"), "AgentResponse", { message: "The review is complete. Four synthetic accounts require operator attention this week." }),
  agent("agent-revenue-insights", "Agent Revenue Insights", () => import("@/components/agents-ui/agent-revenue-insights"), "AgentRevenueInsights"),
  agent("agent-routing-hub", "Agent Routing Hub", () => import("@/components/agents-ui/agent-routing-hub"), "AgentRoutingHub"),
  agent("agent-sequential-workflow", "Agent Sequential Workflow", () => import("@/components/agents-ui/agent-sequential-workflow"), "AgentSequentialWorkflow"),
  agent("agent-sources-citations", "Agent Sources and Citations", () => import("@/components/agents-ui/agent-sources-citations"), "AgentSourcesCitations"),
  agent("agent-status-panel", "Agent Status Panel", () => import("@/components/agents-ui/agent-status-panel"), "AgentStatusPanel"),
  agent("agent-task-queue", "Agent Task Queue", () => import("@/components/agents-ui/agent-task-queue"), "AgentTaskQueue"),
  agent("agent-tool-approval", "Agent Tool Approval", () => import("@/components/agents-ui/agent-tool-approval"), "AgentToolApproval"),
  agent("agent-tool-palette", "Agent Toolkit", () => import("@/components/gallery/agent-previews"), "AgentToolkitPreview"),
  agent("agent-video-editor", "Agent Video Editor", () => import("@/components/agents-ui/agent-video-editor"), "AgentVideoEditor"),
  agent("agent-web-search", "Agent Web Search", () => import("@/components/gallery/agent-previews"), "AgentWebSearchPreview"),
  agent("agent-workflow-planner", "Agent Workflow Planner", () => import("@/components/agents-ui/agent-workflow-planner"), "AgentWorkflowPlanner"),
]

const promptDefinitions = [
  ["chat-container", "Chat container", "ChatContainerPreview"],
  ["code-block", "Code block", "CodeBlockPreview"],
  ["file-upload", "File upload", "FileUploadPreview"],
  ["jsx-preview", "JSX preview", "JSXPreviewPreview"],
  ["loader", "Loader", "LoaderPreview"],
  ["markdown", "Markdown", "MarkdownPreview"],
  ["message", "Message", "MessagePreview"],
  ["prompt-input", "Prompt input", "PromptInputPreview"],
  ["prompt-suggestion", "Prompt suggestion", "PromptSuggestionPreview"],
  ["reasoning", "Reasoning", "ReasoningPreview"],
  ["response-stream", "Response stream", "ResponseStreamPreview"],
  ["scroll-button", "Scroll button", "ScrollButtonPreview"],
] as const
const prompts: LegacyEntry[] = promptDefinitions.map(([slug, name, exportName]) => ({ slug: `prompt-${slug}`, name, category: "Prompt Kit", source: "Prompt Kit", path: `components/prompt-kit/${slug}.tsx`, component: lazyNamed(() => import("@/components/gallery/prompt-previews"), exportName) }))

const blockDefinitions = [
  ["conversation-actions", "Conversation actions", "ConversationWithActions"],
  ["conversation-avatars", "Conversation avatars", "ConversationWithAvatars"],
  ["conversation-prompt-input", "Conversation prompt input", "ConversationPromptInput"],
  ["conversation-scroll-bottom", "Conversation scroll button", "ConversationWithScrollBottom"],
  ["email-launch-digest", "Email launch digest", "default"],
  ["full-chat-app", "Full chat app", "FullChatApp"],
  ["full-conversation", "Full conversation", "FullConversation"],
  ["marketing-funnel-command-center", "Marketing funnel command center", "default"],
  ["prompt-autocomplete-highlight", "Prompt autocomplete", "PromptAutocompleteHighlight"],
  ["prompt-input-actions", "Prompt input actions", "PromptInputWithActions"],
  ["prompt-input-suggestions", "Prompt input suggestions", "PromptInputWithSuggestions"],
  ["sidebar-chat-history", "Sidebar chat history", "SidebarChatHistory"],
  ["social-trend-agent", "Social trend agent", "default"],
] as const
const blocks: LegacyEntry[] = blockDefinitions.map(([slug, name, exportName]) => ({ slug: `block-${slug}`, name, category: "Blocks", source: "Agents Kit v0.1", path: `components/blocks/${slug}.tsx`, component: lazyNamed(() => import(`@/components/blocks/${slug}`), exportName) }))

export const legacyEntries: LegacyEntry[] = [...agents, ...prompts, ...blocks]
