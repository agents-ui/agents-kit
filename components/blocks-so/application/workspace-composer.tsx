"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { Select, SelectItem } from "@/components/boardui/base/select/select"
import { cx } from "@/components/boardui/utils/cx"
import { ArrowUp, Paperclip, Square, X } from "lucide-react"
import * as React from "react"

export interface WorkspaceAttachment {
  id: string
  name: string
  size?: string
}
export interface WorkspaceModelOption {
  id: string
  label: string
}
export interface WorkspaceComposerProps {
  value: string
  onValueChange: (value: string) => void
  onSubmit: (value: string) => void
  model: string
  models: WorkspaceModelOption[]
  onModelChange: (model: string) => void
  contextLabel?: string
  contextOptions?: string[]
  onContextChange?: (context: string) => void
  attachments?: WorkspaceAttachment[]
  onFilesSelected?: (files: File[]) => void
  onRemoveAttachment?: (id: string) => void
  disabled?: boolean
  isRunning?: boolean
  onStop?: () => void
  placeholder?: string
  className?: string
}
export function WorkspaceComposer({
  value,
  onValueChange,
  onSubmit,
  model,
  models,
  onModelChange,
  contextLabel = "Workspace context",
  contextOptions = [],
  onContextChange,
  attachments = [],
  onFilesSelected,
  onRemoveAttachment,
  disabled = false,
  isRunning = false,
  onStop,
  placeholder = "Ask the agent to investigate, draft, or update work",
  className,
}: WorkspaceComposerProps) {
  const input = React.useRef<HTMLInputElement>(null)
  const submit = () => {
    const text = value.trim()
    if (text && !disabled && !isRunning) onSubmit(text)
  }
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default w-full max-w-[760px] rounded-xl border p-3",
        className
      )}
    >
      <div className="border-separator-border text-text-secondary flex flex-wrap items-center gap-2 border-b pb-2 text-xs">
        <span>{contextLabel}</span>
        {contextOptions.length > 0 && (
          <Select
            aria-label="Workspace context"
            selectedKey={contextLabel}
            onSelectionChange={(key) => onContextChange?.(String(key))}
            size="sm"
            triggerClassName="border-0 shadow-none"
          >
            <>
              {contextOptions.map((option) => (
                <SelectItem key={option} id={option}>
                  {option}
                </SelectItem>
              ))}
            </>
          </Select>
        )}
      </div>
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-3">
          {attachments.map((file) => (
            <span
              key={file.id}
              className="border-separator-border inline-flex min-h-8 items-center gap-2 rounded-lg border px-2 text-xs"
            >
              <Paperclip className="text-text-secondary size-3.5" />
              <span className="max-w-40 truncate">{file.name}</span>
              {file.size && (
                <span className="text-text-secondary">{file.size}</span>
              )}
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => onRemoveAttachment?.(file.id)}
                className="hover:bg-background-secondary-default rounded-sm p-1"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            submit()
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
        rows={4}
        className="text-text-primary placeholder:text-text-tertiary mt-2 min-h-24 w-full resize-y bg-transparent p-1 text-sm leading-6 outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            ref={input}
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => {
              onFilesSelected?.(Array.from(e.target.files ?? []))
              e.currentTarget.value = ""
            }}
          />
          <Button
            variant="ghost"
            size="small"
            leadingIcon={Paperclip}
            onClick={() => input.current?.click()}
          >
            Attach
          </Button>
          <Select
            aria-label="Model"
            selectedKey={model}
            onSelectionChange={(key) => onModelChange(String(key))}
            size="sm"
          >
            {models.map((option) => (
              <SelectItem key={option.id} id={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        {isRunning ? (
          <Button
            variant="secondary"
            iconOnly
            aria-label="Stop generation"
            onClick={onStop}
          >
            <Square />
          </Button>
        ) : (
          <Button
            iconOnly
            aria-label="Send message"
            disabled={disabled || !value.trim()}
            onClick={submit}
          >
            <ArrowUp />
          </Button>
        )}
      </div>
      <p className="border-separator-border text-text-secondary mt-3 border-t pt-3 text-xs">
        {attachments.length} files · {contextLabel} ·{" "}
        {isRunning ? "Working" : "Ready"}
      </p>
    </section>
  )
}
