import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"

const root = process.cwd()
const site = "https://agents-ui.github.io/agents-kit"
const repo = "https://github.com/agents-ui/agents-kit"
const version = JSON.parse(fs.readFileSync("package.json", "utf8")).version
interface RegistryItem {
  name: string
  description: string
  categories: string[]
  dependencies: string[]
  files: { path: string; content: string }[]
}
const items: RegistryItem[] = JSON.parse(
  fs.readFileSync("public/c/registry.json", "utf8")
).items
const currentAgentEntries = new Set([
  "agent-generative-surface",
  "agent-thinking-indicator",
  "agent-context-meter",
  "agent-checkpoint",
])
function collection(item: RegistryItem) {
  const category = item.categories[0]
  if (
    category === "Prompt Kit" ||
    (category === "Agents Kit" && !currentAgentEntries.has(item.name))
  )
    return "v0.1 compatibility"
  return category === "Agents Kit"
    ? "Generated results and runtime controls"
    : category
}
const groups = new Map<string, RegistryItem[]>()
for (const item of [...items].sort((a, b) =>
  a.name.localeCompare(b.name, "en")
)) {
  const key = collection(item)
  groups.set(key, [...(groups.get(key) || []), item])
}
const groupNames = [...groups.keys()]
  .filter((name) => name !== "v0.1 compatibility")
  .concat("v0.1 compatibility")
const header = `# Agents Kit ${version}\n\n> React components for conversations, generated results, and agent interactions. Copy source into your application through the shadcn-compatible registry.\n\nComponents receive data through props and return user intent through callbacks. Your application owns model calls, streaming, tool execution, permissions, and persistence. This library does not supply an agent backend.\n`
const links = `\n## Documentation\n\n- [Overview](${site}/docs/introduction)\n- [Installation and required styles](${site}/docs/installation)\n- [Component catalog](${site}/components)\n- [Generative playground](${site}/generative)\n- [MCP setup](${site}/docs/mcp): use the standard shadcn MCP server with the @agents-kit registry namespace.\n- [Registry index](${site}/c/registry.json)\n- [Full API reference](${site}/llms-full.txt)\n- [v0.1 archive](${site}/v0.1)\n- [Migration guide](${repo}/blob/main/docs/migrating-to-v0.2.md)\n- [Source and README](${repo})\n- [Credits and licenses](${repo}/blob/main/THIRD_PARTY_NOTICES.md)\n`
function inventory(detailed: boolean) {
  return (
    `\n## Registry catalog\n\n${items.length} installable entries. Related source variants share a family in the visual catalog. Registry names and file paths remain explicit here.\n\n` +
    groupNames
      .map((name) => {
        const entries = groups.get(name) || []
        return (
          `### ${name} (${entries.length})\n\n` +
          entries
            .map((item) => {
              const url = `${site}/c/${item.name}.json`
              if (!detailed)
                return `- [${item.name}](${url}): ${item.description}\n`
              const entry = item.files[0].path
              return `#### ${item.name}\n\n${item.description}\n\n- Registry: ${url}\n- Entry source: [${entry}](${repo}/blob/main/${entry})\n- Import path (default alias): \`@/${entry.replace(/\.(tsx?|jsx?)$/, "")}\`\n- Dependencies: ${item.dependencies.length ? item.dependencies.map((dep) => `\`${dep}\``).join(", ") : "No additional npm dependencies."}\n\n\`\`\`bash\nnpx shadcn@latest add ${url}\n\`\`\`\n\n`
            })
            .join("")
        )
      })
      .join("\n")
  )
}
function guide(slug: string) {
  const content = fs.readFileSync(`app/docs/${slug}/page.mdx`, "utf8")
  const start = content.indexOf("\n# ")
  assert.ok(start >= 0, `Missing Markdown guide: ${slug}`)
  // These guides deliberately use plain Markdown after their MDX metadata header.
  return content
    .slice(start + 1)
    .replace(/^#/gm, "##")
    .replace(/\]\((\/(?!\/)[^)]+)\)/g, `](${site}$1)`)
}

// Emit declarations from the same public source files that the registry ships.
// TypeScript resolves re-exports and inferred props without duplicating handwritten API tables.
const sourceFiles = new Set<string>()
for (const item of items) {
  for (const file of item.files) {
    assert.match(
      file.path,
      /^(components\/(agents-ui|beautiful-ui|beui|blocks-so|boardui|effects|prompt-kit|ui)|hooks|lib|styles)\//
    )
    assert.ok(!file.path.split("/").includes(".."), "Unexpected registry path")
    const resolved = fs.realpathSync(path.join(root, file.path))
    assert.equal(
      path.relative(root, resolved).replaceAll(path.sep, "/"),
      file.path
    )
    assert.equal(
      fs.readFileSync(resolved, "utf8"),
      file.content,
      `Stale registry: ${file.path}. Run npm run build:registry.`
    )
    if (/\.tsx?$/.test(file.path)) sourceFiles.add(file.path)
  }
}
const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile)
assert.ok(!config.error, "Cannot read tsconfig.json")
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
const program = ts.createProgram(
  [...sourceFiles].map((file) => path.join(root, file)),
  {
    ...options,
    noEmit: false,
    declaration: true,
    emitDeclarationOnly: true,
    declarationMap: false,
    incremental: false,
    outDir: path.join(root, ".llm-declarations-unused"),
  }
)
const declarations = new Map<string, string>()
const emitted = program.emit(
  undefined,
  (_file, text, _bom, _error, sources) => {
    const source = sources?.[0]
    if (!source) return
    const relative = path
      .relative(root, source.fileName)
      .replaceAll(path.sep, "/")
    if (sourceFiles.has(relative)) declarations.set(relative, text.trim())
  },
  undefined,
  true
)
if (emitted.emitSkipped || emitted.diagnostics.length) {
  throw new Error(
    ts.formatDiagnosticsWithColorAndContext(emitted.diagnostics, {
      getCanonicalFileName: (file) => file,
      getCurrentDirectory: () => root,
      getNewLine: () => "\n",
    })
  )
}
for (const file of sourceFiles)
  assert.ok(declarations.has(file), `Missing declaration: ${file}`)
const appendix =
  "\n## TypeScript API reference\n\nThese declarations are generated from the shipped public source. They describe types and exports, not runtime implementations. Follow relative imports within this appendix; external package types remain in their respective packages. Source files and license notices are included in each registry entry.\n\n" +
  [...declarations]
    .sort(([a], [b]) => a.localeCompare(b, "en"))
    .map(
      ([file, declaration]) =>
        `### ${file}\n\n[Implementation](${repo}/blob/main/${file})\n\n\`\`\`ts\n${declaration}\n\`\`\`\n`
    )
    .join("\n")
const outputs = {
  "llms.txt": header + links + inventory(false),
  "llms-full.txt":
    header +
    links +
    "\n" +
    ["introduction", "installation", "mcp"].map(guide).join("\n") +
    inventory(true) +
    appendix,
}
for (const [file, content] of Object.entries(outputs)) {
  if (process.argv.includes("--check"))
    assert.equal(
      fs.readFileSync(file, "utf8"),
      content,
      `${file} is stale. Run npm run generate-llms-txt.`
    )
  else fs.writeFileSync(file, content)
}
console.log(
  `${process.argv.includes("--check") ? "Verified" : "Generated"} both LLM documents for Agents Kit ${version}: ${items.length} registry entries, ${declarations.size} public API files.`
)
