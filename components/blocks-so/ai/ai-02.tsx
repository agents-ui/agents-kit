"use client"

// Adapted from Blocks ai-02 (MIT), pinned in components/blocks-so/SOURCE.json.
import {
  IconAlertTriangle,
  IconArrowUp,
  IconCloud,
  IconFileSpark,
  IconGauge,
  IconPhotoScan,
} from "@tabler/icons-react"
import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/blocks-so/ai/_ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export const blocksAi02Models = [
  { value: "gpt-5", name: "GPT-5", description: "Most advanced model", max: true },
  { value: "gpt-4o", name: "GPT-4o", description: "Fast and capable", max: false },
  { value: "claude-3.5", name: "Claude 3.5 Sonnet", description: "Great for coding tasks", max: false },
] as const

const prompts = [
  {
    icon: IconFileSpark,
    label: "Summarize field notes",
    prompt: "Summarize the latest field notes into decisions, evidence, and open questions.",
  },
  {
    icon: IconGauge,
    label: "Compare survey runs",
    prompt: "Compare the two survey runs and explain the largest changes with supporting evidence.",
  },
  {
    icon: IconAlertTriangle,
    label: "Flag missing evidence",
    prompt: "Review this workspace and flag the three most important claims that still need evidence.",
  },
] as const

export type BlocksAi02Props = {
  className?: string
  defaultModel?: (typeof blocksAi02Models)[number]["value"]
  onFilesSelected?: (files: File[]) => void
  onSubmit?: (message: string, model: string) => void
  renderComposer?: (composer: React.ReactNode) => React.ReactNode
}

export function BlocksAi02({
  className,
  defaultModel = "gpt-5",
  onFilesSelected,
  onSubmit,
  renderComposer,
}: BlocksAi02Props) {
  const [message, setMessage] = React.useState("")
  const [model, setModel] = React.useState<string>(defaultModel)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const selectedModel =
    blocksAi02Models.find((candidate) => candidate.value === model) ??
    blocksAi02Models[0]

  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 258)}px`
  }, [message])

  const choosePrompt = (prompt: string) => {
    setMessage(prompt)
    textareaRef.current?.focus()
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const value = message.trim()
    if (!value) return
    onSubmit?.(value, model)
    setMessage("")
  }

  const maxBadge = (
    <span className="inline-flex h-[15px] items-center rounded-[4px] border border-border/80 bg-muted/40 px-[5px]">
      <span className="bg-gradient-to-r from-slate-500 to-violet-500 bg-clip-text text-[9px] font-bold leading-none tracking-[0.06em] text-transparent uppercase">
        Max
      </span>
    </span>
  )

  const composer = (
    <div className="flex min-h-[120px] cursor-text flex-col rounded-2xl border border-border bg-card shadow-lg transition-[border-color,box-shadow] duration-200 focus-within:border-foreground/20 focus-within:shadow-xl">
      <div className="relative max-h-[258px] flex-1 overflow-y-auto">
        <Textarea
          aria-label="Message"
          className="min-h-[72px] w-full resize-none whitespace-pre-wrap break-words border-0 bg-transparent p-3 text-base shadow-none outline-none transition-[padding] duration-200 focus-visible:ring-0 focus-visible:outline-none"
          onChange={(event) => setMessage(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          placeholder="Ask about this fieldwork"
          ref={textareaRef}
          rows={1}
          value={message}
        />
      </div>

      <div className="flex min-h-10 items-center gap-2 p-2 pt-1">
        <div aria-label="Workspace context" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted" role="img">
          <IconCloud className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>

        <Select onValueChange={(value) => value && setModel(value)} value={model}>
          <SelectTrigger
            aria-label={`Model: ${selectedModel.name}`}
            className="h-7 rounded-full border-transparent bg-transparent px-2 font-medium text-foreground shadow-none transition-[background-color,color] hover:bg-muted data-popup-open:bg-muted dark:bg-transparent dark:hover:bg-muted"
            size="sm"
          >
            <SelectValue>
              <span className="flex items-center gap-1.5">
                <span>{selectedModel.name}</span>
                {selectedModel.max && maxBadge}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false} className="w-64 p-1" sideOffset={6}>
            {blocksAi02Models.map((candidate) => (
              <SelectItem className="rounded-md py-1.5" key={candidate.value} value={candidate.value}>
                <span className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-1.5 font-medium">
                    {candidate.name}
                    {candidate.max && maxBadge}
                  </span>
                  <span className="text-xs text-muted-foreground">{candidate.description}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            aria-label="Attach images"
            className="size-8 rounded-full text-muted-foreground transition-[background-color,color,transform] duration-150 hover:text-foreground active:scale-[0.96]"
            onClick={() => fileInputRef.current?.click()}
            title="Attach images"
            type="button"
            variant="ghost"
          >
            <IconPhotoScan className="size-[18px]" />
          </Button>
          <Button
            aria-label="Send message"
            className="size-8 rounded-full transition-[background-color,transform,opacity] duration-150 active:scale-[0.96]"
            disabled={!message.trim()}
            type="submit"
          >
            <IconArrowUp className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <form
      className={cn("flex w-full max-w-[37rem] flex-col gap-4", className)}
      data-blocks-ai="ai-02"
      onSubmit={submit}
    >
      <input
        aria-label="Attach images"
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

      {renderComposer ? renderComposer(composer) : composer}

      <div className="flex flex-wrap justify-center gap-2" aria-label="Suggested prompts" role="group">
        {prompts.map(({ icon: Icon, label, prompt }) => (
          <Button
            className="h-8 gap-1.5 rounded-full border-border bg-background pr-3.5 pl-2.5 font-normal shadow-[0_1px_2px_oklch(0_0_0/0.05)] transition-[background-color,color,transform,box-shadow] duration-150 hover:bg-muted active:scale-[0.96] dark:bg-muted/40"
            key={label}
            onClick={() => choosePrompt(prompt)}
            type="button"
            variant="outline"
          >
            <Icon className="size-4 text-muted-foreground" />
            {label}
          </Button>
        ))}
      </div>
    </form>
  )
}

export default BlocksAi02
