const conversationComponents = [
  {
    name: "Prompt input",
    slug: "prompt-input",
    href: "/components#prompt-kit-prompt-input-basic",
  },
  {
    name: "Messages",
    slug: "message",
    href: "/components#prompt-kit-message-basic",
  },
  {
    name: "Chat container",
    slug: "chat-container",
    href: "/components#prompt-kit-chat-container-basic",
  },
  {
    name: "Prompt suggestions",
    slug: "prompt-suggestion",
    href: "/components#prompt-kit-prompt-suggestion-basic",
  },
  {
    name: "Microphone toggle",
    slug: "livekit-agent-track-toggle",
    href: "/voice#livekit-agent-track-toggle",
  },
  { name: "Nimbus orb", slug: "orbkit-shdr-21", href: "/voice#orbkit-shdr-21" },
] as const

const conversationRequirements =
  "Build one conversation with typing and voice modes. Reuse ConversationAppExample and its actual Prompt Kit, LiveKit, and OrbKit imports. Keep one mounted composer, draft, source note, and message history across mode changes. Keep the transcript visible while voice is active. Microphone mute, response cancellation, and source attachment must update shared state. The demo uses extractive sample replies and does not record or play audio; connect a real provider before enabling live voice."

export const appExamples = [
  {
    id: "voice",
    label: "Voice",
    title: "Voice and chat",
    description:
      "Talk and type in the same conversation, with one composer and shared context.",
    sourcePath: "components/examples/voice-app.tsx",
    exportName: "VoiceAppExample",
    registryName: "example-voice-app",
    steps: [
      "Try a sample voice turn",
      "Type a follow-up",
      "Exit voice and keep the conversation",
    ],
    requirements: conversationRequirements,
    components: conversationComponents,
  },
  {
    id: "chat",
    label: "Chat",
    title: "Fieldwork conversation",
    description:
      "Start with a question or source note, then switch to voice without losing your draft.",
    sourcePath: "components/examples/chat-app.tsx",
    exportName: "ChatAppExample",
    registryName: "example-chat-app",
    steps: [
      "Ask about the field notes",
      "Attach a text note",
      "Switch between typing and voice",
    ],
    requirements: conversationRequirements,
    components: conversationComponents,
  },
  {
    id: "coding",
    label: "Coding",
    title: "Coding workspace",
    description:
      "An agent proposes a patch, you review it, and the checks explain the result.",
    sourcePath: "components/examples/coding-app.tsx",
    exportName: "CodingAppExample",
    registryName: "example-coding-app",
    steps: [
      "Select a file",
      "Review and accept or reject the patch",
      "Run the sample checks",
    ],
    requirements:
      "Build a coding workspace for a small TypeScript project. Include selectable files, a proposed code change, accept and reject actions, a task or activity view, and test output. File selection must change the displayed content. Apply and reject must update the working copy; checks must reflect those decisions. The supplied checks inspect local file snapshots and do not execute code. Replace the local fixture with an execution service for real commands.",
    components: [
      {
        name: "File tree",
        slug: "ai-elements-file-tree",
        href: "/components#ai-elements-file-tree",
      },
      {
        name: "Terminal",
        slug: "ai-elements-terminal",
        href: "/components#ai-elements-terminal",
      },
      {
        name: "Test results",
        slug: "ai-elements-test-results",
        href: "/components#ai-elements-test-results",
      },
      {
        name: "Code and diff",
        slug: "beautiful-code-block",
        href: "/components#beautiful-code-block",
      },
      {
        name: "Prompt input",
        slug: "prompt-input",
        href: "/components#prompt-kit-prompt-input-basic",
      },
    ],
  },
] as const

export type AppExample = (typeof appExamples)[number]
export type AppExampleId = AppExample["id"]

export function buildAppPrompt(example: AppExample) {
  return `Build a ${example.title.toLowerCase()} using Agents Kit.

Read the installation guide and API reference first:
https://agents-ui.github.io/agents-kit/docs/installation
https://agents-ui.github.io/agents-kit/llms.txt

Install the working UI starter into the existing React project:
npx shadcn@latest add https://agents-ui.github.io/agents-kit/c/${example.registryName}.json

Start from ${example.sourcePath}, which exports ${example.exportName}. Mount it with its default props. Read its imported components and use their actual props; do not invent APIs or rebuild components that are already included.

Product flow:
${example.requirements}

Keep the project's routes, authentication, data, and state boundaries. Adapt one screen at a time. Use the installed shared styles, Inter and JetBrains Mono, compact typography, consistent spacing, visible input borders, and contextual icons. Test both themes and a 390px layout. Preserve focus states and reduced-motion behavior.

The starter uses local sample data. Keep it clearly labelled until connected. Replace its demo handlers with the application's real agent or provider; keep secrets on the server and request microphone access only after an explicit user action. Do not claim a simulated action completed real work.

Verify the primary actions, loading, empty, stopped, and error states. Run the project's checks and inspect the rendered app. Summarize which components you used and which integrations still need configuration.`
}
