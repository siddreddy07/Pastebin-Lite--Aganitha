import { notFound } from "next/navigation"

import { CopyButton } from "@/components/copy-button"
import { LocalTime } from "@/components/local-time"
import { Badge } from "@/components/ui/badge"
import { getPaste } from "@/lib/api"

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const paste = await getPaste(id)
  if (!paste) notFound()

  const left = paste.maxViews === null ? null : paste.maxViews - paste.views

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-16">
      <div className="flex flex-wrap items-center gap-2">
        {paste.expiresAt && (
          <Badge variant="secondary">
            Expires <LocalTime iso={paste.expiresAt} />
          </Badge>
        )}
        {left !== null && (
          <Badge variant="secondary">
            {left} {left === 1 ? "view" : "views"} left
          </Badge>
        )}
        <div className="ml-auto">
          <CopyButton label="Copy text" getText={paste.content} />
        </div>
      </div>
      <pre className="mt-4 max-h-[75vh] overflow-auto rounded-xl border bg-card p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
        {paste.content}
      </pre>
    </main>
  )
}
