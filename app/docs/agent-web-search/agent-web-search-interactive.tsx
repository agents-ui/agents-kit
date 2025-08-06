"use client"

import * as React from "react"
import { AgentWebSearch, SearchResult } from "@/components/agents-ui/agent-web-search"

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Next.js AI Chatbot Template - Vercel",
    url: "https://vercel.com/templates/next.js/ai-chatbot",
    domain: "vercel.com",
    snippet: "Build and deploy AI chatbots with this production-ready Next.js template featuring streaming responses...",
    aiSummary: "Complete template with authentication, chat history, and streaming AI responses. Uses Vercel AI SDK and supports multiple providers.",
    publishedDate: "2024-01-18",
    credibilityScore: 0.95,
    relevanceScore: 0.98,
  },
  {
    id: "2",
    title: "Building Conversational AI Interfaces - A Developer's Guide",
    url: "https://developers.google.com/ai/conversational",
    domain: "developers.google.com",
    snippet: "Learn how to design and implement conversational AI interfaces that users love. Covers voice and text...",
    aiSummary: "Google's comprehensive guide covering NLU, dialog management, and UI patterns for both voice and text interfaces.",
    publishedDate: "2024-01-12",
    credibilityScore: 0.98,
    relevanceScore: 0.91,
  },
  {
    id: "3",
    title: "shadcn/ui - AI Components Collection",
    url: "https://ui.shadcn.com/ai-components",
    domain: "ui.shadcn.com",
    snippet: "Beautiful and accessible components for building AI-powered applications. Copy and paste into your apps...",
    aiSummary: "Open source component library with 20+ AI-specific components. Fully customizable with Tailwind CSS.",
    publishedDate: "2024-01-20",
    credibilityScore: 0.92,
    relevanceScore: 0.95,
  },
  {
    id: "4",
    title: "OpenAI Platform - Building with GPT Models",
    url: "https://platform.openai.com/docs/guides/chat",
    domain: "platform.openai.com",
    snippet: "Official documentation for integrating OpenAI's GPT models into your applications. Includes best practices...",
    aiSummary: "Official guide covering API usage, prompt engineering, and safety best practices for production applications.",
    publishedDate: "2024-01-15",
    credibilityScore: 0.99,
    relevanceScore: 0.88,
  },
  {
    id: "5",
    title: "Real-time AI Agent Architecture Patterns",
    url: "https://arxiv.org/abs/2401.12345",
    domain: "arxiv.org",
    snippet: "This paper presents novel architectural patterns for building scalable, real-time AI agent systems...",
    aiSummary: "Academic paper introducing event-driven architectures for multi-agent systems with practical implementation examples.",
    publishedDate: "2024-01-08",
    credibilityScore: 0.90,
    relevanceScore: 0.85,
  },
]

export default function AgentWebSearchInteractive() {
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [query, setQuery] = React.useState("AI agent interfaces")
  const [selectedDomains, setSelectedDomains] = React.useState<string[]>([])
  const [dateFilter, setDateFilter] = React.useState<"all" | "day" | "week" | "month" | "year">("all")

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setIsSearching(true)
    
    // Simulate search delay
    setTimeout(() => {
      // Filter results based on query
      const filtered = mockResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.aiSummary?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      // Apply domain filter
      const domainFiltered = selectedDomains.length > 0
        ? filtered.filter(r => selectedDomains.includes(r.domain))
        : filtered
      
      // Apply date filter
      const now = new Date()
      const dateFiltered = dateFilter === "all" ? domainFiltered : domainFiltered.filter(r => {
        if (!r.publishedDate) return true
        const publishDate = new Date(r.publishedDate)
        const daysDiff = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24)
        
        switch (dateFilter) {
          case "day": return daysDiff <= 1
          case "week": return daysDiff <= 7
          case "month": return daysDiff <= 30
          case "year": return daysDiff <= 365
          default: return true
        }
      })
      
      setResults(dateFiltered)
      setIsSearching(false)
    }, 1500)
  }

  const handleResultClick = (result: SearchResult) => {
    console.log("Clicked result:", result)
    // In a real app, this might open the URL or show more details
  }

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    console.log("Copied:", url)
  }

  const handleRefresh = () => {
    handleSearch(query)
  }

  return (
    <AgentWebSearch
      query={query}
      results={results}
      isSearching={isSearching}
      selectedDomains={selectedDomains}
      dateFilter={dateFilter}
      onSearch={handleSearch}
      onResultClick={handleResultClick}
      onCopyLink={handleCopyLink}
      onDomainFilter={setSelectedDomains}
      onDateFilter={setDateFilter}
      onRefresh={handleRefresh}
      timestamp="2:34 PM"
    />
  )
}