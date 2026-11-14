# NYC Small Business Resource Network: public-service alternative

## Audience and action
Everyday small business owners across New York’s five boroughs, including visitors who prefer conventional navigation and straightforward reading. The primary action is to request guidance through the existing business profile form or contact a local Chamber.

## Art direction
Local people, practical support, and the character of a New York block. A light paper hero pairs bold, condensed Archivo lettering with real storefront photographs. A coral offset frame and a smaller neighborhood photo give the composition a human, collected quality. Body copy and navigation retain normal-width Archivo; Newsreader is reserved for the featured owner’s own words.

Use white service content, a dark static street-map section for borough contacts, paper-toned business stories, and a coral closing action. Vary composition as well as color: a photo-led opening, illustrated service list, map and borough directory, then one featured owner story with two smaller supporting stories. Images are authentic sourced assets, not illustrative substitutes. The hero shows Brooklyn Burgers & Beer; stories feature Harlem’s Heaven Hats, La Bomboniera Marylu and NEAT Dry Clean & Tailoring. About includes Vincent’s Barber Shop.

## Architecture
- Home introduces the organization, displays every service, links directly to five borough contacts and previews real stories.
- Services provides each guidance area, historical supporting examples and a way to ask for help.
- Existing About, Open + Online, Stories, Media, Connect and legal routes remain available.
- Open + Online keeps its closure notice, readable four-step process, project examples and acknowledgment of funders.
- `/walk` is an optional experience. Its exit is always visible below the navigation.

## Motion and accessibility
Native navigation, no transition gate, no repeated gate heroes, no scroll-dependent reading in standard routes. Supporting entrances move only 8 px over 350 ms and never hide content. Reduced motion removes them. The mobile menu has keyboard handling, a visible close action and closes for same-page selections. The contact map is omitted on smaller screens so contacts come first.

## Funders
Retain all names and source groupings. Use the actual supplied Wells Fargo logo. Other names use consistent typography in bordered cells; no fabricated logos, sponsorship amounts or invented tier labels.

## Comparison and evidence
Original design: `archive/interactive-design-2026-11-14`, commit `dd304af`, including pre-existing translation and performance changes. Alternative: `design/accessible-public-service`.

Implementation rationale: `docs/superpowers/specs/2026-11-14-accessible-public-service-design.md`.
Browser audit: `docs/public-service-qa.json`. Rerun with `node scripts/qa-public-service.mjs` against a production server on port 3011. Original visual concept and performance records remain on the archive branch.

## Existing limitations
The Bronx and Queens email discrepancies in the source need confirmation by the Chambers. Translation remains the existing integration; its provider requirements are documented in README. Physical-device and screen-reader tests are still needed before launch.

## Character refinement
The first accessible alternative is preserved at commit `4534c47`. The follow-up responds to “too bland” through composition, type, real photographs and static place-specific graphics. It does not restore scroll-dependent reading, continuous effects or gate transitions. See `docs/superpowers/specs/2026-11-14-neighborhood-character.md`.
