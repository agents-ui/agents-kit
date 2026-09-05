import type { GeneratedWorkContent } from "@/components/agents-ui/application/generative-surface/work-content"

export const generativeWorkExamples: GeneratedWorkContent[] = [
  {
    type: "comparison",
    title: "Choose the workshop format",
    description:
      "Two ways to turn the Copenhagen field notes into a shared study.",
    selectedId: "studio-table",
    options: [
      {
        id: "studio-table",
        title: "Studio table",
        description:
          "Sort the collected textures, sounds, and sketches together.",
        recommended: true,
        attributes: [
          { label: "Duration", value: "4 hours" },
          { label: "Group size", value: "12 people" },
          { label: "Weather dependency", value: "Low" },
        ],
      },
      {
        id: "walking-study",
        title: "Walking study",
        description:
          "Follow a short harbour route and annotate observations in pairs.",
        attributes: [
          { label: "Duration", value: "2.5 hours" },
          { label: "Group size", value: "8 people" },
          { label: "Weather dependency", value: "High" },
        ],
      },
    ],
  },
  {
    type: "recommendation",
    id: "recommendation-1",
    title: "Run the material walk before lunch",
    summary:
      "Start at the harbour while the route is quiet, then bring the collected observations back to the studio table.",
    reasoning: [
      "The plan reserves the morning for outdoor observation.",
      "Two covered stops keep the route usable if conditions change.",
      "The afternoon remains open for sorting and sketching indoors.",
    ],
    confidence: 82,
    acceptLabel: "Use this workshop plan",
    alternatives: [
      { id: "studio-first", label: "Start in the studio" },
      { id: "revise-route", label: "Revise the route" },
    ],
  },
  {
    type: "document",
    id: "document-1",
    title: "Fieldwork workshop brief",
    format: "Markdown",
    size: "2.1 KB",
    updated: "Version 3",
    excerpt:
      "A week-long studio trip from Lisbon to Copenhagen. Collect harbour sounds, trace botanical patterns, and turn the material into a shared wall study.",
  },
  {
    type: "checklist",
    title: "Before the studio walk",
    description: "Get the group and equipment ready for a morning outside.",
    items: [
      {
        id: "route",
        label: "Mark the covered route stops",
        detail: "Keep a dry fallback within ten minutes of each outdoor stop.",
        completed: true,
      },
      {
        id: "kits",
        label: "Pack the recording kits",
        detail: "Bring three recorders, spare cards, and weather sleeves.",
        completed: false,
      },
      {
        id: "consent",
        label: "Review participant consent",
        detail: "Explain how workshop notes and recordings will be used.",
        completed: false,
      },
    ],
  },
  {
    type: "source-brief",
    title: "Copenhagen fieldwork brief",
    summary:
      "Travel details, workshop notes, and a weather snapshot for the studio's week of field observations.",
    sources: [
      {
        id: "itinerary",
        title: "Lisbon to Copenhagen itinerary",
        origin: "Illustrative travel data",
      },
      {
        id: "field-notes",
        title: "Harbour and glasshouse field notes",
        origin: "Fictional workshop notes",
      },
      {
        id: "weather",
        title: "Copenhagen studio-day outlook",
        origin: "Illustrative weather snapshot",
      },
    ],
  },
]

export const generativeWorkNames: Record<GeneratedWorkContent["type"], string> =
  {
    comparison: "Comparison",
    recommendation: "Recommendation",
    document: "Document",
    checklist: "Checklist",
    "source-brief": "Source brief",
  }
