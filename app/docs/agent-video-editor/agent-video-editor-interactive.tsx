"use client"

import { AgentVideoEditor } from "@/components/agents-ui/agent-video-editor"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function AgentVideoEditorInteractive() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentTime, setCurrentTime] = useState(12)
  const [duration, setDuration] = useState(45)
  const [clips, setClips] = useState([
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
  ])
  
  const handleExport = async () => {
    console.log("Exporting video...")
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    // Generate new random clips
    const newDuration = Math.floor(Math.random() * 60) + 30
    const newClips = [
      {
        id: "new-clip1",
        name: "Scene 1",
        duration: Math.floor(newDuration * 0.4),
        startTime: 0,
        endTime: Math.floor(newDuration * 0.4),
        thumbnail: "/new-thumbnail1.jpg"
      },
      {
        id: "new-clip2",
        name: "Scene 2", 
        duration: Math.floor(newDuration * 0.6),
        startTime: Math.floor(newDuration * 0.4),
        endTime: newDuration,
        thumbnail: "/new-thumbnail2.jpg"
      }
    ]
    
    setClips(newClips)
    setDuration(newDuration)
    setCurrentTime(0)
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

  const addClip = () => {
    const newClip = {
      id: `clip-${Date.now()}`,
      name: `Clip ${clips.length + 1}`,
      duration: 10,
      startTime: duration,
      endTime: duration + 10,
      thumbnail: `/thumbnail${clips.length + 1}.jpg`
    }
    
    setClips(prev => [...prev, newClip])
    setDuration(prev => prev + 10)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          Generate New Video
        </Button>
        <Button
          variant="outline"
          onClick={addClip}
          disabled={isGenerating}
        >
          Add Clip
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
      
      <AgentVideoEditor
        videoUrl="https://example.com/sample-video.mp4"
        isPlaying={isPlaying}
        isGenerating={isGenerating}
        currentTime={currentTime}
        duration={duration}
        clips={clips}
        onPlay={togglePlayback}
        onPause={togglePlayback}
        onSeek={setCurrentTime}
        onSkipBack={() => setCurrentTime(Math.max(0, currentTime - 10))}
        onSkipForward={() => setCurrentTime(Math.min(duration, currentTime + 10))}
        onExport={handleExport}
        onCopy={() => console.log("Video copied to clipboard")}
        onEdit={() => console.log("Opening video editor")}
        onTrim={() => console.log("Opening trim interface")}
        onRegenerateResponse={handleGenerate}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Timeline Controls:</p>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setCurrentTime(Math.floor(duration * 0.25))}
              disabled={isGenerating}
            >
              Jump to 25%
            </Button>
            <Button
              size="sm" 
              variant="outline"
              className="w-full justify-start"
              onClick={() => setCurrentTime(Math.floor(duration * 0.5))}
              disabled={isGenerating}
            >
              Jump to 50%
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setCurrentTime(Math.floor(duration * 0.75))}
              disabled={isGenerating}
            >
              Jump to 75%
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Clip Management:</p>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                if (clips.length > 1) {
                  const newClips = clips.slice(0, -1)
                  const newDuration = newClips[newClips.length - 1]?.endTime || 0
                  setClips(newClips)
                  setDuration(newDuration)
                  if (currentTime > newDuration) {
                    setCurrentTime(newDuration)
                  }
                }
              }}
              disabled={isGenerating || clips.length <= 1}
            >
              Remove Last Clip
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const shuffled = [...clips].sort(() => Math.random() - 0.5)
                setClips(shuffled)
              }}
              disabled={isGenerating}
            >
              Shuffle Clips
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Current video: {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')} • {clips.length} clips
      </div>
    </div>
  )
}