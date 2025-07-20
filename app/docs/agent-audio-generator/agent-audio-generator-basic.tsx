"use client"

import { AgentAudioGenerator } from "@/components/agents-ui/agent-audio-generator"
import { useState } from "react"

export default function AgentAudioGeneratorBasic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(21)
  const [isGenerating, setIsGenerating] = useState(false)
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
  
  const handleExport = async () => {
    console.log("Exporting audio...")
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const availableVoices = [
    { id: "jenny", name: "Jenny", gender: "Female" as const, accent: "American" },
    { id: "sarah", name: "Sarah", gender: "Female" as const, accent: "British" },
    { id: "alex", name: "Alex", gender: "Male" as const, accent: "American" },
    { id: "david", name: "David", gender: "Male" as const, accent: "Australian" },
  ]

  return (
    <AgentAudioGenerator
      audioUrl="https://example.com/sample-audio.mp3"
      isPlaying={isPlaying}
      isGenerating={isGenerating}
      currentTime={currentTime}
      duration={62}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onSeek={(time) => setCurrentTime(time)}
      onExport={handleExport}
      onCopy={() => console.log("Audio copied")}
      onEdit={() => console.log("Editing audio")}
      onRegenerateResponse={() => console.log("Regenerating audio")}
      onLanguageChange={(lang) => console.log("Language changed:", lang)}
      onSpeedChange={(speed) => console.log("Speed changed:", speed)}
      onVoiceChange={setVoice}
      onToneChange={setTone}
      language="English (US)"
      speed="Normal"
      voice={voice}
      tone={tone}
      availableVoices={availableVoices}
    />
  )
}