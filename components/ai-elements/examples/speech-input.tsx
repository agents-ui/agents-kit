"use client"

import { SpeechInput } from "@/components/ai-elements/speech-input"
import { useCallback, useState } from "react"

const handleAudioRecorded = async () => "Recorded audio captured locally"

const Example = () => {
  const [transcript, setTranscript] = useState("")

  const handleTranscriptionChange = useCallback((text: string) => {
    setTranscript((prev) => {
      const newText = prev ? `${prev} ${text}` : text
      return newText
    })
  }, [])

  const handleClear = useCallback(() => {
    setTranscript("")
  }, [])

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <div className="flex gap-2">
        <SpeechInput
          onAudioRecorded={handleAudioRecorded}
          onTranscriptionChange={handleTranscriptionChange}
          size="icon"
          variant="outline"
        />
        {transcript && (
          <button
            className="text-muted-foreground hover:text-foreground text-sm underline"
            onClick={handleClear}
            type="button"
          >
            Clear
          </button>
        )}
      </div>
      {transcript ? (
        <div className="bg-card max-w-md rounded-lg border p-4 text-sm">
          <p className="text-muted-foreground">
            <strong>Transcript:</strong>
          </p>
          <p className="mt-2">{transcript}</p>
        </div>
      ) : (
        <div className="text-muted-foreground text-center text-sm">
          <p>Click the microphone to start speaking</p>
          <p className="mt-1 text-xs">Demo only · no audio is uploaded</p>
        </div>
      )}
    </div>
  )
}

export default Example
