"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { BorderBeam } from "@/components/effects/border-beam"
import { Liquid } from "@/components/effects/liquid-gooey"
import { Check, FileText, Plus } from "lucide-react"
import { useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"
import * as React from "react"

export function BorderBeamPreview() {
  const [active, setActive] = React.useState(true)
  const [style, setStyle] = React.useState<"line" | "md" | "pulse-inner">(
    "line"
  )
  const { resolvedTheme } = useTheme()
  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="flex min-h-52 items-center justify-center p-3">
        <BorderBeam
          active={active}
          size={style}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          colorVariant="mono"
          strength={0.6}
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
                {active ? "Working" : "Paused"}
              </span>
            </div>
            <p className="text-text-secondary mt-3 text-xs leading-5">
              Reading the selected sources and collecting the key details.
            </p>
          </div>
        </BorderBeam>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {(
          [
            ["line", "Line"],
            ["md", "Border"],
            ["pulse-inner", "Pulse"],
          ] as const
        ).map(([value, label]) => (
          <Button
            key={value}
            size="xs"
            variant={style === value ? "secondary" : "ghost"}
            aria-pressed={style === value}
            onClick={() => setStyle(value)}
          >
            {label}
          </Button>
        ))}
        <Button size="xs" variant="ghost" onClick={() => setActive(!active)}>
          {active ? "Pause effect" : "Resume effect"}
        </Button>
      </div>
    </div>
  )
}

export function GooeyPreview() {
  const reduced = useReducedMotion()
  const [mode, setMode] = React.useState<"morph" | "move">("morph")
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(0)
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
                    effect="move"
                    move={{ springiness: 0.7, wobble: 0.15, trail: 0.25 }}
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
        {(["morph", "move"] as const).map((value) => (
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
