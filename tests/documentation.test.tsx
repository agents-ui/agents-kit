import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import { getBaseUrl, getSitePathname } from "../lib/utils"

const read = (file: string) => fs.readFileSync(file, "utf8")
const registry = JSON.parse(read("public/c/registry.json"))
const version = JSON.parse(read("package.json")).version

test("base-path home URLs stay on the public layout", () => {
  assert.equal(getSitePathname("/agents-kit", "/agents-kit"), "/")
  assert.equal(getSitePathname("/agents-kit/", "/agents-kit"), "/")
  assert.equal(
    getSitePathname("/agents-kit/docs/mcp/", "/agents-kit"),
    "/docs/mcp"
  )
  assert.equal(getSitePathname("/components", "/agents-kit"), "/components")
  assert.equal(
    getSitePathname("/agents-kit-other", "/agents-kit"),
    "/agents-kit-other"
  )
})

test("LLM documents describe this release and expose every installable entry", () => {
  const short = read("llms.txt")
  const full = read("llms-full.txt")
  for (const document of [short, full]) {
    assert.ok(document.startsWith(`# Agents Kit ${version}\n`))
    assert.doesNotMatch(
      document,
      /prompt-kit\.com|agents-ui-kit\.com|registry:mcp|<ComponentCodePreview|generateMetadata/
    )
    assert.match(document, /v0\.1 compatibility/)
    for (const item of registry.items) {
      assert.ok(
        document.includes(`/c/${item.name}.json`),
        `${item.name} is missing`
      )
    }
  }
  assert.match(full, /interface AgentGenerativeSurfaceProps/)
  assert.match(full, /type GeneratedContent/)
  assert.match(full, /onAction\?:/)
  assert.match(full, /Madrid/)
})

test("published component install commands resolve to this registry", () => {
  const names = new Set(
    registry.items.map((item: { name: string }) => item.name)
  )
  const docs = fs
    .readdirSync("app/docs", { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join("app/docs", entry.name, "page.mdx"))
    .filter(fs.existsSync)
  let commands = 0
  for (const file of docs) {
    const content = read(file)
    assert.doesNotMatch(
      content,
      /agents-ui-kit\.com|prompt-kit\.com\/c\/|agents-ui-kit\/agents-ui\/|registry:mcp/,
      file
    )
    for (const match of content.matchAll(
      /https:\/\/agents-ui\.github\.io\/agents-kit\/c\/([a-z0-9-]+)\.json/g
    )) {
      assert.ok(
        match[1] === "registry" || names.has(match[1]),
        `${file}: unknown ${match[1]}`
      )
      commands++
    }
  }
  assert.ok(commands >= 44, "Legacy installation guides must remain available")
})

test("base URLs preserve the GitHub Pages subpath on server and browser", () => {
  const keys = [
    "NEXT_PUBLIC_BASE_PATH",
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL",
    "NEXT_PUBLIC_VERCEL_BRANCH_URL",
    "NEXT_PUBLIC_VERCEL_URL",
    "VERCEL_URL",
    "NODE_ENV",
  ]
  const original = new Map(keys.map((key) => [key, process.env[key]]))
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window")
  try {
    keys.forEach((key) => delete process.env[key])
    Object.assign(process.env, { NODE_ENV: "production" })
    process.env.NEXT_PUBLIC_BASE_PATH = "/agents-kit"
    assert.equal(getBaseUrl(), "/agents-kit")
    process.env.NEXT_PUBLIC_BASE_URL = "https://example.com/agents-kit/"
    assert.equal(getBaseUrl(), "https://example.com/agents-kit")
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { location: { origin: "https://agents-ui.github.io" } },
    })
    assert.equal(getBaseUrl(), "https://agents-ui.github.io/agents-kit")
    delete process.env.NEXT_PUBLIC_BASE_PATH
    assert.equal(getBaseUrl(), "https://agents-ui.github.io")
  } finally {
    for (const [key, value] of original) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
    if (windowDescriptor)
      Object.defineProperty(globalThis, "window", windowDescriptor)
    else Reflect.deleteProperty(globalThis, "window")
  }
})


test("registry installs original styles and third-party notices with their components", () => {
  const includes = (name: string, file: string) => {
    const item = registry.items.find((entry: { name: string }) => entry.name === name)
    assert.ok(item, `Missing registry entry: ${name}`)
    assert.ok(item.files.some((entry: { path: string }) => entry.path === file), `${name} must include ${file}`)
  }
  includes("loader", "components/prompt-kit/styles.css")
  includes("loader", "styles/animations.css")
  includes("agent-response", "components/prompt-kit/styles.css")
  includes("ai-elements-message", "components/ai-elements/markdown.css")
  includes("ai-elements-reasoning", "components/ai-elements/markdown.css")
  includes("ai-elements-message", "components/ai-elements/_ui/LICENSE")
  includes("beautiful-original-prompt-bar", "components/beautiful-ui/original/beautiful-ui.css")
  includes("blocks-so-ai-02", "components/blocks-so/LICENSE.md")
  includes("boardui-agent-chat", "components/boardui/LICENSE")
  includes("metal-fx", "components/effects/metal-fx/PAPER_SHADERS_LICENSE")
  includes("metal-fx", "components/effects/metal-fx/PAPER_SHADERS_NOTICE")
})
