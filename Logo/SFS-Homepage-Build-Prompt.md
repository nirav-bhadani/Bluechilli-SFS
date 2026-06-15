# SFS Homepage - Master Build Prompt

> Copy everything below the line into your AI tool. It is written to work in
> **v0**, **Cursor**, and **Claude Code**.
>
> **Which tool for which job (recommended):**
> - **v0** → generate the first polished homepage UI fast (it outputs Next.js + Tailwind natively).
> - **Cursor** → open your `D:\SFS Dedicated` project, paste this, refine across files, wire SEO + PageSpeed.
> - **Claude Code** → best for multi-file setup, the AI chat adapter layer, and config (next.config, sitemap, structured data).
>
> Project folder: `D:\SFS Dedicated`
> Logo file (already downloaded locally): `D:\SFS Dedicated\Logo` - use it for the header and footer.

---

## ROLE
You are a senior front-end engineer and UI designer. Build a **production-ready, world-class homepage** for **SFS (Storage & Fulfilment Solutions)**, a UK warehousing and fulfilment company. The homepage's hero is a **ChatGPT-style AI conversation interface**. Quality bar: a top design studio's work - distinctive, fast, and accessible.

## TECH STACK (use exactly this)
- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS** for styling
- React Server Components by default; mark only the chat as a Client Component
- No heavy UI libraries. Keep dependencies minimal for speed.
- Set the project up inside the existing folder `D:\SFS Dedicated`.

## BRAND
- **Fonts:** Headings = `"Familjen Grotesk"`; body/paragraphs = `"Open Sans"`. Load via `next/font/google` (self-hosted, no layout shift).
- **Colours (CSS variables):**
  - `--primary-color: #e50019` (red - buttons, accents, links)
  - `--secondary-color: #22262a` (dark - headings, user chat bubbles)
  - `--text-color: #696969` (body text)
  - `--white-color: #ffffff`
  - `--bg-grey-color: #383838` (footer)
- **Logo:** use the local file at `D:\SFS Dedicated\Logo` in the header and footer. Optimise it with `next/image`.
- Containers: max content width ~1170px; wide sections up to ~1720px.

## PAGE: HOMEPAGE ONLY (for now)
Build the structure so the other 17 pages can be added later, but only build the homepage.

### Section order
1. **Sticky header** - SFS logo (from local file), nav (Home, About Us, Services, Case Studies, Contact), and a red "Request a quote" button.
2. **HERO = AI CHAT** (the centrepiece - see detailed spec below).
3. **Trust stats bar** - dark background, 3–4 figures. Use placeholders (`500k+ sq ft capacity`, `15+ years`, `KPI performance reporting`, `UK · Burntwood`) and leave a clear `TODO` to swap in real numbers.
4. **Services** - cards for: Shared User Warehousing, Dedicated Site Warehousing, B2B Logistics & Delivery, E-Commerce Fulfilment, Co-Packing, Reverse Logistics.
5. **Our values** - Excellence, Integrity, Passion, Proactivity, Partnership.
6. **Contact** - left: address (Unit 25, Robins Road, Burntwood Industrial Park, WS7 3XB), phone (01543 371970), email (contact@storagefulfilment.co.uk). Right: a "Request a free quote" form (Name, Company, Email, Telephone, message).
7. **Footer** - dark grey, logo, quick links, contact, legal links (Privacy, Terms, Cookie), copyright.

## THE AI CHAT HERO (most important)
Make it feel like an AI-first website, NOT a small chatbot in a corner.

- **Headline:** "What storage, warehousing or fulfilment support does your business need?"
- **Large input** placeholder: `Describe your requirement, for example: "I need 15,000 sq ft of temporary warehouse space near Birmingham."`
- **Starter prompt chips:** Find warehouse space · Get pallet storage · Discuss fulfilment services · I need overflow storage · Speak to a specialist
- **Chat features required:** user/assistant bubbles · multi-line input · send button · **Enter to send, Shift+Enter for new line** · streaming responses · loading/thinking state · error message + **Retry** · **Stop generation** · **New conversation** · clear/delete · markdown rendering (links, bold, lists) · "Speak to a specialist" human-handover button · consent + privacy line under the input.
- **File + image upload ENABLED.** Show attach (file) and image icons in the input; selected files appear as removable chips, images preview as thumbnails; attachments are sent with the message and stored on the message's `attachments` array.
- **Storage result cards** as structured data (Location, Distance, Sq ft, Storage type, Availability date, Facilities, CTA) - render any results the agent returns as cards, not plain text.

### CRITICAL - Backend-agnostic adapter layer
Do **NOT** connect chat UI components directly to any API/WebSocket/SDK.
Create ONE isolated module, e.g. `lib/agentService.ts`, exposing these functions as the stable internal contract:
`createConversation()`, `sendMessage()`, `streamResponse()`, `stopResponse()`, `loadConversation()`, `listConversations()`, `deleteConversation()`, `submitLead()`, `requestHumanHandover()`.
- The real backend (James's REST / WebSocket / SSE / SDK) will be plugged into this file ONLY - never the UI.
- Add a `USE_REAL_AI` flag and an env-based config. For the prototype, implement `streamResponse` to call the Claude API **through a Next.js API route** (`/app/api/chat/route.ts`) so **no API key is ever exposed in browser code**. Provide a clearly-commented `// TODO: replace with James's backend` block.
- Keep mock data in a separate file (`lib/mockAgent.ts`).
- Use a consistent message shape: `{ id, conversationId, role, content, timestamp, status, attachments, metadata, suggestedActions }`.
- Add hooks/comments where analytics events would fire.

## FULL-SCREEN ASSISTANT + FLOATING CORNER BUTTON
In addition to the hero chat, add a **persistent floating CTA button** and a **full-screen ChatGPT-style assistant**.

- **Floating button:** fixed to the **bottom-right corner**, visible on scroll, brand red (`--primary-color`), labelled "Ask SFS" with a chat icon. Use a proper SVG icon (not emoji).
- **On click:** opens a **full-screen overlay** (fixed, covers the viewport, `role="dialog"`). Close via an **× button** and via **Escape**.
- **Layout must match this structure:**
  - **Left sidebar** (dark, `--secondary-color`): SFS logo at top (use the local logo from `D:\SFS Dedicated\Logo`), a **"+ New chat"** button, a **RECENT** heading, and the list of past conversations (show "No chats yet" when empty). Clicking a conversation reopens it.
  - **Main panel:** when empty, show the centred SFS logo block + heading **"How can I help you today?"**. When active, show the message thread. Sticky input bar at the bottom.
  - **Input bar:** **📎 attach** and **🖼 image** icon buttons (working - see upload spec above), a multi-line text field ("Type a message…"), and a circular **send** button. Enter to send, Shift+Enter for newline. Show a **Stop** button while streaming.
  - Consent line under the input.
- **Same real AI** through the SAME `agentService` adapter - do NOT create a second backend path. Both the hero chat and the full-screen assistant call the identical adapter functions.
- **Multiple conversations:** maintain a list in state now; wire `listConversations()` / `loadConversation()` / `deleteConversation()` to the adapter so persistence works once James's backend is connected.
- Fully responsive: on mobile the sidebar collapses to a drawer.
- Lazy-load the full-screen assistant (dynamic import) so it never affects initial PageSpeed.

## SEO + AEO + GEO (build all of this in)
- **Metadata:** use Next.js `metadata` API - title, description, canonical, Open Graph, Twitter card.
- **Structured data (JSON-LD):** include `Organization`, `LocalBusiness` (with the Burntwood address, phone, email), and `FAQPage` for any FAQ content. This drives **AEO** (answer engines) and **GEO** (AI/generative engines).
- **AEO/GEO:** write clear, question-led headings and concise, quotable answer paragraphs so AI assistants can extract answers. Add a short FAQ block with real Q&As about storage/warehousing.
- Semantic HTML5 landmarks (`header`, `main`, `nav`, `section`, `footer`), one `<h1>`, logical heading order, descriptive alt text, ARIA labels on chat controls.
- `sitemap.xml` and `robots.txt` via Next.js conventions.
- Accessible: visible keyboard focus, full keyboard nav for the chat, `prefers-reduced-motion` respected, WCAG AA contrast.

## PERFORMANCE - target 100 Google PageSpeed
- **Lazy-load the chat's heavy logic** (dynamic import, load on interaction/idle) so it never blocks first paint - this is the key to keeping 100 with a live AI chat.
- `next/image` for all images; `next/font` for fonts (no CLS).
- Minimise client JS: server components everywhere except the chat island.
- Defer/avoid third-party scripts; preconnect only what's needed.
- No layout shift, optimise LCP (hero text/logo), keep CLS ~0.

## DELIVERABLES
- A working, responsive Next.js homepage in `D:\SFS Dedicated`.
- The `agentService` adapter layer with mock + real-AI (via API route) modes.
- Streamed AI replies, starter prompts, result-card support, lead capture, human-handover, error/empty states.
- The **floating corner button** + **full-screen ChatGPT-style assistant** (sidebar, Recent, attach/image uploads), sharing the same adapter.
- SEO/AEO/GEO metadata + JSON-LD + sitemap + robots.
- A short `README` noting exactly where James's backend connects (`lib/agentService.ts`) and where to swap real trust stats.

## TONE OF COPY
Plain, warm, specific. Active voice on buttons ("Send", "Request a quote"). Sentence case. No filler.
