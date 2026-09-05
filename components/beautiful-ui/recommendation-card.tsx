"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"

export interface RecommendationOption {
  id: string
  label: string
  description?: string
}
export interface RecommendationCardProps {
  title: string
  description: string
  confidence?: number
  alternatives?: RecommendationOption[]
  onAccept?: () => void
  onSelectAlternative?: (id: string) => void
  className?: string
}
export function RecommendationCard({
  title,
  description,
  confidence,
  alternatives = [],
  onAccept,
  onSelectAlternative,
  className,
}: RecommendationCardProps) {
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default rounded-xl border p-4",
        className
      )}
    >
      <div className="flex justify-between gap-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {confidence !== undefined && (
          <span className="text-text-secondary text-xs">
            {Math.round(confidence * 100)}% confidence
          </span>
        )}
      </div>
      <p className="text-text-secondary mt-2 text-[13px] leading-5">
        {description}
      </p>
      {alternatives.length > 0 && (
        <div className="divide-separator-border border-separator-border mt-4 divide-y border-y">
          {alternatives.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelectAlternative?.(option.id)}
              className="min-h-10 w-full py-2 text-left"
            >
              <span className="text-[13px] font-medium">{option.label}</span>
              {option.description && (
                <span className="text-text-secondary block text-xs">
                  {option.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <Button onClick={onAccept}>Accept recommendation</Button>
      </div>
    </section>
  )
}
