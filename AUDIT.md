# LenzerHub — audit and rebuild

Verified against the repo at `v2bobby/lzn-hub`. All files typecheck (`tsc -b` on both
client and server configs), lint clean, and `vite build` succeeds.

---

## 1. Audit summary

### Vibecoded patterns found

| Pattern | Where |
|---|---|
| Radial dot-matrix grid behind hero text | `Home.tsx` hero, inline `backgroundImage` |
| Glassmorphism card (`bg-white/5 backdrop-blur-sm` + `shadow-2xl`) | Hero "product preview" panel |
| Fake macOS terminal window (red/amber/green traffic-light dots) | Hero panel header |
| Left-edge coloured stripes on cards (`border-l-2`) | Hero findings list, Analysis explanations |
| Cliché 3-card "1 / 2 / 3" numbered row | Home "Upload → AI Analysis → Negotiate" |
| Generic 6-item feature card grid with decorative dashes | Home features section |
| Pill radius everywhere (`rounded-full` on every button) | All pages |
| Terracotta-on-navy (`#d4a373` / `#0a1045` / `#f4f5f0` cream) | Global palette — the exact default AI trio |
| Inter + Playfair Display | `index.html`, `index.css` |
| Fabricated social proof: "Trusted by 500+ growing companies" with A/B/C avatar circles | Hero |
| Stock Vite template README as the project README | `app/README.md` |
| `"name": "my-app"` | `package.json` |

### Functional bugs found

1. **Dead export button.** `Analysis.tsx` → `alert('Export feature coming soon')`.
2. **Dead footer legal links.** Privacy Policy and Terms of Service were `<span>` elements, not links. No routes existed.
3. **Dead social link.** Footer LinkedIn pointed at `href="#"`.
4. **No mobile navigation at all.** The nav was `hidden md:flex` with no hamburger — on mobile there was no way to reach any nav item.
5. **Redirect during render.** `useAuth` called `window.location.href = "/login"` in the render body. Fires twice under StrictMode and races the auth query. Moved into an effect with `navigate(..., {replace:true})`.
6. **Full page reload on logout.** `window.location.reload()` discarded the whole React tree and query cache.
7. **Ghost pages.** `Blog.tsx`, `Pricing.tsx`, `Product.tsx`, `Solutions.tsx`, `Contact.tsx` existed but were not routed. `AuthLayout.tsx`, `AuthLayoutSkeleton.tsx`, `ChatWidget.tsx`, `HeroCanvas.tsx`, `App.css` were imported by nothing.
8. **Nav pointed at non-existent anchors.** `#features` and `#product` resolved only on the homepage; from `/about` they went nowhere.
9. **Hardcoded copyright year** (`© 2026` as a literal).
10. **Bare-bones 404.** 18 lines, no navigation out.
11. **No favicon.**
12. **Spinners instead of skeletons** on every async boundary.
13. **No error states.** Every failed query rendered blank or a bare "not found".
14. **`window.confirm()`** for contract deletion.
15. **N+1 query.** `contract.stats` looped `SELECT` per contract for findings. Replaced with a single `inArray` query.
16. **Duplicate findings on re-analysis.** `analyze` inserted without clearing prior findings.
17. **No failure path.** A throw mid-analysis left `status: "analyzing"` forever. Now sets `status: "failed"` and the UI offers Retry.
18. **Errors leaked as generic `Error`,** not `TRPCError`, so tRPC returned 500 instead of `NOT_FOUND`.
19. **Invalid CSS colours in the toaster.** `ui/sonner.tsx` used `var(--popover)`, but the shadcn variables hold bare HSL triplets (`60 20% 98%`), not colours.
20. **150 `:Zone.Identifier` files committed** (Windows/WSL download metadata).
21. **`jwtSecret` has a public default** in `server/lib/env.ts` — a misconfigured deploy signs tokens with a known secret. Flagged; see "Still to do".

---

## 2. Design direction

**Palette.** Dropped the cream/terracotta/navy default entirely. The new system takes its
colour language from contract redlining, where colour already carries meaning:

- `ink #0E1620` — the dark field (hero, footer, coverage table)
- `paper #F1F2EE` — a cool paper, not cream
- `insert #2E8B65` — the accent, borrowed from the *accepted redline* colour, because
  the replacement clause is what the product actually sells
- `strike #B3311C` — struck original text
- Severity scale (`#B3311C → #C0701B → #9C8514 → #4A7C63`) — muted, never neon

Decorative colour is deliberately scarce so semantic colour reads loudly.

**Typography.** Archivo (variable, `wdth` 108–115, weight 800) for display, set very
tight at `clamp(3rem, 12vw, 9.5rem)`; Newsreader for body copy, because the subject is
reading documents; IBM Plex Mono for labels, scores and clause metadata.

**Signature element.** `ContractField.tsx` — a perspective-projected field of contract
pages drifting through ink space, with a scan plane sweeping down through them. Flagged
lines light in their severity colour as the scan crosses each page, and clauses with a
replacement draw a second green line beneath the struck one. Hand-rolled projection on
the 2D canvas: the geometry is eleven textured quads, so a WebGL dependency would cost
more than it saves. The severity chips in the hero filter the 3D field live.

Depth constants were verified by replaying the projection headlessly — the first pass
culled 4 of 11 pages behind the camera. See `hero-preview.png`.

**Layout.** Below the hero, every section is a split: a sticky left rail carrying the
section's identity, a wide right column carrying working content. Collapses to one
column below `lg`.

---

## 3. What replaced what

| Removed | Replaced with |
|---|---|
| Fake terminal window | `ClauseInspector` — real tablist over the live clause library, with keyboard roving focus |
| 3-card "1/2/3" row | Split walkthrough sections |
| 6-item feature grid | `<table>` of 8 clause categories: what's inspected, what you get back |
| 3-tier pricing | `PlanSizer` — volume slider, live cost comparison against counsel at $350/hr |
| "Trusted by 500+ companies" + avatar circles | Real counts read from the clause library |
| `alert('coming soon')` | Working `.txt` export via Blob download |
| `window.confirm()` | Sonner toast with Delete/Keep actions |
| Spinners | Skeleton loaders shaped like the content they replace |

**New:** `RiskEstimator` — pick a contract type, toggle clauses, watch the score move.
It calls `scoreClauses()`, the same function the analysis endpoint calls, and shows the
arithmetic.

**Architectural change:** the clause library moved to `contracts/clause-library.ts`.
Both the tRPC router and the marketing pages import it, so the homepage shows the
product's actual output rather than a mock-up of it.

---

## 4. Checklist coverage

**Part 1 — Visual.** No pure-white backgrounds; dot grid, glassmorphism, backdrop-blur,
gradient text and neon removed. Radii normalised to 3–10px. `shadow-2xl` replaced with
1px borders. No Lucide icons in new UI (the only SVGs are the custom mark, the Google
brand mark, and a link-out arrow). No card stripes, no checkmark bullets, no bouncing
arrows. Hovers are 180–200ms colour transitions.

**Part 2 — Copy.** No "it's not X, it's Y" constructions. No emojis. Em dashes removed
from all prose. No Lorem Ipsum. Fabricated testimonials deleted.

**Part 3 — Functionality.** Every button has a handler. Toasts on create/analyse/delete/
copy/export. Inline `aria-invalid` + `role="alert"` validation on all three forms.
Skeletons on every async boundary. Error states with Retry. Logo routes to `/`. Email is
`mailto:`; phone renders as `tel:` automatically when `site.phone` is set (left `null` —
no real number exists, and inventing one would be worse than omitting it).

**Part 4 — Responsive.** `overflow-x: hidden` on `body` and `#root`; the coverage table
scrolls inside its own container. Fluid type via `clamp()`. Mobile drawer with scroll
lock, backdrop click-to-close, Escape, focus return, and close-on-navigate. Ghost nav
items removed.

**Part 5 — Production.** Per-page `<title>` and `<meta description>` via
`useDocumentMeta`, restored on unmount. SVG favicon + OG/Twitter tags. Archivo/
Newsreader/IBM Plex Mono replace Inter/Playfair. Every link resolves — `/terms`,
`/privacy`, `/contact` are real routes. Copyright year is `new Date().getFullYear()`.
Custom 404 with a real navigation list.

Accessibility: skip link, visible `:focus-visible` rings, `prefers-reduced-motion`
honoured (the 3D field freezes on a composed frame), semantic table markup with
`<caption>` and `scope`, `aria-live` on async regions.

---

## 5. Install

Drop the `app/` folder over your existing `app/`, then:

```bash
cd app
npm install --legacy-peer-deps
npm run check     # tsc -b, both configs
npm run build
npm run dev
```

Also delete these — they are now unreferenced:

```bash
git rm -r --cached $(git ls-files | grep 'Zone.Identifier')   # 150 files
rm app/src/App.css \
   app/src/components/{HeroCanvas,ChatWidget,Navbar,Footer,AuthLayout,AuthLayoutSkeleton}.tsx \
   app/src/pages/{Blog,Pricing,Product,Solutions}.tsx
echo '*:Zone.Identifier' >> .gitignore
```

`lenzerhub-static/` (the old plain-HTML site) is superseded by the React app and can go.

---

## 6. Still to do

1. **`jwtSecret` fallback.** In `server/lib/env.ts` it defaults to
   `"change-me-in-production-32-chars!!"`. Unlike `appSecret` and `databaseUrl` it will
   not fail startup if unset, so a misconfigured deploy signs tokens with a publicly
   known secret. Make it required: `jwtSecret: z.string().min(32)`.
2. **File upload is still not wired.** The AWS S3 SDK is in `package.json` but nothing
   uses it. The dashboard form now says so plainly instead of showing a decorative
   drag-and-drop zone that does nothing.
3. **Analysis is still the mock library,** not a document parser or model call. The copy
   throughout is written to be true of the current build — it describes matching against
   a clause library, which is what it does.
4. **Contact form has no endpoint.** It composes a `mailto:` handoff rather than silently
   dropping messages. Wire it to a real endpoint when one exists.
5. **`package.json` name** is still `"my-app"`, and `README.md` is still the stock Vite
   template.
6. **`SameSite=None`** on session cookies off-localhost is deliberate for cross-origin
   OAuth, but it means CSRF protection rests entirely on other layers. Worth a look.
