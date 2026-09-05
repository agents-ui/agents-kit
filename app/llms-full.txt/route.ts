import { readFileSync } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"

export const dynamic = "force-static"

export function GET() {
  const content = readFileSync(
    path.join(process.cwd(), "llms-full.txt"),
    "utf8"
  )
  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
