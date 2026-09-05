"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { FileText, RefreshCw, Trash2, Upload } from "lucide-react"
import * as React from "react"

export type FileQueueStatus = "queued" | "uploading" | "complete" | "error"
export interface FileQueueItem {
  id: string
  name: string
  size: string
  status: FileQueueStatus
  progress?: number
  error?: string
}
export interface FileQueueProps {
  files: FileQueueItem[]
  onFilesSelected: (files: File[]) => void
  onRemove: (id: string) => void
  onRetry?: (id: string) => void
  onUpload?: () => void
  accept?: string
  multiple?: boolean
  maxSizeLabel?: string
  disabled?: boolean
  className?: string
}
const statusLabel: Record<FileQueueStatus, string> = {
  queued: "Ready to upload",
  uploading: "Uploading",
  complete: "Complete",
  error: "Upload failed",
}
export function FileQueue({
  files,
  onFilesSelected,
  onRemove,
  onRetry,
  onUpload,
  accept,
  multiple = true,
  maxSizeLabel = "Maximum 10 MB per file",
  disabled = false,
  className,
}: FileQueueProps) {
  const input = React.useRef<HTMLInputElement>(null)
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default w-full max-w-[620px] rounded-xl border p-5",
        className
      )}
    >
      <header>
        <h2 className="text-lg font-semibold">Files</h2>
        <p className="text-text-secondary mt-1 text-sm">
          Add supporting documents to this workspace.
        </p>
      </header>
      <input
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          onFilesSelected(Array.from(e.target.files ?? []))
          e.currentTarget.value = ""
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => input.current?.click()}
        onDrop={(e) => {
          e.preventDefault()
          if (!disabled) onFilesSelected(Array.from(e.dataTransfer.files))
        }}
        onDragOver={(e) => e.preventDefault()}
        className="border-separator-border text-text-secondary hover:bg-background-secondary-default focus:ring-border-focus-ring mt-4 flex min-h-28 w-full items-center justify-center gap-3 rounded-lg border border-dashed px-5 text-sm outline-none focus:ring-2 disabled:opacity-50"
      >
        <Upload className="size-5" />
        <span>Drop files here or choose files</span>
      </button>
      <p className="text-text-secondary mt-2 text-xs">
        {maxSizeLabel}
        {accept ? ` · ${accept}` : ""}
      </p>
      {files.length ? (
        <div className="divide-separator-border border-separator-border mt-5 divide-y border-y">
          {files.map((file) => {
            const progress = Math.max(
              0,
              Math.min(
                100,
                file.progress ?? (file.status === "complete" ? 100 : 0)
              )
            )
            return (
              <div
                key={file.id}
                className="grid grid-cols-[20px_1fr_auto] gap-3 py-3"
              >
                <FileText className="text-text-secondary mt-0.5 size-4" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <div className="text-text-secondary mt-1 flex justify-between text-xs">
                    <span>{file.size}</span>
                    <span
                      className={
                        file.status === "error"
                          ? "text-red-700 dark:text-red-400"
                          : ""
                      }
                    >
                      {file.error ?? statusLabel[file.status]}
                    </span>
                  </div>
                  {file.status === "uploading" && (
                    <div className="bg-background-secondary-default mt-2 h-1 overflow-hidden rounded-full">
                      <div
                        className="bg-accent-600 h-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  {file.status === "error" && onRetry && (
                    <Button
                      variant="ghost"
                      size="xs"
                      iconOnly
                      aria-label={`Retry ${file.name}`}
                      onClick={() => onRetry(file.id)}
                    >
                      <RefreshCw />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="xs"
                    iconOnly
                    aria-label={`Remove ${file.name}`}
                    onClick={() => onRemove(file.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="border-separator-border text-text-secondary mt-5 border-y py-4 text-sm">
          No files selected.
        </p>
      )}
      <div className="mt-5 flex justify-end">
        <Button
          onClick={onUpload}
          disabled={
            disabled ||
            !files.length ||
            files.some((f) => f.status === "uploading")
          }
        >
          Upload {files.length ? files.length : "files"}
        </Button>
      </div>
    </section>
  )
}
