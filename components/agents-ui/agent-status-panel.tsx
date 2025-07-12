"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  Bot,
  Brain,
  CheckCircle2,
  CircleDot,
  Cloud,
  Cpu,
  Info,
  Loader2,
  MemoryStick,
  Power,
  RefreshCw,
  Settings,
  Sparkles,
  WifiOff,
  Zap,
} from "lucide-react"
import { useState, useEffect } from "react"

export type ConnectionStatus = "connected" | "connecting" | "disconnected" | "error"
export type ModelCapability = "chat" | "code" | "vision" | "function-calling" | "embedding"

export interface ModelInfo {
  name: string
  provider: string
  contextLength: number
  capabilities: ModelCapability[]
  costPer1kTokens?: {
    input: number
    output: number
  }
}

export interface SystemResources {
  cpu: number
  memory: number
  latency: number
  uptime: string
}

export interface AgentStatusPanelProps {
  connectionStatus?: ConnectionStatus
  modelInfo?: ModelInfo
  systemResources?: SystemResources
  version?: string
  onReconnect?: () => void
  onRefresh?: () => void
  onSettings?: () => void
  className?: string
  compact?: boolean
}

const connectionConfig: Record<ConnectionStatus, { icon: React.ReactNode; color: string; label: string }> = {
  connected: { 
    icon: <CheckCircle2 className="h-4 w-4" />, 
    color: "text-green-500", 
    label: "Connected" 
  },
  connecting: { 
    icon: <Loader2 className="h-4 w-4 animate-spin" />, 
    color: "text-blue-500", 
    label: "Connecting" 
  },
  disconnected: { 
    icon: <WifiOff className="h-4 w-4" />, 
    color: "text-muted-foreground", 
    label: "Disconnected" 
  },
  error: { 
    icon: <AlertCircle className="h-4 w-4" />, 
    color: "text-red-500", 
    label: "Connection Error" 
  },
}

const capabilityIcons: Record<ModelCapability, React.ReactNode> = {
  chat: <Bot className="h-3 w-3" />,
  code: <Brain className="h-3 w-3" />,
  vision: <Sparkles className="h-3 w-3" />,
  "function-calling": <Zap className="h-3 w-3" />,
  embedding: <MemoryStick className="h-3 w-3" />,
}

const capabilityLabels: Record<ModelCapability, string> = {
  chat: "Chat Conversations",
  code: "Code Generation",
  vision: "Image Understanding",
  "function-calling": "Tool Usage",
  embedding: "Text Embeddings",
}

function StatusIndicator({ status }: { status: ConnectionStatus }) {
  const config = connectionConfig[status]
  
  return (
    <div className={cn("flex items-center gap-2", config.color)}>
      {config.icon}
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  )
}

function ResourceMeter({ 
  label, 
  value, 
  icon, 
  unit = "%",
  threshold = 80 
}: { 
  label: string
  value: number
  icon: React.ReactNode
  unit?: string
  threshold?: number
}) {
  const isHigh = value > threshold
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <span className={cn("font-medium", isHigh && "text-orange-500")}>
          {value}{unit}
        </span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all",
            isHigh ? "bg-orange-500" : "bg-primary"
          )}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  )
}

export function AgentStatusPanel({
  connectionStatus = "connected",
  modelInfo,
  systemResources,
  version = "1.0.0",
  onReconnect,
  onRefresh,
  onSettings,
  className,
  compact = false,
}: AgentStatusPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    onRefresh?.()
    setTimeout(() => setIsRefreshing(false), 1000)
  }
  
  if (compact) {
    return (
      <div className={cn("rounded-lg border bg-card p-3", className)}>
        <div className="flex items-center justify-between">
          <StatusIndicator status={connectionStatus} />
          <div className="flex items-center gap-1">
            {connectionStatus === "disconnected" && onReconnect && (
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onReconnect}>
                <Power className="h-3 w-3" />
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleRefresh}>
              <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
            </Button>
            {onSettings && (
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onSettings}>
                <Settings className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        
        {modelInfo && (
          <div className="mt-3 text-xs">
            <p className="font-medium">{modelInfo.name}</p>
            <p className="text-muted-foreground">{modelInfo.provider}</p>
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className={cn("rounded-lg border bg-card", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Agent Status</h3>
              <p className="text-xs text-muted-foreground">Version {version}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {connectionStatus === "disconnected" && onReconnect && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={onReconnect}>
                      <Power className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reconnect</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={handleRefresh}>
                    <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh status</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {onSettings && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={onSettings}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      
      {/* Connection Status */}
      <div className="p-4 space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Connection</p>
          <StatusIndicator status={connectionStatus} />
        </div>
        
        {/* Model Info */}
        {modelInfo && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-3">Model Information</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-medium">{modelInfo.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-medium">{modelInfo.provider}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Context</span>
                  <span className="font-medium">{modelInfo.contextLength.toLocaleString()} tokens</span>
                </div>
                {modelInfo.costPer1kTokens && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cost/1k tokens</span>
                    <span className="font-medium">
                      ${modelInfo.costPer1kTokens.input} / ${modelInfo.costPer1kTokens.output}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Capabilities */}
              <div className="mt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Capabilities</p>
                <div className="flex flex-wrap gap-1">
                  {modelInfo.capabilities.map(capability => (
                    <TooltipProvider key={capability}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs">
                            {capabilityIcons[capability]}
                            <span className="capitalize">{capability.replace("-", " ")}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{capabilityLabels[capability]}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* System Resources */}
        {systemResources && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-3">System Resources</p>
              <div className="space-y-3">
                <ResourceMeter
                  label="CPU"
                  value={systemResources.cpu}
                  icon={<Cpu className="h-3 w-3" />}
                />
                <ResourceMeter
                  label="Memory"
                  value={systemResources.memory}
                  icon={<MemoryStick className="h-3 w-3" />}
                />
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Cloud className="h-3 w-3" />
                    <span>Latency</span>
                  </div>
                  <span className={cn(
                    "font-medium",
                    systemResources.latency > 300 && "text-orange-500"
                  )}>
                    {systemResources.latency}ms
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <CircleDot className="h-3 w-3" />
                    <span>Uptime</span>
                  </div>
                  <span className="font-medium">{systemResources.uptime}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
