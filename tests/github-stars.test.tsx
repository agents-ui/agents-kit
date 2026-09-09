import assert from "node:assert/strict"
import test from "node:test"
import { loadGitHubStars } from "../components/app/github-star-button"

test("GitHub stars uses valid counts and tolerates unavailable or invalid responses", async (t) => {
  const signal = new AbortController().signal
  const fetchMock = t.mock.method(
    globalThis,
    "fetch",
    async (url: RequestInfo | URL, init?: RequestInit) => {
      assert.equal(url, "https://api.github.com/repos/agents-ui/agents-kit")
      assert.equal(init?.signal, signal)
      return Response.json({ stargazers_count: 96 })
    }
  )
  assert.equal(await loadGitHubStars(signal), 96)

  fetchMock.mock.mockImplementation(async () =>
    Response.json({ stargazers_count: 0 })
  )
  assert.equal(await loadGitHubStars(), 0)

  for (const count of [-1, "96", 1.5, null]) {
    fetchMock.mock.mockImplementation(async () =>
      Response.json({ stargazers_count: count })
    )
    assert.equal(await loadGitHubStars(), null)
  }
  fetchMock.mock.mockImplementation(
    async () => new Response(null, { status: 403 })
  )
  assert.equal(await loadGitHubStars(), null)
  fetchMock.mock.mockImplementation(async () => {
    throw new Error("Offline")
  })
  assert.equal(await loadGitHubStars(), null)
})
