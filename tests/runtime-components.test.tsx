import assert from "node:assert/strict"
import test from "node:test"
import * as ReactRuntime from "react"
import { createElement, type ElementType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { AgentCheckpoint } from "../components/agents-ui/agent-checkpoint"
import { AgentContextMeter } from "../components/agents-ui/agent-context-meter"
import {
  ThinkingIndicator,
  ThinkingOrb,
  type ThinkingState,
} from "../components/agents-ui/agent-thinking-indicator"

Object.assign(globalThis, { React: ReactRuntime })

function render(component: ElementType, props: Record<string, unknown>) {
  return renderToStaticMarkup(createElement(component, props))
}

test("thinking indicator exposes text for all nine semantic states", () => {
  const labels: Record<ThinkingState, string> = {
    working: "Working",
    searching: "Searching",
    solving: "Solving",
    listening: "Listening",
    connecting: "Connecting",
    weaving: "Weaving",
    composing: "Composing",
    breathing: "Thinking",
    shaping: "Shaping response",
  }

  for (const [state, label] of Object.entries(labels)) {
    const html = render(ThinkingIndicator, { state })
    assert.match(html, /role="status"/)
    assert.match(html, /<canvas/)
    assert.match(html, new RegExp(`>${label}<`))
  }
})

test("thinking orb renders every supported size during SSR", () => {
  for (const size of [20, 32, 64] as const) {
    const html = render(ThinkingOrb, { size })
    assert.match(html, /<canvas/)
    assert.match(html, new RegExp(`width:${size}px`))
    assert.match(html, new RegExp(`height:${size}px`))
  }
})

test("thinking orb accepts the current customization controls during SSR", () => {
  const html = render(ThinkingOrb, {
    state: "shaping",
    size: 32,
    theme: "dark",
    speed: 1.25,
    paused: true,
    color: "#2563eb",
    dots: 1.5,
    dotSize: 0.8,
    opts: { shape: 2 },
    frame: () => ({ dots: [], lines: [] }),
  })

  assert.match(html, /<canvas/)
  assert.match(html, /aria-label="Shaping…"/)
})

test("context meter handles zero totals and reports unallocated usage", () => {
  const zero = render(AgentContextMeter, {
    usedTokens: 500,
    totalTokens: 0,
  })
  assert.match(zero, /aria-valuemax="0"/)
  assert.match(zero, /aria-valuenow="0"/)
  assert.match(zero, /500 used/)
  assert.match(zero, /Other context/)

  const partial = render(AgentContextMeter, {
    usedTokens: 1200,
    totalTokens: 8000,
    sources: [
      {
        id: "docs",
        label: "Product documentation",
        tokens: 900,
        kind: "retrieval",
      },
    ],
  })
  assert.match(partial, /Product documentation/)
  assert.match(partial, />300</)
  assert.match(partial, /6,800 remaining/)
})

test("checkpoint renders ready, restoring, restored, error, and disabled states", () => {
  const ready = render(AgentCheckpoint, {
    id: "ready",
    label: "Before edits",
    onRestore: () => {},
    onResume: () => {},
  })
  assert.match(ready, />Saved</)
  assert.match(ready, />Resume</)
  assert.match(ready, />Restore</)

  const restoring = render(AgentCheckpoint, {
    id: "restoring",
    label: "Research",
    status: "restoring",
    progress: 64,
    onRestore: () => {},
  })
  assert.match(restoring, /aria-valuenow="64"/)
  assert.match(restoring, /disabled=""/)

  const restored = render(AgentCheckpoint, {
    id: "restored",
    label: "Approved draft",
    status: "restored",
  })
  assert.match(restored, />Restored</)

  const error = render(AgentCheckpoint, {
    id: "error",
    label: "Initial draft",
    status: "error",
    error: "Workspace revision unavailable",
  })
  assert.match(error, /role="alert"/)
  assert.match(error, /Workspace revision unavailable/)

  const disabled = render(AgentCheckpoint, {
    id: "disabled",
    label: "Archived checkpoint",
    disabled: true,
    onRestore: () => {},
  })
  assert.match(disabled, /disabled=""/)
})
