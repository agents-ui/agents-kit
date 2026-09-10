"use client"

import {
  Check,
  Clipboard,
  Copy,
  Database,
  FileUp,
  Hammer,
  Info,
  Search,
  Send,
  ThumbsUp,
} from "lucide-react"
import * as React from "react"

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtItem,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger,
} from "@/components/prompt-kit/chain-of-thought"
import { ChatContainerContent, ChatContainerRoot } from "@/components/prompt-kit/chat-container"
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from "@/components/prompt-kit/code-block"
import { FeedbackBar } from "@/components/prompt-kit/feedback-bar"
import { FileUpload, FileUploadContent, FileUploadTrigger } from "@/components/prompt-kit/file-upload"
import { Image } from "@/components/prompt-kit/image"
import { JSXPreview } from "@/components/prompt-kit/jsx-preview"
import { Loader } from "@/components/prompt-kit/loader"
import { Markdown } from "@/components/prompt-kit/markdown"
import { Message, MessageAction, MessageActions, MessageAvatar, MessageContent } from "@/components/prompt-kit/message"
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/prompt-kit/prompt-input"
import { PromptSuggestion } from "@/components/prompt-kit/prompt-suggestion"
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/prompt-kit/reasoning"
import { ResponseStream, useTextStream } from "@/components/prompt-kit/response-stream"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { Source, SourceContent, SourceTrigger } from "@/components/prompt-kit/source"
import { Steps, StepsBar, StepsContent, StepsItem, StepsTrigger } from "@/components/prompt-kit/steps"
import { SystemMessage } from "@/components/prompt-kit/system-message"
import { TextShimmer } from "@/components/prompt-kit/text-shimmer"
import { ThinkingBar } from "@/components/prompt-kit/thinking-bar"
import { Tool, type ToolPart } from "@/components/prompt-kit/tool"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const fieldImage = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTYwIDEwMCI+PHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMDAiIHJ4PSIxOCIgZmlsbD0iIzE0MjUxYyIvPjxwYXRoIGQ9Ik0yMCA3MGMyMC0zMiAzNC04IDUyLTI4czI4IDEwIDQ4LTE0IDE4IDE4IDIwIDMwIiBmaWxsPSJub25lIiBzdHJva2U9IiM3NmQ4OWEiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGNpcmNsZSBjeD0iMTIwIiBjeT0iMjgiIHI9IjciIGZpbGw9IiNkOGYzZGYiLz48L3N2Zz4="

export type PromptKitExampleProps = { family: string; variant: string }

const Frame = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("mx-auto w-full max-w-2xl p-4", className)} data-prompt-kit-example="">{children}</div>
)

function ChainExample({ advanced }: { advanced: boolean }) {
  const items: Array<{ body: string; icon?: typeof Search; title: string }> = advanced
    ? [{ icon: Search, title: "Review the survey scope", body: "Confirm stations, dates, and missing readings." }, { icon: Database, title: "Compare observations", body: "Trace each change to its source record." }, { icon: Check, title: "Prepare the brief", body: "Separate findings from unresolved questions." }]
    : [{ title: "Understand the request", body: "Identify the requested region and time window." }, { title: "Inspect the evidence", body: "Compare notes without inventing missing readings." }, { title: "Choose the response", body: "Return findings with source boundaries." }]
  return <Frame><ChainOfThought>{items.map(({ icon: Icon, title, body }, index) => <ChainOfThoughtStep defaultOpen key={title}><ChainOfThoughtTrigger leftIcon={Icon ? <Icon className="size-4" /> : undefined}>{title}</ChainOfThoughtTrigger><ChainOfThoughtContent><ChainOfThoughtItem className={index === items.length - 1 ? "text-foreground" : undefined}>{body}</ChainOfThoughtItem></ChainOfThoughtContent></ChainOfThoughtStep>)}</ChainOfThought></Frame>
}

function ChatContainerExample({ custom }: { custom: boolean }) {
  return <Frame><ChatContainerRoot className={cn("h-64 rounded-xl border", custom && "bg-muted/30 shadow-inner")}><ChatContainerContent className="gap-4 p-4">{Array.from({ length: 8 }, (_, index) => <div className="rounded-lg border bg-background p-3 text-sm" key={index}><strong>Observation {index + 1}</strong><p className="text-muted-foreground">Field note preserved with its timestamp.</p></div>)}</ChatContainerContent></ChatContainerRoot></Frame>
}

function CodeExample({ variant }: { variant: string }) {
  const language = variant.includes("python") ? "python" : variant.includes("css") ? "css" : "tsx"
  const theme = variant.includes("nord") ? "nord" : variant.includes("themed") ? "github-dark" : "github-light"
  const code = language === "python" ? "def summarize(notes):\n    return [note for note in notes if note.verified]" : language === "css" ? ".field-note {\n  border-left: 2px solid currentColor;\n}" : "export function Finding() {\n  return <p>Reading verified</p>\n}"
  return <Frame><CodeBlock>{variant.includes("header") && <CodeBlockGroup className="border-b px-4 py-2 text-xs text-muted-foreground"><span>fieldwork.{language}</span><Button aria-label="Copy code" size="sm" variant="ghost"><Copy className="size-3.5" /></Button></CodeBlockGroup>}<CodeBlockCode code={code} language={language} theme={theme} /></CodeBlock></Frame>
}

function FileUploadExample() {
  const [files, setFiles] = React.useState<string[]>([])
  return <Frame><FileUpload onFilesAdded={(items) => setFiles(items.map((file) => file.name))}><FileUploadTrigger asChild><Button className="gap-2" variant="outline"><FileUp className="size-4" />Add field evidence</Button></FileUploadTrigger><FileUploadContent><div className="rounded-2xl border bg-background p-8 text-center shadow-xl">Drop field evidence here</div></FileUploadContent></FileUpload><p className="mt-3 text-sm text-muted-foreground" role="status">{files.length ? files.join(", ") : "No files selected"}</p></Frame>
}

function LoaderExample({ variant }: { variant: string }) {
  const variants = ["circular", "classic", "pulse", "pulse-dot", "dots", "typing", "wave", "bars", "terminal", "text-blink", "text-shimmer", "loading-dots"] as const
  if (variant.includes("sizes")) return <Frame className="flex items-center justify-center gap-8"><Loader size="sm" /><Loader size="md" /><Loader size="lg" /></Frame>
  if (variant.includes("text")) return <Frame className="flex flex-col items-center gap-4"><Loader text="Checking field notes" variant="text-blink" /><Loader text="Checking field notes" variant="text-shimmer" /><Loader text="Checking field notes" variant="loading-dots" /></Frame>
  return <Frame className="grid grid-cols-4 place-items-center gap-8">{variants.map((item) => <Loader key={item} variant={item} />)}</Frame>
}

function MessageExample({ variant }: { variant: string }) {
  const markdown = variant.includes("markdown")
  const actions = variant.includes("actions")
  return <Frame><Message><MessageAvatar alt="Field assistant" fallback="FA" src="/placeholder.svg" /><div className="flex-1"><MessageContent markdown={markdown}>{markdown ? "### Survey update\n\nFour readings are **verified**." : "Four upstream readings are verified."}</MessageContent>{actions && <MessageActions className="mt-2"><MessageAction tooltip="Copy"><Button aria-label="Copy" size="sm" variant="ghost"><Clipboard className="size-4" /></Button></MessageAction><MessageAction tooltip="Helpful"><Button aria-label="Helpful" size="sm" variant="ghost"><ThumbsUp className="size-4" /></Button></MessageAction></MessageActions>}</div></Message></Frame>
}

function PromptInputExample({ actions }: { actions: boolean }) {
  const [value, setValue] = React.useState("")
  const [sent, setSent] = React.useState(false)
  const submit = () => { if (value.trim()) { setSent(true); setValue("") } }
  return <Frame><PromptInput className="p-0" onSubmit={submit} onValueChange={setValue} value={value}><PromptInputTextarea className="px-4 pt-3" placeholder="Ask about the field notes" />{actions && <PromptInputActions className="justify-between p-2"><PromptInputAction tooltip="Attach evidence"><Button aria-label="Attach evidence" size="sm" variant="ghost"><FileUp className="size-4" /></Button></PromptInputAction><Button aria-label="Send" className="rounded-full" disabled={!value.trim()} onClick={submit} size="sm"><Send className="size-4" /></Button></PromptInputActions>}</PromptInput><p className="mt-2 text-xs text-muted-foreground" role="status">{sent ? "Prompt sent locally" : "Interactive prompt"}</p></Frame>
}

function SuggestionExample({ variant }: { variant: string }) {
  if (variant.includes("highlight")) return <Frame className="space-y-1"><PromptSuggestion highlight="Compare">Compare survey runs</PromptSuggestion><PromptSuggestion highlight="Flag">Flag missing evidence</PromptSuggestion></Frame>
  if (variant.includes("variants")) return <Frame className="flex flex-wrap gap-2"><PromptSuggestion>Outline findings</PromptSuggestion><PromptSuggestion variant="secondary">Map evidence</PromptSuggestion><PromptSuggestion variant="ghost">List gaps</PromptSuggestion></Frame>
  return <Frame className="flex flex-wrap gap-2"><PromptSuggestion>Summarize notes</PromptSuggestion><PromptSuggestion>Draft report</PromptSuggestion></Frame>
}

function ReasoningExample({ markdown }: { markdown: boolean }) {
  return <Frame><Reasoning open><ReasoningTrigger>{markdown ? "Show evidence reasoning" : "Show reasoning"}</ReasoningTrigger><ReasoningContent className="mt-2 border-l-2 pl-3" markdown={markdown}>{markdown ? "### Evidence check\n\n- Four readings agree\n- Two timestamps overlap" : "I compared timestamps, station IDs, and the rainfall log before drafting the finding."}</ReasoningContent></Reasoning></Frame>
}

function StreamingMarkdown() {
  const { displayedText } = useTextStream({ mode: "typewriter", speed: 80, textStream: "## Live field brief\n\nFour readings are **verified**." })
  return <Markdown>{displayedText}</Markdown>
}

function ResponseExample({ variant }: { variant: string }) {
  const text = "The field brief is arriving progressively while each observation keeps its source."
  return <Frame>{variant.includes("markdown") ? <StreamingMarkdown /> : variant.includes("use-text") ? <ResponseStream fadeDuration={800} mode="fade" segmentDelay={20} textStream={text} /> : <ResponseStream fadeDuration={900} mode={variant.includes("fade") ? "fade" : "typewriter"} speed={45} textStream={text} />}</Frame>
}

function ScrollExample({ variant }: { variant: string }) {
  return <Frame><ChatContainerRoot className="relative h-64 rounded-xl border"><ChatContainerContent className="gap-3 p-4">{Array.from({ length: 14 }, (_, index) => <div className="rounded-lg bg-muted p-3 text-sm" key={index}>Field note {index + 1}</div>)}</ChatContainerContent><ScrollButton className="absolute right-4 bottom-4" variant={variant.includes("custom") ? "secondary" : "outline"} /></ChatContainerRoot></Frame>
}

function SourceExample({ custom }: { custom: boolean }) {
  return <Frame className="flex flex-wrap justify-center gap-2"><Source href="https://github.com/ibelick/prompt-kit"><SourceTrigger label={custom ? 1 : undefined} showFavicon={!custom} /><SourceContent description="Pinned open-source component source." title="Prompt Kit source" /></Source><Source href="https://developer.mozilla.org"><SourceTrigger label={custom ? "Protocol" : undefined} showFavicon={!custom} /><SourceContent description="Reference used to verify browser behavior." title="Web platform reference" /></Source></Frame>
}

function StepsExample({ variant }: { variant: string }) {
  const withIcon = variant.includes("icon")
  return <Frame><Steps defaultOpen><StepsTrigger leftIcon={withIcon ? <Hammer className="size-4" /> : undefined}>{variant.includes("source") ? "Review cited evidence" : variant.includes("loader") ? <Loader text="Checking every note" variant="text-shimmer" /> : "Agent run: compare field notes"}</StepsTrigger><StepsContent bar={withIcon ? <StepsBar className="ml-1.5" /> : undefined}><StepsItem>Read station observations</StepsItem><StepsItem>Compare timestamps</StepsItem><StepsItem className="text-foreground">Prepare verified findings</StepsItem>{variant.includes("source") && <Source href="https://developer.mozilla.org"><SourceTrigger label="Protocol" /><SourceContent description="Collection protocol reference." title="Field protocol" /></Source>}</StepsContent></Steps></Frame>
}

function SystemExample({ variant }: { variant: string }) {
  if (variant.includes("variants")) return <Frame className="space-y-3"><SystemMessage>Context updated</SystemMessage><SystemMessage fill variant="warning">Two readings need review</SystemMessage><SystemMessage variant="error">Station feed unavailable</SystemMessage></Frame>
  return <Frame><SystemMessage cta={variant.includes("cta") ? { label: "Review", onClick: () => {} } : undefined} fill={variant.includes("cta")} variant={variant.includes("cta") ? "warning" : "action"}>The field brief uses the latest verified notes.</SystemMessage></Frame>
}

function TextShimmerExample({ variant }: { variant: string }) {
  return <Frame className="text-center text-lg"><TextShimmer duration={variant.includes("duration") ? 1.5 : 4} spread={variant.includes("spread") ? 40 : 20}>Checking field evidence</TextShimmer></Frame>
}

function ThinkingExample() {
  const [message, setMessage] = React.useState("Researching field notes")
  return <Frame><ThinkingBar onClick={() => setMessage("Opened reasoning")} onStop={() => setMessage("Answer requested now")} stopLabel="Answer now" text="Comparing observations" /><p className="mt-3 text-xs text-muted-foreground" role="status">{message}</p></Frame>
}

const toolStates: ToolPart["state"][] = ["input-streaming", "input-available", "output-available", "output-error"]
function ToolExample({ states }: { states: boolean }) {
  const make = (state: ToolPart["state"]): ToolPart => ({ errorText: state === "output-error" ? "Station feed unavailable" : undefined, input: { station: "R-14" }, output: state === "output-available" ? { readings: 12, verified: 10 } : undefined, state, toolCallId: `field-${state}`, type: "tool-check_station" })
  return <Frame>{(states ? toolStates : ["output-available" as const]).map((state) => <Tool defaultOpen={!states} key={state} toolPart={make(state)} />)}</Frame>
}

function LocalChatbot({ tools }: { tools: boolean }) {
  const [messages, setMessages] = React.useState(["Compare the latest station notes."])
  const [value, setValue] = React.useState("")
  const [working, setWorking] = React.useState(false)
  const send = () => {
    if (!value.trim() || working) return
    setMessages((current) => [...current, value.trim()])
    setValue("")
    setWorking(true)
    window.setTimeout(() => { setMessages((current) => [...current, tools ? "Station lookup completed." : "Four readings agree; two need review."]); setWorking(false) }, 650)
  }
  return <Frame><div className="flex h-[420px] flex-col overflow-hidden rounded-2xl border bg-background"><ChatContainerRoot className="flex-1"><ChatContainerContent className="gap-4 p-4">{messages.map((item, index) => <Message className={index % 2 ? "justify-start" : "justify-end"} key={`${item}-${index}`}><MessageContent className={index % 2 ? "bg-muted" : "bg-primary text-primary-foreground"}>{item}</MessageContent></Message>)}{tools && <Tool toolPart={{ input: { station: "R-14" }, output: { readings: 12 }, state: "output-available", toolCallId: "field-14", type: "tool-check_station" }} />}{working && <Loader variant="dots" />}</ChatContainerContent></ChatContainerRoot><PromptInput className="m-3 p-0" isLoading={working} onSubmit={send} onValueChange={setValue} value={value}><PromptInputTextarea className="px-4 pt-3" placeholder={tools ? "Ask the field tools" : "Ask the field assistant"} /><PromptInputActions className="justify-end p-2"><Button aria-label="Send" className="rounded-full" disabled={!value.trim() || working} onClick={send} size="sm"><Send className="size-4" /></Button></PromptInputActions></PromptInput></div></Frame>
}

export function PromptKitExample({ family, variant }: PromptKitExampleProps) {
  switch (family) {
    case "chain-of-thought": return <ChainExample advanced={variant.includes("advanced")} />
    case "chat-container": return <ChatContainerExample custom={variant.includes("custom")} />
    case "code-block": return <CodeExample variant={variant} />
    case "feedback-bar": return <Frame><FeedbackBar icon={<Info className="size-4" />} title="Was this field brief useful?" /></Frame>
    case "file-upload": return <FileUploadExample />
    case "image": return <Frame className="flex flex-col items-center gap-3"><Image alt="Abstract river survey trace" base64={fieldImage} className="h-32 w-52" mediaType="image/svg+xml" /><span className="text-xs text-muted-foreground">Generated field trace</span></Frame>
    case "jsx-preview": return <Frame><JSXPreview isStreaming={variant.includes("streaming")} jsx={variant.includes("streaming") ? '<div className="rounded-xl border p-4"><strong>Survey streaming' : '<div className="rounded-xl border p-4"><strong>Survey complete</strong><p>12 readings checked</p></div>'} /></Frame>
    case "loader": return <LoaderExample variant={variant} />
    case "markdown": return <Frame><Markdown components={variant.includes("custom") ? { strong: ({ children }) => <strong className="text-emerald-600">{children}</strong> } : undefined}>{"## Field brief\n\nFour readings are **verified**.\n\n- Sources preserved\n- Gaps marked"}</Markdown></Frame>
    case "message": return <MessageExample variant={variant} />
    case "prompt-input": return <PromptInputExample actions={variant.includes("actions")} />
    case "prompt-suggestion": return <SuggestionExample variant={variant} />
    case "reasoning": return <ReasoningExample markdown={variant.includes("markdown")} />
    case "response-stream": return <ResponseExample variant={variant} />
    case "scroll-button": return <ScrollExample variant={variant} />
    case "source": return <SourceExample custom={variant.includes("custom")} />
    case "steps": return <StepsExample variant={variant} />
    case "system-message": return <SystemExample variant={variant} />
    case "text-shimmer": return <TextShimmerExample variant={variant} />
    case "thinking-bar": return <ThinkingExample />
    case "tool": return <ToolExample states={variant.includes("states")} />
    case "chatbot": return <LocalChatbot tools={false} />
    case "tool-calling": return <LocalChatbot tools />
    default: return null
  }
}
