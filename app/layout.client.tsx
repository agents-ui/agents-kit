"use client"

import { ThemeToggle } from "@/components/app/theme-toggle"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { BringToFront, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "./app-sidebar"
import { Footer } from "./footer"
import { Header } from "./header"
import { routes } from "./routes"

const coreMenuItems = routes
  .filter((route) => route.type === "core")
  .map((route) => ({
    title: route.label,
    url: route.path,
  }))

const componentsMenuItems = routes
  .filter((route) => route.type === "component")
  .map((route) => ({
    title: route.label,
    url: route.path,
  }))

type NavItem = { title: string; url: string }

const agentSubcategories: { label: string; items: NavItem[] }[] = [
  {
    label: "Core Agents",
    items: [
      "Agent Card",
      "Agent Response",
      "Agent Prompt Composer",
      "Agent Chat History",
      "Agent Status Panel",
      "Agent Toolkit",
      "Agent Feedback",
    ].map((label) => {
      const r = routes.find((route) => route.label === label)!
      return { title: r.label, url: r.path }
    }),
  },
  {
    label: "Media & Content",
    items: [
      "Agent Image Editor",
      "Agent Video Editor",
      "Agent Audio Generator",
      "Agent Grammar Checker",
      "Agent Doc Scanner",
      "Agent Web Search",
    ].map((label) => {
      const r = routes.find((route) => route.label === label)!
      return { title: r.label, url: r.path }
    }),
  },
  {
    label: "Orchestration",
    items: [
      "Agent Orchestrator",
      "Agent Parallel Processor",
      "Agent Sequential Workflow",
      "Agent Routing Hub",
      "Agent Task Queue",
      "Agent Workflow Planner",
    ].map((label) => {
      const r = routes.find((route) => route.label === label)!
      return { title: r.label, url: r.path }
    }),
  },
  {
    label: "Human-in-the-Loop",
    items: [
      "Agent Tool Approval",
      "Agent Plan Builder",
      "Agent Inquiry",
      "Agent Evaluator",
    ].map((label) => {
      const r = routes.find((route) => route.label === label)!
      return { title: r.label, url: r.path }
    }),
  },
  {
    label: "Research & Analysis",
    items: [
      "Agent Competitor Research",
      "Agent Data Analysis",
      "Agent Sources & Citations",
      "Agent Revenue Insights",
      "Agent Analytics Pulse",
      "Agent Ops Monitor",
    ].map((label) => {
      const r = routes.find((route) => route.label === label)!
      return { title: r.label, url: r.path }
    }),
  },
  {
    label: "Generators",
    items: [
      "Agent Form Generator",
      "Agent Code Executor",
      "Agent Artifact",
    ].map((label) => {
      const r = routes.find((route) => route.label === label)!
      return { title: r.label, url: r.path }
    }),
  },
]

const socialMenuItems = [
  {
    title: "GitHub",
    url: "https://github.com/agents-ui/agents-kit",
  },
]

const llms = [
  {
    title: "llms.txt",
    url: "/llms.txt",
  },
  {
    title: "llms-full.txt",
    url: "/llms-full.txt",
  },
]

function CollapsibleNavGroup({
  label,
  items,
  currentPath,
  defaultOpen = false,
}: {
  label: string
  items: NavItem[]
  currentPath: string
  defaultOpen?: boolean
}) {
  const hasActive = items.some((item) => currentPath === item.url)
  const [open, setOpen] = useState(defaultOpen || hasActive)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors">
        <span>{label}</span>
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenu className="mt-1">
          {items.map((item) => {
            const isActive = currentPath === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "hover:bg-sidebar-accent/50 active:bg-sidebar-accent/50 hover:text-primary text-lg transition-all duration-150 md:text-sm",
                    isActive &&
                      "text-primary bg-sidebar-accent hover:bg-sidebar-accent font-medium"
                  )}
                >
                  <Link href={item.url}>{item.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </CollapsibleContent>
    </Collapsible>
  )
}

function AppSidebar() {
  const currentPath = usePathname()
  const { setOpenMobile } = useSidebar()
  const pathname = usePathname()

  useEffect(() => {
    setOpenMobile(false)
  }, [setOpenMobile])

  return (
    <Sidebar className="h-full border-none shadow-none">
      <SidebarContent
        className="bg-background border-border border-r border-dashed"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex h-full flex-col pb-20 pl-0">
          <SidebarHeader className="hidden items-start px-5 pt-8 md:flex">
            <div className="flex w-full items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 pl-2 text-xl font-medium tracking-tighter"
              >
                <BringToFront className="h-6 w-6" />
                <h1 className="leading-none">Agents Kit</h1>
              </Link>
              <ThemeToggle />
            </div>
          </SidebarHeader>
          <SidebarGroup className="border-none pr-0 pl-2 md:px-5 md:pt-[3.6rem]">
            <SidebarGroupLabel className="text-lg md:text-sm">
              Get Started
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {coreMenuItems.map((item) => {
                  const isActive = currentPath === item.url

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "hover:bg-sidebar-accent/50 active:bg-sidebar-accent/50 hover:text-primary text-lg transition-all duration-150 md:text-sm",
                          isActive &&
                            "text-primary bg-sidebar-accent hover:bg-sidebar-accent font-medium"
                        )}
                      >
                        <Link href={item.url}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupLabel className={cn("mt-8 text-lg md:text-sm")}>
              v0.1 agent components
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-1">
                {agentSubcategories.map((group) => (
                  <CollapsibleNavGroup
                    key={group.label}
                    label={group.label}
                    items={group.items}
                    currentPath={currentPath}
                  />
                ))}
              </div>
            </SidebarGroupContent>
            <SidebarGroupLabel className={cn("mt-8 text-lg md:text-sm")}>
              v0.1 conversations
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {componentsMenuItems.map((item) => {
                  const isActive = currentPath === item.url

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "hover:bg-sidebar-accent/50 active:bg-sidebar-accent/50 hover:text-primary text-lg transition-all duration-150 md:text-sm",
                          isActive &&
                            "text-primary bg-sidebar-accent hover:bg-sidebar-accent font-medium"
                        )}
                      >
                        <Link href={item.url}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupLabel className="mt-8 text-lg md:text-sm">
              <SidebarMenuButton
                asChild
                className={cn(
                  "hover:bg-sidebar-accent/50 active:bg-sidebar-accent/50 hover:text-primary text-lg transition-all duration-150 md:text-sm",
                  pathname.includes("/blocks") &&
                    "text-primary bg-sidebar-accent hover:bg-sidebar-accent font-medium"
                )}
              >
                <Link href="/blocks" className="-m-2">
                  Blocks
                </Link>
              </SidebarMenuButton>
            </SidebarGroupLabel>
            <SidebarGroupLabel className={cn("mt-8 text-lg md:text-sm")}>
              LLMs
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {llms.map((item) => {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "hover:bg-sidebar-accent/50 active:bg-sidebar-accent/50 hover:text-primary text-lg transition-all duration-150 md:text-sm"
                        )}
                      >
                        <Link href={item.url}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupLabel className="mt-8 text-lg md:text-sm">
              Social
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {socialMenuItems.map((item) => {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "hover:bg-sidebar-accent/50 active:bg-sidebar-accent/50 hover:text-primary text-lg transition-all duration-150 md:text-sm"
                        )}
                      >
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const MOBILE_SIDEBAR_VIEWPORT_THRESHOLD = 768
  const MD_SIDEBAR_VIEWPORT_THRESHOLD = 1024

  const pathname = usePathname()
  const isBlocksPage = pathname === "/blocks"
  const isLegacyGuide = routes.some(
    (route) =>
      route.path === pathname &&
      (route.type === "agent" || route.type === "component")
  )
  const isComponentPage = pathname.includes("/c/")
  const isNewPublicSurface =
    pathname === "/" ||
    pathname === "/components" ||
    pathname === "/workspace" ||
    pathname === "/generative" ||
    pathname === "/docs" ||
    pathname === "/v0.1"

  if (isComponentPage || isNewPublicSurface) {
    return <>{children}</>
  }

  return (
    <SidebarProvider
      defaultOpen={true}
      viewportWidth={MOBILE_SIDEBAR_VIEWPORT_THRESHOLD}
      mdViewportWidth={MD_SIDEBAR_VIEWPORT_THRESHOLD}
    >
      <div className="w-full">
        <Header triggerViewportWidth={MOBILE_SIDEBAR_VIEWPORT_THRESHOLD} />
        <div className="flex h-full px-4 pt-32">
          <div className="relative mx-auto grid w-full max-w-(--breakpoint-2xl) grid-cols-6 md:grid-cols-12">
            <div
              className={cn(
                "col-start-1 col-end-7 flex h-full flex-1 flex-col md:col-start-4 md:col-end-12 lg:col-end-10",
                isBlocksPage && "lg:col-end-12"
              )}
            >
              <main className="flex-1">
                {isLegacyGuide && (
                  <aside className="text-muted-foreground mb-8 rounded-lg border p-4 text-sm leading-6">
                    This v0.1 component remains available for existing projects.
                    See the{" "}
                    <Link
                      href="/components"
                      className="text-foreground underline underline-offset-4"
                    >
                      v0.2 catalog
                    </Link>{" "}
                    for new components. Follow the{" "}
                    <Link
                      href="/docs/installation"
                      className="text-foreground underline underline-offset-4"
                    >
                      installation guide
                    </Link>{" "}
                    to load the required styles.
                  </aside>
                )}
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </div>
        <AppSidebar />
      </div>
    </SidebarProvider>
  )
}
