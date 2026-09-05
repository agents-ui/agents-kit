import type { GalleryEntry } from "./catalog"

const aliases: Record<string, string> = {
  "Agent Screen": "Agent Screen",
  "Loading State": "Loading State",
  Loader: "Loading State",
  "Agent Loading States": "Loading State",
  Thinking: "Thinking",
  Reasoning: "Thinking",
  "Thinking Orbs": "Thinking Orbs",
  "Thinking Indicator": "Thinking Orbs",
  "Streaming Text": "Streaming Text",
  "Streaming Response": "Streaming Text",
  "Response stream": "Streaming Text",
  "Approval Card": "Approval Card",
  "Agent Inquiry": "Approval Card",
  "Tool Chips": "Tool Chips",
  "Tool Result": "Tool Result",
  "Tool Approval": "Tool Approval",
  "Agent Tool Approval": "Tool Approval",
  "Task Rows": "Task Rows",
  "Todo List": "Task Rows",
  "Agent Task Queue": "Task Rows",
  "Task table": "Task Rows",
  Chat: "Chat",
  "Chat App": "Chat",
  "Full chat app": "Chat",
  "Prompt Bar": "Prompt Bar",
  "Prompt Input": "Prompt Bar",
  "Prompt input": "Prompt Bar",
  "Agent Prompt Composer": "Prompt Bar",
  "Workspace composer": "Prompt Bar",
  Message: "Messages",
  "Message Bubble": "Messages",
  "Agent Response": "Messages",
  "Message Scroller": "Conversation scrolling",
  "Chat container": "Conversation scrolling",
  "Scroll button": "Conversation scrolling",
  "Code Block": "Code Block",
  "Code block": "Code Block",
  Citations: "Sources and citations",
  "Agent Sources and Citations": "Sources and citations",
  "Image Generation": "Image generation",
  "Agent Image Editor": "Image generation",
  "Sidebar Nav": "Sidebar Nav",
  "AI Sidebar": "Sidebar Nav",
  "Insight Cards": "Insight Cards",
  "Agent Analytics Pulse": "Insight Cards",
  Search: "Search",
  "Agent Web Search": "Search",
  "Agent Activity": "Agent activity",
  "Agent Context Meter": "Context usage",
  "Context Meter": "Context usage",
  "Agent Checkpoint": "Checkpoint",
  Checkpoint: "Checkpoint",
}
const order = [
  "Loading State",
  "Thinking",
  "Thinking Orbs",
  "Streaming Text",
  "Messages",
  "Approval Card",
  "Tool Approval",
  "Tool Chips",
  "Tool Result",
  "Task Rows",
  "Chat",
  "Prompt Bar",
  "Recommendation Card",
  "Context Cards",
  "Context usage",
  "Diff Table",
  "File Diff",
  "Records Table",
  "Filter Table",
  "Sidebar Nav",
  "Search",
  "Flowchart",
  "Insight Cards",
  "Code Block",
  "Fine-tune Card",
  "Selection Actions",
  "Agent Screen",
  "Agent activity",
  "Checkpoint",
  "Generated results",
  "Image generation",
  "Conversation scrolling",
]
export type ComponentFamily = {
  id: string
  name: string
  entries: GalleryEntry[]
}
export function groupEntries(entries: GalleryEntry[]): ComponentFamily[] {
  const groups = new Map<string, ComponentFamily>()
  for (const entry of entries) {
    const name = aliases[entry.name] ?? entry.name.replace(/^Agent /, "")
    if (!groups.has(name))
      groups.set(name, {
        id: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/-$/, ""),
        name,
        entries: [],
      })
    groups.get(name)!.entries.push(entry)
  }
  const priority = [
    "Beautiful UI",
    "beUI",
    "Generative UI",
    "Blocks.so",
    "Effects",
  ]
  return [...groups.values()]
    .map((group) => ({
      ...group,
      entries: group.entries.sort(
        (a, b) => priority.indexOf(a.category) - priority.indexOf(b.category)
      ),
    }))
    .sort((a, b) => {
      const left = order.indexOf(a.name),
        right = order.indexOf(b.name)
      return (
        (left < 0 ? 99 : left) - (right < 0 ? 99 : right) ||
        a.name.localeCompare(b.name)
      )
    })
}
