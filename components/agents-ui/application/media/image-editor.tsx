"use client"

/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import {
  Copy,
  Download,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Sliders,
  Wand2,
} from "lucide-react"
import { useState } from "react"

export interface ImageVariation {
  id: string
  url: string
  label: string
  timestamp: string
}
export interface AgentImageEditorProps {
  imageUrl?: string
  variations?: ImageVariation[]
  currentVariation?: string
  isGenerating?: boolean
  onExport?: (format?: "png" | "jpg" | "webp") => void
  onCopy?: () => void
  onCreateVariation?: () => void
  onAdjust?: () => void
  onEnhance?: () => void
  onRegenerateResponse?: () => void
  className?: string
  agentAvatar?: string
  timestamp?: string
}

export function AgentImageEditor({
  imageUrl,
  variations = [],
  currentVariation,
  isGenerating = false,
  onExport,
  onCopy,
  onCreateVariation,
  onAdjust,
  onEnhance,
  onRegenerateResponse,
  className,
  timestamp = "Just now",
}: AgentImageEditorProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isCreatingVariation, setIsCreatingVariation] = useState(false)
  const current =
    variations.find((item) => item.id === currentVariation) ?? variations[0]
  const handleExport = async () => {
    if (!imageUrl || isGenerating || isExporting) return
    setIsExporting(true)
    try {
      await onExport?.()
    } finally {
      setIsExporting(false)
    }
  }
  const handleVariation = async () => {
    if (isGenerating || isCreatingVariation) return
    setIsCreatingVariation(true)
    try {
      await onCreateVariation?.()
    } finally {
      setIsCreatingVariation(false)
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
          <h3 className="text-headline-semibold">
            {current?.label ?? "Image output"}
          </h3>
          <p className="text-caption-1-regular text-text-secondary">
            {isGenerating
              ? "Generating image"
              : isExporting
                ? "Preparing export"
                : isCreatingVariation
                  ? "Creating variation"
                  : `${variations.length || 1} versions  |  ${timestamp}`}
          </p>
        </div>
        <div className="flex gap-1">
          {onAdjust && (
            <Button
              size="small"
              variant="ghost"
              leadingIcon={Sliders}
              onClick={onAdjust}
            >
              Adjust
            </Button>
          )}
          {onEnhance && (
            <Button
              size="small"
              variant="ghost"
              leadingIcon={Wand2}
              onClick={onEnhance}
            >
              Enhance
            </Button>
          )}
          <Button
            size="small"
            variant="secondary"
            leadingIcon={isExporting ? RefreshCw : Download}
            onClick={handleExport}
            disabled={!imageUrl || isGenerating || isExporting}
          >
            {isExporting ? "Exporting" : "Export"}
          </Button>
        </div>
      </header>
      <div className="bg-background-secondary-default relative p-4">
        <div className="bg-background-primary-default grid min-h-72 place-items-center overflow-hidden rounded-lg">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={current?.label || "Generated image"}
              className="max-h-[520px] w-full object-contain"
            />
          ) : (
            <div className="text-text-secondary text-center">
              <ImageIcon className="mx-auto size-8" />
              <p className="text-body-2-regular mt-2">
                {isGenerating ? "Generating preview" : "No image available"}
              </p>
            </div>
          )}
        </div>
        {isGenerating && (
          <div className="bg-border-button-default absolute inset-x-4 top-4 h-0.5">
            <span className="bg-text-primary block h-full w-1/2 animate-pulse" />
          </div>
        )}
      </div>
      <footer className="border-separator-border flex flex-wrap gap-1 border-t px-3 py-2">
        {onCreateVariation && (
          <Button
            size="small"
            variant="ghost"
            leadingIcon={isCreatingVariation ? RefreshCw : Plus}
            onClick={handleVariation}
            disabled={isGenerating || isCreatingVariation}
          >
            {isCreatingVariation ? "Creating variation" : "Create variation"}
          </Button>
        )}
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
      {variations.length > 0 && (
        <div className="border-separator-border border-t px-4 py-3">
          <h4 className="text-caption-1-medium text-text-secondary mb-2">
            Versions
          </h4>
          <div className="flex gap-2 overflow-x-auto">
            {variations.map((item) => (
              <figure
                key={item.id}
                className={cx(
                  "bg-background-secondary-default w-28 shrink-0 overflow-hidden rounded-lg border",
                  item.id === current?.id
                    ? "border-border-focus-ring"
                    : "border-separator-border"
                )}
              >
                <img
                  src={item.url}
                  alt=""
                  className="h-16 w-full object-cover"
                />
                <figcaption className="text-caption-1-regular truncate px-2 py-1.5">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
