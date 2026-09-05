"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cn } from "@/lib/utils"
import { ChevronDown, Pause, Play, RefreshCw, SkipForward } from "lucide-react"
import * as React from "react"

export type WorkflowStepStatus =
  | "waiting"
  | "running"
  | "completed"
  | "failed"
  | "skipped"
export interface WorkflowStep {
  id: string
  number: number
  title: string
  agentName: string
  inputSummary: string
  outputSummary: string
  status: WorkflowStepStatus
  duration?: string
  tokens?: number
}
export interface AgentSequentialWorkflowProps {
  workflowName?: string
  description?: string
  steps?: WorkflowStep[]
  currentStepId?: string
  totalDuration?: string
  totalTokens?: number
  isRunning?: boolean
  onStart?: () => void
  onPause?: () => void
  onRetryStep?: (stepId: string) => void
  onSkipStep?: (stepId: string) => void
  onReset?: () => void
  className?: string
}
const defaults: WorkflowStep[] = [
  {
    id: "research",
    number: 1,
    title: "Research",
    agentName: "Research worker",
    inputSummary: "Topic and source policy",
    outputSummary: "Twelve sources and a structured brief",
    status: "completed",
    duration: "1m 42s",
    tokens: 4820,
  },
  {
    id: "draft",
    number: 2,
    title: "Draft",
    agentName: "Writing worker",
    inputSummary: "Approved research brief",
    outputSummary: "First draft complete",
    status: "completed",
    duration: "2m 18s",
    tokens: 6140,
  },
  {
    id: "edit",
    number: 3,
    title: "Edit",
    agentName: "Review worker",
    inputSummary: "First draft",
    outputSummary: "",
    status: "running",
    tokens: 2300,
  },
  {
    id: "optimize",
    number: 4,
    title: "Optimize",
    agentName: "Search worker",
    inputSummary: "Edited draft",
    outputSummary: "",
    status: "waiting",
  },
  {
    id: "publish",
    number: 5,
    title: "Publish",
    agentName: "Publishing worker",
    inputSummary: "Approved article",
    outputSummary: "",
    status: "waiting",
  },
]
const text: Record<WorkflowStepStatus, string> = {
  waiting: "Waiting",
  running: "Running",
  completed: "Complete",
  failed: "Failed",
  skipped: "Skipped",
}
const tone: Record<WorkflowStepStatus, string> = {
  waiting: "text-text-secondary",
  running: "text-accent-600",
  completed: "text-green-600",
  failed: "text-red-600",
  skipped: "text-text-secondary",
}
export function SequentialWorkflow({
  workflowName = "Content publishing workflow",
  description = "Each completed step provides the input for the next step.",
  steps,
  currentStepId = "edit",
  totalDuration = "4m 00s",
  totalTokens = 13260,
  isRunning = true,
  onStart,
  onPause,
  onRetryStep,
  onSkipStep,
  onReset,
  className,
}: AgentSequentialWorkflowProps) {
  const items = steps?.length ? steps : defaults
  const [selected, setSelected] = React.useState(currentStepId)
  return (
    <section
      className={cn(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-text-secondary text-xs font-medium">
            Sequential workflow
          </p>
          <h2 className="text-text-primary mt-1 text-lg font-semibold">
            {workflowName}
          </h2>
          <p className="text-text-secondary mt-1 text-sm">{description}</p>
        </div>
        <div className="flex gap-2">
          {isRunning ? (
            <Button
              size="small"
              variant="secondary"
              leadingIcon={Pause}
              onClick={onPause}
            >
              Pause
            </Button>
          ) : (
            <Button size="small" leadingIcon={Play} onClick={onStart}>
              Start
            </Button>
          )}
          <Button
            size="small"
            variant="secondary"
            leadingIcon={RefreshCw}
            onClick={onReset}
          >
            Reset
          </Button>
        </div>
      </header>
      <ol>
        {items.map((step, index) => (
          <li
            key={step.id}
            className="border-separator-border border-b last:border-0"
          >
            <button
              type="button"
              className="focus-visible:ring-border-focus-ring grid w-full grid-cols-[2rem_1fr_auto] gap-3 px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset"
              aria-expanded={selected === step.id}
              onClick={() => setSelected(step.id)}
            >
              <span className="text-text-secondary text-xs tabular-nums">
                {String(step.number || index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="flex flex-wrap gap-x-3">
                  <strong className="text-text-primary text-sm font-medium">
                    {step.title}
                  </strong>
                  <span className="text-text-secondary text-xs">
                    {step.agentName}
                  </span>
                </span>
                <span className="text-text-secondary mt-1 block text-xs">
                  {step.inputSummary}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className={cn("text-xs", tone[step.status])}>
                  {text[step.status]}
                </span>
                <ChevronDown
                  className={cn(
                    "text-text-secondary size-3.5",
                    selected === step.id && "rotate-180"
                  )}
                />
              </span>
            </button>
            {selected === step.id && (
              <div className="bg-background-secondary-default grid gap-3 px-4 py-3 text-xs sm:grid-cols-2">
                <div>
                  <p className="text-text-primary font-medium">Input</p>
                  <p className="text-text-secondary mt-1">
                    {step.inputSummary}
                  </p>
                </div>
                <div>
                  <p className="text-text-primary font-medium">Output</p>
                  <p className="text-text-secondary mt-1">
                    {step.outputSummary ||
                      "Available when this step completes."}
                  </p>
                </div>
                <div className="text-text-secondary flex gap-3">
                  {step.duration && <span>{step.duration}</span>}
                  {step.tokens !== undefined && (
                    <span>{step.tokens.toLocaleString()} tokens</span>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  {step.status === "failed" && (
                    <Button
                      size="xs"
                      variant="secondary"
                      leadingIcon={RefreshCw}
                      onClick={() => onRetryStep?.(step.id)}
                    >
                      Retry
                    </Button>
                  )}
                  {(step.status === "waiting" || step.status === "running") && (
                    <Button
                      size="xs"
                      variant="secondary"
                      leadingIcon={SkipForward}
                      onClick={() => onSkipStep?.(step.id)}
                    >
                      Skip
                    </Button>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
      <footer className="text-text-secondary flex flex-wrap gap-3 px-4 py-3 text-xs">
        <span>
          {items.filter((item) => item.status === "completed").length} of{" "}
          {items.length} complete
        </span>
        <span>{totalDuration}</span>
        <span>{totalTokens.toLocaleString()} tokens</span>
      </footer>
    </section>
  )
}
