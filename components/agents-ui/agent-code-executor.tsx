"use client"

import * as React from "react"
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  ClipboardCopy,
  Code2,
  Cpu,
  Loader2,
  Pencil,
  Play,
  ShieldCheck,
  ShieldAlert,
  Square,
  Terminal,
  Timer,
  Trash2,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

const defaultCode = `import pandas as pd

df = pd.read_csv("sales_q4.csv")
summary = df.groupby("region").agg(
    total_revenue=("revenue", "sum"),
    avg_deal_size=("revenue", "mean"),
    num_deals=("revenue", "count"),
)
summary["avg_deal_size"] = summary["avg_deal_size"].round(2)
print(summary.to_markdown(tablefmt="grid"))`

const defaultOutput: CodeExecutionOutput = {
  stdout: `+-----------+-----------------+-----------------+------------+
| region    |   total_revenue |   avg_deal_size |   num_deals|
+===========+=================+=================+============+
| APAC      |          384200 |         12806.7 |         30 |
| EMEA      |          521800 |         14938.6 |         35 |
| NA        |          697500 |         15500.0 |         45 |
+-----------+-----------------+-----------------+------------+`,
  stderr: "",
  exitCode: 0,
  executionTime: "1.24s",
  memoryUsage: "48.2 MB",
}

const defaultHistory: CodeExecutionHistoryItem[] = [
  {
    id: "hist-1",
    code: 'df = pd.read_csv("sales_q4.csv")\nprint(df.shape)',
    output: { stdout: "(110, 8)", stderr: "", exitCode: 0, executionTime: "0.38s", memoryUsage: "22.1 MB" },
    timestamp: "2 min ago",
    status: "success",
  },
  {
    id: "hist-2",
    code: 'print(df.columns.tolist())',
    output: { stdout: "['region', 'rep', 'revenue', 'date', 'product', 'channel', 'status', 'quarter']", stderr: "", exitCode: 0, executionTime: "0.05s", memoryUsage: "22.1 MB" },
    timestamp: "3 min ago",
    status: "success",
  },
]

export function AgentCodeExecutor({
  sandboxName = "python-sandbox-01",
  language = "Python",
  code,
  output,
  executionHistory,
  isExecuting = false,
  sandboxLevel = "sandboxed",
  onRun,
  onStop,
  onClear,
  onCopyCode,
  onEditCode,
  className,
}: AgentCodeExecutorProps) {
  const displayCode = code ?? defaultCode
  const displayOutput = output ?? defaultOutput
  const displayHistory = executionHistory ?? defaultHistory

  const [isEditable, setIsEditable] = React.useState(false)
  const [historyOpen, setHistoryOpen] = React.useState(false)

  const codeLines = React.useMemo(() => displayCode.split("\n"), [displayCode])

  const handleToggleEdit = () => {
    const next = !isEditable
    setIsEditable(next)
    onEditCode?.(next)
  }

  const isSandboxed = sandboxLevel === "sandboxed"
  const isSuccess = displayOutput.exitCode === 0

  const outputLines = React.useMemo(() => {
    const lines: { text: string; type: "stdout" | "stderr" | "prompt" }[] = []
    if (displayOutput.stdout) {
      displayOutput.stdout.split("\n").forEach((l) => lines.push({ text: l, type: "stdout" }))
    }
    if (displayOutput.stderr) {
      displayOutput.stderr.split("\n").forEach((l) => lines.push({ text: l, type: "stderr" }))
    }
    lines.push({
      text: `$ Process exited with code ${displayOutput.exitCode}`,
      type: "prompt",
    })
    return lines
  }, [displayOutput])

  const langBinary = React.useMemo(() => {
    const map: Record<string, string> = {
      Python: "python3",
      JavaScript: "node",
      TypeScript: "ts-node",
      Go: "go run",
      Rust: "cargo run",
      Java: "java",
      Ruby: "ruby",
      Shell: "bash",
    }
    return map[language] ?? language.toLowerCase()
  }, [language])

  return (
    <TooltipProvider>
      <div className={cn("w-full", className)}>
        {/* ═══════════ TERMINAL WINDOW ═══════════ */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 overflow-hidden">

          {/* ─── Title bar ─── */}
          <div className="flex items-center justify-between bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 select-none">
            {/* Traffic lights */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
                <span className="h-3 w-3 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.4)]" />
                <span className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
              </div>
              <div className="ml-3 flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-xs font-medium text-zinc-400">
                  Terminal — {langBinary}
                </span>
                <span className="text-zinc-600 text-xs">—</span>
                <span className="text-xs text-zinc-500 truncate max-w-[180px]">{sandboxName}</span>
              </div>
            </div>

            {/* Title bar right: sandbox badge + status */}
            <div className="flex items-center gap-2">
              {isExecuting && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  <Loader2 className="h-3 w-3 text-amber-400 animate-spin" />
                  <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Running</span>
                </div>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      isSandboxed
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                        : "bg-red-500/15 text-red-400 border border-red-500/25"
                    )}
                  >
                    {isSandboxed ? (
                      <ShieldCheck className="h-3 w-3" />
                    ) : (
                      <ShieldAlert className="h-3 w-3" />
                    )}
                    {isSandboxed ? "Sandboxed" : "Unrestricted"}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {isSandboxed
                    ? "Code runs in an isolated sandbox"
                    : "Code runs without sandbox restrictions"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* ─── Toolbar ─── */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/60 border-b border-zinc-800/60">
            <button
              onClick={onRun}
              disabled={isExecuting}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all",
                isExecuting
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-900/40 active:scale-95"
              )}
            >
              <Play className="h-3 w-3" />
              Run
            </button>
            <button
              onClick={onStop}
              disabled={!isExecuting}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all",
                !isExecuting
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-500 shadow-sm shadow-red-900/40 active:scale-95"
              )}
            >
              <Square className="h-3 w-3" />
              Stop
            </button>
            <div className="w-px h-4 bg-zinc-700 mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onCopyCode}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  <ClipboardCopy className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Copy code</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleToggleEdit}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                    isEditable
                      ? "text-blue-400 bg-blue-500/15"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                  )}
                >
                  <Pencil className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{isEditable ? "Editing mode" : "Edit code"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onClear}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Clear output</TooltipContent>
            </Tooltip>

            {/* Spacer */}
            <div className="flex-1" />

            {/* History toggle */}
            {displayHistory.length > 0 && (
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors font-mono"
              >
                <span className="text-zinc-500">history</span>
                <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px] px-1.5 py-0">
                  {displayHistory.length}
                </Badge>
                {historyOpen ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            )}
          </div>

          {/* ─── History dropdown ─── */}
          {historyOpen && displayHistory.length > 0 && (
            <div className="border-b border-zinc-800 bg-zinc-900/40">
              <div className="px-4 py-2 border-b border-zinc-800/50">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Command History
                </span>
              </div>
              <ScrollArea className="max-h-[140px]">
                <div className="py-1">
                  {displayHistory.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 px-4 py-2 hover:bg-zinc-800/40 transition-colors group"
                    >
                      <span className="text-[11px] font-mono text-zinc-600 w-5 text-right shrink-0 pt-0.5">
                        {displayHistory.length - idx}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {item.status === "success" ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-400 shrink-0" />
                          )}
                          <pre className="text-xs font-mono text-zinc-300 truncate">
                            {item.code.split("\n")[0]}
                          </pre>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-zinc-600 font-mono pl-5">
                          <span>{item.timestamp}</span>
                          <Circle className="h-1 w-1 fill-current" />
                          <span>{item.output.executionTime}</span>
                          {item.output.stdout && (
                            <>
                              <Circle className="h-1 w-1 fill-current" />
                              <span className="truncate max-w-[240px] text-zinc-500">
                                {item.output.stdout.split("\n")[0]}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* ─── Code pane ─── */}
          <div className="relative">
            {/* Language tab */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-900/30 border-b border-zinc-800/40">
              <div className="flex items-center gap-2">
                <Code2 className="h-3 w-3 text-zinc-600" />
                <span className="text-[11px] font-mono text-zinc-500">{language.toLowerCase()}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600">
                {codeLines.length} line{codeLines.length !== 1 ? "s" : ""}
              </span>
            </div>

            <ScrollArea className="max-h-[300px]">
              <pre className="text-sm leading-6">
                {codeLines.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex",
                      isExecuting && i === codeLines.length - 1 && "bg-zinc-900/80"
                    )}
                  >
                    {/* Line gutter */}
                    <span
                      className={cn(
                        "sticky left-0 inline-flex items-center justify-end w-12 pr-4 text-right text-xs font-mono select-none shrink-0 border-r",
                        "bg-zinc-900 text-zinc-600 border-zinc-800"
                      )}
                    >
                      {i + 1}
                    </span>
                    {/* Code content */}
                    <code className="font-mono text-emerald-400 whitespace-pre pl-4 pr-4 flex-1">
                      {line}
                      {/* Blinking cursor on last line when executing */}
                      {isExecuting && i === codeLines.length - 1 && (
                        <span className="inline-block w-2 h-4 bg-emerald-400 ml-0.5 align-middle animate-pulse" />
                      )}
                    </code>
                  </div>
                ))}
              </pre>
            </ScrollArea>
          </div>

          {/* ─── Pane divider ─── */}
          <div className="relative flex items-center justify-center h-2 bg-zinc-900 border-y border-zinc-800 cursor-row-resize group">
            <div className="flex gap-0.5">
              <span className="w-6 h-0.5 rounded-full bg-zinc-700 group-hover:bg-zinc-500 transition-colors" />
            </div>
          </div>

          {/* ─── Output pane ─── */}
          <div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900/30 border-b border-zinc-800/40">
              <Terminal className="h-3 w-3 text-zinc-600" />
              <span className="text-[11px] font-mono text-zinc-500">output</span>
              {!isExecuting && (
                <Badge
                  className={cn(
                    "text-[9px] px-1.5 py-0 font-mono",
                    isSuccess
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                      : "bg-red-500/15 text-red-400 border-red-500/25"
                  )}
                >
                  exit {displayOutput.exitCode}
                </Badge>
              )}
            </div>

            <ScrollArea className="max-h-[220px]">
              <div className="p-4 font-mono text-sm leading-6">
                {isExecuting ? (
                  <div className="flex items-center gap-2 text-amber-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="text-xs">Executing...</span>
                    <span className="inline-block w-1.5 h-4 bg-amber-400 animate-pulse" />
                  </div>
                ) : (
                  <>
                    {outputLines.map((line, i) => (
                      <div key={i}>
                        {line.type === "stdout" && (
                          <span className="text-zinc-100 whitespace-pre">{line.text}</span>
                        )}
                        {line.type === "stderr" && (
                          <span className="text-red-400 whitespace-pre">{line.text}</span>
                        )}
                        {line.type === "prompt" && (
                          <div className="mt-2 pt-2 border-t border-zinc-800/50">
                            <span
                              className={cn(
                                "whitespace-pre",
                                isSuccess ? "text-emerald-400" : "text-red-400"
                              )}
                            >
                              {line.text}
                            </span>
                            {isSuccess && (
                              <CheckCircle2 className="inline h-3 w-3 ml-2 text-emerald-500" />
                            )}
                            {!isSuccess && (
                              <XCircle className="inline h-3 w-3 ml-2 text-red-400" />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* ─── Status bar (VS Code style) ─── */}
          <div className="flex items-center justify-between px-3 py-1 bg-blue-600 text-white text-[11px] font-medium select-none">
            <div className="flex items-center gap-3">
              {/* Language indicator */}
              <div className="flex items-center gap-1.5">
                <Code2 className="h-3 w-3" />
                <span>{language}</span>
              </div>
              {/* Sandbox level */}
              <div className="flex items-center gap-1">
                {isSandboxed ? (
                  <ShieldCheck className="h-3 w-3" />
                ) : (
                  <ShieldAlert className="h-3 w-3" />
                )}
                <span>{isSandboxed ? "Sandboxed" : "Unrestricted"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Execution time */}
              <div className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                <span>{displayOutput.executionTime ?? "--"}</span>
              </div>
              {/* Memory usage */}
              <div className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                <span>{displayOutput.memoryUsage ?? "--"}</span>
              </div>
              {/* Lines */}
              <span>Ln {codeLines.length}</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentCodeExecutor.displayName = "AgentCodeExecutor"
