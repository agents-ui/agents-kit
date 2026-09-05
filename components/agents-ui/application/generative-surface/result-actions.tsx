"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import {
  Check,
  Copy,
  GitCompare,
  Maximize2,
  Pencil,
  Save,
  Share2,
} from "lucide-react"

export type ResultActionState = "view" | "expanded" | "editing" | "comparing"

export interface ResultActionsProps {
  state?: ResultActionState
  saved?: boolean
  onExpand?: () => void
  onEdit?: () => void
  onCompare?: () => void
  onSave?: () => void
  onShare?: () => void
  onCopy?: () => void
  className?: string
}

export function ResultActions({
  state = "view",
  saved = false,
  onExpand,
  onEdit,
  onCompare,
  onSave,
  onShare,
  onCopy,
  className,
}: ResultActionsProps) {
  return (
    <div
      className={cx("flex flex-wrap items-center gap-1", className)}
      aria-label="Result actions"
    >
      <Button
        size="xs"
        variant={state === "expanded" ? "secondary" : "ghost"}
        leadingIcon={Maximize2}
        onClick={onExpand}
        disabled={!onExpand}
      >
        {state === "expanded" ? "Collapse" : "Expand"}
      </Button>
      <Button
        size="xs"
        variant={state === "editing" ? "secondary" : "ghost"}
        leadingIcon={Pencil}
        onClick={onEdit}
        disabled={!onEdit}
      >
        Edit
      </Button>
      <Button
        size="xs"
        variant={state === "comparing" ? "secondary" : "ghost"}
        leadingIcon={GitCompare}
        onClick={onCompare}
        disabled={!onCompare}
      >
        Compare
      </Button>
      <Button
        size="xs"
        variant="ghost"
        leadingIcon={saved ? Check : Save}
        onClick={onSave}
        disabled={!onSave}
      >
        {saved ? "Saved" : "Save"}
      </Button>
      <Button
        size="xs"
        variant="ghost"
        leadingIcon={Share2}
        onClick={onShare}
        disabled={!onShare}
      >
        Share
      </Button>
      <Button
        size="xs"
        variant="ghost"
        leadingIcon={Copy}
        onClick={onCopy}
        disabled={!onCopy}
      >
        Copy
      </Button>
    </div>
  )
}
