"use client"

import { AgentChatActions } from "@/components/boardui/application/agent-chat/agent-chat-actions"
import {
  AgentChatHistory,
  type ChatThreadSummary,
} from "@/components/boardui/application/agent-chat/agent-chat-history"
import { AgentMessage } from "@/components/boardui/application/agent-chat/agent-chat-message"
import { AgentComposer } from "@/components/boardui/application/agent-chat/agent-composer"
import { DemoTransport } from "@/components/boardui/application/agent-chat/demo-transport"
import { AgentThinking } from "@/components/boardui/application/agent-thinking/agent-thinking"
import { cx } from "@/components/boardui/utils/cx"
import { useChat } from "@ai-sdk/react"
import { RiHistoryLine } from "@remixicon/react"
import type { UIMessage } from "ai"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const STORAGE_KEY = "agents-kit:boardui-chat-threads"
const MAX_THREADS = 30
const SUGGESTIONS = [
  "Explain what this starter does",
  "Write a product update in three sentences",
  "Give me five names for a scheduling app",
]

interface StoredThread extends ChatThreadSummary {
  messages: UIMessage[]
  messageAt: Record<string, number>
}

/**
 * BoardUI's free chat starter, adapted for the gallery to use its local demo
 * transport only. It keeps the original transcript, composer, history, share,
 * export, rename, unread, delete, speech and motion behavior without requiring
 * an API route or model key.
 */
export function AgentChat({ className }: { className?: string }) {
  const [input, setInput] = useState("")
  const [threads, setThreads] = useState<StoredThread[]>([])
  const [activeId, setActiveId] = useState("")
  const [activeUpdatedAt, setActiveUpdatedAt] = useState(0)
  const [activeTitle, setActiveTitle] = useState<string | null>(null)
  const [messageAt, setMessageAt] = useState<Record<string, number>>({})
  const [restored, setRestored] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [transport] = useState(() => new DemoTransport())
  const { messages, sendMessage, setMessages, status, stop, error } = useChat({
    transport,
  })
  const busy = status === "submitted" || status === "streaming"

  useEffect(() => {
    setActiveId(newThreadId())
    setThreads(orderThreads(readThreads()))
    setRestored(true)
  }, [])

  useEffect(() => {
    const unseen = messages.filter(
      (message) => messageAt[message.id] === undefined
    )
    if (unseen.length === 0) return
    const now = Date.now()
    setMessageAt((previous) => ({
      ...previous,
      ...Object.fromEntries(unseen.map((message) => [message.id, now])),
    }))
  }, [messages, messageAt])

  const liveThread = useMemo<StoredThread | null>(
    () =>
      activeId && messages.length > 0
        ? {
            id: activeId,
            title: activeTitle ?? deriveTitle(messages),
            updatedAt: activeUpdatedAt,
            messages,
            messageAt,
          }
        : null,
    [activeId, activeTitle, activeUpdatedAt, messageAt, messages]
  )
  const allThreads = useMemo(
    () =>
      orderThreads(
        liveThread
          ? [liveThread, ...threads.filter((thread) => thread.id !== activeId)]
          : threads
      ),
    [activeId, liveThread, threads]
  )

  useEffect(() => {
    if (!restored || busy) return
    writeThreads(allThreads)
  }, [allThreads, busy, restored])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [busy, messages])

  useEffect(() => {
    if (!historyOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHistoryOpen(false)
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [historyOpen])

  const keepLiveThread = useCallback(() => {
    if (!liveThread) return
    setThreads((previous) =>
      orderThreads([
        liveThread,
        ...previous.filter((thread) => thread.id !== liveThread.id),
      ])
    )
  }, [liveThread])

  const submit = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    setActiveUpdatedAt(Date.now())
    sendMessage({ text: trimmed })
    setInput("")
  }

  const startNewChat = useCallback(() => {
    if (busy) return
    keepLiveThread()
    setActiveId(newThreadId())
    setActiveUpdatedAt(0)
    setActiveTitle(null)
    setMessageAt({})
    setMessages([])
    setInput("")
  }, [busy, keepLiveThread, setMessages])

  const selectThread = useCallback(
    (id: string) => {
      if (busy || id === activeId) return
      const thread = allThreads.find((candidate) => candidate.id === id)
      if (!thread) return
      keepLiveThread()
      setActiveId(id)
      setActiveUpdatedAt(thread.updatedAt)
      setActiveTitle(thread.title)
      setMessageAt(thread.messageAt ?? {})
      setMessages(thread.messages)
      setInput("")
      setHistoryOpen(false)
      if (thread.unread) {
        setThreads((previous) =>
          previous.map((item) =>
            item.id === id ? { ...item, unread: false } : item
          )
        )
      }
    },
    [activeId, allThreads, busy, keepLiveThread, setMessages]
  )

  const renameThread = (id: string, title: string) => {
    if (id === activeId) setActiveTitle(title)
    setThreads((previous) =>
      previous.map((thread) =>
        thread.id === id ? { ...thread, title } : thread
      )
    )
  }
  const toggleUnread = (id: string) =>
    setThreads((previous) =>
      previous.map((thread) =>
        thread.id === id ? { ...thread, unread: !thread.unread } : thread
      )
    )
  const deleteThread = (id: string) => {
    setThreads((previous) => previous.filter((thread) => thread.id !== id))
    if (id !== activeId) return
    setActiveId(newThreadId())
    setActiveUpdatedAt(0)
    setActiveTitle(null)
    setMessageAt({})
    setMessages([])
    setInput("")
  }
  const exportThreads = () => {
    if (allThreads.length === 0) return
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(allThreads, null, 2)], {
        type: "application/json",
      })
    )
    const link = document.createElement("a")
    link.href = url
    link.download = "boardui-chats.json"
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  const streamedText = messageText(messages.at(-1))
  const transcript = messages
    .map(
      (message) =>
        `${message.role === "user" ? "You" : "Assistant"}: ${messageText(message)}`
    )
    .filter((line) => !line.endsWith(": "))
    .join("\n\n")

  return (
    <div
      className={cx(
        "bg-background-full relative flex h-[620px] min-w-0 gap-3 overflow-hidden rounded-3xl p-3",
        className
      )}
    >
      <div className="bg-background-secondary-default relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl">
        <header className="border-separator-border flex h-12 shrink-0 items-center border-b px-4">
          <span className="text-headline-medium text-text-primary min-w-0 truncate">
            {allThreads.find((thread) => thread.id === activeId)?.title ??
              "New chat"}
          </span>
          {!historyOpen ? (
            <button
              type="button"
              aria-label="Open chat history"
              onClick={() => setHistoryOpen(true)}
              className="text-foreground-icon-secondary hover:bg-background-primary-hover focus-visible:ring-border-focus-ring ml-auto flex size-7 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none xl:hidden"
            >
              <RiHistoryLine className="size-[18px]" aria-hidden />
            </button>
          ) : null}
          <AgentChatActions
            className="ml-0.5 xl:ml-auto"
            transcript={transcript}
            onExport={exportThreads}
            onToggleUnread={() => toggleUnread(activeId)}
            onDelete={() => deleteThread(activeId)}
            disabled={messages.length === 0}
          />
        </header>
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          <div
            className={cx(
              "mx-auto flex min-h-full w-full max-w-3xl flex-col gap-5 px-4 py-6",
              messages.length === 0 && "justify-center"
            )}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <div>
                  <h2 className="text-title-2-medium text-text-primary">
                    What can I help with?
                  </h2>
                  <p className="text-body-regular text-text-secondary">
                    Local demo answers stream without an API key.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => submit(suggestion)}
                      className="bg-background-primary-default text-body-regular text-text-secondary hover:bg-background-primary-hover rounded-full px-3.5 py-2 shadow-xs transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <AgentMessage
                  key={message.id}
                  role={message.role}
                  text={messageText(message)}
                  streaming={busy && index === messages.length - 1}
                  at={messageAt[message.id]}
                />
              ))
            )}
            {busy && streamedText.length === 0 ? (
              <AgentThinking variant="wave" label="Thinking" className="px-1" />
            ) : null}
            {error ? (
              <p
                role="alert"
                className="text-body-regular text-text-tertiary px-1"
              >
                The local demo was interrupted. Try again.
              </p>
            ) : null}
          </div>
        </div>
        <div className="shrink-0 px-3 pb-3">
          <div className="mx-auto w-full max-w-3xl">
            <AgentComposer
              value={input}
              onValueChange={setInput}
              onSubmit={() => submit(input)}
              onStop={stop}
              busy={busy}
              provider="Demo mode"
              messageCount={messages.length}
            />
          </div>
        </div>
      </div>
      {historyOpen ? (
        <button
          type="button"
          aria-label="Close chat history"
          onClick={() => setHistoryOpen(false)}
          className="focus-visible:ring-border-focus-ring absolute inset-y-0 right-[272px] left-0 z-20 bg-black/30 focus-visible:ring-2 focus-visible:outline-none xl:hidden"
        />
      ) : null}
      <AgentChatHistory
        threads={allThreads}
        activeId={activeId}
        onSelect={selectThread}
        onNewChat={startNewChat}
        onRename={renameThread}
        onToggleUnread={toggleUnread}
        onDelete={deleteThread}
        onExport={exportThreads}
        disabled={busy}
        className={cx(
          "z-30 xl:static xl:flex",
          historyOpen
            ? "absolute inset-y-3 right-3 flex max-w-[calc(100%-1.5rem)] shadow-lg"
            : "hidden"
        )}
      />
    </div>
  )
}

function messageText(message?: UIMessage) {
  return (
    message?.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("") ?? ""
  )
}

function deriveTitle(messages: UIMessage[]) {
  const first = messages.find((message) => message.role === "user")
  const text = messageText(first).trim()
  return text.length > 42
    ? `${text.slice(0, 39).trimEnd()}…`
    : text || "New chat"
}

function newThreadId() {
  return globalThis.crypto?.randomUUID?.() ?? `chat-${Date.now()}`
}

function orderThreads(threads: StoredThread[]) {
  return [...threads]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_THREADS)
}

function readThreads(): StoredThread[] {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]"
    )
    return Array.isArray(parsed) ? parsed.filter(isStoredThread) : []
  } catch {
    return []
  }
}

function writeThreads(threads: StoredThread[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
  } catch {
    // Storage may be disabled; the live thread still works.
  }
}

function isStoredThread(value: unknown): value is StoredThread {
  if (!value || typeof value !== "object") return false
  const thread = value as Partial<StoredThread>
  return (
    typeof thread.id === "string" &&
    typeof thread.title === "string" &&
    typeof thread.updatedAt === "number" &&
    Array.isArray(thread.messages)
  )
}
