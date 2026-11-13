# Blackfin Fuels website

Rebuild of [blackfinfuels.com](https://blackfinfuels.com/) as a 3D, scroll-driven site.

**Preview:** https://asimnoor941.github.io/blackfin-fuels-website/ (demo build: sample price, booking requests are not sent). Every push to `main` republishes it automatically (`.github/workflows/pages.yml`, about 1 to 2 minutes).

**Status:** all pages rebuilt in Astro. Live price and booking need the CRM/hub endpoints before going live on blackfinfuels.com.

The `reference/` mirror of the old site is kept locally only (third-party content, stock images of unknown licence) and is not in this repo.

```
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run build:demo  # demo build: sample price, orders not sent, noindex
```

## Start here

1. [docs/PLAN.md](docs/PLAN.md): concept, storyboard, phases, open decisions
2. [docs/STACK.md](docs/STACK.md): recommended stack and why
3. [docs/SITE-AUDIT.md](docs/SITE-AUDIT.md): what the current site is
4. [docs/ASSET-INVENTORY.md](docs/ASSET-INVENTORY.md): downloaded images and video
5. [docs/BRAND.md](docs/BRAND.md): colours, type, voice, facts
6. [docs/APP-MARKETING.md](docs/APP-MARKETING.md): how the app and the $25 referral are promoted

## Folders

- `docs/` planning documents
- `reference/original-site/` mirror of the live site taken 2026-11-13 (about 200 MB; read-only)
  - `content/` page text as Markdown
  - `media/` images and video
  - `pages/`, `css/`, `api/` raw HTML, stylesheets, sitemaps, WordPress API dumps
  - `manifest.json` index of every file and where it was used
- `reference/frames/`, `reference/contact/` preview frames and a photo contact sheet

`CLAUDE.md` holds the working rules for AI-assisted sessions in this repo.
