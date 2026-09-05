"use client"

import { forwardRef } from "react"

import { BorderBeam as UpstreamBorderBeam } from "./border-beam/upstream/BorderBeam"
import type { BorderBeamProps } from "./border-beam/upstream/types"

export const BorderBeam = forwardRef<HTMLDivElement, BorderBeamProps>(
  function BorderBeam(
    {
      colorVariant = "mono",
      theme = "auto",
      strength = 0.6,
      ...props
    },
    ref,
  ) {
    return (
      <UpstreamBorderBeam
        ref={ref}
        colorVariant={colorVariant}
        theme={theme}
        strength={strength}
        {...props}
      />
    )
  },
)

export default BorderBeam

export {
  sizePresets,
  sizeThemePresets,
  themeColors,
} from "./border-beam/upstream/styles"
export type {
  BorderBeamColorVariant,
  BorderBeamProps,
  BorderBeamSize,
  BorderBeamTheme,
  SizeConfig,
  ThemeColors,
} from "./border-beam/upstream/types"
