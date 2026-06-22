# SFS - Storage & Fulfilment Solutions homepage

Production-ready Next.js (App Router) + TypeScript + Tailwind homepage for SFS, a
UK warehousing and fulfilment company. The hero is a ChatGPT-style AI chat, with a
floating "Ask SFS" button that opens a full-screen assistant. Both chat surfaces
talk to **one** backend-agnostic adapter so the real AI backend plugs in cleanly.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional - defaults to the mock agent
npm run dev                  # http://localhost:3000
```

The app runs with **no API key** out of the box: the chat uses a local mock
agent. To use real Claude responses, see below.

## Scripts

| Command         | Purpose                          |
| --------------- | -------------------------------- |
| `npm run dev`   | Local dev server                 |
| `npm run build` | Production build                 |
| `npm start`     | Run the production build         |
| `npm run lint`  | Lint                             |

## Where James's backend connects  ⟵ READ THIS

**Only one file** ever talks to a backend: [`lib/agentService.ts`](lib/agentService.ts).

The UI (`components/HeroChat.tsx`, `components/FullScreenAssistant.tsx`) calls
these stable functions and nothing else:

- `createConversation()`, `listConversations()`, `loadConversation()`, `deleteConversation()`
- `sendMessage()`, `streamResponse()`, `stopResponse()`
- `submitLead()`, `requestHumanHandover()`

Every function has a `// TODO: replace with James's backend` marker. Swap the
bodies to call the real REST / WebSocket / SSE / SDK and keep the signatures
identical - the UI needs no changes. The shared message shape lives in
[`lib/types.ts`](lib/types.ts) (`{ id, conversationId, role, content, timestamp,
status, attachments, metadata, suggestedActions }`).

Mock data is isolated in [`lib/mockAgent.ts`](lib/mockAgent.ts) and can be deleted
once the real backend is live.

## Real AI (prototype path)

A secure Next.js API route at [`app/api/chat/route.ts`](app/api/chat/route.ts)
calls OpenRouter server-side, so **the API key is never exposed to the
browser**. To enable it:

```bash
# .env.local
NEXT_PUBLIC_USE_REAL_AI=true
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=deepseek/deepseek-v4-flash   # optional; cheap demo default
# OPENROUTER_MODEL=openai/gpt-5.4-mini        # alternative
```

With `NEXT_PUBLIC_USE_REAL_AI=false` (default) the adapter uses the mock agent.

## Things to update before launch

- **Trust stats** - placeholders in [`lib/siteConfig.ts`](lib/siteConfig.ts)
  (`stats`). Marked with `TODO`. Same file holds address/phone/email and the
  canonical `url` used by metadata + JSON-LD.
- **Legal pages** - `/privacy`, `/terms`, `/cookies` are linked but not built yet.
- **Logo** - `public/sfs-logo.svg` (white, for dark backgrounds) and
  `public/sfs-logo-dark.svg` (for the white header) come from `Logo/footerlogo.svg`.

## SEO / AEO / GEO

- Metadata API (title/description/canonical/OG/Twitter) in `app/layout.tsx`.
- JSON-LD `Organization` + `LocalBusiness` + `FAQPage` in `components/JsonLd.tsx`
  (FAQ copy is shared with the visible FAQ section so the markup stays valid).
- `app/sitemap.ts` and `app/robots.ts` via Next.js conventions.
- Semantic landmarks, one `<h1>`, ARIA labels on chat controls,
  `prefers-reduced-motion` respected, WCAG-AA contrast.

## Performance

- The full-screen assistant is a dynamic import (`ssr: false`) so its JS never
  blocks first paint.
- Server Components everywhere except the chat islands.
- `next/font` (no CLS) and `next/image` for the logo.

## Structure

```
app/
  api/chat/route.ts     secure Claude proxy (key stays server-side)
  layout.tsx            fonts, metadata, JSON-LD
  page.tsx              homepage composition
  sitemap.ts robots.ts icon.svg
components/
  HeroChat.tsx          AI chat hero (client island)
  FloatingAssistant.tsx floating button + dynamic import
  FullScreenAssistant.tsx  full-screen ChatGPT-style assistant
  Header/TrustStats/Services/Values/Faq/Contact/Footer.tsx
  chat/                 shared chat UI (input, list, markdown, cards, useChat)
lib/
  agentService.ts       ← the ONE adapter. Backend plugs in here.
  mockAgent.ts types.ts siteConfig.ts
```
