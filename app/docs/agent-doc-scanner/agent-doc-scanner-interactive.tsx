"use client"

import * as React from "react"
import { AgentDocScanner, DocumentInfo, ExtractedSection } from "@/components/agents-ui/agent-doc-scanner"

export default function AgentDocScannerInteractive() {
  const [documentInfo, setDocumentInfo] = React.useState<DocumentInfo | undefined>()
  const [extractedSections, setExtractedSections] = React.useState<ExtractedSection[]>([])
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [previewUrl, setPreviewUrl] = React.useState<string>()

  const handleFileUpload = (file: File) => {
    setIsProcessing(true)
    setUploadProgress(0)
    
    // Simulate file upload and processing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
    
    setTimeout(() => {
      // Set document info
      const fileType = file.name.split('.').pop()?.toLowerCase() || "pdf"
      setDocumentInfo({
        name: file.name,
        type: fileType as any,
        size: file.size,
        pages: fileType === "pdf" ? Math.floor(Math.random() * 10) + 1 : 1,
        uploadedAt: new Date().toISOString()
      })
      
      setPreviewUrl("/document-preview")
      
      // Simulate AI extraction based on file type
      if (file.name.includes("invoice")) {
        setExtractedSections([
          {
            id: "1",
            type: "metadata",
            title: "Invoice Details",
            content: {
              invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
              date: new Date().toLocaleDateString(),
              vendor: "Tech Solutions Inc.",
              customer: "Acme Corporation"
            },
            confidence: 0.96,
            page: 1
          },
          {
            id: "2",
            type: "table",
            title: "Line Items",
            content: [
              { description: "Software Development", hours: 120, rate: 150, total: 18000 },
              { description: "UI/UX Design", hours: 40, rate: 120, total: 4800 },
              { description: "Project Management", hours: 20, rate: 100, total: 2000 }
            ],
            confidence: 0.94,
            page: 1
          },
          {
            id: "3",
            type: "text",
            title: "Total Amount Due",
            content: "$24,800.00",
            confidence: 0.99,
            page: 1
          }
        ])
      } else if (file.name.includes("contract")) {
        setExtractedSections([
          {
            id: "1",
            type: "metadata",
            title: "Contract Information",
            content: {
              contractNumber: `CTR-${Date.now().toString().slice(-6)}`,
              effectiveDate: new Date().toLocaleDateString(),
              parties: "Party A and Party B",
              term: "12 months"
            },
            confidence: 0.95,
            page: 1
          },
          {
            id: "2",
            type: "text",
            title: "Key Terms",
            content: "This agreement shall commence on the effective date and continue for a period of twelve (12) months, unless terminated earlier in accordance with the provisions herein.",
            confidence: 0.93,
            page: 2
          },
          {
            id: "3",
            type: "text",
            title: "Payment Terms",
            content: "Payment shall be made within thirty (30) days of invoice receipt. Late payments subject to 1.5% monthly interest.",
            confidence: 0.97,
            page: 3
          }
        ])
      } else {
        // Generic extraction
        setExtractedSections([
          {
            id: "1",
            type: "metadata",
            title: "Document Summary",
            content: {
              fileName: file.name,
              fileSize: `${(file.size / 1024).toFixed(1)} KB`,
              type: file.type,
              lastModified: new Date(file.lastModified).toLocaleDateString()
            },
            confidence: 1,
            page: 1
          },
          {
            id: "2",
            type: "text",
            title: "Extracted Content",
            content: "This document contains important information that has been successfully extracted and analyzed by the AI processor.",
            confidence: 0.88,
            page: 1
          }
        ])
      }
      
      setIsProcessing(false)
    }, 2500)
  }

  const handleExport = (format?: "json" | "csv" | "txt") => {
    console.log(`Exporting data as ${format}`)
    // In a real app, this would trigger the actual export
    
    // Simple example of data export
    const data = {
      document: documentInfo,
      extractedData: extractedSections
    }
    
    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `extracted-data.${format}`
      a.click()
    }
  }

  const handleCopySection = (sectionId: string) => {
    const section = extractedSections.find(s => s.id === sectionId)
    if (section) {
      let textToCopy = `${section.title}\n\n`
      if (section.type === "text") {
        textToCopy += section.content
      } else {
        textToCopy += JSON.stringify(section.content, null, 2)
      }
      navigator.clipboard.writeText(textToCopy)
      console.log("Copied to clipboard:", textToCopy)
    }
  }

  const handleHighlightSection = (sectionId: string) => {
    const section = extractedSections.find(s => s.id === sectionId)
    if (section && section.page) {
      setCurrentPage(section.page)
      console.log(`Highlighting section ${sectionId} on page ${section.page}`)
    }
  }

  return (
    <AgentDocScanner
      document={documentInfo}
      extractedSections={extractedSections}
      currentPage={currentPage}
      totalPages={documentInfo?.pages || 1}
      isProcessing={isProcessing}
      uploadProgress={uploadProgress}
      previewUrl={previewUrl}
      onFileUpload={handleFileUpload}
      onExport={handleExport}
      onPageChange={setCurrentPage}
      onZoomIn={() => console.log("Zoom in")}
      onZoomOut={() => console.log("Zoom out")}
      onRotate={() => console.log("Rotate")}
      onCopySection={handleCopySection}
      onHighlightSection={handleHighlightSection}
      timestamp="2:34 PM"
    />
  )
}