import { strings } from "@/lib/strings"

export default function PrivacyPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            {strings.footer_privacy_policy}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This page is a placeholder while Triplyy is in active development.
          </p>

          <div className="mt-8 space-y-6 text-sm leading-6 text-foreground">
            <section>
              <h2 className="font-semibold">What we collect</h2>
              <p className="mt-2 text-muted-foreground">
                Email address and basic preference inputs you submit (like destination, dates, and budget) so we can send
                you curated deal digests.
              </p>
            </section>

            <section>
              <h2 className="font-semibold">How we use it</h2>
              <p className="mt-2 text-muted-foreground">
                To deliver your digests, operate your account, and improve the relevance of deals.
              </p>
            </section>

            <section>
              <h2 className="font-semibold">Contact</h2>
              <p className="mt-2 text-muted-foreground">
                For privacy questions, reply to a Triplyy email digest (once you’ve received one).
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

