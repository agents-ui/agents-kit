"use client"

import { AgentActivity } from "@/components/beui/components/agents/agent-activity"
import { AISidebar } from "@/components/beui/components/agents/ai-sidebar"
import { ApprovalCard } from "@/components/beui/components/agents/approval-card"
import { ChatApp } from "@/components/beui/components/agents/chat-app"
import {
  Citation,
  Citations,
} from "@/components/beui/components/agents/citations"
import { CodeBlock } from "@/components/beui/components/agents/code-block"
import { FileDiff } from "@/components/beui/components/agents/file-diff"
import { ImageGeneration } from "@/components/beui/components/agents/image-generation"
import { AgentProgress } from "@/components/beui/components/agents/loading-states/agent-progress"
import { ReasoningText } from "@/components/beui/components/agents/loading-states/reasoning-text"
import { ThinkingShimmer } from "@/components/beui/components/agents/loading-states/thinking-shimmer"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
  MessageScroller,
} from "@/components/beui/components/agents/message"
import {
  MessageBubble,
  MessageBubbleCollapsible,
  MessageBubbleContent,
} from "@/components/beui/components/agents/message-bubble"
import { PromptInput } from "@/components/beui/components/agents/prompt-input"
import { StreamingResponse } from "@/components/beui/components/agents/streaming-response"
import { TodoList } from "@/components/beui/components/agents/todo-list"
import {
  ToolApproval,
  ToolApprovalCode,
} from "@/components/beui/components/agents/tool-approval"
import {
  ToolResult,
  ToolResultOutput,
} from "@/components/beui/components/agents/tool-result"
import {
  AnimatedSidebar,
  AnimatedSidebarContent,
  AnimatedSidebarHeader,
  AnimatedSidebarInset,
  AnimatedSidebarTrigger,
} from "@/components/beui/components/motion/animated-sidebar"
import {
  Loader,
  type LoaderVariant,
} from "@/components/beui/components/motion/loader"
import { Button } from "@/components/boardui/base/buttons/button"
import { Menu, Search } from "lucide-react"
import * as React from "react"

const sources = [
  {
    id: "forecast",
    title: "Q3 renewal forecast",
    domain: "renewals.example",
    url: "https://example.com/renewals",
  },
  {
    id: "playbook",
    title: "Enterprise renewal playbook",
    domain: "docs.example",
    url: "https://example.com/playbook",
  },
]

export function BeuiMessageBubblePreview() {
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-3">
      <MessageBubble align="start">
        <MessageBubbleContent>
          Four accounts require executive outreach this week.
        </MessageBubbleContent>
      </MessageBubble>
      <MessageBubble align="end" variant="solid">
        <MessageBubbleContent>
          Draft the briefing and keep CRM access read-only.
        </MessageBubbleContent>
      </MessageBubble>
      <MessageBubble align="start" variant="outline">
        <MessageBubbleCollapsible collapsedLines={2}>
          The recommendation is based on renewal value, product health, sponsor
          coverage, and support escalation history. Each account should retain
          its source references for review.
        </MessageBubbleCollapsible>
      </MessageBubble>
    </div>
  )
}

export function BeuiMessagePreview() {
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-4">
      <Message from="assistant">
        <MessageAvatar>RA</MessageAvatar>
        <MessageContent>
          <MessageHeader>Renewal analyst | 14:29</MessageHeader>
          <MessageBubble>
            <MessageBubbleContent>
              Analysis is complete. Twelve accounts are at risk.
            </MessageBubbleContent>
          </MessageBubble>
          <MessageFooter>2 sources | CRM read access</MessageFooter>
        </MessageContent>
      </Message>
      <Message from="user">
        <MessageContent>
          <MessageBubble variant="solid">
            <MessageBubbleContent>
              Show the four accounts that need action this week.
            </MessageBubbleContent>
          </MessageBubble>
        </MessageContent>
        <MessageAvatar>AG</MessageAvatar>
      </Message>
    </div>
  )
}

export function BeuiMessageScrollerPreview() {
  return (
    <MessageScroller
      className="border-separator-border mx-auto h-72 w-full max-w-[560px] rounded-2xl border"
      navigation="rail"
      busy
    >
      <div className="space-y-4 p-4">
        {[
          "Review the renewal workbook.",
          "The workbook contains 842 accounts.",
          "Compare health and sponsor coverage.",
          "Four accounts require executive outreach this week.",
        ].map((text, index) => (
          <Message key={text} from={index % 2 ? "assistant" : "user"}>
            <MessageContent>
              <MessageBubble variant={index % 2 ? "soft" : "solid"}>
                <MessageBubbleContent>{text}</MessageBubbleContent>
              </MessageBubble>
            </MessageContent>
          </Message>
        ))}
      </div>
    </MessageScroller>
  )
}

export function BeuiPromptInputPreview() {
  const [value, setValue] = React.useState(
    "Review the renewal workbook and draft a prioritized action plan."
  )
  const [model, setModel] = React.useState("balanced")
  const [loading, setLoading] = React.useState(false)
  const [activity, setActivity] = React.useState("Composer ready")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <PromptInput
        value={value}
        onValueChange={setValue}
        models={[
          { value: "balanced", label: "Balanced" },
          { value: "fast", label: "Fast" },
        ]}
        model={model}
        onModelChange={(next) => {
          setModel(next)
          setActivity(`Model selected: ${next}`)
        }}
        actions={[
          {
            value: "attach",
            label: "Attach file",
            description: "Add workspace context",
          },
          { value: "tools", label: "Select tools" },
        ]}
        onAction={(action) => setActivity(`Action selected: ${action}`)}
        onSubmit={(prompt) => {
          setLoading(true)
          setActivity(`Submitted: ${prompt}`)
        }}
        loading={loading}
        onStop={() => {
          setLoading(false)
          setActivity("Generation stopped")
        }}
      />
      <p className="text-text-secondary text-center text-xs">{activity}</p>
    </div>
  )
}

export function BeuiTodoListPreview() {
  return (
    <TodoList
      className="mx-auto w-full max-w-[560px]"
      title="Renewal briefing plan"
      defaultOpen
      items={[
        {
          id: "1",
          title: "Read renewal workbook",
          status: "completed",
          detail: "842 rows",
        },
        {
          id: "2",
          title: "Retrieve account notes",
          status: "completed",
          detail: "12 accounts",
        },
        {
          id: "3",
          title: "Compare renewal risk",
          status: "in-progress",
          progress: 68,
        },
        { id: "4", title: "Draft executive action plan", status: "pending" },
      ]}
    />
  )
}

export function BeuiCodeBlockPreview() {
  const [copied, setCopied] = React.useState(false)
  const code =
    "const highRisk = accounts.filter((account) => {\n  const score = renewalRisk(account)\n\n  return score >= 0.8 &&\n    account.renewalValue > 100_000\n})"
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <CodeBlock
        filename="renewal-risk.ts"
        language="typescript"
        status="complete"
        showLineNumbers
        highlightLines={[4, 5]}
        code={code}
        onCopy={() => {
          void navigator.clipboard?.writeText(code)
          setCopied(true)
        }}
      />
      <p className="text-text-secondary text-center text-xs">
        {copied ? "Code copied" : "Copy the generated code"}
      </p>
    </div>
  )
}

export function BeuiApprovalCardPreview() {
  const [status, setStatus] = React.useState<
    "pending" | "approved" | "rejected" | "answered"
  >("pending")
  const [result, setResult] = React.useState("Complete the two-step review")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <ApprovalCard
        title="Review follow-up tasks"
        description="Confirm the owner and allowed changes before continuing."
        status={status}
        questions={[
          {
            id: "owner",
            title: "Who should own the tasks?",
            options: [
              { value: "account", label: "Account owner" },
              { value: "renewal", label: "Renewal lead" },
            ],
            autoAdvance: true,
          },
          {
            id: "scope",
            title: "Which changes are allowed?",
            options: [
              { value: "tasks", label: "Create tasks" },
              { value: "dates", label: "Update due dates" },
              { value: "notify", label: "Notify owners" },
            ],
            multiple: true,
          },
        ]}
        onSubmit={(answers) => {
          setStatus("answered")
          setResult(`${Object.keys(answers).length} answers submitted`)
        }}
        onApprove={() => {
          setStatus("approved")
          setResult("Request approved")
        }}
        onReject={() => {
          setStatus("rejected")
          setResult("Request declined")
        }}
        submitLabel="Submit review"
        result={
          status === "answered"
            ? "Review submitted."
            : status === "approved"
              ? "Tasks approved for creation."
              : status === "rejected"
                ? "Request declined."
                : undefined
        }
      />
      <p className="text-text-secondary text-center text-xs">{result}</p>
    </div>
  )
}

export function BeuiFileDiffPreview() {
  const [copied, setCopied] = React.useState(false)
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <FileDiff
        file="briefing.md"
        language="text"
        status="complete"
        defaultOpen
        copyText="Priority accounts updated"
        onCopy={() => setCopied(true)}
        lines={[
          {
            id: "1",
            type: "context",
            oldLine: 18,
            newLine: 18,
            content: "## Priority accounts",
          },
          {
            id: "2",
            type: "removed",
            oldLine: 19,
            content: "- Review enterprise renewals",
          },
          {
            id: "3",
            type: "added",
            newLine: 19,
            content: "- Northstar: executive outreach by Friday",
          },
          {
            id: "4",
            type: "added",
            newLine: 20,
            content: "- Acme: confirm sponsor coverage",
          },
        ]}
      />
      <p className="text-text-secondary text-center text-xs">
        {copied ? "Diff copied" : "Expand or copy the file diff"}
      </p>
    </div>
  )
}

export function BeuiToolResultPreview() {
  const [status, setStatus] = React.useState<"running" | "success">("success")
  const [activity, setActivity] = React.useState("Result ready")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <ToolResult
        tool="crm.read_accounts"
        title={
          status === "running"
            ? "Retrieving CRM account notes"
            : "Retrieved CRM account notes"
        }
        status={status}
        kind="request"
        meta={status === "running" ? "Running" : "12 accounts  |  420 ms"}
        copyText="12 account records retrieved"
        onCopy={() => setActivity("Result copied")}
        onRetry={() => {
          setStatus("running")
          setActivity("Tool retried")
        }}
      >
        <ToolResultOutput>
          {
            '{\n  "records": 12,\n  "writeAccess": false,\n  "status": "complete"\n}'
          }
        </ToolResultOutput>
      </ToolResult>
      {status === "running" && (
        <Button
          size="xs"
          variant="secondary"
          onClick={() => {
            setStatus("success")
            setActivity("Tool completed")
          }}
        >
          Complete synthetic run
        </Button>
      )}
      <p className="text-text-secondary text-center text-xs">{activity}</p>
    </div>
  )
}

export function BeuiStreamingResponsePreview() {
  const [feedback, setFeedback] = React.useState<"up" | "down" | null>(null)
  const [status, setStatus] = React.useState<"complete" | "error">("complete")
  const [sourcesOpen, setSourcesOpen] = React.useState(false)
  const [activity, setActivity] = React.useState("Response ready")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <StreamingResponse
        status={status}
        copyText="Twelve accounts are at risk. Four require executive outreach this week."
        onCopy={() => setActivity("Response copied")}
        onRetry={() => {
          setStatus("complete")
          setActivity("Response restored")
        }}
        sources={sources}
        sourcesOpen={sourcesOpen}
        onSourcesOpenChange={setSourcesOpen}
        feedback={feedback}
        onFeedbackChange={(value) => {
          setFeedback(value)
          setActivity(value === "up" ? "Marked helpful" : "Marked for review")
        }}
      >
        <p>
          Twelve accounts are at risk, representing $1.84M in renewal value.
          Four require executive outreach this week{" "}
          <Citation citationId="forecast" index={1} idPrefix="response" />.
        </p>
      </StreamingResponse>
      <div className="flex items-center justify-center gap-2">
        <Button size="xs" variant="ghost" onClick={() => setStatus("error")}>
          Show error
        </Button>
        <span className="text-text-secondary text-xs">
          {activity}
          {sourcesOpen ? "  |  Sources expanded" : ""}
        </span>
      </div>
    </div>
  )
}

export function BeuiImageGenerationPreview() {
  const [status, setStatus] = React.useState<"refining" | "complete" | "error">(
    "complete"
  )
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-3">
      <div className="flex gap-2">
        <Button
          size="small"
          variant={status === "refining" ? "primary" : "secondary"}
          onClick={() => setStatus("refining")}
        >
          Refining
        </Button>
        <Button
          size="small"
          variant={status === "complete" ? "primary" : "secondary"}
          onClick={() => setStatus("complete")}
        >
          Complete
        </Button>
        <Button
          size="small"
          variant={status === "error" ? "primary" : "secondary"}
          onClick={() => setStatus("error")}
        >
          Error
        </Button>
      </div>
      <ImageGeneration
        status={status}
        prompt="A restrained cover image for the Q3 renewal briefing"
        resolution="1600 by 900"
        onRetry={() => setStatus("refining")}
      >
        <div className="grid aspect-video w-full place-items-center bg-neutral-200 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          Q3 renewal briefing
        </div>
      </ImageGeneration>
    </div>
  )
}

export function BeuiToolApprovalPreview() {
  const [status, setStatus] = React.useState<"pending" | "approved" | "denied">(
    "pending"
  )
  const [activity, setActivity] = React.useState("Review the requested scope")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <ToolApproval
        tool="salesforce.create_tasks"
        title="Create follow-up tasks?"
        description="Creates 12 reversible task records for the account owners."
        parameters={[
          { id: "count", label: "Records", value: "12" },
          { id: "scope", label: "Scope", value: "Task records only" },
          {
            id: "payload",
            label: "Fields",
            value: (
              <ToolApprovalCode
                language="json"
                code={'{"priority":"high","due":"Friday"}'}
              />
            ),
          },
        ]}
        status={status}
        defaultOpen
        onApprove={() => {
          setStatus("approved")
          setActivity("Allowed once")
        }}
        onDeny={() => {
          setStatus("denied")
          setActivity("Request denied")
        }}
        onAlwaysAllow={() => {
          setStatus("approved")
          setActivity("Access remembered for this workspace")
        }}
      />
      <p className="text-text-secondary text-center text-xs">{activity}</p>
    </div>
  )
}

export function BeuiCitationsPreview() {
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-4">
      <p className="text-sm leading-6">
        Four accounts need executive outreach this week{" "}
        <Citation citationId="forecast" index={1} idPrefix="citations" />. The
        recommended escalation follows the renewal playbook{" "}
        <Citation citationId="playbook" index={2} idPrefix="citations" />.
      </p>
      <Citations citations={sources} idPrefix="citations" defaultOpen />
    </div>
  )
}

export function BeuiAgentActivityPreview() {
  return (
    <AgentActivity
      className="mx-auto w-full max-w-[560px]"
      status="working"
      duration={198}
      maxHeight={260}
      items={[
        {
          id: "1",
          type: "step",
          label: "Read renewals_q3.csv",
          status: "complete",
          meta: "842 rows",
        },
        {
          id: "2",
          type: "search",
          query: "Enterprise renewal risk signals",
          results: [
            { id: "r1", title: "Renewal playbook", domain: "docs.example" },
          ],
        },
        { id: "3", type: "tool", action: "read", target: "CRM account notes" },
        {
          id: "4",
          type: "trace",
          kind: "write",
          label: "Draft executive action plan",
          detail: "Comparing risk with renewal value",
        },
      ]}
    />
  )
}

type LoadingMode = "thinking" | "reasoning" | "progress" | "loaders"
const loaderVariants: LoaderVariant[] = [
  "spinner",
  "dots",
  "metaballs",
  "morph",
  "comet",
  "helix",
]
export function BeuiLoadingStatesPreview() {
  const [mode, setMode] = React.useState<LoadingMode>("thinking")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-5">
      <div className="flex flex-wrap gap-2">
        {(
          ["thinking", "reasoning", "progress", "loaders"] as LoadingMode[]
        ).map((item) => (
          <Button
            key={item}
            size="small"
            variant={mode === item ? "primary" : "secondary"}
            onClick={() => setMode(item)}
          >
            {item === "loaders"
              ? "Loader variants"
              : item[0].toUpperCase() + item.slice(1)}
          </Button>
        ))}
      </div>
      <div className="border-separator-border bg-background-secondary-default grid min-h-52 place-items-center rounded-2xl border p-6">
        {mode === "thinking" && (
          <ThinkingShimmer>Reviewing renewal evidence</ThinkingShimmer>
        )}
        {mode === "reasoning" && (
          <ReasoningText
            phrases={[
              "Reading the workbook",
              "Comparing account health",
              "Drafting the action plan",
            ]}
            indicator={<Loader variant="metaballs" size={18} />}
          />
        )}
        {mode === "progress" && (
          <AgentProgress label="Preparing briefing" initialSeconds={42} />
        )}
        {mode === "loaders" && (
          <div className="grid grid-cols-3 gap-8">
            {loaderVariants.map((variant) => (
              <div key={variant} className="grid place-items-center gap-2">
                <Loader
                  variant={variant}
                  size={28}
                  label={`${variant} loader`}
                />
                <span className="text-text-secondary text-xs">{variant}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const sidebarItems = [
  {
    id: "renewal",
    label: "Renewal review",
    kind: "project" as const,
    children: [
      { id: "brief", label: "Q3 renewal briefing", kind: "file" as const },
      {
        id: "sources",
        label: "Source notes",
        kind: "folder" as const,
        children: [
          { id: "workbook", label: "renewals_q3.csv", kind: "file" as const },
        ],
      },
    ],
  },
  {
    id: "playbooks",
    label: "Playbooks",
    kind: "folder" as const,
    children: [
      {
        id: "enterprise",
        label: "Enterprise renewal",
        kind: "bookmark" as const,
      },
    ],
  },
]
export function BeuiAISidebarPreview() {
  const [active, setActive] = React.useState("brief")
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-2">
      <div className="border-separator-border h-[440px] overflow-hidden rounded-2xl border">
        <AISidebar
          defaultItems={sidebarItems}
          activeId={active}
          onActiveChange={setActive}
          defaultExpandedIds={["renewal", "sources", "playbooks"]}
        />
      </div>
      <p className="text-text-secondary text-center text-xs">
        Selected resource: {active}
      </p>
    </div>
  )
}

export function BeuiChatAppPreview() {
  const [value, setValue] = React.useState("")
  const [messages, setMessages] = React.useState([
    "Twelve accounts are at risk. Four require executive outreach this week.",
  ])
  const [active, setActive] = React.useState("brief")
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <ChatApp className="h-[520px] min-h-0" defaultOpen sidebarWidth="15rem">
        <AnimatedSidebar
          collapsible="offcanvas"
          panelClassName="bg-background-secondary-default"
        >
          <AnimatedSidebarHeader className="flex items-center justify-between p-3">
            <span className="text-sm font-medium">Renewal workspace</span>
          </AnimatedSidebarHeader>
          <AnimatedSidebarContent className="p-2">
            <AISidebar
              defaultItems={sidebarItems}
              activeId={active}
              onActiveChange={setActive}
              defaultExpandedIds={["renewal"]}
            />
          </AnimatedSidebarContent>
        </AnimatedSidebar>
        <AnimatedSidebarInset className="min-h-0">
          <header className="border-separator-border flex h-12 items-center gap-2 border-b px-3">
            <AnimatedSidebarTrigger aria-label="Toggle workspace">
              <Menu className="size-4" />
            </AnimatedSidebarTrigger>
            <span className="text-sm font-medium">Q3 renewal briefing</span>
            <Search className="text-text-secondary ml-auto size-4" />
          </header>
          <MessageScroller className="min-h-0 flex-1">
            <div className="space-y-4 p-4">
              {messages.map((text, index) => (
                <Message
                  key={`${text}-${index}`}
                  from={index === 0 ? "assistant" : "user"}
                >
                  <MessageContent>
                    <MessageBubble variant={index === 0 ? "soft" : "solid"}>
                      <MessageBubbleContent>{text}</MessageBubbleContent>
                    </MessageBubble>
                    {index === 0 && (
                      <MessageFooter>2 sources | Updated 14:32</MessageFooter>
                    )}
                  </MessageContent>
                </Message>
              ))}
            </div>
          </MessageScroller>
          <div className="border-separator-border border-t p-3">
            <PromptInput
              value={value}
              onValueChange={setValue}
              onSubmit={(text) => {
                setMessages((current) => [...current, text])
                setValue("")
              }}
              placeholder="Ask about this workspace"
            />
          </div>
        </AnimatedSidebarInset>
      </ChatApp>
    </div>
  )
}
