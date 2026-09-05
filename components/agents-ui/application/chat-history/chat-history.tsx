"use client"

import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/boardui/base/dropdown/dropdown"
import { Input } from "@/components/boardui/base/input/input"
import { cx } from "@/components/boardui/utils/cx"
import {
  Archive,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  Star,
  Trash2,
} from "lucide-react"
import { useMemo, useState } from "react"

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  tokens?: number
  model?: string
}
export type ChatSession = {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  starred?: boolean
  archived?: boolean
}
export interface AgentChatHistoryProps {
  sessions: ChatSession[]
  selectedSessionId?: string
  onSelectSession?: (session: ChatSession) => void
  onDeleteSession?: (sessionId: string) => void
  onStarSession?: (sessionId: string) => void
  onArchiveSession?: (sessionId: string) => void
  onExportSession?: (sessionId: string) => void
  className?: string
}
function relativeDate(date: Date) {
  const days = Math.floor((Date.now() - date.getTime()) / 86400000)
  return days === 0
    ? "Today"
    : days === 1
      ? "Yesterday"
      : days < 7
        ? `${days} days ago`
        : date.toLocaleDateString()
}

export function AgentChatHistory({
  sessions,
  selectedSessionId,
  onSelectSession,
  onDeleteSession,
  onStarSession,
  onArchiveSession,
  onExportSession,
  className,
}: AgentChatHistoryProps) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "starred" | "archived">("all")
  const visible = useMemo(
    () =>
      sessions.filter(
        (session) =>
          (filter === "all" ||
            (filter === "starred" ? session.starred : session.archived)) &&
          (!query ||
            session.title.toLowerCase().includes(query.toLowerCase()) ||
            session.messages.some((message) =>
              message.content.toLowerCase().includes(query.toLowerCase())
            ))
      ),
    [sessions, filter, query]
  )
  const selected = sessions.find((session) => session.id === selectedSessionId)
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default grid min-h-[440px] overflow-hidden rounded-2xl border md:grid-cols-[288px_minmax(0,1fr)]",
        className
      )}
    >
      <aside className="border-separator-border flex min-h-0 flex-col border-b md:border-r md:border-b-0">
        <header className="border-separator-border space-y-2 border-b p-3">
          <Input
            aria-label="Search conversations"
            placeholder="Search conversations"
            value={query}
            onChange={setQuery}
            leadingIcon={Search}
          />
          <div className="flex items-center justify-between">
            <Dropdown>
              <DropdownTrigger className="text-caption-1-medium hover:bg-background-secondary-hover inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2">
                <Filter className="size-3.5" />
                {filter === "all"
                  ? "All"
                  : filter === "starred"
                    ? "Starred"
                    : "Archived"}
              </DropdownTrigger>
              <DropdownPopover aria-label="Conversation filter">
                <DropdownItem
                  selected={filter === "all"}
                  onSelect={() => setFilter("all")}
                >
                  All conversations
                </DropdownItem>
                <DropdownItem
                  selected={filter === "starred"}
                  onSelect={() => setFilter("starred")}
                >
                  Starred
                </DropdownItem>
                <DropdownItem
                  selected={filter === "archived"}
                  onSelect={() => setFilter("archived")}
                >
                  Archived
                </DropdownItem>
              </DropdownPopover>
            </Dropdown>
            <span className="text-caption-1-regular text-text-tertiary tabular-nums">
              {visible.length}
            </span>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {visible.map((session) => {
            const last = session.messages.at(-1)
            return (
              <div
                key={session.id}
                className={cx(
                  "group border-separator-border relative border-b",
                  session.id === selectedSessionId &&
                    "bg-background-secondary-default"
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectSession?.(session)}
                  className="hover:bg-background-secondary-hover w-full p-3 pr-10 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-body-medium min-w-0 flex-1 truncate">
                      {session.title}
                    </span>
                    {session.starred && (
                      <Star className="text-text-secondary size-3.5 fill-current" />
                    )}
                  </div>
                  <p className="text-caption-1-regular text-text-secondary mt-1 line-clamp-2 leading-4">
                    {last?.content ?? "No messages yet"}
                  </p>
                  <p className="text-caption-1-regular text-text-tertiary mt-2">
                    {session.messages.length} messages |{" "}
                    {relativeDate(session.updatedAt)}
                  </p>
                </button>
                <Dropdown>
                  <DropdownTrigger className="hover:bg-background-secondary-hover absolute top-2 right-2 grid size-8 place-items-center rounded-lg opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="size-4" />
                  </DropdownTrigger>
                  <DropdownPopover
                    aria-label={`${session.title} actions`}
                    placement="bottom end"
                  >
                    <DropdownItem onSelect={() => onStarSession?.(session.id)}>
                      <Star className="size-4" />
                      {session.starred ? "Unstar" : "Star"}
                    </DropdownItem>
                    <DropdownItem
                      onSelect={() => onArchiveSession?.(session.id)}
                    >
                      <Archive className="size-4" />
                      {session.archived ? "Unarchive" : "Archive"}
                    </DropdownItem>
                    <DropdownItem
                      onSelect={() => onExportSession?.(session.id)}
                    >
                      <Download className="size-4" />
                      Export
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem
                      className="text-text-error-placeholder"
                      onSelect={() => onDeleteSession?.(session.id)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownItem>
                  </DropdownPopover>
                </Dropdown>
              </div>
            )
          })}
          {visible.length === 0 && (
            <p className="text-body-2-regular text-text-secondary p-6 text-center">
              No conversations found.
            </p>
          )}
        </div>
      </aside>
      <main className="min-w-0">
        {selected ? (
          <>
            <header className="border-separator-border border-b px-4 py-3">
              <h3 className="text-headline-semibold">{selected.title}</h3>
              <p className="text-caption-1-regular text-text-secondary">
                {selected.messages.length} messages | Updated{" "}
                {relativeDate(selected.updatedAt)}
              </p>
            </header>
            <div className="divide-separator-border divide-y">
              {selected.messages.map((message) => (
                <article key={message.id} className="px-4 py-3">
                  <header className="text-caption-1-medium mb-1.5 flex flex-wrap items-center gap-2">
                    <span>{message.role === "user" ? "You" : "Assistant"}</span>
                    <time className="text-text-tertiary">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                    {message.model && (
                      <span className="text-text-tertiary">
                        {message.model}
                      </span>
                    )}
                    {message.tokens !== undefined && (
                      <span className="text-text-tertiary ml-auto tabular-nums">
                        {message.tokens} tokens
                      </span>
                    )}
                  </header>
                  <p className="text-body-2-regular leading-5 whitespace-pre-wrap">
                    {message.content}
                  </p>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="grid min-h-80 place-items-center p-8 text-center">
            <div>
              <p className="text-body-medium">Select a conversation</p>
              <p className="text-body-2-regular text-text-secondary mt-1">
                Messages and run metadata appear here.
              </p>
            </div>
          </div>
        )}
      </main>
    </section>
  )
}
