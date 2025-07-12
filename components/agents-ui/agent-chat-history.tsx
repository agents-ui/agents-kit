"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Archive,
  Bot,
  Download,
  Filter,
  MoreVertical,
  Search,
  Star,
  Trash2,
  User,
} from "lucide-react"
import { useState, useMemo } from "react"

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  tokens?: number
  model?: string
}

export type ChatSession = {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  starred?: boolean
  archived?: boolean
}

export interface AgentChatHistoryProps {
  sessions: ChatSession[]
  selectedSessionId?: string
  onSelectSession?: (session: ChatSession) => void
  onDeleteSession?: (sessionId: string) => void
  onStarSession?: (sessionId: string) => void
  onArchiveSession?: (sessionId: string) => void
  onExportSession?: (sessionId: string) => void
  className?: string
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return "Today"
  } else if (days === 1) {
    return "Yesterday"
  } else if (days < 7) {
    return `${days} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

function SessionItem({
  session,
  isSelected,
  onSelect,
  onDelete,
  onStar,
  onArchive,
  onExport,
}: {
  session: ChatSession
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onStar: () => void
  onArchive: () => void
  onExport: () => void
}) {
  const lastMessage = session.messages[session.messages.length - 1]
  const preview = lastMessage?.content.slice(0, 100) + (lastMessage?.content.length > 100 ? "..." : "")
  
  return (
    <div
      className={cn(
        "group relative p-3 cursor-pointer hover:bg-accent rounded-lg transition-colors",
        isSelected && "bg-accent"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{session.title}</h4>
            {session.starred && (
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {preview}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>{session.messages.length} messages</span>
            <span>{formatDate(session.updatedAt)}</span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStar(); }}>
              <Star className="h-4 w-4 mr-2" />
              {session.starred ? "Unstar" : "Star"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(); }}>
              <Archive className="h-4 w-4 mr-2" />
              {session.archived ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onExport(); }}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function MessagePreview({ message }: { message: ChatMessage }) {
  const icon = message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />
  
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-accent/50 rounded-lg">
      <div className={cn(
        "rounded-full p-1.5",
        message.role === "user" ? "bg-primary/10" : "bg-secondary"
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span className="font-medium capitalize">{message.role}</span>
          <span>•</span>
          <span>{message.timestamp.toLocaleTimeString()}</span>
          {message.tokens && (
            <>
              <span>•</span>
              <span>{message.tokens} tokens</span>
            </>
          )}
        </div>
        <p className="text-sm line-clamp-3">{message.content}</p>
      </div>
    </div>
  )
}

export function AgentChatHistory({
  sessions,
  selectedSessionId,
  onSelectSession,
  onDeleteSession,
  onStarSession,
  onArchiveSession,
  onExportSession,
  className,
}: AgentChatHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "starred" | "archived">("all")
  const [showMessages, setShowMessages] = useState(true)
  
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      // Apply filter
      if (filter === "starred" && !session.starred) return false
      if (filter === "archived" && !session.archived) return false
      
      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const titleMatch = session.title.toLowerCase().includes(query)
        const messageMatch = session.messages.some(msg => 
          msg.content.toLowerCase().includes(query)
        )
        return titleMatch || messageMatch
      }
      
      return true
    })
  }, [sessions, searchQuery, filter])
  
  const selectedSession = sessions.find(s => s.id === selectedSessionId)
  
  return (
    <div className={cn("flex h-full", className)}>
      {/* Sessions List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3 w-3 mr-1" />
                  {filter === "all" ? "All" : filter === "starred" ? "Starred" : "Archived"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All conversations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("starred")}>
                  Starred only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("archived")}>
                  Archived only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <span className="text-xs text-muted-foreground">
              {filteredSessions.length} conversations
            </span>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredSessions.map(session => (
              <SessionItem
                key={session.id}
                session={session}
                isSelected={session.id === selectedSessionId}
                onSelect={() => onSelectSession?.(session)}
                onDelete={() => onDeleteSession?.(session.id)}
                onStar={() => onStarSession?.(session.id)}
                onArchive={() => onArchiveSession?.(session.id)}
                onExport={() => onExportSession?.(session.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Messages Preview */}
      {selectedSession && showMessages && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">{selectedSession.title}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedSession.messages.length} messages • Last updated {formatDate(selectedSession.updatedAt)}
            </p>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {selectedSession.messages.map(message => (
                <MessagePreview key={message.id} message={message} />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
