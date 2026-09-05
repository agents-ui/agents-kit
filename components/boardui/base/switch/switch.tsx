"use client"

import { cx, sortCx } from "@/components/boardui/utils/cx"
import type { ReactNode, Ref } from "react"
import { Switch as AriaSwitch } from "react-aria-components"
import type { SwitchProps as AriaSwitchProps } from "react-aria-components"

/** BoardUI switch with a flat track, native semantics, and keyboard focus. */

export type SwitchSize = "sm" | "md" | "lg"
export type SwitchShape = "pill" | "rectangle"

export const switchSizes = sortCx({
  sm: {
    track: "h-4 w-7",
    trackRadius: { pill: "rounded-full", rectangle: "rounded-[3px]" },
    onShadow:
      "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.25),inset_0_0_0_0.5px_var(--color-accent-500)]",
    thumb: "size-3",
    thumbRadius: { pill: "rounded-full", rectangle: "rounded-[1px]" },
    offset: "left-0.5 top-0.5",
    travel: "translate-x-3",
    chip: "size-[5px] border-[0.25px] shadow-[0_2px_2px_0_rgb(0_0_0/0.03)]",
    chipRadius: { pill: "rounded-full", rectangle: "rounded-[0.5px]" },
  },
  md: {
    track: "h-6 w-[42px]",
    trackRadius: { pill: "rounded-full", rectangle: "rounded-[4.5px]" },
    onShadow:
      "shadow-[inset_0_1.5px_0_0_rgb(255_255_255/0.25),inset_0_0_0_0.75px_var(--color-accent-500)]",
    thumb: "size-[18px]",
    thumbRadius: { pill: "rounded-full", rectangle: "rounded-[1.5px]" },
    offset: "left-[3px] top-[3px]",
    travel: "translate-x-[18px]",
    chip: "size-[7.5px] border-[0.375px] shadow-[0_3px_3px_0_rgb(0_0_0/0.03)]",
    chipRadius: { pill: "rounded-full", rectangle: "rounded-[0.75px]" },
  },
  lg: {
    track: "h-8 w-14",
    trackRadius: { pill: "rounded-full", rectangle: "rounded-md" },
    onShadow: "shadow-checkbox-selected",
    thumb: "size-6",
    thumbRadius: { pill: "rounded-full", rectangle: "rounded-xs" },
    offset: "left-1 top-1",
    travel: "translate-x-6",
    chip: "size-[10px] border-[0.5px] shadow-[0_4px_4px_0_rgb(0_0_0/0.03)]",
    chipRadius: { pill: "rounded-full", rectangle: "rounded-[1px]" },
  },
})

export interface SwitchVisualState {
  isSelected: boolean
  isDisabled: boolean
  isFocusVisible: boolean
}

/**
 * The track + thumb + chip visual. Pure presentation - the react-aria Switch
 * (in `Switch` or `SwitchCard`) owns the input and passes its render state in.
 */
export function SwitchTrack({
  state,
  size = "md",
  shape = "pill",
}: {
  state: SwitchVisualState
  size?: SwitchSize
  shape?: SwitchShape
}) {
  const s = switchSizes[size]

  return (
    <span
      aria-hidden
      className={cx(
        "relative inline-block shrink-0 transition-colors duration-150",
        s.track,
        s.trackRadius[shape],
        state.isSelected ? "bg-accent-500" : "bg-background-tertiary-default",
        state.isDisabled && "opacity-50",
        state.isFocusVisible && "ring-border-focus-ring ring-2 ring-offset-2"
      )}
    >
      {/* Thumb */}
      <span
        className={cx(
          "absolute flex items-center justify-center",
          "bg-control-indicator-background",
          "shadow-[0_3px_3px_0_rgb(0_0_0/0.03),0_0.75px_0_0_rgb(0_0_0/0.05)]",
          "transition-transform duration-150",
          s.thumb,
          s.thumbRadius[shape],
          s.offset,
          state.isSelected && s.travel
        )}
      ></span>
    </span>
  )
}

export interface SwitchProps extends Omit<AriaSwitchProps, "children"> {
  children?: ReactNode
  size?: SwitchSize
  shape?: SwitchShape
  ref?: Ref<HTMLLabelElement>
}

export function Switch({
  className,
  children,
  size = "md",
  shape = "pill",
  ref,
  ...props
}: SwitchProps) {
  return (
    <AriaSwitch
      ref={ref}
      {...props}
      className={(state) =>
        cx(
          "group inline-flex items-center gap-2 select-none",
          state.isDisabled ? "cursor-not-allowed" : "cursor-pointer",
          typeof className === "function" ? className(state) : className
        )
      }
    >
      {(state) => (
        <>
          <SwitchTrack state={state} size={size} shape={shape} />
          {children != null && children !== false && (
            <span className="text-body-medium text-text-primary">
              {children}
            </span>
          )}
        </>
      )}
    </AriaSwitch>
  )
}
