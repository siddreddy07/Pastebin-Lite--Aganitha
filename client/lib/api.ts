export type Paste = {
  id: string
  content: string
  expiresAt: string | null
  maxViews: number | null
  views: number
  createdAt: string
}

// Set NEXT_PUBLIC_API_URL when the backend is deployed; locally it falls back to :8080.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export async function createPaste(input: {
  content: string
  expires_at?: string
  max_views?: number
}): Promise<Paste> {
  const res = await fetch(`${API_URL}/pastes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    // The backend sends { error: "..." } for bad input; show that message.
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? "Could not create the paste")
  }
  return res.json()
}

export type PasteStatus = {
  id: string
  views: number
  maxViews: number | null
  expiresAt: string | null
  createdAt: string
  active: boolean
}

// Current state of many pastes in ONE request. Does not count as a view.
// Returns a map by id; ids the server doesn't know are left out.
// null = the server couldn't be reached.
export async function getPastesStatus(ids: string[]): Promise<Record<string, PasteStatus> | null> {
  try {
    const res = await fetch(`${API_URL}/pastes/stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
      cache: "no-store",
    })
    if (!res.ok) return null
    const list: PasteStatus[] = await res.json()
    return Object.fromEntries(list.map((s) => [s.id, s]))
  } catch {
    return null
  }
}

// Every call counts as one view.
export async function getPaste(id: string): Promise<Paste | null> {
  const res = await fetch(`${API_URL}/pastes/${id}`, { cache: "no-store" })
  if (res.status === 404) return null
  if (!res.ok) throw new Error("Could not load the paste")
  return res.json()
}
