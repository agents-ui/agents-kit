import { PublicHeader } from "@/components/gallery/public-header"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Documentation | Agents Kit",
  description:
    "Install, integrate, and migrate to the Agents Kit v0.2 generative UI component library.",
}

const guides = [
  {
    href: "/docs/installation",
    title: "Installation",
    description:
      "Add components to your application, load the styles, and connect your data.",
  },
  {
    href: "/docs/mcp",
    title: "MCP setup",
    description:
      "Let your coding assistant find and inspect components through the shadcn MCP server.",
  },
  {
    href: "/llms-full.txt",
    title: "LLM reference",
    description:
      "Read the current installation guide, registry inventory, and generated TypeScript APIs as plain text.",
  },
  {
    href: "/components",
    title: "Component catalog",
    description:
      "Browse the v0.2 families for thinking, messages, approvals, tools, tasks, citations, code, media, and complete agent surfaces.",
  },
  {
    href: "/generative",
    title: "Generative UI",
    description:
      "Review generated answers and structured work products across ready, loading, and error states.",
  },
  {
    href: "/v0.1",
    title: "v0.1 archive",
    description:
      "Use the previous gallery while existing entry paths and registry slugs remain available for compatibility.",
  },
]

export default function DocsPage() {
  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 sm:py-20">
        <header className="max-w-3xl">
          <p className="text-text-secondary text-sm">Documentation</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Build useful agent interfaces from controlled React components.
          </h1>
          <p className="text-text-secondary mt-5 max-w-2xl text-base leading-7">
            Agents Kit v0.2 organizes generative answers, reasoning states,
            approvals, tools, tasks, messages, citations, code, and media into a
            focused copy-source library as model capabilities and product
            interfaces change.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/components"
              className="bg-button-primary inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium"
            >
              Browse components
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              href="/generative"
              className="border-border-button-default bg-background-primary-default hover:bg-background-primary-hover inline-flex min-h-10 items-center rounded-lg border px-4 text-sm font-medium"
            >
              Open Generative UI
            </Link>
          </div>
        </header>

        <section className="border-separator-border mt-14 grid border-y sm:grid-cols-3">
          <div className="py-6 sm:pr-6">
            <p className="text-2xl font-semibold tabular-nums">21</p>
            <p className="text-text-secondary mt-1 text-sm">
              Beautiful UI families
            </p>
          </div>
          <div className="border-separator-border border-t py-6 sm:border-t-0 sm:border-l sm:px-6">
            <p className="text-2xl font-semibold tabular-nums">17</p>
            <p className="text-text-secondary mt-1 text-sm">
              beUI agent families
            </p>
          </div>
          <div className="border-separator-border border-t py-6 sm:border-t-0 sm:border-l sm:pl-6">
            <p className="text-2xl font-semibold tabular-nums">16</p>
            <p className="text-text-secondary mt-1 text-sm">
              Generative answer and work shapes
            </p>
          </div>
        </section>

        <section className="mt-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Start with the surface you need
            </h2>
            <p className="text-text-secondary mt-3 text-sm leading-6">
              Related source variants are grouped into one family so you can
              compare behavior without sorting through repeated components.
            </p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="border-separator-border bg-background-primary-default hover:bg-background-primary-hover group rounded-2xl border p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-medium">{guide.title}</h3>
                  <ArrowRight
                    aria-hidden="true"
                    className="text-text-tertiary size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </div>
                <p className="text-text-secondary mt-3 text-sm leading-6">
                  {guide.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-separator-border mt-16 grid gap-10 border-t pt-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Integration model
            </h2>
            <p className="text-text-secondary mt-3 text-sm leading-6">
              Components receive data through props and return intent through
              callbacks. Your application owns model calls, streaming, tool
              execution, permissions, persistence, and network activity.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Moving from v0.1
            </h2>
            <p className="text-text-secondary mt-3 text-sm leading-6">
              Existing public entry paths and registry slugs stay available.
              Adopt v0.2 one surface at a time without an automatic breaking
              rename.
            </p>
            <a
              href="https://github.com/agents-ui/agents-kit/blob/main/docs/migrating-to-v0.2.md"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
            >
              Read the migration guide
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </section>

        <aside className="border-separator-border bg-background-secondary-default mt-14 rounded-2xl border p-5">
          <p className="text-sm font-medium">v0.2.0</p>
          <p className="text-text-secondary mt-2 text-sm leading-6">
            Released 2026-09-05. Existing v0.1 paths remain available, with an
            archive for the previous component collection.
          </p>
        </aside>
      </main>
    </>
  )
}
