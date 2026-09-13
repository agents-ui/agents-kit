"use client"

import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/components/boardui/base/tabs/tabs"
import { cx } from "@/components/boardui/utils/cx"
import { Search } from "lucide-react"
import * as React from "react"
import type { GalleryCategory, GalleryEntry } from "./catalog"
import { groupEntries, type ComponentFamily } from "./families"

function LivePreview({ entry }: { entry: GalleryEntry }) {
  const root = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)
  const [previewHeight, setPreviewHeight] = React.useState(128)
  React.useEffect(() => {
    const target = root.current
    if (!target || !visible || entry.category !== "Voice Agents") return
    const measure = () =>
      setPreviewHeight(Math.max(128, target.getBoundingClientRect().height))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(target)
    return () => observer.disconnect()
  }, [visible, entry.category])
  React.useEffect(() => {
    const target = root.current
    if (!target) return
    const observer = new IntersectionObserver(
      ([record]) => {
        if (entry.category === "Voice Agents") {
          setVisible(record.isIntersecting)
          return
        }
        if (record.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "500px" }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [entry.category])
  const Preview = entry.component
  return (
    <div ref={root} className="min-h-32 w-full *:mx-auto">
      {visible ? (
        <React.Suspense
          fallback={
            <p className="text-text-secondary p-8 text-center text-sm">
              Loading preview
            </p>
          }
        >
          {React.createElement(Preview, entry.props)}
        </React.Suspense>
      ) : (
        <div style={{ height: previewHeight }} />
      )}
    </div>
  )
}

function FamilyPreview({
  family,
  source,
  selected,
  onSelect,
}: {
  family: ComponentFamily
  source: Record<string, string>
  selected?: string
  onSelect: (slug: string) => void
}) {
  const entry =
    family.entries.find((item) => item.slug === selected) ?? family.entries[0]
  return (
    <section
      id={family.id}
      className="border-separator-border scroll-mt-28 border-b border-dashed pb-6 min-[440px]:scroll-mt-24"
    >
      <header className="mb-2.5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-semibold tracking-tight">
            {family.name}
          </h2>
          <p className="text-text-secondary mt-1 text-xs">{entry.source}</p>
        </div>
        {family.entries.length > 1 &&
          (entry.category === "Voice Agents" ? (
            <select
              aria-label={`${family.name} component`}
              value={entry.slug}
              onChange={(event) => onSelect(event.target.value)}
              className="border-separator-border bg-background-primary-default h-9 max-w-full rounded-lg border px-2 text-xs"
            >
              {family.entries.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.source.split(" · ")[0]} · {item.variant ?? item.name}
                </option>
              ))}
            </select>
          ) : (
            <div
              className="flex flex-wrap gap-1"
              role="group"
              aria-label={`${family.name} variants`}
            >
              {family.entries.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  aria-pressed={entry.slug === item.slug}
                  onClick={() => onSelect(item.slug)}
                  className={cx(
                    "min-h-8 rounded-lg px-2.5 text-xs focus-visible:outline-2 focus-visible:outline-offset-2",
                    item.slug === entry.slug
                      ? "bg-background-primary-hover text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {item.category}
                  {item.variant
                    ? ` · ${item.variant}`
                    : family.entries.filter(
                          (other) => other.category === item.category
                        ).length > 1
                      ? ` · ${item.name.replace(/^Agent /, "")}`
                      : ""}
                </button>
              ))}
            </div>
          ))}
      </header>
      <div>
        <Tabs key={entry.slug} defaultSelectedKey="preview" className="gap-2">
          <TabList>
            <Tab id="preview">Preview</Tab>
            <Tab id="source">Source</Tab>
          </TabList>
          <TabPanel
            id="preview"
            className="border-separator-border bg-background-secondary-default relative isolate overflow-x-auto rounded-[14px] border p-3 [contain:layout_paint] sm:p-4"
          >
            <LivePreview entry={entry} />
          </TabPanel>
          <TabPanel
            id="source"
            className="border-separator-border bg-background-secondary-default overflow-hidden rounded-[14px] border"
          >
            <pre className="max-h-[520px] overflow-auto p-4 text-xs leading-5">
              <code>{source[entry.path] ?? "Source is being prepared."}</code>
            </pre>
          </TabPanel>
        </Tabs>
      </div>
    </section>
  )
}

export function Catalogue({
  sources,
  entries,
  voice = false,
}: {
  sources: Record<string, string>
  entries: GalleryEntry[]
  voice?: boolean
}) {
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<GalleryCategory | "All">("All")
  const [selected, setSelected] = React.useState<Record<string, string>>({})
  const [voiceView, setVoiceView] = React.useState<"all" | "families">("all")
  const allFamilies = React.useMemo(() => groupEntries(entries), [entries])
  const families = React.useMemo(
    () =>
      groupEntries(
        entries.filter(
          (entry) =>
            (category === "All" || entry.category === category) &&
            `${entry.name} ${entry.source} ${entry.family ?? ""} ${entry.variant ?? ""} ${entry.description ?? ""}`
              .toLowerCase()
              .includes(query.toLowerCase())
        )
      ),
    [category, query, entries]
  )
  const displayedFamilies = React.useMemo(
    () =>
      voice && voiceView === "all"
        ? families.flatMap((family) =>
            family.entries.map((entry) => ({
              id: entry.slug,
              name:
                entry.name === "Audio Visualizer" && entry.variant
                  ? `${entry.variant} audio visualizer`
                  : entry.name,
              entries: [entry],
            }))
          )
        : families,
    [families, voice, voiceView]
  )
  React.useEffect(() => {
    const followHash = () => {
      const slug = decodeURIComponent(location.hash.slice(1))
      const family = allFamilies.find((group) =>
        group.entries.some((entry) => entry.slug === slug)
      )
      if (family) {
        setSelected((current) => ({ ...current, [family.id]: slug }))
        setCategory("All")
        setQuery("")
        requestAnimationFrame(() =>
          document
            .getElementById(voice && voiceView === "all" ? slug : family.id)
            ?.scrollIntoView()
        )
      }
    }
    followHash()
    window.addEventListener("hashchange", followHash)
    return () => window.removeEventListener("hashchange", followHash)
  }, [allFamilies, voice, voiceView])
  const selectVariant = (family: ComponentFamily, slug: string) => {
    setSelected((current) => ({ ...current, [family.id]: slug }))
    history.replaceState(null, "", `#${slug}`)
  }
  return (
    <div className="mx-auto grid max-w-[1080px] lg:grid-cols-[208px_minmax(0,1fr)]">
      <aside className="border-separator-border border-b p-4 lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:overflow-auto lg:border-r lg:border-b-0">
        <label className="bg-background-secondary-default focus-within:border-border-focus-ring flex h-10 items-center gap-2 rounded-lg border border-transparent px-3">
          <Search className="text-text-secondary size-4" />
          <input
            aria-label="Search components"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search components"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
        {voice && (
          <div className="mt-5">
            <label htmlFor="voice-view" className="text-text-secondary text-xs">
              View
            </label>
            <select
              id="voice-view"
              value={voiceView}
              onChange={(event) =>
                setVoiceView(event.target.value as "all" | "families")
              }
              className="border-separator-border bg-background-primary-default mt-2 h-9 w-full rounded-lg border px-2 text-sm"
            >
              <option value="all">All {entries.length} entries</option>
              <option value="families">Grouped families</option>
            </select>
          </div>
        )}
        {!voice && (
          <div className="mt-5">
            <label
              htmlFor="collection-source"
              className="text-text-secondary text-xs"
            >
              Collection
            </label>
            <select
              id="collection-source"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as GalleryCategory | "All")
              }
              className="border-separator-border bg-background-primary-default mt-2 h-9 w-full rounded-lg border px-2 text-sm"
            >
              {(
                [
                  "All",
                  "Beautiful UI",
                  "beUI",
                  "AI Elements",
                  "Prompt Kit",
                  "BoardUI",
                  "Voice Agents",
                  "Generative UI",
                  "Blocks.so",
                  "Effects",
                ] as const
              ).map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All collections"
                    : item === "Generative UI"
                      ? "Agents Kit"
                      : item}
                </option>
              ))}
            </select>
          </div>
        )}
        <nav className="mt-7 hidden lg:block" aria-label="Component families">
          <p className="text-text-tertiary mb-3 px-2 text-xs">Components</p>
          {displayedFamilies.map((family) => (
            <a
              key={family.id}
              href={`#${family.id}`}
              className="text-text-secondary hover:bg-background-secondary-default hover:text-text-primary block rounded-lg px-2 py-2 text-sm focus-visible:outline-2"
            >
              {family.name}
            </a>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 max-w-2xl">
          <p className="text-text-secondary text-sm">
            {voice ? "Agents Kit v0.3" : "Components"}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {voice
              ? "Voice agents"
              : "An interface for every part of agent work."}
          </h1>
          <p className="text-text-secondary mt-3 text-sm leading-6">
            {voice
              ? "LiveKit and ElevenLabs voice components, with OrbKit visualizers. Explore sessions, controls, transcripts, and audio in one place."
              : "From the first prompt to the final result. Explore thinking, tools, decisions, and generated interfaces in one consistent collection."}
          </p>
          <p className="text-text-tertiary mt-3 text-xs">
            {voice
              ? `${entries.length} entries · ${allFamilies.length} families · Interactive demos`
              : `${allFamilies.length} component families · Named source variants · Synthetic examples`}
          </p>
        </header>
        <div className="space-y-6">
          {displayedFamilies.map((family) => (
            <FamilyPreview
              key={family.id}
              family={family}
              source={sources}
              selected={selected[family.id]}
              onSelect={(slug) => selectVariant(family, slug)}
            />
          ))}
        </div>
        {families.length === 0 && (
          <p className="text-text-secondary py-16 text-center text-sm">
            No components match this search.
          </p>
        )}
      </main>
    </div>
  )
}
