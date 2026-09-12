"use client"

// Adapted from Blocks ai-04 (MIT), pinned in components/blocks-so/SOURCE.json.
import {
  IconAdjustmentsHorizontal,
  IconArrowUp,
  IconCamera,
  IconCirclePlus,
  IconClipboard,
  IconFileUpload,
  IconHistory,
  IconLink,
  IconMap,
  IconPaperclip,
  IconPlayerPlay,
  IconPlus,
  IconReportAnalytics,
  IconSparkles,
  IconTemplate,
  IconX,
} from "@tabler/icons-react"
import Image from "next/image"
import * as React from "react"

import { Switch } from "@/components/blocks-so/ai/_ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type BlocksAi04File = {
  file: File
  id: string
  name: string
  preview?: string
}

export type BlocksAi04Settings = {
  autoComplete: boolean
  showHistory: boolean
  streaming: boolean
}

export type BlocksAi04Props = {
  className?: string
  onAction?: (action: string) => void
  onFilesChange?: (files: BlocksAi04File[]) => void
  onSubmit?: (prompt: string, files: File[], settings: BlocksAi04Settings) => void
}

const actions = [
  { id: "capture", icon: IconCamera, label: "Capture field evidence" },
  { id: "map", icon: IconMap, label: "Connect survey map" },
  { id: "upload", icon: IconFileUpload, label: "Upload observations" },
  { id: "report", icon: IconReportAnalytics, label: "Draft field report" },
] as const

export function BlocksAi04({ className, onAction, onFilesChange, onSubmit }: BlocksAi04Props) {
  const [prompt, setPrompt] = React.useState("")
  const [dragOver, setDragOver] = React.useState(false)
  const [files, setFiles] = React.useState<BlocksAi04File[]>([])
  const [settings, setSettings] = React.useState<BlocksAi04Settings>({
    autoComplete: true,
    showHistory: false,
    streaming: false,
  })
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const commitFiles = (next: BlocksAi04File[]) => {
    setFiles(next)
    onFilesChange?.(next)
  }

  const processFiles = (incoming: File[]) => {
    const additions = incoming.map((file) => ({
      file,
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
    }))
    const next = [...files, ...additions]
    commitFiles(next)

    additions.forEach(({ file, id }) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = () => {
          setFiles((current) =>
            current.map((candidate) =>
              candidate.id === id ? { ...candidate, preview: String(reader.result) } : candidate
            )
          )
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const submit = (event?: React.FormEvent) => {
    event?.preventDefault()
    const value = prompt.trim()
    if (!value) return
    onSubmit?.(value, files.map(({ file }) => file), settings)
    setPrompt("")
  }

  const updateSetting = (key: keyof BlocksAi04Settings, value: boolean) =>
    setSettings((current) => ({ ...current, [key]: value }))

  return (
    <div className={cn("mx-auto flex w-full flex-col gap-4", className)} data-blocks-ai="ai-04">
      <div>
        <h2 className="text-balance text-center text-xl font-medium tracking-tight">
          Collect. Compare. Report.
        </h2>
        <p className="mt-1 text-balance text-center text-sm text-muted-foreground">
          Turn field evidence into a working brief.
        </p>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col">
        <form
          className="relative overflow-visible rounded-xl border border-input bg-card p-2 shadow-sm transition-[border-color,box-shadow] duration-200 focus-within:border-ring"
          onDragLeave={(event) => {
            event.preventDefault()
            setDragOver(false)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            setDragOver(true)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragOver(false)
            processFiles(Array.from(event.dataTransfer.files))
          }}
          onSubmit={submit}
        >
          {files.length > 0 && (
            <div className="relative mb-2 flex flex-wrap items-center gap-2 overflow-hidden">
              {files.map((file) => (
                <Badge className="group relative h-6 max-w-36 cursor-default overflow-hidden px-0 text-[13px] transition-colors hover:bg-accent" key={file.id} variant="outline">
                  <span className="flex h-full items-center gap-1.5 overflow-hidden pl-1 font-normal">
                    <span className="relative flex h-4 min-w-4 items-center justify-center">
                      {file.preview ? (
                        <Image alt="" className="absolute inset-0 size-4 rounded border object-cover" height={16} src={file.preview} width={16} />
                      ) : (
                        <IconPaperclip className="opacity-60" size={12} />
                      )}
                    </span>
                    <span className="truncate pr-6">{file.name}</span>
                  </span>
                  <button
                    aria-label={`Remove ${file.name}`}
                    className="absolute right-1 z-10 rounded-sm p-0.5 text-muted-foreground opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                    onClick={() => commitFiles(files.filter((candidate) => candidate.id !== file.id))}
                    type="button"
                  >
                    <IconX size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <Textarea
            aria-label="Prompt"
            className="max-h-50 min-h-12 resize-none rounded-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 focus-visible:outline-none"
            onChange={(event) => setPrompt(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                submit()
              }
            }}
            placeholder="Describe what the field team should examine"
            value={prompt}
          />

          <div className="flex items-center gap-1">
            <input
              className="sr-only"
              multiple
              onChange={(event) => {
                processFiles(Array.from(event.currentTarget.files ?? []))
                event.currentTarget.value = ""
              }}
              ref={fileInputRef}
              type="file"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Add attachments" className="size-8 rounded-md" type="button" variant="ghost"><IconPlus size={16} /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-w-xs rounded-2xl p-1.5">
                <DropdownMenuGroup className="space-y-1">
                  <DropdownMenuItem className="rounded-md text-xs" onSelect={() => fileInputRef.current?.click()}><IconPaperclip size={16} />Attach files</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-md text-xs"><IconLink size={16} />Import from URL</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-md text-xs"><IconClipboard size={16} />Paste from clipboard</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-md text-xs"><IconTemplate size={16} />Use template</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Adjust settings" className="size-8 rounded-md" type="button" variant="ghost"><IconAdjustmentsHorizontal size={16} /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-2xl p-3">
                <DropdownMenuGroup className="space-y-3">
                  {([
                    ["autoComplete", "Auto-complete", IconSparkles],
                    ["streaming", "Streaming", IconPlayerPlay],
                    ["showHistory", "Show history", IconHistory],
                  ] as const).map(([key, label, Icon]) => (
                    <div className="flex items-center justify-between gap-4" key={key}>
                      <Label className="gap-2 text-xs"><Icon className="text-muted-foreground" size={16} />{label}</Label>
                      <Switch aria-label={label} checked={settings[key]} onCheckedChange={(value) => updateSetting(key, value)} />
                    </div>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button aria-label="Send prompt" className="ml-auto size-8 rounded-md" disabled={!prompt.trim()} type="submit">
              <IconArrowUp size={16} />
            </Button>
          </div>

          <div
            aria-hidden={!dragOver}
            className={cn(
              "pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-[inherit] border border-dashed bg-muted/95 text-sm transition-opacity duration-200",
              dragOver ? "opacity-100" : "opacity-0"
            )}
          >
            <span className="flex items-center gap-1 font-medium"><IconCirclePlus size={16} />Drop files here to attach</span>
          </div>
        </form>
      </div>

      <div className="mx-auto flex flex-wrap items-center justify-center gap-3">
        {actions.map(({ id, icon: Icon, label }) => (
          <Button className="gap-2 rounded-full transition-transform duration-150 active:scale-[0.96]" key={id} onClick={() => onAction?.(id)} size="sm" type="button" variant="outline">
            <Icon size={16} />{label}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default BlocksAi04
