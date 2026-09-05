"use client"

import { cx } from "@/components/boardui/utils/cx"
import { FileText } from "lucide-react"

export interface ContextChunk {
  id: string
  title: string
  source: string
  content: string
  score?: number
}
export interface ContextCardsProps {
  chunks: ContextChunk[]
  selectedId?: string
  onSelect?: (id: string) => void
  className?: string
}
export function ContextCards({
  chunks,
  selectedId,
  onSelect,
  className,
}: ContextCardsProps) {
  return (
    <div
      className={cx(
        "divide-separator-border border-separator-border bg-background-primary-default divide-y rounded-xl border",
        className
      )}
    >
      {chunks.map((chunk) => (
        <button
          key={chunk.id}
          onClick={() => onSelect?.(chunk.id)}
          className={cx(
            "grid w-full grid-cols-[20px_1fr_auto] gap-3 p-4 text-left",
            selectedId === chunk.id && "bg-background-secondary-default"
          )}
        >
          <FileText className="text-text-secondary size-4" />
          <span>
            <strong className="block text-[13px] font-medium">
              {chunk.title}
            </strong>
            <span className="text-text-secondary mt-1 line-clamp-2 text-xs leading-5">
              {chunk.content}
            </span>
            <span className="text-text-secondary mt-1 block text-xs">
              {chunk.source}
            </span>
          </span>
          {chunk.score !== undefined && (
            <span className="text-text-secondary text-xs">
              {Math.round(chunk.score * 100)}%
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
