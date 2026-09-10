"use client"

import {
  ReasoningText,
  type ReasoningTextVariant,
} from "@/components/beui/components/agents/loading-states/reasoning-text"
import * as React from "react"

const EXAMPLES: {
  label: string
  variant: ReasoningTextVariant
  phrases: string[]
}[] = [
  {
    label: "Cascade",
    variant: "cascade",
    phrases: [
      "Reading field notes",
      "Clustering interview themes",
      "Linking supporting quotes",
      "Preparing the synthesis",
    ],
  },
  {
    label: "Swap",
    variant: "swap",
    phrases: [
      "Reviewing consent",
      "Comparing station visits",
      "Checking contradictions",
      "Preparing the readout",
    ],
  },
  {
    label: "Scramble",
    variant: "scramble",
    phrases: ["Reading", "Comparing", "Validating", "Writing"],
  },
]

export function ReasoningTextPreview() {
  return (
    <div className="grid w-full max-w-sm gap-7">
      {EXAMPLES.map(({ label, variant, phrases }) => (
        <div key={variant} className="grid gap-2">
          <span className="text-muted-foreground/60 text-[11px] font-medium tracking-wider uppercase">
            {label}
          </span>
          <ReasoningText
            variant={variant}
            phrases={phrases}
            className="text-base"
          />
        </div>
      ))}
    </div>
  )
}
