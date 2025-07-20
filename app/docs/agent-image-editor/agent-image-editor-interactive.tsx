"use client"

import { AgentImageEditor } from "@/components/agents-ui/agent-image-editor"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function AgentImageEditorInteractive() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentVariation, setCurrentVariation] = useState("1")
  const [variations, setVariations] = useState([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      label: "Original",
      timestamp: "Just now"
    },
    {
      id: "2", 
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      label: "Enhanced",
      timestamp: "2 mins ago"
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", 
      label: "Adjusted",
      timestamp: "5 mins ago"
    }
  ])
  
  const handleExport = async () => {
    console.log("Exporting image...")
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  const handleCreateVariation = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newVariation = {
      id: `${Date.now()}`,
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
      label: `Variation ${variations.length + 1}`,
      timestamp: "Just now"
    }
    
    setVariations(prev => [...prev, newVariation])
    setCurrentVariation(newVariation.id)
    setIsGenerating(false)
  }

  const handleGenerateNew = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    // Reset to a new image
    const newVariations = [{
      id: "new-1",
      url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=600&fit=crop",
      label: "New Generation",
      timestamp: "Just now"
    }]
    
    setVariations(newVariations)
    setCurrentVariation("new-1")
    setIsGenerating(false)
  }

  const currentImage = variations.find(v => v.id === currentVariation)?.url

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleGenerateNew}
          disabled={isGenerating}
        >
          Generate New Image
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsGenerating(!isGenerating)}
        >
          Toggle Loading State
        </Button>
      </div>
      
      <AgentImageEditor
        imageUrl={currentImage}
        variations={variations}
        currentVariation={currentVariation}
        isGenerating={isGenerating}
        onExport={handleExport}
        onCopy={() => {
          navigator.clipboard.writeText(currentImage || "")
          console.log("Image URL copied to clipboard")
        }}
        onCreateVariation={handleCreateVariation}
        onAdjust={() => console.log("Opening adjustment panel")}
        onEnhance={() => console.log("Enhancing image quality")}
        onRegenerateResponse={handleGenerateNew}
      />
      
      {variations.length > 1 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Switch Variations:</p>
          <div className="flex gap-2">
            {variations.map((variation) => (
              <Button
                key={variation.id}
                size="sm"
                variant={currentVariation === variation.id ? "default" : "outline"}
                onClick={() => setCurrentVariation(variation.id)}
              >
                {variation.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}