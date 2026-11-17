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
  if (!res.ok) throw new Error("Could not create the paste")
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

// Current state of a paste. Does not count as a view.
// "missing" = the paste no longer exists (deleted); null = the server couldn't be reached.
export async function getPasteStatus(id: string): Promise<PasteStatus | "missing" | null> {
  try {
    const res = await fetch(`${API_URL}/pastes/${id}/stats`, { cache: "no-store" })
    if (res.status === 404) return "missing"
    return res.ok ? res.json() : null
  } catch {
    return null
  }
}

// Deleting a paste that is already gone counts as success.
export async function deletePaste(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/pastes/${id}`, { method: "DELETE" })
  if (!res.ok && res.status !== 404) throw new Error("Could not delete the paste")
}

// Every call counts as one view.
export async function getPaste(id: string): Promise<Paste | null> {
  const res = await fetch(`${API_URL}/pastes/${id}`, { cache: "no-store" })
  if (res.status === 404) return null
  if (!res.ok) throw new Error("Could not load the paste")
  return res.json()
}
