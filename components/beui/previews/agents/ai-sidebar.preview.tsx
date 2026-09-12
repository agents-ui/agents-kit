"use client"

import {
  AISidebar,
  type SidebarResource,
  type SidebarResourceMove,
} from "@/components/beui/components/agents/ai-sidebar"
import {
  AnimatedSidebar,
  AnimatedSidebarContent,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
  AnimatedSidebarProvider,
  AnimatedSidebarRail,
  AnimatedSidebarTrigger,
} from "@/components/beui/components/motion/animated-sidebar"
import {
  Clock3,
  GitPullRequest,
  LayoutGrid,
  PanelLeft,
  Plug,
  SquarePen,
} from "lucide-react"
import * as React from "react"
import { useState } from "react"

const resources: SidebarResource[] = [
  {
    id: "design-system",
    label: "Jaipur mobility",
    kind: "project",
  },
  {
    id: "client-portal",
    label: "Pune night buses",
    kind: "project",
  },
  {
    id: "marketing-site",
    label: "Kochi ferry access",
    kind: "project",
  },
  {
    id: "platform",
    label: "Jaipur station visits",
    kind: "project",
    children: [
      { id: "api", label: "South entrance walkthrough", kind: "file" },
      { id: "billing", label: "Platform gap observations", kind: "file" },
      { id: "docs", label: "Station accessibility map", kind: "bookmark" },
    ],
  },
  {
    id: "mobile-app",
    label: "Bengaluru wayfinding",
    kind: "project",
  },
  {
    id: "research-lab",
    label: "Research archive",
    kind: "folder",
  },
  {
    id: "agent-workspace",
    label: "Fieldwork workspace",
    kind: "project",
    children: [
      {
        id: "resource-review",
        label: "Review rider interview evidence",
        kind: "file",
      },
      {
        id: "release-offer",
        label: "Prepare research readout",
        kind: "file",
      },
      {
        id: "haptics",
        label: "Explore transfer signage patterns",
        kind: "bookmark",
      },
      {
        id: "promotion",
        label: "Plan participant follow-up",
        kind: "file",
      },
      {
        id: "motion-research",
        label: "Compare step-free route observations",
        kind: "bookmark",
      },
    ],
  },
  {
    id: "release-notes",
    label: "Field report",
    kind: "file",
  },
]

const actions = [
  { label: "New study", icon: SquarePen },
  { label: "Imported transcripts", icon: GitPullRequest },
  { label: "Field sites", icon: LayoutGrid },
  { label: "Scheduled visits", icon: Clock3 },
  { label: "Research tools", icon: Plug },
] as const

function findLabel(items: SidebarResource[], id: string): string | undefined {
  for (const item of items) {
    if (item.id === id) return item.label
    const child = item.children ? findLabel(item.children, id) : undefined
    if (child) return child
  }
}

export function AISidebarPreview() {
  const [active, setActive] = useState("resource-review")
  const [items, setItems] = useState(resources)
  const activeLabel = findLabel(items, active) ?? active

  const move = async (_event: SidebarResourceMove) => {
    void _event
    await new Promise((resolve) => window.setTimeout(resolve, 450))
  }

  return (
    <div className="w-full px-0 py-2 sm:p-3">
      <AnimatedSidebarProvider
        style={{ "--sidebar-width": "16rem" }}
        className="border-foreground/[0.08] bg-background h-[720px] min-h-0 w-full overflow-hidden rounded-xl border"
      >
        <AnimatedSidebar
          ariaLabel="Workspace resources"
          collapsible="offcanvas"
          className="min-h-0 w-full"
          panelClassName="h-full bg-background"
        >
          <AnimatedSidebarContent className="gap-4 overflow-hidden px-2 py-4">
            <AnimatedSidebarGroup className="shrink-0 px-1 py-0">
              <AnimatedSidebarGroupContent>
                <AnimatedSidebarMenu className="gap-1">
                  {actions.map(({ label, icon: Icon }) => (
                    <AnimatedSidebarMenuItem key={label}>
                      <AnimatedSidebarMenuButton
                        icon={<Icon className="size-4" />}
                        onSelect={() => {}}
                        className="text-foreground font-normal"
                      >
                        {label}
                      </AnimatedSidebarMenuButton>
                    </AnimatedSidebarMenuItem>
                  ))}
                </AnimatedSidebarMenu>
              </AnimatedSidebarGroupContent>
            </AnimatedSidebarGroup>

            <AnimatedSidebarGroup className="min-h-0 flex-1 px-1 py-0">
              <AnimatedSidebarGroupLabel className="mb-1 h-8 px-2 text-xs font-medium tracking-normal normal-case">
                Projects
              </AnimatedSidebarGroupLabel>
              <AnimatedSidebarGroupContent className="relative min-h-0 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto overscroll-contain pb-8 [-ms-overflow-style:none] [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <AISidebar
                    items={items}
                    activeId={active}
                    defaultExpandedIds={["platform", "agent-workspace"]}
                    onActiveChange={setActive}
                    onItemsChange={setItems}
                    onMove={move}
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="from-background via-background/80 pointer-events-none absolute inset-x-0 bottom-0 z-20 h-8 bg-gradient-to-t to-transparent"
                />
              </AnimatedSidebarGroupContent>
            </AnimatedSidebarGroup>
          </AnimatedSidebarContent>
          <AnimatedSidebarRail />
        </AnimatedSidebar>

        <div
          data-slot="sidebar-inset"
          className="bg-background relative flex min-h-0 min-w-0 flex-1 flex-col"
        >
          <header className="border-border flex h-14 shrink-0 items-center justify-between gap-4 border-b px-5">
            <div className="flex min-w-0 items-center gap-3">
              <AnimatedSidebarTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground -ml-2 transition-colors">
                <PanelLeft aria-hidden="true" className="size-4" />
              </AnimatedSidebarTrigger>
              <div className="min-w-0">
                <p className="text-muted-foreground text-[10px] font-medium tracking-[0.14em] uppercase">
                  Workspace
                </p>
                <p className="text-foreground truncate text-sm font-medium">
                  Fieldwork workspace
                </p>
              </div>
            </div>
            <span className="bg-muted text-muted-foreground shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium">
              Draft
            </span>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
            <div className="mx-auto max-w-xl">
              <p className="text-muted-foreground text-xs">Selected resource</p>
              <h3 className="text-foreground mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                {activeLabel}
              </h3>
              <p className="text-muted-foreground mt-3 max-w-lg text-sm leading-6">
                Keep interviews, observations, and supporting sources organized
                while the team moves evidence between active studies.
              </p>

              <div className="border-border mt-8 border-t pt-6">
                <p className="text-foreground text-sm font-medium">
                  Evidence handling
                </p>
                <ul className="text-muted-foreground mt-3 space-y-3 text-sm leading-6">
                  <li>Participant records stay inside their study.</li>
                  <li>Research notes can be selected, moved, or renamed.</li>
                  <li>Rejected moves return to their original study.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSidebarProvider>
    </div>
  )
}
