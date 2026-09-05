"use client"

import { SourcesCitations } from "@/components/agents-ui/application/sources-citations/sources-citations"

export type SourceType = "web" | "document" | "database" | "api"
export interface CitationSource {
  id: string
  number: number
  title: string
  url: string
  type: SourceType
  relevance: number
  snippet: string
  verified: boolean
}
export interface AgentSourcesCitationsProps {
  content?: string
  sources?: CitationSource[]
  activeCitationId?: string | null
  className?: string
  onCitationClick?: (sourceId: string) => void
  onSourceClick?: (sourceId: string) => void
  onVerifySource?: (sourceId: string) => void
  onCopyWithCitations?: () => void
  onExportSources?: () => void
}
export function AgentSourcesCitations(props: AgentSourcesCitationsProps) {
  return <SourcesCitations {...props} />
}
