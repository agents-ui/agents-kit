"use client"

// Adapted from Blocks ai-05 and its AI Elements dependencies (MIT), pinned in SOURCE.json.
import {
  IconAdjustmentsHorizontal,
  IconArrowDown,
  IconArrowUp,
  IconBolt,
  IconLoader2,
  IconPaperclip,
  IconPlus,
} from "@tabler/icons-react"
import * as React from "react"
import ReactMarkdown from "react-markdown"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type BlocksAi05Message = {
  content: string
  id: string
  role: "assistant" | "user"
}

export type BlocksAi05Props = {
  className?: string
  initialMessages?: BlocksAi05Message[]
  onSubmit?: (message: string) => Promise<string | void> | string | void
}

const fieldworkMessages: BlocksAi05Message[] = [
  {
    id: "intro",
    role: "assistant",
    content: "I can compare observations, trace evidence, and turn field notes into a brief. What should we examine?",
  },
  {
    id: "question",
    role: "user",
    content: "Summarize the river survey in three findings.",
  },
  {
    id: "answer",
    role: "assistant",
    content: "- **Water clarity improved** at four upstream sites.\n- **Bank erosion increased** after the August storms.\n- **Two readings need review** because their timestamps overlap.",
  },
]

const suggestions = ["Draft the field brief", "List evidence gaps", "Turn findings into tasks"]
const responses = [
  "Here is a concise field brief:\n\n1. Confirm the two overlapping readings.\n2. Compare erosion against the August rainfall log.\n3. Preserve the upstream clarity measurements as the baseline.",
  "The main evidence gaps are the missing downstream photo set and an unverified timestamp on station R-14.",
  "I split the work into three tasks: verify readings, annotate the rainfall comparison, and prepare the final evidence table.",
]

export function BlocksAi05({ className, initialMessages = fieldworkMessages, onSubmit }: BlocksAi05Props) {
  const [messages, setMessages] = React.useState(initialMessages)
  const [message, setMessage] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [atBottom, setAtBottom] = React.useState(true)
  const scrollerRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const scroller = scrollerRef.current
    if (scroller) scroller.scrollTo({ behavior, top: scroller.scrollHeight })
  }

  React.useEffect(() => scrollToBottom(), [messages, submitting])

  const send = async (text: string) => {
    const value = text.trim()
    if (!value || submitting) return
    setMessages((current) => [...current, { content: value, id: `user-${Date.now()}`, role: "user" }])
    setMessage("")
    setSubmitting(true)
    try {
      const supplied = await onSubmit?.(value)
      await new Promise((resolve) => window.setTimeout(resolve, 650))
      setMessages((current) => [
        ...current,
        {
          content: supplied || responses[current.length % responses.length],
          id: `assistant-${Date.now()}`,
          role: "assistant",
        },
      ])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("w-full px-4", className)} data-blocks-ai="ai-05">
      <div className="mx-auto flex h-[560px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-card shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_oklch(0_0_0/0.04),0_12px_32px_-12px_oklch(0_0_0/0.18)] dark:shadow-[0_0_0_1px_oklch(1_0_0/0.1),0_12px_32px_-12px_oklch(0_0_0/0.6)]">
        <header className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex flex-col">
            <span className="text-sm leading-tight font-semibold">Fieldwork assistant</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />Online
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              className="h-8 gap-1.5 px-2.5 text-xs"
              onClick={() => {
                setMessages(initialMessages.slice(0, 1))
                setMessage("")
                setSubmitting(false)
              }}
              size="sm"
              type="button"
              variant="ghost"
            >
              <IconPlus className="size-4" stroke={1.5} />New chat
            </Button>
            <Button aria-label="Settings" className="size-8" title="Settings" type="button" variant="ghost">
              <IconAdjustmentsHorizontal className="size-4" stroke={1.5} />
            </Button>
          </div>
        </header>

        <div
          className="relative min-h-0 flex-1 border-t border-border/60"
          role="log"
        >
          <div
            className="size-full overflow-y-auto px-5 py-5"
            onScroll={(event) => {
              const target = event.currentTarget
              setAtBottom(target.scrollHeight - target.scrollTop - target.clientHeight < 24)
            }}
            ref={scrollerRef}
          >
            <div className="flex flex-col gap-5">
              {messages.map((item) => (
                <div className={cn("flex max-w-[95%] flex-col gap-2", item.role === "user" && "ml-auto items-end")} key={item.id}>
                  <div
                    className={cn(
                      "w-fit min-w-0 max-w-full overflow-hidden text-sm leading-relaxed",
                      item.role === "user" && "rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground",
                      item.role === "assistant" && "max-w-prose"
                    )}
                  >
                    {item.role === "assistant" ? (
                      <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_li]:my-1 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:my-2 [&_ul]:ml-5 [&_ul]:list-disc">
                        <ReactMarkdown>{item.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {submitting && (
                <output aria-label="Assistant is typing" className="flex h-7 items-center gap-1">
                  {[0, 1, 2].map((dot) => (
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 motion-reduce:animate-none" key={dot} style={{ animationDelay: `${dot * 150}ms` }} />
                  ))}
                </output>
              )}
            </div>
          </div>
          {!atBottom && (
            <Button aria-label="Scroll to latest message" className="absolute bottom-4 left-1/2 size-9 -translate-x-1/2 rounded-full" onClick={() => scrollToBottom()} type="button" variant="outline">
              <IconArrowDown className="size-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3 p-3">
          <div className="flex flex-wrap gap-2 px-1">
            {suggestions.map((suggestion) => (
              <button
                className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs text-muted-foreground transition-[color,background-color,transform] duration-150 hover:bg-muted hover:text-foreground active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50"
                disabled={submitting}
                key={suggestion}
                onClick={() => void send(suggestion)}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form
            className="overflow-hidden rounded-xl border border-border bg-muted/40 transition-[border-color,box-shadow] duration-200 focus-within:border-ring focus-within:shadow-sm"
            onSubmit={(event) => {
              event.preventDefault()
              void send(message)
            }}
          >
            <Textarea
              aria-label="Message fieldwork assistant"
              className="max-h-32 min-h-16 resize-none border-0 bg-transparent px-3 py-2 shadow-none focus-visible:ring-0 focus-visible:outline-none"
              name="message"
              onChange={(event) => setMessage(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder="Message the fieldwork assistant"
              value={message}
            />
            <div className="flex items-center justify-between gap-1 p-2 pt-0">
              <div className="flex items-center gap-1">
                <Button aria-label="Attach file" className="size-8" type="button" variant="ghost"><IconPaperclip className="size-4" stroke={1.5} /></Button>
                <Button aria-label="Quick prompt" className="size-8" type="button" variant="ghost"><IconBolt className="size-4" stroke={1.5} /></Button>
              </div>
              <Button aria-label="Send message" className="size-8 rounded-full transition-[transform,opacity] duration-150 active:scale-[0.96]" disabled={!message.trim() || submitting} type="submit">
                {submitting ? <IconLoader2 className="size-4 animate-spin motion-reduce:animate-none" /> : <IconArrowUp className="size-4" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BlocksAi05
