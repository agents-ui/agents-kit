"use client"

import * as React from "react"
import { FileText, Upload, Download, RefreshCw, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, FileSpreadsheet, File, Copy, Highlighter, Table as TableIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  const [dragActive, setDragActive] = React.useState(false)

  const defaultDocument: DocumentInfo = document || {
    name: "sample-invoice.pdf",
    type: "pdf",
    size: 245000,
    pages: 3,
    uploadedAt: "2024-01-20T14:30:00Z"
  }

  const defaultSections: ExtractedSection[] = extractedSections.length > 0 ? extractedSections : [
    {
      id: "1",
      type: "metadata",
      title: "Document Information",
      content: {
        company: "Acme Corporation",
        invoiceNumber: "INV-2024-001",
        date: "January 20, 2024",
        dueDate: "February 20, 2024"
      },
      confidence: 0.98,
      page: 1
    },
    {
      id: "2",
      type: "table",
      title: "Invoice Items",
      content: [
        { item: "Professional Services", quantity: 40, rate: 150, amount: 6000 },
        { item: "Software License", quantity: 5, rate: 299, amount: 1495 },
        { item: "Support Package", quantity: 1, rate: 500, amount: 500 }
      ],
      confidence: 0.95,
      page: 1
    },
    {
      id: "3",
      type: "text",
      title: "Payment Terms",
      content: "Payment is due within 30 days. Late payments subject to 1.5% monthly interest. Please reference invoice number on all payments.",
      confidence: 0.92,
      page: 2
    },
    {
      id: "4",
      type: "text",
      title: "Total Amount",
      content: "$7,995.00",
      confidence: 0.99,
      page: 1
    }
  ]

  const displayDocument = document || defaultDocument
  const displaySections = extractedSections.length > 0 ? extractedSections : defaultSections

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload?.(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload?.(e.target.files[0])
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "csv":
      case "xlsx":
        return <FileSpreadsheet className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const renderSectionContent = (section: ExtractedSection) => {
    switch (section.type) {
      case "metadata":
        return (
          <div className="space-y-2">
            {Object.entries(section.content).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span className="text-sm font-medium">{value as string}</span>
              </div>
            ))}
          </div>
        )
      
      case "table":
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  {Object.keys(section.content[0]).map((key) => (
                    <th key={key} className="text-left p-2 capitalize">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.content.map((row: any, i: number) => (
                  <tr key={i} className="border-b">
                    {Object.values(row).map((value: any, j: number) => (
                      <td key={j} className="p-2">
                        {typeof value === "number" && j === Object.keys(row).length - 1
                          ? `$${value.toLocaleString()}`
                          : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      
      case "text":
        return (
          <p className="text-sm text-foreground">{section.content}</p>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-4 p-4", className)}>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <FileText className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span>Doc Scanner Agent</span>
        <span className="text-xs">{timestamp}</span>
      </div>

      <div className="space-y-4">
        {!displayDocument || !previewUrl ? (
          /* Upload Area */
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Drop your document here</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PDF, CSV, DOCX, XLSX, and TXT files up to 10MB
            </p>
            <Button variant="outline" onClick={() => window.document.getElementById("file-input")?.click()}>
              Choose File
            </Button>
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".pdf,.csv,.docx,.xlsx,.txt"
              onChange={handleFileInput}
            />
          </div>
        ) : (
          /* Document Viewer */
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Document Preview</TabsTrigger>
              <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="space-y-4">
              {/* Document Info */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(displayDocument.type)}
                  <div>
                    <p className="font-medium text-sm">{displayDocument.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(displayDocument.size)} • {displayDocument.pages} pages
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {displayDocument.type.toUpperCase()}
                </Badge>
              </div>
              
              {/* Preview Area */}
              <div className="border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center p-12 space-y-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-muted-foreground">Processing document...</p>
                    <Progress value={uploadProgress} className="w-48" />
                  </div>
                ) : (
                  <div className="relative">
                    {/* Document Preview (placeholder) */}
                    <div className="h-[400px] flex items-center justify-center bg-white dark:bg-gray-800">
                      <p className="text-muted-foreground">Document preview would appear here</p>
                    </div>
                    
                    {/* Preview Controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm px-4 py-1 bg-gray-50 dark:bg-gray-700 rounded min-w-[60px] text-center">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-6 bg-gray-300 mx-2" />
                      <Button variant="ghost" size="sm" onClick={onZoomOut} className="h-8 w-8">
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={onZoomIn} className="h-8 w-8">
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={onRotate} className="h-8 w-8">
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="extracted" className="space-y-4">
              {/* Extracted Sections */}
              <div className="space-y-3">
                {displaySections.map((section) => (
                  <div
                    key={section.id}
                    className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {section.type === "table" && <TableIcon className="h-3 w-3 mr-1" />}
                            {section.type}
                          </Badge>
                          <h4 className="font-medium text-sm">{section.title}</h4>
                          {section.page && (
                            <span className="text-xs text-muted-foreground">Page {section.page}</span>
                          )}
                        </div>
                        {section.confidence && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-muted-foreground">Confidence:</span>
                            <Progress value={section.confidence * 100} className="w-24 h-2" />
                            <span className="text-xs">{Math.round(section.confidence * 100)}%</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onCopySection?.(section.id)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy section</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onHighlightSection?.(section.id)}
                              >
                                <Highlighter className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Highlight in document</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                      {renderSectionContent(section)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Export Options */}
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onExport?.("json")}>
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport?.("csv")}>
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport?.("txt")}>
                      Export as Text
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Bottom Actions */}
      {showBottomActions && (
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            {displayDocument && (
              <Badge variant="secondary">
                {displaySections.length} sections extracted
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              😊
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              😔
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}