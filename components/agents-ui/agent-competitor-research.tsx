"use client"

import { CompetitorResearch } from "@/components/agents-ui/application/competitor-research/competitor-research"

export type ResearchDepth = "quick" | "standard" | "deep"
export type ThreatLevel = "low" | "medium" | "high"
export interface Competitor {
  name: string
  description: string
  category: string
  strengths: string[]
  weaknesses: string[]
  threatLevel: ThreatLevel
  marketPosition: string
}
export interface ComparisonFeature {
  feature: string
  competitorScores: Record<string, boolean>
}
export interface AgentCompetitorResearchProps {
  query?: string
  researchDepth?: ResearchDepth
  competitors?: Competitor[]
  comparisonFeatures?: ComparisonFeature[]
  keyFindings?: string[]
  sourcesCount?: number
  lastUpdated?: string
  isResearching?: boolean
  onExport?: () => void
  onDeepenResearch?: () => void
  onRefresh?: () => void
  onCompareFeature?: (feature: string) => void
  className?: string
}
export function AgentCompetitorResearch(props: AgentCompetitorResearchProps) {
  return <CompetitorResearch {...props} />
}
