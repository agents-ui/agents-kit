"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"

export interface SelectionAction {
  id: string
  label: string
}
export interface SelectionActionsProps {
  selectedText: string
  actions: SelectionAction[]
  result?: string
  isWorking?: boolean
  onAction?: (id: string) => void
  onReplace?: (value: string) => void
  className?: string
}
export function SelectionActions({
  selectedText,
  actions,
  result,
  isWorking = false,
  onAction,
  onReplace,
  className,
}: SelectionActionsProps) {
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default max-w-2xl rounded-xl border p-4",
        className
      )}
    >
      <p className="text-text-secondary text-xs">Selected text</p>
      <blockquote className="border-separator-border mt-2 border-l-2 pl-3 text-[13px]">
        {selectedText}
      </blockquote>
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="secondary"
            size="small"
            disabled={isWorking}
            onClick={() => onAction?.(action.id)}
          >
            {action.label}
          </Button>
        ))}
      </div>
      {isWorking && (
        <p className="text-text-secondary mt-4 text-[13px]">
          Rewriting selection
        </p>
      )}
      {result && (
        <div className="bg-background-secondary-default mt-4 rounded-lg p-3">
          <p className="text-[13px] leading-5">{result}</p>
          <div className="mt-3 flex justify-end">
            <Button size="small" onClick={() => onReplace?.(result)}>
              Replace selection
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
