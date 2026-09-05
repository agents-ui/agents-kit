import { SidebarTrigger } from "@/app/app-sidebar"
import { ThemeToggle } from "@/components/app/theme-toggle"
import { useBreakpoint } from "@/hooks/use-breakpoint"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export type HeaderProps = {
  triggerViewportWidth: number
}

export function Header({ triggerViewportWidth }: HeaderProps) {
  const isMobileView = useBreakpoint(triggerViewportWidth)

  if (!isMobileView) {
    return null
  }

  return (
    <nav className="absolute top-0 left-0 z-60 w-full px-4 py-4">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <Link href="/" className="">
          <span className="text-foreground font-[450]">Agents Kit</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isMobileView ? (
            <SidebarTrigger />
          ) : (
            <a
              className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm transition-colors"
              href="https://github.com/agents-ui/agents-kit"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}
