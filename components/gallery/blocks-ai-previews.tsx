"use client"

import * as React from "react"

import { BlocksAi01 } from "@/components/blocks-so/ai-01"
import { BlocksAi02 } from "@/components/blocks-so/ai-02"
import { BlocksAi03 } from "@/components/blocks-so/ai-03"
import { BlocksAi04 } from "@/components/blocks-so/ai-04"
import { BlocksAi05 } from "@/components/blocks-so/ai-05"

function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center gap-5 py-6">
      {children}
    </div>
  )
}

function StatefulPreview({ render }: { render: (setActivity: (message: string) => void) => React.ReactNode }) {
  const [activity, setActivity] = React.useState("Interactive preview")
  return (
    <div className="flex w-full flex-col items-center gap-5 py-6">
      {render(setActivity)}
      <p aria-live="polite" className="text-center text-xs text-muted-foreground">{activity}</p>
    </div>
  )
}

export function BlocksAi01Preview() {
  return <StatefulPreview render={(setActivity) => <BlocksAi01 onModeChange={(mode) => setActivity(`${mode} mode selected`)} onSubmit={() => setActivity("Prompt submitted")} />} />
}

export function BlocksAi02Preview() {
  return <StatefulPreview render={(setActivity) => <BlocksAi02 onFilesSelected={(files) => setActivity(`${files.length} file${files.length === 1 ? "" : "s"} attached`)} onSubmit={(_, model) => setActivity(`Prompt submitted with ${model}`)} />} />
}

export function BlocksAi03Preview() {
  return <StatefulPreview render={(setActivity) => <BlocksAi03 onSubmit={(_, options) => setActivity(`${options.agent} · ${options.model} · ${options.performance}`)} />} />
}

export function BlocksAi04Preview() {
  return <StatefulPreview render={(setActivity) => <BlocksAi04 onAction={(action) => setActivity(`${action} selected`)} onFilesChange={(files) => setActivity(`${files.length} attachment${files.length === 1 ? "" : "s"}`)} onSubmit={() => setActivity("Field brief started")} />} />
}

export function BlocksAi05Preview() {
  return <PreviewFrame><BlocksAi05 /></PreviewFrame>
}
