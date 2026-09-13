export interface CharacterAlignmentResponseModel {
  characters: string[]
  characterStartTimesSeconds: number[]
  characterEndTimesSeconds: number[]
}

export interface ElevenLabsVoice {
  voiceId?: string
  name?: string
  previewUrl?: string
  labels?: Record<string, string | undefined>
}
