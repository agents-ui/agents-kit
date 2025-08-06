"use client"

import * as React from "react"
import { AgentWebSearch, SearchResult } from "@/components/agents-ui/agent-web-search"
import { Message, MessageAvatar, MessageContent } from "@/components/prompt-kit/message"

const searchResults: SearchResult[] = [
  {
    id: "1",
    title: "Building Production-Ready AI Agents with React",
    url: "https://blog.example.com/ai-agents-react",
    domain: "blog.example.com",
    snippet: "A comprehensive guide to building scalable AI agent applications using React, TypeScript, and modern tooling...",
    aiSummary: "Step-by-step tutorial covering architecture, state management, real-time updates, and deployment strategies for AI agents.",
    publishedDate: "2024-01-19",
    credibilityScore: 0.88,
    relevanceScore: 0.96,
  },
  {
    id: "2",
    title: "GitHub - openai/agent-ui-components",
    url: "https://github.com/openai/agent-ui-components",
    domain: "github.com",
    snippet: "Open source UI components for building AI agent applications. Includes chat interfaces, tool panels...",
    aiSummary: "Comprehensive repository with 30+ components specifically designed for AI agent integration. MIT licensed.",
    publishedDate: "2024-01-17",
    credibilityScore: 0.97,
    relevanceScore: 0.94,
  },
  {
    id: "3",
    title: "AI Agent Design Patterns - Microsoft Learn",
    url: "https://learn.microsoft.com/ai/agent-patterns",
    domain: "learn.microsoft.com",
    snippet: "Explore common design patterns for AI agents including orchestration, tool use, and multi-agent collaboration...",
    aiSummary: "Microsoft's guide to enterprise AI agent patterns with Azure integration examples and best practices.",
    publishedDate: "2024-01-14",
    credibilityScore: 0.96,
    relevanceScore: 0.89,
  },
]

export default function AgentWebSearchChat() {
  const [messages, setMessages] = React.useState<any[]>([
    {
      role: "user",
      content: "Can you search for the latest resources on building AI agent interfaces?",
    },
    {
      role: "assistant",
      content: "I'll search for the latest resources on building AI agent interfaces for you.",
    },
  ])

  const [isSearching, setIsSearching] = React.useState(false)

  const handleResultClick = (result: SearchResult) => {
    setMessages(prev => [...prev, {
      role: "assistant",
      content: `I found this interesting resource: "${result.title}". ${result.aiSummary} Would you like me to search for more specific information?`,
    }])
  }

  return (
    <div className="max-w-3xl mx-auto border rounded-lg p-4 space-y-4">
      {messages.map((message, i) => (
        <Message key={i} className="max-w-full">
          <MessageAvatar
            src=""
            alt={message.role === "user" ? "You" : "Search Agent"}
            fallback={message.role === "user" ? "U" : "SA"}
          />
          <MessageContent>
            {message.content}
          </MessageContent>
        </Message>
      ))}
      
      {/* Web Search Component */}
      <div className="max-w-full">
        <AgentWebSearch
          query="building AI agent interfaces"
          results={isSearching ? [] : searchResults}
          isSearching={isSearching}
          onResultClick={handleResultClick}
          onSearch={(query) => {
            setIsSearching(true)
            setTimeout(() => setIsSearching(false), 2000)
          }}
          showBottomActions={false}
          timestamp="2:36 PM"
        />
      </div>
    </div>
  )
}