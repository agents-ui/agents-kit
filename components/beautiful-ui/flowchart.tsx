"use client"

import { cx } from "@/components/boardui/utils/cx"
import { Check, Circle, GripVertical, LoaderCircle } from "lucide-react"
import * as React from "react"

export interface FlowchartNode {
  id: string
  label: string
  detail?: string
  status: "pending" | "running" | "complete"
  x?: number
  y?: number
  kind?: string
  condition?: { field: string; operator: string; value: string }
}
export interface FlowchartEdge {
  from: string
  to: string
}
export interface FlowchartProps {
  nodes: FlowchartNode[]
  edges?: FlowchartEdge[]
  onSelect?: (id: string) => void
  onNodeMove?: (id: string, position: { x: number; y: number }) => void
  onConditionChange?: (
    id: string,
    condition: FlowchartNode["condition"]
  ) => void
  className?: string
}
export function Flowchart({
  nodes,
  edges,
  onSelect,
  onNodeMove,
  onConditionChange,
  className,
}: FlowchartProps) {
  const initial = React.useMemo(
    () =>
      Object.fromEntries(
        nodes.map((node, index) => [
          node.id,
          { x: node.x ?? 50, y: node.y ?? 38 + index * 116 },
        ])
      ),
    [nodes]
  )
  const [positions, setPositions] = React.useState(initial)
  const links =
    edges ??
    nodes
      .slice(0, -1)
      .map((node, index) => ({ from: node.id, to: nodes[index + 1].id }))
  const drag = React.useRef<{ id: string; dx: number; dy: number } | null>(null)
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const next = {
      x: Math.max(
        8,
        Math.min(rect.width - 208, event.clientX - rect.left - drag.current.dx)
      ),
      y: Math.max(
        8,
        Math.min(rect.height - 84, event.clientY - rect.top - drag.current.dy)
      ),
    }
    setPositions((current) => ({ ...current, [drag.current!.id]: next }))
    onNodeMove?.(drag.current.id, next)
  }
  return (
    <div
      onPointerMove={move}
      onPointerUp={() => {
        drag.current = null
      }}
      onPointerCancel={() => {
        drag.current = null
      }}
      className={cx(
        "border-separator-border bg-background-primary-default relative h-[360px] min-w-[640px] overflow-hidden rounded-xl border",
        className
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle, color-mix(in srgb, currentColor 12%, transparent) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        {links.map((edge) => {
          const from = positions[edge.from],
            to = positions[edge.to]
          if (!from || !to) return null
          const x1 = from.x + 100,
            y1 = from.y + 72,
            x2 = to.x + 100,
            y2 = to.y
          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`}
              fill="none"
              stroke="currentColor"
              strokeOpacity=".25"
              strokeWidth="1.5"
            />
          )
        })}
      </svg>
      {nodes.map((node) => {
        const position = positions[node.id] ?? { x: 0, y: 0 }
        const Icon =
          node.status === "complete"
            ? Check
            : node.status === "running"
              ? LoaderCircle
              : Circle
        return (
          <article
            key={node.id}
            className="border-separator-border bg-background-primary-default absolute w-[200px] touch-none rounded-lg border shadow-sm"
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          >
            <button
              type="button"
              onPointerDown={(event) => {
                const rect =
                  event.currentTarget.parentElement!.getBoundingClientRect()
                drag.current = {
                  id: node.id,
                  dx: event.clientX - rect.left,
                  dy: event.clientY - rect.top,
                }
                event.currentTarget.setPointerCapture(event.pointerId)
              }}
              onClick={() => onSelect?.(node.id)}
              className="border-separator-border flex min-h-9 w-full cursor-grab items-center gap-2 border-b px-3 text-left active:cursor-grabbing"
            >
              <GripVertical className="text-text-secondary size-4" />
              <span className="flex-1 text-xs font-medium">
                {node.kind ?? "Step"}
              </span>
              <Icon
                className={cx(
                  "text-text-secondary size-4",
                  node.status === "running" && "animate-spin"
                )}
              />
            </button>
            <div className="p-3">
              <h3 className="text-[13px] font-medium">{node.label}</h3>
              {node.detail && (
                <p className="text-text-secondary mt-1 text-xs">
                  {node.detail}
                </p>
              )}
              {node.condition && (
                <div className="mt-2 flex flex-wrap gap-1 text-xs">
                  <input
                    aria-label="Condition field"
                    value={node.condition.field}
                    onChange={(event) =>
                      onConditionChange?.(node.id, {
                        ...node.condition!,
                        field: event.target.value,
                      })
                    }
                    className="bg-background-secondary-default w-16 rounded-sm px-1.5 py-1"
                  />
                  <input
                    aria-label="Condition operator"
                    value={node.condition.operator}
                    onChange={(event) =>
                      onConditionChange?.(node.id, {
                        ...node.condition!,
                        operator: event.target.value,
                      })
                    }
                    className="bg-background-secondary-default w-12 rounded-sm px-1.5 py-1"
                  />
                  <input
                    aria-label="Condition value"
                    value={node.condition.value}
                    onChange={(event) =>
                      onConditionChange?.(node.id, {
                        ...node.condition!,
                        value: event.target.value,
                      })
                    }
                    className="bg-background-secondary-default min-w-0 flex-1 rounded-sm px-1.5 py-1"
                  />
                </div>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
