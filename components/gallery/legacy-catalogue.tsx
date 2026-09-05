"use client"

import * as React from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Tab, TabList, TabPanel, Tabs } from "@/components/boardui/base/tabs/tabs"
import { legacyEntries, type LegacyCategory, type LegacyEntry } from "./legacy-catalog"

function LegacyPreview({ entry }: { entry: LegacyEntry }) {
  const root = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    const target = root.current
    if (!target) return
    const observer = new IntersectionObserver(([record]) => {
      if (!record.isIntersecting) return
      setVisible(true)
      observer.disconnect()
    }, { rootMargin: "480px" })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])
  const Preview = entry.component
  return (
    <div ref={root} className="min-h-32 w-full *:mx-auto">
      {visible ? (
        <React.Suspense fallback={<p className="p-8 text-center text-sm text-text-secondary">Loading preview</p>}>
          {React.createElement(Preview, entry.props)}
        </React.Suspense>
      ) : <div className="h-32" />}
    </div>
  )
}

function LegacyEntryCard({ entry, source }: { entry: LegacyEntry; source: Record<string, string> }) {
  return (
    <section id={entry.slug} className="scroll-mt-24">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-medium tracking-tight">{entry.name}</h2>
          <p className="mt-1 text-xs text-text-secondary">{entry.source}</p>
        </div>
        <a href={`#${entry.slug}`} className="text-xs text-text-tertiary hover:text-text-primary">#{entry.slug}</a>
      </header>
      <div className="overflow-hidden rounded-2xl border border-separator-border">
        <Tabs defaultSelectedKey="preview">
          <TabList className="border-b border-separator-border px-4">
            <Tab id="preview">Preview</Tab>
            <Tab id="source">Source</Tab>
          </TabList>
          <TabPanel id="preview" className="relative isolate overflow-auto bg-background-secondary-default p-5 [contain:layout_paint] sm:p-8">
            <LegacyPreview entry={entry} />
          </TabPanel>
          <TabPanel id="source">
            <pre className="max-h-[520px] overflow-auto p-5 text-xs leading-5"><code>{source[entry.path] ?? "Source is being prepared."}</code></pre>
          </TabPanel>
        </Tabs>
      </div>
    </section>
  )
}

export function LegacyCatalogue({ sources }: { sources: Record<string, string> }) {
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<LegacyCategory | "All">("All")
  const visible = React.useMemo(() => legacyEntries.filter((entry) => (category === "All" || entry.category === category) && `${entry.name} ${entry.source}`.toLowerCase().includes(query.toLowerCase())), [category, query])
  React.useEffect(() => {
    const followHash = () => {
      const slug = decodeURIComponent(location.hash.slice(1))
      if (!legacyEntries.some((entry) => entry.slug === slug)) return
      setCategory("All")
      setQuery("")
      requestAnimationFrame(() => document.getElementById(slug)?.scrollIntoView())
    }
    followHash()
    window.addEventListener("hashchange", followHash)
    return () => window.removeEventListener("hashchange", followHash)
  }, [])

  return (
    <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="border-b border-separator-border p-5 lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:overflow-auto lg:border-r lg:border-b-0">
        <div className="rounded-lg border border-separator-border bg-background-secondary-default px-3 py-2 text-xs text-text-secondary">Legacy v0.1 collection</div>
        <label className="mt-4 flex h-10 items-center gap-2 rounded-lg border border-transparent bg-background-secondary-default px-3 focus-within:border-border-focus-ring"><Search className="size-4 text-text-secondary" /><input aria-label="Search legacy components" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search v0.1" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
        <label htmlFor="legacy-source" className="mt-5 block text-xs text-text-secondary">Collection</label>
        <select id="legacy-source" value={category} onChange={(event) => setCategory(event.target.value as LegacyCategory | "All")} className="mt-2 h-9 w-full rounded-lg border border-separator-border bg-background-primary-default px-2 text-sm">{(["All", "Agents", "Prompt Kit", "Blocks"] as const).map((item) => <option key={item} value={item}>{item === "All" ? "All v0.1 components" : item}</option>)}</select>
        <nav className="mt-7 hidden lg:block" aria-label="Legacy components"><p className="mb-3 px-2 text-xs text-text-tertiary">Components</p>{visible.map((entry) => <a key={entry.slug} href={`#${entry.slug}`} className="block rounded-lg px-2 py-2 text-sm text-text-secondary hover:bg-background-secondary-default hover:text-text-primary focus-visible:outline-2">{entry.name}</a>)}</nav>
      </aside>
      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-12">
        <header className="mb-12 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3"><span className="rounded-sm border border-separator-border px-2 py-1 text-xs font-medium">v0.1 archive</span><Link href="/components" className="text-sm text-text-secondary underline underline-offset-4 hover:text-text-primary">Open the v0.2 collection</Link></div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">The original public component collection.</h1>
          <p className="mt-4 text-sm leading-6 text-text-secondary">This archive keeps the existing agent components, Prompt Kit primitives, and product blocks available at stable public source paths. Previews and source stay together on this page.</p>
          <p className="mt-3 text-xs text-text-tertiary">{legacyEntries.length} components  |  Synthetic examples  |  Public source only</p>
        </header>
        <div className="space-y-12">{visible.map((entry) => <LegacyEntryCard key={entry.slug} entry={entry} source={sources} />)}</div>
        {visible.length === 0 && <p className="py-16 text-center text-sm text-text-secondary">No legacy components match this search.</p>}
      </main>
    </div>
  )
}
