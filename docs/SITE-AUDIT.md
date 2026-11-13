# Existing site audit

Source: https://blackfinfuels.com/, mirrored 2026-11-13 from public pages only.

## What the business is

Blackfin Fuels delivers Rec 90 (ethanol-free) marine gasoline by truck to private docks, lifts and waterfront homes along the Southwest Florida Gulf Coast, on a scheduled route from Bradenton to Cape Coral. Owner: Captain Mike Wright. It also has an iOS and Android app for comparing marina prices, ordering, tracking and paying.

## Technology

| Item | Finding |
|---|---|
| CMS | WordPress 7.1.4 |
| Builder | Elementor 4.4.0 + Elementor Pro, Hello Elementor theme |
| CDN / DNS | Cloudflare |
| SEO | Yoast (sitemaps, schema graph) |
| Analytics | Site Kit by Google 1.191.0 |
| Accessibility | "pojo-accessibility" (One Click Accessibility) widget |
| Order form | Jotform embed, form ID `223465126870154` (home and `/free-estimate/`) |
| Testimonials | Trustindex widget (reviews load from their service, not in the HTML) |
| Map | Google Maps iframe, query "Blackfin Fuels Delivery of Punta Gorda" |
| Hero video | Hosted off-site on `assets.cdn.filesafe.space` (a GoHighLevel / LeadConnector CDN) |
| Fonts | Anton (display), Plus Jakarta Sans (body), Mrs Saint Delafield (signature), Barlow / Barlow Condensed (service areas page only), Roboto and Roboto Slab (unused Elementor defaults) |

## Pages

18 URLs in the sitemap. Text for each is in `reference/original-site/content/<slug>.md`.

| Live URL | Purpose | Notes |
|---|---|---|
| `/` | Home | Hero video, stats, app promo, how it works (4 steps), fleet, safety, why Blackfin (6 cards), Captain Mike, testimonials, order form |
| `/about-us/` | About | Story, team (Mike, Tyrelle, Jesse, Jessica), what sets us apart, equipment, values, video |
| `/fuel-delivery/` | Service explainer | Short |
| `/pricing/` | Pricing | No actual prices. "$0 delivery fee", "updated weekly" |
| `/make-payment/` | Payment methods | Informational only; no payment link on the page |
| `/service-areas/` | Area overview | Six zones, route days, embedded FAQ |
| `/cape-coral/`, `/fort-myers/`, `/punta-gorda/`, `/sarasota/`, `/bradenton/` | City landing pages | Local SEO pages |
| `/faqs/` | FAQ | 14 questions |
| `/app/` | App landing page | Six features, referral, store links |
| `/contact-us/` | Contact | Phone, email, map |
| `/free-estimate/` | Order / estimate | Jotform |
| `/privacy-policy/`, `/terms-and-conditions/` | Legal | |
| `/hello-world/` | Default WordPress sample post | Should not exist. Drop it. |

## URLs that must keep working

The menu links to paths that only work through redirects. Both forms are in the wild, so both need to resolve on the new site.

| Linked in menu | Redirects (301) to |
|---|---|
| `/about/` | `/about-us/` |
| `/contact/` | `/contact-us/` |
| `/service-areas/cape-coral/` (and the other four cities) | `/cape-coral/` etc. |

Footer links point at `https://www.blackfinfuels.com/...` without trailing slashes, which adds another redirect hop.

## Problems found

1. **Weight.** Home page HTML is 399 KB and the app page 329 KB, mostly because app screenshots and the logo are base64-embedded in the markup. The hero video is 26 MB at 720p. One video on the About page is 53 MB.
2. **Duplicated content in the DOM.** Most home sections are rendered two or three times (desktop, tablet and mobile variants hidden with CSS). Two H1s on the home page. Bad for SEO and accessibility.
3. **No meta descriptions** on the pages checked. Home title is "Home - Blackfin Fuels".
4. **Inconsistent facts.** Hose reach is given as 350 ft and 380 ft for the same 1,000 gallon truck. The fleet section shows the 1,000 gallon truck card twice and has a broken image (`!`) on the 2,800 gallon card. The Payment page lists cash, check and card; the FAQ and home page add Zelle and ACH and a 2.9% card fee.
5. **Inconsistent type.** Three different font stacks across pages, and Elementor's default global colours (`#6EC1E4`, `#61CE70`) were never set to the brand.
6. **Third-party dependence.** Hero video, order form, reviews and map all load from outside services. Each one is a point of failure and a performance cost.
7. **Leftovers.** "Hello world" post, an Elementor placeholder image, a default Lottie file.
8. **No motion or depth.** It is a standard template layout: nothing scroll-driven, nothing interactive beyond the menu and form.

## What is worth keeping

- The copy is clear and specific. It can be tightened but does not need rewriting.
- Real photography of the trucks, crew and deliveries (`DSC_*` series), and cut-out truck images on transparent backgrounds that suit a 3D or parallax treatment.
- Three real videos of deliveries.
- App screenshots for the phone mock-up section.
- The city pages and FAQ, for search.
