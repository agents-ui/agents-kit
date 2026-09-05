import { Avatar } from "@/components/boardui/base/avatar/avatar"
import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import {
  CheckCircle2,
  Circle,
  CircleDot,
  Loader2,
  PauseCircle,
  XCircle,
} from "lucide-react"

export type AgentStatus =
  | "idle"
  | "thinking"
  | "running"
  | "paused"
  | "error"
  | "completed"
export interface AgentCapability {
  name: string
  description: string
  icon?: React.ReactNode
}
export interface AgentCardProps {
  name: string
  description?: string
  avatar?: string
  status?: AgentStatus
  capabilities?: AgentCapability[]
  className?: string
  onAction?: (action: string) => void
}
const states = {
  idle: { icon: Circle, label: "Idle", color: "text-text-secondary" },
  thinking: {
    icon: CircleDot,
    label: "Thinking",
    color: "text-foreground-icon-notice",
  },
  running: { icon: Loader2, label: "Running", color: "text-accent-600" },
  paused: {
    icon: PauseCircle,
    label: "Paused",
    color: "text-foreground-icon-notice",
  },
  error: { icon: XCircle, label: "Error", color: "text-foreground-icon-error" },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    color: "text-foreground-icon-positive",
  },
} satisfies Record<
  AgentStatus,
  { icon: typeof Circle; label: string; color: string }
>
export function AgentCard({
  name,
  description,
  avatar,
  status = "idle",
  capabilities = [],
  className,
  onAction,
}: AgentCardProps) {
  const state = states[status]
  const Icon = state.icon
  return (
    <article
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-2xl border",
        className
      )}
    >
      <header className="flex items-start gap-3 p-4">
        <Avatar
          size="md"
          src={avatar}
          alt={name}
          initials={name.slice(0, 2).toUpperCase()}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-headline-semibold">{name}</h3>
            <span
              className={cx(
                "text-caption-1-medium inline-flex items-center gap-1.5",
                state.color
              )}
            >
              <Icon
                className={cx(
                  "size-3.5",
                  status === "running" && "animate-spin"
                )}
              />
              {state.label}
            </span>
          </div>
          {description && (
            <p className="text-body-2-regular text-text-secondary mt-1 leading-5">
              {description}
            </p>
          )}
        </div>
      </header>
      {capabilities.length > 0 && (
        <section className="border-separator-border border-t">
          <h4 className="text-caption-1-medium text-text-secondary px-4 pt-3 pb-1">
            Capabilities
          </h4>
          <div className="divide-separator-border divide-y">
            {capabilities.map((capability) => (
              <div key={capability.name} className="flex gap-3 px-4 py-3">
                {capability.icon && (
                  <span className="text-text-secondary mt-0.5">
                    {capability.icon}
                  </span>
                )}
                <div>
                  <p className="text-body-medium">{capability.name}</p>
                  <p className="text-caption-1-regular text-text-secondary">
                    {capability.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {onAction && (
        <footer className="border-separator-border flex gap-2 border-t px-3 py-2">
          {status === "idle" && (
            <Button size="small" onClick={() => onAction("start")}>
              Start agent
            </Button>
          )}
          {(status === "running" || status === "thinking") && (
            <>
              <Button
                size="small"
                variant="secondary"
                onClick={() => onAction("pause")}
              >
                Pause
              </Button>
              <Button
                size="small"
                variant="danger"
                onClick={() => onAction("stop")}
              >
                Stop
              </Button>
            </>
          )}
          {status === "paused" && (
            <Button size="small" onClick={() => onAction("resume")}>
              Resume
            </Button>
          )}
          {(status === "completed" || status === "error") && (
            <Button size="small" onClick={() => onAction("restart")}>
              Restart
            </Button>
          )}
        </footer>
      )}
    </article>
  )
}
