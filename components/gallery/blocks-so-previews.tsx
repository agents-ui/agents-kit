"use client"

import {
  FileQueue,
  type FileQueueItem,
} from "@/components/blocks-so/file-queue"
import {
  SetupChecklist,
  type SetupStep,
} from "@/components/blocks-so/setup-checklist"
import {
  TaskTable,
  type TaskTableItem,
} from "@/components/blocks-so/task-table"
import {
  WorkspaceComposer,
  type WorkspaceAttachment,
} from "@/components/blocks-so/workspace-composer"
import * as React from "react"

export function WorkspaceComposerPreview() {
  const [value, setValue] = React.useState("")
  const [model, setModel] = React.useState("balanced")
  const [running, setRunning] = React.useState(false)
  const [attachments, setAttachments] = React.useState<WorkspaceAttachment[]>(
    []
  )
  return (
    <WorkspaceComposer
      value={value}
      onValueChange={setValue}
      onSubmit={() => setRunning(true)}
      model={model}
      models={[
        { id: "balanced", label: "Balanced" },
        { id: "fast", label: "Fast" },
      ]}
      onModelChange={setModel}
      attachments={attachments}
      onFilesSelected={(files) =>
        setAttachments((current) => [
          ...current,
          ...files.map((file) => ({
            id: `${file.name}-${file.lastModified}`,
            name: file.name,
            size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
          })),
        ])
      }
      onRemoveAttachment={(id) =>
        setAttachments((current) => current.filter((file) => file.id !== id))
      }
      isRunning={running}
      onStop={() => setRunning(false)}
    />
  )
}

export function FileQueuePreview() {
  const [files, setFiles] = React.useState<FileQueueItem[]>([
    { id: "1", name: "renewals_q3.csv", size: "842 KB", status: "complete" },
    {
      id: "2",
      name: "account_notes.csv",
      size: "128 KB",
      status: "uploading",
      progress: 62,
    },
    {
      id: "3",
      name: "forecast_notes.pdf",
      size: "94 KB",
      status: "error",
      error: "Upload interrupted",
    },
  ])
  return (
    <FileQueue
      files={files}
      onFilesSelected={(selected) =>
        setFiles((current) => [
          ...current,
          ...selected.map((file) => ({
            id: `${file.name}-${file.lastModified}`,
            name: file.name,
            size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            status: "queued" as const,
          })),
        ])
      }
      onRemove={(id) =>
        setFiles((current) => current.filter((file) => file.id !== id))
      }
      onRetry={(id) =>
        setFiles((current) =>
          current.map((file) =>
            file.id === id
              ? { ...file, status: "uploading", progress: 0, error: undefined }
              : file
          )
        )
      }
      onUpload={() =>
        setFiles((current) =>
          current.map((file) =>
            file.status === "queued"
              ? { ...file, status: "uploading", progress: 0 }
              : file
          )
        )
      }
    />
  )
}

export function SetupChecklistPreview() {
  const [selected, setSelected] = React.useState("2")
  const [steps, setSteps] = React.useState<SetupStep[]>([
    {
      id: "1",
      title: "Add renewal workbook",
      description: "Provide the current forecast.",
      completed: true,
    },
    {
      id: "2",
      title: "Connect CRM notes",
      description: "Grant read access to account notes.",
      completed: false,
    },
    {
      id: "3",
      title: "Review permissions",
      description: "Confirm write actions require approval.",
      completed: false,
    },
  ])
  const setComplete = (id: string, completed: boolean) =>
    setSteps((current) =>
      current.map((step) => (step.id === id ? { ...step, completed } : step))
    )
  return (
    <SetupChecklist
      title="Workspace setup"
      description="Connect the context needed for reliable agent work."
      steps={steps}
      selectedStepId={selected}
      onSelectStep={setSelected}
      onStepComplete={setComplete}
      onContinue={(id) => {
        setComplete(id, true)
        const next = steps.find((step) => !step.completed && step.id !== id)
        if (next) setSelected(next.id)
      }}
    />
  )
}

export function TaskTablePreview() {
  const [tasks, setTasks] = React.useState<TaskTableItem[]>([
    {
      id: "1",
      title: "Read renewal workbook",
      assignee: "Renewal analyst",
      status: "completed",
    },
    {
      id: "2",
      title: "Compare account health",
      assignee: "Renewal analyst",
      status: "in-progress",
    },
    { id: "3", title: "Draft action plan", status: "pending" },
  ])
  const update = (id: string, status: TaskTableItem["status"]) =>
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, status } : task))
    )
  return (
    <TaskTable
      tasks={tasks}
      onStart={(task) => update(task.id, "in-progress")}
      onPause={(task) => update(task.id, "paused")}
      onComplete={(task) => update(task.id, "completed")}
      onDelete={(task) =>
        setTasks((current) => current.filter((item) => item.id !== task.id))
      }
      onView={(task) =>
        setTasks((current) => [
          task,
          ...current.filter((item) => item.id !== task.id),
        ])
      }
    />
  )
}
