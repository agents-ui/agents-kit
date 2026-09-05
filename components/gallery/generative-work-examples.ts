import type { GeneratedWorkContent } from "@/components/agents-ui/application/generative-surface/work-content"

export const generativeWorkExamples: GeneratedWorkContent[] = [
  {
    type: "comparison",
    title: "Compare rollout plans",
    description: "Choose how to release the next update.",
    selectedId: "staged",
    options: [
      {
        id: "staged",
        title: "Staged rollout",
        description: "Expand traffic after each verification window.",
        recommended: true,
        attributes: [
          { label: "Review points", value: "Three" },
          { label: "Rollback", value: "Per stage" },
          { label: "Operator effort", value: "Moderate" },
        ],
      },
      {
        id: "direct",
        title: "Direct rollout",
        description: "Move all traffic after one preflight review.",
        attributes: [
          { label: "Review points", value: "One" },
          { label: "Rollback", value: "Full release" },
          { label: "Operator effort", value: "Low" },
        ],
      },
    ],
  },
  {
    type: "recommendation",
    id: "recommendation-1",
    title: "Review four accounts this week",
    summary:
      "Four renewals need attention: usage has dropped and the account owners need to confirm the next step.",
    reasoning: [
      "Renewal dates fall within the next 45 days.",
      "Usage decreased in the latest review window.",
      "Sponsor ownership is missing or outdated.",
    ],
    confidence: 86,
    alternatives: [
      { id: "review-all", label: "Review all accounts" },
      { id: "revise", label: "Revise criteria" },
    ],
  },
  {
    type: "document",
    id: "document-1",
    title: "Renewal briefing",
    format: "Markdown",
    size: "1.2 KB",
    updated: "Version 2",
    excerpt:
      "Four accounts need review this week. This briefing brings the risk signals, supporting notes, and next steps together.",
  },
  {
    type: "checklist",
    title: "Before you share",
    description: "A few checks before the briefing goes out.",
    items: [
      {
        id: "sources",
        label: "Verify source dates",
        detail: "Confirm each source belongs to the current review window.",
        completed: true,
      },
      {
        id: "owners",
        label: "Assign account owners",
        detail: "Add one responsible owner for every recommended action.",
        completed: false,
      },
      {
        id: "permissions",
        label: "Confirm permissions",
        detail: "Keep external communication behind explicit approval.",
        completed: false,
      },
    ],
  },
  {
    type: "source-brief",
    title: "Account review",
    summary:
      "The review found lower usage, open support requests, and missing owner updates across four accounts.",
    sources: [
      {
        id: "forecast",
        title: "Sample renewal forecast",
        origin: "Example workbook",
      },
      {
        id: "health",
        title: "Sample account health notes",
        origin: "Example account notes",
      },
      {
        id: "playbook",
        title: "Sample renewal playbook",
        origin: "Example playbook",
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
