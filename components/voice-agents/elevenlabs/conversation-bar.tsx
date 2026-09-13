"use client"

import { Card } from "@/components/ai-elements/_ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { LiveWaveform } from "@/components/voice-agents/elevenlabs/live-waveform"
import { acquireMediaStream } from "@/components/voice-agents/elevenlabs/media"
import { cn } from "@/lib/utils"
import {
  useConversationControls,
  useConversationInput,
  useConversationStatus,
} from "@elevenlabs/react"
import {
  ArrowUpIcon,
  ChevronDown,
  Keyboard,
  Mic,
  MicOff,
  PhoneIcon,
  XIcon,
} from "lucide-react"
import * as React from "react"

export interface ConversationBarProps {
  /**
   * ElevenLabs Agent ID to connect to
   */
  agentId: string

  /**
   * Custom className for the container
   */
  className?: string

  /**
   * Custom className for the waveform
   */
  waveformClassName?: string

  /**
   * Callback when user sends a message
   */
  onSendMessage?: (message: string) => void
  /** Disable every control and prevent media/session acquisition. */
  disabled?: boolean
}

export const ConversationBar = React.forwardRef<
  HTMLDivElement,
  ConversationBarProps
>(({ agentId, className, waveformClassName, onSendMessage, disabled }, ref) => {
  const { status } = useConversationStatus()
  const { startSession, endSession, sendUserMessage, sendContextualUpdate } =
    useConversationControls()
  const { isMuted, setMuted } = useConversationInput()
  const [keyboardOpen, setKeyboardOpen] = React.useState(false)
  const [textInput, setTextInput] = React.useState("")
  const mediaStreamRef = React.useRef<MediaStream | null>(null)
  const startRequestRef = React.useRef(0)

  const isConnected = status === "connected"

  const getMicStream = React.useCallback(async (requestId: number) => {
    if (mediaStreamRef.current) return mediaStreamRef.current

    const stream = await acquireMediaStream(
      { audio: true },
      () => requestId !== startRequestRef.current
    )
    if (!stream) return null
    mediaStreamRef.current = stream

    return stream
  }, [])

  const startConversation = React.useCallback(async () => {
    const requestId = startRequestRef.current + 1
    startRequestRef.current = requestId
    try {
      const stream = await getMicStream(requestId)
      if (!stream || requestId !== startRequestRef.current) return

      startSession({
        agentId,
        connectionType: "webrtc",
      })
    } catch (error) {
      console.error("Error starting conversation:", error)
    }
  }, [getMicStream, agentId, startSession])

  const handleEndSession = React.useCallback(() => {
    startRequestRef.current += 1
    endSession()

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop())
      mediaStreamRef.current = null
    }
  }, [endSession])

  const toggleMute = React.useCallback(() => {
    setMuted(!isMuted)
  }, [isMuted, setMuted])

  const handleStartOrEnd = React.useCallback(() => {
    if (disabled) return
    if (status === "connected" || status === "connecting") {
      handleEndSession()
    } else if (status === "disconnected" || status === "error") {
      startConversation()
    }
  }, [disabled, status, handleEndSession, startConversation])

  const handleSendText = React.useCallback(() => {
    if (!textInput.trim()) return

    const messageToSend = textInput
    sendUserMessage(messageToSend)
    setTextInput("")
    onSendMessage?.(messageToSend)
  }, [sendUserMessage, textInput, onSendMessage])

  const handleTextChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setTextInput(value)

      if (value.trim() && isConnected) {
        sendContextualUpdate(value)
      }
    },
    [sendContextualUpdate, isConnected]
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendText()
      }
    },
    [handleSendText]
  )

  React.useEffect(() => {
    if (!disabled) return
    startRequestRef.current += 1
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    mediaStreamRef.current = null
  }, [disabled])

  React.useEffect(() => {
    return () => {
      startRequestRef.current += 1
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn("flex w-full items-end justify-center p-4", className)}
    >
      <Card className="m-0 w-full gap-0 border p-0 shadow-lg">
        <div className="flex flex-col-reverse">
          <div>
            {keyboardOpen && <Separator />}
            <div className="flex items-center justify-between gap-2 p-2">
              <div className="h-8 w-[120px] md:h-10">
                <div
                  className={cn(
                    "flex h-full items-center gap-2 rounded-md py-1",
                    "bg-foreground/5 text-foreground/70"
                  )}
                >
                  <div className="h-full flex-1">
                    <div
                      className={cn(
                        "relative flex h-full w-full shrink-0 items-center justify-center overflow-hidden rounded-sm",
                        waveformClassName
                      )}
                    >
                      <LiveWaveform
                        key={
                          status === "disconnected" || status === "error"
                            ? "idle"
                            : "active"
                        }
                        active={isConnected && !isMuted && !disabled}
                        processing={status === "connecting"}
                        barWidth={3}
                        barGap={1}
                        barRadius={4}
                        fadeEdges={true}
                        fadeWidth={24}
                        sensitivity={1.8}
                        smoothingTimeConstant={0.85}
                        height={20}
                        mode="static"
                        className={cn(
                          "h-full w-full transition-opacity duration-300",
                          (status === "disconnected" || status === "error") &&
                            "opacity-0"
                        )}
                      />
                      {(status === "disconnected" || status === "error") && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-foreground/50 text-[10px] font-medium">
                            Customer Support
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                  aria-pressed={isMuted}
                  className={cn(isMuted ? "bg-foreground/5" : "")}
                  disabled={disabled || !isConnected}
                >
                  {isMuted ? <MicOff /> : <Mic />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setKeyboardOpen((v) => !v)}
                  aria-label={
                    keyboardOpen ? "Hide text input" : "Show text input"
                  }
                  aria-pressed={keyboardOpen}
                  className="relative"
                  disabled={disabled || !isConnected}
                >
                  <Keyboard
                    className={
                      "h-5 w-5 transform-gpu transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] " +
                      (keyboardOpen
                        ? "scale-75 opacity-0"
                        : "scale-100 opacity-100")
                    }
                  />
                  <ChevronDown
                    className={
                      "absolute inset-0 m-auto h-5 w-5 transform-gpu transition-all delay-50 duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] " +
                      (keyboardOpen
                        ? "scale-100 opacity-100"
                        : "scale-75 opacity-0")
                    }
                  />
                </Button>
                <Separator orientation="vertical" className="mx-1 -my-2.5" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStartOrEnd}
                  disabled={disabled}
                  aria-label={
                    isConnected || status === "connecting"
                      ? "End conversation"
                      : "Start conversation"
                  }
                >
                  {isConnected || status === "connecting" ? (
                    <XIcon className="h-5 w-5" />
                  ) : (
                    <PhoneIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-out",
              keyboardOpen ? "max-h-[120px]" : "max-h-0"
            )}
          >
            <div className="relative px-2 pt-2 pb-2">
              <Textarea
                value={textInput}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter your message..."
                className="min-h-[100px] resize-none border-0 pr-12 shadow-none focus-visible:ring-0"
                disabled={disabled || !isConnected}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSendText}
                aria-label="Send message"
                disabled={disabled || !textInput.trim() || !isConnected}
                className="absolute right-3 bottom-3 h-8 w-8"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
})

ConversationBar.displayName = "ConversationBar"
