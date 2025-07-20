"use client"

import { AgentImageEditor } from "@/components/agents-ui/agent-image-editor"
import { useState } from "react"

export default function AgentImageEditorBasic() {
  const [isGenerating, setIsGenerating] = useState(false)
  
  const handleExport = async () => {
    console.log("Exporting image...")
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  const handleCreateVariation = async () => {
    console.log("Creating variation...")
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  const mockVariations = [
    {
      id: "1",
      url: "/placeholder-image.jpg",
      label: "Variation one",
      timestamp: "Just now"
    },
    {
      id: "2", 
      url: "/placeholder-image-2.jpg",
      label: "Variation two",
      timestamp: "2 mins ago"
    }
  ]

  return (
    <AgentImageEditor
      imageUrl="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
      variations={mockVariations}
      currentVariation="1"
      isGenerating={isGenerating}
      onExport={handleExport}
      onCopy={() => console.log("Image copied")}
      onCreateVariation={handleCreateVariation}
      onAdjust={() => console.log("Adjusting image")}
      onEnhance={() => console.log("Enhancing image")}
      onRegenerateResponse={() => console.log("Regenerating image")}
    />
  )
}