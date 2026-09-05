"use client"

import {
  AgentGenerativeSurface,
  ResultActions,
  type GeneratedContent,
  type ResultActionState,
} from "@/components/agents-ui/agent-generative-surface"
import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import {
  generativeWorkExamples,
  generativeWorkNames,
} from "./generative-work-examples"

const publicBase = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")
const harbour = `${publicBase}/examples/fieldwork-harbour.webp`
const studio = `${publicBase}/examples/fieldwork-studio.webp`
const botanical = `${publicBase}/examples/fieldwork-botanical.webp`

export const generatedExamples: GeneratedContent[] = [
  ...generativeWorkExamples,
  {
    type: "audio",
    title: "Harbour after rain",
    creator: "Fieldwork tapes · Demo track",
    cover: harbour,
    playing: false,
    position: 68,
    duration: 254,
  },
  {
    type: "focus",
    title: "Sketching sprint",
    remaining: 1080,
    duration: 2400,
    running: false,
  },
  {
    type: "flight",
    origin: "LIS",
    originName: "Lisbon",
    destination: "CPH",
    destinationName: "Copenhagen",
    departure: "10:15 WEST",
    arrival: "14:40 CEST",
    progress: 42,
    status: "Workshop itinerary",
  },
  {
    type: "location",
    title: "Botanical glasshouse",
    subtitle: "Texture study · Copenhagen",
    image: botanical,
  },
  {
    type: "weather",
    location: "Copenhagen studio day",
    temperature: 16,
    unit: "C",
    condition: "Light rain",
    forecast: [
      { day: "Thu", temperature: 16 },
      { day: "Fri", temperature: 17 },
      { day: "Sat", temperature: 15 },
      { day: "Sun", temperature: 18 },
      { day: "Mon", temperature: 17 },
    ],
  },
  {
    type: "stories",
    title: "Field notes",
    items: [
      {
        id: "harbour-light",
        title: "Tracing harbour light after the rain",
        source: "Fieldwork journal",
        image: harbour,
      },
      {
        id: "studio-materials",
        title: "Six materials worth bringing indoors",
        source: "Workshop notes",
        image: studio,
      },
      {
        id: "glasshouse-patterns",
        title: "Pattern studies from the glasshouse",
        source: "Visual index",
        image: botanical,
      },
    ],
  },
  {
    type: "inbox",
    title: "Workshop inbox",
    items: [
      {
        id: "route",
        sender: "Mara Okafor",
        text: "The harbour route is mapped. I marked two covered stops in case the rain holds.",
        time: "16:20",
        unread: true,
      },
      {
        id: "materials",
        sender: "Ivo Tan",
        text: "I grouped the material references for tomorrow's tabletop session.",
        time: "15:48",
        unread: false,
        images: [
          { id: "a", src: harbour, alt: "Harbour color study" },
          { id: "b", src: studio, alt: "Workshop material study" },
          { id: "c", src: botanical, alt: "Glasshouse pattern study" },
        ],
      },
      {
        id: "schedule",
        sender: "Noor Salim",
        text: "The studio table is booked for Friday at 10:30.",
        time: "15:12",
        unread: true,
      },
    ],
  },
  {
    type: "note",
    title: "Pocket note",
    body: "Collect the sound, shadow, and texture before deciding what the workshop should make.",
    status: "Draft · Fieldwork day one",
  },
  {
    type: "collection",
    title: "Rain-to-studio studies",
    description: "A visual palette for the workshop wall",
    images: [
      { id: "a", src: harbour, alt: "Harbour after rain" },
      { id: "b", src: studio, alt: "Fieldwork studio table" },
      { id: "c", src: botanical, alt: "Botanical glasshouse" },
    ],
  },
  {
    type: "event",
    title: "Material stories workshop",
    time: "10:30",
    timezone: "CEST",
    date: "Friday",
    location: "North table · Fieldwork studio",
    attendees: ["Mara Okafor", "Ivo Tan", "Noor Salim"],
  },
  {
    type: "activity",
    title: "Field observations",
    value: "31",
    unit: "notes",
    description: "Captured across the seven-day studio trip",
    points: [
      { label: "Thu", value: 3 },
      { label: "Fri", value: 6 },
      { label: "Sat", value: 4 },
      { label: "Sun", value: 7 },
      { label: "Mon", value: 5 },
      { label: "Tue", value: 4 },
      { label: "Wed", value: 2 },
    ],
  },
]

const names: Record<GeneratedContent["type"], string> = {
  ...generativeWorkNames,
  audio: "Audio",
  focus: "Focus",
  flight: "Flight",
  location: "Place",
  weather: "Weather",
  stories: "Stories",
  inbox: "Inbox",
  note: "Note",
  collection: "Collection",
  event: "Event",
  activity: "Activity",
}
type Draft = { primary: string; secondary: string }

function fields(item: GeneratedContent): {
  primary: string
  secondary: string
  primaryLabel: string
  secondaryLabel: string
} {
  switch (item.type) {
    case "comparison":
      return {
        primary: item.title,
        secondary: item.description ?? "",
        primaryLabel: "Title",
        secondaryLabel: "Description",
      }
    case "recommendation":
      return {
        primary: item.title,
        secondary: item.summary,
        primaryLabel: "Title",
        secondaryLabel: "Summary",
      }
    case "document":
      return {
        primary: item.title,
        secondary: item.excerpt,
        primaryLabel: "Title",
        secondaryLabel: "Excerpt",
      }
    case "checklist":
      return {
        primary: item.title,
        secondary: item.description ?? "",
        primaryLabel: "Title",
        secondaryLabel: "Description",
      }
    case "source-brief":
      return {
        primary: item.title,
        secondary: item.summary,
        primaryLabel: "Title",
        secondaryLabel: "Summary",
      }
    case "audio":
      return {
        primary: item.title,
        secondary: item.creator,
        primaryLabel: "Title",
        secondaryLabel: "Creator",
      }
    case "focus":
      return {
        primary: item.title,
        secondary: String(Math.round(item.duration / 60)),
        primaryLabel: "Title",
        secondaryLabel: "Session length in minutes",
      }
    case "flight":
      return {
        primary: item.originName,
        secondary: item.destinationName,
        primaryLabel: "Origin",
        secondaryLabel: "Destination",
      }
    case "location":
      return {
        primary: item.title,
        secondary: item.subtitle,
        primaryLabel: "Title",
        secondaryLabel: "Description",
      }
    case "weather":
      return {
        primary: item.location,
        secondary: item.condition,
        primaryLabel: "Location",
        secondaryLabel: "Condition",
      }
    case "stories":
      return {
        primary: item.title,
        secondary: item.items[0]?.title ?? "",
        primaryLabel: "List title",
        secondaryLabel: "Lead story",
      }
    case "inbox":
      return {
        primary: item.title,
        secondary: item.items[0]?.text ?? "",
        primaryLabel: "Inbox title",
        secondaryLabel: "Lead message",
      }
    case "note":
      return {
        primary: item.title,
        secondary: item.body,
        primaryLabel: "Title",
        secondaryLabel: "Body",
      }
    case "collection":
      return {
        primary: item.title,
        secondary: item.description,
        primaryLabel: "Title",
        secondaryLabel: "Description",
      }
    case "event":
      return {
        primary: item.title,
        secondary: item.location,
        primaryLabel: "Title",
        secondaryLabel: "Location",
      }
    case "activity":
      return {
        primary: item.title,
        secondary: item.description,
        primaryLabel: "Title",
        secondaryLabel: "Description",
      }
  }
}

function edit(item: GeneratedContent, draft: Draft): GeneratedContent {
  switch (item.type) {
    case "comparison":
      return { ...item, title: draft.primary, description: draft.secondary }
    case "recommendation":
      return { ...item, title: draft.primary, summary: draft.secondary }
    case "document":
      return { ...item, title: draft.primary, excerpt: draft.secondary }
    case "checklist":
      return { ...item, title: draft.primary, description: draft.secondary }
    case "source-brief":
      return { ...item, title: draft.primary, summary: draft.secondary }
    case "audio":
      return { ...item, title: draft.primary, creator: draft.secondary }
    case "focus": {
      const minutes = Math.max(1, Number.parseInt(draft.secondary, 10) || 1)
      const duration = minutes * 60
      return {
        ...item,
        title: draft.primary,
        duration,
        remaining: Math.min(item.remaining, duration),
      }
    }
    case "flight":
      return {
        ...item,
        originName: draft.primary,
        destinationName: draft.secondary,
      }
    case "location":
      return { ...item, title: draft.primary, subtitle: draft.secondary }
    case "weather":
      return { ...item, location: draft.primary, condition: draft.secondary }
    case "stories":
      return {
        ...item,
        title: draft.primary,
        items: item.items.map((story, index) =>
          index === 0 ? { ...story, title: draft.secondary } : story
        ),
      }
    case "inbox":
      return {
        ...item,
        title: draft.primary,
        items: item.items.map((message, index) =>
          index === 0 ? { ...message, text: draft.secondary } : message
        ),
      }
    case "note":
      return { ...item, title: draft.primary, body: draft.secondary }
    case "collection":
      return { ...item, title: draft.primary, description: draft.secondary }
    case "event":
      return { ...item, title: draft.primary, location: draft.secondary }
    case "activity":
      return { ...item, title: draft.primary, description: draft.secondary }
  }
}

function humanText(item: GeneratedContent): string {
  switch (item.type) {
    case "comparison":
      return `${item.title}\n${item.description ?? ""}\n${item.options.map((option) => `${option.title}: ${option.attributes.map((value) => `${value.label} ${value.value}`).join(", ")}`).join("\n")}`
    case "recommendation":
      return `${item.title}\n${item.summary}${item.reasoning?.length ? `\n${item.reasoning.join("\n")}` : ""}`
    case "document":
      return `${item.title}\n${item.format}, ${item.size}\n${item.excerpt}`
    case "checklist":
      return `${item.title}\n${item.items.map((task) => `${task.completed ? "[x]" : "[ ]"} ${task.label}${task.detail ? `: ${task.detail}` : ""}`).join("\n")}`
    case "source-brief":
      return `${item.title}\n${item.summary}\nSources:\n${item.sources.map((source, index) => `${index + 1}. ${source.title}${source.origin ? `, ${source.origin}` : ""}`).join("\n")}`
    case "audio":
      return `${item.title}\n${item.creator}\n${Math.floor(item.duration / 60)}:${String(item.duration % 60).padStart(2, "0")}`
    case "focus":
      return `${item.title}\n${Math.round(item.remaining / 60)} minutes remaining`
    case "flight":
      return `${item.origin} ${item.originName} to ${item.destination} ${item.destinationName}\n${item.departure} to ${item.arrival}\n${item.status}`
    case "location":
      return `${item.title}\n${item.subtitle}`
    case "weather":
      return `${item.location}\n${item.temperature} ${item.unit}, ${item.condition}\n${item.forecast.map((day) => `${day.day} ${day.temperature}`).join(", ")}`
    case "stories":
      return `${item.title}\n${item.items.map((story) => `${story.title}, ${story.source}`).join("\n")}`
    case "inbox":
      return `${item.title}\n${item.items.map((message) => `${message.sender}, ${message.time}: ${message.text}`).join("\n")}`
    case "note":
      return `${item.title}\n${item.body}\n${item.status}`
    case "collection":
      return `${item.title}\n${item.description}\n${item.images.length} items`
    case "event":
      return `${item.title}\n${item.date} at ${item.time} ${item.timezone}\n${item.location}\n${item.attendees.join(", ")}`
    case "activity":
      return `${item.title}\n${item.value} ${item.unit}\n${item.description}\n${item.points.map((point) => `${point.label}: ${point.value}`).join(", ")}`
  }
}

function EditPanel({
  item,
  draft,
  onChange,
  onApply,
  onCancel,
}: {
  item: GeneratedContent
  draft: Draft
  onChange: (draft: Draft) => void
  onApply: () => void
  onCancel: () => void
}) {
  const labels = fields(item)
  return (
    <form
      className="border-separator-border bg-background-primary-default mt-3 space-y-3 rounded-2xl border p-4"
      onSubmit={(event) => {
        event.preventDefault()
        onApply()
      }}
    >
      <label className="text-text-secondary block text-xs">
        {labels.primaryLabel}
        <input
          value={draft.primary}
          onChange={(event) =>
            onChange({ ...draft, primary: event.target.value })
          }
          className="bg-background-tertiary-default text-text-primary focus:ring-border-focus-ring mt-1 h-9 w-full rounded-lg px-3 text-[13px] outline-none focus:ring-2"
        />
      </label>
      <label className="text-text-secondary block text-xs">
        {labels.secondaryLabel}
        <textarea
          value={draft.secondary}
          onChange={(event) =>
            onChange({ ...draft, secondary: event.target.value })
          }
          rows={3}
          className="bg-background-tertiary-default text-text-primary focus:ring-border-focus-ring mt-1 w-full resize-y rounded-lg px-3 py-2 text-[13px] leading-5 outline-none focus:ring-2"
        />
      </label>
      <div className="flex justify-end gap-2">
        <Button size="xs" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="xs" type="submit">
          Apply changes
        </Button>
      </div>
    </form>
  )
}

function ComparePanel({
  original,
  current,
}: {
  original: GeneratedContent
  current: GeneratedContent
}) {
  return (
    <section className="border-separator-border bg-background-primary-default mt-3 grid gap-3 rounded-2xl border p-4 sm:grid-cols-2">
      <div>
        <h3 className="text-text-secondary text-xs font-medium">Original</h3>
        <p className="mt-2 text-[13px] leading-5 whitespace-pre-wrap">
          {humanText(original)}
        </p>
      </div>
      <div className="border-separator-border border-t pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3">
        <h3 className="text-text-secondary text-xs font-medium">Current</h3>
        <p className="mt-2 text-[13px] leading-5 whitespace-pre-wrap">
          {humanText(current)}
        </p>
      </div>
    </section>
  )
}

const savedKey = "agents-kit-generative-saved"
export function GenerativeShowcase({
  grid = false,
  featured = false,
}: {
  grid?: boolean
  featured?: boolean
}) {
  const [items, setItems] = useState(generatedExamples)
  const [selected, setSelected] = useState(11)
  const [status, setStatus] = useState<"ready" | "loading" | "error">("ready")
  const [notice, setNotice] = useState("")
  const [modes, setModes] = useState<
    Partial<Record<GeneratedContent["type"], ResultActionState>>
  >({})
  const [drafts, setDrafts] = useState<
    Partial<Record<GeneratedContent["type"], Draft>>
  >({})
  const [saved, setSaved] = useState<string[]>([])
  useEffect(() => {
    try {
      const value = localStorage.getItem(savedKey)
      if (value) {
        const parsed: unknown = JSON.parse(value)
        if (Array.isArray(parsed))
          setSaved(
            parsed.filter((item): item is string => typeof item === "string")
          )
      }
    } catch {
      setSaved([])
    }
  }, [])
  useEffect(() => {
    const followSharedResult = () => {
      const type = decodeURIComponent(location.hash).replace(/^#generated-/, "")
      const index = generatedExamples.findIndex((item) => item.type === type)
      if (index >= 0) {
        setSelected(index)
        setModes((current) => ({
          ...current,
          [generatedExamples[index].type]: "expanded",
        }))
      }
    }
    followSharedResult()
    window.addEventListener("hashchange", followSharedResult)
    return () => window.removeEventListener("hashchange", followSharedResult)
  }, [])
  const focus = items.find((item) => item.type === "focus")
  const timerRunning = focus?.type === "focus" && focus.running
  useEffect(() => {
    if (!timerRunning) return
    const interval = setInterval(
      () =>
        setItems((current) =>
          current.map((item) =>
            item.type === "focus"
              ? {
                  ...item,
                  remaining: Math.max(0, item.remaining - 1),
                  running: item.remaining > 1,
                }
              : item
          )
        ),
      1000
    )
    return () => clearInterval(interval)
  }, [timerRunning])

  const setMode = (type: GeneratedContent["type"], mode: ResultActionState) =>
    setModes((current) => ({
      ...current,
      [type]: current[type] === mode ? "view" : mode,
    }))
  const replace = (index: number, next: GeneratedContent) =>
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? next : item))
    )
  const download = (item: GeneratedContent) => {
    const blob = new Blob([`# ${names[item.type]}\n\n${humanText(item)}\n`], {
      type: "text/markdown",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${item.type}-result.md`
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setNotice("Markdown result downloaded.")
  }
  const act = (index: number, action: string, id?: string) => {
    const current = items[index]
    if (current.type === "document" && action === "download") {
      download(current)
      return
    }
    if (current.type === "document" && action === "open") {
      setMode(current.type, "expanded")
      setNotice("Document expanded inline.")
      return
    }
    setItems((all) =>
      all.map((item, itemIndex) => {
        if (index !== itemIndex) return item
        if (item.type === "comparison" && action === "select")
          return { ...item, selectedId: id }
        if (item.type === "checklist" && action === "toggle")
          return {
            ...item,
            items: item.items.map((task) =>
              task.id === id ? { ...task, completed: !task.completed } : task
            ),
          }
        if (item.type === "focus")
          return {
            ...item,
            running: action === "start",
            remaining: action === "reset" ? item.duration : item.remaining,
          }
        if (item.type === "audio")
          return {
            ...item,
            playing: action === "play",
            position:
              action === "previous" || action === "next" ? 0 : item.position,
          }
        if (item.type === "inbox" && action === "open")
          return {
            ...item,
            items: item.items.map((message) =>
              message.id === id ? { ...message, unread: false } : message
            ),
          }
        return item
      })
    )
    if (action === "search")
      setNotice("Inbox search is ready in the component catalogue.")
    else if (current.type === "event" && action === "open")
      setNotice(
        `${current.title} | ${current.date} at ${current.time} ${current.timezone} | ${current.location}`
      )
    else if (action === "accept")
      setNotice("Recommendation accepted for this example.")
    else if (action === "alternative")
      setNotice(`Alternative ${id ?? ""} selected for review.`)
    else if (action === "source" && current.type === "source-brief") {
      const source = current.sources.find((value) => value.id === id)
      setNotice(
        source
          ? `${source.title} | ${source.origin ?? "Reference"}`
          : "Source selected"
      )
    } else setNotice("")
  }

  const actions = (item: GeneratedContent, index: number) => {
    const mode = modes[item.type] ?? "view"
    const draft = drafts[item.type] ?? {
      primary: fields(item).primary,
      secondary: fields(item).secondary,
    }
    const save = () => {
      const next = saved.includes(item.type)
        ? saved.filter((value) => value !== item.type)
        : [...saved, item.type]
      setSaved(next)
      try {
        localStorage.setItem(savedKey, JSON.stringify(next))
      } catch {}
      setNotice(
        next.includes(item.type)
          ? "Result saved in this browser."
          : "Saved result removed."
      )
    }
    const write = async (text: string) => {
      if (!navigator.clipboard?.writeText) return false
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch {
        return false
      }
    }
    const share = async () => {
      const url = `${location.origin}${location.pathname}#generated-${item.type}`
      history.replaceState(null, "", `#generated-${item.type}`)
      setNotice(
        (await write(url))
          ? "Stable result link copied."
          : "Stable result link opened in the address bar."
      )
    }
    const copy = async () => {
      setNotice(
        (await write(humanText(item)))
          ? "Result copied as readable text."
          : "Clipboard access is unavailable."
      )
    }
    return (
      <>
        <div className="mt-2 flex justify-center">
          <ResultActions
            state={mode}
            saved={saved.includes(item.type)}
            onExpand={() => setMode(item.type, "expanded")}
            onEdit={() => {
              setDrafts((current) => ({
                ...current,
                [item.type]: {
                  primary: fields(item).primary,
                  secondary: fields(item).secondary,
                },
              }))
              setMode(item.type, "editing")
            }}
            onCompare={() => setMode(item.type, "comparing")}
            onSave={save}
            onShare={() => void share()}
            onCopy={() => void copy()}
          />
        </div>
        {mode === "editing" && (
          <EditPanel
            item={item}
            draft={draft}
            onChange={(next) =>
              setDrafts((current) => ({ ...current, [item.type]: next }))
            }
            onCancel={() => setMode(item.type, "view")}
            onApply={() => {
              replace(index, edit(item, draft))
              setMode(item.type, "expanded")
              setNotice("Changes applied to this result.")
            }}
          />
        )}
        {mode === "comparing" && (
          <ComparePanel original={generatedExamples[index]} current={item} />
        )}
      </>
    )
  }
  const card = (item: GeneratedContent, index: number, withStatus = false) => {
    const mode = modes[item.type] ?? "view"
    const wide = mode !== "view"
    return (
      <div
        id={`generated-${item.type}`}
        className={cx(
          "mx-auto w-full transition-[max-width] duration-200",
          wide ? "max-w-[600px]" : "max-w-[340px]"
        )}
      >
        <AgentGenerativeSurface
          content={item}
          status={withStatus ? status : "ready"}
          onRetry={() => setStatus("ready")}
          onAction={(action, id) => act(index, action, id)}
          onSeek={(position) =>
            setItems((current) =>
              current.map((value, itemIndex) =>
                itemIndex === index && value.type === "audio"
                  ? { ...value, position }
                  : value
              )
            )
          }
        />
        {actions(item, index)}
      </div>
    )
  }
  const displayed = useMemo(
    () =>
      items
        .map((item, index) => ({ item, index }))
        .filter(
          ({ item }) =>
            !featured || ["audio", "focus", "flight"].includes(item.type)
        ),
    [featured, items]
  )

  return (
    <div className="w-full">
      {!grid && (
        <>
          <div
            className="mb-8 flex flex-wrap justify-center gap-1"
            aria-label="Generated content types"
          >
            {items.map((item, index) => (
              <button
                key={item.type}
                onClick={() => {
                  setSelected(index)
                  setStatus("ready")
                  setNotice("")
                }}
                aria-pressed={selected === index}
                className={cx(
                  "min-h-9 rounded-lg px-3 text-[13px] focus-visible:outline-2 focus-visible:outline-offset-2",
                  selected === index
                    ? "bg-background-primary-default font-medium shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {names[item.type]}
              </button>
            ))}
          </div>
          <div className="flex min-h-[440px] items-start justify-center">
            {card(items[selected], selected, true)}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="ghost"
              iconOnly
              leadingIcon={ArrowLeft}
              aria-label="Previous surface"
              onClick={() =>
                setSelected((selected + items.length - 1) % items.length)
              }
            />
            <div className="border-separator-border flex rounded-lg border p-1">
              {(["ready", "loading", "error"] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setStatus(value)}
                  aria-pressed={status === value}
                  className={cx(
                    "rounded-md px-3 py-1 text-xs capitalize",
                    status === value &&
                      "bg-background-primary-default shadow-sm"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              iconOnly
              leadingIcon={ArrowRight}
              aria-label="Next surface"
              onClick={() => setSelected((selected + 1) % items.length)}
            />
          </div>
        </>
      )}
      {grid && (
        <div className="grid items-start gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
          {displayed.map(({ item, index }) => {
            const wide = (modes[item.type] ?? "view") !== "view"
            return (
              <div
                key={item.type}
                className={cx("min-w-0", wide && "md:col-span-2 xl:col-span-3")}
              >
                <p className="text-text-secondary mb-3 px-1 text-xs">
                  {names[item.type]}
                </p>
                {card(item, index)}
              </div>
            )
          })}
        </div>
      )}
      {notice && (
        <p
          role="status"
          className="text-text-secondary mt-5 text-center text-[13px]"
        >
          {notice}
        </p>
      )}
    </div>
  )
}
