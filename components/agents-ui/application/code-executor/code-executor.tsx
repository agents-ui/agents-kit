"use client"

import type {
  AgentCodeExecutorProps,
  CodeExecutionHistoryItem,
  CodeExecutionOutput,
} from "@/components/agents-ui/agent-code-executor"
import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import {
  ChevronDown,
  ClipboardCopy,
  Code2,
  History,
  Pencil,
  Play,
  Square,
  Trash2,
} from "lucide-react"
import * as React from "react"

const sampleCode = `import pandas as pd

renewals = pd.read_csv("renewals_q3.csv")
at_risk = renewals.query("risk_score >= 0.7")
print(at_risk.groupby("owner")["renewal_value"].sum())`

const sampleOutput: CodeExecutionOutput = {
  stdout: "Morgan Lee     520000\nJordan Kim     410000\nPriya Shah     360000",
  exitCode: 0,
  executionTime: "1.24s",
  memoryUsage: "48.2 MB",
}

const sampleHistory: CodeExecutionHistoryItem[] = [
  {
    id: "run-2",
    code: 'at_risk = renewals.query("risk_score >= 0.7")\nprint(len(at_risk))',
    output: {
      stdout: "12",
      exitCode: 0,
      executionTime: "0.38s",
      memoryUsage: "24.1 MB",
    },
    timestamp: "2 min ago",
    status: "success",
  },
  {
    id: "run-1",
    code: 'renewals = pd.read_csv("renewals_q3.csv")\nprint(renewals.columns)',
    output: {
      stderr: "FileNotFoundError: renewals_q3.csv",
      exitCode: 1,
      executionTime: "0.09s",
      memoryUsage: "21.8 MB",
    },
    timestamp: "5 min ago",
    status: "error",
  },
]

function ExecutionHistory({
  records,
}: {
  records: CodeExecutionHistoryItem[]
}) {
  if (records.length === 0) return null
  return (
    <details className="group border-separator-border border-t">
      <summary className="text-text-primary focus-visible:ring-border-focus-ring flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-inset">
        <History className="text-text-secondary size-4" />
        Previous runs
        <span className="text-text-secondary">{records.length}</span>
        <ChevronDown className="text-text-secondary ml-auto size-4 transition-transform group-open:rotate-180" />
      </summary>
      <ol className="divide-separator-border border-separator-border divide-y border-t">
        {records.map((record, index) => (
          <li key={record.id}>
            <details className="group/run">
              <summary className="focus-visible:ring-border-focus-ring grid cursor-pointer list-none gap-1 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-inset sm:grid-cols-[2rem_1fr_auto_auto] sm:items-center sm:gap-3">
                <span className="text-text-secondary text-xs tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <code className="text-text-primary min-w-0 truncate font-mono text-xs">
                  {record.code.split("\n")[0]}
                </code>
                <span
                  className={cx(
                    "text-xs",
                    record.status === "success"
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  )}
                >
                  {record.status === "success" ? "Succeeded" : "Failed"}
                </span>
                <time className="text-text-secondary text-xs tabular-nums">
                  {record.timestamp}
                </time>
              </summary>
              <div className="bg-background-secondary-default grid gap-3 px-4 py-3 lg:grid-cols-2">
                <div>
                  <p className="text-text-secondary mb-2 text-xs font-medium">
                    Code
                  </p>
                  <pre className="text-text-primary overflow-auto font-mono text-xs leading-5 whitespace-pre-wrap">
                    {record.code}
                  </pre>
                </div>
                <div>
                  <p className="text-text-secondary mb-2 text-xs font-medium">
                    Output
                  </p>
                  {record.output.stdout && (
                    <pre className="text-text-primary overflow-auto font-mono text-xs leading-5 whitespace-pre-wrap">
                      {record.output.stdout}
                    </pre>
                  )}
                  {record.output.stderr && (
                    <pre className="overflow-auto border-l-2 border-red-500 pl-3 font-mono text-xs leading-5 whitespace-pre-wrap text-red-700 dark:text-red-400">
                      {record.output.stderr}
                    </pre>
                  )}
                  {!record.output.stdout && !record.output.stderr && (
                    <p className="text-text-secondary text-xs">
                      No output returned.
                    </p>
                  )}
                </div>
                <div className="border-separator-border text-text-secondary flex flex-wrap gap-x-4 gap-y-1 border-t pt-3 text-xs tabular-nums lg:col-span-2">
                  <span>Run {record.id}</span>
                  <span>Exit {record.output.exitCode}</span>
                  <span>
                    {record.output.executionTime ?? "Runtime unavailable"}
                  </span>
                  <span>
                    {record.output.memoryUsage ?? "Memory unavailable"}
                  </span>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </details>
  )
}

export function CodeExecutor({
  sandboxName = "renewal-analysis",
  language = "Python",
  code = sampleCode,
  output = sampleOutput,
  executionHistory = sampleHistory,
  isExecuting = false,
  sandboxLevel = "sandboxed",
  onRun,
  onStop,
  onClear,
  onCopyCode,
  onEditCode,
  className,
}: AgentCodeExecutorProps) {
  const [editing, setEditing] = React.useState(false)
  const toggleEditing = () => {
    const next = !editing
    setEditing(next)
    onEditCode?.(next)
  }

  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Code2 className="text-text-secondary size-4" />
            Code execution
          </h2>
          <p className="text-text-secondary mt-1 text-xs">
            {sandboxName} · {language} · {sandboxLevel}
          </p>
        </div>
        <div className="flex gap-2">
          {isExecuting ? (
            <Button
              variant="danger"
              size="small"
              leadingIcon={Square}
              onClick={onStop}
            >
              Stop
            </Button>
          ) : (
            <Button size="small" leadingIcon={Play} onClick={onRun}>
              Run code
            </Button>
          )}
          <Button
            variant="secondary"
            size="small"
            leadingIcon={Pencil}
            onClick={toggleEditing}
          >
            {editing ? "Finish editing" : "Edit"}
          </Button>
        </div>
      </header>
      <div className="grid lg:grid-cols-2">
        <div className="border-separator-border border-b lg:border-r lg:border-b-0">
          <div className="bg-background-secondary-default text-text-secondary flex h-11 items-center justify-between px-3 text-xs">
            Code
            <Button
              variant="ghost"
              size="xs"
              iconOnly
              leadingIcon={ClipboardCopy}
              onClick={onCopyCode}
              aria-label="Copy code"
            />
          </div>
          <pre
            contentEditable={editing}
            suppressContentEditableWarning
            className="min-h-80 overflow-auto p-4 font-mono text-xs leading-6 whitespace-pre outline-none"
          >
            {code}
          </pre>
        </div>
        <div>
          <div className="bg-background-secondary-default text-text-secondary flex h-11 items-center justify-between px-3 text-xs">
            Output
            <span
              className={
                output.exitCode === 0
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }
            >
              {isExecuting ? "Running" : `Exit ${output.exitCode}`}
            </span>
          </div>
          <div className="min-h-80 overflow-auto p-4 font-mono text-xs leading-6">
            {output.stdout && (
              <pre className="whitespace-pre-wrap">{output.stdout}</pre>
            )}
            {output.stderr && (
              <pre className="mt-3 border-l-2 border-red-500 pl-3 whitespace-pre-wrap text-red-700 dark:text-red-400">
                {output.stderr}
              </pre>
            )}
          </div>
        </div>
      </div>
      <ExecutionHistory records={executionHistory} />
      <footer className="border-separator-border flex items-center justify-between border-t p-4">
        <span className="text-text-secondary text-xs">
          {output.executionTime ?? "Runtime unavailable"} ·{" "}
          {output.memoryUsage ?? "Memory unavailable"}
        </span>
        <Button
          variant="ghost"
          size="xs"
          iconOnly
          leadingIcon={Trash2}
          onClick={onClear}
          aria-label="Clear output"
        />
      </footer>
    </section>
  )
}
