"use client"

import * as React from "react"

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

// Press "d" to toggle dark mode (ignored while typing).
function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Apply the saved theme, or the system one, once the page has loaded.
  React.useEffect(() => {
    const saved = localStorage.getItem("theme")
    const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches
    document.documentElement.classList.toggle("dark", dark)
  }, [])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.toLowerCase() !== "d") return
      if (isTypingTarget(event.target)) return

      const dark = document.documentElement.classList.toggle("dark")
      localStorage.setItem("theme", dark ? "dark" : "light")
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return <>{children}</>
}

export { ThemeProvider }
