"use client"

import { useEffect, useState } from "react"

import { formatTime } from "@/lib/format"

// Formats in the viewer's own timezone, so it has to happen in the browser.
export function LocalTime({ iso }: { iso: string }) {
  const [text, setText] = useState("")

  useEffect(() => setText(formatTime(iso)), [iso])

  return <time dateTime={iso}>{text}</time>
}
