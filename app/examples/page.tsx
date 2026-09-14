import { AppExamples } from "@/components/gallery/app-examples"
import { PublicHeader } from "@/components/gallery/public-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "App examples | Agents Kit",
  description:
    "Build a voice assistant, research chat, or coding workspace with Agents Kit. Try working UI starters and copy the build prompt.",
}

export default function ExamplesPage() {
  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 max-w-2xl">
          <p className="text-text-secondary text-xs">App examples</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Start with a complete app.
          </h1>
          <p className="text-text-secondary mt-4 text-sm leading-6">
            Voice, chat, and coding interfaces built with the kit. Try the
            workflow, then copy a prompt to build your own.
          </p>
        </header>
        <AppExamples />
      </main>
    </>
  )
}
