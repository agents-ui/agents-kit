"use client"

import { Button } from "@/components/boardui/base/buttons/button"
import { cx } from "@/components/boardui/utils/cx"
import { Check, Eye, Pause, Play, Trash2 } from "lucide-react"

export type TaskStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "blocked"
  | "paused"
export type TaskPriority = "low" | "medium" | "high" | "urgent"
export interface TaskTableItem {
  id: string
  title: string
  assignee?: string
  status: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  notes?: string
}
export interface TaskTableProps {
  tasks: TaskTableItem[]
  pendingAction?: {
    taskId: string
    action: "start" | "pause" | "complete" | "delete" | "view"
  } | null
  onStart?: (task: TaskTableItem) => void
  onPause?: (task: TaskTableItem) => void
  onComplete?: (task: TaskTableItem) => void
  onDelete?: (task: TaskTableItem) => void
  onView?: (task: TaskTableItem) => void
  emptyMessage?: string
  className?: string
}
const statusStyle: Record<TaskStatus, string> = {
  pending: "text-text-secondary",
  "in-progress": "text-accent-600",
  completed: "text-green-700 dark:text-green-400",
  blocked: "text-red-700 dark:text-red-400",
  paused: "text-amber-700 dark:text-amber-400",
}
const label: Record<TaskStatus, string> = {
  pending: "Pending",
  "in-progress": "In progress",
  completed: "Completed",
  blocked: "Blocked",
  paused: "Paused",
}
export function TaskTable({
  tasks,
  pendingAction,
  onStart,
  onPause,
  onComplete,
  onDelete,
  onView,
  emptyMessage = "No tasks in this workspace.",
  className,
}: TaskTableProps) {
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border border-b p-4">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <p className="text-text-secondary mt-1 text-xs">{tasks.length} items</p>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-background-secondary-default text-text-secondary text-xs">
            <tr>
              <th className="px-4 py-3 font-medium">Task</th>
              <th className="px-4 py-3 font-medium">Assignee</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Due</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-separator-border divide-y">
            {tasks.map((task) => {
              const busy = pendingAction?.taskId === task.id
              return (
                <tr
                  key={task.id}
                  className="hover:bg-background-secondary-default"
                >
                  <td className="max-w-72 px-4 py-3">
                    <p className="font-medium">{task.title}</p>
                    {task.notes && (
                      <p className="text-text-secondary mt-1 truncate text-xs">
                        {task.notes}
                      </p>
                    )}
                  </td>
                  <td className="text-text-secondary px-4 py-3">
                    {task.assignee ?? "Unassigned"}
                  </td>
                  <td
                    className={cx(
                      "px-4 py-3 text-xs font-medium",
                      statusStyle[task.status]
                    )}
                  >
                    {busy
                      ? `${pendingAction.action} in progress`
                      : label[task.status]}
                  </td>
                  <td className="text-text-secondary px-4 py-3">
                    {task.dueDate ?? "No due date"}
                  </td>
                  <td className="text-text-secondary px-4 py-3">
                    {task.priority ?? "Normal"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {(task.status === "pending" ||
                        task.status === "blocked" ||
                        task.status === "paused") && (
                        <Button
                          variant="secondary"
                          size="xs"
                          leadingIcon={Play}
                          disabled={busy}
                          onClick={() => onStart?.(task)}
                        >
                          Start
                        </Button>
                      )}
                      {task.status === "in-progress" && (
                        <>
                          <Button
                            variant="ghost"
                            size="xs"
                            leadingIcon={Pause}
                            disabled={busy}
                            onClick={() => onPause?.(task)}
                          >
                            Pause
                          </Button>
                          <Button
                            variant="secondary"
                            size="xs"
                            leadingIcon={Check}
                            disabled={busy}
                            onClick={() => onComplete?.(task)}
                          >
                            Complete
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="xs"
                        iconOnly
                        disabled={busy}
                        aria-label={`View ${task.title}`}
                        onClick={() => onView?.(task)}
                      >
                        <Eye />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        iconOnly
                        disabled={busy}
                        aria-label={`Delete ${task.title}`}
                        onClick={() => onDelete?.(task)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {tasks.length === 0 && (
        <p className="text-text-secondary p-8 text-center text-sm">
          {emptyMessage}
        </p>
      )}
    </section>
  )
}
