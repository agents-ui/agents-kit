import fs from "node:fs"
import path from "node:path"
import { components as promptComponents } from "./registry-components"

const root = process.cwd()
const output = path.join(root, "public/c")
const allowedRoots = [
  "components/agents-ui/",
  "components/blocks-so/",
  "components/boardui/",
  "components/beautiful-ui/",
  "components/beui/",
  "components/effects/",
  "components/prompt-kit/",
  "components/ui/",
  "hooks/",
  "lib/",
  "styles/",
]
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8")
)
type RegistryFile = {
  path: string
  target: string
  type:
    | "registry:file"
    | "registry:component"
    | "registry:hook"
    | "registry:lib"
  content: string
}

function publicFile(file: string) {
  const relative = path
    .relative(root, fs.realpathSync(file))
    .replaceAll(path.sep, "/")
  if (!allowedRoots.some((prefix) => relative.startsWith(prefix)))
    throw new Error(
      `Registry source is outside the public component roots: ${relative}`
    )
  return relative
}

function resolveLocal(specifier: string, importer: string) {
  const start = specifier.startsWith("@/")
    ? path.join(root, specifier.slice(2))
    : specifier.startsWith(".")
      ? path.resolve(path.dirname(importer), specifier)
      : null
  if (!start) return null
  for (const file of [
    start,
    `${start}.tsx`,
    `${start}.ts`,
    path.join(start, "index.tsx"),
    path.join(start, "index.ts"),
  ]) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return file
  }
  throw new Error(
    `Missing local registry dependency ${specifier} from ${publicFile(importer)}`
  )
}

function collect(
  entry: string,
  files: Map<string, RegistryFile>,
  dependencies: Set<string>
) {
  const relative = publicFile(entry)
  if (files.has(relative)) return
  const content = fs.readFileSync(entry, "utf8")
  const type = relative.startsWith("hooks/")
    ? "registry:hook"
    : relative.startsWith("lib/")
      ? "registry:lib"
      : /\.(tsx?|jsx?)$/.test(relative)
        ? "registry:component"
        : "registry:file"
  const target = relative.startsWith("components/")
    ? `@components/${relative.slice(11)}`
    : relative.startsWith("hooks/")
      ? `@hooks/${relative.slice(6)}`
      : relative.startsWith("lib/")
        ? `@lib/${relative.slice(4)}`
        : `~/${relative}`
  files.set(relative, { path: relative, target, type, content })
  if (!/\.(tsx?|jsx?)$/.test(relative)) return
  for (const [, specifier] of content.matchAll(
    /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)["']([^"']+)["']/g
  )) {
    const local = resolveLocal(specifier, entry)
    if (local) collect(local, files, dependencies)
    else {
      const name = specifier.startsWith("@")
        ? specifier.split("/").slice(0, 2).join("/")
        : specifier.split("/")[0]
      if (
        !["react", "react-dom"].includes(name) &&
        (packageJson.dependencies[name] || packageJson.devDependencies[name])
      )
        dependencies.add(name)
    }
  }
}

const definitions = [
  ...promptComponents.map((item) => ({
    name: item.name,
    path: item.path,
    description: item.description,
    source: "Prompt Kit",
    dependencies: item.dependencies ?? [],
    tailwind: item.tailwind,
    cssVars: item.cssVars,
  })),
  ...["agents-ui", "blocks-so", "beautiful-ui", "effects"].flatMap((folder) =>
    fs
      .readdirSync(path.join(root, "components", folder))
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => ({
        name:
          folder === "beautiful-ui"
            ? `beautiful-${file.slice(0, -4)}`
            : file.slice(0, -4),
        path: path.join(root, "components", folder, file),
        description: file.slice(0, -4).replaceAll("-", " "),
        source:
          folder === "agents-ui"
            ? "Agents Kit"
            : folder === "beautiful-ui"
              ? "Beautiful UI"
              : folder === "effects"
                ? "Libraries.dev"
                : "Blocks.so",
        dependencies: [] as string[],
        tailwind: undefined,
        cssVars: undefined,
      }))
  ),
  ...[
    {
      name: "beui-message-bubble",
      relative: "components/beui/components/agents/message-bubble.tsx",
      title: "Message Bubble",
    },
    {
      name: "beui-message",
      relative: "components/beui/components/agents/message.tsx",
      title: "Message",
    },
    {
      name: "beui-message-scroller",
      relative: "components/beui/components/agents/message-scroller.tsx",
      title: "Message Scroller",
    },
    {
      name: "beui-prompt-input",
      relative: "components/beui/components/agents/prompt-input.tsx",
      title: "Prompt Input",
    },
    {
      name: "beui-todo-list",
      relative: "components/beui/components/agents/todo-list.tsx",
      title: "Todo List",
    },
    {
      name: "beui-code-block",
      relative: "components/beui/components/agents/code-block.tsx",
      title: "Code Block",
    },
    {
      name: "beui-approval-card",
      relative: "components/beui/components/agents/approval-card/index.tsx",
      title: "Approval Card",
    },
    {
      name: "beui-file-diff",
      relative: "components/beui/components/agents/file-diff.tsx",
      title: "File Diff",
    },
    {
      name: "beui-tool-result",
      relative: "components/beui/components/agents/tool-result.tsx",
      title: "Tool Result",
    },
    {
      name: "beui-streaming-response",
      relative: "components/beui/components/agents/streaming-response.tsx",
      title: "Streaming Response",
    },
    {
      name: "beui-image-generation",
      relative: "components/beui/components/agents/image-generation.tsx",
      title: "Image Generation",
    },
    {
      name: "beui-tool-approval",
      relative: "components/beui/components/agents/tool-approval.tsx",
      title: "Tool Approval",
    },
    {
      name: "beui-citations",
      relative: "components/beui/components/agents/citations.tsx",
      title: "Citations",
    },
    {
      name: "beui-agent-activity",
      relative: "components/beui/components/agents/agent-activity/index.tsx",
      title: "Agent Activity",
    },
    {
      name: "beui-reasoning-text",
      relative:
        "components/beui/components/agents/loading-states/reasoning-text.tsx",
      title: "Agent Loading States Reasoning Text",
    },
    {
      name: "beui-thinking-shimmer",
      relative:
        "components/beui/components/agents/loading-states/thinking-shimmer.tsx",
      title: "Agent Loading States Thinking Shimmer",
    },
    {
      name: "beui-agent-progress",
      relative:
        "components/beui/components/agents/loading-states/agent-progress.tsx",
      title: "Agent Loading States Agent Progress",
    },
    {
      name: "beui-ai-sidebar",
      relative: "components/beui/components/agents/ai-sidebar.tsx",
      title: "AI Sidebar",
    },
    {
      name: "beui-chat-app",
      relative: "components/beui/components/agents/chat-app.tsx",
      title: "Chat App",
    },
  ].map((item) => ({
    name: item.name,
    path: path.join(root, item.relative),
    description: item.title,
    source: "beUI",
    dependencies: [] as string[],
    tailwind: undefined,
    cssVars: undefined,
  })),
]

fs.mkdirSync(output, { recursive: true })
const items = definitions.map((definition) => {
  const files = new Map<string, RegistryFile>()
  const dependencies = new Set(definition.dependencies)
  collect(definition.path, files, dependencies)
  if (
    [...files.keys()].some((file) => file.startsWith("components/boardui/"))
  ) {
    for (const file of [
      "components/boardui/styles/globals.css",
      "components/boardui/styles/theme.css",
      "components/boardui/styles/typography.css",
      "components/boardui/LICENSE",
      "styles/agents.css",
    ])
      collect(path.join(root, file), files, dependencies)
  }
  if (definition.source === "Agents Kit")
    collect(
      path.join(root, "components/agents-ui/LICENSE.md"),
      files,
      dependencies
    )
  if (definition.source === "Blocks.so")
    collect(
      path.join(root, "components/blocks-so/LICENSE.md"),
      files,
      dependencies
    )
  for (const folder of ["beautiful-ui", "beui"]) {
    if (
      [...files.keys()].some((file) => file.startsWith(`components/${folder}/`))
    ) {
      for (const name of ["LICENSE", "SOURCE.json"])
        collect(
          path.join(root, "components", folder, name),
          files,
          dependencies
        )
    }
  }
  for (const folder of ["thinking-indicator", "context-meter", "checkpoint"]) {
    const prefix = `components/agents-ui/application/${folder}/`
    if ([...files.keys()].some((file) => file.startsWith(prefix))) {
      for (const name of ["LICENSE", "NOTICE.md", "SOURCE.json"])
        collect(path.join(root, prefix, name), files, dependencies)
    }
  }
  for (const effect of ["border-beam", "liquid-gooey"]) {
    const prefix = `components/effects/${effect}/`
    if ([...files.keys()].some((file) => file.startsWith(prefix))) {
      for (const name of ["LICENSE", "SOURCE.json"])
        collect(path.join(root, prefix, name), files, dependencies)
    }
  }
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: definition.name,
    type: "registry:block",
    title: definition.name
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" "),
    description: definition.description,
    dependencies: [...dependencies].sort(),
    registryDependencies: [],
    ...(definition.tailwind && { tailwind: definition.tailwind }),
    ...(definition.cssVars && { cssVars: definition.cssVars }),
    files: [...files.values()],
    categories: [definition.source],
  }
  fs.writeFileSync(
    path.join(output, `${definition.name}.json`),
    JSON.stringify(item, null, 2) + "\n"
  )
  return item
})
fs.writeFileSync(
  path.join(output, "registry.json"),
  JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "agents-kit",
      homepage: "https://agents-ui.github.io/agents-kit",
      items,
    },
    null,
    2
  ) + "\n"
)
console.log(
  `Built ${items.length} public registry entries with their local dependency files.`
)
