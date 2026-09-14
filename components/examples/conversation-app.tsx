"use client"

import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/prompt-kit/chat-container"
import { Loader } from "@/components/prompt-kit/loader"
import { Message, MessageContent } from "@/components/prompt-kit/message"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { PromptSuggestion } from "@/components/prompt-kit/prompt-suggestion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { AgentTrackToggle } from "@/components/voice-agents/livekit/agent-track-toggle"
import { Shdr21 } from "@/components/voice-agents/orbkit/shdr-21"
import { cn } from "@/lib/utils"
import {
  ArrowUp,
  AudioLines,
  FileText,
  Paperclip,
  Square,
  X,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import {
  researchAnswer,
  researchProjects,
  type ResearchNote,
} from "./research-workflow"

type Turn = {
  id: number
  role: "user" | "assistant"
  text: string
  input: "text" | "voice"
}
const starters = [
  "Summarize the dock interviews",
  "What should the team change first?",
]
const sampleSpokenQuestion = "What is slowing down the dock handoff?"

/** Composition of kit components with shared text and voice demo state. */
export function ConversationAppExample({
  initialVoice = false,
  className,
}: {
  initialVoice?: boolean
  className?: string
} = {}) {
  const [voice, setVoice] = useState(initialVoice)
  const [phase, setPhase] = useState<"idle" | "thinking" | "speaking">("idle")
  const [draft, setDraft] = useState("")
  const [turns, setTurns] = useState<Turn[]>([])
  const [muted, setMuted] = useState(false)
  const [concise, setConcise] = useState(true)
  const [attachment, setAttachment] = useState<ResearchNote | null>(null)
  const [notice, setNotice] = useState("")
  const sequence = useRef(0)
  const attachmentVersion = useRef(0)
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const composer = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const centered = !voice && turns.length === 0
  const thinking = phase === "thinking"

  const clearTimers = () => {
    if (replyTimer.current) clearTimeout(replyTimer.current)
    if (settleTimer.current) clearTimeout(settleTimer.current)
    replyTimer.current = null
    settleTimer.current = null
  }
  useEffect(() => clearTimers, [])

  const send = (text: string, input: Turn["input"] = "text") => {
    if (!text.trim() || thinking || (input === "voice" && muted)) return
    clearTimers()
    const answer = researchAnswer(
      text,
      attachment ? [attachment] : researchProjects[0].notes,
      concise
    )
    const turn: Turn = {
      id: ++sequence.current,
      role: "user",
      text: text.trim(),
      input,
    }
    setTurns((current) => [...current, turn])
    if (input === "text") setDraft("")
    setNotice("")
    setPhase("thinking")
    replyTimer.current = setTimeout(() => {
      const reply: Turn = {
        id: ++sequence.current,
        role: "assistant",
        text: answer,
        input,
      }
      setTurns((current) => [...current, reply])
      setPhase("speaking")
      replyTimer.current = null
      settleTimer.current = setTimeout(() => {
        setPhase("idle")
        settleTimer.current = null
      }, 1800)
    }, 900)
  }
  const toggleVoice = () => {
    setVoice((current) => !current)
    setNotice("")
    requestAnimationFrame(() =>
      composer.current?.querySelector("textarea")?.focus()
    )
  }
  const stop = () => {
    clearTimers()
    setPhase("idle")
    setNotice("Response stopped. You can continue the conversation.")
  }
  const reset = () => {
    clearTimers()
    setTurns([])
    setDraft("")
    setVoice(initialVoice)
    setPhase("idle")
    setMuted(false)
    setConcise(true)
    attachmentVersion.current += 1
    setAttachment(null)
    setNotice("")
  }
  const attach = async (file?: File) => {
    if (!file) return
    const version = ++attachmentVersion.current
    if (!/\.(txt|md|csv)$/i.test(file.name) || file.size > 64 * 1024) {
      setNotice("Choose a text, Markdown, or CSV note under 64 KB.")
      return
    }
    try {
      const text = await file.text()
      if (version !== attachmentVersion.current) return
      setAttachment({ id: file.name, title: file.name, text })
      setNotice("")
    } catch {
      if (version === attachmentVersion.current)
        setNotice("That note could not be read. Try another file.")
    }
  }
  const stateLabel = thinking
    ? "Thinking"
    : phase === "speaking"
      ? "Speaking"
      : muted
        ? "Microphone muted"
        : "Listening"

  return (
    <section
      aria-label="Fieldwork conversation"
      data-conversation-preview
      data-app-example={initialVoice ? "voice" : "chat"}
      className={cn(
        "bg-background text-foreground flex h-dvh min-h-[560px] flex-col",
        className
      )}
    >
      <header className="border-border flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 sm:px-8">
        <div className="min-w-0">
          <p className="text-sm font-medium">Fieldwork assistant</p>
          <p className="text-muted-foreground truncate text-xs">
            Agents Kit · Conversation example
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="text-muted-foreground text-xs"
          >
            Reset preview
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="relative mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-4 sm:px-6">
        <ChatContainerRoot data-transcript className="min-h-0 flex-1">
          <ChatContainerContent className="gap-6 px-1 pt-8 pb-8 sm:px-2">
            {turns.map((turn) => (
              <Message
                key={turn.id}
                data-turn={turn.id}
                data-input={turn.input}
                className={cn(turn.role === "user" && "justify-end")}
              >
                <div
                  className={cn(
                    "min-w-0",
                    turn.role === "user" ? "max-w-[90%]" : "w-full"
                  )}
                >
                  <p className="text-muted-foreground mb-1.5 flex items-center gap-1.5 text-xs">
                    {turn.role === "user" ? "You" : "Fieldwork assistant"}
                    {turn.input === "voice" && turn.role === "user" && (
                      <>
                        <AudioLines className="size-3" aria-hidden />
                        Voice
                      </>
                    )}
                  </p>
                  <MessageContent
                    className={cn(
                      "max-w-none text-sm leading-6 whitespace-pre-wrap",
                      turn.role === "assistant"
                        ? "bg-transparent p-0"
                        : "px-3 py-2.5"
                    )}
                  >
                    {turn.text}
                  </MessageContent>
                </div>
              </Message>
            ))}
            {thinking && (
              <div
                role="status"
                className="text-muted-foreground flex items-center gap-2 text-xs"
              >
                <Loader variant="typing" size="sm" />
                Reading the notes…
              </div>
            )}
          </ChatContainerContent>
        </ChatContainerRoot>

        <motion.div
          ref={composer}
          layout="position"
          data-composer-position
          transition={{ duration: reduce ? 0 : 0.3, ease: [0.2, 0, 0, 1] }}
          className={cn(
            "relative w-full shrink-0 pb-4",
            centered && "absolute inset-x-0 bottom-[38%] px-4 sm:px-6"
          )}
        >
          {centered && (
            <div className="mb-6">
              <h1 className="text-2xl leading-8 font-normal tracking-tight">
                Work with your field notes
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Ask a question, talk it through, or add a source.
              </p>
            </div>
          )}
          <AnimatePresence initial={false}>
            {voice && (
              <motion.div
                key="voice"
                initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.15 }}
                className="mb-4 flex items-center gap-4 px-1"
              >
                <div data-voice-orb className="size-20 shrink-0">
                  <Shdr21
                    size={80}
                    state={phase}
                    maxDpr={2}
                    pauseOffscreen
                    ariaLabel={`${stateLabel} voice orb`}
                  />
                </div>
                <div className="min-w-0">
                  <p role="status" className="text-sm font-medium">
                    {stateLabel}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs leading-5">
                    Voice and typing share this conversation.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <PromptInput
            data-composer
            value={draft}
            onValueChange={setDraft}
            onSubmit={() => send(draft)}
            isLoading={thinking}
            maxHeight={144}
            className="bg-card focus-within:ring-ring rounded-xl p-2 focus-within:ring-1"
          >
            {attachment && (
              <div className="bg-secondary mb-2 flex w-fit max-w-full items-center gap-2 rounded-md px-2 py-1 text-xs">
                <FileText className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">{attachment.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  aria-label="Remove context note"
                  onClick={() => {
                    attachmentVersion.current += 1
                    setAttachment(null)
                  }}
                >
                  <X className="size-3" />
                </Button>
              </div>
            )}
            <PromptInputTextarea
              data-conversation-input
              aria-label="Message"
              placeholder={
                voice
                  ? "Keep typing while voice is on…"
                  : "Ask about your field notes…"
              }
              className="min-h-12 px-2 py-2 text-base sm:text-sm"
            />
            <PromptInputActions className="justify-between gap-2 pt-1">
              <div className="flex min-w-0 items-center gap-1">
                <PromptInputAction tooltip="Add a text, Markdown, or CSV note">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Add context note"
                    onClick={() => fileInput.current?.click()}
                  >
                    <Paperclip />
                  </Button>
                </PromptInputAction>
                <PromptInputAction
                  tooltip={
                    concise ? "Use a detailed answer" : "Use a concise answer"
                  }
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Concise answers"
                    aria-pressed={concise}
                    onClick={() => setConcise((value) => !value)}
                    className="text-muted-foreground text-xs"
                  >
                    {concise ? "Concise" : "Detailed"}
                  </Button>
                </PromptInputAction>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {voice && (
                  <PromptInputAction
                    tooltip={muted ? "Unmute microphone" : "Mute microphone"}
                  >
                    <AgentTrackToggle
                      source="microphone"
                      pressed={!muted}
                      onPressedChange={(enabled) => setMuted(!enabled)}
                      aria-label={
                        muted ? "Unmute microphone" : "Mute microphone"
                      }
                    />
                  </PromptInputAction>
                )}
                <PromptInputAction
                  tooltip={voice ? "Return to typing" : "Start voice mode"}
                >
                  <Button
                    type="button"
                    variant={voice ? "secondary" : "outline"}
                    size="icon"
                    aria-label={voice ? "Exit voice mode" : "Enter voice mode"}
                    onClick={toggleVoice}
                  >
                    {voice ? <X /> : <AudioLines />}
                  </Button>
                </PromptInputAction>
                <PromptInputAction
                  tooltip={thinking ? "Stop response" : "Send message"}
                >
                  <Button
                    type="button"
                    size="icon"
                    disabled={!thinking && !draft.trim()}
                    aria-label={thinking ? "Stop response" : "Send message"}
                    onClick={thinking ? stop : () => send(draft)}
                  >
                    {thinking ? (
                      <Square className="size-3.5 fill-current" />
                    ) : (
                      <ArrowUp />
                    )}
                  </Button>
                </PromptInputAction>
              </div>
            </PromptInputActions>
          </PromptInput>
          <input
            ref={fileInput}
            type="file"
            accept=".txt,.md,.csv"
            className="sr-only"
            aria-label="Context note file"
            onChange={(event) => {
              void attach(event.currentTarget.files?.[0])
              event.currentTarget.value = ""
            }}
          />
          {notice && (
            <p role="status" className="text-muted-foreground mt-3 text-xs">
              {notice}
            </p>
          )}
          {centered && (
            <div className="mt-4 flex flex-wrap gap-2">
              {starters.map((text) => (
                <PromptSuggestion
                  key={text}
                  size="sm"
                  className="h-auto min-h-8 rounded-lg text-xs font-normal whitespace-normal"
                  onClick={() => send(text)}
                >
                  {text}
                </PromptSuggestion>
              ))}
            </div>
          )}
          {voice && (
            <div className="mt-3 flex justify-end">
              <Button
                variant="link"
                size="sm"
                disabled={muted || thinking}
                onClick={() => send(sampleSpokenQuestion, "voice")}
                className="text-muted-foreground h-7 px-0 text-xs"
              >
                Try a sample voice turn
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      <footer className="text-muted-foreground border-border flex shrink-0 flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-[11px] sm:px-8">
        <span>Interactive demo · sample replies · no microphone recording</span>
        <details className="relative">
          <summary className="cursor-pointer">Components used</summary>
          <div className="bg-popover text-popover-foreground absolute right-0 bottom-full z-20 mb-3 w-64 rounded-lg border p-4 text-xs shadow-sm">
            <p className="mb-2 font-medium">Composed from Agents Kit</p>
            <ul className="space-y-2">
              <li>
                Prompt Kit: input, messages, scrolling, suggestions, loader
              </li>
              <li>LiveKit: microphone toggle</li>
              <li>OrbKit: Nimbus</li>
              <li>Shared buttons and theme tokens</li>
            </ul>
          </div>
        </details>
      </footer>
    </section>
  )
}
