import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { 
  Bot, 
  CheckCircle2, 
  Circle, 
  CircleDot, 
  Loader2, 
  PauseCircle, 
  XCircle 
} from "lucide-react"

export type AgentStatus = "idle" | "thinking" | "running" | "paused" | "error" | "completed"

export interface AgentCapability {
  name: string
  description: string
  icon?: React.ReactNode
}

export interface AgentCardProps {
  name: string
  description?: string
  avatar?: string
  status?: AgentStatus
  capabilities?: AgentCapability[]
  className?: string
  onAction?: (action: string) => void
}

const statusConfig: Record<AgentStatus, { icon: React.ReactNode; color: string; label: string }> = {
  idle: { icon: <Circle className="h-3 w-3" />, color: "text-muted-foreground", label: "Idle" },
  thinking: { icon: <CircleDot className="h-3 w-3 animate-pulse" />, color: "text-yellow-500", label: "Thinking" },
  running: { icon: <Loader2 className="h-3 w-3 animate-spin" />, color: "text-blue-500", label: "Running" },
  paused: { icon: <PauseCircle className="h-3 w-3" />, color: "text-orange-500", label: "Paused" },
  error: { icon: <XCircle className="h-3 w-3" />, color: "text-red-500", label: "Error" },
  completed: { icon: <CheckCircle2 className="h-3 w-3" />, color: "text-green-500", label: "Completed" },
}

export function AgentCard({
  name,
  description,
  avatar,
  status = "idle",
  capabilities = [],
  className,
  onAction,
}: AgentCardProps) {
  const statusInfo = statusConfig[status]

  return (
    <div className={cn(
      "rounded-lg p-4 bg-card border",
      className
    )}>
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{name}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn("flex items-center gap-1", statusInfo.color)}>
                    {statusInfo.icon}
                    <span className="text-xs">{statusInfo.label}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Status: {statusInfo.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          
          {capabilities.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">Capabilities:</p>
              <div className="flex flex-wrap gap-1">
                {capabilities.map((capability, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs">
                          {capability.icon}
                          {capability.name}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{capability.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {onAction && (
        <div className="mt-3 flex gap-2">
          {status === "idle" && (
            <Button size="sm" onClick={() => onAction("start")}>
              Start Agent
            </Button>
          )}
          {(status === "running" || status === "thinking") && (
            <>
              <Button size="sm" variant="outline" onClick={() => onAction("pause")}>
                Pause
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onAction("stop")}>
                Stop
              </Button>
            </>
          )}
          {status === "paused" && (
            <Button size="sm" onClick={() => onAction("resume")}>
              Resume
            </Button>
          )}
          {(status === "completed" || status === "error") && (
            <Button size="sm" onClick={() => onAction("restart")}>
              Restart
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
