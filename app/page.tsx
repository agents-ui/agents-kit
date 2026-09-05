import { GenerativeShowcase } from "@/components/gallery/generative-previews"
import { PublicHeader } from "@/components/gallery/public-header"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <PublicHeader />
      <main>
        <section className="mx-auto max-w-[860px] px-5 pt-20 pb-16 text-center sm:pt-28">
          <p className="text-text-secondary text-xs">Agents Kit v0.2</p>
          <h1 className="mt-5 text-4xl leading-[1.08] font-semibold tracking-tight sm:text-6xl">
            Build better
            <br />
            agent interfaces.
          </h1>
          <p className="text-text-secondary mx-auto mt-6 max-w-xl text-base leading-7">
            Messages, tools, approvals, and results people can work with. Built
            in React. Yours to copy and change.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/components"
              className="bg-button-primary inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium"
            >
              Browse components
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/generative"
              className="border-border-button-default inline-flex h-9 items-center gap-2 rounded-lg border px-4 text-sm font-medium"
            >
              Open playground
            </Link>
          </div>
          <p className="text-text-tertiary mt-6 text-xs">
            Using v0.1?{" "}
            <Link href="/v0.1" className="underline underline-offset-4">
              Your collection is still available.
            </Link>
          </p>
        </section>
        <section className="border-separator-border mx-auto max-w-[1120px] border-t px-5 py-12 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-text-secondary text-xs">Generated results</p>
              <h2 className="mt-2 text-xl font-medium tracking-tight">
                Results you can work with.
              </h2>
            </div>
            <Link
              href="/generative"
              className="text-text-secondary hover:text-text-primary text-sm"
            >
              Explore all 16 outputs
            </Link>
          </div>
          <GenerativeShowcase grid featured />
          <p className="text-text-tertiary mt-6 text-xs">
            Illustrative data. Connect each component to your own model and
            tools.
          </p>
        </section>

        <section className="border-separator-border mx-auto max-w-[1120px] border-t px-5 py-12 sm:px-8">
          <p className="text-text-secondary text-xs">
            From prompt to useful result
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            The pieces you need, together.
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium">Show what is happening</h3>
              <p className="text-text-secondary mt-2 text-[13px] leading-6">
                Thinking states, tool activity, progress, and source citations
                keep people oriented while an agent works.
              </p>
              <Link
                href="/components#thinking"
                className="mt-4 inline-block text-xs underline underline-offset-4"
              >
                Explore activity components
              </Link>
            </div>
            <div>
              <h3 className="text-sm font-medium">Ask before making changes</h3>
              <p className="text-text-secondary mt-2 text-[13px] leading-6">
                Review proposed changes, compare options, request approval, and
                return to a checkpoint with explicit actions.
              </p>
              <Link
                href="/components#approval-card"
                className="mt-4 inline-block text-xs underline underline-offset-4"
              >
                Explore decision components
              </Link>
            </div>
            <div>
              <h3 className="text-sm font-medium">Make results easy to use</h3>
              <p className="text-text-secondary mt-2 text-[13px] leading-6">
                Sixteen result types cover documents, comparisons, checklists,
                media, inboxes, and more. Ready, loading, and error states are
                part of the component.
              </p>
              <Link
                href="/generative"
                className="mt-4 inline-block text-xs underline underline-offset-4"
              >
                Try the result workflows
              </Link>
            </div>
          </div>
        </section>
        <section className="border-separator-border mx-auto grid max-w-[1120px] gap-8 border-t px-5 py-12 sm:px-8 md:grid-cols-2">
          <div>
            <p className="text-text-secondary text-xs">Source you can own</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Fits your existing app.
            </h2>
            <p className="text-text-secondary mt-4 text-sm leading-6">
              Copy a component into your React project. Supply its data and
              connect its callbacks to your own tools, persistence, and model
              provider.
            </p>
            <Link
              href="/docs"
              className="mt-5 inline-block text-sm underline underline-offset-4"
            >
              Read the integration guide
            </Link>
          </div>
          <div className="border-separator-border bg-background-secondary-default overflow-hidden rounded-xl border">
            <div className="border-separator-border text-text-secondary border-b px-4 py-3 text-xs">
              Install a generated result surface
            </div>
            <pre className="p-4 text-xs leading-6 break-all whitespace-pre-wrap">
              <code>
                npx shadcn@latest add
                https://agents-ui.github.io/agents-kit/c/agent-generative-surface.json
              </code>
            </pre>
            <p className="text-text-secondary px-4 pb-4 text-xs">
              React · TypeScript · Tailwind CSS · Explicit source licenses
            </p>
          </div>
        </section>
        <section className="border-separator-border mx-auto max-w-[1120px] border-t px-5 py-10 sm:px-8">
          <h2 className="text-sm font-medium">
            Built with public open-source work.
          </h2>
          <p className="text-text-secondary mt-2 max-w-2xl text-[13px] leading-6">
            Agents Kit adapts and extends these libraries. Their authors deserve
            the credit; their source and license notices stay with the
            components.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {[
              ["Beautiful UI", "https://www.beautifului.dev/"],
              ["beUI", "https://beui.dev/"],
              ["BoardUI", "https://github.com/BoardUI/boardui"],
              ["Blocks.so", "https://blocks.so"],
              [
                "Thinking Orbs",
                "https://github.com/Jakubantalik/thinking-orbs",
              ],
              ["AI Elements", "https://github.com/vercel/ai-elements"],
              ["Prompt Kit", "https://github.com/ibelick/prompt-kit"],
            ].map(([name, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-text-secondary decoration-border-button-default hover:text-text-primary underline underline-offset-4"
              >
                {name}
              </a>
            ))}
          </div>
        </section>
        <footer className="border-separator-border text-text-secondary mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 border-t px-5 py-8 text-xs sm:px-8">
          <span>Agents Kit · React · TypeScript</span>
          <div className="flex gap-5">
            <Link href="/docs">Documentation</Link>
            <a href="https://github.com/agents-ui/agents-kit">GitHub</a>
            <Link href="/v0.1">v0.1 archive</Link>
          </div>
        </footer>
      </main>
    </>
  )
}
