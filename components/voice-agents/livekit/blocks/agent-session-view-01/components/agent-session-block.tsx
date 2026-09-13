"use client"

import { type AgentAudioVisualizerBarProps } from "@/components/voice-agents/livekit/agent-audio-visualizer-bar"
import { type AgentAudioVisualizerGridProps } from "@/components/voice-agents/livekit/agent-audio-visualizer-grid"
import { type AgentAudioVisualizerRadialProps } from "@/components/voice-agents/livekit/agent-audio-visualizer-radial"
import { type AgentAudioVisualizerWaveProps } from "@/components/voice-agents/livekit/agent-audio-visualizer-wave"
import { AgentChatTranscript } from "@/components/voice-agents/livekit/agent-chat-transcript"
import {
  AgentControlBar,
  type AgentControlBarControls,
} from "@/components/voice-agents/livekit/agent-control-bar"
import { cn } from "@/lib/utils"
import {
  useAgent,
  useSessionContext,
  useSessionMessages,
} from "@livekit/components-react"
import { AnimatePresence, motion, type MotionProps } from "motion/react"
import React, { useEffect, useRef, useState } from "react"
import { TileLayout } from "./tile-view"

/**
 * Configures the visualizer style rendered in the main tile area. `type` selects the
 * visualizer, and the remaining fields are exactly the props of the matching
 * `AgentAudioVisualizer*` component (e.g. `type: 'grid'` accepts `rowCount`/`columnCount`,
 * `type: 'wave'` accepts `lineWidth`, etc).
 */
export type AudioVisualizerConfig =
  | ({ type?: "bar" } & AgentAudioVisualizerBarProps)
  | ({ type: "wave" } & AgentAudioVisualizerWaveProps)
  | ({ type: "grid" } & AgentAudioVisualizerGridProps)
  | ({ type: "radial" } & AgentAudioVisualizerRadialProps)

const DEFAULT_CONTROLS: AgentControlBarControls = {
  leave: true,
  microphone: true,
  chat: false,
  camera: false,
  screenShare: false,
}

const BOTTOM_VIEW_MOTION_PROPS: MotionProps = {
  variants: {
    visible: {
      opacity: 1,
      translateY: "0%",
    },
    hidden: {
      opacity: 0,
      translateY: "100%",
    },
  },
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  transition: {
    duration: 0.3,
    delay: 0.5,
    ease: "easeOut",
  },
}

const CHAT_MOTION_PROPS: MotionProps = {
  variants: {
    hidden: {
      opacity: 0,
      transition: {
        ease: "easeOut",
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        ease: "easeOut",
        duration: 0.3,
      },
    },
  },
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
}

const SHIMMER_MOTION_PROPS: MotionProps = {
  variants: {
    visible: {
      opacity: 1,
      transition: {
        ease: "easeIn",
        duration: 0.5,
        delay: 0.8,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        ease: "easeIn",
        duration: 0.5,
        delay: 0,
      },
    },
  },
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
}

interface FadeProps {
  top?: boolean
  bottom?: boolean
  className?: string
}

export function Fade({ top = false, bottom = false, className }: FadeProps) {
  return (
    <div
      className={cn(
        "from-background pointer-events-none h-4 bg-linear-to-b to-transparent",
        top && "bg-linear-to-b",
        bottom && "bg-linear-to-t",
        className
      )}
    />
  )
}

export interface AgentSessionView_01Props {
  /**
   * Retained for API compatibility with LiveKit's complete block.
   * This distribution omits the separately licensed aura visualizer.
   */
  themeMode?: "dark" | "light"
  /**
   * Message shown above the controls before the first chat message is sent.
   *
   * @default 'Agent is listening, ask it a question'
   */
  preConnectMessage?: string
  /**
   * An object with the following keys: leave, microphone, screenShare, camera, chat.
   * Each key maps to a boolean value that determines whether the control is displayed.
   *
   * @default {
   *   leave: true,
   *   microphone: true,
   *   chat: false,
   *   camera: false,
   *   screenShare: false,
   * }
   */
  controls?: AgentControlBarControls
  /** Whether device choices are read from and saved to local storage. */
  saveUserChoices?: boolean
  /**
   * Shows a pre-connect buffer state with a shimmer message before messages appear.
   *
   * @default true
   */
  isPreConnectBufferEnabled?: boolean
  /**
   * Configures the visualizer style rendered in the main tile area.
   *
   * @default { type: 'bar' }
   */
  audioVisualizer?: AudioVisualizerConfig
  /** Optional class name merged onto the outer `<section>` container. */
  className?: string
  /** Called when the user clicks the leave control, in addition to ending the session. */
  onDisconnect?: () => void
}

export function AgentSessionView_01({
  preConnectMessage = "Agent is listening, ask it a question",
  controls = DEFAULT_CONTROLS,
  saveUserChoices = true,
  isPreConnectBufferEnabled = true,
  audioVisualizer = { type: "bar" },
  themeMode,
  onDisconnect,
  ref,
  className,
  ...props
}: React.ComponentProps<"section"> & AgentSessionView_01Props) {
  const session = useSessionContext()
  const { messages } = useSessionMessages(session)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { state: agentState } = useAgent()

  useEffect(() => {
    const lastMessage = messages.at(-1)
    const lastMessageIsLocal = lastMessage?.from?.isLocal === true

    if (scrollAreaRef.current && lastMessageIsLocal) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const finalControls = {
    ...DEFAULT_CONTROLS,
    ...controls,
  }

  return (
    <section
      ref={ref}
      data-theme-mode={themeMode}
      className={cn(
        "bg-background @container/agent-session-block relative z-10 h-full w-full overflow-hidden",
        className
      )}
      {...props}
    >
      <Fade top className="absolute inset-x-4 top-0 z-10 h-40" />
      {/* transcript */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            {...CHAT_MOTION_PROPS}
            className="absolute inset-x-0 top-0 bottom-[135px] overflow-hidden @md/agent-session-block:bottom-[170px]"
          >
            <AgentChatTranscript
              agentState={agentState}
              messages={messages}
              className="mx-auto max-w-2xl **:data-[slot=message-scroller-content]:p-4 **:data-[slot=message-scroller-content]:pt-40! @md/agent-session-block:**:data-[slot=message-scroller-content]:p-6"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tile layout */}
      <TileLayout isChatOpen={isChatOpen} audioVisualizer={audioVisualizer} />

      {/* Bottom */}
      <motion.div
        {...BOTTOM_VIEW_MOTION_PROPS}
        className="absolute inset-x-3 bottom-0 z-50 @md/agent-session-block:inset-x-12"
      >
        {/* Pre-connect message */}
        {isPreConnectBufferEnabled && (
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.p
                key="pre-connect-message"
                aria-hidden={messages.length > 0}
                {...SHIMMER_MOTION_PROPS}
                className="shimmer shimmer-duration-2000 text-muted-foreground pointer-events-none mx-auto block w-full max-w-2xl pb-4 text-center text-sm"
              >
                {preConnectMessage}
              </motion.p>
            )}
          </AnimatePresence>
        )}
        <div className="bg-background relative mx-auto max-w-2xl pb-3 @md/agent-session-block:pb-12">
          <AgentControlBar
            variant="livekit"
            controls={finalControls}
            isChatOpen={isChatOpen}
            isConnected={session.isConnected}
            saveUserChoices={saveUserChoices}
            onDisconnect={onDisconnect ?? session.end}
            onIsChatOpenChange={setIsChatOpen}
          />
        </div>
      </motion.div>
    </section>
  )
}
