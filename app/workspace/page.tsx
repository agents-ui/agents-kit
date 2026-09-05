"use client"

import {
  AgentArtifact,
  type ArtifactVersion,
} from "@/components/agents-ui/agent-artifact"
import {
  AgentSourcesCitations,
  type CitationSource,
} from "@/components/agents-ui/agent-sources-citations"
import {
  AgentToolApproval,
  type ToolApprovalRequest,
} from "@/components/agents-ui/agent-tool-approval"
import {
  WorkspaceComposer,
  type WorkspaceAttachment,
} from "@/components/blocks-so/workspace-composer"
import { PublicHeader } from "@/components/gallery/public-header"
import { Check, X } from "lucide-react"
import * as React from "react"

const approvalRequest: ToolApprovalRequest = {
  toolName: "create_salesforce_tasks",
  description: "Create 12 follow-up tasks in Salesforce",
  parameters: {
    scope: "12 account records",
    target: "Task records only",
    due_date: "This Friday",
  },
  riskLevel: "medium",
  reasoning:
    "The renewal review found four accounts that need executive outreach this week.",
}
const artifactVersions: ArtifactVersion[] = [
  {
    id: "v1",
    label: "Version 1",
    timestamp: "14:18",
    content:
      "Account,Renewal value,Risk,Next action\nNorthwind,$520K,High,Executive sponsor meeting\nAcme Health,$410K,High,Adoption recovery plan",
  },
  {
    id: "v2",
    label: "Version 2",
    timestamp: "14:32",
    content:
      "Account,Renewal value,Risk,Next action\nNorthwind,$520K,High,Executive sponsor meeting\nAcme Health,$410K,High,Adoption recovery plan\nContour Labs,$360K,High,Technical review\nVertex Works,$285K,Medium,Commercial alignment",
  },
]
const sources: CitationSource[] = [
  {
    id: "renewals",
    number: 1,
    title: "Q3 renewal forecast",
    url: "renewals_q3.csv",
    type: "document",
    relevance: 0.96,
    snippet: "Twelve accounts are below the renewal confidence threshold.",
    verified: true,
  },
  {
    id: "crm",
    number: 2,
    title: "Account health notes",
    url: "Salesforce",
    type: "database",
    relevance: 0.91,
    snippet: "Four accounts have unresolved adoption or sponsor risks.",
    verified: true,
  },
  {
    id: "sponsors",
    number: 3,
    title: "Executive sponsor coverage",
    url: "CRM report",
    type: "api",
    relevance: 0.84,
    snippet: "Sponsor coverage is missing for two high-value renewals.",
    verified: true,
  },
]

export default function WorkspacePage() {
  const [value, setValue] = React.useState(
    "Review the Q3 renewal workbook and CRM notes. Identify accounts at risk and draft a prioritized action plan."
  )
  const [model, setModel] = React.useState("balanced")
  const [attachments, setAttachments] = React.useState<WorkspaceAttachment[]>([
    { id: "renewals", name: "renewals_q3.csv", size: "842 KB" },
  ])
  const [running, setRunning] = React.useState(false)
  const [approval, setApproval] = React.useState<
    "pending" | "approved" | "declined"
  >("pending")
  const [version, setVersion] = React.useState("v2")
  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <p className="text-text-secondary text-xs">Renewal workspace</p>
          <h1 className="mt-2 text-2xl font-semibold">
            Q3 enterprise renewal review
          </h1>
        </header>
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)]">
          <div className="space-y-6">
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
              contextLabel="Q3 account workspace"
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
                setAttachments((current) =>
                  current.filter((file) => file.id !== id)
                )
              }
              isRunning={running}
              onStop={() => setRunning(false)}
            />
            {approval === "pending" ? (
              <AgentToolApproval
                pendingApproval={approvalRequest}
                onApprove={() => setApproval("approved")}
                onReject={() => setApproval("declined")}
              />
            ) : (
              <div
                role="status"
                className="border-separator-border bg-background-primary-default flex items-center gap-2 rounded-xl border p-4 text-sm"
              >
                {approval === "approved" ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <X className="size-4 text-red-600" />
                )}
                <span>
                  {approval === "approved"
                    ? "Task creation approved for this request."
                    : "Task creation declined. No Salesforce records were changed."}
                </span>
                <button
                  className="ml-auto text-xs underline"
                  onClick={() => setApproval("pending")}
                >
                  Review again
                </button>
              </div>
            )}
            <AgentSourcesCitations
              content="The review identified 12 at-risk accounts representing $1.84M in renewal value [1]. Four need executive outreach this week because adoption has slowed or sponsor coverage is incomplete [2]. The highest priority is restoring executive ownership for the largest renewals [3]."
              sources={sources}
            />
          </div>
          <div className="xl:sticky xl:top-24">
            <AgentArtifact
              title="Q3 renewal briefing"
              artifactType="table"
              versions={artifactVersions}
              currentVersion={version}
              onVersionChange={setVersion}
              metadata={{
                model:
                  model === "balanced" ? "Balanced analysis" : "Fast analysis",
                size: "842 rows",
                generationTime: "1m 42s",
                tokens: 18200,
              }}
            />
          </div>
        </div>
      </main>
    </>
  )
}
