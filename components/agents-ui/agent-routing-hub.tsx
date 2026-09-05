"use client"

import { RoutingHub } from "@/components/agents-ui/application/routing-hub/routing-hub"
import type { AgentRoutingHubProps } from "@/components/agents-ui/application/routing-hub/routing-hub"
import { createElement } from "react"

export type {
  AgentRoute,
  AgentRoutingHubProps,
  RouteClassification,
  RouteStatus,
  RoutingHistoryEntry,
} from "@/components/agents-ui/application/routing-hub/routing-hub"
export function AgentRoutingHub(props: AgentRoutingHubProps) {
  return createElement(RoutingHub, props)
}
