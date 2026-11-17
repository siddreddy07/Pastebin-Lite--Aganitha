"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink, Trash2 } from "lucide-react"

import { CopyButton } from "@/components/copy-button"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { deletePaste, getPasteStatus, type PasteStatus } from "@/lib/api"
import { formatTime } from "@/lib/format"
import { loadPastes, pasteUrl, removePaste, type SavedPaste } from "@/lib/store"

export default function DashboardPage() {
  const [pastes, setPastes] = useState<SavedPaste[] | null>(null)
  const [statuses, setStatuses] = useState<Record<string, PasteStatus | "missing" | null>>({})

  // Ask the server how each saved paste is doing now (views used, expired, ...).
  const refresh = useCallback(async () => {
    const saved = loadPastes()
    setPastes(saved)
    const results = await Promise.all(saved.map((p) => getPasteStatus(p.id)))
    setStatuses(Object.fromEntries(saved.map((p, i) => [p.id, results[i]])))
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener("focus", refresh) // coming back from an opened paste
    return () => window.removeEventListener("focus", refresh)
  }, [refresh])

  async function remove(id: string) {
    if (!window.confirm("Delete this paste? Its link will stop working.")) return
    try {
      await deletePaste(id)
      removePaste(id)
      refresh()
    } catch {
      window.alert("Couldn't delete the paste. Check that the server is running.")
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Your pastes</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        Pastes created in this browser. Deleting one removes its link for everyone.
      </p>

      {pastes === null ? null : pastes.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="text-muted-foreground">You haven&apos;t created any pastes yet.</p>
          <Link href="/" className={buttonVariants({ className: "mt-4" })}>
            Create a paste
          </Link>
        </div>
      ) : (
        <ul className="divide-y rounded-xl border bg-card">
          {pastes.map((p) => {
            // Live numbers from the server; fall back to what we saved if it can't be reached.
            const status = statuses[p.id]
            const missing = status === "missing"
            const live = status && status !== "missing" ? status : null
            const views = live?.views ?? 0
            const maxViews = live?.maxViews ?? p.maxViews
            const expiresAt = live?.expiresAt ?? p.expiresAt

            const expired = expiresAt !== null && new Date(expiresAt) <= new Date()
            const usedUp = maxViews !== null && views >= maxViews
            const active = !missing && (live ? live.active && !expired : !expired)

            return (
              <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm">{p.snippet.split("\n")[0] || "(empty)"}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatTime(p.createdAt)}</span>
                    {missing ? (
                      <Badge variant="destructive">Deleted</Badge>
                    ) : expired ? (
                      <Badge variant="destructive">Expired</Badge>
                    ) : usedUp ? (
                      <Badge variant="destructive">No views left</Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                    {live && (
                      <Badge variant="secondary">
                        {maxViews !== null ? `${views} of ${maxViews} views` : `${views} ${views === 1 ? "view" : "views"}`}
                      </Badge>
                    )}
                    {!expired && !usedUp && expiresAt &&<Badge variant="secondary">Expires {formatTime(expiresAt)}</Badge>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <CopyButton getText={() => pasteUrl(p.id)} label="Copy link" disabled={!active} />
                  {active ? (
                    <a href={`/p/${p.id}`} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", size: "sm" })}>
                      <ExternalLink />
                      Open
                    </a>
                  ) : (
                    <Button type="button" variant="outline" size="sm" disabled>
                      <ExternalLink />
                      Open
                    </Button>
                  )}
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Delete paste" onClick={() => remove(p.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
