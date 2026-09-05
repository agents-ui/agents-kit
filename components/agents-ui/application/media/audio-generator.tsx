"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import {
  ChevronDown,
  Copy,
  Download,
  Edit2,
  Pause,
  Play,
  RefreshCw,
  Volume2,
} from "lucide-react"
import { useState } from "react"

export interface VoiceOption {
  id: string
  name: string
  gender: "Male" | "Female"
  accent?: string
}
export interface AgentAudioGeneratorProps {
  audioUrl?: string
  isGenerating?: boolean
  isPlaying?: boolean
  currentTime?: number
  duration?: number
  onPlay?: () => void
  onPause?: () => void
  onSeek?: (time: number) => void
  onExport?: (format?: "mp3" | "wav" | "m4a") => void
  onCopy?: () => void
  onEdit?: () => void
  onRegenerateResponse?: () => void
  onLanguageChange?: (language: string) => void
  onSpeedChange?: (speed: string) => void
  onVoiceChange?: (voice: VoiceOption) => void
  onToneChange?: (tone: string) => void
  language?: string
  speed?: string
  voice?: VoiceOption
  tone?: string
  availableVoices?: VoiceOption[]
  className?: string
  timestamp?: string
}

const voices: VoiceOption[] = [
  { id: "jenny", name: "Jenny", gender: "Female", accent: "American" },
  { id: "alex", name: "Alex", gender: "Male", accent: "British" },
  { id: "sarah", name: "Sarah", gender: "Female", accent: "Australian" },
]
const time = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`

function Setting({
  label,
  value,
  onClick,
}: {
  label: string
  value: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-separator-border hover:bg-background-secondary-hover flex min-h-12 items-center justify-between gap-3 border-b px-4 text-left sm:border-r"
    >
      <span className="text-caption-1-medium text-text-secondary">{label}</span>
      <span className="text-body-medium inline-flex items-center gap-1.5">
        {value}
        <ChevronDown className="text-text-tertiary size-3.5" />
      </span>
    </button>
  )
}

export function AgentAudioGenerator({
  audioUrl,
  isGenerating = false,
  isPlaying = false,
  currentTime = 21,
  duration = 62,
  onPlay,
  onPause,
  onSeek,
  onExport,
  onCopy,
  onEdit,
  onRegenerateResponse,
  onLanguageChange,
  onSpeedChange,
  onVoiceChange,
  onToneChange,
  language = "English (US)",
  speed = "Normal",
  voice = voices[0],
  tone = "Friendly",
  availableVoices = voices,
  className,
  timestamp = "Just now",
}: AgentAudioGeneratorProps) {
  const [isExporting, setIsExporting] = useState(false)
  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0
  const bars = Array.from({ length: 48 }, (_, index) =>
    Math.min(
      32,
      Math.abs(Math.sin(index * 1.31) * 21 + Math.sin(index * 0.39) * 7) + 5
    )
  )
  const voiceIndex = Math.max(
    0,
    availableVoices.findIndex((item) => item.id === voice?.id)
  )
  const nextVoice =
    availableVoices[(voiceIndex + 1) % Math.max(1, availableVoices.length)]
  const handleExport = async () => {
    if (!audioUrl || isGenerating || isExporting) return
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
          <h3 className="text-headline-semibold">Generated audio</h3>
          <p className="text-caption-1-regular text-text-secondary">
            {isGenerating
              ? "Generating audio"
              : isExporting
                ? "Preparing export"
                : `Ready  |  ${time(duration)}  |  ${timestamp}`}
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
          <Button
            size="small"
            variant="secondary"
            leadingIcon={isExporting ? RefreshCw : Download}
            onClick={handleExport}
            disabled={!audioUrl || isGenerating || isExporting}
          >
            {isExporting ? "Exporting" : "Export"}
          </Button>
        </div>
      </header>
      <div className="p-4">
        <div className="bg-background-secondary-default flex items-center gap-4 rounded-lg p-4">
          <Button
            size="medium"
            iconOnly
            leadingIcon={isGenerating ? RefreshCw : isPlaying ? Pause : Play}
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
            disabled={isGenerating || !audioUrl}
            onClick={isPlaying ? onPause : onPlay}
          />
          <div className="min-w-0 flex-1">
            <div className="relative flex h-10 items-center gap-0.5">
              {bars.map((height, index) => (
                <span
                  key={index}
                  className={cx(
                    "w-1 rounded-full",
                    (index / bars.length) * 100 <= progress
                      ? "bg-text-primary"
                      : "bg-border-button-default"
                  )}
                  style={{ height }}
                />
              ))}
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={(event) => onSeek?.(Number(event.target.value))}
                aria-label="Audio position"
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
            <div className="text-caption-1-regular text-text-secondary mt-1 flex justify-between tabular-nums">
              <span>{time(currentTime)}</span>
              <span>{time(duration)}</span>
            </div>
          </div>
          <Volume2 className="text-text-secondary size-4" />
        </div>
      </div>
      <div className="border-separator-border grid border-t sm:grid-cols-2">
        <Setting
          label="Language"
          value={language}
          onClick={() =>
            onLanguageChange?.(
              language === "English (US)" ? "Spanish" : "English (US)"
            )
          }
        />
        <Setting
          label="Speed"
          value={speed}
          onClick={() =>
            onSpeedChange?.(speed === "Normal" ? "1.25x" : "Normal")
          }
        />
        <Setting
          label="Voice"
          value={
            voice
              ? `${voice.name}${voice.accent ? `, ${voice.accent}` : ""}`
              : "Default"
          }
          onClick={() => {
            if (nextVoice) onVoiceChange?.(nextVoice)
          }}
        />
        <Setting
          label="Tone"
          value={tone}
          onClick={() =>
            onToneChange?.(tone === "Friendly" ? "Professional" : "Friendly")
          }
        />
      </div>
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
