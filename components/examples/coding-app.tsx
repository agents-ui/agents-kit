"use client"

import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ai-elements/file-tree"
import { Terminal } from "@/components/ai-elements/terminal"
import {
  TestResults,
  TestResultsHeader,
  TestResultsSummary,
} from "@/components/ai-elements/test-results"
import { CodeBlock } from "@/components/beautiful-ui/code-block"
import {
  PromptInput,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ArrowUp,
  Check,
  ChevronRight,
  GitBranch,
  Play,
  RotateCcw,
  Square,
  X,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
  checkWorkingFiles,
  codingFiles,
  workingCode,
  type PatchDecision,
} from "./coding-workflow"

export function CodingAppExample({
  appearance = "kit",
}: {
  appearance?: "basic" | "kit"
}) {
  const basic = appearance === "basic"
  const [selected, setSelected] = useState(0)
  const [decisions, setDecisions] = useState<PatchDecision[]>([
    "pending",
    "pending",
  ])
  const [panel, setPanel] = useState<"changes" | "file" | "checks">("changes")
  const [draft, setDraft] = useState("")
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<ReturnType<
    typeof checkWorkingFiles
  > | null>(null)
  const [notice, setNotice] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )
  const stop = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    setRunning(false)
  }
  const decide = (value: PatchDecision) => {
    stop()
    setDecisions((current) =>
      current.map((item, index) => (index === selected ? value : item))
    )
    setResults(null)
    setNotice(
      value === "accepted"
        ? "Patch applied to the working file. Run checks to verify it."
        : value === "rejected"
          ? "Patch rejected. The working file is unchanged."
          : "Decision reset. Review the proposed patch again."
    )
  }
  const run = () => {
    stop()
    setRunning(true)
    setPanel("checks")
    setResults(null)
    setNotice("")
    timer.current = setTimeout(() => {
      setResults(checkWorkingFiles(decisions))
      setRunning(false)
      timer.current = null
    }, 650)
  }
  const propose = (value: string) => {
    const text = value.trim().toLowerCase()
    if (!text) return
    const index = /limit|query|validat/.test(text)
      ? 0
      : /empty|accessib|screen reader/.test(text)
        ? 1
        : -1
    if (index === -1) {
      setNotice(
        "This local example supports query validation and empty-state changes. Choose a task below, or connect your coding agent for other requests."
      )
      return
    }
    stop()
    setSelected(index)
    setPanel("changes")
    setResults(null)
    setDecisions((current) =>
      current.map((item, i) => (i === index ? "pending" : item))
    )
    setDraft("")
    setNotice(
      `Proposed patch: ${codingFiles[index].task.toLowerCase()}. Review it before applying.`
    )
  }
  const file = codingFiles[selected]
  const decision = decisions[selected]
  const passed = results?.filter((result) => result.passed).length ?? 0
  const output = results
    ? [
        "Local fixture checks — no shell command was run",
        "",
        ...results.map(
          (result) =>
            `${result.passed ? "PASS" : "FAIL"} ${result.name}\n     ${result.path}`
        ),
        "",
        `${passed} passed · ${results.length - passed} failed`,
        ...(passed < 2
          ? ["Apply the remaining patches, then run checks again."]
          : ["Both accepted changes match the expected file snapshots."]),
      ].join("\n")
    : running
      ? "Checking the current working files…"
      : "Run checks to inspect the current working files."
  const diff =
    file.before
      .split("\n")
      .filter(Boolean)
      .map((line) => `-${line}`)
      .join("\n") +
    "\n" +
    file.after
      .split("\n")
      .filter(Boolean)
      .map((line) => `+${line}`)
      .join("\n")
  const tabs = [
    { id: "changes", label: "Changes" },
    { id: "file", label: "Working file" },
    { id: "checks", label: "Checks" },
  ] as const
  const selectFile = (index: number) => {
    setSelected(index)
    setPanel("changes")
    setNotice("")
  }

  return (
    <section
      data-app-example="coding"
      aria-label="Coding workspace example"
      className={cn(
        "text-foreground flex min-w-0 flex-col overflow-hidden border text-sm [&_button]:min-h-6",
        basic
          ? "bg-background rounded-md"
          : "bg-background rounded-[14px] shadow-sm"
      )}
    >
      <header className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2 text-[13px]">
          <span className="font-medium">Fieldwork</span>
          <ChevronRight className="text-muted-foreground size-3" aria-hidden />
          <span className="text-muted-foreground">Visit scheduling</span>
          <span className="text-muted-foreground ml-2 hidden rounded border px-1.5 py-0.5 text-[10px] sm:inline">
            Local workspace
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={run}
          disabled={running}
          className="h-8 gap-2 text-xs"
        >
          <Play className="size-3" aria-hidden />
          {running ? "Checking…" : "Run checks"}
        </Button>
      </header>
      <div className="grid min-w-0 md:h-[580px] md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="bg-muted/20 min-w-0 border-b px-3 py-4 md:overflow-y-auto md:border-r md:border-b-0">
          <div className="text-muted-foreground mb-5 flex items-center gap-2 px-1 text-xs">
            <GitBranch className="size-3.5" aria-hidden />
            fix/visit-scheduling
          </div>
          <p className="text-muted-foreground mb-2 px-1 text-[11px] font-medium">
            Files
          </p>
          {basic ? (
            <nav aria-label="Workspace files">
              {codingFiles.map((item, index) => (
                <button
                  type="button"
                  key={item.path}
                  onClick={() => selectFile(index)}
                  aria-pressed={selected === index}
                  className="hover:bg-muted block w-full rounded px-2 py-2 text-left text-xs"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          ) : (
            <FileTree
              defaultExpanded={new Set(["src", "routes", "components"])}
              selectedPath={file.path}
              onSelect={(path) => {
                const i = codingFiles.findIndex((item) => item.path === path)
                if (i >= 0) selectFile(i)
              }}
              className="border-0 bg-transparent text-xs [&_button]:font-normal"
            >
              <FileTreeFolder name="src" path="src">
                <FileTreeFolder name="routes" path="routes">
                  <FileTreeFile name="visits.ts" path={codingFiles[0].path} />
                </FileTreeFolder>
                <FileTreeFolder name="components" path="components">
                  <FileTreeFile
                    name="visit-card.tsx"
                    path={codingFiles[1].path}
                  />
                </FileTreeFolder>
              </FileTreeFolder>
            </FileTree>
          )}
          <div className="mt-7 border-t pt-4">
            <p className="text-muted-foreground mb-3 px-1 text-[11px] font-medium">
              Review queue
            </p>
            {codingFiles.map((item, index) => (
              <button
                key={item.path}
                onClick={() => selectFile(index)}
                className="hover:bg-muted mb-1 flex w-full items-start gap-2 rounded-md px-1 py-2 text-left text-xs"
                type="button"
              >
                <span className="mt-0.5 size-3 shrink-0" aria-hidden>
                  {decisions[index] === "accepted" ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : decisions[index] === "rejected" ? (
                    <X className="size-3" />
                  ) : (
                    <span className="border-muted-foreground/50 block size-2.5 rounded-full border" />
                  )}
                </span>
                <span>
                  {item.task}
                  <span className="text-muted-foreground mt-1 block text-[11px] capitalize">
                    {decisions[index]}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>
        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
            <div
              role="group"
              aria-label="Workspace view"
              className="flex flex-wrap gap-1"
            >
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  size="sm"
                  variant={panel === tab.id ? "secondary" : "ghost"}
                  aria-pressed={panel === tab.id}
                  onClick={() => setPanel(tab.id)}
                  className="h-8 rounded-md text-xs"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
            <span className="text-muted-foreground text-[11px]">
              {decisions.filter((item) => item === "accepted").length} of 2
              applied
            </span>
          </div>
          <div className="min-h-[320px] min-w-0 flex-1 overflow-auto p-4 md:min-h-0">
            {panel !== "checks" ? (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[13px] font-medium">{file.task}</h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {panel === "file"
                        ? "Current working copy"
                        : "Proposed change"}{" "}
                      · {decision}
                    </p>
                  </div>
                  {panel === "changes" && (
                    <div className="flex gap-2">
                      {decision === "pending" ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => decide("rejected")}
                            className="h-8 text-xs"
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => decide("accepted")}
                            className="h-8 gap-1.5 text-xs"
                          >
                            <Check className="size-3" aria-hidden />
                            Apply patch
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => decide("pending")}
                          className="h-8 gap-1.5 text-xs"
                        >
                          <RotateCcw className="size-3" aria-hidden />
                          Reset decision
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {basic ? (
                  <pre className="overflow-x-auto rounded border p-3 font-mono text-xs leading-6">
                    {panel === "changes"
                      ? diff
                      : workingCode(selected, decisions)}
                  </pre>
                ) : (
                  <CodeBlock
                    filename={file.path}
                    code={
                      panel === "changes"
                        ? diff
                        : workingCode(selected, decisions)
                    }
                    variant={panel === "changes" ? "diff" : "code"}
                    language={selected ? "tsx" : "typescript"}
                    className="rounded-lg shadow-none"
                  />
                )}
                {panel === "changes" && (
                  <p className="text-muted-foreground mt-4 text-xs leading-5">
                    Applying a patch updates the working copy. Checks read that
                    copy, so rejecting a required change leaves its check
                    failing.
                  </p>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-medium">
                    Working-copy checks
                  </h3>
                  {running && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        stop()
                        setNotice("Checks stopped. Run checks to try again.")
                      }}
                      className="h-8 gap-1.5 text-xs"
                    >
                      <Square className="size-3" aria-hidden />
                      Stop checks
                    </Button>
                  )}
                </div>
                {basic ? (
                  <pre className="overflow-auto rounded border p-4 text-xs leading-6 whitespace-pre-wrap">
                    {output}
                  </pre>
                ) : (
                  <Terminal output={output} className="rounded-lg text-xs" />
                )}
                {results &&
                  (basic ? (
                    <p role="status" className="text-xs">
                      {passed} passed · {2 - passed} failed
                    </p>
                  ) : (
                    <TestResults
                      summary={{
                        passed,
                        failed: 2 - passed,
                        skipped: 0,
                        total: 2,
                      }}
                    >
                      <TestResultsHeader>
                        <TestResultsSummary />
                      </TestResultsHeader>
                    </TestResults>
                  ))}
              </div>
            )}
            <p
              role="status"
              className="text-muted-foreground mt-4 text-xs leading-5"
            >
              {notice}
            </p>
          </div>
          <div className="border-t px-4 py-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {codingFiles.map((item, index) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() =>
                    propose(index ? "Improve empty state" : "Fix query limit")
                  }
                  className="text-muted-foreground decoration-border hover:text-foreground text-[11px] underline underline-offset-4"
                >
                  {item.task}
                </button>
              ))}
            </div>
            {basic ? (
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  propose(draft)
                }}
              >
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Follow-up request</span>
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Request a sample change…"
                    className="h-10 w-full rounded border bg-transparent px-3 text-base sm:text-sm"
                  />
                </label>
                <Button type="submit" size="sm">
                  Propose
                </Button>
              </form>
            ) : (
              <PromptInput
                value={draft}
                onValueChange={setDraft}
                onSubmit={() => propose(draft)}
                className="focus-within:ring-ring flex items-center gap-2 rounded-lg p-1 shadow-none focus-within:ring-2"
              >
                <PromptInputTextarea
                  aria-label="Follow-up request"
                  placeholder="Request a sample change…"
                  className="min-h-10 px-2 text-base sm:text-[13px]"
                />
                <Button
                  size="sm"
                  disabled={!draft.trim()}
                  onClick={() => propose(draft)}
                  aria-label="Propose change"
                  className="mr-1 size-8 shrink-0 p-0"
                >
                  <ArrowUp className="size-3.5" aria-hidden />
                </Button>
              </PromptInput>
            )}
            <p className="text-muted-foreground mt-2 text-[10px]">
              Local fixture · no commands run · connect your coding agent for
              other changes
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
