"use client"

// Adapted from Blocks ai-01 (MIT), pinned in components/blocks-so/SOURCE.json.
import {
  IconMicrophone,
  IconPaperclip,
  IconPlus,
  IconSearch,
  IconSend,
  IconSparkles,
  IconWaveSine,
} from "@tabler/icons-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type BlocksAi01Props = {
  className?: string
  onFilesSelected?: (files: File[]) => void
  onModeChange?: (mode: "agent" | "research") => void
  onSubmit?: (message: string) => void
  title?: string
}

export function BlocksAi01({
  className,
  onFilesSelected,
  onModeChange,
  onSubmit,
  title = "What should we investigate?",
}: BlocksAi01Props) {
  const [message, setMessage] = React.useState("")
  const [expanded, setExpanded] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const send = () => {
    const value = message.trim()
    if (!value) return
    onSubmit?.(value)
    setMessage("")
    setExpanded(false)
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  return (
    <div className={cn("w-full", className)} data-blocks-ai="ai-01">
      <h2 className="mx-auto mb-4 max-w-2xl text-balance text-center text-xl leading-tight font-medium tracking-tight">
        {title}
      </h2>
      <form
        className="group/composer w-full"
        onSubmit={(event) => {
          event.preventDefault()
          send()
        }}
      >
        <input
          className="sr-only"
          multiple
          onChange={(event) => {
            const files = Array.from(event.currentTarget.files ?? [])
            if (files.length) onFilesSelected?.(files)
            event.currentTarget.value = ""
          }}
          ref={fileInputRef}
          type="file"
        />
        <div
          className={cn(
            "mx-auto w-full max-w-2xl cursor-text overflow-clip bg-background bg-clip-padding p-2.5 shadow-[0_0_0_1px_oklch(0_0_0/0.08),0_1px_2px_-1px_oklch(0_0_0/0.08),0_4px_12px_-2px_oklch(0_0_0/0.08)] transition-[border-radius,box-shadow] duration-200 dark:bg-muted/50 dark:shadow-[0_0_0_1px_oklch(1_0_0/0.1)]",
            expanded
              ? "grid rounded-[28px] [grid-template-areas:'primary'_'footer'] [grid-template-columns:1fr] [grid-template-rows:auto_auto]"
              : "grid rounded-full [grid-template-areas:'leading_primary_trailing'] [grid-template-columns:auto_1fr_auto] [grid-template-rows:1fr]"
          )}
        >
          <div
            className={cn(
              "flex overflow-x-hidden",
              expanded ? "px-2 pt-1.5 pb-2" : "-my-2.5 min-h-14 items-center px-1.5"
            )}
            style={{ gridArea: "primary" }}
          >
            <div className="max-h-52 flex-1 overflow-auto">
              <Textarea
                aria-label="Message"
                className="min-h-0 resize-none rounded-none border-0 p-0 text-base shadow-none focus-visible:ring-0 focus-visible:outline-none md:text-base dark:bg-transparent"
                onChange={(event) => {
                  const value = event.currentTarget.value
                  setMessage(value)
                  event.currentTarget.style.height = "auto"
                  event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`
                  setExpanded(value.length > 100 || value.includes("\n"))
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault()
                    send()
                  }
                }}
                placeholder="Ask anything"
                ref={textareaRef}
                rows={1}
                value={message}
              />
            </div>
          </div>

          <div
            className={cn("flex items-center", expanded && "hidden")}
            style={{ gridArea: "leading" }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Add context"
                  className="size-9 rounded-full transition-[background-color,transform] duration-150 active:scale-[0.96]"
                  type="button"
                  variant="ghost"
                >
                  <IconPlus className="size-5 text-muted-foreground" stroke={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 rounded-2xl p-1.5">
                <DropdownMenuGroup className="space-y-1">
                  <DropdownMenuItem className="rounded-[10px] px-2.5 py-2" onSelect={() => fileInputRef.current?.click()}>
                    <IconPaperclip className="opacity-60" size={20} stroke={1.5} />
                    Add photos & files
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-[10px] px-2.5 py-2" onSelect={() => onModeChange?.("agent")}>
                    <IconSparkles className="opacity-60" size={20} stroke={1.5} />
                    Field agent mode
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-[10px] px-2.5 py-2" onSelect={() => onModeChange?.("research")}>
                    <IconSearch className="opacity-60" size={20} stroke={1.5} />
                    Deep research
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div
            className="flex items-center gap-2"
            style={{ gridArea: expanded ? "footer" : "trailing" }}
          >
            <div className="ms-auto flex items-center gap-1.5">
              <Button aria-label="Record audio message" className="size-9 rounded-full transition-[background-color,transform] duration-150 active:scale-[0.96]" type="button" variant="ghost">
                <IconMicrophone className="size-5 text-muted-foreground" stroke={1.5} />
              </Button>
              <Button aria-label="Audio visualization" className="size-9 rounded-full transition-[background-color,transform] duration-150 active:scale-[0.96]" type="button" variant="ghost">
                <IconWaveSine className="size-5 text-muted-foreground" stroke={1.5} />
              </Button>
              <Button aria-label="Send message" className="size-9 rounded-full transition-[background-color,transform,opacity] duration-150 active:scale-[0.96] disabled:opacity-40" disabled={!message.trim()} type="submit">
                <IconSend className="size-[18px]" stroke={1.5} />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default BlocksAi01
