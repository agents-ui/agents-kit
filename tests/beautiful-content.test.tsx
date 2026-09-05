import assert from "node:assert/strict"
import test from "node:test"
import * as ReactRuntime from "react"
import { createElement, type ElementType } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { CodeBlock } from "../components/beautiful-ui/code-block"
import { DiffTable } from "../components/beautiful-ui/diff-table"
import { LoadingState } from "../components/beautiful-ui/loading-state"
import { RecordsTable } from "../components/beautiful-ui/records-table"
import { StreamingText } from "../components/beautiful-ui/streaming-text"
import { TaskRows } from "../components/beautiful-ui/task-rows"

Object.assign(globalThis, { React: ReactRuntime })
const render = (component: ElementType, props: Record<string, unknown>) => renderToStaticMarkup(createElement(component, props))

test("code block renders valid line rows and complete diff metadata", () => {
  const html = render(CodeBlock, { code: " keep\n-old value\n+new value", variant: "diff", filename: "settings.ts" })
  assert.match(html, /settings.ts/)
  assert.match(html, />\+1</)
  assert.match(html, />-1</)
  assert.match(html, /data-change="remove" data-old-line="2"/)
  assert.match(html, /data-change="add" data-new-line="2"/)
  assert.match(html, /old value/)
  assert.match(html, /new value/)
  assert.doesNotMatch(html, /<pre[^>]*>[\s\S]*<div/)
})

test("streaming text respects provider token visibility and completion gates", () => {
  const props = {
    children: "Fallback",
    tokens: [{ text: "Visible " }, { text: "Hidden", citation: 1 }],
    sources: [{ name: "Primary source", domain: "source.example", href: "https://source.example" }],
    followUps: ["Open the source"],
  }
  const streaming = render(StreamingText, { ...props, visibleTokenCount: 1, isStreaming: true })
  assert.match(streaming, /Visible/)
  assert.doesNotMatch(streaming, /Hidden|Copy|Follow-ups|Primary source/)

  const complete = render(StreamingText, { ...props, visibleTokenCount: 2, isStreaming: false })
  assert.match(complete, /Hidden/)
  assert.match(complete, /source.example/)
  assert.match(complete, />Copy</)
  assert.match(complete, /Follow-ups/)
  assert.match(complete, /Open the source/)
})

test("loading state formats controlled elapsed time without inventing a timer", () => {
  const controlled = render(LoadingState, { label: "Indexing", elapsedSeconds: 65 })
  assert.match(controlled, /Indexing/)
  assert.match(controlled, /1m 5s/)
  const explicit = render(LoadingState, { elapsed: "3.2s", elapsedSeconds: 80 })
  assert.match(explicit, /3.2s/)
  assert.doesNotMatch(explicit, /1m 20s/)
})

test("task rows retain capsule order, status, right metadata, and nested details", () => {
  const html = render(TaskRows, {
    variant: "capsules",
    expandedId: "running",
    tasks: [
      { id: "pending", title: "Read sources", status: "pending", meta: "4 files" },
      { id: "running", title: "Compare evidence", status: "running", progress: 64, meta: "12 claims", details: [{ label: "Primary sources", meta: "8" }] },
      { id: "complete", title: "Draft brief", status: "complete", meta: "Ready" },
    ],
  })
  assert.match(html, />1</)
  assert.match(html, /Read sources/)
  assert.match(html, /12 claims/)
  assert.match(html, /64%/)
  assert.match(html, /aria-expanded="true"/)
  assert.match(html, /Primary sources/)
})

test("diff and records tables retain semantic changes, decisions, tags, and totals", () => {
  const diff = render(DiffTable, {
    rows: [
      { id: "owner", field: "Owner", before: "Unassigned", after: "Morgan Lee", status: "accepted" },
      { id: "risk", field: "Risk", before: "Medium", after: "High", status: "pending" },
    ],
    onApplyAll: () => {},
  })
  assert.match(diff, /2 changed fields/)
  assert.match(diff, /1 accepted/)
  assert.match(diff, /1 pending/)
  assert.match(diff, /-<\/span><span[^>]*>Unassigned/)
  assert.match(diff, /\+<\/span><span[^>]*>Morgan Lee/)
  assert.match(diff, /aria-pressed="true"/)
  assert.match(diff, /Apply all 2 changes/)

  const records = render(RecordsTable, {
    records: [
      { id: "northwind", name: "Northwind", categories: ["Enterprise", "Renewal"], updated: "Today", strength: "Strong", links: 3 },
      { id: "contoso", name: "Contoso", categories: ["Mid-market"], updated: "Yesterday", strength: "Weak", links: 1 },
    ],
  })
  assert.match(records, /Enterprise/)
  assert.match(records, /Renewal/)
  assert.match(records, /2 records/)
  assert.match(records, /4 links/)
})
