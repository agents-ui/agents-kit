import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import { compile } from "@tailwindcss/node"
import { Scanner } from "@tailwindcss/oxide"

test("the shared Tailwind pipeline compiles Beautiful UI tokens", async () => {
  const appDir = path.join(process.cwd(), "app")
  const compiler = await compile(
    await readFile(path.join(appDir, "globals.css"), "utf8"),
    {
      base: appDir,
      onDependency() {},
    }
  )
  const scanner = new Scanner({ sources: [] })
  const candidates = scanner.scanFiles([
    {
      content:
        '<div class="rounded-card bg-surface text-ink-2 font-mono"></div>',
      extension: "html",
    },
  ])
  const css = compiler.build(candidates)

  assert.doesNotMatch(css, /@theme/)
  assert.doesNotMatch(css, /pre\.shiki\s*\{[^}]*background-color:\s*transparent\s*!important/)
  assert.match(css, /\.rounded-card\s*{\s*border-radius:\s*10px;/)
  assert.match(css, /\.bg-surface\s*{\s*background-color:\s*var\(--surface\);/)
  assert.match(css, /\.text-ink-2\s*{\s*color:\s*var\(--ink-2\);/)
  assert.match(
    css,
    /\.font-mono\s*{\s*font-family:\s*var\(--font-jetbrains-mono\)/
  )
  assert.doesNotMatch(
    css,
    /\.font-mono\s*{\s*font-family:\s*var\(--font-mono\)/
  )
})

test("agents.css provides fonts and radii without collection styles", async () => {
  const root = process.cwd()
  const compiler = await compile(
    '@import "tailwindcss"; @import "./styles/agents.css";',
    {
      base: root,
      onDependency() {},
    }
  )
  const scanner = new Scanner({ sources: [] })
  const candidates = scanner.scanFiles([
    {
      content:
        '<div class="rounded-chip rounded-control rounded-card rounded-window font-sans font-mono"></div>',
      extension: "html",
    },
  ])
  const css = compiler.build(candidates)

  assert.match(css, /\.rounded-chip\s*{\s*border-radius:\s*6px;/)
  assert.match(css, /\.rounded-control\s*{\s*border-radius:\s*8px;/)
  assert.match(css, /\.rounded-card\s*{\s*border-radius:\s*10px;/)
  assert.match(css, /\.rounded-window\s*{\s*border-radius:\s*14px;/)
  assert.match(
    css,
    /\.font-sans\s*{\s*font-family:\s*var\(--font-inter\), ui-sans-serif/
  )
  assert.match(
    css,
    /\.font-mono\s*{\s*font-family:\s*var\(--font-jetbrains-mono\), ui-monospace/
  )
})
