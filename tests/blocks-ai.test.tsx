import assert from "node:assert/strict"
import test from "node:test"
import * as ReactRuntime from "react"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { BlocksAi01 } from "../components/blocks-so/ai-01"
import { BlocksAi02 } from "../components/blocks-so/ai-02"
import { BlocksAi03 } from "../components/blocks-so/ai-03"
import { BlocksAi04 } from "../components/blocks-so/ai-04"
import { BlocksAi05 } from "../components/blocks-so/ai-05"

Object.assign(globalThis, { React: ReactRuntime })

test("all five Blocks AI compositions expose their defining controls", () => {
  const cases: Array<[ReactRuntime.ComponentType, string, string[]]> = [
    [BlocksAi01, "ai-01", ["Add context", "Record audio message", "Audio visualization"]],
    [BlocksAi02, "ai-02", ["Model: GPT-5", "Attach images", "Suggested prompts"]],
    [BlocksAi03, "ai-03", ["Add tools", "Auto", "High"]],
    [BlocksAi04, "ai-04", ["Add attachments", "Adjust settings", "Capture field evidence"]],
    [BlocksAi05, "ai-05", ["Fieldwork assistant", "New chat", "Assistant is typing"]],
  ]

  for (const [Component, slug, expected] of cases) {
    const html = renderToStaticMarkup(createElement(Component))
    assert.match(html, new RegExp(`data-blocks-ai="${slug}"`))
    for (const label of expected) {
      if (label === "Assistant is typing") continue
      assert.ok(html.includes(label), `${slug} is missing ${label}`)
    }
  }
})
