"use client"

import type {
  AgentArtifactProps,
  ArtifactType,
  ArtifactVersion,
} from "@/components/agents-ui/agent-artifact"
import { Button } from "@/components/boardui/base/buttons/button"
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/components/boardui/base/tabs/tabs"
import { cx } from "@/components/boardui/utils/cx"
import {
  BarChart3,
  Code2,
  Copy,
  Download,
  FileText,
  History,
  MoreHorizontal,
  Pencil,
  Share2,
  Table2,
} from "lucide-react"
import * as React from "react"

const defaultVersions: ArtifactVersion[] = [
  {
    id: "v1",
    label: "Version 1",
    timestamp: "10:02",
    content: "Region,Revenue,Deals\nNorth America,$1.24M,86\nEurope,$980K,72",
  },
  {
    id: "v2",
    label: "Version 2",
    timestamp: "10:14",
    content:
      "Region,Revenue,Deals,QoQ Growth\nNorth America,$1.24M,86,+12%\nEurope,$980K,72,+8%\nAPAC,$640K,54,+18%",
  },
]
const typeInfo: Record<ArtifactType, { label: string; icon: typeof FileText }> =
  {
    code: { label: "Code", icon: Code2 },
    table: { label: "Table", icon: Table2 },
    document: { label: "Document", icon: FileText },
    chart: { label: "Chart", icon: BarChart3 },
  }

function TablePreview({ content }: { content: string }) {
  const lines = content.trim().split("\n").filter(Boolean)
  return (
    <div className="border-separator-border overflow-auto rounded-lg border">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-background-secondary-default text-text-secondary text-xs">
          <tr>
            <th className="w-10 px-3 py-2.5 font-medium">#</th>
            {lines[0]?.split(",").map((cell) => (
              <th key={cell} className="px-3 py-2.5 font-medium">
                {cell.trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lines.slice(1).map((line, rowIndex) => (
            <tr key={rowIndex} className="border-separator-border border-t">
              <td className="text-text-secondary px-3 py-3 text-xs">
                {rowIndex + 1}
              </td>
              {line.split(",").map((cell, cellIndex) => (
                <td key={cellIndex} className="text-text-primary px-3 py-3">
                  {cell.trim()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
function DocumentPreview({ content }: { content: string }) {
  return (
    <div className="max-w-3xl space-y-2 text-sm leading-7">
      {content.split("\n").map((line, index) =>
        line.startsWith("# ") ? (
          <h2 key={index} className="pt-2 text-xl font-semibold">
            {line.slice(2)}
          </h2>
        ) : line.startsWith("## ") ? (
          <h3 key={index} className="pt-3 text-base font-semibold">
            {line.slice(3)}
          </h3>
        ) : line.startsWith("- ") ? (
          <p key={index} className="pl-4 before:mr-2 before:content-['•']">
            {line.slice(2)}
          </p>
        ) : line ? (
          <p key={index}>{line}</p>
        ) : (
          <div key={index} className="h-2" />
        )
      )}
    </div>
  )
}
function Preview({
  type,
  content,
  language,
}: {
  type: ArtifactType
  content: string
  language: string
}) {
  if (!content)
    return (
      <p className="text-text-secondary py-12 text-center text-sm">
        No artifact content yet.
      </p>
    )
  if (type === "table") return <TablePreview content={content} />
  if (type === "code")
    return (
      <pre className="bg-background-secondary-default max-h-[440px] overflow-auto rounded-lg p-4 font-mono text-xs leading-6">
        <code data-language={language}>{content}</code>
      </pre>
    )
  if (type === "chart")
    return (
      <div className="border-separator-border rounded-lg border p-4">
        <div className="text-text-secondary mb-3 flex items-center gap-2 text-xs">
          <BarChart3 className="size-4" />
          Chart data
        </div>
        <pre className="overflow-auto font-mono text-xs leading-6 whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    )
  return <DocumentPreview content={content} />
}

export function ArtifactOutput({
  title = "Generated artifact",
  artifactType = "table",
  content,
  language = "text",
  versions = defaultVersions,
  currentVersion = "v2",
  isGenerating = false,
  metadata = {},
  onCopy,
  onDownload,
  onEdit,
  onRegenerate,
  onShare,
  onVersionChange,
  className,
}: AgentArtifactProps) {
  const [versionId, setVersionId] = React.useState(currentVersion)
  const [historyOpen, setHistoryOpen] = React.useState(false)
  React.useEffect(() => {
    setVersionId(currentVersion)
  }, [currentVersion])
  React.useEffect(() => {
    if (
      !versions.some((version) => version.id === versionId) &&
      versions.length
    )
      setVersionId(versions.at(-1)!.id)
  }, [versions, versionId])
  const selectedVersion =
    versions.find((version) => version.id === versionId) ?? versions.at(-1)
  const resolvedContent =
    content !== undefined ? content : (selectedVersion?.content ?? "")
  const TypeIcon = typeInfo[artifactType].icon
  const chooseVersion = (id: string) => {
    setVersionId(id)
    onVersionChange?.(id)
  }
  const rawLabel = artifactType === "code" ? "Code" : "Raw"

  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <div className="flex min-w-0 gap-3">
          <TypeIcon className="text-text-secondary mt-0.5 size-5 shrink-0" />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold">{title}</h2>
            <p className="text-text-secondary mt-1 text-xs">
              {typeInfo[artifactType].label}
              {selectedVersion
                ? ` · ${selectedVersion.label} · ${selectedVersion.timestamp}`
                : " · Unversioned"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            leadingIcon={Share2}
            onClick={onShare}
          >
            Share
          </Button>
          <Button
            variant="secondary"
            size="small"
            leadingIcon={Download}
            onClick={onDownload}
          >
            Download
          </Button>
          <Button
            variant="ghost"
            size="small"
            iconOnly
            aria-label="Regenerate artifact"
            onClick={onRegenerate}
          >
            <MoreHorizontal />
          </Button>
        </div>
      </header>
      {isGenerating && (
        <div className="border-separator-border text-text-secondary border-b px-4 py-2 text-xs">
          Generating new version
        </div>
      )}
      <div
        className={cx(
          "grid",
          historyOpen && "lg:grid-cols-[minmax(0,1fr)_220px]"
        )}
      >
        <Tabs defaultSelectedKey="preview" className="min-w-0">
          <TabList className="px-4">
            <Tab id="preview">Preview</Tab>
            <Tab id="code">{rawLabel}</Tab>
            <Tab id="details">Details</Tab>
          </TabList>
          <TabPanel id="preview" className="p-5">
            <Preview
              type={artifactType}
              content={resolvedContent}
              language={language}
            />
          </TabPanel>
          <TabPanel id="code" className="p-5">
            <pre className="bg-background-secondary-default max-h-[440px] overflow-auto rounded-lg p-4 font-mono text-xs leading-6 whitespace-pre-wrap">
              {resolvedContent || "No artifact content yet."}
            </pre>
          </TabPanel>
          <TabPanel id="details" className="p-5">
            <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-sm">
              <dt className="text-text-secondary">Type</dt>
              <dd>{typeInfo[artifactType].label}</dd>
              <dt className="text-text-secondary">Language</dt>
              <dd>{language}</dd>
              {metadata.model && (
                <>
                  <dt className="text-text-secondary">Generated by</dt>
                  <dd>{metadata.model}</dd>
                </>
              )}
              {metadata.generationTime && (
                <>
                  <dt className="text-text-secondary">Generation time</dt>
                  <dd>{metadata.generationTime}</dd>
                </>
              )}
              {metadata.tokens !== undefined && (
                <>
                  <dt className="text-text-secondary">Tokens</dt>
                  <dd>{metadata.tokens.toLocaleString()}</dd>
                </>
              )}
              {metadata.size && (
                <>
                  <dt className="text-text-secondary">Size</dt>
                  <dd>{metadata.size}</dd>
                </>
              )}
            </dl>
          </TabPanel>
        </Tabs>
        {historyOpen && (
          <aside className="border-separator-border border-t p-4 lg:border-t-0 lg:border-l">
            <h3 className="text-sm font-medium">Version history</h3>
            <div className="divide-separator-border border-separator-border mt-3 divide-y border-y">
              {versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => chooseVersion(version.id)}
                  className={cx(
                    "flex min-h-12 w-full items-center justify-between gap-3 px-2 text-left text-sm",
                    version.id === versionId &&
                      "bg-background-secondary-default"
                  )}
                >
                  <span>{version.label}</span>
                  <span className="text-text-secondary text-xs">
                    {version.timestamp}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        )}
      </div>
      <footer className="border-separator-border flex flex-wrap items-center justify-between gap-3 border-t p-4">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="small"
            leadingIcon={Copy}
            onClick={onCopy}
          >
            Copy
          </Button>
          <Button
            variant="ghost"
            size="small"
            leadingIcon={Pencil}
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="small"
            leadingIcon={History}
            onClick={() => setHistoryOpen((open) => !open)}
          >
            Versions
          </Button>
        </div>
        <span className="text-text-secondary text-xs">
          {metadata.size ?? typeInfo[artifactType].label}
          {metadata.model ? ` · ${metadata.model}` : ""}
          {metadata.generationTime ? ` · ${metadata.generationTime}` : ""}
        </span>
      </footer>
    </section>
  )
}
