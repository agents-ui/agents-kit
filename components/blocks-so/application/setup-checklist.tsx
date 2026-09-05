"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { Check, Circle } from "lucide-react"

export interface SetupStep {
  id: string
  title: string
  description: string
  completed: boolean
  disabled?: boolean
}
export interface SetupChecklistProps {
  title: string
  description?: string
  steps: SetupStep[]
  selectedStepId?: string
  onSelectStep?: (id: string) => void
  onStepComplete?: (id: string, completed: boolean) => void
  onContinue?: (id: string) => void
  className?: string
}
export function SetupChecklist({
  title,
  description,
  steps,
  selectedStepId,
  onSelectStep,
  onStepComplete,
  onContinue,
  className,
}: SetupChecklistProps) {
  const completed = steps.filter((step) => step.completed).length
  const selected =
    steps.find((step) => step.id === selectedStepId) ??
    steps.find((step) => !step.completed)
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default w-full max-w-[620px] rounded-xl border p-5",
        className
      )}
    >
      <header>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && (
              <p className="text-text-secondary mt-1 text-sm">{description}</p>
            )}
          </div>
          <span className="text-text-secondary text-xs">
            {completed} of {steps.length}
          </span>
        </div>
        <div className="bg-background-secondary-default mt-4 h-1.5 overflow-hidden rounded-full">
          <div
            className="bg-accent-600 h-full transition-[width] duration-150"
            style={{
              width: `${steps.length ? (completed / steps.length) * 100 : 0}%`,
            }}
          />
        </div>
      </header>
      <ol className="divide-separator-border border-separator-border mt-5 divide-y border-y">
        {steps.map((step, index) => {
          const active = step.id === selected?.id
          return (
            <li
              key={step.id}
              className={cx(
                "grid grid-cols-[24px_1fr_auto] gap-3 py-4",
                active && "bg-background-secondary-default"
              )}
            >
              <button
                type="button"
                disabled={step.disabled}
                onClick={() => onStepComplete?.(step.id, !step.completed)}
                aria-label={`${step.completed ? "Mark incomplete" : "Mark complete"}: ${step.title}`}
                className="focus:ring-border-focus-ring mt-0.5 flex size-5 items-center justify-center rounded-full outline-none focus:ring-2"
              >
                {step.completed ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <Circle className="text-text-secondary size-4" />
                )}
              </button>
              <button
                type="button"
                disabled={step.disabled}
                onClick={() => onSelectStep?.(step.id)}
                className="focus:ring-border-focus-ring text-left outline-none focus:ring-2"
              >
                <span
                  className={cx(
                    "text-sm font-medium",
                    step.completed && "text-text-secondary line-through"
                  )}
                >
                  {index + 1}. {step.title}
                </span>
                <span className="text-text-secondary mt-1 block text-sm leading-6">
                  {step.description}
                </span>
              </button>
              {active && !step.completed && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => onContinue?.(step.id)}
                >
                  Continue
                </Button>
              )}
            </li>
          )
        })}
      </ol>
      {steps.length === 0 && (
        <p className="text-text-secondary py-6 text-center text-sm">
          No setup steps.
        </p>
      )}
    </section>
  )
}
