"use client"

import { CodeExecutor } from "@/components/agents-ui/application/code-executor/code-executor"

export interface CodeExecutionOutput {
  stdout?: string
  stderr?: string
  exitCode: number
  executionTime?: string
  memoryUsage?: string
}
export interface CodeExecutionHistoryItem {
  id: string
  code: string
  output: CodeExecutionOutput
  timestamp: string
  status: "success" | "error"
}
export interface AgentCodeExecutorProps {
  sandboxName?: string
  language?: string
  code?: string
  output?: CodeExecutionOutput
  executionHistory?: CodeExecutionHistoryItem[]
  isExecuting?: boolean
  sandboxLevel?: "sandboxed" | "unrestricted"
  onRun?: () => void
  onStop?: () => void
  onClear?: () => void
  onCopyCode?: () => void
  onEditCode?: (editable: boolean) => void
  className?: string
}
export function AgentCodeExecutor(props: AgentCodeExecutorProps) {
  return <CodeExecutor {...props} />
}
