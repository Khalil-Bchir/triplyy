# Triplyy — Product Overview + Lightweight PRD (MVP)

## What Triplyy is
Triplyy helps travelers stop endlessly browsing travel sites. A user tells us where they’re going, when, and their budget/preferences. Triplyy then sends a curated digest of real deals (flights + hostels/budget hotels) to their inbox, plus a dashboard to manage trips (paid tiers).

Triplyy’s differentiator is **curation** (relevant deals, not noise). The Pro tier adds an **AI layer** that explains *why* each deal fits the traveler.

## Who it’s for (initial target)
- **Primary**: budget travelers / backpackers planning 1–3 upcoming trips, price sensitive, limited time.
- **Secondary**: frequent travelers who want a deal “radar” without browsing.

## The problem
People waste hours searching across multiple sites. Even when they find something good, they can’t easily track whether it’s still the best option next week, and they often miss time-sensitive deals.

## The solution (in one line)
**Triplyy sends you a clean weekly digest of the best deals for your exact trip window.**

## Core product loop
1. User creates a trip (destination, dates, budget, traveler type, stay type).
2. Triplyy scans sources and builds a ranked list of deals.
3. User receives a digest (and can view the latest deals in the dashboard).
4. User books directly via the source link.
5. The next digest refreshes the list for the same trip window.

## Plans (tiering)
### Free (lead magnet)
- One-time **sample digest** sent on signup.
- No dashboard access.
- Goal: prove value fast and convert to Basic.

### Basic ($9–12/month)
- Dashboard to manage trips + preferences.
- Weekly (or daily) email digests during the trip planning window.
- Deals filtered to destination + dates + budget.

### Pro ($24–29/month)
- Everything in Basic.
- AI-ranked recommendations with short reasoning (example: “best for solo backpackers under $30/night near the center”).
- On-demand “refresh now” summary and comparison across options.

## MVP scope (what we will ship first)
### Onboarding
- A simple trip form:
  - Destination
  - Dates (or a window)
  - Budget range
  - Traveler type (solo/couple/group)
  - Stay preference (hostel / budget hotel / both)
- Collect user email for the digest.

### Digest delivery
- Send a formatted digest email with:
  - 5–10 deals per digest
  - Price + key highlights (rating, location, inclusions when available)
  - A direct “book” link to the source
- Basic: scheduled weekly. Free: one-time sample. Pro: includes AI reasoning.

### Dashboard (Basic/Pro)
- Trips list: active + past trips.
- Latest digest preview and deal list per trip.
- Edit preferences / pause a trip.

### Payments (Basic/Pro)
- Stripe monthly subscriptions.
- Upgrade/downgrade and cancel.

### Authentication
- Email + password.
- Minimal flows for MVP: sign up, login, forgot/reset password.

## What’s explicitly out of scope for MVP
- Multi-city trips and complex itineraries.
- Social features (sharing, groups).
- Deep personalization from “past trips” (can come later once we have data).
- Loyalty points optimization, credit card points, etc.

## Success metrics (early)
- **Activation**: % of signups who receive the sample digest and click at least one deal.
- **Conversion**: Free → Basic conversion rate within 7 days of the sample digest.
- **Retention**: Basic churn rate (monthly) and digest open rate.
- **Outcome proxy**: clicks per digest, repeat usage across multiple trips.

## Key assumptions
- The digest itself has strong perceived value (even without AI).
- A single high-quality sample digest is enough to drive conversion.
- Users are comfortable booking through outbound links (no “middleman” friction).

## Risks & mitigations
- **Risk**: Deal quality is inconsistent.  
  - **Mitigation**: narrow initial sources, quality thresholds, and clear “why this deal” fields.
- **Risk**: Email deliverability issues.  
  - **Mitigation**: reputable email provider + verified sending domain + simple templates.
- **Risk**: Users don’t understand the difference between Basic and Pro.  
  - **Mitigation**: Pro surfaces *reasoning* and *ranking*; Basic is “filtered list”.

## Open questions (to decide before/while building)
- How often is “daily” useful vs annoying? Should Basic default to weekly?
- Do we include flights in the first digest, or start with accommodations only?
- What is the minimum set of preferences that meaningfully improves results (without adding form friction)?

