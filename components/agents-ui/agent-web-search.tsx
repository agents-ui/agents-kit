"use client"

import * as React from "react"
import { Search, Globe, Calendar, Shield, ExternalLink, Copy, RefreshCw, Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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

export interface SearchResult {
  id: string
  title: string
  url: string
  domain: string
  snippet: string
  aiSummary?: string
  publishedDate?: string
  credibilityScore?: number
  relevanceScore?: number
  imageUrl?: string
}

export interface AgentWebSearchProps {
  query?: string
  results?: SearchResult[]
  isSearching?: boolean
  selectedDomains?: string[]
  dateFilter?: "all" | "day" | "week" | "month" | "year"
  onSearch?: (query: string) => void
  onResultClick?: (result: SearchResult) => void
  onCopyLink?: (url: string) => void
  onDomainFilter?: (domains: string[]) => void
  onDateFilter?: (filter: "all" | "day" | "week" | "month" | "year") => void
  onRefresh?: () => void
  showBottomActions?: boolean
  className?: string
  timestamp?: string
}

export function AgentWebSearch({
  query = "AI agent interfaces",
  results = [],
  isSearching = false,
  selectedDomains = [],
  dateFilter = "all",
  onSearch,
  onResultClick,
  onCopyLink,
  onDomainFilter,
  onDateFilter,
  onRefresh,
  showBottomActions = true,
  className,
  timestamp = "2:34 PM",
}: AgentWebSearchProps) {
  const [localQuery, setLocalQuery] = React.useState(query)
  const [showFilters, setShowFilters] = React.useState(false)

  const handleSearch = () => {
    onSearch?.(localQuery)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const toggleDomain = (domain: string) => {
    const newDomains = selectedDomains.includes(domain)
      ? selectedDomains.filter(d => d !== domain)
      : [...selectedDomains, domain]
    onDomainFilter?.(newDomains)
  }

  const getCredibilityColor = (score?: number) => {
    if (!score) return "text-muted-foreground"
    if (score >= 0.8) return "text-green-600 dark:text-green-400"
    if (score >= 0.6) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const defaultResults: SearchResult[] = results.length > 0 ? results : [
    {
      id: "1",
      title: "Building AI Agent Interfaces with React",
      url: "https://example.com/ai-agents-react",
      domain: "example.com",
      snippet: "Learn how to create sophisticated AI agent interfaces using React and modern UI patterns...",
      aiSummary: "Comprehensive guide covering component architecture, state management, and real-time updates for AI agent UIs.",
      publishedDate: "2024-01-15",
      credibilityScore: 0.9,
      relevanceScore: 0.95,
    },
    {
      id: "2",
      title: "Best Practices for Agent UI Design",
      url: "https://uxdesign.cc/agent-ui-patterns",
      domain: "uxdesign.cc",
      snippet: "Explore the latest patterns and best practices for designing intuitive agent interfaces...",
      aiSummary: "Key insights on conversation flows, visual feedback, and user trust in AI agent interactions.",
      publishedDate: "2024-01-10",
      credibilityScore: 0.85,
      relevanceScore: 0.88,
    },
    {
      id: "3",
      title: "Open Source AI Agent Components",
      url: "https://github.com/ai-agents/ui-kit",
      domain: "github.com",
      snippet: "A collection of open source React components specifically designed for AI agent applications...",
      aiSummary: "Repository featuring 50+ components including chat interfaces, tool palettes, and status indicators.",
      publishedDate: "2024-01-20",
      credibilityScore: 0.95,
      relevanceScore: 0.92,
    },
  ]

  const displayResults = results.length > 0 ? results : defaultResults

  // Extract unique domains from results
  const uniqueDomains = Array.from(new Set(displayResults.map(r => r.domain)))

  return (
    <div className={cn("space-y-4 p-4", className)}>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <Search className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span>Web Search Agent</span>
        <span className="text-xs">{timestamp}</span>
      </div>

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search..."
              className="pl-10 focus:ring-2 focus:ring-blue-500"
              disabled={isSearching}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-blue-600 text-white hover:bg-blue-700 h-9"
          >
            {isSearching ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle filters</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="border rounded-lg p-4 space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-2">Date Range</h4>
              <div className="flex flex-wrap gap-2">
                {["all", "day", "week", "month", "year"].map((filter) => (
                  <Badge
                    key={filter}
                    variant={dateFilter === filter ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => onDateFilter?.(filter as any)}
                  >
                    {filter === "all" ? "Any time" : `Past ${filter}`}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Domains</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueDomains.map((domain) => (
                  <Badge
                    key={domain}
                    variant={selectedDomains.includes(domain) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleDomain(domain)}
                  >
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {isSearching ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">Searching the web...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayResults.map((result) => (
              <div
                key={result.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onResultClick?.(result)}
              >
                <div className="space-y-2">
                  {/* Title and Domain */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base line-clamp-1 text-foreground">
                        {result.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        <span>{result.domain}</span>
                        {result.publishedDate && (
                          <>
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(result.publishedDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {result.credibilityScore && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Shield className={cn("h-4 w-4", getCredibilityColor(result.credibilityScore))} />
                            </TooltipTrigger>
                            <TooltipContent>
                              Credibility: {Math.round(result.credibilityScore * 100)}%
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(result.url, "_blank")}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in new tab
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onCopyLink?.(result.url)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Snippet */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {result.snippet}
                  </p>

                  {/* AI Summary */}
                  {result.aiSummary && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3">
                      <p className="text-sm">
                        <span className="font-medium text-blue-600 dark:text-blue-400">AI Summary:</span>{" "}
                        {result.aiSummary}
                      </p>
                    </div>
                  )}

                  {/* Relevance Score */}
                  {result.relevanceScore && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${result.relevanceScore * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(result.relevanceScore * 100)}% relevant
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Related Searches */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Related searches</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="cursor-pointer">AI agent best practices</Badge>
            <Badge variant="secondary" className="cursor-pointer">React AI components</Badge>
            <Badge variant="secondary" className="cursor-pointer">Agent UI patterns</Badge>
            <Badge variant="secondary" className="cursor-pointer">Conversational interfaces</Badge>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      {showBottomActions && onRefresh && (
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search again with same query</TooltipContent>
              </Tooltip>
            </TooltipProvider>
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