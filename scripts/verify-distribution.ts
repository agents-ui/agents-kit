import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { routes } from "../app/routes"

const root = process.cwd()
const exportDir = process.env.NEXT_DIST_DIR || "out"
execFileSync("npm", ["run", "check:llms"], { stdio: "inherit" })
for (const file of ["llms.txt", "llms-full.txt"]) {
  if (fs.existsSync(exportDir)) {
    assert.equal(
      fs.readFileSync(path.join(exportDir, file), "utf8"),
      fs.readFileSync(file, "utf8"),
      `Exported ${file} differs from the current release. Rebuild the site.`
    )
  }
}
if (fs.existsSync(exportDir)) {
  for (const route of routes) {
    const file =
      route.path === "/" ? "index.html" : `${route.path.slice(1)}.html`
    assert.ok(
      fs.existsSync(path.join(exportDir, file)),
      `Navigation points to a missing page: ${route.path}`
    )
  }
}
const allowed = [
  "components/agents-ui/",
  "components/boardui/",
  "components/beautiful-ui/",
  "components/beui/",
  "components/effects/",
  "components/blocks-so/",
  "components/prompt-kit/",
  "components/ui/",
  "hooks/",
  "lib/",
  "styles/",
]
const index = JSON.parse(fs.readFileSync("public/c/registry.json", "utf8"))
const names = new Set<string>()
let fileCount = 0
for (const item of index.items) {
  assert.ok(!names.has(item.name), `Duplicate registry name: ${item.name}`)
  names.add(item.name)
  const standalone = JSON.parse(
    fs.readFileSync(`public/c/${item.name}.json`, "utf8")
  )
  assert.deepEqual(
    standalone,
    item,
    `Aggregate and standalone registry differ: ${item.name}`
  )
  for (const file of item.files) {
    assert.ok(
      !path.isAbsolute(file.path) && !file.path.split("/").includes(".."),
      "Registry paths must be relative"
    )
    const resolved = fs.realpathSync(path.resolve(root, file.path))
    const relative = path.relative(root, resolved).replaceAll(path.sep, "/")
    assert.ok(
      allowed.some((prefix) => relative.startsWith(prefix)),
      "Registry path left the public source roots"
    )
    assert.equal(
      file.content,
      fs.readFileSync(resolved, "utf8"),
      `Stale registry source: ${file.path}`
    )
    fileCount++
  }
}
const packageInfo = JSON.parse(
  execFileSync("npm", ["pack", "--dry-run", "--ignore-scripts", "--json"], {
    encoding: "utf8",
  })
)[0]
const blocked = /(^|\/)(vendor|\.env(?:\..*)?|\.git|\.omx|node_modules)(\/|$)/
for (const file of packageInfo.files) {
  assert.ok(
    !blocked.test(file.path),
    "Private or local-only path entered package"
  )
  assert.ok(
    !file.path.startsWith("components/gallery/") &&
      !file.path.startsWith("components/app/"),
    "Site helper entered library package"
  )
}
const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean)
assert.ok(
  !tracked.some((file) => blocked.test(file)),
  "Local-only material is tracked"
)
console.log(
  `Verified ${names.size} registry entries, ${fileCount} fresh source payloads, and ${packageInfo.files.length} package files.`
)
