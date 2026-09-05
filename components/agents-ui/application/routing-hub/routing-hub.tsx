"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cn } from "@/lib/utils"
import { ChevronDown, Clock, RefreshCw } from "lucide-react"

export type RouteStatus = "selected" | "available" | "unavailable"
export interface RouteClassification {
  intent: string
  confidence: number
  reasoning: string
}
export interface AgentRoute {
  id: string
  agentName: string
  specialty: string
  matchScore: number
  status: RouteStatus
  description: string
}
export interface RoutingHistoryEntry {
  id: string
  query: string
  intent: string
  agentName: string
  timestamp: string
}
export interface AgentRoutingHubProps {
  inputQuery?: string
  classification?: RouteClassification
  routes?: AgentRoute[]
  selectedRouteId?: string
  routingHistory?: RoutingHistoryEntry[]
  isClassifying?: boolean
  className?: string
  onReclassify?: () => void
  onOverrideRoute?: (routeId: string) => void
  onViewHistory?: () => void
}
const defaultRoutes: AgentRoute[] = [
  {
    id: "technical",
    agentName: "Technical support",
    specialty: "Product troubleshooting",
    matchScore: 94,
    status: "selected",
    description: "Handles errors, integrations, and product troubleshooting.",
  },
  {
    id: "billing",
    agentName: "Billing support",
    specialty: "Payments and invoices",
    matchScore: 42,
    status: "available",
    description: "Handles payment failures, refunds, and invoice questions.",
  },
  {
    id: "sales",
    agentName: "Sales support",
    specialty: "Plans and procurement",
    matchScore: 18,
    status: "available",
    description: "Handles upgrades, comparisons, and procurement.",
  },
  {
    id: "general",
    agentName: "General support",
    specialty: "General questions",
    matchScore: 12,
    status: "unavailable",
    description: "Handles requests without a specialist match.",
  },
]
const baseClassification = {
  intent: "Technical support",
  confidence: 96,
  reasoning:
    "The request reports a product error and asks for troubleshooting, which best matches technical support.",
}
const baseHistory: RoutingHistoryEntry[] = [
  {
    id: "1",
    query: "How do I upgrade my plan?",
    intent: "Sales",
    agentName: "Sales support",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    query: "Invoice 4821 is incorrect",
    intent: "Billing",
    agentName: "Billing support",
    timestamp: "8 min ago",
  },
]
export function RoutingHub({
  inputQuery = "How do I fix the payment processing error?",
  classification = baseClassification,
  routes,
  selectedRouteId,
  routingHistory,
  isClassifying = false,
  className,
  onReclassify,
  onOverrideRoute,
  onViewHistory,
}: AgentRoutingHubProps) {
  const items = routes?.length ? routes : defaultRoutes
  const selected =
    selectedRouteId ?? items.find((route) => route.status === "selected")?.id
  const history = routingHistory?.length ? routingHistory : baseHistory
  return (
    <section
      className={cn(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-text-secondary text-xs font-medium">
            Routing decision
          </p>
          <h2 className="text-text-primary mt-1 text-lg font-semibold">
            {classification.intent}
          </h2>
          <p className="text-text-secondary mt-1 text-sm">{inputQuery}</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="small"
            variant="secondary"
            leadingIcon={RefreshCw}
            disabled={isClassifying}
            onClick={onReclassify}
          >
            {isClassifying ? "Classifying" : "Reclassify"}
          </Button>
          <Button
            size="small"
            variant="secondary"
            leadingIcon={Clock}
            onClick={onViewHistory}
          >
            History
          </Button>
        </div>
      </header>
      <div className="border-separator-border border-b p-4">
        <div className="flex justify-between gap-4">
          <div>
            <p className="text-text-primary text-sm font-medium">
              Selected route
            </p>
            <p className="text-text-secondary mt-1 text-xs leading-5">
              {classification.reasoning}
            </p>
          </div>
          <span className="text-text-primary shrink-0 text-sm tabular-nums">
            {classification.confidence}%
          </span>
        </div>
        <div
          className="bg-background-secondary-default mt-3 h-1.5 overflow-hidden rounded-full"
          role="progressbar"
          aria-label="Classification confidence"
          aria-valuenow={classification.confidence}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className="bg-accent-500 block h-full"
            style={{ width: `${classification.confidence}%` }}
          />
        </div>
      </div>
      <div>
        {items.map((route) => (
          <article
            key={route.id}
            className={cn(
              "border-separator-border flex items-start gap-3 border-b px-4 py-3 last:border-0",
              route.id === selected && "bg-background-secondary-default"
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-x-3">
                <h3 className="text-text-primary text-sm font-medium">
                  {route.agentName}
                </h3>
                <span className="text-text-secondary text-xs">
                  {route.specialty}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    route.status === "unavailable"
                      ? "text-text-secondary"
                      : route.id === selected
                        ? "text-green-600"
                        : "text-text-secondary"
                  )}
                >
                  {route.status === "unavailable"
                    ? "Unavailable"
                    : route.id === selected
                      ? "Selected"
                      : "Available"}
                </span>
              </div>
              <p className="text-text-secondary mt-1 text-xs">
                {route.description}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="bg-background-secondary-default h-1.5 max-w-56 flex-1 overflow-hidden rounded-full">
                  <span
                    className="bg-accent-500 block h-full"
                    style={{ width: `${route.matchScore}%` }}
                  />
                </div>
                <span className="text-text-secondary text-xs">
                  {route.matchScore}% match
                </span>
              </div>
            </div>
            {route.id !== selected && route.status === "available" && (
              <Button
                size="xs"
                variant="secondary"
                onClick={() => onOverrideRoute?.(route.id)}
              >
                Select
              </Button>
            )}
          </article>
        ))}
      </div>
      <details className="group border-separator-border border-t p-4">
        <summary className="text-text-primary flex cursor-pointer list-none items-center gap-1 text-xs">
          <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
          Recent decisions
        </summary>
        <div className="divide-separator-border bg-background-secondary-default mt-3 divide-y rounded-lg px-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="grid gap-1 py-2 text-xs sm:grid-cols-[1fr_9rem_6rem]"
            >
              <span className="text-text-primary">{item.query}</span>
              <span className="text-text-secondary">{item.agentName}</span>
              <span className="text-text-secondary text-right">
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>
      </details>
    </section>
  )
}
