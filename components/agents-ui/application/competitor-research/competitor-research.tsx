"use client"

import type {
  AgentCompetitorResearchProps,
  ComparisonFeature,
  Competitor,
} from "@/components/agents-ui/agent-competitor-research"
import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { Check, Download, RefreshCw, Search, X } from "lucide-react"

const comps0: Competitor[] = [
  {
    name: "Asana",
    description: "Established work management platform.",
    category: "Work management",
    strengths: ["Enterprise adoption", "Workflow templates"],
    weaknesses: ["Plan complexity", "Limited native actions"],
    threatLevel: "high",
    marketPosition: "Enterprise leader",
  },
  {
    name: "Monday.com",
    description: "Flexible visual work platform.",
    category: "Work operating system",
    strengths: ["Flexible configuration", "Strong onboarding"],
    weaknesses: ["Configuration overhead", "Variable reporting depth"],
    threatLevel: "high",
    marketPosition: "Broad challenger",
  },
]
const features0: ComparisonFeature[] = [
  {
    feature: "Agent task execution",
    competitorScores: { Asana: false, "Monday.com": true },
  },
  {
    feature: "Enterprise permissions",
    competitorScores: { Asana: true, "Monday.com": true },
  },
  {
    feature: "Native CRM context",
    competitorScores: { Asana: false, "Monday.com": true },
  },
]
export function CompetitorResearch({
  query = "AI work management platforms",
  researchDepth = "standard",
  competitors = comps0,
  comparisonFeatures = features0,
  keyFindings = [
    "Governance matters more than raw feature count.",
    "CRM context is a clear differentiation opportunity.",
  ],
  sourcesCount = 24,
  lastUpdated = "14:32",
  isResearching = false,
  onExport,
  onDeepenResearch,
  onRefresh,
  onCompareFeature,
  className,
}: AgentCompetitorResearchProps) {
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-wrap justify-between gap-3 border-b p-5">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Search className="size-4" />
            Competitor research
          </h2>
          <p className="text-text-secondary mt-1 text-sm">{query}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            leadingIcon={RefreshCw}
            onClick={onRefresh}
          >
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="small"
            leadingIcon={Download}
            onClick={onExport}
          >
            Export
          </Button>
        </div>
      </header>
      {isResearching && (
        <p className="border-separator-border text-text-secondary border-b p-2 text-xs">
          Researching sources
        </p>
      )}
      <div className="grid lg:grid-cols-[3fr_2fr]">
        <div className="p-5">
          {competitors.map((c) => (
            <article
              key={c.name}
              className="border-separator-border border-b py-4 first:pt-0"
            >
              <div className="flex justify-between">
                <h3 className="text-sm font-semibold">{c.name}</h3>
                <span className="text-text-secondary text-xs">
                  {c.threatLevel} threat
                </span>
              </div>
              <p className="text-text-secondary text-xs">
                {c.category} · {c.marketPosition}
              </p>
              <p className="mt-2 text-sm">{c.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <ul>
                  {c.strengths.map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check className="mt-1 size-3 text-green-600" />
                      {x}
                    </li>
                  ))}
                </ul>
                <ul>
                  {c.weaknesses.map((x) => (
                    <li key={x} className="flex gap-2">
                      <X className="text-text-secondary mt-1 size-3" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <aside className="border-separator-border border-t p-5 lg:border-t-0 lg:border-l">
          <h3 className="text-sm font-medium">Key findings</h3>
          {keyFindings.map((x, i) => (
            <p
              key={x}
              className="border-separator-border border-b py-3 text-sm"
            >
              <span className="text-text-secondary mr-2 text-xs">{i + 1}</span>
              {x}
            </p>
          ))}
          <Button
            variant="secondary"
            size="small"
            className="mt-4"
            onClick={onDeepenResearch}
          >
            Deepen research
          </Button>
        </aside>
      </div>
      <div className="border-separator-border overflow-auto border-t p-5">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left">Capability</th>
              {competitors.map((c) => (
                <th key={c.name}>{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((f) => (
              <tr
                key={f.feature}
                tabIndex={0}
                onClick={() => onCompareFeature?.(f.feature)}
                className="border-separator-border cursor-pointer border-t"
              >
                <th className="p-3 text-left font-medium">{f.feature}</th>
                {competitors.map((c) => (
                  <td key={c.name} className="text-center">
                    {f.competitorScores[c.name] ? "Available" : "Not available"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-text-secondary mt-4 text-xs">
          {competitors.length} competitors · {sourcesCount} sources ·{" "}
          {researchDepth} depth · Updated {lastUpdated}
        </p>
      </div>
    </section>
  )
}
