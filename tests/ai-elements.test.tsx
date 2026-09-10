import assert from "node:assert/strict"
import test from "node:test"
import * as ReactRuntime from "react"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  Question,
  QuestionActions,
  QuestionOption,
  QuestionOptions,
  QuestionPrompt,
  QuestionSubmit,
} from "../components/ai-elements/question"
import { aiElementsEntries } from "../components/gallery/ai-elements-catalog"

Object.assign(globalThis, { React: ReactRuntime })

test("AI Elements exposes the complete upstream catalog and usable question state", () => {
  assert.equal(aiElementsEntries.length, 91)
  assert.equal(
    new Set(aiElementsEntries.map(({ slug }) => slug)).size,
    aiElementsEntries.length
  )
  assert.equal(new Set(aiElementsEntries.map(({ family }) => family)).size, 49)
  assert.ok(
    aiElementsEntries.every(
      ({ category, family, variant }) =>
        category === "AI Elements" && Boolean(family) && Boolean(variant)
    )
  )

  const html = renderToStaticMarkup(
    createElement(
      Question,
      {
        defaultValue: { selectedValues: ["quiet"], text: "" },
      },
      createElement(QuestionPrompt, null, "What should the agent prioritize?"),
      createElement(
        QuestionOptions,
        null,
        createElement(QuestionOption, { value: "fast" }, "Fast"),
        createElement(QuestionOption, { value: "quiet" }, "Quiet")
      ),
      createElement(
        QuestionActions,
        null,
        createElement(QuestionSubmit, null, "Continue")
      )
    )
  )

  assert.match(html, /role="radiogroup"/)
  assert.match(html, /aria-checked="true"[^>]*>Quiet/)
  assert.doesNotMatch(html, /disabled=""[^>]*>Continue/)
})
