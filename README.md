# NYC Small Business Resource Network

The website for the NYC Small Business Resource Network (SBRN): a public-private partnership of the Chambers of Commerce of all five boroughs that gives New York City small businesses personalized guidance and resources. Rebuilt from the scraped source in `raw messy data/` on the Novus template.

## Public-service alternative

The default experience prioritizes reading and getting help: a real Brooklyn storefront photograph, visible services, borough contacts and business stories. Slate and coral retain the Network’s identity. Navigation is immediate; internal pages have static headers, and content never depends on a precise scroll position. Open + Online’s closure notice and all existing routes remain intact.

The interactive design, including the pre-existing translation and performance work, is preserved at `archive/interactive-design-2026-11-14` (commit `dd304af`). This alternative lives on `design/accessible-public-service`. The optional neighborhood scene is also available at `/walk`, with a persistent “Skip the walk. View all services” exit.

For a source comparison: `git diff archive/interactive-design-2026-11-14...design/accessible-public-service`. To run the archive separately, create a second worktree: `git worktree add ../sbrn-interactive archive/interactive-design-2026-11-14`, install dependencies there, then use `npm run dev -- --port 3012`.

Typography uses condensed Archivo for short display headings, normal-width Archivo for reading and navigation, and Newsreader for quotations. The character refinement adds a layered storefront hero, a static borough map, service pictograms and one featured owner story. The first accessible pass remains available at commit `4534c47`. Palette: slate `#334255`, coral `#fc6251`, harbor `#2b5672`, gold `#ffc55c`, ink `#141c27`, and white/light gray backgrounds. The alternative’s presentation lives in `src/app/styles/public-service.css`.

## Pages

| Route | What it is |
|---|---|
| `/` | Photo introduction, visible services, borough contacts, business stories and support |
| `/services` | Guidance areas, historical examples and direct support links |
| `/walk` | Optional interactive neighborhood, with a persistent exit to services |
| `/about` | Who we are, the five Chambers, funding and collaboration partners |
| `/openandonline` | The Open + Online program: status notice, how a project runs, what is free, the 12 project sites, funders |
| `/stories` | All 10 stories, two per borough |
| `/media` | 39 press items, 2020 to 2024, by year |
| `/connect` | The business profile form link and each borough Chamber's email and website |
| `/privacy-policy`, `/terms-of-service` | The source legal text, with a contents rail |
| 404 | Plain-language page-not-found message and links to home/services |

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
src/app/styles/sections.css    existing body-section styles
src/app/styles/public-service.css   public-service alternative and responsive layouts
src/lib/data/site.ts           every business fact and string (single source of truth)
src/lib/data/press.json        press list
src/lib/data/legal/*.json      legal documents, extracted from the source
src/lib/data/media-manifest.json   every source image: original URL, local path, sizes
src/lib/components/            navbar, footer, page header, primitives (ui.tsx), page sections
src/lib/components/home/       the morning stage: building.tsx (the block), morning.tsx, morning-driver.tsx
src/lib/motion/                scroll-rig.ts, scrub.ts, motion-root.tsx, gate-curtain.tsx
src/lib/i18n/                  languages.ts, translator.ts (in-page translation), language-picker.tsx
src/app/api/translate/route.ts the translation endpoint
```

## How motion works

Standard routes use a 350 ms, 8 px settling movement as supporting sections enter the viewport. Content starts visible and stays readable. There are no gate transitions, animated counters, image shutters, or drifting project galleries in the default experience. Reduced motion disables the entrances. Without JavaScript, primary navigation links stay visible and content remains server-rendered.

The optional `/walk` retains the original `scroll-rig.ts`, `scrub.ts` and `morning-driver.tsx` implementation. The continuous hero gleam is removed. The persistent exit navigates to `/services`, and a second link is available in the scene controls. With reduced motion, the scene uses its existing static service list.

## Languages

The globe button in the nav shows the site in other languages:
- **Up front:** New York's five most-spoken languages after English, in the order of NYC Local Law 30's designated citywide languages: Spanish, Chinese, Russian, Bengali and Haitian Creole.
- **Search:** finds any of 133 languages by English name, native name or code.

The choice persists on the device and carries across pages. A link can open the site in a language directly, for example `/?lang=es`.

How it works:
- **In-place translation.** `translator.ts` translates the rendered page in place. It changes only the text of text nodes and of `alt`, `aria-label`, `title` and `placeholder`. Nothing is wrapped or moved, so React keeps working and page changes are re-translated as they happen.
- **Whole-sentence headings.** Headings split into animated lines are translated as one sentence.
- **Left in English:** the wordmark, the hero's greetings (already in eight languages) and the language names.
- **Fitting:** a long translation of the hero question is shrunk until it clears the nav, and shop signs squeeze to fit their fascia.
- **Right-to-left languages** (Arabic, Urdu, Hebrew and others) set each block's reading direction while the page keeps its composition.
- **Caching:** each language is cached on the device after first use, so switching back is instant.

Translations come from `POST /api/translate`:
- **With `GOOGLE_TRANSLATE_API_KEY` set:** it uses Google Cloud Translation. That's the supported API; its free tier covers 500,000 characters a month.
- **Without a key:** it uses Google Translate's public web endpoint. It is free and needs no account, but it is unofficial and can be rate limited. **Set a key before launch.**

The route only translates from English into a listed language. It caps request size, refuses cross-origin calls, and caches results in memory.

Translations are machine made. The language panel says so, and that the English text of the policies is the binding version.

A limitation: the brand fonts are loaded in their Latin cut only, to keep pages light. Languages with letters outside it (Polish, Czech, Vietnamese and others) show those letters in a system font.

## Why the scroll scene is drawn, not filmed

The optional walk is a drawn, live scene rather than footage. The block is built from the brand's own illustration language (the storefront line drawings in the source), so it looks like this Network and no one else. Because it is SVG and CSS, it:
- stays sharp at any size;
- adds no video weight to the page;
- lands on exactly the right picture at every scroll position, forward or back;
- carries real copy (each service, each real outcome) as text that is readable, selectable and indexed.

## Content notes

Everything comes from `raw messy data/` (a Wix export of nycsmallbusinessresourcenetwork.org). Nothing factual was invented. Where the source was unclear:

- **Chamber emails.** On the source page two visible addresses did not match their `mailto:` targets. The visible text is used: Bronx `helpdesk@bronxchamber.org` (its link pointed at the Staten Island address) and Queens `bizdev@queenschamber.org` (its link pointed at `Recovery@queenschamber.org`). **Please confirm both with the Chambers.**
- **The question carousel.** The original homepage rotates several owner questions; only the first slide was in the scrape (restaurants and outdoor dining). That one is used and no others were written.
- **Service descriptions.** The source names the five services without describing them. New plain-language summaries describe those categories without promising funding or eligibility. The Services page and optional walk pair each with a real historical outcome from the Stories page. "Lease negotiations" has no matching story, so it points to the Chambers instead.
- **Partner names.** The Department of Small Business Services and the Partnership for New York City appear in the source only as links (`nyc.gov/site/sbs`, `pfnyc.org`); their names were taken from those addresses. No role is stated for the Partnership Fund for New York City because the source gives none.
- **Funders** are grouped exactly as the source groups them (four groups); the groups are not labelled because the source does not label them.
- **Typos fixed** silently where the meaning was certain ("Tech Speicalist", "Systèms", "BLKYN", "reached out the Manhattan Chamber", "was learned").
- **Dead links (checked 2026-11-14).** Nine destinations no longer resolve, so those items are shown without a link: the websites of Pan-African Solutions Consulting, OurtBox Cafe, Valid Vibes and NEAT Dry Clean & Tailoring (stories); A Princess & An Heiress and Xenia World Wide Travel (projects); two WCBS 880 articles and one BronxNet video (press). The original addresses are kept in comments in `site.ts` and as `sourceUrl` in `press.json`. Ten more press and reference links answer automated checks with 403 (silive.com, crainsnewyork.com, pix11.com, bizjournals.com, allaboutcookies.org); these block bots and were left linked, but were not confirmed by hand.
- **Open + Online** carries the source's notice that it is not accepting new applications. Remove `openOnline.status` in `site.ts` if that changes.
- **Legal text** is the source wording. Two en dashes and one em dash were replaced with commas to meet the house style; nothing else was changed.
- **Copyright year** in the footer is the current year at build time (the source said 2024).

### Not carried over

- **The business profile form** is the Network's existing external form (FormTitan). It is linked, not rebuilt.

## Media

All 39 source images were downloaded from the original CDN, converted to WebP and self-hosted under `public/media/` (84 MB of originals down to 2.9 MB). `src/lib/data/media-manifest.json` records the source URL, local path and dimensions of each. Images render through `next/image` with responsive `sizes`. The favicon and app icons are cut from the brand's own logo mark; `public/og.png` is a compact rendering of the photo-led hero for social previews.

Several story photos are small in the source (464 to 570 px wide). They are shown at modest sizes rather than upscaled.

## Checks

Run `npm run build`, then `npm run start -- --port 3011`, then `node scripts/qa-public-service.mjs`. The browser audit uses installed Chrome through Playwright and writes `docs/public-service-qa.json`. Set `QA_URL` to target another local port.

The audit checks nine standard routes at 1440, 768, 390 and 320 px, including axe WCAG A/AA rules, overflow, headings and hidden text. It also exercises skip links, mobile navigation (including same-page selection), borough anchors, the optional walk exit, the language picker, reduced motion and no-JavaScript mobile content. Screenshots are saved under the ignored `.shots/public-service/` directory. Historical interactive-version measurements in `docs/qa-summary.json` describe the archive, not this redesign.

Physical-device performance and manual assistive-technology testing remain outside the automated browser checks. The existing Bronx and Queens email source discrepancies remain documented above.

## Deploying

Standard Next.js. On Vercel no configuration is needed. `site.url` in `src/lib/data/site.ts` drives canonical URLs, the sitemap and Open Graph tags: change it if the domain changes.
