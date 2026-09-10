"use client"

import {
  AgentActivity,
  type AgentSearchResult,
} from "@/components/beui/components/agents/agent-activity"
import {
  FileText,
  Image as ImageIcon,
  MapPin,
  MessagesSquare,
  RotateCcw,
} from "lucide-react"
import { useReducedMotion } from "motion/react"
import * as React from "react"
import { useEffect, useState } from "react"

const SEARCH_RESULTS: AgentSearchResult[] = [
  {
    id: "map",
    title: "Jaipur transit access map",
    domain: "fieldwork.local/maps",
    icon: <MapPin className="size-3.5" />,
  },
  {
    id: "interviews",
    title: "Rider interview synthesis",
    domain: "fieldwork.local/interviews",
    icon: <MessagesSquare className="size-3.5" />,
  },
  {
    id: "photos",
    title: "Station accessibility photos",
    domain: "fieldwork.local/photos",
    icon: <ImageIcon className="size-3.5" />,
  },
  {
    id: "brief",
    title: "Mobility research brief",
    domain: "fieldwork.local/brief",
    icon: <FileText className="size-3.5" />,
  },
]

function SearchDemo() {
  const reduce = useReducedMotion() ?? false
  const [visible, setVisible] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    if (reduce) {
      setVisible(SEARCH_RESULTS.length)
      setComplete(true)
      return
    }

    const resultTimers = SEARCH_RESULTS.map((_, index) =>
      window.setTimeout(() => setVisible(index + 1), 650 + index * 650)
    )
    const completeTimer = window.setTimeout(() => setComplete(true), 3900)
    return () => {
      resultTimers.forEach(window.clearTimeout)
      window.clearTimeout(completeTimer)
    }
  }, [reduce])

  return (
    <AgentActivity
      status={complete ? "complete" : "working"}
      contentType="search"
      defaultOpen={reduce}
      collapseOnComplete={!reduce}
      maxHeight={220}
      items={[
        {
          id: "search",
          type: "search",
          query: "wheelchair access around Jaipur Metro stations",
          results: SEARCH_RESULTS.slice(0, visible),
          moreCount: visible === SEARCH_RESULTS.length ? 7 : undefined,
        },
      ]}
    />
  )
}

export function AgentActivitySearchPreview() {
  const [run, setRun] = useState(0)

  return (
    <div className="relative h-[330px] w-full max-w-lg">
      <SearchDemo key={run} />
      <button
        type="button"
        onClick={() => setRun((current) => current + 1)}
        className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2"
      >
        <RotateCcw className="size-3" />
        Replay
      </button>
    </div>
  )
}
