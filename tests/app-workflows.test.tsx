import assert from "node:assert/strict"
import test from "node:test"
import {
  checkWorkingFiles,
  codingFiles,
  workingCode,
} from "../components/examples/coding-workflow"
import {
  researchAnswer,
  researchProjects,
  researchReport,
} from "../components/examples/research-workflow"

test("coding checks inspect accepted working files, not proposed patches", () => {
  assert.deepEqual(
    checkWorkingFiles(["pending", "pending"]).map((item) => item.passed),
    [false, false]
  )
  assert.deepEqual(
    checkWorkingFiles(["accepted", "rejected"]).map((item) => item.passed),
    [true, false]
  )
  assert.equal(workingCode(1, ["accepted", "rejected"]), codingFiles[1].before)
  assert.deepEqual(
    checkWorkingFiles(["accepted", "accepted"]).map((item) => item.passed),
    [true, true]
  )
  assert.deepEqual(
    checkWorkingFiles(["pending", "accepted"]).map((item) => item.passed),
    [false, true]
  )
})

test("research answers and reports use the current conversation's evidence", () => {
  const project = researchProjects[1]
  const answer = researchAnswer("station signs", project.notes)
  assert.match(answer, /destination label/)
  assert.doesNotMatch(answer, /shipment identifier/)
  assert.match(researchAnswer("anything", []), /no source notes/)
  const uploaded = [
    { id: "upload", title: "New note", text: "North entrance closes at noon." },
  ]
  assert.match(
    researchAnswer("entrance", uploaded),
    /North entrance closes at noon/
  )
  assert.match(
    researchReport(project.title, project.notes, answer),
    /Wayfinding audit/
  )
  assert.doesNotMatch(
    researchReport(project.title, project.notes, answer),
    /West dock/
  )
})
