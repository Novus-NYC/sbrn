# DESIGN.md: NYC Small Business Resource Network

Planning record for later passes. Facts live in `src/lib/data/site.ts`; how to run and the content notes live in `README.md`.

## Brief

- **Subject:** NYC Small Business Resource Network (SBRN): a public-private partnership of the five borough Chambers of Commerce, offering free, personalized guidance to New York City small businesses.
- **Audience:** owners of small businesses in the five boroughs (restaurants, salons, shops, service firms), many of whom speak English as a second language, plus press, funders and partners.
- **Job:** get an owner to submit the business profile form or email their borough's Chamber. The secondary job is to show the Network is real and effective (stories, press, partners).
- **Assets:** a Wix scrape: logo mark, the brand's own storefront line drawings and street map, 10 owner stories with photos, 12 Open + Online project screenshots, 39 press items, Chamber and funder logos, legal text, and eight translations of the hero.
- **Constraints:** no invented facts. Use house rules from `AGENTS.md`: no em dashes, no leading zeroes, a Made by Novus footer link. The requested Higgsfield video was blocked by credits (see README, "Film").

## Concept options

| # | Territory | Idea | Anchor | Orig | Fit | Feas | Port (low good) |
|---|---|---|---|---|---|---|---|
| A | Place and culture | **Gates up:** one morning on one block; scrolling rolls up each shop's gate | "open and reopen", the program name Open + Online, a slate night and coral sunrise palette, the brand's own storefront drawings | 5 | 5 | 4 | 1 |
| B | Material | The intake form as a city ledger: every section a stamped page of a case file | Personalized guidance starts with a business profile | 3 | 3 | 5 | 3 |
| C | Typographic system | Five borough columns that converge into one network grid as you scroll | Five Chambers, one network | 4 | 4 | 4 | 3 |

**Picked A.** It belongs only to this subject: the source itself says "open", the palette already is dawn, and the brand already draws storefronts.

## Concept card

```
Idea:        One morning on one New York block: as you scroll, each shop's gate rolls up and its lights come on.
Metaphor:    The roll-down security gate of a NYC storefront, and the sky going from night to day.
Signature:   The pinned morning walk on the home page: the hero gate rises, then the camera walks the block
             and five shops open in turn, each naming one service with a real result
             (morning-driver.tsx, a stateless scrub of one progress value).
Emotion:     The first 3 seconds should feel like a city at rest, about to open. The gate is shut and the question is
             painted on the steel.
Motion verb: Roll like a gate: things rise from a sill, with a firm ease-in and a long settle.
Screenshot:  Mid-walk at sunrise: the coral shop with its gate half up, warm interior light, a service name in giant
             condensed caps.
```

## System

**Palette** (tokens in `src/app/globals.css`)

| Role | Name | Hex |
|---|---|---|
| Ground (night) | Night | `#101823` |
| Primary | Slate (brand) | `#334255` |
| Accent and action | Coral (brand) | `#fc6251`; `#c7382a` as coral ink on light grounds |
| Supplemental | Harbor (brand) | `#2b5672` |
| Supplemental | Lamp | `#ffc55c` |
| Ground (day) | Day / Concrete | `#f2f4f7` / `#e3e7ec` |
| Ink / muted | Ink / Ink 2 | `#141c27` / `#4a596c` |

**Type.** There are two voices. The street speaks in Archivo (variable width 62 to 116): condensed caps for signs, labels and display, normal width for body. People speak in Newsreader italic: questions, quotes and press headlines. Display tracking runs from -0.01 to -0.035em with leading from 0.86 to 0.9. Body text is 16 to 18 px with 1.55 leading. Width-matched local fallbacks prevent reflow when fonts swap.

**Grid.** 12 columns inside a 97rem wrap, with a fluid gutter from 18 to 44 px. Section rhythm alternates night and day and changes density: the pinned stage, a statement, a map, a filmstrip, a quote and ledger, then the coral band.

**Shape.** Square corners everywhere; the only round things are lamps and pins. Gate slats are a repeating gradient sized by `--slat`.

**Motion language.** One ease family: `--ease-gate` (0.66, 0, 0.16, 1) for things that roll and `--ease-out` for things that settle. Interface motion takes 280, 520 or 760 ms. Line reveals stagger by about 60 ms.
- Page transition: a gate rolls down over the page you leave and back up on the next.
- Buttons: a fill rises from the sill like a shutter.
- Index rows: a slatted panel rises behind the row.
- Images: a shutter lifts off them.
- Headings: each line rolls up out of its own baseline.
- 404: the one gate that stays down.

**Idle state.** While the gate is down, a streetlight pool drifts slowly across the steel and leans toward the pointer. This runs on the scroll rig's clock. CSS adds a few more loops:
- a light sweep crosses the gate every 13 s;
- the greetings cycle through the eight source languages;
- steam rises from the cafe;
- the scroll cue bobs.

All of them pause when the gate is away and are off under reduced motion.

**One clock.** `scroll-rig.ts` runs a single rAF loop, and only while a scene is near the viewport. GSAP and Lenis were deliberately not used: the user offered anime.js, native scroll avoids any hijack, and a stateless scrub avoids the anime.js backward-seek issue documented in the README.

## Composition plan (home)

```
1 GATE (full viewport, night slats)        2 MORNING WALK (pinned stage, ~8 screens)
+--------------------------------+         +--------------------------------+
| wordmark            nav   CTA  |         | sky gradient night>dawn>day    |
| greetings |                    |         | skyline                        |
|           | ARE YOU A          |         |  [shop][shop][SHOP][shop][shop]|
|           | SMALL BUSINESS?    |         |  service name, giant caps      |
|           | We are here...     |         |  result from a real story      |
| [CONNECT] [see what we offer]  |         | ticks 1..5         skip walk   |
| chamber logos strip            |         +--------------------------------+
+--------------------------------+
3 WHO (day, statement + taped note)        4 NETWORK MAP (night, street map + pins)
+--------------------------------+         +--------------------------------+
| SERVING THE SMALL              |         | map full bleed, 5 pins draw in |
| BUSINESSES THAT MAKE NEW YORK. |         | borough index list on the left |
| copy (6 col)   | note (5 col)  |         +--------------------------------+
+--------------------------------+
5 OPEN + ONLINE (drifting browser frames)  6 STORIES (quote + dollar ledger)  7 CONNECT BAND (coral slats)
```

Inner pages share a gate header (`page-header.tsx`). Each page then gives the gate its own state: it lifts part way on load, and its own shop window shows beneath it.
- About: the brand's block drawing, lit lamp-gold.
- Open + Online: the real client sites, hung edge to edge.
- Stories: the owners' photos.
- Media: a newsstand of every outlet that covered the Network.
- Connect: the gate is painted coral, the open sign, because this page is the way in.
- Legal: stays a plain gate, since it is fine print.

Below the header, each page has its own body:
- About: an illustration beside the Chambers.
- Open + Online: a sticky browser that builds itself step by step.
- Stories: borough chapters.
- Media: a press index by year.
- Connect: a map with pins that light from the list.
- Legal: a contents rail.

Critic pass 1 (fresh subagent, 2026-11-14) scored the site **7.35**: Design 7.5, Usability 7, Creativity 7.5, Content 7.5. Fixed after it:
- Inner page headers were all identical; each page now has its own gate state.
- Lamps and trees cut through the shop signs; they are now low furniture.
- Nav hovers were a color swap; they now roll out an underline.
- The intro took 4.6 s to settle; the idle sweep now waits.
- The home page still promoted the closed Open + Online program; it now shows the closed status.
- The 230,000+ comma collided with its label.
- The daytime label had low contrast on the sky.
- Chamber email rows read as form fields.
- The 404 was bottom-heavy on phones.
- Pages ending on the coral band asked twice; the footer CTA now hides there.
- A real bug: Tailwind was purging the ghost, ink and line button variants, so every button rendered coral. They are now safelisted.

QA pass 2 crawl results, on every page:
- 0 errors, 0 axe violations, 0 overflow;
- `noHoverChange` empty;
- hero settles in about 2.2 s;
- throttled phone LCP 2.0 to 2.4 s, CLS at most 0.032.

Critic pass 2 (a fresh subagent) scored **7.6**: Design 7.5, Usability 7.5, Creativity 8, Content 7.5. It also read the concept correctly. Fixed after it:
- utility links now get a moving underline;
- open ticks lift on hover;
- "Skip the walk" sits on a night chip;
- the resting greetings have more contrast.

Two of its findings were misreads of frames caught between walk stops: "the walk stops carry no content" and "the hero CTA hover is unproven".

Still open from that list:
- dead zones at about d-05 and in the Open + Online sticky steps;
- a more concrete About lead (the current one is source copy);
- page-specific objects on the right of the Stories and Media headers.

## Genericness test

- A generic build would have used a stock skyline photo hero with centered white text. Here the hero is a painted roll-down gate instead.
- A generic build would have shown three service cards. Here the five services are five shops on the walk.
- A generic build would have used testimonial cards. Here there is one owner quote and a ledger of dollar outcomes.
- A generic build would have used a blue-and-white municipal palette. Here the palette comes from the brand's own slate and coral, played as night and dawn.

## Open items

- **Higgsfield footage** is not generated because the account had no credits. The film slot is built and tested and switches on from `src/lib/data/film.ts`.
- **Two Chamber emails** must be confirmed with the Chambers (see README, "Content notes").
- **Physical-device testing** is still needed for frame rate on real phones.
