export type VoiceSessionState =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "disconnected"
  | "failed"

export function voiceOrbState(state: VoiceSessionState) {
  if (state === "speaking") return "talking"
  if (state === "listening") return "listening"
  if (state === "thinking" || state === "connecting") return "thinking"
  return null
}
