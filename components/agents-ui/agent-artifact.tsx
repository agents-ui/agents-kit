"use client"

import { ArtifactOutput } from "@/components/agents-ui/application/artifact-output/artifact-output"

export type ArtifactType = "code" | "table" | "document" | "chart"
export interface ArtifactVersion {
  id: string
  label: string
  timestamp: string
  content: string
}
export interface ArtifactMetadata {
  generationTime?: string
  model?: string
  tokens?: number
  size?: string
}
export interface AgentArtifactProps {
  title?: string
  artifactType?: ArtifactType
  content?: string
  language?: string
  versions?: ArtifactVersion[]
  currentVersion?: string
  isGenerating?: boolean
  metadata?: ArtifactMetadata
  className?: string
  onCopy?: () => void
  onDownload?: () => void
  onEdit?: () => void
  onRegenerate?: () => void
  onShare?: () => void
  onVersionChange?: (versionId: string) => void
}
export function AgentArtifact(props: AgentArtifactProps) {
  return <ArtifactOutput {...props} />
}
