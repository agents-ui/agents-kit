"use client"

import type {
  AgentEvaluatorProps,
  EvalIteration,
} from "@/components/agents-ui/agent-evaluator"
import { Button } from "@/components/boardui/base/buttons/button"
import { Slider } from "@/components/boardui/base/slider/slider"
import { cx } from "@/components/boardui/utils/cx"
import { ChevronDown, Play, RotateCcw } from "lucide-react"
import * as React from "react"

const data0: EvalIteration[] = [
  {
    id: "1",
    number: 1,
    output: "Prepare a generic follow-up list.",
    score: 45,
    feedback: "The result does not prioritize renewal value.",
    criteria: [
      { label: "Evidence", score: 52, maxScore: 100 },
      { label: "Clarity", score: 43, maxScore: 100 },
    ],
    status: "failed",
  },
  {
    id: "2",
    number: 2,
    output: "Prioritize accounts using value and account health.",
    score: 72,
    feedback: "Add sponsor coverage and specify this week's actions.",
    criteria: [
      { label: "Evidence", score: 76, maxScore: 100 },
      { label: "Clarity", score: 68, maxScore: 100 },
    ],
    status: "failed",
  },
  {
    id: "3",
    number: 3,
    output: "Four accounts need executive outreach this week.",
    score: 91,
    feedback: "Specific, evidence-led, and actionable.",
    criteria: [
      { label: "Evidence", score: 94, maxScore: 100 },
      { label: "Clarity", score: 88, maxScore: 100 },
    ],
    status: "passed",
  },
]
export function Evaluator({
  taskDescription = "Evaluate the renewal briefing for evidence and clarity.",
  iterations = data0,
  currentIteration,
  qualityThreshold = 85,
  maxIterations = 5,
  isRunning = false,
  onRunNext,
  onAccept,
  onReset,
  onAdjustThreshold,
  className,
}: AgentEvaluatorProps) {
  const latest = iterations.at(-1)
  const [open, setOpen] = React.useState(latest?.id)
  const passed = !!latest && latest.score >= qualityThreshold
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-wrap justify-between gap-3 border-b p-5">
        <div>
          <h2 className="text-lg font-semibold">Evaluation results</h2>
          <p className="text-text-secondary mt-1 text-sm">{taskDescription}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            leadingIcon={RotateCcw}
            onClick={onReset}
          >
            Reset
          </Button>
          {passed ? (
            <Button size="small" onClick={onAccept}>
              Accept result
            </Button>
          ) : (
            <Button
              size="small"
              leadingIcon={Play}
              onClick={onRunNext}
              disabled={isRunning}
            >
              Run next
            </Button>
          )}
        </div>
      </header>
      {latest ? (
        <div className="border-separator-border grid gap-5 border-b p-5 lg:grid-cols-[220px_1fr]">
          <div>
            <p className="text-text-secondary text-xs">Latest score</p>
            <p className="mt-1 text-4xl font-semibold tabular-nums">
              {latest.score}
              <span className="text-text-secondary text-sm font-normal">
                {" "}
                / 100
              </span>
            </p>
            <Slider
              value={qualityThreshold}
              minValue={0}
              maxValue={100}
              showTooltip={false}
              label="Quality threshold"
              onChange={onAdjustThreshold}
              className="mt-4"
            />
          </div>
          <div>
            <p className="text-base font-medium">{latest.output}</p>
            <p className="text-text-secondary mt-2 text-sm leading-6">
              {latest.feedback}
            </p>
            {latest.criteria.map((c) => (
              <div key={c.label} className="mt-3">
                <div className="flex justify-between text-xs">
                  <span>{c.label}</span>
                  <span>
                    {c.score}/{c.maxScore}
                  </span>
                </div>
                <div className="bg-background-secondary-default mt-1 h-1">
                  <div
                    className="bg-accent-600 h-full"
                    style={{ width: `${(c.score / c.maxScore) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-text-secondary p-8 text-center text-sm">
          No evaluation results yet.
        </p>
      )}
      <div className="p-5">
        <h3 className="text-sm font-medium">Iteration history</h3>
        <div className="divide-separator-border border-separator-border mt-3 divide-y border-y">
          {iterations.map((x) => (
            <div key={x.id}>
              <button
                className="flex min-h-14 w-full items-center gap-3 text-left"
                aria-expanded={open === x.id}
                onClick={() => setOpen(open === x.id ? undefined : x.id)}
              >
                <span className="text-text-secondary w-20 text-xs">
                  Iteration {x.number}
                </span>
                <span className="flex-1 truncate text-sm">{x.output}</span>
                <span className="text-sm tabular-nums">{x.score}</span>
                <ChevronDown
                  className={cx("size-4", open === x.id && "rotate-180")}
                />
              </button>
              {open === x.id && (
                <div className="bg-background-secondary-default grid gap-4 p-4 lg:grid-cols-2">
                  <div>
                    <p className="text-text-secondary text-xs font-medium">
                      Generator output
                    </p>
                    <p className="mt-2 text-sm leading-6">{x.output}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs font-medium">
                      Evaluation criteria
                    </p>
                    <div className="mt-2 space-y-3">
                      {x.criteria.map((criterion) => {
                        const percentage = criterion.maxScore
                          ? (criterion.score / criterion.maxScore) * 100
                          : 0
                        return (
                          <div key={criterion.label}>
                            <div className="flex justify-between gap-3 text-xs">
                              <span>{criterion.label}</span>
                              <span className="tabular-nums">
                                {criterion.score}/{criterion.maxScore}
                              </span>
                            </div>
                            <div className="bg-background-primary-default mt-1 h-1 overflow-hidden rounded-full">
                              <div
                                className="bg-accent-600 h-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="border-separator-border border-t pt-3 lg:col-span-2">
                    <p className="text-text-secondary text-xs font-medium">
                      Evaluator feedback
                    </p>
                    <p className="text-text-secondary mt-2 text-sm leading-6">
                      {x.feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-text-secondary mt-4 text-xs">
          {iterations.length} iterations · Threshold {qualityThreshold} ·{" "}
          {currentIteration ?? latest?.number ?? 0} of {maxIterations}
        </p>
      </div>
    </section>
  )
}
