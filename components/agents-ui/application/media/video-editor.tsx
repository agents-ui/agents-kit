"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import {
  Clock,
  Copy,
  Download,
  Edit2,
  Pause,
  Play,
  RefreshCw,
  Scissors,
  SkipBack,
  SkipForward,
  Video,
} from "lucide-react"
import { useState } from "react"

export interface VideoClip {
  id: string
  name: string
  duration: number
  startTime: number
  endTime: number
  thumbnail?: string
}
export interface AgentVideoEditorProps {
  videoUrl?: string
  isGenerating?: boolean
  isPlaying?: boolean
  currentTime?: number
  duration?: number
  clips?: VideoClip[]
  onPlay?: () => void
  onPause?: () => void
  onSeek?: (time: number) => void
  onSkipBack?: () => void
  onSkipForward?: () => void
  onExport?: (format?: "mp4" | "mov" | "avi") => void
  onCopy?: () => void
  onEdit?: () => void
  onTrim?: () => void
  onRegenerateResponse?: () => void
  className?: string
  timestamp?: string
}
const time = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`

export function AgentVideoEditor({
  videoUrl,
  isGenerating = false,
  isPlaying = false,
  currentTime = 12,
  duration = 45,
  clips = [],
  onPlay,
  onPause,
  onSeek,
  onSkipBack,
  onSkipForward,
  onExport,
  onCopy,
  onEdit,
  onTrim,
  onRegenerateResponse,
  className,
  timestamp = "Just now",
}: AgentVideoEditorProps) {
  const [isExporting, setIsExporting] = useState(false)
  const handleExport = async () => {
    if (!videoUrl || isGenerating || isExporting) return
    setIsExporting(true)
    try {
      await onExport?.()
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-2xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <div>
          <h3 className="text-headline-semibold">Video output</h3>
          <p className="text-caption-1-regular text-text-secondary">
            {isGenerating
              ? "Rendering video"
              : isExporting
                ? "Preparing export"
                : `${time(duration)}  |  ${clips.length} clips  |  ${timestamp}`}
          </p>
        </div>
        <div className="flex gap-1">
          {onEdit && (
            <Button
              size="small"
              variant="ghost"
              leadingIcon={Edit2}
              onClick={onEdit}
            >
              Edit
            </Button>
          )}
          {onTrim && (
            <Button
              size="small"
              variant="ghost"
              leadingIcon={Scissors}
              onClick={onTrim}
            >
              Trim
            </Button>
          )}
          <Button
            size="small"
            variant="secondary"
            leadingIcon={isExporting ? RefreshCw : Download}
            onClick={handleExport}
            disabled={!videoUrl || isGenerating || isExporting}
          >
            {isExporting ? "Exporting" : "Export"}
          </Button>
        </div>
      </header>
      <div className="bg-background-secondary-default p-4">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-950">
          {videoUrl ? (
            <video
              src={videoUrl}
              className="h-full w-full object-contain"
              aria-label="Video preview"
            />
          ) : (
            <div className="grid h-full place-items-center text-center text-neutral-400">
              <div>
                <Video className="mx-auto size-8" />
                <p className="text-body-2-regular mt-2">
                  {isGenerating ? "Rendering preview" : "No video available"}
                </p>
              </div>
            </div>
          )}
          {isGenerating && (
            <div className="absolute inset-x-0 top-0 h-0.5 bg-neutral-800">
              <span className="block h-full w-1/2 animate-pulse bg-white" />
            </div>
          )}
        </div>
      </div>
      <div className="border-separator-border flex flex-wrap items-center gap-2 border-t px-4 py-3">
        <Button
          size="small"
          variant="ghost"
          iconOnly
          leadingIcon={SkipBack}
          aria-label="Skip back"
          onClick={onSkipBack}
        />
        <Button
          size="small"
          iconOnly
          leadingIcon={isPlaying ? Pause : Play}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          disabled={isGenerating || !videoUrl}
          onClick={isPlaying ? onPause : onPlay}
        />
        <Button
          size="small"
          variant="ghost"
          iconOnly
          leadingIcon={SkipForward}
          aria-label="Skip forward"
          onClick={onSkipForward}
        />
        <span className="text-caption-1-regular text-text-secondary tabular-nums">
          {time(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(event) => onSeek?.(Number(event.target.value))}
          aria-label="Video position"
          className="min-w-32 flex-1 accent-blue-600"
        />
        <span className="text-caption-1-regular text-text-secondary tabular-nums">
          {time(duration)}
        </span>
      </div>
      {clips.length > 0 && (
        <div className="border-separator-border border-t">
          <h4 className="text-caption-1-medium text-text-secondary px-4 pt-3 pb-1">
            Timeline
          </h4>
          {clips.map((clip) => (
            <div
              key={clip.id}
              className="border-separator-border flex min-h-11 items-center gap-3 border-t px-4"
            >
              <Clock className="text-text-tertiary size-4" />
              <span className="text-body-medium min-w-0 flex-1 truncate">
                {clip.name}
              </span>
              <span className="text-caption-1-regular text-text-secondary tabular-nums">
                {time(clip.startTime)} to {time(clip.endTime)}
              </span>
            </div>
          ))}
        </div>
      )}
      {(onCopy || onRegenerateResponse) && (
        <footer className="border-separator-border flex gap-1 border-t px-3 py-2">
          {onCopy && (
            <Button
              size="small"
              variant="ghost"
              leadingIcon={Copy}
              onClick={onCopy}
            >
              Copy
            </Button>
          )}
          {onRegenerateResponse && (
            <Button
              size="small"
              variant="ghost"
              leadingIcon={RefreshCw}
              onClick={onRegenerateResponse}
            >
              Regenerate
            </Button>
          )}
        </footer>
      )}
    </section>
  )
}
