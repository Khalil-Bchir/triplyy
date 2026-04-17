 "use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { getPostAuthRedirectPath } from "@/features/auth/utils/post-auth-redirect"

export function HomePageContent() {
  const { hasHydrated, isAuthenticated, profile } = useAuth()
  const postAuthHref = getPostAuthRedirectPath(profile ?? null)
  const primaryHref = hasHydrated && isAuthenticated ? postAuthHref : "/auth/login"
  const authedPrimaryLabel =
    postAuthHref === "/upgrade" ? "Upgrade to unlock your dashboard" : "Go to dashboard"
  const primaryLabel = hasHydrated && isAuthenticated ? authedPrimaryLabel : "Login to get deals"
  const primaryLabelArrow = hasHydrated && isAuthenticated
    ? (postAuthHref === "/upgrade" ? "Upgrade to unlock your dashboard →" : "Go to dashboard →")
    : "Login to get deals →"

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl pb-10 pt-16 text-center sm:pt-20">
            <Badge variant="secondary" className="mx-auto gap-2 rounded-full bg-secondary/15 px-4 py-2 text-sm font-medium text-foreground">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Travel smarter on a backpacker budget
            </Badge>

            <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
              The best hostel &amp; flight deals,
              <br />
              sent straight to your <span className="text-primary">inbox.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
              Tell us where you’re going and when. We scan hundreds of deals and send you only what fits your budget.
              Weekly. Curated. No noise.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button size="lg" className="px-8 motion-safe:transition-transform motion-safe:active:scale-[0.98]" asChild>
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 motion-safe:transition-colors"
                asChild
              >
                <a href="#sample">See a sample email</a>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">No credit card required · Free sample on signup</p>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y bg-card/50 py-4">
        <div className="overflow-hidden">
          <div className="flex w-[200%] gap-12 whitespace-nowrap" style={{ animation: "triplyyMarquee 20s linear infinite" }}>
            {[
              "Istanbul from $18/night",
              "Bangkok hostels under $12",
              "Lisbon flights from €89",
              "Bali budget hotels $22/night",
              "Prague hostels from $14",
              "Mexico City deals this week",
              "Istanbul from $18/night",
              "Bangkok hostels under $12",
              "Lisbon flights from €89",
              "Bali budget hotels $22/night",
              "Prague hostels from $14",
              "Mexico City deals this week",
            ].map((t, idx) => (
              <div key={`${t}-${idx}`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="container mx-auto px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-medium uppercase tracking-widest text-primary">How it works</div>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps to your next adventure
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            No accounts to manage, no endless browsing. Just deals that match your trip.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Fill your trip form", "Destination, dates, budget, hostel or hotel. Takes under two minutes."],
              ["02", "We scan the deals", "We search flights, hostels, and budget hotels across multiple sources filtered to your exact window."],
              ["03", "Digest lands in your inbox", "Weekly email with the top 8-10 deals ranked by value. Pro users get AI-ranked picks with explanations."],
              ["04", "Book directly", "Every deal links straight to the source. No middleman, no hidden fees from us."],
            ].map(([num, title, desc]) => (
              <Card
                key={num}
                className="gap-0 rounded-[var(--radius)] py-0 text-left motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
              >
                <CardContent className="p-6">
                  <div className="text-4xl font-extrabold text-primary">{num}</div>
                  <div className="mt-3 font-semibold">{title}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
      </section>

        {/* FORM PREVIEW */}
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <Card className="gap-0 rounded-[var(--radius)] py-0">
            <CardContent className="p-7">
              <div className="text-lg font-bold">Plan your trip</div>
              <Separator className="my-4" />
              <div className="grid gap-4">
                {[
                  ["Where are you going?", "Istanbul, Turkey"],
                  ["Flying from", "Tunis, Tunisia"],
                ].map(([label, placeholder]) => (
                  <div key={label} className="grid gap-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
                    <Input className="bg-background" placeholder={placeholder} />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Departure</Label>
                    <Input className="bg-background" placeholder="Oct 10, 2026" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Return</Label>
                    <Input className="bg-background" placeholder="Oct 20, 2026" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Budget / night</Label>
                    <Input className="bg-background" placeholder="$30 USD" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Stay type</Label>
                    <Input className="bg-background" placeholder="Hostel or hotel" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your email</Label>
                  <Input className="bg-background" placeholder="you@email.com" />
                </div>
                <Button className="mt-2 w-full" asChild>
                  <Link href={primaryHref}>{primaryLabelArrow}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">
              Simple form.
              <br />
              Serious deals.
            </h3>
            <p className="mt-4 text-muted-foreground">
              We only ask what we actually need. Your trip profile drives the engine. The more accurate you are, the
              sharper the deals.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                "No account needed for the free sample digest",
                "Deals updated and re-fetched every week",
                "Pro plan adds AI reasoning on why each deal fits you",
                "Manage multiple trips from one dashboard",
              ].map((t) => (
                <div key={t} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-secondary/15">
                    <Check className="h-4 w-4 text-secondary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EMAIL PREVIEW */}
        <section id="sample" className="border-y bg-card/60 px-6 py-16 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="text-xs font-medium uppercase tracking-widest text-primary">Sample digest</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">What lands in your inbox</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Clean, scannable, direct links. No filler.</p>
          </div>

          <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-[var(--radius)] border bg-card text-left shadow-sm motion-safe:transition-transform motion-safe:hover:-translate-y-0.5">
            <div className="px-5 py-3 text-xs text-muted-foreground">
              <div className="flex gap-6">
                <span>From: deals@triply.app</span>
                <span className="hidden sm:inline">Subject: Your Istanbul deals (week of Oct 6)</span>
              </div>
            </div>
            <Separator />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 border-b pb-5">
                <div className="font-extrabold">Triplyy<span className="text-primary">.</span></div>
                <div className="text-xs text-muted-foreground">Istanbul · Oct 10–20 · $30/night</div>
              </div>
              <div className="mt-5 font-bold">Your deals this week</div>
              <p className="mt-1 text-sm text-muted-foreground">
                8 picks, filtered for solo backpackers under $30/night in Istanbul.
              </p>

              <div className="mt-5 grid gap-3">
                <div className="flex gap-4 rounded-lg bg-background px-4 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">🏨</div>
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex rounded px-2 py-0.5 text-xs font-semibold text-secondary bg-secondary/15">
                      AI pick
                    </div>
                    <div className="mt-1 text-sm font-medium">World House Hostel, Sultanahmet</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      ⭐ 4.7 · Mixed dorm · 200m from Hagia Sophia · Free breakfast
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">$19</div>
                    <div className="text-xs text-muted-foreground">/night</div>
                  </div>
                </div>

                <div className="flex gap-4 rounded-lg bg-background px-4 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">✈️</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">Turkish Airlines: TUN → IST direct</div>
                    <div className="mt-1 text-xs text-muted-foreground">Oct 10 · 3h 15m · 1 stop return</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">$210</div>
                    <div className="text-xs text-muted-foreground">roundtrip</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
                You’re receiving this because you set up a trip to Istanbul ·{" "}
                <a className="text-primary hover:underline" href="#">
                  Manage trips
                </a>{" "}
                ·{" "}
                <a className="hover:underline" href="#">
                  Unsubscribe
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="mx-auto max-w-6xl px-6 py-20 text-center">
          <div className="text-xs font-medium uppercase tracking-widest text-primary">Pricing</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Start free. Upgrade when it pays off.</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Every plan sends real deals. Pro adds the AI layer that does the thinking for you.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                desc: "One sample digest to see if we're worth your inbox.",
                features: ["One-time sample email", "Up to 5 deals per digest"],
                off: ["Dashboard access", "Weekly recurring digests", "AI recommendations"],
                featured: false,
                cta: "Get free sample",
              },
              {
                name: "Basic",
                price: "$9",
                period: "/month",
                desc: "Weekly deals digest for every trip you're planning.",
                features: ["Unlimited trips", "8–10 deals per digest, weekly", "Dashboard to manage trips", "Flights + hotels + hostels"],
                off: ["AI-ranked recommendations"],
                featured: true,
                badge: "Most popular",
                cta: "Start Basic",
              },
              {
                name: "Pro",
                price: "$24",
                period: "/month",
                desc: "Everything in Basic, plus AI that reasons about your travel style.",
                features: ["Everything in Basic", "AI-ranked deals with reasoning", "On-demand digest anytime", "Multi-trip AI comparisons", "Priority deal refresh"],
                off: [],
                featured: false,
                cta: "Start Pro",
              },
            ].map((p) => (
              <div
                key={p.name}
                className={[
                  "relative rounded-[var(--radius)] border p-7 text-left shadow-sm motion-safe:transition-transform motion-safe:hover:-translate-y-0.5",
                  p.featured ? "border-primary bg-accent" : "bg-card",
                ].join(" ")}
              >
                {p.badge ? (
                  <div className="absolute right-5 top-5 rounded-full border border-primary bg-card px-3 py-1 text-xs font-semibold text-primary">
                    {p.badge}
                  </div>
                ) : null}
                <div className="font-semibold">{p.name}</div>
                <div className="mt-3 text-4xl font-extrabold tracking-tight">
                  {p.price} <span className="text-sm font-normal text-muted-foreground">{p.period}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
                <div className="my-6 h-px bg-border" />
                <div className="grid gap-3 text-sm text-muted-foreground">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {f}
                    </div>
                  ))}
                  {p.off.map((f) => (
                    <div key={f} className="flex items-center gap-2 opacity-50">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                      {f}
                    </div>
                  ))}
                </div>
                <Button
                  variant={p.featured ? "default" : "outline"}
                  className="mt-6 w-full"
                  asChild
                >
                  <Link href={primaryHref}>
                    {hasHydrated && isAuthenticated ? authedPrimaryLabel : "Login"}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

    </main>
  )
}
