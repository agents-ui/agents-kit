"use client"

import { ThemeToggle } from "@/components/app/theme-toggle"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function PublicHeader() {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <header
      className={`border-separator-border bg-background/90 z-40 border-b backdrop-blur ${pathname === "/" ? "relative" : "sticky top-0"}`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="text-sm font-semibold whitespace-nowrap">
            Agents Kit
          </Link>
          <select
            aria-label="Library version"
            value={pathname.startsWith("/v0.1") ? "0.1" : "0.2"}
            onChange={(event) =>
              router.push(
                event.target.value === "0.1" ? "/v0.1" : "/components"
              )
            }
            className="border-separator-border text-text-secondary h-7 rounded-md border bg-transparent px-1 text-xs"
          >
            <option value="0.2">v0.2</option>
            <option value="0.1">v0.1</option>
          </select>
        </div>
        <nav className="flex items-center gap-0 text-xs sm:gap-1 sm:text-sm">
          <Link
            className="hover:bg-background-secondary-default rounded-lg px-2 py-2 sm:px-3"
            href="/components"
          >
            Components
          </Link>
          <Link
            className="hover:bg-background-secondary-default rounded-lg px-2 py-2 sm:px-3"
            href="/generative"
          >
            Playground
          </Link>
          <Link
            className="hover:bg-background-secondary-default hidden rounded-lg px-2 py-2 min-[440px]:block sm:px-3"
            href="/docs"
          >
            Docs
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
