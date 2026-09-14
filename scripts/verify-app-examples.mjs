// Run against a dev server or production export. Playwright is a verification
// tool only; point AGENTS_KIT_PLAYWRIGHT_MODULE at an existing installation.
import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const { chromium } = await import(
  process.env.AGENTS_KIT_PLAYWRIGHT_MODULE || "playwright"
)
const base =
  process.env.AGENTS_KIT_EXAMPLES_URL || "http://127.0.0.1:3440/examples"
const output = process.env.AGENTS_KIT_SCREENSHOT_DIR
if (output) await mkdir(output, { recursive: true })
const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
})
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
})
await context.grantPermissions(["clipboard-read", "clipboard-write"])
await context.addInitScript(() => {
  window.__mediaCaptureAttempts = 0
  navigator.mediaDevices.getUserMedia = async () => {
    window.__mediaCaptureAttempts += 1
    throw new Error("Examples must not capture media")
  }
})
const page = await context.newPage()
const errors = []
page.on("pageerror", (error) => errors.push(error.message))
const app = (id) => page.locator(`[data-app-example="${id}"]`)
const choose = async (id) => {
  await page
    .getByRole("group", { name: "Choose an app example" })
    .getByRole("button", { name: new RegExp(`^${id}`, "i") })
    .click()
  await app(id).waitFor()
}
const appearance = async (name) => {
  await page
    .getByRole("group", { name: "Compare presentation" })
    .getByRole("button", { name })
    .click()
}
const textIncludes = async (locator, text) => {
  await locator.getByText(text, { exact: false }).first().waitFor()
  assert.ok((await locator.innerText()).includes(text), text)
}
const screenshot = async (locator, name) => {
  await locator.scrollIntoViewIfNeeded()
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      )
  )
  const transparent = await page.addStyleTag({
    content: "html, body { background: transparent !important; }",
  })
  try {
    await locator.screenshot({
      path: path.join(output, name),
      animations: "disabled",
      omitBackground: true,
    })
  } finally {
    await transparent.evaluate((style) => style.remove())
  }
}
try {
  await page.goto(base, { waitUntil: "domcontentloaded", timeout: 120000 })
  await app("voice").waitFor({ timeout: 120000 })
  console.log("Checking shared voice and text conversation")
  const voice = app("voice")
  const voiceInput = voice.getByRole("textbox", {
    name: "Message",
    exact: true,
  })
  const originalInput = await voiceInput.elementHandle()
  await voiceInput.fill("Keep this draft while I switch modes")
  await voice
    .getByRole("button", { name: "Exit voice mode", exact: true })
    .click()
  assert.equal(
    await voiceInput.inputValue(),
    "Keep this draft while I switch modes"
  )
  await voice
    .getByRole("button", { name: "Enter voice mode", exact: true })
    .click()
  await voice.locator("[data-voice-orb] canvas").waitFor()
  assert.equal(
    await voiceInput.inputValue(),
    "Keep this draft while I switch modes"
  )
  assert.ok(
    await originalInput.evaluate(
      (input) => input === document.querySelector("[data-conversation-input]")
    ),
    "Mode changes must preserve the composer DOM node"
  )
  await voiceInput.fill("")
  await voice
    .getByRole("button", { name: "Try a sample voice turn", exact: true })
    .click()
  await page.waitForFunction(
    () =>
      document.querySelectorAll('[data-app-example="voice"] [data-turn]')
        .length === 2
  )
  assert.equal(await voice.locator("[data-transcript] [data-turn]").count(), 2)
  if (output) {
    await voice.getByText("Listening", { exact: true }).waitFor()
    await voiceInput.fill("What should we change first?")
    await page.waitForTimeout(1500)
    await screenshot(voice, "example-voice.png")
    await voiceInput.fill("")
  }

  await voice
    .getByRole("button", { name: "Mute microphone", exact: true })
    .click()
  assert.ok(
    await voice
      .getByRole("button", { name: "Try a sample voice turn", exact: true })
      .isDisabled(),
    "Muted voice input must disable the sample voice turn"
  )
  await voiceInput.fill("Summarize the dock interviews")
  await voice.getByRole("button", { name: "Send message", exact: true }).click()
  await page.waitForFunction(
    () =>
      document.querySelectorAll('[data-app-example="voice"] [data-turn]')
        .length === 4
  )
  await voice.getByText("Microphone muted", { exact: true }).waitFor()
  await voice
    .getByRole("button", { name: "Unmute microphone", exact: true })
    .click()
  await voice.getByText("Listening", { exact: true }).waitFor()

  await voice
    .getByRole("button", { name: "Reset preview", exact: true })
    .click()
  await voice.locator("[data-voice-orb]").waitFor()
  assert.equal(await voice.locator("[data-turn]").count(), 0)
  assert.equal(
    await voice
      .getByRole("button", { name: "Concise answers", exact: true })
      .getAttribute("aria-pressed"),
    "true"
  )

  await choose("chat")
  console.log("Checking attachments, cancellation, and pending replies")
  const chat = app("chat")
  const chatInput = chat.getByRole("textbox", { name: "Message", exact: true })
  await page.evaluate(() => {
    window.__originalFileText = File.prototype.text
    File.prototype.text = async function () {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return window.__originalFileText.call(this)
    }
  })
  await chat.getByLabel("Context note file").setInputFiles({
    name: "stale.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("This attachment should be discarded by reset."),
  })
  await chat.getByRole("button", { name: "Reset preview", exact: true }).click()
  await page.waitForTimeout(400)
  assert.equal(
    await chat
      .getByRole("button", { name: "Remove context note", exact: true })
      .count(),
    0,
    "An attachment finishing after reset must stay discarded"
  )
  await page.evaluate(() => {
    File.prototype.text = window.__originalFileText
    delete window.__originalFileText
  })
  await chat.getByLabel("Context note file").setInputFiles({
    name: "handoff.txt",
    mimeType: "text/plain",
    buffer: Buffer.from(
      "The dock handoff is delayed because the blue crane needs a safety inspection."
    ),
  })
  await textIncludes(chat, "handoff.txt")
  await chatInput.fill("What is delaying the dock handoff?")
  await chat.getByRole("button", { name: "Send message", exact: true }).click()
  await textIncludes(chat, "blue crane")
  if (output) {
    await screenshot(chat, "example-chat.png")
  }

  const completedTurns = await chat.locator("[data-turn]").count()
  await chatInput.fill("Stop this response")
  await chat.getByRole("button", { name: "Send message", exact: true }).click()
  await chat.getByRole("button", { name: "Stop response", exact: true }).click()
  await textIncludes(chat, "Response stopped")
  await page.waitForTimeout(1100)
  assert.equal(
    await chat.locator("[data-turn]").count(),
    completedTurns + 1,
    "Stopped reply must not arrive"
  )

  await chat.getByRole("button", { name: "Reset preview", exact: true }).click()
  await chatInput.fill("What should the team change first?")
  await chat.getByRole("button", { name: "Send message", exact: true }).click()
  await chat
    .getByRole("button", { name: "Enter voice mode", exact: true })
    .click()
  await chat.locator("[data-voice-orb]").waitFor()
  await chat
    .getByRole("button", { name: "Exit voice mode", exact: true })
    .click()
  await page.waitForFunction(
    () =>
      document.querySelectorAll('[data-app-example="chat"] [data-turn]')
        .length === 2
  )
  assert.equal(
    await chat.getByText("Fieldwork assistant", { exact: true }).count(),
    2
  )

  await choose("coding")
  console.log("Checking coding decisions, file snapshots, and dependent checks")
  const coding = app("coding")
  await coding.getByRole("button", { name: "Run checks", exact: true }).click()
  await textIncludes(coding, "0 passed · 2 failed")
  await coding.getByRole("button", { name: /^Changes/ }).click()
  await coding.getByRole("button", { name: "Apply patch", exact: true }).click()
  await coding
    .getByRole("button", { name: "Working file", exact: true })
    .click()
  await textIncludes(coding, "Math.trunc(Number(value))")
  await coding.getByRole("button", { name: "Run checks", exact: true }).click()
  await textIncludes(coding, "1 passed · 1 failed")
  await appearance("Basic layout")
  await textIncludes(coding, "1 passed · 1 failed")
  await coding
    .getByRole("button", { name: "visit-card.tsx", exact: true })
    .click()
  await coding.getByRole("button", { name: "Reject", exact: true }).click()
  await coding
    .getByRole("button", { name: "Working file", exact: true })
    .click()
  await textIncludes(coding, "<p>No visits</p>")
  await coding
    .getByRole("textbox", { name: "Follow-up request" })
    .fill("Improve empty state")
  await coding.getByRole("button", { name: "Propose", exact: true }).click()
  await coding.getByRole("button", { name: "Apply patch", exact: true }).click()
  await appearance("With Agents Kit")
  await coding.getByRole("button", { name: "Run checks", exact: true }).click()
  await textIncludes(coding, "2 passed · 0 failed")
  await coding
    .getByRole("textbox", { name: "Follow-up request" })
    .fill("Build a spaceship")
  await coding
    .getByRole("button", { name: "Propose change", exact: true })
    .click()
  await textIncludes(coding, "This local example supports")

  for (const id of ["voice", "chat", "coding"]) {
    console.log(`Checking ${id} prompts and responsive views`)
    await choose(id)
    await page
      .getByRole("button", { name: "Copy build prompt", exact: true })
      .click()
    await textIncludes(page.locator("body"), "Build prompt copied.")
    assert.ok(
      (await page.evaluate(() => navigator.clipboard.readText())).includes(
        `example-${id}-app.json`
      )
    )
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (value) =>
          document.documentElement.classList.toggle("dark", value === "dark"),
        theme
      )
      for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 1100 })
        const modes =
          id === "coding"
            ? ["With Agents Kit", "Basic layout"]
            : ["With Agents Kit"]
        for (const mode of modes) {
          if (id === "coding") await appearance(mode)
          await app(id).scrollIntoViewIfNeeded()
          const size = await page.evaluate(() => ({
            viewport: innerWidth,
            page: document.documentElement.scrollWidth,
          }))
          assert.ok(
            size.page <= size.viewport + 1,
            `${id}/${theme}/${width}/${mode} overflows: ${size.page}`
          )
        }
      }
    }
    await page.setViewportSize({ width: 1440, height: 1100 })
    await page.evaluate(() => document.documentElement.classList.remove("dark"))
    if (id === "coding") await appearance("With Agents Kit")
    if (output && id === "coding") {
      await screenshot(app(id), `example-${id}.png`)
      await appearance("Basic layout")
      await screenshot(app(id), `example-${id}-basic.png`)
    }
  }
  assert.deepEqual(errors, [], "Uncaught browser errors")
  assert.equal(
    await page.evaluate(() => window.__mediaCaptureAttempts),
    0,
    "Examples must not request microphone access"
  )
  console.log(
    "App examples passed: shared voice/text state, attachments, cancellation, pending mode changes, coding decisions/check reset, copyable prompts, and responsive/theme views."
  )
} finally {
  await browser.close()
}
