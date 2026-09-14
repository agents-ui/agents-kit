export interface ResearchNote {
  id: string
  title: string
  text: string
  attached?: boolean
}
export const researchProjects = [
  {
    id: "field-notes",
    title: "West dock interviews",
    subtitle: "Field research · 5 interviews",
    question: "What is slowing down the handoff?",
    notes: [
      {
        id: "interview",
        title: "Operator interviews",
        text: "Four of five operators enter the same shipment identifier twice: first on paper, then on a shared tablet. The tablet often arrives after the paper sheet.",
      },
      {
        id: "shift",
        title: "Shift-change observation",
        text: "At both observed shift changes, operators checked the clipboard and tablet before confirming which shipment record was current.",
      },
      {
        id: "map",
        title: "Workflow map",
        text: "Paper, radio, and tablet steps each copy the shipment identifier. No step owns the canonical record. The team proposed confirming one record at intake and showing its sync status.",
      },
    ],
  },
  {
    id: "accessibility",
    title: "Wayfinding audit",
    subtitle: "Station arrival · 2 observations",
    question: "What should change in the station signs?",
    notes: [
      {
        id: "arrival",
        title: "Arrival walk-through",
        text: "Three visitors paused before the platform turn. Transfer signs compete with advertising at the decision point, and the destination label changes between signs.",
      },
      {
        id: "signs",
        title: "Signage review",
        text: "Repeat the same destination label at eye level before each turn. Keep arrows together with the label and validate the route with first-time visitors.",
      },
    ],
  },
  {
    id: "handoff",
    title: "Research handoff",
    subtitle: "Product team · review brief",
    question: "What needs to be in the handoff?",
    notes: [
      {
        id: "review",
        title: "Team review",
        text: "The product team needs observed behavior, interpretation, and open questions separated. Every finding should include a field-note reference and a named owner for validation.",
      },
      {
        id: "next",
        title: "Next research round",
        text: "Test the intake confirmation with two operators during one shift. Compare duplicate-entry frequency and ask each operator to identify the current shipment record.",
      },
    ],
  },
]

/** Extractive local demo: return the selected notes, never invented research. */
export function researchAnswer(
  question: string,
  notes: ResearchNote[],
  concise = false
) {
  if (!notes.length)
    return "This conversation has no source notes yet. Attach a text note or open one of the research projects to ask about its evidence."
  const terms =
    question
      .toLowerCase()
      .match(/[a-z]{4,}/g)
      ?.filter(
        (word) =>
          ![
            "what",
            "with",
            "from",
            "that",
            "this",
            "about",
            "should",
            "could",
            "please",
          ].includes(word)
      ) ?? []
  const ranked = notes
    .map((note, index) => ({
      note,
      index,
      score: terms.filter((term) =>
        `${note.title} ${note.text}`.toLowerCase().includes(term)
      ).length,
    }))
    .sort((a, b) => b.score - a.score)
  const relevant =
    ranked[0].score > 0 ? ranked.filter((item) => item.score > 0) : ranked
  const chosen = relevant.slice(0, concise ? 1 : 3)
  return `From ${chosen.length === 1 ? "the selected note" : "the selected notes"}:\n\n${chosen.map(({ note, index }) => `${note.text.slice(0, concise ? 220 : 480)}${note.text.length > (concise ? 220 : 480) ? "…" : ""} [${index + 1}]`).join("\n\n")}`
}

export function researchReport(
  title: string,
  notes: ResearchNote[],
  answer: string
) {
  return `${title}\n\nRESEARCH BRIEF\n\n${answer}\n\nSOURCE NOTES\n${notes.map((note, index) => `${index + 1}. ${note.title}\n${note.text}`).join("\n\n")}\n\nReview these observations with the project team before taking action.`
}
