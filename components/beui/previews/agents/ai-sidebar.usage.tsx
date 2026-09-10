"use client"

import {
  AISidebar,
  type SidebarResource,
} from "@/components/beui/components/agents/ai-sidebar"
import {
  AnimatedSidebar,
  AnimatedSidebarContent,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarProvider,
} from "@/components/beui/components/motion/animated-sidebar"
import * as React from "react"
import { useState } from "react"

const resources: SidebarResource[] = [
  {
    id: "project",
    label: "Website redesign",
    kind: "project",
    children: [
      { id: "brief", label: "Project brief", kind: "file" },
      { id: "research", label: "Research links", kind: "bookmark" },
    ],
  },
  { id: "archive", label: "Archive", kind: "folder" },
]

export function AISidebarUsage() {
  const [items, setItems] = useState(resources)

  return (
    <AnimatedSidebarProvider>
      <AnimatedSidebar ariaLabel="Project resources" collapsible="offcanvas">
        <AnimatedSidebarContent>
          <AnimatedSidebarGroup>
            <AnimatedSidebarGroupLabel>Resources</AnimatedSidebarGroupLabel>
            <AnimatedSidebarGroupContent>
              <AISidebar
                items={items}
                onItemsChange={setItems}
                defaultExpandedIds={["project"]}
                onMove={async (move) => {
                  await saveResourceMove(move)
                }}
              />
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>
        </AnimatedSidebarContent>
      </AnimatedSidebar>
    </AnimatedSidebarProvider>
  )
}

async function saveResourceMove(_move: unknown) {
  void _move
  // Persist the move. Rejecting this promise restores the previous tree.
}
