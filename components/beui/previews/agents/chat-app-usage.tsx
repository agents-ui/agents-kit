"use client"

import { AgentActivity } from "@/components/beui/components/agents/agent-activity"
import {
  AISidebar,
  type SidebarResource,
} from "@/components/beui/components/agents/ai-sidebar"
import {
  ApprovalCard,
  type ApprovalCardQuestion,
  type ApprovalCardStatus,
} from "@/components/beui/components/agents/approval-card"
import { ChatApp } from "@/components/beui/components/agents/chat-app"
import { CodeBlock } from "@/components/beui/components/agents/code-block"
import { FileDiff } from "@/components/beui/components/agents/file-diff"
import { ImageGeneration } from "@/components/beui/components/agents/image-generation"
import { ThinkingShimmer } from "@/components/beui/components/agents/loading-states"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/beui/components/agents/message"
import {
  MessageBubble,
  MessageBubbleContent,
} from "@/components/beui/components/agents/message-bubble"
import { MessageScroller } from "@/components/beui/components/agents/message-scroller"
import { PromptInput } from "@/components/beui/components/agents/prompt-input"
import { StreamingResponse } from "@/components/beui/components/agents/streaming-response"
import {
  TodoList,
  type TodoItem,
} from "@/components/beui/components/agents/todo-list"
import {
  ToolApproval,
  ToolApprovalCode,
  type ToolApprovalStatus,
} from "@/components/beui/components/agents/tool-approval"
import {
  ToolResult,
  ToolResultOutput,
} from "@/components/beui/components/agents/tool-result"
import {
  AnimatedSidebar,
  AnimatedSidebarContent,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
  AnimatedSidebarRail,
  AnimatedSidebarTrigger,
} from "@/components/beui/components/motion/animated-sidebar"
import { cn } from "@/components/beui/lib/utils"
import {
  Bot,
  Clock3,
  FolderKanban,
  MessageSquarePlus,
  PanelLeft,
  Paperclip,
  Search,
  User,
  WandSparkles,
} from "lucide-react"
import { useReducedMotion } from "motion/react"
import * as React from "react"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react"

const resources: SidebarResource[] = [
  {
    id: "release",
    label: "Fieldwork project",
    kind: "project",
    children: [
      { id: "checkout", label: "Interview audit", kind: "file" },
      { id: "release-notes", label: "Field report", kind: "file" },
      { id: "references", label: "Research sources", kind: "bookmark" },
    ],
  },
  {
    id: "evidence",
    label: "Field evidence",
    kind: "folder",
    children: [
      { id: "themes", label: "Interview themes", kind: "file" },
      { id: "participants", label: "Participant matrix", kind: "file" },
    ],
  },
  { id: "archive", label: "Archived runs", kind: "folder" },
]

const diffLines = [
  {
    id: "context-1",
    type: "context" as const,
    oldLine: 41,
    newLine: 41,
    content: "  const themes = clusterQuotes(transcript);",
  },
  {
    id: "removed-1",
    type: "removed" as const,
    oldLine: 42,
    content: "  return themes;",
  },
  {
    id: "added-1",
    type: "added" as const,
    newLine: 42,
    content: "  const result = validateInterview({ transcript, consent });",
  },
  {
    id: "added-2",
    type: "added" as const,
    newLine: 43,
    content: "  return result.ok ? linkEvidence(themes) : result;",
  },
]

const approvalQuestions: ApprovalCardQuestion[] = [
  {
    id: "release",
    title: "How should the field report be shared?",
    options: [
      { value: "focused", label: "Share the focused interview finding" },
      { value: "bundle", label: "Bundle it with the full research readout" },
    ],
    allowCustom: true,
    customPlaceholder: "Add another research instruction…",
  },
]

const reply =
  "I’ll keep the synthesis focused, preserve each participant quote, and verify the evidence before preparing the report."

interface AddedMessage {
  id: string
  from: "user" | "assistant"
  content: string
  streaming?: boolean
}

function GeneratedPreview() {
  return (
    <svg viewBox="0 0 640 420" aria-hidden="true" className="size-full">
      <rect
        width="640"
        height="420"
        fill="currentColor"
        className="text-muted"
      />
      <rect
        x="64"
        y="52"
        width="512"
        height="316"
        rx="28"
        fill="currentColor"
        className="text-background"
      />
      <circle
        cx="320"
        cy="144"
        r="38"
        fill="currentColor"
        className="text-emerald-500"
      />
      <path
        d="m301 144 13 13 26-29"
        fill="none"
        stroke="white"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="204"
        y="210"
        width="232"
        height="18"
        rx="9"
        fill="currentColor"
        className="text-foreground/85"
      />
      <rect
        x="238"
        y="246"
        width="164"
        height="12"
        rx="6"
        fill="currentColor"
        className="text-muted-foreground/35"
      />
      <rect
        x="248"
        y="298"
        width="144"
        height="34"
        rx="17"
        fill="currentColor"
        className="text-foreground"
      />
    </svg>
  )
}

function AssistantIdentity({ label = "Fieldwork Agent" }: { label?: string }) {
  return (
    <MessageHeader>
      <span>{label}</span>
      <span>Now</span>
    </MessageHeader>
  )
}

export function ChatAppExample({
  className,
}: Pick<ComponentProps<typeof ChatApp>, "className">) {
  const reduce = useReducedMotion() ?? false
  const toolTimers = useRef<number[]>([])
  const chatTimers = useRef<number[]>([])
  const approvalTimers = useRef<number[]>([])
  const runId = useRef(0)
  const [items, setItems] = useState(resources)
  const [activeResource, setActiveResource] = useState("checkout")
  const [input, setInput] = useState("")
  const [pending, setPending] = useState(false)
  const [activeReply, setActiveReply] = useState<string | null>(null)
  const [messages, setMessages] = useState<AddedMessage[]>([])
  const [toolStatus, setToolStatus] = useState<ToolApprovalStatus>("pending")
  const [approvalStatus, setApprovalStatus] =
    useState<ApprovalCardStatus>("pending")

  const clearToolTimers = useCallback(() => {
    toolTimers.current.forEach(window.clearTimeout)
    toolTimers.current = []
  }, [])

  const clearChatTimers = useCallback(() => {
    chatTimers.current.forEach(window.clearTimeout)
    chatTimers.current = []
  }, [])

  const clearApprovalTimers = useCallback(() => {
    approvalTimers.current.forEach(window.clearTimeout)
    approvalTimers.current = []
  }, [])

  useEffect(
    () => () => {
      clearToolTimers()
      clearChatTimers()
      clearApprovalTimers()
    },
    [clearApprovalTimers, clearChatTimers, clearToolTimers]
  )

  const plan = useMemo<TodoItem[]>(() => {
    const checksStatus =
      toolStatus === "complete"
        ? "completed"
        : toolStatus === "running"
          ? "in-progress"
          : toolStatus === "denied" || toolStatus === "error"
            ? "cancelled"
            : "pending"
    return [
      {
        id: "inspect",
        title: "Review rider interviews",
        status: "completed",
      },
      {
        id: "patch",
        title: "Link findings to evidence",
        status: "completed",
      },
      { id: "checks", title: "Run privacy checks", status: checksStatus },
      {
        id: "review",
        title: "Collect research approval",
        status: toolStatus === "complete" ? "in-progress" : "pending",
      },
    ]
  }, [toolStatus])

  useEffect(() => {
    if (!activeReply) return

    if (reduce) {
      setMessages((current) =>
        current.map((message) =>
          message.id === activeReply
            ? { ...message, content: reply, streaming: false }
            : message
        )
      )
      setActiveReply(null)
      return
    }

    const startedAt = performance.now()
    let frame = 0
    const stream = (now: number) => {
      const cursor = Math.min(
        reply.length,
        Math.floor(((now - startedAt) / 1000) * 92)
      )
      const content = reply.slice(0, cursor)
      setMessages((current) =>
        current.map((message) =>
          message.id === activeReply && message.content !== content
            ? { ...message, content }
            : message
        )
      )

      if (cursor < reply.length) {
        frame = requestAnimationFrame(stream)
      } else {
        setMessages((current) =>
          current.map((message) =>
            message.id === activeReply
              ? { ...message, streaming: false }
              : message
          )
        )
        setActiveReply(null)
      }
    }

    frame = requestAnimationFrame(stream)
    return () => cancelAnimationFrame(frame)
  }, [activeReply, reduce])

  const approveTool = () => {
    clearToolTimers()
    setToolStatus("approving")
    toolTimers.current = [
      window.setTimeout(() => setToolStatus("approved"), 450),
      window.setTimeout(() => setToolStatus("running"), 850),
      window.setTimeout(() => setToolStatus("complete"), 1650),
    ]
  }

  const submit = (value: string) => {
    if (!value.trim() || pending || activeReply) return
    const id = runId.current++
    const assistantId = `assistant-${id}`
    setMessages((current) => [
      ...current,
      { id: `user-${id}`, from: "user", content: value },
    ])
    setInput("")
    setPending(true)
    chatTimers.current.push(
      window.setTimeout(
        () => {
          setMessages((current) => [
            ...current,
            {
              id: assistantId,
              from: "assistant",
              content: "",
              streaming: true,
            },
          ])
          setPending(false)
          setActiveReply(assistantId)
        },
        reduce ? 0 : 420
      )
    )
  }

  const stop = () => {
    clearChatTimers()
    setPending(false)
    setMessages((current) =>
      current.map((message) =>
        message.streaming ? { ...message, streaming: false } : message
      )
    )
    setActiveReply(null)
  }

  const busy = pending || activeReply !== null

  return (
    <ChatApp sidebarWidth="17rem" className={cn("h-[760px]", className)}>
      <AnimatedSidebar
        ariaLabel="Fieldwork workspace"
        collapsible="offcanvas"
        className="min-h-0"
        panelClassName="h-full bg-background"
      >
        <AnimatedSidebarContent className="gap-4 overflow-hidden px-2 py-4">
          <AnimatedSidebarGroup className="shrink-0 px-1 py-0">
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu className="gap-1">
                {[
                  { label: "New task", icon: MessageSquarePlus },
                  { label: "Search", icon: Search },
                  { label: "Runs", icon: Clock3 },
                ].map(({ label, icon: Icon }) => (
                  <AnimatedSidebarMenuItem key={label}>
                    <AnimatedSidebarMenuButton
                      icon={<Icon className="size-4" />}
                      onSelect={() => {}}
                      className="font-normal"
                    >
                      {label}
                    </AnimatedSidebarMenuButton>
                  </AnimatedSidebarMenuItem>
                ))}
              </AnimatedSidebarMenu>
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>

          <AnimatedSidebarGroup className="min-h-0 flex-1 px-1 py-0">
            <AnimatedSidebarGroupLabel className="mb-1 h-8 px-2 text-xs font-medium tracking-normal normal-case">
              Projects
            </AnimatedSidebarGroupLabel>
            <AnimatedSidebarGroupContent className="relative min-h-0 flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto overscroll-contain pb-8 [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <AISidebar
                  items={items}
                  activeId={activeResource}
                  defaultExpandedIds={["release", "evidence"]}
                  onActiveChange={setActiveResource}
                  onItemsChange={setItems}
                />
              </div>
              <div
                aria-hidden="true"
                className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t to-transparent"
              />
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>
        </AnimatedSidebarContent>
        <AnimatedSidebarRail />
      </AnimatedSidebar>

      <div
        data-slot="sidebar-inset"
        className="bg-background relative flex min-h-0 min-w-0 flex-1 flex-col"
      >
        <header className="border-border flex h-14 shrink-0 items-center justify-between border-b px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <AnimatedSidebarTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground">
              <PanelLeft className="size-4" />
            </AnimatedSidebarTrigger>
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-medium">
                Fieldwork synthesis
              </p>
              <p className="text-muted-foreground truncate text-[11px]">
                Fieldwork workspace · evidence review
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            Connected
          </span>
        </header>

        <MessageScroller
          busy={busy}
          navigation="rail"
          className="min-h-0 flex-1"
          viewportClassName="px-3 py-5 sm:px-5"
          contentClassName="mx-auto min-h-full w-full max-w-3xl"
        >
          <MessageGroup spacing="default">
            <Message from="user">
              <MessageAvatar>
                <User />
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>
                  <span>You</span>
                  <span>10:24</span>
                </MessageHeader>
                <MessageBubble variant="solid">
                  <MessageBubbleContent>
                    Review the Jaipur interviews, link every finding to its
                    evidence, and prepare a research-team readout.
                  </MessageBubbleContent>
                </MessageBubble>
              </MessageContent>
            </Message>

            <Message from="assistant">
              <MessageAvatar>
                <Bot />
              </MessageAvatar>
              <MessageContent className="gap-3">
                <MessageHeader>
                  <span>Fieldwork Agent</span>
                  <span>10:24</span>
                </MessageHeader>
                <AgentActivity
                  status="complete"
                  duration={6}
                  defaultOpen
                  collapseOnComplete={false}
                  items={[
                    {
                      id: "reason",
                      type: "text",
                      content:
                        "Tracing the interview notes and evidence boundary.",
                    },
                    {
                      id: "read",
                      type: "tool",
                      action: "read",
                      target: "interviews/summarize.ts",
                    },
                    {
                      id: "search",
                      type: "search",
                      query: "interview validation failures",
                      results: [
                        {
                          id: "result-1",
                          title: "Participant consent checklist",
                          domain: "fieldwork.local",
                          url: "https://example.com/fieldwork/consent",
                        },
                      ],
                    },
                  ]}
                />
                <TodoList
                  items={plan}
                  title="Study plan"
                  collapseOnComplete={false}
                />
              </MessageContent>
            </Message>

            <Message from="assistant">
              <MessageAvatar placeholder />
              <MessageContent>
                <ToolApproval
                  tool="terminal.run"
                  title="Run focused evidence checks?"
                  description="The agent needs permission to run evidence and privacy checks."
                  status={toolStatus}
                  defaultOpen
                  parameters={[
                    {
                      id: "command",
                      label: "Command",
                      value: (
                        <ToolApprovalCode
                          code="npm test fieldwork -- --coverage"
                          language="bash"
                        />
                      ),
                    },
                    { id: "scope", label: "Scope", value: "Current workspace" },
                  ]}
                  onApprove={approveTool}
                  onAlwaysAllow={approveTool}
                  onDeny={() => {
                    clearToolTimers()
                    setToolStatus("denied")
                  }}
                />
              </MessageContent>
            </Message>

            {toolStatus === "running" || toolStatus === "complete" ? (
              <Message from="assistant" animateIn>
                <MessageAvatar placeholder />
                <MessageContent className="gap-3">
                  <ToolResult
                    tool="terminal.run"
                    title={
                      toolStatus === "running"
                        ? "Running evidence checks"
                        : "Evidence checks passed"
                    }
                    status={toolStatus === "running" ? "running" : "success"}
                    kind="terminal"
                    meta={toolStatus === "running" ? "Live" : "2.8s"}
                    defaultOpen
                    collapseOnComplete={false}
                  >
                    <ToolResultOutput>
                      {toolStatus === "running"
                        ? "✓ participant consent\n… checking quote links"
                        : "✓ participant consent\n✓ quote links\n✓ location privacy"}
                    </ToolResultOutput>
                  </ToolResult>
                  {toolStatus === "complete" ? (
                    <>
                      <FileDiff
                        file="interviews/summarize.ts"
                        lines={diffLines}
                        status="complete"
                        defaultOpen
                        collapseOnComplete={false}
                      />
                      <CodeBlock
                        filename="validation.ts"
                        language="typescript"
                        status="complete"
                        code={
                          "export function validateInterview(interview: Interview) {\n  return schema.safeParse(interview);\n}"
                        }
                        showLineNumbers
                      />
                    </>
                  ) : null}
                </MessageContent>
              </Message>
            ) : toolStatus === "denied" || toolStatus === "error" ? (
              <Message from="assistant" animateIn>
                <MessageAvatar placeholder />
                <MessageContent>
                  <ToolResult
                    tool="terminal.run"
                    title="Evidence checks were not run"
                    status={toolStatus === "denied" ? "cancelled" : "error"}
                    kind="terminal"
                    defaultOpen
                    collapseOnComplete={false}
                  >
                    <ToolResultOutput>
                      {toolStatus === "denied"
                        ? "Permission was not granted. No command was run."
                        : "The command could not be completed."}
                    </ToolResultOutput>
                  </ToolResult>
                </MessageContent>
              </Message>
            ) : null}

            {toolStatus === "complete" ? (
              <Message from="assistant" animateIn>
                <MessageAvatar placeholder />
                <MessageContent className="gap-3">
                  <ImageGeneration
                    status="complete"
                    prompt="a clear interview summary screen"
                    resolution="1280 × 840"
                    size="compact"
                  >
                    <GeneratedPreview />
                  </ImageGeneration>
                  <MessageBubble variant="ghost" className="w-full">
                    <MessageBubbleContent>
                      <StreamingResponse
                        status="complete"
                        copyText="The fieldwork synthesis is ready for review."
                        sources={[
                          {
                            id: "message",
                            title: "Station 4 walkthrough",
                            domain: "fieldwork.local",
                            url: "https://example.com/fieldwork/walkthrough",
                          },
                          {
                            id: "diff",
                            title: "Rider interview synthesis",
                            domain: "research.local",
                            url: "https://example.com/fieldwork/interviews",
                          },
                          {
                            id: "approval",
                            title: "Step-free route observation log",
                            domain: "fieldwork.local",
                            url: "https://example.com/fieldwork/routes",
                          },
                        ]}
                      >
                        <p>The fieldwork synthesis is ready for review.</p>
                        <ul>
                          <li>
                            Twelve interviews are linked to consent records.
                          </li>
                          <li>Each finding retains its supporting quotes.</li>
                          <li>
                            Station locations are generalized for privacy.
                          </li>
                        </ul>
                      </StreamingResponse>
                    </MessageBubbleContent>
                  </MessageBubble>
                </MessageContent>
              </Message>
            ) : null}

            {toolStatus === "complete" ? (
              <Message from="assistant" animateIn>
                <MessageAvatar placeholder />
                <MessageContent>
                  <ApprovalCard
                    questions={approvalQuestions}
                    status={approvalStatus}
                    onSubmit={() => {
                      setApprovalStatus("submitting")
                      clearApprovalTimers()
                      approvalTimers.current.push(
                        window.setTimeout(
                          () => setApprovalStatus("answered"),
                          650
                        )
                      )
                    }}
                    result="Research direction sent to the agent."
                  />
                </MessageContent>
              </Message>
            ) : null}

            {messages.map((message) => (
              <Message key={message.id} from={message.from} animateIn>
                {message.from === "assistant" ? (
                  <MessageAvatar>
                    <Bot />
                  </MessageAvatar>
                ) : (
                  <MessageAvatar>
                    <User />
                  </MessageAvatar>
                )}
                <MessageContent>
                  {message.from === "assistant" ? (
                    <AssistantIdentity label="Fieldwork Agent" />
                  ) : null}
                  <MessageBubble
                    variant={message.from === "user" ? "solid" : "soft"}
                  >
                    <MessageBubbleContent>
                      {message.from === "assistant" ? (
                        <StreamingResponse
                          status={message.streaming ? "streaming" : "complete"}
                          showActions={!message.streaming}
                          copyText={message.content}
                        >
                          {message.content}
                        </StreamingResponse>
                      ) : (
                        message.content
                      )}
                    </MessageBubbleContent>
                  </MessageBubble>
                  {message.from === "user" ? (
                    <MessageFooter>Sent</MessageFooter>
                  ) : null}
                </MessageContent>
              </Message>
            ))}

            {pending ? (
              <Message from="assistant" animateIn>
                <MessageAvatar>
                  <Bot />
                </MessageAvatar>
                <MessageContent>
                  <ThinkingShimmer>Reviewing your direction</ThinkingShimmer>
                </MessageContent>
              </Message>
            ) : null}
          </MessageGroup>
        </MessageScroller>

        <div className="border-border bg-background shrink-0 border-t p-3">
          <div className="mx-auto max-w-3xl">
            <PromptInput
              value={input}
              onValueChange={setInput}
              loading={busy}
              onStop={stop}
              onSubmit={submit}
              minRows={1}
              maxRows={4}
              placeholder="Ask the agent to continue…"
              models={[
                { value: "balanced", label: "Balanced" },
                { value: "fast", label: "Fast" },
                { value: "deep", label: "Deep reasoning" },
              ]}
              defaultModel="balanced"
              actions={[
                { value: "attach", label: "Attach file", icon: <Paperclip /> },
                {
                  value: "project",
                  label: "Add project context",
                  icon: <FolderKanban />,
                },
                {
                  value: "skill",
                  label: "Use a skill",
                  icon: <WandSparkles />,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </ChatApp>
  )
}
