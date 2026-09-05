import assert from "node:assert/strict"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { AgentGenerativeSurface } from "../components/agents-ui/agent-generative-surface"
import { galleryEntries } from "../components/gallery/catalog"
import { groupEntries } from "../components/gallery/families"
import { generatedExamples } from "../components/gallery/generative-previews"

Object.assign(globalThis, { React })

test("all sixteen generated content shapes render useful supplied content", () => {
  assert.equal(
    new Set(generatedExamples.map((example) => example.type)).size,
    16
  )
  for (const content of generatedExamples) {
    const html = renderToStaticMarkup(
      <AgentGenerativeSurface content={content} animate={false} />
    )
    assert.ok(html.includes("<section"), content.type)
    assert.ok(!html.includes("NaN"), content.type)
    assert.ok(html.length > 250, content.type)
  }
})

test("loading and error replace stale content; progress is bounded", () => {
  const content = {
    type: "flight",
    origin: "SFO",
    originName: "Origin",
    destination: "JFK",
    destinationName: "Destination",
    departure: "09:00",
    arrival: "12:00",
    progress: 180,
    status: "Scheduled",
  } as const
  const html = renderToStaticMarkup(
    <AgentGenerativeSurface content={content} animate={false} />
  )
  assert.match(html, /aria-valuenow="100"/)
  const loading = renderToStaticMarkup(
    <AgentGenerativeSurface
      content={content}
      status="loading"
      animate={false}
    />
  )
  assert.match(loading, /aria-busy="true"/)
  assert.doesNotMatch(loading, /SFO/)
  const failed = renderToStaticMarkup(
    <AgentGenerativeSurface
      content={content}
      status="error"
      error="The source is unavailable"
      onRetry={() => {}}
      animate={false}
    />
  )
  assert.match(failed, /The source is unavailable/)
  assert.match(failed, /Retry/)
  assert.doesNotMatch(failed, /SFO/)
})

test("v0.2 grouping retains every required collection entry without v0.1 business widgets", () => {
  assert.equal(
    galleryEntries.filter((entry) => entry.category === "Beautiful UI").length,
    21
  )
  assert.equal(
    galleryEntries.filter((entry) => entry.category === "beUI").length,
    17
  )
  const families = groupEntries(galleryEntries)
  const slugs = families.flatMap((family) =>
    family.entries.map((entry) => entry.slug)
  )
  assert.equal(slugs.length, galleryEntries.length)
  assert.equal(new Set(slugs).size, slugs.length)
  assert.ok(families.some((family) => family.name === "Agent Screen"))
  assert.ok(families.some((family) => family.name === "Generated results"))
  assert.ok(!slugs.includes("agent-competitor-research"))
  assert.ok(!slugs.includes("agent-revenue-insights"))
})
