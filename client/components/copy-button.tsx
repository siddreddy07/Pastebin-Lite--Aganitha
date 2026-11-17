"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CopyButton({
  getText,
  label = "Copy",
  variant = "outline",
  disabled = false,
}: {
  disabled?: boolean
  // Server components must pass a plain string; client components can pass a function.
  getText: string | (() => string)
  label?: string
  variant?: "outline" | "ghost" | "secondary"
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(typeof getText === "function" ? getText() : getText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button type="button" variant={variant} size="sm" onClick={copy} disabled={disabled}>
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : label}
    </Button>
  )
}
