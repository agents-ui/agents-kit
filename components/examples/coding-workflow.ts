export type PatchDecision = "pending" | "accepted" | "rejected"

export const codingFiles = [
  {
    path: "src/routes/visits.ts",
    name: "visits.ts",
    task: "Validate the visit limit",
    test: "clamps the limit to an integer between 1 and 100",
    before:
      "export function visitLimit(value: string) {\n  return Number(value)\n}\n",
    after:
      "export function visitLimit(value: string) {\n  const parsed = Math.trunc(Number(value)) || 20\n  return Math.max(1, Math.min(parsed, 100))\n}\n",
  },
  {
    path: "src/components/visit-card.tsx",
    name: "visit-card.tsx",
    task: "Improve the empty state",
    test: "announces the empty state to assistive technology",
    before: "export function EmptyVisits() {\n  return <p>No visits</p>\n}\n",
    after:
      'export function EmptyVisits() {\n  return <p role="status">No field visits scheduled.</p>\n}\n',
  },
] as const

export function workingCode(index: number, decisions: PatchDecision[]) {
  const file = codingFiles[index]
  return decisions[index] === "accepted" ? file.after : file.before
}

// Local fixture checks inspect accepted snapshots, without executing code.
export function checkWorkingFiles(decisions: PatchDecision[]) {
  return codingFiles.map((file, index) => ({
    name: file.test,
    passed: workingCode(index, decisions) === file.after,
    path: file.path,
  }))
}
