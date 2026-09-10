"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import {
  BorderBeam,
  type BorderBeamColorVariant,
  type BorderBeamSize,
} from "@/components/effects/border-beam"
import {
  ImageGeneration,
  type ImageGenerationCycleEvent,
  type ImageGenerationHandle,
  type ImageGenerationPreset,
} from "@/components/effects/img-fx"
import { Liquid } from "@/components/effects/liquid-gooey"
import {
  MetalBadge,
  MetalFx,
  MetalText,
  type MetalFxPreset,
  type MetalFxVariant,
} from "@/components/effects/metal-fx"
import { MetalFx as MetalFxV1 } from "@/components/effects/metal-fx-v1"
import { Check, FileText, Plus } from "lucide-react"
import { useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"
import Image from "next/image"
import * as React from "react"

const publicBase = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")
const imagePool = [
  `${publicBase}/examples/fieldwork-botanical.webp`,
  `${publicBase}/examples/fieldwork-harbour.webp`,
  `${publicBase}/examples/fieldwork-studio.webp`,
]

export function BorderBeamPreview() {
  const reduced = useReducedMotion()
  const [active, setActive] = React.useState(true)
  const [style, setStyle] = React.useState<BorderBeamSize>("line")
  const [color, setColor] = React.useState<BorderBeamColorVariant>("ocean")
  const { resolvedTheme } = useTheme()
  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="flex min-h-52 items-center justify-center p-3">
        <BorderBeam
          active={active && !reduced}
          size={style}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          colorVariant={color}
          strength={0.9}
          className="w-full"
        >
          <div className="border-separator-border bg-background-primary-default rounded-xl border p-4">
            <div className="flex items-center gap-2">
              <FileText
                aria-hidden="true"
                className="text-text-secondary size-4"
              />
              <span className="flex-1 text-[13px] font-medium">
                Preparing your brief
              </span>
              <span className="text-text-secondary text-xs">
                {reduced ? "Motion reduced" : active ? "Working" : "Paused"}
              </span>
            </div>
            <p className="text-text-secondary mt-3 text-xs leading-5">
              Reading the selected sources and collecting the key details.
            </p>
          </div>
        </BorderBeam>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <select
          aria-label="Beam style"
          value={style}
          onChange={(event) => setStyle(event.target.value as BorderBeamSize)}
          className="border-separator-border bg-background-primary-default h-8 rounded-lg border px-2 text-xs"
        >
          <option value="sm">Small</option>
          <option value="md">Border</option>
          <option value="line">Line</option>
          <option value="pulse-inner">Inner pulse</option>
          <option value="pulse-outside">Outer pulse</option>
        </select>
        <select
          aria-label="Beam color"
          value={color}
          onChange={(event) =>
            setColor(event.target.value as BorderBeamColorVariant)
          }
          className="border-separator-border bg-background-primary-default h-8 rounded-lg border px-2 text-xs capitalize"
        >
          {[
            "colorful",
            "mono",
            "ocean",
            "sunset",
            "forest",
            "candy",
            "ice",
            "gold",
          ].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <Button
          size="xs"
          variant="ghost"
          disabled={Boolean(reduced)}
          onClick={() => setActive(!active)}
        >
          {reduced
            ? "Motion reduced"
            : active
              ? "Pause effect"
              : "Resume effect"}
        </Button>
      </div>
    </div>
  )
}

export function MetalPreview() {
  const reduced = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const [preset, setPreset] = React.useState<MetalFxPreset>("chromatic")
  const [variant, setVariant] = React.useState<MetalFxVariant>("button")
  const [paused, setPaused] = React.useState(false)
  const stopped = paused || Boolean(reduced)
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div className="flex min-h-56 flex-col items-center justify-center gap-6 py-8">
        <MetalFx
          preset={preset}
          variant={variant}
          theme={theme}
          paused={stopped}
          innerShadow
        >
          <button
            type="button"
            aria-label={variant === "circle" ? "Run agent" : undefined}
            className={cx(
              "font-medium",
              variant === "circle"
                ? "size-10 rounded-full text-base"
                : "h-10 rounded-full px-5 text-sm"
            )}
          >
            {variant === "circle" ? "↑" : "Run agent"}
          </button>
        </MetalFx>
        <div className="flex min-h-8 items-center gap-4">
          {stopped ? (
            <>
              <span className="text-lg font-medium">Agent</span>
              <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-neutral-800">
                New
              </span>
            </>
          ) : (
            <>
              <MetalText
                font="500 18px/1.2 var(--font-sans), sans-serif"
                color={theme === "dark" ? "#e5e5e5" : "#262626"}
                theme={theme}
              >
                Agent
              </MetalText>
              <MetalBadge theme={theme}>New</MetalBadge>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {(["chromatic", "silver", "gold"] as const).map((value) => (
          <Button
            key={value}
            size="xs"
            variant={preset === value ? "secondary" : "ghost"}
            aria-pressed={preset === value}
            className="capitalize"
            onClick={() => setPreset(value)}
          >
            {value}
          </Button>
        ))}
        {(["button", "circle"] as const).map((value) => (
          <Button
            key={value}
            size="xs"
            variant={variant === value ? "secondary" : "ghost"}
            aria-pressed={variant === value}
            className="capitalize"
            onClick={() => setVariant(value)}
          >
            {value}
          </Button>
        ))}
        <Button
          size="xs"
          variant="ghost"
          disabled={Boolean(reduced)}
          onClick={() => setPaused(!paused)}
        >
          {reduced ? "Motion reduced" : paused ? "Resume" : "Pause"}
        </Button>
      </div>
    </div>
  )
}

export function MetalV1Preview() {
  const reduced = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const [preset, setPreset] = React.useState<MetalFxPreset>("chromatic")
  const [variant, setVariant] = React.useState<MetalFxVariant>("button")
  const [paused, setPaused] = React.useState(false)

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div className="flex min-h-56 items-center justify-center py-8">
        <MetalFxV1
          preset={preset}
          variant={variant}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          paused={paused || Boolean(reduced)}
        >
          <button
            type="button"
            aria-label={variant === "circle" ? "Run agent" : undefined}
            className={cx(
              "font-medium",
              variant === "circle"
                ? "size-10 rounded-full text-base"
                : "h-10 rounded-full px-5 text-sm"
            )}
          >
            {variant === "circle" ? "↑" : "Run agent"}
          </button>
        </MetalFxV1>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {(["chromatic", "silver", "gold"] as const).map((value) => (
          <Button
            key={value}
            size="xs"
            variant={preset === value ? "secondary" : "ghost"}
            aria-pressed={preset === value}
            className="capitalize"
            onClick={() => setPreset(value)}
          >
            {value}
          </Button>
        ))}
        {(["button", "circle"] as const).map((value) => (
          <Button
            key={value}
            size="xs"
            variant={variant === value ? "secondary" : "ghost"}
            aria-pressed={variant === value}
            className="capitalize"
            onClick={() => setVariant(value)}
          >
            {value}
          </Button>
        ))}
        <Button
          size="xs"
          variant="ghost"
          disabled={Boolean(reduced)}
          onClick={() => setPaused(!paused)}
        >
          {reduced ? "Motion reduced" : paused ? "Resume" : "Pause"}
        </Button>
      </div>
    </div>
  )
}

export function ImageFxPreview() {
  const reduced = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const handle = React.useRef<ImageGenerationHandle>(null)
  const [preset, setPreset] =
    React.useState<ImageGenerationPreset>("pixels-organic")
  const [paused, setPaused] = React.useState(false)
  const [phase, setPhase] =
    React.useState<ImageGenerationCycleEvent["phase"]>("idle")
  const stopped = paused || Boolean(reduced)
  const imageActive = phase !== "idle"

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div className="flex min-h-64 items-center justify-center py-6">
        <ImageGeneration
          ref={handle}
          preset={preset}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          images={imagePool}
          autoReveal
          revealInitialDelay={0.5}
          revealDelayRange={[1.5, 2.5]}
          revealHoldMs={1800}
          paused={stopped}
          onCycle={(event) => setPhase(event.phase)}
        >
          <div className="h-52 w-72 rounded-2xl" />
        </ImageGeneration>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {(["pixels-organic", "pixels-mechanic", "sweep-gradient"] as const).map(
          (value) => (
            <Button
              key={value}
              size="xs"
              variant={preset === value ? "secondary" : "ghost"}
              aria-pressed={preset === value}
              onClick={() => setPreset(value)}
            >
              {value.replace("pixels-", "")}
            </Button>
          )
        )}
        <Button
          size="xs"
          variant="ghost"
          disabled={stopped}
          onClick={() =>
            imageActive
              ? handle.current?.triggerHide()
              : handle.current?.triggerReveal({ hold: "manual" })
          }
        >
          {imageActive ? "Hide image" : "Reveal image"}
        </Button>
        <Button
          size="xs"
          variant="ghost"
          disabled={stopped || (phase !== "reveal" && phase !== "visible")}
          onClick={() =>
            handle.current?.triggerRegenerate({ durationMs: 2200 })
          }
        >
          Regenerate
        </Button>
        <Button
          size="xs"
          variant="ghost"
          disabled={Boolean(reduced)}
          onClick={() => setPaused(!paused)}
        >
          {reduced ? "Motion reduced" : paused ? "Resume" : "Pause"}
        </Button>
      </div>
    </div>
  )
}

export function GooeyPreview() {
  const reduced = useReducedMotion()
  const [mode, setMode] = React.useState<"morph" | "move" | "melt" | "bend">(
    "morph"
  )
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(0)
  const [melted, setMelted] = React.useState(true)
  const choices = ["Brief", "Sources", "Notes"]
  const morphCard = (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className="text-text-primary focus-visible:ring-border-focus-ring flex flex-col items-center justify-center overflow-hidden outline-none focus-visible:ring-2"
      style={{
        width: open ? 256 : 48,
        height: open ? 116 : 48,
        borderRadius: open ? 18 : 24,
        background: "var(--color-background-primary-default)",
      }}
    >
      {open ? (
        <>
          <span className="text-[13px] font-medium">
            Three sources selected
          </span>
          <span className="text-text-secondary mt-2 max-w-48 text-xs leading-5">
            Your brief will include links to the original material.
          </span>
          <span className="text-text-tertiary mt-3 text-[11px]">
            Close details
          </span>
        </>
      ) : (
        <Plus aria-label="Open source details" className="size-5" />
      )}
    </button>
  )
  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="flex min-h-56 items-center justify-center py-8">
        {mode === "morph" ? (
          reduced ? (
            <div>{morphCard}</div>
          ) : (
            <Liquid
              fill="var(--color-background-primary-default)"
              shadow="0 1px 3px rgba(0,0,0,.08)"
              className="flex h-36 w-full items-center justify-center"
            >
              <Liquid.Item
                morph={{ shape: true, bounce: 0.15, contentBlur: 0 }}
              >
                {morphCard}
              </Liquid.Item>
            </Liquid>
          )
        ) : mode === "melt" ? (
          <div className="flex flex-col items-center gap-2">
            {reduced ? (
              <div className={cx("flex", melted && "-space-x-5")}>
                {imagePool.slice(0, 2).map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    alt={
                      index === 0 ? "Botanical fieldwork" : "Harbour fieldwork"
                    }
                    width={96}
                    height={96}
                    className="size-24 rounded-2xl object-cover"
                  />
                ))}
              </div>
            ) : (
              <Liquid className="relative h-36 w-72">
                {imagePool.slice(0, 2).map((src, index) => (
                  <Liquid.Item key={src} effect="melt">
                    <Image
                      src={src}
                      alt={
                        index === 0
                          ? "Botanical fieldwork"
                          : "Harbour fieldwork"
                      }
                      width={96}
                      height={96}
                      className="absolute top-5 size-24 rounded-2xl object-cover transition-[left] duration-500"
                      style={{
                        left: melted ? 46 + index * 82 : 18 + index * 156,
                      }}
                    />
                  </Liquid.Item>
                ))}
              </Liquid>
            )}
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setMelted(!melted)}
            >
              {melted ? "Separate images" : "Blend images"}
            </Button>
          </div>
        ) : (
          <div>
            <div className="border-separator-border bg-background-primary-hover relative w-[264px] rounded-full border p-1">
              {reduced ? (
                <span
                  aria-hidden="true"
                  className="bg-background-primary-default absolute top-1 h-8 w-[84px] rounded-full"
                  style={{ left: 4 + selected * 84 }}
                />
              ) : (
                <Liquid
                  fill="var(--color-background-primary-default)"
                  shadow="0 1px 2px rgba(0,0,0,.06)"
                  className="pointer-events-none"
                  style={{ position: "absolute", inset: 4 }}
                >
                  <Liquid.Item
                    effect={mode}
                    move={{ springiness: 0.7, wobble: 0.15, trail: 0.25 }}
                    bend={{ vertical: 0.6, horizontal: 0.35 }}
                  >
                    <span
                      aria-hidden="true"
                      className="bg-background-primary-default block h-8 w-[84px] rounded-full"
                      style={{
                        transform: `translateX(${selected * 84}px)`,
                        transition: "transform 220ms ease-out",
                      }}
                    />
                  </Liquid.Item>
                </Liquid>
              )}
              <div className="relative grid grid-cols-3">
                {choices.map((choice, index) => (
                  <button
                    key={choice}
                    type="button"
                    aria-pressed={selected === index}
                    className={cx(
                      "h-8 rounded-full text-xs focus-visible:outline-2 focus-visible:outline-offset-2",
                      selected === index
                        ? "text-text-primary"
                        : "text-text-secondary"
                    )}
                    onClick={() => setSelected(index)}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
            <p
              aria-live="polite"
              className="text-text-secondary mt-5 flex items-center justify-center gap-2 text-xs"
            >
              <Check aria-hidden="true" className="size-3" />
              {choices[selected]} selected
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-1">
        {(["morph", "move", "melt", "bend"] as const).map((value) => (
          <Button
            key={value}
            size="xs"
            variant={mode === value ? "secondary" : "ghost"}
            aria-pressed={mode === value}
            className="capitalize"
            onClick={() => setMode(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  )
}
