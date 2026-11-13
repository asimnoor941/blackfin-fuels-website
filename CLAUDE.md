# Blackfin Fuels website rebuild

Rebuild of https://blackfinfuels.com/ (marine fuel delivery, Southwest Florida) as an executive-grade, 3D, scroll-driven site. The live site is WordPress + Elementor built by a third party; we have no admin access. Everything we have was mirrored from the public site on 2026-11-13.

## Stack

Astro 7 (static), plain CSS, GSAP ScrollTrigger + Lenis for motion. Node 22.23+ (24 installed). No UI framework, no WebGL.
Cloudflare Pages Functions in `functions/api/`: `order.ts` (booking form → CRM webhook) and `price.ts` (live Rec 90 price from the CRM).

Motion rules (owner's request): 3D effects are on the content itself (tilt, swing, flip, turn), driven by scroll, via `data-3d` attributes handled in `src/scripts/motion.ts`. Nothing animates on page load; only the section being scrolled moves. Inner pages get effects automatically (`autoAssign3D`). Balance the kinds (owner's request): scroll-driven 3D for set pieces (hero stage, trucks, steps, hose, photo wall); `data-3d="pop"`/`"pop-group"` plays once on entry for lists and figures; `data-float` for phones and badges (starts after first scroll); `data-hover-tilt` for static cards; reading content stays static. The booking form never moves, it glows. Pop-ups float key visuals with `data-float-open`.

Booking: no Jotform. `OrderForm.astro` shows today's live price (`/api/price`) and price × gallons (price is all-in, $0 delivery), sends a booking request to `/api/order`, then prompts the customer to download the app to track and pay. Env vars are documented at the top of each function. In `npm run dev` the price is a labelled sample and orders are only logged to the console.

```
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run build:demo  # same, with a labelled sample price, orders not sent, noindex (.env.demo)
node scripts/prepare-assets.mjs   # rebuild src/assets from reference/ originals
bash scripts/encode-video.sh      # rebuild public/video
```

## Where things are

| Path | What it is |
|---|---|
| `src/pages/` | One `.astro` file per route. URLs must match the live site (trailing slash). |
| `src/layouts/BaseLayout.astro` | Page shell: head, header, footer, app pop-up. Props documented at the top of the file. |
| `src/components/` | Shared components. Each documents its props in a comment at the top. |
| `src/data/site.ts` | Shared facts: phone, email, nav, cities, app links, referral wording. |
| `src/styles/global.css` | Design tokens and shared classes. |
| `src/assets/` | Optimised images (generated; do not hand-edit). |
| `public/` | Icons, video, `_redirects`, `_headers`, manifest. |
| `docs/` | Audit, brand, stack, plan, asset inventory. |
| `reference/original-site/content/<slug>.md` | Text of every live page. **Source of truth for copy.** Lines 1-85 of each file are the old nav; the body starts after. Sections are often repeated 2-3 times (responsive duplicates): use each once. |
| `reference/` | Read-only mirror. Never import from it. |

## Rules

- Copy comes from `reference/original-site/content/`. Keep the live wording; fix only typos. Do not invent facts, numbers, prices, testimonials, service areas or team details. If something is missing, leave it out and report it.
- Known conflicts on the live site, resolved as: hose reach is **350 ft** everywhere; fuel is **Rec 90 only, no diesel**. Other conflicts: keep each page's own wording and report them.
- Phone `(941) 724-0453`, email `accounting@blackfinfuels.com`: always from `src/data/site.ts`.
- "Order Fuel" always links to `/free-estimate/` (`ORDER_URL`). Internal links are root-relative with a trailing slash.
- Never use `shutterstock_*`, `boating-45ECRQC` or `fortmyers-dmj` images (licence unknown). Use `src/assets/photos`, `team`, `trucks`, `places`, `app`.
- All content is real HTML. Motion is decoration and must respect `prefers-reduced-motion`.
- One `<h1>` per page (PageHero provides it). Headings in order: h1, h2, h3.
- App referral wording must match the app: "You and your friend each get $25 when they complete their first confirmed delivery. New Blackfin customers only."

## Astro 7 gotchas

- Every non-void tag must be closed; no block elements inside `<p>`. The compiler throws instead of fixing it.
- Images: `import x from '../assets/...'` then `<Photo>` / `<Picture>`; never a string path into `src/`.
- Scoped styles do not reach into child components: use `:global(.child-class)` or a wrapper element.
- Inline text and components on separate lines lose the space between them only if `compressHTML` is changed; it is set to `true`. Leave it.

## Building a page

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHero from '../components/PageHero.astro';
import Section from '../components/Section.astro';
import CtaBand from '../components/CtaBand.astro';
---
<BaseLayout title="Pricing" description="..." breadcrumbs={[{ name: 'Pricing', href: '/pricing/' }]}>
  <PageHero eyebrow="Our Pricing" title="Pricing" lede="..." image={photo} imageAlt="..." />
  <Section eyebrow="..." title="..." lede="..." tone="raised"> ... </Section>
  <CtaBand title="Ready to Stop<br />Overpaying at the Marina?" text="..." />
</BaseLayout>
```

Components: `PageHero`, `Section` (tones base/raised/deep/light), `CtaBand`, `Button`, `Stat`, `FeatureCard`, `Steps`, `Faq`, `Photo`, `VideoClip`, `PhoneFrame`, `StoreBadges`, `QrCode`, `OrderForm`, `Icon`, `Logo`, `Contours`.
Classes: `container`, `grid grid--2|3|4`, `split` (+ `split--flip`), `stack`, `cluster`, `card`, `frame`, `tag`, `checklist`, `eyebrow`, `lede`, `prose`, `numeral`, `muted`. Add `data-reveal` to animate an element in on scroll and `data-reveal-group` on a parent to stagger its children.
Alternate section tones down the page for rhythm. Page-specific styles go in a `<style>` block in the page using the tokens in `global.css` (no new colours or fonts).
