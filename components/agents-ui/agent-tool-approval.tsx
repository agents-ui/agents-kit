"use client"

import { ToolApproval } from "@/components/agents-ui/application/tool-approval/tool-approval"

export type RiskLevel = "low" | "medium" | "high"
export interface ToolApprovalRequest {
  toolName: string
  description: string
  parameters: Record<string, string>
  riskLevel: RiskLevel
  reasoning: string
}
export interface ToolApprovalHistoryItem {
  id: string
  toolName: string
  decision: "approved" | "rejected"
  timestamp: string
  actor?: string
}
export interface ToolExecutionResult {
  success: boolean
  output: string
  duration?: string
}
export interface AgentToolApprovalProps {
  pendingApproval?: ToolApprovalRequest | null
  approvalHistory?: ToolApprovalHistoryItem[]
  executionResult?: ToolExecutionResult | null
  onApprove?: () => void
  onReject?: () => void
  onAlwaysAllow?: (toolName: string) => void
  className?: string
}
export function AgentToolApproval(props: AgentToolApprovalProps) {
  return <ToolApproval {...props} />
}
