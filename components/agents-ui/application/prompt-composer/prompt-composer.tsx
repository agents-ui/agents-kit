"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import {
  Dropdown,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/boardui/base/dropdown/dropdown"
import { cx } from "@/components/boardui/utils/cx"
import {
  BookTemplate,
  ChevronDown,
  Mic,
  Paperclip,
  Send,
  Settings,
  Square,
} from "lucide-react"
import { useId, useState } from "react"

export type PromptTemplate = {
  id: string
  name: string
  prompt: string
  description?: string
}
export type Persona = {
  id: string
  name: string
  avatar?: string
  systemPrompt: string
  description?: string
}
export interface AgentPromptComposerProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (
    value: string,
    options?: { persona?: Persona; template?: PromptTemplate }
  ) => void
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  templates?: PromptTemplate[]
  personas?: Persona[]
  showVoiceInput?: boolean
  showFileAttachment?: boolean
  showSettings?: boolean
  className?: string
}

export function AgentPromptComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask anything...",
  disabled = false,
  isLoading = false,
  templates = [],
  personas = [],
  showVoiceInput = true,
  showFileAttachment = true,
  showSettings = true,
  className,
}: AgentPromptComposerProps) {
  const [draft, setDraft] = useState("")
  const inputValue = value ?? draft
  const changeValue = (next: string) => {
    if (value === undefined) setDraft(next)
    onChange?.(next)
  }
  const fileInputId = useId()
  const [persona, setPersona] = useState<Persona | null>(null)
  const [template, setTemplate] = useState<PromptTemplate | null>(null)
  const [recording, setRecording] = useState(false)
  const [attachment, setAttachment] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const submit = () => {
    if (inputValue.trim() && !disabled && !isLoading)
      onSubmit?.(inputValue, {
        persona: persona ?? undefined,
        template: template ?? undefined,
      })
  }
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-2xl border",
        className
      )}
    >
      <div className="border-separator-border text-caption-1-medium text-text-secondary flex min-h-10 flex-wrap items-center gap-1 border-b px-3 py-1.5">
        {personas.length > 0 && (
          <Dropdown>
            <DropdownTrigger className="hover:bg-background-secondary-hover inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2">
              {persona?.name ?? "Default assistant"}
              <ChevronDown className="size-3.5" />
            </DropdownTrigger>
            <DropdownPopover aria-label="Select assistant" className="w-64">
              <DropdownItem
                selected={!persona}
                onSelect={() => setPersona(null)}
              >
                <div>
                  <p className="text-body-medium">Default assistant</p>
                  <p className="text-caption-1-regular text-text-secondary">
                    Standard workspace behavior
                  </p>
                </div>
              </DropdownItem>
              {personas.map((item) => (
                <DropdownItem
                  key={item.id}
                  selected={persona?.id === item.id}
                  onSelect={() => setPersona(item)}
                >
                  <div>
                    <p className="text-body-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-caption-1-regular text-text-secondary">
                        {item.description}
                      </p>
                    )}
                  </div>
                </DropdownItem>
              ))}
            </DropdownPopover>
          </Dropdown>
        )}
        {templates.length > 0 && (
          <Dropdown>
            <DropdownTrigger className="hover:bg-background-secondary-hover inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2">
              <BookTemplate className="size-3.5" />
              {template?.name ?? "Templates"}
              <ChevronDown className="size-3.5" />
            </DropdownTrigger>
            <DropdownPopover aria-label="Prompt templates" className="w-80">
              {templates.map((item) => (
                <DropdownItem
                  key={item.id}
                  selected={template?.id === item.id}
                  onSelect={() => {
                    setTemplate(item)
                    changeValue(item.prompt)
                  }}
                >
                  <div>
                    <p className="text-body-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-caption-1-regular text-text-secondary">
                        {item.description}
                      </p>
                    )}
                  </div>
                </DropdownItem>
              ))}
            </DropdownPopover>
          </Dropdown>
        )}
        {showSettings && (
          <Button
            size="xs"
            variant="ghost"
            iconOnly
            leadingIcon={Settings}
            aria-label="Composer settings"
            aria-pressed={settingsOpen}
            onClick={() => setSettingsOpen((open) => !open)}
          />
        )}
      </div>
      {settingsOpen && (
        <div className="border-separator-border bg-background-secondary-default text-caption-1-regular text-text-secondary border-b px-4 py-2">
          Selected assistant and template are included when the prompt is
          submitted.
        </div>
      )}
      <textarea
        aria-label="Message"
        value={inputValue}
        onChange={(event) => changeValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault()
            submit()
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
        rows={4}
        className="text-body-regular text-text-primary placeholder:text-text-tertiary disabled:text-text-tertiary min-h-24 w-full resize-y bg-transparent px-4 py-3 leading-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring disabled:cursor-not-allowed"
      />
      <footer className="border-separator-border flex min-h-12 flex-wrap items-center justify-between gap-2 border-t px-2.5 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1">
          {showFileAttachment && (
            <>
              <label
                htmlFor={fileInputId}
                className="text-text-secondary hover:bg-button-ghost-hover grid size-8 cursor-pointer place-items-center rounded-lg"
                aria-label="Attach file"
              >
                <Paperclip className="size-[18px]" />
              </label>
              <input
                id={fileInputId}
                type="file"
                className="sr-only"
                onChange={(event) =>
                  setAttachment(event.target.files?.[0]?.name ?? null)
                }
              />
            </>
          )}
          {showVoiceInput && (
            <Button
              size="small"
              variant="ghost"
              iconOnly
              leadingIcon={Mic}
              aria-label={recording ? "Stop voice input" : "Start voice input"}
              aria-pressed={recording}
              onClick={() => setRecording((active) => !active)}
              className={cx(recording && "text-foreground-icon-error")}
            />
          )}
          {attachment && (
            <span className="bg-background-secondary-default text-caption-1-regular text-text-secondary max-w-48 truncate rounded-sm px-2 py-1">
              {attachment}
            </span>
          )}
          <span className="text-caption-1-regular text-text-tertiary px-1">
            {isLoading
              ? "Working"
              : recording
                ? "Listening"
                : "No write actions"}
          </span>
        </div>
        <Button
          size="medium"
          iconOnly
          leadingIcon={isLoading ? Square : Send}
          aria-label={isLoading ? "Generation in progress" : "Send message"}
          disabled={!inputValue.trim() || disabled || isLoading}
          onClick={submit}
        />
      </footer>
    </section>
  )
}
