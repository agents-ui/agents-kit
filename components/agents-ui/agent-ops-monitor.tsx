"use client"

import { OpsMonitor } from "@/components/agents-ui/application/ops-monitor/ops-monitor"
import type { AgentOpsMonitorProps } from "@/components/agents-ui/application/ops-monitor/ops-monitor"
import { createElement } from "react"

export type {
  AgentOpsMonitorProps,
  IncidentEvent,
  OpsServiceMetric,
  OpsSignal,
} from "@/components/agents-ui/application/ops-monitor/ops-monitor"
export function AgentOpsMonitor(props: AgentOpsMonitorProps) {
  return createElement(OpsMonitor, props)
}
