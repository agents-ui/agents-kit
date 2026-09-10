"use client"

// Adapted from Blocks ai-03 (MIT), pinned in components/blocks-so/SOURCE.json.
import {
  IconBolt,
  IconChevronDown,
  IconCircle,
  IconCircleDashed,
  IconCloud,
  IconCode,
  IconDeviceLaptop,
  IconHistory,
  IconPaperclip,
  IconPlus,
  IconProgress,
  IconRobot,
  IconSend,
  IconUser,
  IconWand,
  IconWorld,
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

export type BlocksAi03Options = {
  agent: string
  auto: boolean
  model: string
  performance: string
}

export type BlocksAi03Props = {
  className?: string
  onFilesSelected?: (files: File[]) => void
  onSubmit?: (message: string, options: BlocksAi03Options) => void
}

function CompactMenu({
  children,
  label,
}: {
  children: React.ReactNode
  label: React.ReactNode
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-6 gap-1 rounded-full border border-transparent px-2 text-xs text-muted-foreground hover:bg-accent" type="button" variant="ghost">
          {label}
          <IconChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-w-xs rounded-2xl border-border bg-popover p-1.5">
        <DropdownMenuGroup className="space-y-1">{children}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CompactItem({
  children,
  icon: Icon,
  onSelect,
}: {
  children: React.ReactNode
  icon: React.ComponentType<{ className?: string; size?: number }>
  onSelect?: () => void
}) {
  return (
    <DropdownMenuItem className="rounded-[calc(1rem-6px)] text-xs" onSelect={onSelect}>
      <Icon className="opacity-60" size={16} />
      {children}
    </DropdownMenuItem>
  )
}

export function BlocksAi03({ className, onFilesSelected, onSubmit }: BlocksAi03Props) {
  const [message, setMessage] = React.useState("")
  const [model, setModel] = React.useState("Local")
  const [agent, setAgent] = React.useState("Agent")
  const [performance, setPerformance] = React.useState("High")
  const [auto, setAuto] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const value = message.trim()
    if (!value) return
    onSubmit?.(value, { agent, auto, model, performance })
    setMessage("")
  }

  return (
    <form className={cn("w-full max-w-xl", className)} data-blocks-ai="ai-03" onSubmit={submit}>
      <div className="overflow-hidden rounded-2xl border border-border bg-background transition-[border-color,box-shadow] duration-200 focus-within:border-foreground/20 focus-within:shadow-sm">
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
        <div className="grow px-3 pt-3 pb-2">
          <Textarea
            aria-label="Message"
            className="max-h-[25vh] min-h-10 w-full resize-none border-0 bg-transparent p-0 text-sm shadow-none outline-none focus-visible:ring-0 focus-visible:outline-none"
            onChange={(event) => setMessage(event.currentTarget.value)}
            onInput={(event) => {
              event.currentTarget.style.height = "auto"
              event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
            placeholder="Ask anything"
            rows={1}
            value={message}
          />
        </div>

        <div className="mb-2 flex items-center justify-between px-2">
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Add tools" className="size-7 rounded-full border border-border p-0 hover:bg-accent" type="button" variant="ghost">
                  <IconPlus className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-w-xs rounded-2xl p-1.5">
                <DropdownMenuGroup className="space-y-1">
                  <CompactItem icon={IconPaperclip} onSelect={() => fileInputRef.current?.click()}>Attach files</CompactItem>
                  <CompactItem icon={IconCode}>Code interpreter</CompactItem>
                  <CompactItem icon={IconWorld}>Web search</CompactItem>
                  <CompactItem icon={IconHistory}>Chat history</CompactItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              aria-pressed={auto}
              className={cn(
                "h-7 gap-1 rounded-full border border-border px-2 hover:bg-accent",
                auto ? "border-primary/30 bg-primary/10 text-primary" : "text-muted-foreground"
              )}
              onClick={() => setAuto((value) => !value)}
              type="button"
              variant="ghost"
            >
              <IconWand className="size-3" />
              <span className="text-xs">Auto</span>
            </Button>
          </div>
          <Button aria-label="Send message" className="size-7 rounded-full p-0" disabled={!message.trim()} type="submit">
            <IconSend className="size-3" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-0 pt-2">
        <CompactMenu label={<><IconDeviceLaptop className="size-3" /><span>{model}</span></>}>
          <CompactItem icon={IconDeviceLaptop} onSelect={() => setModel("Local")}>Local</CompactItem>
          <CompactItem icon={IconCloud} onSelect={() => setModel("Cloud")}>Cloud</CompactItem>
        </CompactMenu>
        <CompactMenu label={<><IconUser className="size-3" /><span>{agent}</span></>}>
          <CompactItem icon={IconUser} onSelect={() => setAgent("Agent")}>Agent</CompactItem>
          <CompactItem icon={IconRobot} onSelect={() => setAgent("Assistant")}>Assistant</CompactItem>
        </CompactMenu>
        <CompactMenu label={<><IconBolt className="size-3" /><span>{performance}</span></>}>
          <CompactItem icon={IconCircle} onSelect={() => setPerformance("High")}>High</CompactItem>
          <CompactItem icon={IconProgress} onSelect={() => setPerformance("Medium")}>Medium</CompactItem>
          <CompactItem icon={IconCircleDashed} onSelect={() => setPerformance("Low")}>Low</CompactItem>
        </CompactMenu>
      </div>
    </form>
  )
}

export default BlocksAi03
