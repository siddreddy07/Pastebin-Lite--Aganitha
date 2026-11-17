"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"

import { CopyButton } from "@/components/copy-button"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createPaste } from "@/lib/api"
import { pasteUrl, savePaste } from "@/lib/store"

export function PasteForm() {
  const [content, setContent] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [maxViews, setMaxViews] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [link, setLink] = useState("")

  const lines = content ? content.split("\n").length : 0

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const paste = await createPaste({
        content,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        max_views: maxViews ? Number(maxViews) : undefined,
      })
      savePaste({
        id: paste.id,
        snippet: content.slice(0, 160),
        createdAt: paste.createdAt,
        expiresAt: paste.expiresAt,
        maxViews: paste.maxViews,
      })
      setLink(pasteUrl(paste.id))
    } catch {
      setError("Couldn't create the paste. Check that the server is running on port 8080.")
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setContent("")
    setExpiresAt("")
    setMaxViews("")
    setLink("")
  }

  if (link) {
    return (
      <div className="animate-in rounded-xl border bg-card p-6 duration-300 fade-in-0 slide-in-from-bottom-2">
        <h2 className="font-heading text-xl font-semibold">Your paste is live</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Anyone with this link can read it until it expires.
        </p>
        <Input readOnly value={link} className="mt-5 font-mono" onFocus={(e) => e.target.select()} />
        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton getText={() => link} label="Copy link" />
          <a href={link} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ExternalLink />
            Open paste
          </a>
          <Button type="button" variant="ghost" size="sm" onClick={reset}>
            Create another
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Opening the link counts as a view, including your own.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="overflow-hidden rounded-xl border bg-card shadow-xs focus-within:ring-3 focus-within:ring-ring/40">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste or type anything…"
          spellCheck={false}
          aria-label="Paste content"
          className="max-h-[12rem] lg:max-h-[18rem] min-h-40 lg:min-h-80 resize-none overflow-y-auto rounded-none border-0 bg-transparent p-4 font-mono text-sm leading-relaxed focus-visible:ring-0 dark:bg-transparent"
        />
        <div className="flex justify-between border-t px-4 py-2 font-mono text-xs text-muted-foreground">
          <span>{lines} {lines === 1 ? "line" : "lines"}</span>
          <span>{content.length.toLocaleString()} characters</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="expires">Expires at (optional)</Label>
          <Input id="expires" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="views">Maximum views (optional)</Label>
          <Input id="views" type="number" min={1} placeholder="Unlimited" value={maxViews} onChange={(e) => setMaxViews(e.target.value)} />
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" disabled={loading || !content.trim()}>
        {loading ? "Creating…" : "Create paste"}
      </Button>
    </form>
  )
}
