import { GenerativeShowcase } from "@/components/gallery/generative-previews"
import { PublicHeader } from "@/components/gallery/public-header"
import Link from "next/link"

export default function GenerativePage() {
  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
        <header className="mb-12 max-w-2xl">
          <p className="text-text-secondary text-sm">Playground</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Useful answers, thoughtfully shaped.
          </h1>
          <p className="text-text-secondary mt-4 text-base leading-7">
            A common surface for agent-generated content. Explore its states,
            then see the same components working together.
          </p>
          <p className="text-text-tertiary mt-3 text-xs">
            Fictional examples with AI-generated imagery. No connected services
            or live travel data.
          </p>
        </header>
        <section
          aria-label="Interactive generated surface"
          className="border-separator-border bg-background-secondary-default rounded-3xl border p-4 sm:p-8"
        >
          <GenerativeShowcase />
        </section>
        <section className="mt-16">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">
              The complete surface collection
            </h2>
            <Link
              href="/components"
              className="text-text-secondary hover:text-text-primary text-sm"
            >
              All agent components
            </Link>
          </div>
          <GenerativeShowcase grid />
        </section>
      </main>
    </>
  )
}
