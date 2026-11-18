# NYC Small Business Resource Network

The website for the NYC Small Business Resource Network (SBRN): a public-private partnership of the Chambers of Commerce of all five boroughs that gives New York City small businesses personalized guidance and resources. Rebuilt from the scraped source in `raw messy data/` on the Novus template.

## The idea

**Gates up.** Every morning the city's small businesses roll up their gates. The source material says it three ways: the Network helps owners "open and reopen", its flagship program is called Open + Online, and the brand's two colors are slate night and coral sunrise.

So the site is one morning on one block:

- The home page opens on a closed roll-down gate with the question painted on it. Scrolling raises it.
- Behind it is a block before dawn. As you keep scrolling, the camera walks the block; one at a time each shop's gate goes up, its lights come on, and the service it stands for is named (the five things the Network offers), each with a real result from the Stories page. The sky goes from night to sunrise to day, the facades and the copy color follow, and the walk ends on the whole block open in daylight.
- Everything else moves the same way. Page transitions are the gate coming down and going back up. Buttons fill from the sill like a shutter. Index rows raise a slatted panel on hover. Images are uncovered by a lifting shutter. Headings roll up out of their own baseline. The 404 is the one gate that stays down.

Type has two voices. The street speaks in condensed caps (Archivo, one variable family from width 62 to 116): signs, labels, headings. People speak in serif italic (Newsreader): questions, quotes, press headlines.

Palette: slate `#334255` and coral `#fc6251` are the brand's own primaries. Harbor blue `#2b5672` (also from the brand) and lamp gold `#ffc55c` support them. Night `#101823`, day `#f2f4f7` and concrete `#e3e7ec` are the neutrals. Tokens live at the top of `src/app/globals.css` and are mapped into Tailwind in `tailwind.config.ts`.

## Pages

| Route | What it is |
|---|---|
| `/` | The gate, the morning walk (what we offer), who we are, the five-borough network map, Open + Online preview, stories, connect |
| `/about` | Who we are, the five Chambers, funding and collaboration partners |
| `/openandonline` | The Open + Online program: status notice, how a project runs, what is free, the 12 project sites, funders |
| `/stories` | All 10 stories, two per borough |
| `/media` | 39 press items, 2020 to 2024, by year |
| `/connect` | The business profile form link and each borough Chamber's email and website |
| `/privacy-policy`, `/terms-of-service` | The source legal text, with a contents rail |
| 404 | "This gate is down." |

The original slugs (`/openandonline`, `/stories`, `/media`, `/privacy-policy`, `/terms-of-service`) are kept so existing links and search results keep working.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npx tsc --noEmit   # type check
```

Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind 3, anime.js 4.

## Where things live

```
src/app/                       routes, layout, metadata, sitemap, robots, manifest, icons
src/app/globals.css            tokens, base, shared primitives (buttons, links, reveals, the gate texture)
src/app/styles/chrome.css      wordmark, navigation, menu, page curtain, page header, footer
src/app/styles/stage.css       the hero gate and the morning walk
src/app/styles/sections.css    home sections and inner pages
src/lib/data/site.ts           every business fact and string (single source of truth)
src/lib/data/press.json        press list
src/lib/data/legal/*.json      legal documents, extracted from the source
src/lib/data/media-manifest.json   every source image: original URL, local path, sizes
src/lib/components/            navbar, footer, page header, primitives (ui.tsx), page sections
src/lib/components/home/       the morning stage: building.tsx (the block), morning.tsx, morning-driver.tsx
src/lib/motion/                scroll-rig.ts, scrub.ts, motion-root.tsx, gate-curtain.tsx
```

## How the motion works

- **Nothing hijacks scroll.** The page scrolls natively. Pinned sections are plain `position: sticky` stages inside tall sections.
- **One clock.** `scroll-rig.ts` runs a single `requestAnimationFrame` loop, only while a scene is near the viewport. Each scene reads how far its element has travelled and eases toward that value, so wheel steps arrive as a glide.
- **Stateless scrubbing.** `scrub.ts` computes every value fresh from the scroll position, so a flick, a scrollbar drag or a keyboard jump always lands on the right picture. (anime.js timelines leave stale values when sought backward across gaps between tweens, which is why the scroll scene does not use one. anime.js supplies the easing curves there, and drives the time-based pieces: the network map drawing itself, the counters.)
- **The morning is one number.** `morning-driver.tsx` maps scroll progress through the section to the gate, the camera, the sky, the facades, each shop and the copy color. The same number drives all of them, so they cannot disagree.
- **Cheap to render.** Each building is three layers: daylight facade, a solid night tint whose opacity changes, and a front layer for whatever glows or moves. The night-to-day change is compositor-only. Camera moves are a single transform.
- **Graceful by default.** CSS describes the finished picture (gates up, daylight, all copy in normal flow). An inline script adds `html.motion` before first paint only when the visitor has not asked for reduced motion; if the app bundle never arrives the class is removed again. Without JavaScript or with reduced motion the home page is a static open block with the five services listed beneath it.
- **Keyboard.** Tabbing through the pinned walk scrolls each service into view as its link takes focus. The five tick buttons jump to a service. "Skip the walk" leaves the stage.

## Why the scroll scene is drawn, not filmed

The signature moment is a drawn, live scene rather than footage. The block is built from the brand's own illustration language (the storefront line drawings in the source), so it looks like this Network and no one else. Because it is SVG and CSS, it:
- stays sharp at any size;
- adds no video weight to the page;
- lands on exactly the right picture at every scroll position, forward or back;
- carries real copy (each service, each real outcome) as text that is readable, selectable and indexed.

## Content notes

Everything comes from `raw messy data/` (a Wix export of nycsmallbusinessresourcenetwork.org). Nothing factual was invented. Where the source was unclear:

- **Chamber emails.** On the source page two visible addresses did not match their `mailto:` targets. The visible text is used: Bronx `helpdesk@bronxchamber.org` (its link pointed at the Staten Island address) and Queens `bizdev@queenschamber.org` (its link pointed at `Recovery@queenschamber.org`). **Please confirm both with the Chambers.**
- **The question carousel.** The original homepage rotates several owner questions; only the first slide was in the scrape (restaurants and outdoor dining). That one is used and no others were written.
- **Service descriptions.** The source names the five services without describing them. On the walk each is paired with a real outcome from the Stories page. "Lease negotiations" has no matching story, so it points to the Chambers instead.
- **Partner names.** The Department of Small Business Services and the Partnership for New York City appear in the source only as links (`nyc.gov/site/sbs`, `pfnyc.org`); their names were taken from those addresses. No role is stated for the Partnership Fund for New York City because the source gives none.
- **Funders** are grouped exactly as the source groups them (four groups); the groups are not labelled because the source does not label them.
- **Typos fixed** silently where the meaning was certain ("Tech Speicalist", "Systèms", "BLKYN", "reached out the Manhattan Chamber", "was learned").
- **Dead links (checked 2026-11-14).** Nine destinations no longer resolve, so those items are shown without a link: the websites of Pan-African Solutions Consulting, OurtBox Cafe, Valid Vibes and NEAT Dry Clean & Tailoring (stories); A Princess & An Heiress and Xenia World Wide Travel (projects); two WCBS 880 articles and one BronxNet video (press). The original addresses are kept in comments in `site.ts` and as `sourceUrl` in `press.json`. Ten more press and reference links answer automated checks with 403 (silive.com, crainsnewyork.com, pix11.com, bizjournals.com, allaboutcookies.org); these block bots and were left linked, but were not confirmed by hand.
- **Open + Online** carries the source's notice that it is not accepting new applications. Remove `openOnline.status` in `site.ts` if that changes.
- **Legal text** is the source wording. Two en dashes and one em dash were replaced with commas to meet the house style; nothing else was changed.
- **Copyright year** in the footer is the current year at build time (the source said 2024).

### Not carried over

- **The business profile form** is the Network's existing external form (FormTitan). It is linked, not rebuilt.

### Translations

The site reads in English plus the eight languages of the Network's original site: Greek, Spanish, Haitian Creole, Korean, Russian, Tagalog, Urdu (right to left) and Simplified Chinese. There is no translation API, key or usage bill: every phrase is written out in `src/lib/i18n/messages/`.

- **How it works.** Pages stay written in English. `src/lib/i18n/runtime.tsx` swaps the rendered copy (text, `alt`, `aria-label`, `title`, `placeholder`, page titles) for the chosen language after React renders, and keeps doing so as routes, menus and form states change. Dates are formatted for the language by the browser. Names of businesses, people, outlets, funders, credits and the postal address stay as written (`src/lib/i18n/keep.ts`), as does `Made by Novus`.
- **Choosing a language.** The globe control in the navbar, the language row at the foot of the mobile menu, and the hero's greetings (each one switches the site into its language). The choice is remembered in the browser, and `?lang=es` (or any code) opens a page in that language for sharing. A head script applies a saved choice before first paint, so returning readers do not see English flash.
- **Message files.** `en.json` maps a message id to the English exactly as it renders. Each language file has the same ids. A sentence with a link inside is split at the link with `‖` and must keep the same number of pieces; `{0}` stands for a name or number that is filled in (for example `Read from {0} (opens in a new tab)`).
- **After changing copy.** Run the site, then `npm run i18n:check` (set `I18N_BASE` if it is not on port 3000). It visits every route in every language, opens the states that render extra text, and lists any phrase without a translation plus any text that overflows at phone width. Untranslated phrases fall back to English rather than breaking. Add the new English to `en.json` under a new id and the translation to each language file.
- **Legal pages** are translated in full, with a notice in the reader's language that the English text governs and a button back to it.

## Media

All 39 source images were downloaded from the original CDN, converted to WebP and self-hosted under `public/media/` (84 MB of originals down to 2.9 MB). `src/lib/data/media-manifest.json` records the source URL, local path and dimensions of each. Images render through `next/image` with responsive `sizes`. The favicon and app icons are cut from the brand's own logo mark; `public/og.png` is composed from the live hero.

Several story photos are small in the source (464 to 570 px wide). They are shown at modest sizes rather than upscaled.

## Checks

Run against the production build on 2026-11-14 with a headless-browser crawl of every page (desktop 1440, phone 390 on a throttled mid-range profile: 4x CPU, slow 4G; reduced motion; keyboard; hover) plus an HTML audit. Results are in the delivery notes of the build session; the short version:

- Build and type check pass. No console errors, failed requests or horizontal overflow on any page.
- Throttled phone, second full crawl: largest content paint 2.0 to 2.4 s, layout shift at or below 0.032. Home layout shift was 0. All nine page types had zero axe violations, console/request errors, horizontal overflow or hidden reduced-motion text. See `docs/qa-summary.json`.
- Headings, landmarks, alt text, skip link and focus order verified; reduced motion shows every page complete and still.

Frame rate was measured in a headless browser on a software GPU (60 fps there), which is a lab result, not a guarantee of performance on real phones. It has not been checked on physical devices.

## Deploying

Standard Next.js. On Vercel no configuration is needed. `site.url` in `src/lib/data/site.ts` drives canonical URLs, the sitemap and Open Graph tags: change it if the domain changes.
