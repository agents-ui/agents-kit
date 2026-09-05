"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import {
  ArrowUpRight,
  Calendar,
  Check,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  Search,
  SkipBack,
  SkipForward,
  Sun,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import * as React from "react"
import { type ReactNode } from "react"
import {
  GeneratedWorkCardContent,
  type GeneratedWorkContent,
} from "./work-content"

type MediaItem = { id: string; src: string; alt: string }
export type GeneratedContent =
  | GeneratedWorkContent
  | {
      type: "audio"
      title: string
      creator: string
      cover?: string
      playing: boolean
      position: number
      duration: number
    }
  | {
      type: "focus"
      title: string
      remaining: number
      duration: number
      running: boolean
    }
  | {
      type: "flight"
      origin: string
      originName: string
      destination: string
      destinationName: string
      departure: string
      arrival: string
      progress: number
      status: string
    }
  | {
      type: "location"
      title: string
      subtitle: string
      image?: string
      mapUrl?: string
    }
  | {
      type: "weather"
      location: string
      temperature: number
      unit: string
      condition: string
      forecast: { day: string; temperature: number }[]
    }
  | {
      type: "stories"
      title: string
      items: {
        id: string
        title: string
        source: string
        image?: string
        href?: string
      }[]
    }
  | {
      type: "inbox"
      title: string
      items: {
        id: string
        sender: string
        text: string
        time: string
        unread: boolean
        images?: MediaItem[]
      }[]
    }
  | { type: "note"; title: string; body: string; status: string }
  | {
      type: "collection"
      title: string
      description: string
      images: MediaItem[]
    }
  | {
      type: "event"
      title: string
      time: string
      timezone: string
      date: string
      location: string
      attendees: string[]
    }
  | {
      type: "activity"
      title: string
      value: string
      unit: string
      description: string
      points: { label: string; value: number }[]
    }

export interface AgentGenerativeSurfaceProps {
  content: GeneratedContent
  status?: "ready" | "loading" | "error"
  error?: string
  onAction?: (action: string, id?: string) => void
  onSeek?: (seconds: number) => void
  onRetry?: () => void
  className?: string
  animate?: boolean
}

const clamp = (value: number, max = 100) =>
  Math.max(0, Math.min(max, Number.isFinite(value) ? value : 0))
const clock = (seconds: number) =>
  `${Math.floor(Math.max(0, seconds) / 60)}:${String(Math.floor(Math.max(0, seconds) % 60)).padStart(2, "0")}`
const caption = "text-[13px] leading-[1.55] text-text-secondary"
const heading = "text-sm font-medium tracking-tight"
function Header({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="mb-4 flex items-center justify-between gap-3">
      <h3 className={heading}>{title}</h3>
      {children}
    </header>
  )
}
function Picture({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  // Caller-provided media stays an ordinary image, without a framework loader.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cx("object-cover", className)}
      loading="lazy"
    />
  )
}

function Content({
  content: c,
  onAction,
  onSeek,
}: AgentGenerativeSurfaceProps) {
  switch (c.type) {
    case "comparison":
    case "recommendation":
    case "document":
    case "checklist":
    case "source-brief":
      return <GeneratedWorkCardContent content={c} onAction={onAction} />
    case "audio":
      return (
        <>
          <div className="flex gap-4">
            {c.cover && (
              <Picture
                src={c.cover}
                alt={`${c.title} cover`}
                className="size-24 shrink-0 rounded-xl"
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className={heading}>{c.title}</h3>
              <p className={caption}>{c.creator}</p>
              <div className="mt-3 flex items-center gap-3">
                <Button
                  variant="ghost"
                  iconOnly
                  leadingIcon={SkipBack}
                  aria-label="Previous track"
                  disabled={!onAction}
                  onClick={() => onAction?.("previous")}
                />
                <Button
                  iconOnly
                  leadingIcon={c.playing ? Pause : Play}
                  aria-label={c.playing ? "Pause audio" : "Play audio"}
                  disabled={!onAction}
                  className="rounded-full"
                  onClick={() => onAction?.(c.playing ? "pause" : "play")}
                />
                <Button
                  variant="ghost"
                  iconOnly
                  leadingIcon={SkipForward}
                  aria-label="Next track"
                  disabled={!onAction}
                  onClick={() => onAction?.("next")}
                />
              </div>
            </div>
          </div>
          <input
            aria-label="Audio position"
            type="range"
            min={0}
            max={Math.max(1, c.duration)}
            value={clamp(c.position, c.duration)}
            onChange={(event) => onSeek?.(Number(event.target.value))}
            disabled={!onSeek}
            className="mt-5 h-1 w-full accent-current"
          />
          <div className="text-text-secondary mt-2 flex justify-between text-xs tabular-nums">
            <span>{clock(c.position)}</span>
            <span>{clock(Math.max(0, c.duration - c.position))} remaining</span>
          </div>
        </>
      )
    case "focus": {
      const progress = clamp(c.remaining / Math.max(1, c.duration), 1)
      return (
        <>
          <Header title={c.title}>
            <span className="text-[13px] text-white/65">
              {c.running
                ? "In progress"
                : c.remaining === 0
                  ? "Complete"
                  : "Paused"}
            </span>
          </Header>
          <div className="relative mx-auto my-5 size-44">
            <svg
              viewBox="0 0 180 180"
              className="size-full -rotate-90"
              aria-hidden="true"
            >
              {Array.from({ length: 60 }, (_, index) => (
                <line
                  key={index}
                  x1="90"
                  y1="8"
                  x2="90"
                  y2={index % 5 === 0 ? "20" : "16"}
                  transform={`rotate(${index * 6} 90 90)`}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity={index / 60 <= progress ? 0.88 : 0.16}
                />
              ))}
            </svg>
            <p
              className="absolute inset-0 flex items-center justify-center text-4xl font-normal tracking-tight tabular-nums"
              aria-live="off"
            >
              {clock(c.remaining)}
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button
              variant="ghost"
              iconOnly
              leadingIcon={RotateCcw}
              aria-label="Reset timer"
              className="rounded-full bg-white/10 text-white"
              disabled={!onAction}
              onClick={() => onAction?.("reset")}
            />
            <Button
              variant="ghost"
              leadingIcon={c.running ? Pause : Play}
              className="rounded-full bg-white/10 px-5 text-white"
              disabled={!onAction}
              onClick={() => onAction?.(c.running ? "pause" : "start")}
            >
              {c.running ? "Pause" : "Start"}
            </Button>
          </div>
        </>
      )
    }
    case "flight":
      return (
        <>
          <Header title="Flight">
            <span className="text-text-secondary text-xs">{c.status}</span>
          </Header>
          <div className="flex justify-between gap-4">
            <div>
              <p className="text-3xl tracking-tight">{c.origin}</p>
              <p className={caption}>{c.originName}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl tracking-tight">{c.destination}</p>
              <p className={caption}>{c.destinationName}</p>
            </div>
          </div>
          <div
            className="bg-background-secondary-default my-5 h-1 overflow-hidden rounded-full"
            role="progressbar"
            aria-label="Flight progress"
            aria-valuenow={clamp(c.progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-cyan-600"
              style={{ width: `${clamp(c.progress)}%` }}
            />
          </div>
          <div className="flex justify-between text-[13px] tabular-nums">
            <div>
              {c.departure}
              <p className="text-text-secondary mt-1 text-xs">Departure</p>
            </div>
            <div className="text-right">
              {c.arrival}
              <p className="text-text-secondary mt-1 text-xs">Arrival</p>
            </div>
          </div>
        </>
      )
    case "location":
      return (
        <>
          {c.image && (
            <Picture
              src={c.image}
              alt={c.title}
              className="mb-5 aspect-[4/3] w-full rounded-xl"
            />
          )}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className={heading}>{c.title}</h3>
              <p className={caption}>{c.subtitle}</p>
            </div>
            {c.mapUrl && (
              <a
                href={c.mapUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open map for ${c.title}`}
                className="rounded-lg p-2 focus-visible:outline-2"
              >
                <MapPin className="size-4" />
              </a>
            )}
          </div>
        </>
      )
    case "weather":
      return (
        <>
          <Header title={c.location}>
            <Sun className="text-text-secondary size-5" aria-hidden="true" />
          </Header>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-5xl font-normal tracking-tight tabular-nums">
              {c.temperature}°
              <span className="text-text-secondary ml-2 text-sm">{c.unit}</span>
            </p>
            <span className={caption}>{c.condition}</span>
          </div>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${Math.max(1, c.forecast.length)}, minmax(0, 1fr))`,
            }}
          >
            {c.forecast.map((day) => (
              <div key={day.day} className="text-[13px]">
                <p className="text-text-secondary">{day.day}</p>
                <p className="mt-2 tabular-nums">{day.temperature}°</p>
              </div>
            ))}
          </div>
        </>
      )
    case "stories":
      return (
        <>
          <Header title={c.title} />
          <div className="space-y-5">
            {c.items.map((item) => (
              <article key={item.id} className="flex gap-4">
                {item.image && (
                  <Picture
                    src={item.image}
                    alt=""
                    className="size-12 shrink-0 rounded-lg"
                  />
                )}
                <div className="min-w-0">
                  <h4 className="text-[13px] leading-5 font-medium">
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline focus-visible:outline-2"
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </h4>
                  <p className="text-text-secondary mt-1 text-xs leading-5">
                    {item.source}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </>
      )
    case "inbox":
      return (
        <>
          <Header title={c.title}>
            <span className="text-text-secondary mr-auto text-[13px]">
              {c.items.filter((item) => item.unread).length} unread
            </span>
            <Button
              variant="ghost"
              iconOnly
              leadingIcon={Search}
              aria-label="Search inbox"
              disabled={!onAction}
              onClick={() => onAction?.("search")}
            />
          </Header>
          <div className="space-y-4">
            {c.items.map((item) => (
              <article key={item.id} className="relative pl-4">
                <span
                  aria-label={item.unread ? "Unread" : "Read"}
                  className={cx(
                    "absolute top-1.5 left-0 size-1.5 rounded-full",
                    item.unread && "bg-cyan-600"
                  )}
                />
                <div className="flex justify-between gap-3">
                  <button
                    className="text-left text-[13px] font-medium focus-visible:outline-2"
                    disabled={!onAction}
                    onClick={() => onAction?.("open", item.id)}
                  >
                    {item.sender}
                  </button>
                  <time className="text-text-secondary shrink-0 text-xs tabular-nums">
                    {item.time}
                  </time>
                </div>
                <p className="text-text-secondary mt-1 text-[13px] leading-[1.55]">
                  {item.text}
                </p>
                {item.images && (
                  <div className="mt-3 flex -space-x-1">
                    {item.images.map((image) => (
                      <Picture
                        key={image.id}
                        src={image.src}
                        alt={image.alt}
                        className="ring-background-primary-default size-10 rounded-lg ring-2"
                      />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )
    case "note":
      return (
        <>
          <Header title={c.title} />
          <p className="mb-9 font-serif text-2xl leading-[1.3] tracking-tight">
            {c.body}
          </p>
          <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-950 dark:bg-amber-950/40 dark:text-amber-200">
            {c.status}
          </span>
        </>
      )
    case "collection":
      return (
        <>
          <div className="mb-5 grid grid-cols-2 gap-2">
            {c.images.map((image, i) => (
              <Picture
                key={image.id}
                src={image.src}
                alt={image.alt}
                className={cx(
                  "w-full rounded-xl",
                  c.images.length === 3 && i === 0
                    ? "row-span-2 h-full"
                    : "aspect-square"
                )}
              />
            ))}
          </div>
          <div className="items-center-start flex justify-between gap-3">
            <div>
              <h3 className={heading}>{c.title}</h3>
              <p className={caption}>{c.description}</p>
            </div>
            <span className="text-text-secondary mt-1 shrink-0 text-xs">
              {c.images.length} items
            </span>
          </div>
        </>
      )
    case "event":
      return (
        <>
          <Header title="Up next">
            <Calendar className="text-text-secondary size-4" />
          </Header>
          <p className="text-4xl tracking-tight tabular-nums">
            {c.time}
            <span className="text-text-secondary ml-2 text-[13px]">
              {c.timezone}
            </span>
          </p>
          <h3 className="mt-4 text-sm font-medium">{c.title}</h3>
          <p className={caption}>
            {c.date} · {c.location}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex -space-x-1">
              {c.attendees.map((name) => (
                <span
                  key={name}
                  title={name}
                  className="bg-background-secondary-default ring-background-primary-default flex size-7 items-center justify-center rounded-full text-[10px] ring-2"
                >
                  {name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              ))}
            </div>
            <Button
              size="small"
              variant="secondary"
              leadingIcon={ArrowUpRight}
              disabled={!onAction}
              onClick={() => onAction?.("open")}
            >
              View event
            </Button>
          </div>
        </>
      )
    case "activity": {
      const max = Math.max(1, ...c.points.map((point) => point.value))
      return (
        <>
          <Header title={c.title}>
            <Check className="text-text-secondary size-4" />
          </Header>
          <p className="text-4xl tracking-tight tabular-nums">
            {c.value}
            <span className="text-text-secondary ml-2 text-[13px]">
              {c.unit}
            </span>
          </p>
          <p className="text-text-secondary mt-2 text-xs">{c.description}</p>
          <div className="mt-4 flex h-20 items-end gap-3">
            {c.points.map((point, index) => (
              <div
                key={`${point.label}-${index}`}
                className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2"
              >
                <div className="min-h-0 flex-1 content-end">
                  <div
                    className="w-full rounded-t-sm bg-cyan-600/35"
                    style={{ height: `${clamp(point.value / max, 1) * 100}%` }}
                    title={`${point.label}: ${point.value}`}
                  />
                </div>
                <span className="text-text-secondary text-center text-xs">
                  {point.label}
                </span>
              </div>
            ))}
          </div>
          <details className="text-text-secondary mt-4 text-xs">
            <summary className="cursor-pointer">View values</summary>
            <ul className="mt-2 space-y-1">
              {c.points.map((point, index) => (
                <li key={`${point.label}-${index}`}>
                  {point.label}: {point.value}
                </li>
              ))}
            </ul>
          </details>
        </>
      )
    }
  }
}

export function AgentGenerativeSurface({
  content,
  status = "ready",
  error,
  onRetry,
  className,
  animate = true,
  ...props
}: AgentGenerativeSurfaceProps) {
  const reduced = useReducedMotion()
  const key = status === "ready" ? content.type : status
  return (
    <motion.section
      layout={animate && !reduced}
      transition={{ layout: { type: "spring", stiffness: 350, damping: 38 } }}
      aria-busy={status === "loading"}
      className={cx(
        "generated-result border-separator-border bg-background-primary-default text-text-primary w-full min-w-0 overflow-hidden rounded-3xl border p-5 shadow-[0_2px_6px_rgb(0_0_0/0.025)]",
        status === "ready" &&
          content.type === "focus" &&
          "border-transparent bg-[#202a3a] text-white",
        className
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={key}
          initial={{ opacity: reduced || !animate ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced || !animate ? 0 : 0.16 }}
        >
          {status === "loading" ? (
            <div role="status" className="min-h-40 space-y-4">
              <p className="text-text-secondary text-[13px]">
                Preparing your result
              </p>
              <div className="bg-background-secondary-default h-5 w-2/3 rounded" />
              <div className="bg-background-secondary-default h-16 rounded-xl" />
            </div>
          ) : status === "error" ? (
            <div role="alert" className="min-h-36">
              <h3 className={heading}>This result could not be rendered</h3>
              <p className="text-text-secondary mt-2 text-[13px]">
                {error || "Try the request again."}
              </p>
              {onRetry && (
                <Button
                  variant="secondary"
                  size="small"
                  className="mt-5"
                  onClick={onRetry}
                >
                  Retry
                </Button>
              )}
            </div>
          ) : (
            <Content content={content} {...props} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  )
}
