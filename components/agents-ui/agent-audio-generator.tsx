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
  Play,
  Pause,
  Volume2,
  Edit2,
  ChevronDown,
  Settings2
} from "lucide-react"
import { useState } from "react"

export interface VoiceOption {
  id: string
  name: string
  gender: "Male" | "Female"
  accent?: string
}

export interface AgentAudioGeneratorProps {
  audioUrl?: string
  isGenerating?: boolean
  isPlaying?: boolean
  currentTime?: number
  duration?: number
  onPlay?: () => void
  onPause?: () => void
  onSeek?: (time: number) => void
  onExport?: (format?: "mp3" | "wav" | "m4a") => void
  onCopy?: () => void
  onEdit?: () => void
  onRegenerateResponse?: () => void
  onLanguageChange?: (language: string) => void
  onSpeedChange?: (speed: string) => void
  onVoiceChange?: (voice: VoiceOption) => void
  onToneChange?: (tone: string) => void
  language?: string
  speed?: string
  voice?: VoiceOption
  tone?: string
  availableVoices?: VoiceOption[]
  className?: string
  timestamp?: string
}

const defaultVoices: VoiceOption[] = [
  { id: "jenny", name: "Jenny", gender: "Female", accent: "American" },
  { id: "alex", name: "Alex", gender: "Male", accent: "British" },
  { id: "sarah", name: "Sarah", gender: "Female", accent: "Australian" },
]

export function AgentAudioGenerator({
  audioUrl,
  isGenerating = false,
  isPlaying = false,
  currentTime = 21,
  duration = 62,
  onPlay,
  onPause,
  onSeek,
  onExport,
  onCopy,
  onEdit,
  onRegenerateResponse,
  onLanguageChange,
  onSpeedChange,
  onVoiceChange,
  onToneChange,
  language = "English (US)",
  speed = "Normal",
  voice = defaultVoices[0],
  tone = "Friendly",
  availableVoices = defaultVoices,
  className,
  timestamp = "Just now",
}: AgentAudioGeneratorProps) {
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

  // Generate realistic deterministic waveform heights for consistent SSR/client rendering
  // Use fewer bars for responsive design - will be further limited by CSS for smaller containers
  const waveformHeights = Array.from({ length: 80 }, (_, i) => {
    // Create multiple frequency components to simulate realistic audio
    const x = i / 80
    
    // Base frequency component
    const wave1 = Math.sin(x * Math.PI * 12) * 15
    
    // Higher frequency component
    const wave2 = Math.sin(x * Math.PI * 24) * 8
    
    // Low frequency modulation
    const wave3 = Math.sin(x * Math.PI * 3) * 12
    
    // Create deterministic "noise" using multiple sine functions
    const noise1 = Math.sin(x * 137.5) * 6
    const noise2 = Math.sin(x * 341.3) * 4
    const noise3 = Math.sin(x * 523.7) * 3
    
    // Combine all components and normalize
    const combined = wave1 + wave2 + wave3 + noise1 + noise2 + noise3
    const height = Math.abs(combined) + 8 // Ensure minimum height of 8px
    
    return Math.min(height, 48) // Cap at 48px max height
  })

  return (
    <div className={cn("space-y-4 p-4", className)}>
      {/* Success Message */}
      <div className="text-sm text-foreground">
        Your audio has been successfully generated. You may further customize it or simply download it for use.
      </div>

      {/* Audio Waveform Display */}
      <div className="relative bg-muted rounded-xl p-6">
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <Button
            size="icon"
            variant="secondary"
            className="h-12 w-12 rounded-full bg-black text-white hover:bg-black/90"
            onClick={handlePlayPause}
            disabled={!audioUrl || isGenerating}
          >
            {isGenerating ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          {/* Waveform */}
          <div className="flex-1 relative min-w-0">
            {/* Waveform visualization */}
            <div className="flex items-center justify-center h-16 gap-0.5 overflow-hidden">
              {waveformHeights.map((height, i) => {
                const isPast = (i / 80) * 100 < progressPercentage
                return (
                  <div
                    key={i}
                    className={cn(
                      "w-1 rounded-full transition-colors flex-shrink-0",
                      isPast ? "bg-black" : "bg-gray-300"
                    )}
                    style={{ height: `${height}px` }}
                  />
                )
              })}
            </div>
            
            {/* Time display */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Loading overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
            <div className="text-center space-y-2">
              <RefreshCw className="h-6 w-6 mx-auto animate-spin" />
              <p className="text-sm text-muted-foreground">Generating audio...</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-black text-white hover:bg-black/90"
                onClick={handleExport}
                disabled={isExporting || !audioUrl}
              >
                <Download className="h-4 w-4 mr-2" />
                Export {isExporting && <RefreshCw className="h-3 w-3 ml-1 animate-spin" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export audio file</TooltipContent>
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
            <TooltipContent>Edit audio settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="justify-between">
                <span className="truncate">{language}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select language</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="justify-between">
                <span className="truncate">{speed}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Adjust playback speed</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Voice Settings */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Voice</span>
          </div>
          
          <Button
            variant="outline"
            className="justify-between"
            onClick={() => {
              const newGender = voice.gender === "Female" ? "Male" : "Female"
              const newVoice = availableVoices.find(v => v.gender === newGender) || voice
              onVoiceChange?.(newVoice)
            }}
          >
            <span className="truncate">{voice.gender}</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>

          <Button variant="outline" className="justify-between">
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              <span className="truncate">{voice.name}</span>
            </div>
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>

          <Button
            variant="outline"
            className="justify-between"
            onClick={() => {
              const tones = ["Professional", "Friendly", "Excited", "Calm"]
              const currentIndex = tones.indexOf(tone)
              const nextTone = tones[(currentIndex + 1) % tones.length]
              onToneChange?.(nextTone)
            }}
          >
            <span className="truncate">
              {tone === "Professional" && "😐 Professional"}
              {tone === "Friendly" && "😊 Friendly"}
              {tone === "Excited" && "🤗 Excited"}
              {tone === "Calm" && "😌 Calm"}
            </span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
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
              <TooltipContent>Copy audio</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={onRegenerateResponse}>
                  Regenerate response
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate new audio</TooltipContent>
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