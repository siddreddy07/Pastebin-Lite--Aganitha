import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-6">
      <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
        Scrap
      </Link>
      <nav className="flex items-center gap-5 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          New paste
        </Link>
        <Link href="/dashboard" className="transition-colors hover:text-foreground">
          Dashboard
        </Link>
      </nav>
    </header>
  )
}
