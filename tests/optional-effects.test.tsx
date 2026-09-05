import assert from "node:assert/strict"
import test from "node:test"
import * as ReactRuntime from "react"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import {
  BorderBeam,
  type BorderBeamProps,
} from "../components/effects/border-beam"
import { Liquid } from "../components/effects/liquid-gooey"

Object.assign(globalThis, { React: ReactRuntime })

test("border beam keeps content and applies restrained facade defaults", () => {
  const html = renderToStaticMarkup(
    createElement(
      BorderBeam,
      null,
      createElement("button", { type: "button" }, "Run analysis"),
    ),
  )

  assert.match(html, /Run analysis/)
  assert.match(html, /data-beam=/)
  assert.match(html, /data-active=""/)
  assert.match(html, /--beam-strength:0\.6/)
  assert.doesNotMatch(html, /beam-hue-shift/)
})

test("border beam retains explicit upstream options and disabled state", () => {
  const props: BorderBeamProps = {
    children: createElement("div", null, "Static result"),
    active: false,
    colorVariant: "ocean",
    theme: "light",
    strength: 0.25,
    size: "line",
    duration: 4,
    borderRadius: 12,
    glowSize: 0.8,
    hueRange: 8,
  }
  const html = renderToStaticMarkup(createElement(BorderBeam, props))

  assert.match(html, /Static result/)
  assert.match(html, /--beam-strength:0\.25/)
  assert.doesNotMatch(html, /data-active=""/)
})

test("liquid morph and move preserve crisp caller content during SSR", () => {
  const html = renderToStaticMarkup(
    createElement(
      Liquid,
      { fill: "currentColor", blur: 5, contrast: 16 },
      createElement(
        Liquid.Item,
        { morph: { shape: true, speed: 1.25, bounce: 0.25 } },
        createElement("span", null, "Research"),
      ),
      createElement(
        Liquid.Item,
        {
          effect: "move",
          move: { springiness: 0.7, wobble: 0.2, stretch: 0.25, trail: 0 },
          x: 24,
          y: 0,
        },
        createElement("span", null, "Review"),
      ),
    ),
  )

  assert.match(html, /Research/)
  assert.match(html, /Review/)
  assert.match(html, /data-gooey-svg=""/)
  assert.match(html, /aria-hidden="true"/)
})
