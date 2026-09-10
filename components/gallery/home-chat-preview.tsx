"use client"

import { BlocksAi02, blocksAi02Models } from "@/components/blocks-so/ai-02"
import { BorderBeam } from "@/components/effects/border-beam"
import { useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function HomeChatPreview() {
  const { resolvedTheme } = useTheme()
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [notice, setNotice] = useState("")
  useEffect(() => setMounted(true), [])

  return (
    <div className="mx-auto mt-9 w-full max-w-[600px] text-left">
      <BlocksAi02
        className="max-w-none"
        onSubmit={(_, model) => {
          const name =
            blocksAi02Models.find((item) => item.value === model)?.name ?? model
          setNotice(`Prompt previewed with ${name}. No model was contacted.`)
        }}
        onFilesSelected={(files) =>
          setNotice(
            `${files.length} ${files.length === 1 ? "file" : "files"} selected locally. Nothing uploaded.`
          )
        }
        renderComposer={(composer) => (
          <BorderBeam
            active={mounted && !reducedMotion}
            theme={mounted && resolvedTheme === "dark" ? "dark" : "light"}
            colorVariant="ocean"
            size="md"
            strength={1}
            borderRadius={16}
            className="w-full"
          >
            {composer}
          </BorderBeam>
        )}
      />
      <p
        className="text-text-tertiary mt-3 text-center text-[11px]"
        role="status"
      >
        {notice || "Blocks.so prompt input + Border Beam · Interactive preview"}
      </p>
    </div>
  )
}
