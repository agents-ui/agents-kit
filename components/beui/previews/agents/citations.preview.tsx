"use client"

import {
  Citation,
  Citations,
  type CitationItem,
} from "@/components/beui/components/agents/citations"
import { RotateCcw } from "lucide-react"
import { useReducedMotion } from "motion/react"
import * as React from "react"
import { useEffect, useState } from "react"

const CITATION_ITEMS: CitationItem[] = [
  {
    id: "walkthrough",
    title: "Station 4 accessibility walkthrough",
    domain: "fieldwork.local",
    url: "https://example.com/fieldwork/walkthrough",
  },
  {
    id: "interviews",
    title: "Rider interview synthesis",
    domain: "research.local",
    url: "https://example.com/fieldwork/interviews",
  },
  {
    id: "photos",
    title: "Entrance and platform photo log",
    domain: "fieldwork.local",
    url: "https://example.com/fieldwork/photos",
  },
]

function CitationsDemo() {
  const reduce = useReducedMotion() ?? false
  const [visible, setVisible] = useState(reduce ? CITATION_ITEMS.length : 0)

  useEffect(() => {
    if (reduce) return
    const timers = CITATION_ITEMS.map((_, index) =>
      window.setTimeout(() => setVisible(index + 1), 500 + index * 700)
    )
    return () => timers.forEach(window.clearTimeout)
  }, [reduce])

  return (
    <div className="space-y-4">
      <p className="text-foreground/90 text-sm leading-6">
        The south entrance has no step-free route{" "}
        <Citation
          citationId="walkthrough"
          index={1}
          idPrefix="preview-source"
        />
        , and riders consistently described the transfer signage as unclear{" "}
        <Citation citationId="interviews" index={2} idPrefix="preview-source" />
        .
      </p>
      <Citations
        idPrefix="preview-source"
        citations={CITATION_ITEMS.slice(0, visible)}
        defaultOpen
      />
    </div>
  )
}

export function CitationsPreview() {
  const [run, setRun] = useState(0)

  return (
    <div className="relative h-[410px] w-full max-w-lg">
      <CitationsDemo key={run} />
      <button
        type="button"
        onClick={() => setRun((value) => value + 1)}
        className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2"
      >
        <RotateCcw className="size-3" />
        Replay
      </button>
    </div>
  )
}
