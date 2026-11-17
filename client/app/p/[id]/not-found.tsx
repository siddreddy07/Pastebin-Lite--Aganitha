import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">This paste is gone</h1>
      <p className="mt-2 mb-6 text-muted-foreground">
        It expired, ran out of views, or the link is wrong.
      </p>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        Create a paste
      </Link>
    </main>
  )
}
