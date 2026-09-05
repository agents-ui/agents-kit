"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <span aria-hidden className="inline-block size-8" />
  const dark = resolvedTheme === "dark"
  return (
    <Button
      variant="ghost"
      size="small"
      iconOnly
      leadingIcon={dark ? Sun : Moon}
      aria-label={dark ? "Use light theme" : "Use dark theme"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    />
  )
}
