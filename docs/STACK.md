# Stack recommendation

## Recommendation

**Astro + Three.js + GSAP ScrollTrigger + Lenis, deployed as a static site on Cloudflare Pages.**

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro (static output, TypeScript) | The site is 17 content pages whose main job is to rank locally and convert. Astro ships plain HTML with no JavaScript by default, then loads the 3D layer only where it is used. |
| 3D | Three.js, written directly | One persistent WebGL canvas behind the page: water, truck, dock, route. Direct Three.js keeps the bundle small and gives full control over shaders. |
| Scroll animation | GSAP with ScrollTrigger and SplitText | The standard for pinned, scrubbed, scroll-driven timelines. All GSAP plugins are now free for commercial use. |
| Smooth scroll | Lenis | Smooths wheel input so scrubbed animation does not stutter. Keeps native scrolling, so accessibility and anchor links still work. |
| Styling | Plain CSS with custom properties, scoped per Astro component | Small design system; no need for a framework. |
| Content | Markdown and JSON in the repo (Astro content collections) | City pages, FAQ and team are structured, repeating content. No database to run. |
| Images | Astro's built-in image pipeline (AVIF and WebP, responsive sizes) | The originals are 4 to 15 MB each. |
| 3D assets | glTF with Draco or Meshopt compression, KTX2 textures | Keeps a truck model in the low single-digit megabytes. |
| Hosting | Cloudflare Pages | The domain is already on Cloudflare. Free tier, global CDN, redirects through a `_redirects` file. |
| Order form | Keep the existing Jotform at launch, restyled or embedded | It already feeds the business's workflow. Replace later with a native form posting to a Cloudflare Worker if wanted. |
| Reviews | Static, curated quotes in the repo | Removes the Trustindex script. Needs the owner to supply the text. |
| Analytics | GA4 via the existing property, loaded after interaction | Keeps their history. |

## Why not the alternatives

| Option | Verdict |
|---|---|
| **Stay on WordPress + Elementor and add effects** | Not viable for this brief. Elementor's markup and scripts fight a full-page WebGL canvas and pinned scroll timelines, and the current page weight is already poor. We also have no admin access. |
| **Next.js + React Three Fiber** | Works, and R3F is pleasant to write. But this site has no logged-in state, no dynamic data and no app-like screens, so React would add 150 KB or more of runtime and a hydration cost for no benefit. Choose it only if the customer portal or live pricing is going to move onto the website. |
| **Plain HTML, CSS and JS, no build step** | Fine for a one-page site. With 17 pages sharing a header, footer, calls to action and five near-identical city pages, hand-maintained HTML becomes error-prone, and there is no image optimisation. |
| **Webflow or Framer** | Fast for 2D scroll animation, limited for custom WebGL, with a monthly fee and lock-in. |
| **Headless WordPress + Astro** | Only worth it if the owner wants to edit content in WordPress. It adds a second system to maintain. Revisit if editing by non-developers becomes a requirement. |

## The trade-off to know about

A static site has no admin panel. Text changes are made in Markdown files and deployed. If the owner needs to edit pricing or copy themselves, add a lightweight Git-based editor (Decap CMS or Keystatic) on top; both work with Astro and need no server.

## Performance budget

| Metric | Target |
|---|---|
| Largest Contentful Paint (mobile, 4G) | Under 2.5 s. Hero text and a poster image render before WebGL starts. |
| JavaScript on first load, excluding 3D | Under 60 KB gzipped |
| 3D bundle (Three.js, scene, model), lazy-loaded | Under 2.5 MB in total |
| Any video | Under 3 MB |
| Frame rate | 60 fps on a mid-range laptop; pixel ratio capped at 2; quality steps down automatically on slow frames |
| Fallback | Static imagery, no canvas, when WebGL is missing, the device is low-power, or the user prefers reduced motion |

## Proposed layout once building starts

```
src/
  pages/            one .astro file per route; [city].astro for the five city pages
  content/          cities/*.md, faq.json, team.json, legal/*.md
  components/       Header, Footer, CTA, StatCounter, StepCard, PhoneMockup ...
  scene/            Three.js: renderer, water shader, truck, dock, route map, scroll timeline
  styles/           tokens.css, base.css
public/
  models/ video/ fonts/ _redirects
docs/               planning (this folder)
reference/          mirror of the old site (kept out of the build)
```

Requires Node 20 or newer. Node 24 is installed on this machine.
