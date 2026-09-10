"use client"

import {
  ImageGeneration,
  type ImageGenerationStatus,
} from "@/components/beui/components/agents/image-generation"
import { RotateCcw } from "lucide-react"
import { useReducedMotion } from "motion/react"
import * as React from "react"
import { useEffect, useState } from "react"

function GeneratedArtwork() {
  return (
    <svg
      viewBox="0 0 800 600"
      aria-hidden="true"
      className="size-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="fieldwork-board" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#10251f" />
          <stop offset="0.55" stopColor="#244a3d" />
          <stop offset="1" stopColor="#718b68" />
        </linearGradient>
        <radialGradient id="fieldwork-light">
          <stop offset="0" stopColor="#d9f99d" stopOpacity="0.55" />
          <stop offset="1" stopColor="#d9f99d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="url(#fieldwork-board)" />
      <circle cx="410" cy="285" r="285" fill="url(#fieldwork-light)" />
      <g stroke="#d9f99d" strokeWidth="3" strokeOpacity="0.38">
        <path d="M186 179 382 290 612 157" />
        <path d="M382 290 604 431" />
        <path d="M382 290 196 448" />
      </g>
      <g fill="#f4f7e8" stroke="#d9f99d" strokeWidth="4">
        <rect x="92" y="102" width="188" height="138" rx="18" />
        <rect x="286" y="224" width="192" height="138" rx="18" />
        <rect x="522" y="88" width="180" height="138" rx="18" />
        <rect x="510" y="370" width="188" height="138" rx="18" />
        <rect x="104" y="378" width="184" height="138" rx="18" />
      </g>
      <g fill="#214237" opacity="0.78">
        <rect x="122" y="136" width="116" height="12" rx="6" />
        <rect x="122" y="165" width="90" height="8" rx="4" />
        <rect x="318" y="260" width="128" height="12" rx="6" />
        <rect x="318" y="289" width="104" height="8" rx="4" />
        <rect x="552" y="122" width="112" height="12" rx="6" />
        <rect x="552" y="151" width="84" height="8" rx="4" />
        <rect x="540" y="404" width="120" height="12" rx="6" />
        <rect x="540" y="433" width="96" height="8" rx="4" />
        <rect x="134" y="412" width="112" height="12" rx="6" />
        <rect x="134" y="441" width="82" height="8" rx="4" />
      </g>
    </svg>
  )
}

function GenerationDemo({ onReplay }: { onReplay: () => void }) {
  const reduce = useReducedMotion() ?? false
  const [status, setStatus] = useState<ImageGenerationStatus>(
    reduce ? "complete" : "queued"
  )

  useEffect(() => {
    if (reduce) return

    const timers = [
      window.setTimeout(() => setStatus("generating"), 500),
      window.setTimeout(() => setStatus("refining"), 3000),
      window.setTimeout(() => setStatus("complete"), 5200),
    ]

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer)
      })
    }
  }, [reduce])

  return (
    <div className="flex w-full flex-col items-center">
      <ImageGeneration
        label="A research wall connecting five interview themes"
        prompt="a restrained fieldwork synthesis board with linked research notes"
        resolution="1024 × 1024"
        status={status}
        onRetry={onReplay}
      >
        <GeneratedArtwork />
      </ImageGeneration>
      <button
        type="button"
        onClick={onReplay}
        className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring mt-4 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2"
      >
        <RotateCcw aria-hidden="true" className="size-4" />
        Replay
      </button>
    </div>
  )
}

export function ImageGenerationPreview() {
  const [run, setRun] = useState(0)

  return (
    <div className="w-full max-w-xl">
      <GenerationDemo key={run} onReplay={() => setRun((value) => value + 1)} />
    </div>
  )
}
