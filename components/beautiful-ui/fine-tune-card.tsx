"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"

export interface FineTuneField {
  id: string
  label: string
  value: string | number
  options?: string[]
  min?: number
  max?: number
  step?: number
  suffix?: string
}
export interface FineTuneCardProps {
  title: string
  fields: FineTuneField[]
  onChange?: (id: string, value: string | number) => void
  onApply?: () => void
  onReset?: () => void
  className?: string
}
export function FineTuneCard({
  title,
  fields,
  onChange,
  onApply,
  onReset,
  className,
}: FineTuneCardProps) {
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default max-w-md rounded-xl border p-4",
        className
      )}
    >
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-4 space-y-4">
        {fields.map((field) => (
          <label key={field.id} className="text-text-secondary block text-xs">
            {field.label}
            {field.options ? (
              <select
                value={String(field.value)}
                onChange={(e) => onChange?.(field.id, e.target.value)}
                className="border-separator-border bg-background-primary-default text-text-primary mt-1 h-9 w-full rounded-lg border px-3 text-[13px]"
              >
                {field.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={typeof field.value === "number" ? "number" : "text"}
                value={field.value}
                min={field.min}
                max={field.max}
                step={field.step}
                onChange={(e) =>
                  onChange?.(
                    field.id,
                    typeof field.value === "number"
                      ? Number(e.target.value)
                      : e.target.value
                  )
                }
                className="bg-background-tertiary-default text-text-primary mt-1 h-9 w-full rounded-lg px-3 text-[13px] outline-none"
              />
            )}
            {field.suffix && (
              <span className="text-text-secondary mt-1 block text-right text-xs">
                {field.suffix}
              </span>
            )}
          </label>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
        <Button onClick={onApply}>Apply</Button>
      </div>
    </section>
  )
}
