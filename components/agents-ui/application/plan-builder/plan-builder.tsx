"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, RotateCcw, X } from "lucide-react"

export type PlanStepStatus = "pending" | "approved" | "rejected" | "modified"
export interface PlanStep {
  id: string
  title: string
  description: string
  tool: string
  duration: string
  dependencies: number[]
  status: PlanStepStatus
}
export interface AgentPlanBuilderProps {
  planTitle?: string
  objective?: string
  totalEstimate?: string
  estimatedCost?: string
  steps?: PlanStep[]
  confidence?: number
  onApproveAll?: () => void
  onRejectPlan?: () => void
  onRevise?: () => void
  onApproveStep?: (stepId: string) => void
  onRejectStep?: (stepId: string) => void
  className?: string
}
const defaults: PlanStep[] = [
  {
    id: "crawl",
    title: "Crawl site pages",
    description:
      "Collect public URLs, metadata, status codes, and response times.",
    tool: "Web crawler",
    duration: "8 min",
    dependencies: [],
    status: "approved",
  },
  {
    id: "content",
    title: "Analyze content quality",
    description: "Score readability, topic coverage, and internal links.",
    tool: "Content analyzer",
    duration: "10 min",
    dependencies: [1],
    status: "pending",
  },
  {
    id: "links",
    title: "Check backlink profile",
    description: "Review referring domains, anchors, and risk indicators.",
    tool: "Backlink analysis",
    duration: "6 min",
    dependencies: [1],
    status: "pending",
  },
  {
    id: "report",
    title: "Generate audit report",
    description: "Compile findings into a priority-ranked report.",
    tool: "Report builder",
    duration: "7 min",
    dependencies: [2, 3],
    status: "rejected",
  },
  {
    id: "notify",
    title: "Notify stakeholders",
    description: "Send the approved report to the review team.",
    tool: "Notification service",
    duration: "3 min",
    dependencies: [4],
    status: "pending",
  },
]
const status: Record<PlanStepStatus, string> = {
  pending: "Needs review",
  approved: "Approved",
  rejected: "Rejected",
  modified: "Modified",
}
const tone: Record<PlanStepStatus, string> = {
  pending: "text-amber-700",
  approved: "text-green-600",
  rejected: "text-red-600",
  modified: "text-amber-700",
}
export function PlanBuilder({
  planTitle = "SEO audit plan",
  objective = "Audit the site, identify content gaps, and deliver an actionable report.",
  totalEstimate = "34 min",
  estimatedCost = "$1.20",
  steps,
  confidence = 87,
  onApproveAll,
  onRejectPlan,
  onRevise,
  onApproveStep,
  onRejectStep,
  className,
}: AgentPlanBuilderProps) {
  const items = steps?.length ? steps : defaults
  const approved = items.filter((item) => item.status === "approved").length
  const rejected = items.filter((item) => item.status === "rejected").length
  return (
    <section
      className={cn(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-text-secondary text-xs font-medium">Plan review</p>
          <h2 className="text-text-primary mt-1 text-lg font-semibold">
            {planTitle}
          </h2>
          <p className="text-text-secondary mt-1 max-w-2xl text-sm">
            {objective}
          </p>
        </div>
        <div className="text-text-primary shrink-0 text-sm">
          {confidence}% confidence
          <p className="text-text-secondary mt-1 text-xs">
            {totalEstimate} · {estimatedCost}
          </p>
        </div>
      </header>
      <ol>
        {items.map((step, index) => (
          <li
            key={step.id}
            className="border-separator-border flex items-start gap-3 border-b px-4 py-3 last:border-0"
          >
            <span className="text-text-secondary w-6 text-xs">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-x-3">
                <h3 className="text-text-primary text-sm font-medium">
                  {step.title}
                </h3>
                <span className={cn("text-xs", tone[step.status])}>
                  {status[step.status]}
                </span>
              </div>
              <p className="text-text-secondary mt-1 text-xs">
                {step.description}
              </p>
              <div className="text-text-secondary mt-2 flex flex-wrap gap-x-3 text-xs">
                <span>{step.tool}</span>
                <span>{step.duration}</span>
                {step.dependencies.length > 0 && (
                  <span>
                    After{" "}
                    {step.dependencies.map((item) => `step ${item}`).join(", ")}
                  </span>
                )}
              </div>
            </div>
            {(step.status === "pending" || step.status === "modified") && (
              <div className="flex gap-1">
                <Button
                  size="xs"
                  variant="ghost"
                  iconOnly
                  leadingIcon={Check}
                  aria-label={`Approve ${step.title}`}
                  onClick={() => onApproveStep?.(step.id)}
                />
                <Button
                  size="xs"
                  variant="ghost"
                  iconOnly
                  leadingIcon={X}
                  aria-label={`Reject ${step.title}`}
                  onClick={() => onRejectStep?.(step.id)}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
      <details className="group border-separator-border border-t px-4 py-3">
        <summary className="text-text-primary flex cursor-pointer list-none items-center gap-1 text-xs">
          <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
          Approval summary
        </summary>
        <div className="bg-background-secondary-default text-text-secondary mt-3 grid gap-2 rounded-lg p-3 text-xs sm:grid-cols-3">
          <span>{approved} approved</span>
          <span>{items.length - approved - rejected} awaiting review</span>
          <span>{rejected} rejected</span>
        </div>
      </details>
      <footer className="border-separator-border flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-text-secondary flex gap-3 text-xs">
          <span>{items.length} steps</span>
          <span>{totalEstimate}</span>
          <span>{estimatedCost}</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="small"
            variant="secondary"
            leadingIcon={RotateCcw}
            onClick={onRevise}
          >
            Revise
          </Button>
          <Button
            size="small"
            variant="danger"
            leadingIcon={X}
            onClick={onRejectPlan}
          >
            Reject
          </Button>
          <Button size="small" leadingIcon={Check} onClick={onApproveAll}>
            Approve plan
          </Button>
        </div>
      </footer>
    </section>
  )
}
