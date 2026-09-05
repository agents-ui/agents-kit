"use client"

import { Bookmark, Play, RotateCcw } from "lucide-react"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"

/**
 * Restore interaction adapted from Vercel AI Elements checkpoint (Apache-2.0).
 * https://github.com/vercel/ai-elements
 */
export type CheckpointStatus = "ready" | "restoring" | "restored" | "error"

export interface AgentCheckpointProps {
  id: string
  label: string
  description?: string
  timestamp?: string
  messageCount?: number
  status?: CheckpointStatus
  progress?: number
  error?: string
  disabled?: boolean
  onRestore?: (checkpointId: string) => void
  onResume?: (checkpointId: string) => void
  className?: string
}

const statusLabel: Record<CheckpointStatus, string> = {
  ready: "Saved",
  restoring: "Restoring",
  restored: "Restored",
  error: "Restore failed",
}

const statusTone: Record<CheckpointStatus, string> = {
  ready: "text-text-secondary",
  restoring: "text-accent-600",
  restored: "text-green-700 dark:text-green-400",
  error: "text-red-700 dark:text-red-400",
}

export function AgentCheckpoint({ id, label, description, timestamp, messageCount, status = "ready", progress = 0, error, disabled = false, onRestore, onResume, className }: AgentCheckpointProps) {
  const busy = status === "restoring"
  const value = Math.max(0, Math.min(100, progress))
  return <section className={cx("rounded-xl border border-separator-border bg-background-primary-default p-4", className)} aria-label={`Checkpoint: ${label}`}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 gap-3"><Bookmark className="mt-0.5 size-4 shrink-0 text-text-secondary" /><div className="min-w-0"><div className="flex flex-wrap items-center gap-x-3 gap-y-1"><h2 className="text-sm font-medium text-text-primary">{label}</h2><span className={cx("text-xs", statusTone[status])}>{statusLabel[status]}</span></div>{description && <p className="mt-1 text-sm leading-5 text-text-secondary">{description}</p>}<div className="mt-2 flex flex-wrap gap-x-3 text-xs tabular-nums text-text-secondary">{timestamp && <time>{timestamp}</time>}{messageCount !== undefined && <span>{messageCount} messages</span>}<span>Checkpoint {id}</span></div></div></div>
      <div className="flex shrink-0 gap-2">{onResume && <Button size="small" variant="secondary" leadingIcon={Play} disabled={disabled || busy} onClick={() => onResume(id)}>Resume</Button>}{onRestore && <Button size="small" leadingIcon={RotateCcw} disabled={disabled || busy} onClick={() => onRestore(id)}>{busy ? "Restoring" : "Restore"}</Button>}</div>
    </div>
    {busy && <div className="mt-4"><div className="flex justify-between text-xs text-text-secondary"><span>Restoring conversation and workspace state</span><span className="tabular-nums">{Math.round(value)}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background-secondary-default" role="progressbar" aria-label="Restore progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><span className="block h-full bg-accent-600 transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${value}%` }} /></div></div>}
    {status === "error" && <p className="mt-4 border-l-2 border-red-500 pl-3 text-sm text-red-700 dark:text-red-400" role="alert">{error ?? "The checkpoint could not be restored. Try again or choose another checkpoint."}</p>}
  </section>
}
