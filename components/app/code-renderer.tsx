import { codeToHtml } from "@/lib/shiki"

export async function CodeRenderer({
  code,
  lang,
}: {
  code: string
  lang: string
}) {
  const html = await codeToHtml({ code, lang })

  return (
    <div className="not-prose max-h-[650px] overflow-auto overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 p-4 text-[13px]">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
