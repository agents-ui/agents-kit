import "server-only"
import { readdir, readFile, realpath } from "node:fs/promises"
import path from "node:path"

export async function readGallerySources() {
  const root = process.cwd()
  const directories = [
    "components/agents-ui",
    "components/prompt-kit",
    "components/blocks",
    "components/blocks-so",
    "components/beautiful-ui",
    "components/beui",
    "components/effects",
  ]
  const allowed = directories.map(
    (directory) => path.resolve(root, directory) + path.sep
  )
  const checked = async (filename: string) => {
    const absolute = await realpath(filename)
    if (!allowed.some((prefix) => absolute.startsWith(prefix)))
      throw new Error(
        "Source must stay inside the public component directories"
      )
    return absolute
  }
  async function walk(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true })
    const files = await Promise.all(
      entries.map(async (entry) => {
        const filename = path.join(directory, entry.name)
        if (entry.isSymbolicLink()) return []
        if (entry.isDirectory()) return walk(await checked(filename))
        return entry.isFile() && /\.tsx?$/.test(entry.name)
          ? [await checked(filename)]
          : []
      })
    )
    return files.flat()
  }
  const files = (
    await Promise.all(
      directories.map((directory) => walk(path.resolve(root, directory)))
    )
  ).flat()
  return Object.fromEntries(
    await Promise.all(
      files.map(async (filename) => {
        const relative = path.relative(root, filename).replaceAll(path.sep, "/")
        const source = await readFile(filename, "utf8")
        const match = source.match(
          /from\s+["'](@\/components\/(?:agents-ui|blocks-so)\/application\/[A-Za-z0-9/_-]+|\.\/application\/[A-Za-z0-9/_-]+)["']/
        )
        if (!match) return [relative, source]
        const candidate = match[1].startsWith("@/")
          ? path.resolve(root, match[1].slice(2) + ".tsx")
          : path.resolve(path.dirname(filename), match[1] + ".tsx")
        const implementation = await checked(candidate)
        return [
          relative,
          `// ${relative}\n${source}\n\n// ${path.relative(root, implementation)}\n${await readFile(implementation, "utf8")}`,
        ]
      })
    )
  )
}
