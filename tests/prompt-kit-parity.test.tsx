import assert from "node:assert/strict"
import test from "node:test"
import * as ReactRuntime from "react"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { PromptKitExample } from "../components/gallery/prompt-kit-examples/primitives"
import { promptKitDocumentedExamples, promptKitEntries } from "../components/gallery/prompt-kit-catalog"
import { components } from "../scripts/registry-components"

Object.assign(globalThis, { React: ReactRuntime })

const publicPrimitives = [
  "chain-of-thought", "chat-container", "code-block", "feedback-bar", "file-upload",
  "image", "jsx-preview", "loader", "markdown", "message", "prompt-input",
  "prompt-suggestion", "reasoning", "response-stream", "scroll-button", "source",
  "steps", "system-message", "text-shimmer", "thinking-bar", "tool",
]

test("Prompt Kit exposes all 21 primitives and every documented example", () => {
  assert.equal(promptKitEntries.length, 54)
  assert.deepEqual(
    components.map((component) => component.name).sort(),
    [...publicPrimitives].sort()
  )

  for (const [family, variant] of promptKitDocumentedExamples) {
    const html = renderToStaticMarkup(createElement(PromptKitExample, { family, variant }))
    assert.match(html, /data-prompt-kit-example=""/, `${family}/${variant} did not render`)
    assert.doesNotMatch(html, /NaN|undefined/, `${family}/${variant} rendered invalid output`)
  }
})
