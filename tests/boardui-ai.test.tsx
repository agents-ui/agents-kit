import assert from "node:assert/strict"
import test from "node:test"
import * as ReactRuntime from "react"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { AgentChat } from "../components/boardui/application/agent-chat/agent-chat"
import { pickDemoAnswer } from "../components/boardui/application/agent-chat/demo-answers"
import { AgentThinking } from "../components/boardui/application/agent-thinking/agent-thinking"
import { ComposerLoader } from "../components/boardui/application/composer-loader/composer-loader"
import { boardUiAiEntries } from "../components/gallery/boardui-ai-catalog"

Object.assign(globalThis, { React: ReactRuntime })

test("BoardUI AI catalogue preserves four thinking variants, loader, and local chat", () => {
  assert.deepEqual(
    boardUiAiEntries.map((entry) => entry.slug),
    [
      "boardui-agent-thinking-wave",
      "boardui-agent-thinking-spin",
      "boardui-agent-thinking-stars",
      "boardui-agent-thinking-infinity",
      "boardui-composer-loader",
      "boardui-agent-chat",
    ]
  )
  assert.ok(boardUiAiEntries.every((entry) => entry.category === "BoardUI"))

  const wave = renderToStaticMarkup(
    createElement(AgentThinking, {
      variant: "wave",
      label: "Wave",
      tone: "accent",
    })
  )
  const spin = renderToStaticMarkup(
    createElement(AgentThinking, {
      variant: "spin",
      label: "Spin",
      shimmer: false,
      showTimer: false,
    })
  )
  const stars = renderToStaticMarkup(
    createElement(AgentThinking, { variant: "stars", label: "Stars" })
  )
  const infinity = renderToStaticMarkup(
    createElement(AgentThinking, { variant: "infinity", label: "Infinity" })
  )

  assert.match(wave, /--bui-agent-thinking-tone:var\(--color-blue-500\)/)
  assert.match(wave, /0\.0s/)
  assert.doesNotMatch(spin, /bui-agent-thinking-label|0\.0s/)
  assert.equal(
    (stars.match(/bui-agent-thinking-star absolute/g) ?? []).length,
    5
  )
  assert.match(infinity, /stroke-dasharray="11 89"/)

  const loader = renderToStaticMarkup(
    createElement(
      ComposerLoader,
      null,
      createElement("span", null, "Preparing")
    )
  )
  assert.match(loader, /bui-composer-loader-rect/)
  assert.match(loader, /bui-composer-loader-dash 4\.5s linear/)
  assert.match(loader, /Preparing/)

  assert.match(
    pickDemoAnswer("What does this starter do?"),
    /stays entirely in your browser/
  )
  assert.doesNotMatch(
    pickDemoAnswer("How do I add an API key?"),
    /AI_API_KEY|https?:\/\//
  )

  const chat = renderToStaticMarkup(createElement(AgentChat))
  assert.match(chat, /aria-label="Open chat history"/)
  assert.doesNotMatch(chat, /aria-label="Close chat history"|\/api\/chat/)
})
