"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import Link from "next/link"
import { lazy, Suspense, useEffect, useState } from "react"
import {
  appExamples,
  buildAppPrompt,
  type AppExampleId,
} from "./app-examples-data"

const previews = {
  voice: lazy(async () => ({
    default: (await import("@/components/examples/voice-app")).VoiceAppExample,
  })),
  chat: lazy(async () => ({
    default: (await import("@/components/examples/chat-app")).ChatAppExample,
  })),
  coding: lazy(async () => ({
    default: (await import("@/components/examples/coding-app"))
      .CodingAppExample,
  })),
}

export function AppExamples() {
  const [active, setActive] = useState<AppExampleId>("voice")
  const [appearance, setAppearance] = useState<"basic" | "kit">("kit")
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  )
  const example = appExamples.find((item) => item.id === active)!
  const Preview = previews[active]
  const prompt = buildAppPrompt(example)

  useEffect(() => {
    const followHash = () => {
      const id = window.location.hash.slice(1)
      if (appExamples.some((item) => item.id === id)) {
        setActive(id as AppExampleId)
        setCopyState("idle")
      }
    }
    followHash()
    window.addEventListener("hashchange", followHash)
    return () => window.removeEventListener("hashchange", followHash)
  }, [])

  const select = (id: AppExampleId) => {
    setActive(id)
    setCopyState("idle")
    window.history.replaceState(null, "", `#${id}`)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
  }

  return (
    <div className="space-y-7">
      <div
        className="border-separator-border flex gap-1 border-b"
        role="group"
        aria-label="Choose an app example"
      >
        {appExamples.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={active === item.id}
            onClick={() => select(item.id)}
            className={cn(
              "min-h-11 border-b-2 px-5 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
              active === item.id
                ? "border-text-primary text-text-primary"
                : "text-text-secondary hover:text-text-primary border-transparent"
            )}
          >
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <section aria-label={`${example.title} preview`} className="min-w-0">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium tracking-tight">
              {example.title}
            </h2>
            <p className="text-text-secondary mt-1.5 text-xs">
              {example.description}
            </p>
          </div>
          {active === "coding" && (
            <div
              role="group"
              aria-label="Compare presentation"
              className="bg-background-secondary-default border-separator-border flex rounded-[10px] border p-1"
            >
              <Button
                size="sm"
                variant={appearance === "basic" ? "secondary" : "ghost"}
                aria-pressed={appearance === "basic"}
                onClick={() => setAppearance("basic")}
                className="rounded-md text-xs"
              >
                Basic layout
              </Button>
              <Button
                size="sm"
                variant={appearance === "kit" ? "secondary" : "ghost"}
                aria-pressed={appearance === "kit"}
                onClick={() => setAppearance("kit")}
                className="rounded-md text-xs"
              >
                With Agents Kit
              </Button>
            </div>
          )}
        </div>
        <Suspense
          fallback={
            <div
              className="text-text-secondary border-separator-border grid min-h-[560px] place-items-center rounded-[14px] border text-sm"
              role="status"
            >
              Loading app preview…
            </div>
          }
        >
          <Preview
            key={active}
            {...(active === "coding" ? { appearance } : {})}
          />
        </Suspense>
        <ol
          className="text-text-secondary mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs"
          aria-label="Try this app"
        >
          {example.steps.map((step, index) => (
            <li key={step}>
              <span className="text-text-tertiary mr-2 tabular-nums">
                {index + 1}.
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section
        className="border-separator-border grid gap-6 border-t pt-7 lg:grid-cols-[minmax(0,1fr)_280px]"
        aria-label="Build this app"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium">Build this app</h2>
              <p className="text-text-secondary mt-1.5 text-[13px]">
                Paste this prompt into your coding agent to start from the
                working source.
              </p>
            </div>
            <Button size="sm" onClick={() => void copy()} className="gap-2">
              <span aria-hidden="true">
                {copyState === "copied" ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </span>
              {copyState === "copied" ? "Copied" : "Copy build prompt"}
            </Button>
          </div>
          <p role="status" className="text-text-secondary mt-2 text-xs">
            {copyState === "copied"
              ? "Build prompt copied."
              : copyState === "failed"
                ? "Clipboard unavailable. Open the prompt below and copy it manually."
                : ""}
          </p>
          <details className="border-separator-border bg-background-secondary-default mt-3 rounded-[10px] border">
            <summary className="cursor-pointer px-4 py-3 text-xs font-medium">
              Read the build prompt
            </summary>
            <pre className="border-separator-border max-h-[440px] overflow-auto border-t p-4 text-xs leading-6 whitespace-pre-wrap">
              <code>{prompt}</code>
            </pre>
          </details>
          <div className="mt-4 flex flex-wrap gap-5 text-xs">
            <a
              className="inline-flex items-center gap-1 underline underline-offset-4"
              href={`https://github.com/agents-ui/agents-kit/blob/main/${example.sourcePath}`}
              target="_blank"
              rel="noreferrer"
            >
              View app source{" "}
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
            <a
              className="underline underline-offset-4"
              href={`https://agents-ui.github.io/agents-kit/c/${example.registryName}.json`}
            >
              Installable starter
            </a>
            <Link
              className="underline underline-offset-4"
              href="/docs/examples"
            >
              Setup guide
            </Link>
          </div>
        </div>
        <aside>
          <h2 className="text-sm font-medium">Made with these components</h2>
          <ul className="mt-3 space-y-1">
            {example.components.map((item) => (
              <li key={item.slug}>
                <Link
                  className="text-text-secondary hover:text-text-primary inline-flex min-h-8 items-center text-[13px] underline underline-offset-4"
                  href={item.href}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-text-secondary mt-4 text-xs leading-5">
            These are interactive UI starters with local sample data. Connect
            your agent and services when you build on them.
          </p>
        </aside>
      </section>
    </div>
  )
}
