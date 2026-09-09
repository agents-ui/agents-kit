"use client"

import { Github, Star } from "lucide-react"
import { useEffect, useState } from "react"

export async function loadGitHubStars(
  signal?: AbortSignal
): Promise<number | null> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/agents-ui/agents-kit",
      {
        signal,
      }
    )
    if (!response.ok) return null
    const data = await response.json()
    return Number.isSafeInteger(data?.stargazers_count) &&
      data.stargazers_count >= 0
      ? data.stargazers_count
      : null
  } catch {
    return null
  }
}

export function GitHubStarButton() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    void loadGitHubStars(controller.signal).then((count) => {
      if (!controller.signal.aborted) setStars(count)
    })
    return () => controller.abort()
  }, [])

  return (
    <a
      href="https://github.com/agents-ui/agents-kit"
      target="_blank"
      rel="noopener noreferrer"
      className="border-border-button-default hover:bg-background-secondary-default inline-flex h-9 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <Github aria-hidden="true" className="size-4" />
      Star on GitHub
      {stars !== null && (
        <span className="border-border-button-default text-text-secondary inline-flex items-center gap-1.5 border-l pl-2 tabular-nums">
          <Star aria-hidden="true" className="size-3.5" />
          {stars.toLocaleString("en-US")}
          <span className="sr-only">stars</span>
        </span>
      )}
    </a>
  )
}
