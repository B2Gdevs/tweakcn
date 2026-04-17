# TweakCN-OpenAI

A lightweight fork of [tweakcn](https://github.com/jnsahaj/tweakcn) — the visual theme editor for Tailwind CSS & shadcn/ui — with the full SaaS stack stripped out and the AI provider swapped from Gemini to OpenAI.

**Not a replacement for upstream.** Use [tweakcn.com](https://tweakcn.com) for the hosted product with presets, accounts, and sharing. Use this fork when you want to:

- Run the theme editor locally with zero accounts
- Bring your own OpenAI key (BYOK)
- Embed the editor surface into another app without inheriting auth/billing/analytics

## What was removed vs. upstream

| Removed | Reason |
|---|---|
| Better Auth / session middleware | No accounts in this fork |
| Database (Postgres / Prisma models, migrations) | No persisted user data |
| Stripe billing + subscription gating | Not applicable |
| Upstash rate-limit middleware | No shared backend to protect |
| PostHog analytics | No telemetry |
| Share / save / theme-history persistence | No backend to persist to |
| Gemini provider (Google Generative AI) | Swapped for OpenAI |

## What was added / changed

| Added | Notes |
|---|---|
| OpenAI provider (`@ai-sdk/openai`) | `gpt-4o-mini` default, `gpt-4o` for complex generations |
| BYOK posture (planned) | Key entered in UI, held only in `sessionStorage`, sent per request, never persisted server-side |
| Improved error surfacing on `streamText` / `streamObject` | Non-Error provider events now log with source tags |

Everything else — the editor UI, the tweak panels, the CSS export, the preview — is upstream. All the visual and interaction work belongs to the original author.

## Run locally

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- An OpenAI API key (only needed for AI generation; the rest of the editor works without one)

### Install

```bash
git clone https://github.com/B2Gdevs/tweakcn.git
cd tweakcn
pnpm install
```

### Env

Create `.env.local`:

```
OPENAI_API_KEY=sk-...
```

For deployment, the BYOK flow (planned) lets end users supply their own key from the UI and avoids baking a key into the deployment.

### Dev

```bash
pnpm dev              # localhost:3000
PORT=3010 pnpm dev    # if 3000 is taken
```

Editor lives at `/editor/theme`.

### Build

```bash
pnpm build
pnpm start
```

## BYOK design (planned)

End users of a deployed instance are expected to supply their own OpenAI key rather than spending the deployer's credits. The design:

| Layer | Behavior |
|---|---|
| Browser | Key entered once per tab. Stored in `sessionStorage` — tab-scoped, dies on tab close. Never `localStorage` unless user opts in. |
| Network | Sent in request body to `/api/generate-theme` over HTTPS. |
| Server (Vercel Functions) | Received as a variable, passed directly to the OpenAI client, never written to disk, never logged. |
| UI | Explicit banner: "Your key lives in this tab only. We never store it on our servers. Clears when you close this tab." |
| Optional | "Remember for 24h" toggle → encrypt with Web Crypto using a device-bound key → `localStorage`. Default OFF. |

Rationale: Vercel serverless has no reliable cross-instance persistence without KV/Redis. "Encrypted server-side temp, cleared after request" is weaker than never storing at all.

## Consumers

This fork exists to be consumed by downstream apps that want the editor surface without the SaaS stack. Current downstream:

- **[get-anything-done](https://github.com/B2Gdevs/get-anything-done)** — mounts the editor as a "Theme" nav item on its landing site. Auth, marketplace, user projects, and persistence live in the parent app; this fork stays minimal.

If you want to consume it as a library (rather than git-cloning the whole app), a `packages/tweakcn-openai` extraction is tracked in the parent project's roadmap.

## Credit

All design, UX, and theme-editor architecture belongs to **[Sahaj Jain (@iamsahaj_xyz)](https://github.com/jnsahaj)** and contributors at [jnsahaj/tweakcn](https://github.com/jnsahaj/tweakcn). If you find this useful, support the upstream project:

- ⭐ [Star the original](https://github.com/jnsahaj/tweakcn)
- Use the hosted version at [tweakcn.com](https://tweakcn.com) when accounts, presets, and sharing matter
- Follow [@iamsahaj_xyz](https://x.com/iamsahaj_xyz)

## License

Inherits upstream license. See [LICENSE](LICENSE).
