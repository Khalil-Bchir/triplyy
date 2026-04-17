# Triplyy

Triplyy sends curated flight + hostel/budget-hotel deals to travelers planning a trip. You tell us your destination, dates, and budget — we scan sources and deliver a clean digest to your inbox (and a dashboard on paid tiers).

## Repo structure
This is a Turborepo monorepo:
- **`apps/web`**: Next.js web app (landing + dashboard)
- **`apps/api`**: Hono API (auth, backend services)
- **`packages/database`**: Prisma schema + database utilities
- **`packages/types`**: shared types
- **`packages/eslint-config`** / **`packages/typescript-config`**: shared configs

## Local development (high level)
Prereqs: **Node 22.x** and **pnpm 9.x**.

```bash
pnpm install
pnpm dev
```

- Web: `http://localhost:3001`
- API: `http://localhost:3000`

## Documentation
- `[documentation/Triplyy_PRD_OVERVIEW.md](documentation/Triplyy_PRD_OVERVIEW.md)` — product overview + MVP scope
- `[documentation/SETUP.md](documentation/SETUP.md)` — environment + setup
- `[documentation/AUTH.md](documentation/AUTH.md)` — auth system overview

## License
MIT
