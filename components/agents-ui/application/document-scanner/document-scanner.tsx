"use client"

/* eslint-disable @next/next/no-img-element */
/* Extracted payloads are intentionally provider-defined. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/boardui/base/buttons/button"
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/components/boardui/base/tabs/tabs"
import { cx } from "@/components/boardui/utils/cx"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  File,
  FileSpreadsheet,
  FileText,
  Highlighter,
  RefreshCw,
  RotateCw,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { useId, useState } from "react"

export interface ExtractedSection {
  id: string
  type: "text" | "table" | "image" | "metadata"
  title: string
  content: any
  confidence?: number
  page?: number
}
export interface DocumentInfo {
  name: string
  type: "pdf" | "csv" | "docx" | "xlsx" | "txt"
  size: number
  pages?: number
  uploadedAt?: string
}
export interface AgentDocScannerProps {
  document?: DocumentInfo
  extractedSections?: ExtractedSection[]
  currentPage?: number
  totalPages?: number
  isProcessing?: boolean
  uploadProgress?: number
  previewUrl?: string
  onFileUpload?: (file: File) => void
  onExtract?: (sectionId: string) => void
  onExport?: (format?: "json" | "csv" | "txt") => void
  onPageChange?: (page: number) => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onRotate?: () => void
  onCopySection?: (sectionId: string) => void
  onHighlightSection?: (sectionId: string) => void
  showBottomActions?: boolean
  className?: string
  timestamp?: string
}
const size = (bytes: number) =>
  bytes < 1024
    ? `${bytes} B`
    : bytes < 1048576
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1048576).toFixed(1)} MB`
function DocumentIcon({
  type,
  className,
}: {
  type: DocumentInfo["type"]
  className?: string
}) {
  return type === "pdf" ? (
    <FileText className={className} />
  ) : type === "csv" || type === "xlsx" ? (
    <FileSpreadsheet className={className} />
  ) : (
    <File className={className} />
  )
}
function Content({ section }: { section: ExtractedSection }) {
  if (
    section.type === "metadata" &&
    section.content &&
    typeof section.content === "object"
  )
    return (
      <dl className="grid gap-2 sm:grid-cols-2">
        {Object.entries(section.content).map(([key, value]) => (
          <div
            key={key}
            className="bg-background-secondary-default flex justify-between gap-3 rounded-sm px-3 py-2"
          >
            <dt className="text-caption-1-regular text-text-secondary capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </dt>
            <dd className="text-caption-1-medium">{String(value)}</dd>
          </div>
        ))}
      </dl>
    )
  if (
    section.type === "table" &&
    Array.isArray(section.content) &&
    section.content.length > 0
  ) {
    const keys = Object.keys(section.content[0])
    return (
      <div className="border-separator-border overflow-x-auto rounded-lg border">
        <table className="text-body-2-regular w-full text-left">
          <thead className="bg-background-secondary-default">
            <tr>
              {keys.map((key) => (
                <th key={key} className="px-3 py-2 font-medium capitalize">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-separator-border divide-y">
            {section.content.map(
              (row: Record<string, unknown>, index: number) => (
                <tr key={index}>
                  {keys.map((key) => (
                    <td key={key} className="px-3 py-2">
                      {String(row[key] ?? "")}
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    )
  }
  return (
    <p className="text-body-2-regular leading-5 whitespace-pre-wrap">
      {String(section.content ?? "")}
    </p>
  )
}
export function AgentDocScanner({
  document,
  extractedSections = [],
  currentPage = 1,
  totalPages = 1,
  isProcessing = false,
  uploadProgress = 0,
  previewUrl,
  onFileUpload,
  onExtract,
  onExport,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onRotate,
  onCopySection,
  onHighlightSection,
  showBottomActions = true,
  className,
  timestamp = "2:34 PM",
}: AgentDocScannerProps) {
  const [dragging, setDragging] = useState(false)
  const inputId = useId()
  if (!document)
    return (
      <section
        className={cx(
          "border-separator-border bg-background-primary-default rounded-2xl border p-4",
          className
        )}
      >
        <label
          htmlFor={inputId}
          onDragEnter={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            const file = event.dataTransfer.files[0]
            if (file) onFileUpload?.(file)
          }}
          className={cx(
            "border-separator-border grid min-h-64 cursor-pointer place-items-center rounded-lg border border-dashed p-8 text-center",
            dragging &&
              "bg-background-secondary-default ring-border-focus-ring ring-2"
          )}
        >
          <div>
            <Upload className="text-text-secondary mx-auto size-6" />
            <h3 className="text-headline-semibold mt-3">Upload a document</h3>
            <p className="text-body-2-regular text-text-secondary mt-1">
              PDF, CSV, DOCX, XLSX, or TXT up to 10 MB
            </p>
            <span className="rounded-2lg border-border-button-default text-body-medium mt-4 inline-flex min-h-9 items-center border px-3">
              Choose file
            </span>
          </div>
          <input
            id={inputId}
            type="file"
            className="sr-only"
            accept=".pdf,.csv,.docx,.xlsx,.txt"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onFileUpload?.(file)
            }}
          />
        </label>
      </section>
    )
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-2xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <DocumentIcon
            type={document.type}
            className="text-text-secondary size-5"
          />
          <div className="min-w-0">
            <h3 className="text-headline-semibold truncate">{document.name}</h3>
            <p className="text-caption-1-regular text-text-secondary">
              {size(document.size)} | {document.pages ?? totalPages} pages |{" "}
              {timestamp}
            </p>
          </div>
        </div>
        <select
          aria-label="Export format"
          defaultValue=""
          onChange={(event) => {
            if (event.target.value)
              onExport?.(event.target.value as "json" | "csv" | "txt")
            event.target.value = ""
          }}
          className="rounded-2lg bg-background-tertiary-default text-body-medium focus:ring-border-button-active h-9 px-3 ring-2 ring-transparent outline-none"
        >
          <option value="" disabled>
            Export
          </option>
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
          <option value="txt">Text</option>
        </select>
      </header>
      {isProcessing && (
        <div className="bg-background-secondary-default h-0.5">
          <span
            className="bg-accent-600 block h-full"
            style={{ width: `${Math.max(4, Math.min(100, uploadProgress))}%` }}
          />
        </div>
      )}
      <Tabs defaultSelectedKey="preview">
        <TabList className="px-3">
          <Tab id="preview">Document</Tab>
          <Tab id="extracted">Extracted data</Tab>
        </TabList>
        <TabPanel id="preview">
          <div className="border-separator-border flex items-center gap-1 border-b px-3 py-2">
            <Button
              size="small"
              variant="ghost"
              iconOnly
              leadingIcon={ChevronLeft}
              aria-label="Previous page"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            />
            <span className="text-caption-1-regular text-text-secondary px-2 tabular-nums">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="small"
              variant="ghost"
              iconOnly
              leadingIcon={ChevronRight}
              aria-label="Next page"
              disabled={currentPage >= totalPages}
              onClick={() =>
                onPageChange?.(Math.min(totalPages, currentPage + 1))
              }
            />
            <span className="bg-separator-border mx-1 h-4 w-px" />
            <Button
              size="small"
              variant="ghost"
              iconOnly
              leadingIcon={ZoomOut}
              aria-label="Zoom out"
              onClick={onZoomOut}
            />
            <Button
              size="small"
              variant="ghost"
              iconOnly
              leadingIcon={ZoomIn}
              aria-label="Zoom in"
              onClick={onZoomIn}
            />
            <Button
              size="small"
              variant="ghost"
              iconOnly
              leadingIcon={RotateCw}
              aria-label="Rotate"
              onClick={onRotate}
            />
          </div>
          <div className="bg-background-secondary-default grid min-h-96 place-items-center p-4">
            {previewUrl ? (
              document.type === "pdf" ? (
                <iframe
                  src={previewUrl}
                  title={document.name}
                  className="h-[520px] w-full rounded-lg bg-white"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt={`Preview of ${document.name}`}
                  className="max-h-[520px] max-w-full rounded-lg object-contain"
                />
              )
            ) : (
              <div className="text-text-secondary text-center">
                <DocumentIcon type={document.type} className="mx-auto size-8" />
                <p className="text-body-2-regular mt-2">Preview unavailable</p>
              </div>
            )}
          </div>
        </TabPanel>
        <TabPanel id="extracted">
          <div className="divide-separator-border divide-y">
            {extractedSections.map((section) => (
              <article key={section.id} className="p-4">
                <header className="mb-3 flex items-center gap-2">
                  <h4 className="text-body-medium min-w-0 flex-1">
                    {section.title}
                  </h4>
                  {section.page && (
                    <span className="text-caption-1-regular text-text-secondary">
                      Page {section.page}
                    </span>
                  )}
                  {section.confidence !== undefined && (
                    <span className="text-caption-1-regular text-text-secondary tabular-nums">
                      {Math.round(section.confidence * 100)}%
                    </span>
                  )}
                  {onCopySection && (
                    <Button
                      size="small"
                      variant="ghost"
                      iconOnly
                      leadingIcon={Copy}
                      aria-label={`Copy ${section.title}`}
                      onClick={() => onCopySection(section.id)}
                    />
                  )}
                  {onHighlightSection && (
                    <Button
                      size="small"
                      variant="ghost"
                      iconOnly
                      leadingIcon={Highlighter}
                      aria-label={`Highlight ${section.title}`}
                      onClick={() => onHighlightSection(section.id)}
                    />
                  )}
                </header>
                <Content section={section} />
              </article>
            ))}
            {extractedSections.length === 0 && (
              <p className="text-body-2-regular text-text-secondary p-8 text-center">
                No extracted content yet.
              </p>
            )}
          </div>
        </TabPanel>
      </Tabs>
      {showBottomActions && (
        <footer className="border-separator-border flex items-center justify-between gap-2 border-t px-4 py-2.5">
          <p className="text-caption-1-regular text-text-secondary">
            {extractedSections.length} sections |{" "}
            {isProcessing ? "Processing" : "Ready"}
          </p>
          {onExtract && (
            <Button
              size="small"
              variant="secondary"
              leadingIcon={RefreshCw}
              onClick={() => onExtract(extractedSections[0]?.id ?? "document")}
            >
              Extract again
            </Button>
          )}
        </footer>
      )}
    </section>
  )
}
