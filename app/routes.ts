export type Route = {
  path: string
  label: string
  order: number
  type: "component" | "core" | "block" | "agent"
}

export const routes: Route[] = [
  {
    path: "/",
    label: "Home",
    order: 0,
    type: "core",
  },
  {
    path: "/docs/introduction",
    label: "Introduction",
    order: 1,
    type: "core",
  },
  {
    path: "/docs/installation",
    label: "Installation",
    order: 2,
    type: "core",
  },
  {
    path: "/docs/mcp",
    label: "Model Context Protocol",
    order: 3,
    type: "core",
  },
  {
    path: "/docs/prompt-input",
    label: "Prompt Input",
    order: 4,
    type: "component",
  },
  {
    path: "/docs/message",
    label: "Message",
    order: 5,
    type: "component",
  },
  {
    path: "/docs/markdown",
    label: "Markdown",
    order: 6,
    type: "component",
  },
  {
    path: "/docs/code-block",
    label: "Code Block",
    order: 7,
    type: "component",
  },
  {
    path: "/docs/chat-container",
    label: "Chat Container",
    order: 8,
    type: "component",
  },
  {
    path: "/docs/scroll-button",
    label: "Scroll Button",
    order: 9,
    type: "component",
  },
  {
    path: "/docs/loader",
    label: "Loader",
    order: 10,
    type: "component",
  },
  {
    path: "/docs/prompt-suggestion",
    label: "Prompt Suggestion",
    order: 11,
    type: "component",
  },
  {
    path: "/docs/response-stream",
    label: "Response Stream",
    order: 12,
    type: "component",
  },
  {
    path: "/docs/reasoning",
    label: "Reasoning",
    order: 13,
    type: "component",
  },
  {
    path: "/docs/file-upload",
    label: "File Upload",
    order: 14,
    type: "component",
  },
  {
    path: "/docs/jsx-preview",
    label: "JSX Preview",
    order: 15,
    type: "component",
  },
  {
    path: "/docs/agent-card",
    label: "Agent Card",
    order: 16,
    type: "agent",
  },
  {
    path: "/docs/agent-response",
    label: "Agent Response",
    order: 17,
    type: "agent",
  },
  {
    path: "/docs/agent-prompt-composer",
    label: "Agent Prompt Composer",
    order: 18,
    type: "agent",
  },
  {
    path: "/docs/agent-chat-history",
    label: "Agent Chat History",
    order: 19,
    type: "agent",
  },
  {
    path: "/docs/agent-status-panel",
    label: "Agent Status Panel",
    order: 20,
    type: "agent",
  },
  {
    path: "/docs/agent-tool-palette",
    label: "Agent Toolkit",
    order: 21,
    type: "agent",
  },
  {
    path: "/docs/agent-feedback",
    label: "Agent Feedback",
    order: 22,
    type: "agent",
  },
  {
    path: "/docs/agent-image-editor",
    label: "Agent Image Editor",
    order: 23,
    type: "agent",
  },
  {
    path: "/docs/agent-video-editor",
    label: "Agent Video Editor",
    order: 24,
    type: "agent",
  },
  {
    path: "/docs/agent-audio-generator",
    label: "Agent Audio Generator",
    order: 25,
    type: "agent",
  },
  {
    path: "/docs/agent-grammar-checker",
    label: "Agent Grammar Checker",
    order: 26,
    type: "agent",
  },
  {
    path: "/docs/agent-web-search",
    label: "Agent Web Search",
    order: 27,
    type: "agent",
  },
  {
    path: "/docs/agent-doc-scanner",
    label: "Agent Doc Scanner",
    order: 28,
    type: "agent",
  },
  {
    path: "/docs/blocks",
    label: "Blocks",
    order: 29,
    type: "block",
  },
]

export function getNavigation(currentPath: string) {
  const currentIndex = routes.findIndex((route) => route.path === currentPath)

  if (currentIndex === -1) return null

  return {
    prev: currentIndex > 0 ? routes[currentIndex - 1] : null,
    current: routes[currentIndex],
    next: currentIndex < routes.length - 1 ? routes[currentIndex + 1] : null,
  }
}
