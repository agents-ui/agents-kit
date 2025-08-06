"use client"

import * as React from "react"
import { AgentDocScanner, DocumentInfo, ExtractedSection } from "@/components/agents-ui/agent-doc-scanner"
import { Message, MessageAvatar, MessageContent } from "@/components/prompt-kit/message"

export default function AgentDocScannerChat() {
  const [messages, setMessages] = React.useState<any[]>([
    {
      role: "user",
      content: "I have an invoice PDF that I need to process and extract the key information from.",
    },
    {
      role: "assistant",
      content: "I can help you process the invoice and extract key information like vendor details, line items, and total amounts. Please upload the PDF file.",
    },
  ])

  const [document, setDocument] = React.useState<DocumentInfo>({
    name: "invoice-Q1-2024.pdf",
    type: "pdf",
    size: 325000,
    pages: 2,
    uploadedAt: new Date().toISOString()
  })

  const [extractedSections, setExtractedSections] = React.useState<ExtractedSection[]>([
    {
      id: "1",
      type: "metadata",
      title: "Vendor Information",
      content: {
        company: "Global Tech Solutions",
        address: "123 Tech Street, San Francisco, CA",
        invoiceNumber: "INV-2024-0156",
        invoiceDate: "March 15, 2024"
      },
      confidence: 0.97,
      page: 1
    },
    {
      id: "2",
      type: "table",
      title: "Services Rendered",
      content: [
        { service: "Cloud Infrastructure Setup", hours: 80, rate: 175, amount: 14000 },
        { service: "Security Audit", hours: 24, rate: 200, amount: 4800 },
        { service: "API Development", hours: 120, rate: 150, amount: 18000 },
        { service: "Documentation", hours: 16, rate: 100, amount: 1600 }
      ],
      confidence: 0.95,
      page: 1
    },
    {
      id: "3",
      type: "text",
      title: "Payment Summary",
      content: "Subtotal: $38,400.00\nTax (8.5%): $3,264.00\nTotal Due: $41,664.00",
      confidence: 0.99,
      page: 2
    }
  ])

  const handleFileUpload = (file: File) => {
    console.log(`File uploaded: ${file.name}`)
  }

  return (
    <div className="max-w-3xl mx-auto border rounded-lg p-4 space-y-4">
      {messages.map((message, i) => (
        <Message key={i} className="max-w-full">
          <MessageAvatar
            src=""
            alt={message.role === "user" ? "You" : "Document Agent"}
            fallback={message.role === "user" ? "U" : "DA"}
          />
          <MessageContent>
            {message.content}
          </MessageContent>
        </Message>
      ))}
      
      {/* Doc Scanner Component */}
      <div className="max-w-full">
        <AgentDocScanner
          document={document}
          extractedSections={extractedSections}
          previewUrl="/document-preview"
          showBottomActions={false}
          onFileUpload={handleFileUpload}
          onExport={(format) => {
            setMessages(prev => [...prev, {
              role: "assistant",
              content: `Exporting data as ${format?.toUpperCase()}...`,
            }])
          }}
          timestamp="2:36 PM"
        />
      </div>
    </div>
  )
}