"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { 
  Download,
  Copy,
  RefreshCw,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Edit2,
  Scissors,
  Settings2,
  Video,
  Clock
} from "lucide-react"
import { useState } from "react"

export interface VideoClip {
  id: string
  name: string
  duration: number
  startTime: number
  endTime: number
  thumbnail?: string
}

export interface AgentVideoEditorProps {
  videoUrl?: string
  isGenerating?: boolean
  isPlaying?: boolean
  currentTime?: number
  duration?: number
  clips?: VideoClip[]
  onPlay?: () => void
  onPause?: () => void
  onSeek?: (time: number) => void
  onSkipBack?: () => void
  onSkipForward?: () => void
  onExport?: (format?: "mp4" | "mov" | "avi") => void
  onCopy?: () => void
  onEdit?: () => void
  onTrim?: () => void
  onRegenerateResponse?: () => void
  className?: string
  timestamp?: string
}

export function AgentVideoEditor({
  videoUrl,
  isGenerating = false,
  isPlaying = false,
  currentTime = 12,
  duration = 45,
  clips = [],
  onPlay,
  onPause,
  onSeek,
  onSkipBack,
  onSkipForward,
  onExport,
  onCopy,
  onEdit,
  onTrim,
  onRegenerateResponse,
  className,
  timestamp = "Just now",
}: AgentVideoEditorProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    await onExport?.()
    setTimeout(() => setIsExporting(false), 1000)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.()
    } else {
      onPlay?.()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={cn("space-y-4 p-4", className)}>
      {/* Video Preview */}
      <div className="relative group">
        <div className="rounded-xl border bg-black overflow-hidden">
          {videoUrl ? (
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
              {/* Video placeholder with play controls overlay */}
              <div className="text-white text-center">
                <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm opacity-75">Video Preview</p>
              </div>
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/30"
                    onClick={onSkipBack}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-16 w-16 rounded-full bg-white text-black hover:bg-white/90"
                    onClick={handlePlayPause}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-1" />
                    )}
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/30"
                    onClick={onSkipForward}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <div className="text-center space-y-2">
                <Video className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isGenerating ? "Generating video..." : "No video generated yet"}
                </p>
              </div>
            </div>
          )}
          
          {/* Loading overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <div>
                    <p className="font-medium">Processing video...</p>
                    <p className="text-sm text-muted-foreground">This may take a few minutes</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Progress Bar */}
        {videoUrl && !isGenerating && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm border rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{formatTime(currentTime)}</span>
                
                <div className="flex-1">
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                
                <span className="text-sm font-medium">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      {clips.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Timeline</span>
          </div>
          
          <div className="bg-muted rounded-lg p-3">
            <div className="flex gap-1 h-12 overflow-x-auto">
              {clips.map((clip, index) => (
                <div
                  key={clip.id}
                  className="flex-shrink-0 bg-primary rounded h-full flex items-center justify-center min-w-16 px-2"
                  style={{ 
                    width: `${(clip.endTime - clip.startTime) / duration * 200}px`,
                    minWidth: '48px'
                  }}
                >
                  <span className="text-xs text-primary-foreground font-medium truncate">
                    {clip.name}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Timeline ruler */}
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0:00</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                className="bg-black text-white hover:bg-black/90"
                onClick={handleExport}
                disabled={isExporting || !videoUrl}
              >
                <Download className="h-4 w-4 mr-2" />
                Export {isExporting && <RefreshCw className="h-3 w-3 ml-1 animate-spin" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export video file</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={onEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit video settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={onTrim}>
                <Scissors className="h-4 w-4 mr-2" />
                Trim
              </Button>
            </TooltipTrigger>
            <TooltipContent>Trim video clips</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                <Volume2 className="h-4 w-4 mr-2" />
                Audio
              </Button>
            </TooltipTrigger>
            <TooltipContent>Adjust audio settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
              <TooltipContent>Copy video</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={onRegenerateResponse}>
                  Regenerate response
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate new video</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex gap-1">
            <span className="text-lg">😊</span>
            <span className="text-lg">😔</span>
          </div>
        </div>
      </div>
    </div>
  )
}