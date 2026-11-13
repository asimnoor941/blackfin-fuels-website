# Rebuild plan

Goal: turn blackfinfuels.com from a template WordPress site into an executive-grade, 3D, scroll-driven experience, without losing search ranking, the order flow, or any real content.

Read first: `SITE-AUDIT.md` (what exists), `ASSET-INVENTORY.md` (what we have to work with), `BRAND.md` (look and facts), `STACK.md` (how it will be built).

## Creative concept: "From the tank to your dock"

The home page is one continuous journey. A single 3D scene sits fixed behind the content, and scrolling moves a camera through it: from open Gulf water at dawn, to the truck, along 350 feet of hose, down the dock, to the boat. Each section of copy arrives at the point in the journey it describes.

Visual language:

- **Dark-first.** Deep navy to near-black, one accent blue (`#5FAFFF`), white Anton headlines, brushed-aluminium surfaces taken from the tankers.
- **Contour lines.** The fin in the logo is drawn in concentric lines. That becomes the motif: line-drawn water, route lines, rings that pulse from the truck's position.
- **Restraint.** Slow camera moves, heavy easing, generous space. Executive means precise and calm, not busy.

## Home page storyboard

| # | Section | What scrolling does | Content (from the existing site) |
|---|---|---|---|
| 1 | Hero | A shader-driven water surface fills the screen, lit at dawn. The fin from the logo draws itself line by line, then settles into the header. Headline letters rise in. | "Fuel Delivered to Your Dock". Skip the marina stop. Order Fuel, Get the app. |
| 2 | Stats | The camera lifts off the water. Three numbers count up, each with a small 3D gauge. | 350 ft hose reach. Millions of gallons delivered. Insured and spill compliant. |
| 3 | The truck | The truck enters and the camera orbits it, pinned. Call-outs attach to the tank, hose reel and spill kit. | "Built for one purpose". 2,800 and 1,000 gallon Rec 90 trucks. |
| 4 | The hose | The signature moment. A hose unspools from the truck and the camera follows it along the ground and down a dock while a counter runs from 0 to 350 ft. The four steps appear as way-points along the hose. | How it works: Request Fuel, We Keep You Updated, We Fuel Your Boat, Easy Payment. |
| 5 | The boat | The hose reaches a boat on a lift. A fuel-level ring fills. | Safety and environmental commitment. |
| 6 | The route | The camera pulls up to a stylised 3D map of the coast from Bradenton to Cape Coral. A route line draws south and each town lights up. Towns are clickable. | Service areas, linking to the city pages. |
| 7 | The app | A 3D phone rotates in. Its screen changes between the real app screenshots as you scroll. | Compare prices, order, track, pay. Referral: give $25, get $25. Store badges. |
| 8 | Why Blackfin | Six cards with depth tilt on hover, revealed in sequence. | Commercially insured, GPS-routed dispatch, commercial accounts, trained professionals, modern fleet, customer communication. |
| 9 | Captain Mike | The 3D layer calms down. Portrait with parallax, quote, signature that draws itself. | "Built by boaters, for boaters." |
| 10 | Proof | Real delivery video and customer quotes. | Testimonials. |
| 11 | Order | The scene returns to the water at golden hour. Form in a glass panel. | "Ready to get fueled up?" Order form, phone number. |

On phones: the same journey with a simpler scene (fewer particles, lower resolution, no post-processing) and shorter pinned sections. With reduced motion or no WebGL: a static, well-designed page using the photography.

## Inner pages

Lighter treatment, same design system. The water canvas continues as a quiet background in each page header; content below is fast, conventional HTML.

| Page | Treatment |
|---|---|
| About | Story as a scroll timeline, team cards, values, the delivery video |
| Fuel Delivery | Explainer reusing the hose sequence in short form |
| Pricing | Large "$0 delivery fee" moment and a pointer to the app for daily prices |
| Service Areas | The interactive 3D route map as the main feature |
| Five city pages | One template, own copy and image each, highlighted on the map |
| App | The 3D phone as hero, six features scrubbed through on scroll |
| FAQ | Accordion with FAQ schema for search |
| Contact, Order, Payment | Clean and fast. Minimal effects near forms. |
| Privacy, Terms | Plain text |

## Sitemap and URLs

Keep every live path. Add 301 redirects for `/about/`, `/contact/`, `/service-areas/<city>/` and `/hello-world/` (to `/`). Details in `SITE-AUDIT.md`.

## The 3D truck: the main asset decision

The site has truck photos from one angle each. A truck that the camera can orbit needs a real 3D model. Options:

| Option | Result | Cost and effort |
|---|---|---|
| **A. Stylised model, recommended** | A clean, slightly abstracted tanker in brushed aluminium with the Blackfin livery. Bought as a base model (roughly $50 to $200 on a model marketplace) and re-textured, or built from primitives. Fits the contour-line look and stays light. | Low to medium |
| B. Photogrammetry or 3D scan of the real truck | The actual truck, photo-real | Needs someone on site with the truck for a few hours, plus clean-up. Heavier files. |
| C. No model: layered photo cut-outs | Parallax depth from the existing transparent truck images. No orbiting. | Lowest. Good fallback, weaker "wow". |
| D. Pre-rendered or filmed image sequence scrubbed on scroll | Cinematic and photo-real, the technique used on premium product pages | Needs new footage or a rendered animation. Large download. |

Plan: build with option C first as a placeholder so the scroll choreography can be judged early, then swap in option A.

## Phases

| Phase | Work | Output |
|---|---|---|
| 0. Discovery | Mirror the site, audit, plan | Done: this folder |
| 1. Foundations | Astro project, design tokens, fonts, header, footer, calls to action, optimised image and video pipeline | Styled, static, responsive shell |
| 2. Content | All 17 pages with real copy, city template, FAQ, redirects, meta and schema | A complete non-3D site that could already replace the old one |
| 3. Scene | Water shader, camera rig, scroll timeline, placeholder truck, hose, route map, phone | Home page journey working end to end |
| 4. Polish | Final model, lighting, text animation, hover and cursor detail, sound-free micro-interactions, mobile tuning, fallbacks | Launch candidate |
| 5. Launch | Performance and accessibility pass, cross-browser test, analytics, DNS cut-over on Cloudflare, redirect check, sitemap submission | Live |

Phase 2 before phase 3 is deliberate: there is always a shippable site, and the 3D layer is added on top of content that already works.

## Open decisions for the owner

1. **Stack.** Confirm Astro + Three.js + GSAP on Cloudflare Pages (`STACK.md`).
2. **Truck.** Option A, B, C or D above.
3. **Access.** Who controls the domain and Cloudflare account, the Jotform account, Google Analytics and the WordPress admin? All are needed for launch; WordPress admin also gives us originals and form history.
4. **Stock photo licences.** Can the previous developer transfer them, or do we replace those images?
5. **Missing assets.** Vector logo, full-size app screenshots, review text, a photo or illustration of Jessica (the site uses a Memoji).
6. **Facts to confirm.** 350 ft or 380 ft hose on the 1,000 gallon truck; the full list of payment methods; whether prices update weekly or daily.
7. **Editing.** Does the owner need to change text or prices without a developer? If so, add a Git-based CMS.
8. **Order form.** Keep Jotform at launch (recommended) or build a native form now.
9. **New footage.** Is a short drone or gimbal shoot of a real delivery possible? It would lift the hero and proof sections more than any effect.
