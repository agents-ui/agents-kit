"use client"

import { AgentVideoEditor } from "@/components/agents-ui/agent-video-editor"
import { useState } from "react"

export default function AgentVideoEditorBasic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(12)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const handleExport = async () => {
    console.log("Exporting video...")
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const mockClips = [
    {
      id: "clip1",
      name: "Intro",
      duration: 15,
      startTime: 0,
      endTime: 15,
      thumbnail: "/thumbnail1.jpg"
    },
    {
      id: "clip2", 
      name: "Main",
      duration: 25,
      startTime: 15,
      endTime: 40,
      thumbnail: "/thumbnail2.jpg"
    },
    {
      id: "clip3",
      name: "Outro",
      duration: 5,
      startTime: 40,
      endTime: 45,
      thumbnail: "/thumbnail3.jpg"
    }
  ]

  return (
    <AgentVideoEditor
      videoUrl="https://example.com/sample-video.mp4"
      isPlaying={isPlaying}
      isGenerating={isGenerating}
      currentTime={currentTime}
      duration={45}
      clips={mockClips}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onSeek={(time) => setCurrentTime(time)}
      onSkipBack={() => setCurrentTime(Math.max(0, currentTime - 10))}
      onSkipForward={() => setCurrentTime(Math.min(45, currentTime + 10))}
      onExport={handleExport}
      onCopy={() => console.log("Video copied")}
      onEdit={() => console.log("Editing video")}
      onTrim={() => console.log("Trimming video")}
      onRegenerateResponse={() => console.log("Regenerating video")}
    />
  )
}