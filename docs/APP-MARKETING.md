# Marketing the mobile app on the website

## What the app is (from the public store listings, checked 2026-11-13)

| | |
|---|---|
| Name | Blackfin Fuels (iOS id 6813136497, Android `com.blackfinfuels.app`) |
| Publisher | Blackfin Fuels Delivery of Punta Gorda, LLC |
| Released | iOS 2 Nov 2026, version 1.0.1 on 4 Nov 2026 |
| Price | Free. iOS 16.4+ |
| Ratings | 1 rating on iOS (5 stars). Too few to quote on the site. |
| Features | Marina price comparison and savings calculator, order requests, route notifications, order tracking, balances and invoices, QuickBooks payment, referral code, saved boats and docks, phone + PIN sign-in |
| Referral | "Give $25, Get $25. You and your friend each get $25 when they complete their first confirmed delivery. New Blackfin customers only." Codes look like `BF-Y6D9M`, shared from the Referral tab. |

Full-resolution store screenshots: `reference/app-store/ios/`, `android/`. Listing JSON: `reference/app-store/itunes-lookup.json`.

### Conflicts to resolve with the owner

- The App Store description says the **minimum order is 75 gallons**; the website says 75 gallons in Cape Coral / Fort Myers / Punta Gorda and **100 gallons elsewhere**.
- The App Store service area lists Punta Gorda, Port Charlotte, Cape Coral and Burnt Store; the website's runs Bradenton to Cape Coral.
- The app shows Diesel prices for nearby marinas; Blackfin itself delivers Rec 90 only (that is consistent, but worth a line in the app).

## How the site promotes it

| Where | What | Notes |
|---|---|---|
| Every page, top bar (tablet and up) | "Download our app · Compare prices → Order → Track → Pay · Get the app" | Kept from the live site |
| Every page, iPhone/iPad Safari | Apple's Smart App Banner (`apple-itunes-app` meta tag) | Native, free, shows "Open" instead of "Get" if installed |
| Every page, footer | Official store badges + "Give $25. Get $25." link that opens the pop-up | |
| Mobile menu | Badges for the visitor's own store only | |
| Home | App section with real screens, four features, invoice and referral cards, "Claim your $25" button | |
| `/app/` | Full landing page: hero with phones, scroll-synced feature tour, referral, set-up steps, QR code | |
| `/get-app/` | Smart link: iPhone → App Store, Android → Google Play, desktop → a page with both badges and a QR code | Target for every QR code (trucks, flyers, invoices). `?src=` tags where a scan came from |
| Everywhere | **The $25 referral pop-up** | Below |

## The $25 pop-up

**Wording.** Headline "Claim your $25 fuel credit", then: "Download the Blackfin Fuels app and refer a fellow boater. When they complete their first confirmed delivery, you each get $25 in fuel credit." The conditions (friend must be new, credit after their first confirmed delivery) sit in the pop-up itself, not behind a link. A new visitor does **not** get $25 just for downloading, so the copy never says that. US advertising rules require material conditions to be clear and close to the claim, which this layout does.

**Layout.**
- Desktop: centred dialog with the real Referral screen, three steps, a QR code to scan with a phone, and both store badges.
- Phone, opened by itself: a compact card pinned to the bottom of the screen. It does not cover the page, take focus or lock scrolling. Google penalises pop-ups that cover the main content on mobile.
- Phone, opened by tapping a "Claim your $25" link: a full bottom sheet showing only that phone's store badge.

**When it appears by itself.** After 40% scroll plus 10 seconds on the page, or after 35 seconds, or (desktop) when the pointer leaves for the browser tabs after 8 seconds. At most once per browser session. Not again for 14 days after "Not now", or for 90 days after a store badge was clicked anywhere on the site. Never on the order form, legal, app or smart-link pages, and never while someone is typing in a form or has a menu open.

**Accessibility.** Native `<dialog>`: Escape and backdrop click close it, focus is trapped while modal and returned afterwards, the close button is labelled, and the page's smooth scrolling pauses while it is open. The bottom card is announced to screen readers without stealing focus. Animations are switched off for reduced motion.

**Testing.** Add `?promo=1` to any URL to open it immediately (`?promo=modal` forces the full sheet on a phone); `?nopromo` suppresses it. Any element with `data-open-app-promo` opens it.

**Measurement.** Events sent to the existing Google tag (GT-5MJL794X) on the live domain only: `app_promo_view` (trigger, mode), `app_promo_dismiss`, `app_promo_convert`, `app_store_click` (store, placement). Store installs themselves can only be attributed inside App Store Connect / Play Console; add campaign links there later if the owner gives access.

## Owner decisions

1. Confirm the referral terms on the site match the app exactly (and whether there is an expiry or cap).
2. Resolve the minimum-order and service-area differences above.
3. Optional: a sign-up offer for new customers who are not referred. Today there is none, so the site does not offer one.
4. Put the `/get-app/` QR code on the trucks and invoices.
