# Asset inventory

Everything publicly reachable was downloaded on 2026-11-13: 18 pages, 35 stylesheets, 111 media files (about 200 MB), with no failed downloads. Full machine-readable index: `reference/original-site/manifest.json`.

All paths below are relative to `reference/original-site/media/`. WordPress also generated resized copies (`-300x200`, `-1024x683`, `-scaled` and so on); only the largest original of each is listed. Always work from the original and re-export.

Quick look: `reference/contact/sheet-photos.jpg` (the nine main photos) and `reference/frames/` (one frame per video).

## Brand

| File | Size | What it is |
|---|---|---|
| `2026/07/BF-logo-RGB-01-7a391c13-1920w.png` | 1089x831 | Full logo, transparent. **Raster only. No vector exists on the site.** |
| `2026/07/cropped-BF-logo-...-1920w.png` | 512 sq | Favicon / app icon crop |
| `2026/08/Logo.webp` | 128x19 | Tiny wordmark, too small to use |
| `inline/be05a5e054.png` | 150x108 | Header logo as embedded in the HTML |
| `2026/08/Instagram.svg`, `2026/09/Phone.svg` | | Icons |

## Own photography (safe to use)

| File | Size | Shows | Used on |
|---|---|---|---|
| `2026/08/DSC_0206.jpg` | 4496x3000 | Driver walking the hose down a long dock to a boat lift, open water | Service areas |
| `2026/08/DSC_0213.jpg` | 4496x3000 | Close-up of the fuel nozzle in a boat's filler | Service areas |
| `2026/08/DSC_0248.jpg` | 4496x3000 | Driver pulling the hose from the wrapped truck | Service areas |
| `2026/08/DSC_0312.jpg` | 4496x3000 | Driver fuelling a boat on a lift | FAQ |
| `2026/08/DSC_0343.jpg` | 4496x3000 | F-550 truck door with logo, palm-lined street | Not used on any page |
| `2026/08/DSC_0355.jpg` | 4496x3000 | Hose reel and pump detail at the back of the truck | Service areas |
| `2026/08/The-Blackfin-Story.jpg` | 4496x3000 | Three crew standing between two trucks | About |
| `2026/08/Our-Story.png` | 1086x1448 | Two tankers parked, portrait | About |
| `2026/08/image_6487327.jpeg` | 1000x929 | Cartoon avatar (Apple Memoji style) standing in for Jessica | About |
| `2026/08/Mike-Photo.jpg` | 815x1200 | Captain Mike Wright | Home, About |
| `2026/08/TyrelleHeadshot-1200h.jpg` | 1799x1200 | Tyrelle | About |
| `2026/08/Jesse.jpg` | 1334x2000 | Jesse | About |

There is no real photo of Jessica, only the avatar. Ask whether she wants a photo or a custom illustration; an Apple Memoji is not ideal on a commercial site.

## Truck cut-outs (transparent background)

These are the best raw material for a 3D or parallax treatment.

| File | Size | Shows |
|---|---|---|
| `2026/09/Blackfin-Trucks-1.png` | 4496x3000 | Grey Freightliner tanker, three-quarter front view |
| `2026/08/Untitled-design-2.png` | 4496x3000 | White F-550 1,000 gallon truck, three-quarter front view |
| `2026/08/Untitled-design-1.png` | 4496x3000 | White International 2,800 gallon tanker, three-quarter front view (About) |
| `2026/08/Untitled-design-1-1.webp` | 1448x500 | Two tankers side by side (home hero graphic) |
| `2026/08/Untitled-design.webp` | 1086x1448 | Same two tankers, portrait canvas |

Each truck exists from one angle only. That is enough for depth-layered parallax, not for a model that rotates.

## Video

| File | Specs | Shows | Used on |
|---|---|---|---|
| `2026/07/home-hero-video.mp4` | 1280x720, 39 s, 26 MB | Handheld delivery footage: driver at the truck, hose work | Home hero. The live site streams the same file from an external CDN. Renamed from a long hash filename. |
| `2026/08/What-We-Stand-For.mp4` | 1920x1080, 60 fps, 19 s, 53 MB | Customer and two crew beside the truck outside a waterfront home | In the media library; an identical second copy was deleted |
| `2026/09/Untitled-design.mp4` | 1920x1080, 60 fps, 12 s, 29 MB | Same scene, shorter cut | About |

All three are far too heavy as shipped. Target under 3 MB each after re-encoding (H.264 plus AV1 or WebM, 24 to 30 fps, no audio track).

## App screenshots

In `inline/`, extracted from base64 in the HTML. Low resolution, roughly 315x640.

| File | Shows |
|---|---|
| `43ea983f83.webp`, `939f681a13.webp`, `d6f1cdf9f1.webp`, `e9a943546c.webp` | App screens: price comparison, delivery tracking, home with savings calculator, balance and pay |
| `10c17cbbb5.webp` | Referral screen, 420x698 |
| `e09ce2e2ee.jpg` | Marketing composite of two phones showing the app, 574x1450 |
| `3865a0cc21.svg` | Inline vector graphic |

Too small for a large 3D phone mock-up on high-density screens. Ask for original screenshots at device resolution.

## Stock imagery (licence not verified)

| File | Used on |
|---|---|
| `2026/08/shutterstock_1318716863.jpeg` | Sarasota |
| `2026/08/shutterstock_1702136899-1920w.jpeg` | Bradenton |
| `2026/08/shutterstock_4836334-1000h.webp` | Pricing |
| `2026/09/shutterstock_2740154251.jpg` | Service areas |
| `2026/09/shutterstock_2371621871.jpg` | Not used on any page |
| `2026/08/boating-45ECRQC-1920w.webp` | Fuel delivery (the filename pattern suggests Envato Elements) |
| `2026/08/pexels-photo-10529268.jpeg` | Cape Coral |
| `2026/08/pexels-photo-1554663-673h.jpeg` | Contact |
| `2026/08/pexels-photo-6179845.jpeg` | Punta Gorda |
| `2026/08/fortmyers-dmj-1200w.png` | Fort Myers (source unknown) |

Shutterstock and Envato licences belong to whoever bought them, most likely the previous developer, and do not automatically transfer. Pexels images are free to reuse. Until the owner confirms the licences, treat the paid stock as unusable and plan to replace it with own photography or newly licensed images.

## Not downloadable

- Customer reviews (served by the Trustindex widget).
- Anything behind the WordPress login: form entries, unpublished drafts, unattached media.
- Jotform field definitions. The form is an external embed (`form.jotform.com/223465126870154`).

## Missing, needed for the rebuild

1. Vector logo (SVG, AI or EPS).
2. High-resolution app screenshots.
3. Review text with permission to republish, or a decision to keep a reviews widget.
4. A 3D truck model, or a decision to do without one. See `docs/PLAN.md`.
5. Ideally, new footage: a slow drone or gimbal shot of a truck, dock and boat. The current clips are handheld phone video.
