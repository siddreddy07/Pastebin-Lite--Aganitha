// The API has no accounts, so pastes you create are remembered in this browser.
export type SavedPaste = {
  id: string
  snippet: string
  createdAt: string
  expiresAt: string | null
  maxViews: number | null
}

const KEY = "scrap:pastes"

export function loadPastes(): SavedPaste[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]")
  } catch {
    return []
  }
}

export function savePaste(paste: SavedPaste) {
  localStorage.setItem(KEY, JSON.stringify([paste, ...loadPastes()]))
}

export function removePaste(id: string) {
  localStorage.setItem(KEY, JSON.stringify(loadPastes().filter((p) => p.id !== id)))
}

export function pasteUrl(id: string) {
  return `${window.location.origin}/p/${id}`
}
