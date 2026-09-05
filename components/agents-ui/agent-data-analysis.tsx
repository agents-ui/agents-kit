"use client"

import { DataAnalysis } from "@/components/agents-ui/application/data-analysis/data-analysis"

export interface DataMetric {
  label: string
  value: string
  change: string
  changeDirection: "up" | "down" | "neutral"
}
export interface DataPreview {
  headers: string[]
  rows: string[][]
}
export interface DataInsight {
  id: string
  title: string
  description: string
  confidence: number
  category: "trend" | "anomaly" | "correlation" | "recommendation"
}
export interface DistributionBar {
  label: string
  value: number
  maxValue: number
  color: string
}
export interface AgentDataAnalysisProps {
  datasetName?: string
  description?: string
  rowCount?: number
  columnCount?: number
  metrics?: DataMetric[]
  dataPreview?: DataPreview
  insights?: DataInsight[]
  distribution?: DistributionBar[]
  isAnalyzing?: boolean
  onExport?: () => void
  onDeeperAnalysis?: () => void
  onAskFollowUp?: () => void
  onDownload?: () => void
  className?: string
}
export function AgentDataAnalysis(props: AgentDataAnalysisProps) {
  return <DataAnalysis {...props} />
}
