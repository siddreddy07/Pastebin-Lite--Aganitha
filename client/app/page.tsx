import { PasteForm } from "@/components/paste-form"

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-16">
      <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Paste text, get a link.
      </h1>
      <p className="mt-3 mb-8 max-w-prose text-muted-foreground">
        Set an expiry time or a view limit and the link stops working when either runs out.
      </p>
      <PasteForm />
    </main>
  )
}
