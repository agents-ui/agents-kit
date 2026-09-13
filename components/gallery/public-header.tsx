"use client"

import { ThemeToggle } from "@/components/app/theme-toggle"
import { getSitePathname } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function PublicHeader() {
  const pathname = getSitePathname(usePathname())
  const router = useRouter()
  return (
    <header
      className={`border-separator-border bg-background/90 z-40 border-b backdrop-blur ${pathname === "/" ? "relative" : "sticky top-0"}`}
    >
      <div className="mx-auto flex min-h-16 max-w-[1440px] flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2 min-[440px]:h-16 min-[440px]:flex-nowrap min-[440px]:py-0 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            prefetch={false}
            className="text-sm font-semibold whitespace-nowrap"
          >
            Agents Kit
          </Link>
          <select
            aria-label="Library version"
            value={pathname.startsWith("/v0.1") ? "0.1" : "0.3"}
            onChange={(event) =>
              router.push(
                event.target.value === "0.1" ? "/v0.1" : "/components"
              )
            }
            className="border-separator-border text-text-secondary h-7 rounded-md border bg-transparent px-1 text-xs"
          >
            <option value="0.3">v0.3</option>
            <option value="0.1">v0.1</option>
          </select>
        </div>
        <nav className="order-last flex w-full items-center justify-between text-xs min-[440px]:order-none min-[440px]:ml-auto min-[440px]:w-auto min-[440px]:justify-start sm:gap-1 sm:text-sm">
          <Link
            className="hover:bg-background-secondary-default rounded-lg px-2 py-2 sm:px-3"
            href="/components"
          >
            Components
          </Link>
          <Link
            className="hover:bg-background-secondary-default rounded-lg px-2 py-2 sm:px-3"
            href="/voice"
          >
            Voice
          </Link>
          <Link
            className="hover:bg-background-secondary-default rounded-lg px-2 py-2 sm:px-3"
            href="/generative"
          >
            Playground
          </Link>
          <Link
            className="hover:bg-background-secondary-default rounded-lg px-2 py-2 sm:px-3"
            href="/docs"
          >
            Docs
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
