"use client"

import { AgentToolPalette, AgentTool } from "@/components/agents-ui/agent-tool-palette"

export default function AgentToolPaletteBasic() {
  const tools: AgentTool[] = [
    {
      id: "1",
      name: "Web Search",
      description: "Search the internet for current information",
      category: "data",
      enabled: true,
      usageCount: 42,
      lastUsed: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      name: "Code Generator",
      description: "Generate code snippets in various languages",
      category: "creative",
      enabled: true,
      usageCount: 156,
      lastUsed: new Date(Date.now() - 7200000),
    },
    {
      id: "3",
      name: "Image Analysis",
      description: "Analyze and describe images",
      category: "utility",
      enabled: true,
      usageCount: 23,
      lastUsed: new Date(Date.now() - 86400000),
    },
    {
      id: "4",
      name: "Database Query",
      description: "Execute SQL queries on connected databases",
      category: "data",
      enabled: false,
      usageCount: 8,
    },
    {
      id: "5",
      name: "Email Composer",
      description: "Draft professional emails",
      category: "communication",
      enabled: true,
      usageCount: 67,
      lastUsed: new Date(Date.now() - 172800000),
    },
    {
      id: "6",
      name: "Music Generator",
      description: "Create music and audio compositions",
      category: "creative",
      enabled: false,
      usageCount: 3,
    },
  ]

  return (
    <AgentToolPalette
      tools={tools}
      onToolClick={(tool) => console.log("Tool clicked:", tool.name)}
      onToolToggle={(toolId, enabled) => 
        console.log(`Tool ${toolId} ${enabled ? "enabled" : "disabled"}`)
      }
      showUsageStats
    />
  )
}
