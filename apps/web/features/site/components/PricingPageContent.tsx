"use client"

import Link from "next/link"
import { Check, ChevronDown, Info, X } from "lucide-react"
import { Fragment, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type PlanKey = "Free" | "Basic" | "Pro"
type Billing = "monthly" | "annually"

type Plan = {
  title: PlanKey
  description: string
  href: string
  recommended?: boolean
  price: { monthly: string; annually: string }
}

const plans: Plan[] = [
  {
    title: "Free",
    description: "Try a one-time sample digest to see the quality of our picks.",
    price: { monthly: "$0", annually: "$0" },
    href: "/auth/login",
  },
  {
    title: "Basic",
    description: "Weekly recurring digests for every trip you’re planning.",
    price: { monthly: "$9", annually: "$81" },
    href: "/auth/login",
    recommended: true,
  },
  {
    title: "Pro",
    description: "Everything in Basic, plus AI ranking and short explanations.",
    price: { monthly: "$24", annually: "$216" },
    href: "/auth/login",
  },
]

type FeatureInclusion = { plan: PlanKey; content: React.ReactNode }
type Feature = { title: string; info?: string; inclusions: FeatureInclusion[] }
type FeatureCategory = { title: string; features: Feature[] }

const faqs = [
  {
    q: "Can I start on Free and upgrade later?",
    a: "Yes. You can upgrade anytime. Your account stays the same. Your access expands with the plan.",
  },
  {
    q: "What’s the difference between Basic and Pro?",
    a: "Basic focuses on recurring weekly digests and trip management. Pro adds AI ranking and short explanations so you can understand why each deal fits your trip.",
  },
  {
    q: "Do you need my credit card for the Free plan?",
    a: "No. Free is a one-time sample to evaluate the email format and deal quality.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes. You can cancel anytime. Your subscription stays active until the end of the billing period.",
  },
  {
    q: "Do you book flights/hotels for me?",
    a: "No. We send curated deals with direct links so you can book on the source you trust.",
  },
]

function inclusion(value: boolean | string) {
  if (value === true) return <Check className="size-4 text-primary lg:size-5" aria-label="Included" />
  if (value === false) return <X className="size-4 text-muted-foreground lg:size-5" aria-label="Not included" />
  return <span className="text-sm text-muted-foreground">{value}</span>
}

export function PricingPageContent() {
  const [billing, setBilling] = useState<Billing>("monthly")
  const ctaLabelByPlan: Record<PlanKey, string> = {
    Free: "Get a sample digest",
    Basic: "Start weekly digests",
    Pro: "Start AI ranked picks",
  }

  const featureMatrix: FeatureCategory[] = useMemo(
    () => [
      {
        title: "Overview",
        features: [
          {
            title: "Sample digest",
            info: "Free includes one sample so you can evaluate the format and deal quality.",
            inclusions: [
              { plan: "Free", content: "1" },
              { plan: "Basic", content: "Included" },
              { plan: "Pro", content: "Included" },
            ],
          },
          {
            title: "Recurring weekly digests",
            info: "Weekly recurring emails based on your saved trip preferences.",
            inclusions: [
              { plan: "Free", content: inclusion(false) },
              { plan: "Basic", content: inclusion(true) },
              { plan: "Pro", content: inclusion(true) },
            ],
          },
          {
            title: "Deals per digest",
            inclusions: [
              { plan: "Free", content: "Up to 5" },
              { plan: "Basic", content: "8–10" },
              { plan: "Pro", content: "8–10" },
            ],
          },
          {
            title: "Dashboard access",
            info: "Manage trips, preferences, and delivery schedule from your dashboard.",
            inclusions: [
              { plan: "Free", content: inclusion(false) },
              { plan: "Basic", content: inclusion(true) },
              { plan: "Pro", content: inclusion(true) },
            ],
          },
          {
            title: "Unlimited trips",
            inclusions: [
              { plan: "Free", content: inclusion(false) },
              { plan: "Basic", content: inclusion(true) },
              { plan: "Pro", content: inclusion(true) },
            ],
          },
        ],
      },
      {
        title: "AI & power features",
        features: [
          {
            title: "AI-ranked recommendations",
            info: "Pro ranks deals to match your trip profile and budget.",
            inclusions: [
              { plan: "Free", content: inclusion(false) },
              { plan: "Basic", content: inclusion(false) },
              { plan: "Pro", content: inclusion(true) },
            ],
          },
          {
            title: "Reasoning explanations",
            info: "Short explanations that tell you why the deal fits your dates and constraints.",
            inclusions: [
              { plan: "Free", content: inclusion(false) },
              { plan: "Basic", content: inclusion(false) },
              { plan: "Pro", content: inclusion(true) },
            ],
          },
          {
            title: "On-demand digest",
            info: "Generate a fresh digest on demand (instead of waiting for the next weekly run).",
            inclusions: [
              { plan: "Free", content: inclusion(false) },
              { plan: "Basic", content: inclusion(false) },
              { plan: "Pro", content: inclusion(true) },
            ],
          },
        ],
      },
    ],
    [],
  )

  return (
    <section className="relative overflow-hidden py-14 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-[12rem] h-[22rem] w-[22rem] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <div className="inline-flex items-center rounded-full bg-secondary/15 px-4 py-2 text-xs font-semibold text-foreground">
                Pricing
              </div>
              <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
                Start free. Upgrade when it pays off.
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
                Every plan sends real travel deals. Upgrade for recurring digests, a dashboard to manage trips, and AI-ranked picks.
              </p>
            </div>

            <Card className="p-5">
              <div className="text-sm font-semibold">Best for most people</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Basic unlocks recurring digests and dashboard access. Upgrade to Pro when you want AI ranking + reasoning.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/auth/login">Start weekly digests</Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="#compare">Compare plans</Link>
                </Button>
              </div>
            </Card>
          </div>

          <div className="mt-10 lg:mt-14" id="compare">
            <div className="rounded-[var(--radius)] border bg-background/70 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:sticky lg:top-20">
              <div className="grid gap-4 lg:grid-cols-5 lg:items-end">
                <div className="lg:col-span-2">
                  <div className="flex h-full flex-col justify-end">
                    <span className="mb-2 text-xs font-semibold text-muted-foreground">Billing</span>
                    <Tabs value={billing} onValueChange={(v) => setBilling(v as Billing)}>
                      <TabsList>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="annually">Annually</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Save 2 months with annual billing.
                    </p>
                  </div>
                </div>

                {plans.map((plan) => (
                  <Card
                    key={plan.title}
                    className={cn(
                      "rounded-xl p-4 shadow-none transition-colors",
                      plan.recommended ? "border-primary bg-accent" : "hover:bg-muted/20",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold">{plan.title}</h3>
                      {plan.recommended ? <Badge>Most popular</Badge> : null}
                    </div>
                    <p className="mt-2 text-sm font-medium text-muted-foreground">
                      {plan.price[billing]}
                      <span className="ml-1 text-xs text-muted-foreground">
                        {billing === "monthly" ? "/mo" : "/yr"}
                      </span>
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {plan.description}
                    </p>
                    <Button
                      asChild
                      variant={plan.recommended ? "default" : "outline"}
                      className="mt-4 w-full"
                    >
                      <Link href={plan.href}>{ctaLabelByPlan[plan.title]}</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-10 lg:mt-16 lg:space-y-14">
            {featureMatrix.map((category) => (
              <div key={category.title}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>

                <Card className="mt-4 overflow-hidden">
                  <div className="hidden grid-cols-5 gap-6 border-b bg-muted/20 px-6 py-3 text-xs font-semibold text-muted-foreground lg:grid">
                    <div className="col-span-2">Feature</div>
                    <div className="text-left">Free</div>
                    <div className="text-left">Basic</div>
                    <div className="text-left">Pro</div>
                  </div>

                  <div className="px-6">
                    <TooltipProvider delayDuration={150}>
                      {category.features.map((feature) => (
                        <Fragment key={feature.title}>
                          {/* Desktop matrix */}
                          <dl className="hidden grid-cols-5 gap-6 border-b border-border py-4 last:border-b-0 lg:grid">
                            <dt className="col-span-2">
                              <Tooltip>
                                <div className="flex items-start gap-2">
                                  <h4 className="text-sm font-medium">{feature.title}</h4>
                                  {feature.info ? (
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                        aria-label="More info"
                                      >
                                        <Info className="size-4" />
                                      </button>
                                    </TooltipTrigger>
                                  ) : null}
                                </div>
                                {feature.info ? <TooltipContent>{feature.info}</TooltipContent> : null}
                              </Tooltip>
                            </dt>

                            {(["Free", "Basic", "Pro"] as const).map((planKey) => {
                              const found = feature.inclusions.find((i) => i.plan === planKey)
                              return (
                                <dd key={planKey} className="flex items-center text-sm text-muted-foreground">
                                  {found?.content ?? <span className="text-muted-foreground">N/A</span>}
                                </dd>
                              )
                            })}
                          </dl>

                          {/* Mobile collapsible */}
                          <Collapsible className="border-b border-border py-4 last:border-b-0 lg:hidden" defaultOpen={false}>
                            <CollapsibleTrigger asChild>
                              <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="text-sm font-medium">{feature.title}</div>
                                  {feature.info ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          type="button"
                                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                          aria-label="More info"
                                          onClick={(e) => e.stopPropagation()}
                                          onPointerDown={(e) => e.stopPropagation()}
                                          onKeyDown={(e) => e.stopPropagation()}
                                        >
                                          <Info className="size-4" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>{feature.info}</TooltipContent>
                                    </Tooltip>
                                  ) : null}
                                </div>
                                <ChevronDown className='size-5 transition-transform group-data-[state="open"]:rotate-180' />
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-3">
                              <div className="grid gap-2">
                                {(["Free", "Basic", "Pro"] as const).map((planKey) => {
                                  const found = feature.inclusions.find((i) => i.plan === planKey)
                                  return (
                                    <div
                                      key={planKey}
                                      className="flex items-center justify-between rounded-lg border bg-muted/10 px-3 py-2 text-xs text-muted-foreground"
                                    >
                                      <span className="font-medium text-foreground">{planKey}</span>
                                      <span className="flex items-center">{found?.content ?? "N/A"}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </Fragment>
                      ))}
                    </TooltipProvider>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/auth/login">Start weekly digests</Link>
            </Button>
          </div>

      {/* FAQ */}
          <div className="mt-16 lg:mt-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-xs font-medium uppercase tracking-widest text-primary">FAQ</div>
              <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
                Questions, answered
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
                If you’re unsure which plan to choose, start with Basic. Upgrade to Pro when you want AI-ranked picks and reasoning.
              </p>
            </div>

            <Card className="mx-auto mt-10 max-w-3xl">
              <div className="px-6">
                <Accordion type="single" collapsible>
                  {faqs.map((f) => (
                    <AccordionItem key={f.q} value={f.q}>
                      <AccordionTrigger className="text-base font-semibold hover:no-underline">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

