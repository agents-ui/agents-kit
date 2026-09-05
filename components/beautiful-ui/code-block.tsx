"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { Check, Copy } from "lucide-react"
import * as React from "react"

export type CodeBlockVariant = "code" | "diff"
export interface CodePiece {
  text: string
  change?: "add" | "del"
}
export interface CodeDiffRow {
  oldLine: number | null
  newLine: number | null
  type: "context" | "add" | "remove"
  pieces: CodePiece[]
}
export interface CodeBlockLabels {
  copy: string
  copied: string
}
export interface CodeBlockProps {
  code: string
  language?: string
  variant?: CodeBlockVariant
  filename?: string
  diff?: CodeDiffRow[]
  labels?: Partial<CodeBlockLabels>
  onCopy?: (code: string) => void
  className?: string
}

function inferredDiff(code: string): CodeDiffRow[] {
  let oldLine = 1
  let newLine = 1
  return code.split("\n").map((line) => {
    if (line.startsWith("+") && !line.startsWith("+++"))
      return {
        oldLine: null,
        newLine: newLine++,
        type: "add" as const,
        pieces: [{ text: line.slice(1), change: "add" as const }],
      }
    if (line.startsWith("-") && !line.startsWith("---"))
      return {
        oldLine: oldLine++,
        newLine: null,
        type: "remove" as const,
        pieces: [{ text: line.slice(1), change: "del" as const }],
      }
    const text = line.startsWith(" ") ? line.slice(1) : line
    return {
      oldLine: oldLine++,
      newLine: newLine++,
      type: "context" as const,
      pieces: [{ text }],
    }
  })
}

function Pieces({ pieces }: { pieces: CodePiece[] }) {
  return (
    <>
      {pieces.map((piece, index) => (
        <span
          key={index}
          className={cx(
            piece.change === "add" && "rounded-sm bg-green-500/15",
            piece.change === "del" && "rounded-sm bg-red-500/15"
          )}
        >
          {piece.text}
        </span>
      ))}
    </>
  )
}

export function CodeBlock({
  code,
  language = "text",
  variant = "code",
  filename,
  diff,
  labels,
  onCopy,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const text = { copy: "Copy", copied: "Copied", ...labels }
  const rows = React.useMemo(() => diff ?? inferredDiff(code), [code, diff])
  const additions = rows.filter((row) => row.type === "add").length
  const removals = rows.filter((row) => row.type === "remove").length
  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    onCopy?.(code)
    window.setTimeout(() => setCopied(false), 1500)
  }
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default w-full overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border text-text-secondary flex h-11 items-center gap-3 border-b px-4 text-xs">
        <span className="text-text-primary min-w-0 truncate font-mono">
          {filename ?? language}
        </span>
        {variant === "diff" ? (
          <span className="ml-auto flex gap-2 font-mono tabular-nums">
            <span className="text-green-700 dark:text-green-400">
              +{additions}
            </span>
            <span className="text-red-700 dark:text-red-400">-{removals}</span>
          </span>
        ) : (
          <Button
            className="ml-auto"
            variant="ghost"
            size="xs"
            leadingIcon={copied ? Check : Copy}
            onClick={copy}
          >
            {copied ? text.copied : text.copy}
          </Button>
        )}
      </header>
      <div className="max-h-96 overflow-auto py-3 font-mono text-[13px] leading-5">
        {variant === "diff"
          ? rows.map((row, index) => (
              <div
                key={index}
                data-change={row.type}
                data-old-line={row.oldLine ?? undefined}
                data-new-line={row.newLine ?? undefined}
                className={cx(
                  "grid grid-cols-[2rem_2rem_1.25rem_minmax(0,1fr)] px-2",
                  row.type === "add" && "bg-green-500/10",
                  row.type === "remove" && "bg-red-500/10"
                )}
              >
                <span className="text-text-tertiary text-right text-xs tabular-nums select-none">
                  {row.oldLine ?? ""}
                </span>
                <span className="text-text-tertiary text-right text-xs tabular-nums select-none">
                  {row.newLine ?? ""}
                </span>
                <span
                  className={cx(
                    "text-center select-none",
                    row.type === "add" && "text-green-700 dark:text-green-400",
                    row.type === "remove" && "text-red-700 dark:text-red-400"
                  )}
                >
                  {row.type === "add" ? "+" : row.type === "remove" ? "-" : ""}
                </span>
                <code className="min-w-0 pl-1 break-words whitespace-pre-wrap">
                  <Pieces pieces={row.pieces} />
                </code>
              </div>
            ))
          : code.split("\n").map((line, index) => (
              <div
                key={index}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] px-2"
              >
                <span className="border-separator-border text-text-tertiary border-r pr-2 text-right text-xs tabular-nums select-none">
                  {index + 1}
                </span>
                <code className="min-w-0 pl-3 break-words whitespace-pre-wrap">
                  {line || " "}
                </code>
              </div>
            ))}
      </div>
    </section>
  )
}
