import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Bot,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  FileCode,
  RefreshCw,
  Terminal,
  Wrench,
} from "lucide-react"
import { useState } from "react"
import { CodeBlock, CodeBlockCode } from "@/components/prompt-kit/code-block"
import { Markdown } from "@/components/prompt-kit/markdown"

export type ToolCall = {
  id: string
  name: string
  input: any
  output?: any
  status: "pending" | "running" | "completed" | "failed"
  duration?: number
}

export type Artifact = {
  id: string
  type: "code" | "file" | "image" | "data"
  name: string
  content: string
  language?: string
  size?: string
}

export interface AgentResponseProps {
  message: string
  thinking?: string
  toolCalls?: ToolCall[]
  artifacts?: Artifact[]
  isStreaming?: boolean
  className?: string
  onRegenerate?: () => void
  onCopy?: () => void
}

function ToolCallDisplay({ toolCall }: { toolCall: ToolCall }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const statusColors = {
    pending: "text-muted-foreground",
    running: "text-blue-500",
    completed: "text-green-500",
    failed: "text-red-500"
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Wrench className={cn("h-4 w-4", statusColors[toolCall.status])} />
          <span className="font-medium text-sm">{toolCall.name}</span>
          {toolCall.duration && (
            <span className="text-xs text-muted-foreground">
              ({toolCall.duration}ms)
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Input:</p>
            <pre className="rounded bg-background p-2 text-xs overflow-x-auto">
              {JSON.stringify(toolCall.input, null, 2)}
            </pre>
          </div>
          {toolCall.output && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Output:</p>
              <pre className="rounded bg-background p-2 text-xs overflow-x-auto">
                {JSON.stringify(toolCall.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ArtifactDisplay({ artifact }: { artifact: Artifact }) {
  const iconMap = {
    code: <FileCode className="h-4 w-4" />,
    file: <Terminal className="h-4 w-4" />,
    image: <Terminal className="h-4 w-4" />,
    data: <Terminal className="h-4 w-4" />,
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          {iconMap[artifact.type]}
          <span className="font-medium text-sm">{artifact.name}</span>
          {artifact.size && (
            <span className="text-xs text-muted-foreground">({artifact.size})</span>
          )}
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <div className="max-h-96 overflow-auto">
        {artifact.type === "code" ? (
          <CodeBlockCode
            code={artifact.content}
            language={artifact.language || "plaintext"}
            className="rounded-none border-0"
          />
        ) : (
          <pre className="p-4 text-sm font-mono">{artifact.content}</pre>
        )}
      </div>
    </div>
  )
}

export function AgentResponse({
  message,
  thinking,
  toolCalls = [],
  artifacts = [],
  isStreaming = false,
  className,
  onRegenerate,
  onCopy,
}: AgentResponseProps) {
  const [showThinking, setShowThinking] = useState(false)

  return (
    <div className={cn("space-y-4 p-4", className)}>
      {/* Agent Header */}
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-3">
          {/* Thinking Process */}
          {thinking && (
            <Collapsible open={showThinking} onOpenChange={setShowThinking}>
              <CollapsibleTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ChevronRight className={cn(
                  "h-3 w-3 transition-transform",
                  showThinking && "rotate-90"
                )} />
                View thinking process
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                  {thinking}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Tool Calls */}
          {toolCalls.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Tool Usage:</p>
              {toolCalls.map((toolCall) => (
                <ToolCallDisplay key={toolCall.id} toolCall={toolCall} />
              ))}
            </div>
          )}

          {/* Main Message */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown>{message}</Markdown>
            {isStreaming && (
              <span className="inline-block w-1 h-4 bg-foreground animate-pulse ml-1" />
            )}
          </div>

          {/* Artifacts */}
          {artifacts.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Generated Artifacts:</p>
              {artifacts.map((artifact) => (
                <ArtifactDisplay key={artifact.id} artifact={artifact} />
              ))}
            </div>
          )}

          {/* Actions */}
          {!isStreaming && (onRegenerate || onCopy) && (
            <div className="flex items-center gap-2 pt-2">
              {onRegenerate && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onRegenerate}
                  className="h-8 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
              )}
              {onCopy && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onCopy}
                  className="h-8 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
