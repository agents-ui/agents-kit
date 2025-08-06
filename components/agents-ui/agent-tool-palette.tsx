"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Code,
  Database,
  FileSearch,
  Globe,
  Image,
  MessageSquare,
  Music,
  PenTool,
  Search,
  Settings,
  Terminal,
  Video,
  Zap,
} from "lucide-react"
import { useState, useMemo } from "react"

export type ToolCategory = "all" | "data" | "creative" | "utility" | "communication"

export interface AgentTool {
  id: string
  name: string
  description: string
  category: ToolCategory
  icon?: React.ReactNode
  enabled?: boolean
  usageCount?: number
  lastUsed?: Date
  parameters?: {
    name: string
    type: string
    required: boolean
    description?: string
  }[]
}

export interface AgentToolPaletteProps {
  tools: AgentTool[]
  onToolClick?: (tool: AgentTool) => void
  onToolToggle?: (toolId: string, enabled: boolean) => void
  showUsageStats?: boolean
  gridView?: boolean
  className?: string
}

const defaultIcons: Record<string, React.ReactNode> = {
  search: <Search className="h-5 w-5" />,
  code: <Code className="h-5 w-5" />,
  database: <Database className="h-5 w-5" />,
  image: <Image className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  music: <Music className="h-5 w-5" />,
  write: <PenTool className="h-5 w-5" />,
  web: <Globe className="h-5 w-5" />,
  file: <FileSearch className="h-5 w-5" />,
  terminal: <Terminal className="h-5 w-5" />,
  chat: <MessageSquare className="h-5 w-5" />,
  default: <Zap className="h-5 w-5" />,
}

function getToolIcon(tool: AgentTool): React.ReactNode {
  if (tool.icon) return tool.icon
  
  const nameLC = tool.name.toLowerCase()
  for (const [key, icon] of Object.entries(defaultIcons)) {
    if (nameLC.includes(key)) return icon
  }
  return defaultIcons.default
}

function ToolCard({ 
  tool, 
  onClick, 
  onToggle,
  showUsageStats,
  gridView = true
}: { 
  tool: AgentTool
  onClick?: () => void
  onToggle?: (enabled: boolean) => void
  showUsageStats?: boolean
  gridView?: boolean
}) {
  const formatLastUsed = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    
    return date.toLocaleDateString()
  }

  if (!gridView) {
    return (
      <div 
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
          tool.enabled !== false ? "hover:bg-accent" : "opacity-50",
        )}
        onClick={tool.enabled !== false ? onClick : undefined}
      >
        <div className={cn(
          "rounded-lg p-2",
          tool.enabled !== false ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {getToolIcon(tool)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{tool.name}</h4>
            {tool.enabled === false && (
              <Badge variant="secondary" className="text-xs">Disabled</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{tool.description}</p>
          
          {showUsageStats && (
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              {tool.usageCount !== undefined && (
                <span>Used {tool.usageCount} times</span>
              )}
              {tool.lastUsed && (
                <span>Last: {formatLastUsed(tool.lastUsed)}</span>
              )}
            </div>
          )}
        </div>
        
        {onToggle && (
          <Button
            size="sm"
            variant={tool.enabled !== false ? "ghost" : "outline"}
            onClick={(e) => {
              e.stopPropagation()
              onToggle(tool.enabled !== false)
            }}
          >
            {tool.enabled !== false ? "Disable" : "Enable"}
          </Button>
        )}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "relative group cursor-pointer rounded-lg border p-4 transition-all",
              tool.enabled !== false 
                ? "hover:border-primary hover:shadow-md" 
                : "opacity-50 cursor-not-allowed",
            )}
            onClick={tool.enabled !== false ? onClick : undefined}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className={cn(
                "rounded-lg p-3",
                tool.enabled !== false 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted text-muted-foreground"
              )}>
                {getToolIcon(tool)}
              </div>
              
              <div>
                <h4 className="font-medium text-sm">{tool.name}</h4>
                {showUsageStats && tool.usageCount !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {tool.usageCount} uses
                  </p>
                )}
              </div>
              
              {tool.enabled === false && (
                <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                  Disabled
                </Badge>
              )}
            </div>
            
            {onToggle && (
              <div className="absolute inset-x-0 bottom-0 p-2 bg-background/95 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg border-t">
                <Button
                  size="sm"
                  variant={tool.enabled !== false ? "ghost" : "outline"}
                  className="w-full h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggle(tool.enabled !== false)
                  }}
                >
                  {tool.enabled !== false ? "Disable" : "Enable"}
                </Button>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="font-medium">{tool.name}</p>
          <p className="text-xs">{tool.description}</p>
          {tool.parameters && tool.parameters.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs font-medium mb-1">Parameters:</p>
              <ul className="text-xs space-y-0.5">
                {tool.parameters.map((param, idx) => (
                  <li key={idx}>
                    <span className="font-mono">{param.name}</span>
                    <span className="text-muted-foreground"> ({param.type})</span>
                    {param.required && <span className="text-red-500"> *</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Export alias for backward compatibility
export { AgentToolkit as AgentToolPalette }

export function AgentToolkit({
  tools,
  onToolClick,
  onToolToggle,
  showUsageStats = false,
  gridView = true,
  className,
}: AgentToolPaletteProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all")
  
  const categories: { value: ToolCategory; label: string }[] = [
    { value: "all", label: "All Tools" },
    { value: "data", label: "Data" },
    { value: "creative", label: "Creative" },
    { value: "utility", label: "Utility" },
    { value: "communication", label: "Communication" },
  ]
  
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = searchQuery === "" || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [tools, searchQuery, selectedCategory])
  
  const sortedTools = useMemo(() => {
    return [...filteredTools].sort((a, b) => {
      // Enabled tools first
      if (a.enabled !== false && b.enabled === false) return -1
      if (a.enabled === false && b.enabled !== false) return 1
      
      // Then by usage count
      if (showUsageStats && a.usageCount !== undefined && b.usageCount !== undefined) {
        return b.usageCount - a.usageCount
      }
      
      return 0
    })
  }, [filteredTools, showUsageStats])

  return (
    <div className={cn("space-y-4 p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Available Tools</h3>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              // Toggle grid/list view
            }}
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ToolCategory)}>
        <TabsList className="grid grid-cols-5 w-full">
          {categories.map(category => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={selectedCategory} className="mt-4">
          {sortedTools.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No tools found</p>
              {searchQuery && (
                <p className="text-sm mt-1">Try adjusting your search</p>
              )}
            </div>
          ) : gridView ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedTools.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => onToolClick?.(tool)}
                  onToggle={onToolToggle ? (enabled) => onToolToggle(tool.id, enabled) : undefined}
                  showUsageStats={showUsageStats}
                  gridView={gridView}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedTools.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => onToolClick?.(tool)}
                  onToggle={onToolToggle ? (enabled) => onToolToggle(tool.id, enabled) : undefined}
                  showUsageStats={showUsageStats}
                  gridView={gridView}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{sortedTools.length} of {tools.length} tools</span>
        <span>{tools.filter(t => t.enabled !== false).length} enabled</span>
      </div>
    </div>
  )
}
