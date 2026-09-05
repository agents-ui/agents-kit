"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { Send } from "lucide-react"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  label?: string
  meta?: string
}
export interface ChatComposerProps {
  messages: ChatMessage[]
  value: string
  onValueChange: (value: string) => void
  onSubmit: (value: string) => void
  disabled?: boolean
  tabs?: string[]
  activeTab?: string
  onTabChange?: (tab: string) => void
  className?: string
}
export function ChatComposer({
  messages,
  value,
  onValueChange,
  onSubmit,
  disabled = false,
  tabs = [],
  activeTab,
  onTabChange,
  className,
}: ChatComposerProps) {
  const submit = () => {
    if (value.trim() && !disabled) onSubmit(value.trim())
  }
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      {tabs.length > 0 && (
        <div className="border-separator-border flex gap-1 border-b p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              aria-pressed={activeTab === tab}
              onClick={() => onTabChange?.(tab)}
              className={cx(
                "min-h-8 rounded-lg px-3 text-xs",
                activeTab === tab
                  ? "bg-background-secondary-default font-medium"
                  : "text-text-secondary"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
      <div className="max-h-72 space-y-3 overflow-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cx(
              "max-w-[85%] rounded-lg p-3 text-[13px]",
              message.role === "user"
                ? "bg-button-primary text-text-white ml-auto"
                : "bg-background-secondary-default"
            )}
          >
            {message.label && (
              <p className="mb-1 text-xs font-medium">
                {message.label}
                {message.meta && (
                  <span className="text-text-secondary ml-2 font-normal">
                    {message.meta}
                  </span>
                )}
              </p>
            )}
            {message.content}
          </div>
        ))}
      </div>
      <div className="border-separator-border flex gap-2 border-t p-3">
        <textarea
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault()
              submit()
            }
          }}
          rows={2}
          className="min-h-10 flex-1 resize-none bg-transparent text-[13px] outline-none"
        />
        <Button
          iconOnly
          aria-label="Send message"
          leadingIcon={Send}
          disabled={disabled || !value.trim()}
          onClick={submit}
        />
      </div>
    </section>
  )
}
