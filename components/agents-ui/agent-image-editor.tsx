"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { 
  Download,
  Copy,
  RefreshCw,
  Settings2,
  Sliders,
  Sparkles,
  Image as ImageIcon,
  Plus
} from "lucide-react"
import { useState } from "react"

export interface ImageVariation {
  id: string
  url: string
  label: string
  timestamp: string
}

export interface AgentImageEditorProps {
  imageUrl?: string
  variations?: ImageVariation[]
  currentVariation?: string
  isGenerating?: boolean
  onExport?: (format?: "png" | "jpg" | "webp") => void
  onCopy?: () => void
  onCreateVariation?: () => void
  onAdjust?: () => void
  onEnhance?: () => void
  onRegenerateResponse?: () => void
  className?: string
  agentAvatar?: string
  timestamp?: string
}

export function AgentImageEditor({
  imageUrl,
  variations = [],
  currentVariation,
  isGenerating = false,
  onExport,
  onCopy,
  onCreateVariation,
  onAdjust,
  onEnhance,
  onRegenerateResponse,
  className,
  agentAvatar,
  timestamp = "Just now",
}: AgentImageEditorProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isCreatingVariation, setIsCreatingVariation] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    await onExport?.()
    setTimeout(() => setIsExporting(false), 1000)
  }

  const handleCreateVariation = async () => {
    setIsCreatingVariation(true)
    await onCreateVariation?.()
    setTimeout(() => setIsCreatingVariation(false), 2000)
  }

  const currentVariationData = variations.find(v => v.id === currentVariation) || variations[0]

  return (
    <div className={cn("space-y-4 p-4", className)}>
      {/* Variation Label */}
      {currentVariationData && (
        <div className="text-sm font-medium text-foreground">
          {currentVariationData.label}
        </div>
      )}

      {/* Image Display */}
      <div className="relative group">
        <div className="rounded-xl border bg-muted overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={currentVariationData?.label || "Generated image"}
              className="w-full h-auto max-h-96 object-cover"
            />
          ) : (
            <div className="aspect-video flex items-center justify-center bg-muted">
              <div className="text-center space-y-2">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isGenerating ? "Generating image..." : "No image generated yet"}
                </p>
              </div>
            </div>
          )}
          
          {/* Loading overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Generating...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Overlay */}
        {imageUrl && !isGenerating && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm border rounded-lg p-2">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-black text-white hover:bg-black/90 flex-shrink-0"
                        onClick={handleExport}
                        disabled={isExporting}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export {isExporting && <RefreshCw className="h-3 w-3 ml-1 animate-spin" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-shrink-0"
                        onClick={handleCreateVariation}
                        disabled={isCreatingVariation}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create variation {isCreatingVariation && <RefreshCw className="h-3 w-3 ml-1 animate-spin" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Create a new variation</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" className="flex-shrink-0" onClick={onAdjust}>
                        <Sliders className="h-4 w-4 mr-2" />
                        Adjust
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Adjust image parameters</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" className="flex-shrink-0" onClick={onEnhance}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Enhance
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Enhance image quality</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              <Settings2 className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{timestamp}</span>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={onCopy}>
                  Copy
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy image</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={onRegenerateResponse}>
                  Regenerate response
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate a new image</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex gap-1">
            <span className="text-lg">😊</span>
            <span className="text-lg">😔</span>
          </div>
        </div>
      </div>

      {/* Variations List */}
      {variations.length > 1 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Variations</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {variations.map((variation) => (
              <button
                key={variation.id}
                className={cn(
                  "flex-shrink-0 rounded-lg border p-2 text-xs hover:border-primary transition-colors",
                  currentVariation === variation.id && "border-primary bg-primary/5"
                )}
              >
                <div className="w-16 h-12 bg-muted rounded mb-1" />
                <p className="truncate w-16">{variation.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}