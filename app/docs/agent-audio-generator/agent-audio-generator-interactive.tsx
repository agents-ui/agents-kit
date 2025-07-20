"use client"

import { AgentAudioGenerator } from "@/components/agents-ui/agent-audio-generator"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function AgentAudioGeneratorInteractive() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentTime, setCurrentTime] = useState(21)
  const [duration, setDuration] = useState(62)
  const [voice, setVoice] = useState<{
    id: string
    name: string
    gender: "Male" | "Female"
    accent?: string
  }>({
    id: "jenny",
    name: "Jenny", 
    gender: "Female",
    accent: "American"
  })
  const [tone, setTone] = useState("Friendly")
  const [language, setLanguage] = useState("English (US)")
  const [speed, setSpeed] = useState("Normal")

  const availableVoices = [
    { id: "jenny", name: "Jenny", gender: "Female" as const, accent: "American" },
    { id: "sarah", name: "Sarah", gender: "Female" as const, accent: "British" },
    { id: "alex", name: "Alex", gender: "Male" as const, accent: "American" },
    { id: "david", name: "David", gender: "Male" as const, accent: "Australian" },
  ]
  
  const handleExport = async () => {
    console.log("Exporting audio...")
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setCurrentTime(0)
    setDuration(Math.floor(Math.random() * 60) + 30)
    setIsGenerating(false)
  }

  const togglePlayback = () => {
    if (isGenerating) return
    
    if (isPlaying) {
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      // Simulate playback progress
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            clearInterval(interval)
            return duration
          }
          return prev + 1
        })
      }, 1000)
      
      // Stop after reaching duration
      setTimeout(() => {
        clearInterval(interval)
        setIsPlaying(false)
      }, (duration - currentTime) * 1000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          Generate New Audio
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentTime(0)}
          disabled={isGenerating}
        >
          Reset Playback
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsGenerating(!isGenerating)}
        >
          Toggle Loading
        </Button>
      </div>
      
      <AgentAudioGenerator
        audioUrl="sample-audio.mp3"
        isPlaying={isPlaying}
        isGenerating={isGenerating}
        currentTime={currentTime}
        duration={duration}
        onPlay={togglePlayback}
        onPause={togglePlayback}
        onSeek={setCurrentTime}
        onExport={handleExport}
        onCopy={() => console.log("Audio copied")}
        onEdit={() => console.log("Editing audio")}
        onRegenerateResponse={handleGenerate}
        onLanguageChange={setLanguage}
        onSpeedChange={setSpeed}
        onVoiceChange={setVoice}
        onToneChange={setTone}
        language={language}
        speed={speed}
        voice={voice}
        tone={tone}
        availableVoices={availableVoices}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Voice Settings:</p>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setVoice(availableVoices[Math.floor(Math.random() * availableVoices.length)])}
            >
              Random Voice
            </Button>
            <Button
              size="sm" 
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const tones = ["Professional", "Friendly", "Excited", "Calm"]
                setTone(tones[Math.floor(Math.random() * tones.length)])
              }}
            >
              Random Tone
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Playback Controls:</p>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
              disabled={isGenerating}
            >
              Skip +10s
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start" 
              onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
              disabled={isGenerating}
            >
              Skip -10s
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}