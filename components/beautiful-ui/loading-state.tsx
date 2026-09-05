"use client"

import { cx } from "@/components/boardui/utils/cx"
import * as React from "react"

export type LoadingVariant = "drive" | "dots" | "orbit" | "surfer"
export interface LoadingStateProps {
  variant?: LoadingVariant
  label?: string
  elapsed?: string
  elapsedSeconds?: number
  startTime?: number | Date
  running?: boolean
  mediaUrl?: string
  className?: string
}

const chevron = Array.from(
  { length: 9 },
  (_, index) => ((index % 3) + Math.abs(Math.floor(index / 3) - 1)) * 90
)
const orbitOrder = [0, 1, 2, 5, 8, 7, 6, 3]

function PixelGrid({
  variant,
}: {
  variant: Exclude<LoadingVariant, "surfer">
}) {
  const delays =
    variant === "orbit"
      ? Array.from({ length: 9 }, (_, index) => {
          const order = orbitOrder.indexOf(index)
          return order < 0 ? null : order * 110
        })
      : chevron
  const duration = variant === "orbit" ? 950 : 650
  return (
    <span
      aria-hidden
      className="grid shrink-0 grid-cols-[repeat(3,4px)] gap-[1.5px]"
    >
      {delays.map((delay, index) => (
        <span
          key={index}
          className={cx(
            "bg-text-primary size-1",
            variant === "dots" ? "rounded-full" : "rounded-[1px]"
          )}
          style={{
            opacity: delay === null ? 0.07 : 0.15,
            animation:
              delay === null
                ? "none"
                : `beautiful-pixel ${duration}ms ease-in-out ${delay}ms infinite`,
          }}
        />
      ))}
    </span>
  )
}

function secondsSince(value: number | Date) {
  const milliseconds = value instanceof Date ? value.getTime() : value
  return Math.max(0, (Date.now() - milliseconds) / 1000)
}

function formatElapsed(seconds: number) {
  if (seconds < 60) return `${seconds.toFixed(seconds < 10 ? 1 : 0)}s`
  return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`
}

export function LoadingState({
  variant = "drive",
  label = "Working",
  elapsed,
  elapsedSeconds,
  startTime,
  running = true,
  mediaUrl,
  className,
}: LoadingStateProps) {
  const [liveSeconds, setLiveSeconds] = React.useState(() =>
    startTime === undefined ? 0 : secondsSince(startTime)
  )
  React.useEffect(() => {
    if (
      elapsed !== undefined ||
      elapsedSeconds !== undefined ||
      startTime === undefined ||
      !running
    )
      return
    const update = () => setLiveSeconds(secondsSince(startTime))
    update()
    const timer = window.setInterval(update, 250)
    return () => window.clearInterval(timer)
  }, [elapsed, elapsedSeconds, running, startTime])
  const displayElapsed =
    elapsed ??
    (elapsedSeconds !== undefined
      ? formatElapsed(Math.max(0, elapsedSeconds))
      : startTime !== undefined
        ? formatElapsed(liveSeconds)
        : undefined)
  const pattern = variant === "surfer" ? "drive" : variant
  return (
    <div role="status" className={cx("w-fit", className)}>
      <style>{`@keyframes beautiful-pixel{0%,55%,100%{opacity:.15;transform:scale(.86)}25%{opacity:1;transform:scale(1)}}@media(prefers-reduced-motion:reduce){[style*="beautiful-pixel"]{animation:none!important;transform:none!important}}`}</style>
      <div className="flex min-h-7 items-center gap-2.5">
        <PixelGrid variant={pattern} />
        <span className="text-text-primary text-sm font-medium">{label}</span>
        {displayElapsed && (
          <span
            suppressHydrationWarning
            className="text-text-secondary font-mono text-xs tabular-nums"
          >
            {displayElapsed}
          </span>
        )}
      </div>
      {variant === "surfer" && (
        <div className="border-separator-border bg-background-secondary-default mt-3 aspect-video w-56 overflow-hidden rounded-lg border">
          {mediaUrl ? (
            <video
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <PixelGrid variant="drive" />
              <span className="text-text-secondary text-xs">
                No media supplied
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
