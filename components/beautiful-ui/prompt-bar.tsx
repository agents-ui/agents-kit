"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { ArrowUp, AtSign, Command, Mic, Paperclip, Square } from "lucide-react"
import * as React from "react"

export type PromptBarVariant = "rounded" | "pill"
export interface PromptSource {
  id: string
  label: string
  description?: string
}
export interface PromptCommand {
  id: string
  label: string
  description?: string
}
export interface PromptModel {
  id: string
  label: string
  description?: string
}
export interface PromptBarProps {
  value: string
  onValueChange: (value: string) => void
  onSubmit: (value: string) => void
  onAttach?: () => void
  variant?: PromptBarVariant
  placeholder?: string
  disabled?: boolean
  sources?: PromptSource[]
  commands?: PromptCommand[]
  models?: PromptModel[]
  selectedModel?: string
  onModelChange?: (id: string) => void
  onSourceSelect?: (source: PromptSource) => void
  onCommandSelect?: (command: PromptCommand) => void
  isListening?: boolean
  onDictationToggle?: () => void
  isRunning?: boolean
  onStop?: () => void
  className?: string
}
function token(value: string) {
  const match = /(^|\s)([@/])([\w-]*)$/.exec(value)
  return match
    ? {
        kind: match[2] === "@" ? ("source" as const) : ("command" as const),
        query: match[3].toLowerCase(),
        start: match.index + match[1].length,
      }
    : null
}
export function PromptBar({
  value,
  onValueChange,
  onSubmit,
  onAttach,
  variant = "rounded",
  placeholder = "Ask anything",
  disabled = false,
  sources = [],
  commands = [],
  models = [],
  selectedModel,
  onModelChange,
  onSourceSelect,
  onCommandSelect,
  isListening = false,
  onDictationToggle,
  isRunning = false,
  onStop,
  className,
}: PromptBarProps) {
  const current = token(value)
  const [menu, setMenu] = React.useState<"source" | "command" | null>(null)
  const [active, setActive] = React.useState(0)
  const [dismissedValue, setDismissedValue] = React.useState<string>()
  const kind = menu ?? (dismissedValue === value ? null : current?.kind) ?? null
  const query = menu ? "" : (current?.query ?? "")
  const options =
    kind === "source"
      ? sources.filter((item) =>
          `${item.label} ${item.description ?? ""}`
            .toLowerCase()
            .includes(query)
        )
      : kind === "command"
        ? commands.filter((item) =>
            `${item.label} ${item.description ?? ""}`
              .toLowerCase()
              .includes(query)
          )
        : []
  const close = () => {
    setDismissedValue(value)
    setMenu(null)
    setActive(0)
  }
  const select = (index: number) => {
    const option = options[index]
    if (!option || !kind) return
    const inserted = kind === "source" ? `@${option.label}` : `/${option.label}`
    onValueChange(
      current
        ? `${value.slice(0, current.start)}${inserted} `
        : `${value}${value ? " " : ""}${inserted} `
    )
    if (kind === "source") onSourceSelect?.(option as PromptSource)
    else onCommandSelect?.(option as PromptCommand)
    close()
  }
  const submit = () => {
    const text = value.trim()
    if (text && !disabled && !isRunning) onSubmit(text)
  }
  return (
    <div className={cx("relative", className)}>
      {kind && options.length > 0 && !disabled && !isRunning && (
        <div
          role="listbox"
          aria-label={kind === "source" ? "Data sources" : "Commands"}
          className="border-separator-border bg-background-primary-default absolute bottom-full z-20 mb-2 w-full max-w-sm rounded-xl border p-1.5 shadow-lg"
        >
          {options.map((option, index) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={active === index}
              onMouseEnter={() => setActive(index)}
              onClick={() => select(index)}
              className={cx(
                "flex min-h-9 w-full items-center gap-2 rounded-lg px-2 text-left",
                active === index && "bg-background-secondary-default"
              )}
            >
              <span className="text-xs font-medium">
                {kind === "source" ? "@" : "/"}
                {option.label}
              </span>
              {option.description && (
                <span className="text-text-secondary ml-auto text-xs">
                  {option.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      <div
        className={cx(
          "border-separator-border bg-background-primary-default flex min-h-11 items-center gap-1.5 border p-1.5",
          variant === "pill" ? "rounded-full" : "rounded-xl"
        )}
      >
        <Button
          variant="ghost"
          size="small"
          iconOnly
          aria-label="Attach file"
          leadingIcon={Paperclip}
          disabled={disabled || isRunning}
          onClick={onAttach}
        />
        {sources.length > 0 && (
          <Button
            variant="ghost"
            size="small"
            iconOnly
            aria-label="Mention a data source"
            leadingIcon={AtSign}
            disabled={disabled || isRunning}
            onClick={() => {
              setMenu(menu === "source" ? null : "source")
              setActive(0)
            }}
          />
        )}{" "}
        {commands.length > 0 && (
          <Button
            variant="ghost"
            size="small"
            iconOnly
            aria-label="Choose a command"
            leadingIcon={Command}
            disabled={disabled || isRunning}
            onClick={() => {
              setMenu(menu === "command" ? null : "command")
              setActive(0)
            }}
          />
        )}
        <input
          value={value}
          disabled={disabled || isRunning}
          onChange={(event) => {
            onValueChange(event.target.value)
            setMenu(null)
            setActive(0)
          }}
          onKeyDown={(event) => {
            if (
              kind &&
              options.length &&
              (event.key === "ArrowDown" || event.key === "ArrowUp")
            ) {
              event.preventDefault()
              setActive((index) =>
                event.key === "ArrowDown"
                  ? Math.min(options.length - 1, index + 1)
                  : Math.max(0, index - 1)
              )
              return
            }
            if (
              kind &&
              options.length > 0 &&
              event.key === "Enter" &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault()
              select(active)
              return
            }
            if (event.key === "Escape" && kind) {
              event.preventDefault()
              close()
              return
            }
            if (
              event.key === "Enter" &&
              !event.nativeEvent.isComposing &&
              !disabled &&
              !isRunning
            ) {
              event.preventDefault()
              submit()
            }
          }}
          placeholder={placeholder}
          className="placeholder:text-text-tertiary min-w-0 flex-1 bg-transparent px-1 text-[13px] outline-none disabled:cursor-not-allowed"
        />
        {models.length > 0 && (
          <select
            aria-label="Model"
            value={selectedModel}
            disabled={disabled || isRunning}
            onChange={(event) => onModelChange?.(event.target.value)}
            className="bg-background-secondary-default h-8 max-w-28 rounded-lg px-2 text-xs outline-none"
          >
            <option value="" disabled>
              Model
            </option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.label}
              </option>
            ))}
          </select>
        )}
        {onDictationToggle && (
          <Button
            variant="ghost"
            size="small"
            iconOnly
            aria-label={isListening ? "Stop dictation" : "Start dictation"}
            aria-pressed={isListening}
            leadingIcon={Mic}
            disabled={disabled || isRunning}
            onClick={onDictationToggle}
          />
        )}{" "}
        {isRunning ? (
          <Button
            variant="secondary"
            size="small"
            iconOnly
            aria-label="Stop generation"
            leadingIcon={Square}
            disabled={disabled}
            onClick={onStop}
          />
        ) : (
          <Button
            size="small"
            iconOnly
            aria-label="Send prompt"
            leadingIcon={ArrowUp}
            disabled={disabled || !value.trim()}
            onClick={submit}
          />
        )}
      </div>
    </div>
  )
}
