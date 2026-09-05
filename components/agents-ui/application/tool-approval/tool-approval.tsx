"use client"

import type {
  AgentToolApprovalProps,
  ToolApprovalHistoryItem,
  ToolApprovalRequest,
  ToolExecutionResult,
} from "@/components/agents-ui/agent-tool-approval"
import { Button } from "@/components/boardui/base/buttons/button"
import { Checkbox } from "@/components/boardui/base/checkbox/checkbox"
import { cx } from "@/components/boardui/utils/cx"
import { Check, ChevronDown, Clock, Shield, X } from "lucide-react"
import * as React from "react"

const fallback: ToolApprovalRequest = {
  toolName: "create_salesforce_tasks",
  description: "Create 12 follow-up tasks in Salesforce",
  parameters: {
    scope: "12 account records",
    target: "Task records only",
    reversibility: "Tasks can be deleted",
    due_date: "This Friday",
    owner: "Current account owner",
  },
  riskLevel: "medium",
  reasoning:
    "The renewal review found four accounts that need executive outreach this week. Creating assigned tasks keeps the work visible without contacting customers.",
}
const riskLabel = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
} as const

function ApprovalRecord({ item }: { item: ToolApprovalHistoryItem }) {
  const approved = item.decision === "approved"
  return (
    <li className="grid grid-cols-[18px_1fr_auto] items-start gap-2 py-2.5">
      <span
        className={
          approved
            ? "text-green-700 dark:text-green-400"
            : "text-red-700 dark:text-red-400"
        }
      >
        {approved ? <Check className="size-4" /> : <X className="size-4" />}
      </span>
      <div className="min-w-0">
        <p className="text-text-primary truncate font-mono text-xs">
          {item.toolName}
        </p>
        <p className="text-text-secondary mt-0.5 text-xs">
          {approved ? "Approved" : "Rejected"}
          {item.actor ? ` by ${item.actor}` : ""}
        </p>
      </div>
      <span className="text-text-secondary flex items-center gap-1 text-xs">
        <Clock className="size-3" />
        {item.timestamp}
      </span>
    </li>
  )
}

function ResultAndHistory({
  result,
  history,
}: {
  result?: ToolExecutionResult | null
  history: ToolApprovalHistoryItem[]
}) {
  if (!result && history.length === 0) return null
  return (
    <div className="mt-4 space-y-4">
      {result && (
        <section
          aria-label="Execution result"
          className="bg-background-secondary-default rounded-lg p-3 text-sm"
        >
          <p
            className={
              result.success
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }
          >
            {result.success ? "Execution complete" : "Execution failed"}
            {result.duration ? ` · ${result.duration}` : ""}
          </p>
          <pre className="text-text-secondary mt-2 max-h-40 overflow-auto font-mono text-xs leading-5 whitespace-pre-wrap">
            {result.output}
          </pre>
        </section>
      )}
      {history.length > 0 && (
        <section aria-labelledby="approval-history-heading">
          <h3
            id="approval-history-heading"
            className="text-text-primary text-sm font-medium"
          >
            Approval history
          </h3>
          <ol className="divide-separator-border border-separator-border mt-2 divide-y border-y">
            {history.map((item) => (
              <ApprovalRecord key={item.id} item={item} />
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}

export function ToolApproval({
  pendingApproval,
  approvalHistory = [],
  executionResult,
  onApprove,
  onReject,
  onAlwaysAllow,
  className,
}: AgentToolApprovalProps) {
  const request = pendingApproval === undefined ? fallback : pendingApproval
  const [remember, setRemember] = React.useState(false)
  if (!request)
    return (
      <section
        className={cx(
          "border-separator-border bg-background-primary-default rounded-xl border p-5",
          className
        )}
      >
        <p className="text-text-primary text-sm font-medium">
          No approvals waiting
        </p>
        <p className="text-text-secondary mt-1 text-sm">
          Requests appear here when an agent needs a decision.
        </p>
        <ResultAndHistory result={executionResult} history={approvalHistory} />
        {approvalHistory.length > 0 && (
          <p className="border-separator-border text-text-secondary mt-4 border-t pt-3 text-xs">
            {approvalHistory.length} previous{" "}
            {approvalHistory.length === 1 ? "decision" : "decisions"}
          </p>
        )}
      </section>
    )

  const scope = request.parameters.scope
  const target = request.parameters.target
  const reversibility = request.parameters.reversibility
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default w-full max-w-[620px] rounded-xl border p-5",
        className
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-text-secondary flex items-center gap-2 text-xs">
            <Shield className="size-4" />
            Approval required
          </p>
          <h2 className="text-text-primary mt-2 text-lg font-semibold">
            {request.description}
          </h2>
        </div>
        <span
          className={cx(
            "rounded-sm border px-2 py-1 text-xs",
            request.riskLevel === "high"
              ? "border-red-400 text-red-700 dark:text-red-400"
              : request.riskLevel === "medium"
                ? "border-amber-400 text-amber-700 dark:text-amber-400"
                : "border-separator-border text-text-secondary"
          )}
        >
          {riskLabel[request.riskLevel]}
        </span>
      </header>
      <p className="border-separator-border text-text-secondary mt-4 border-l-2 pl-3 text-sm">
        Review the requested operation and supplied parameters before deciding.
      </p>
      <dl className="border-separator-border mt-5 grid grid-cols-[120px_1fr] gap-x-4 gap-y-2 border-y py-4 text-sm">
        <dt className="text-text-secondary">Tool</dt>
        <dd className="text-text-primary font-mono">{request.toolName}</dd>
        <dt className="text-text-secondary">Scope</dt>
        <dd>{scope ?? "Not specified"}</dd>
        <dt className="text-text-secondary">Target</dt>
        <dd>{target ?? "Not specified"}</dd>
        {reversibility !== undefined && (
          <>
            <dt className="text-text-secondary">Reversibility</dt>
            <dd>{reversibility}</dd>
          </>
        )}
      </dl>
      <div className="border-separator-border mt-4 overflow-hidden rounded-lg border">
        <p className="border-separator-border bg-background-secondary-default text-text-secondary border-b px-3 py-2 text-xs">
          Proposed parameters
        </p>
        {Object.entries(request.parameters).map(([key, value]) => (
          <div
            key={key}
            className="border-separator-border grid grid-cols-[120px_1fr] gap-3 border-b px-3 py-2.5 text-sm last:border-0"
          >
            <span className="text-text-secondary font-mono text-xs">{key}</span>
            <span className="text-text-primary break-words">{value}</span>
          </div>
        ))}
      </div>
      <details className="group border-separator-border mt-3 border-b">
        <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between text-sm font-medium">
          Why this action
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <p className="text-text-secondary pb-3 text-sm leading-6">
          {request.reasoning}
        </p>
      </details>
      <ResultAndHistory result={executionResult} history={approvalHistory} />
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {onAlwaysAllow ? (
          <Checkbox isSelected={remember} onChange={setRemember} size="sm">
            Remember permission for this tool
          </Checkbox>
        ) : (
          <span />
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onReject}>
            Decline
          </Button>
          <Button
            onClick={() => {
              if (remember) onAlwaysAllow?.(request.toolName)
              onApprove?.()
            }}
          >
            {remember ? "Always allow" : "Allow once"}
          </Button>
        </div>
      </div>
      <p className="border-separator-border text-text-secondary mt-5 border-t pt-3 text-xs">
        {request.toolName} · {approvalHistory.length} previous{" "}
        {approvalHistory.length === 1 ? "decision" : "decisions"}
      </p>
    </section>
  )
}
