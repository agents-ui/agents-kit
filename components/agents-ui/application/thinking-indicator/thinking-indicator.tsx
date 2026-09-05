"use client"

import { cx } from "@/components/boardui/utils/cx"
import { ThinkingOrb as UpstreamThinkingOrb } from "./upstream/ThinkingOrb"
import type {
  OrbSize,
  OrbState,
  ThinkingOrbProps as UpstreamThinkingOrbProps,
} from "./upstream/types"

export type ThinkingState = OrbState
export type ThinkingOrbSize = OrbSize
export type ThinkingOrbProps = UpstreamThinkingOrbProps

export interface ThinkingIndicatorProps
  extends Pick<
    UpstreamThinkingOrbProps,
    "theme" | "speed" | "color" | "dots" | "dotSize" | "opts" | "frame"
  > {
  state?: ThinkingState
  size?: ThinkingOrbSize
  label?: string
  paused?: boolean
  detail?: string
  className?: string
}

const labels: Record<ThinkingState, string> = {
  working: "Working",
  searching: "Searching",
  solving: "Solving",
  listening: "Listening",
  connecting: "Connecting",
  weaving: "Weaving",
  composing: "Composing",
  breathing: "Thinking",
  shaping: "Shaping response",
}

export const ThinkingOrb = UpstreamThinkingOrb

export function ThinkingIndicator({
  state = "working",
  size = 20,
  label,
  paused = false,
  detail,
  className,
  theme,
  speed,
  color,
  dots,
  dotSize,
  opts,
  frame,
}: ThinkingIndicatorProps) {
  const text = label ?? labels[state]
  return (
    <div
      className={cx(
        "border-separator-border bg-background-primary-default inline-flex items-center gap-2.5 rounded-lg border px-3 py-2",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">
        <ThinkingOrb
          state={state}
          size={size}
          paused={paused}
          theme={theme}
          speed={speed}
          color={color}
          dots={dots}
          dotSize={dotSize}
          opts={opts}
          frame={frame}
        />
      </span>
      <span className="min-w-0">
        <span className="text-text-primary block text-sm font-medium">
          {text}
        </span>
        {detail && (
          <span className="text-text-secondary mt-0.5 block text-xs">
            {detail}
          </span>
        )}
      </span>
    </div>
  )
}
