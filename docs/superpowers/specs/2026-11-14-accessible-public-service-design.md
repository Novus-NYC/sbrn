# Accessible public-service alternative

## Intent
Implement the supplied feedback for small business owners, older visitors and the general public. Getting support and reading services must not require precise scrolling. Preserve the current work, including translation and performance improvements, on `archive/interactive-design-2026-11-14` (dd304af). Build the alternative on `design/accessible-public-service`.

## Direction
Retain the Network's slate and coral identity, but use a people-first, public-service composition: clear left-aligned headings, real business photography, ordinary links and visible service descriptions. Palette: slate #334255, harbor #2b5672, coral #fc6251, ink #141c27, canvas #f2f4f7, white #ffffff. Archivo at normal width for reading and headings; Newsreader only for existing quotations. Use a restrained type scale and 72rem content container.

Home: navigation / split introduction and authentic Brooklyn storefront photograph / five visible services / borough contact links / three photographed business stories / next step. A dedicated Services route gives each service its detail and supporting story. Keep the walk as an explicitly optional /walk route, with a persistent exit to the standard site's services. Keep real destinations, translations, program closure notice and existing routes.

Internal headers: readable editorial headings with page-specific facts or photography, no gates. Immediate native route navigation. Funders: spacious light-background acknowledgment, actual Wells Fargo asset and consistent text cells for names lacking verified logos; retain source grouping without inventing sponsorship levels.

Motion: one brief entrance on nonessential section content, no disappearance or scroll-dependent text, no counting, gleam, drifting galleries or gate transitions in standard routes. Reduced motion and no JavaScript leave content readable. The optional walk retains its intentionally interactive scene.

## Approaches
A light polish of the existing walk would retain its central usability problem. A complete brand replacement would discard the identity the feedback asks to preserve. The chosen implementation direction is a conventional default with the existing interactive version preserved separately and an optional walk route. This is the builder's interpretation of the supplied feedback, not a separate client design approval.

## Constraints and validation
No new dependencies, no fabricated photography, business outcomes, logo assets or sponsor ranks. Preserve Next.js App Router and current translation integration. Keep AGENTS.md and CLAUDE.md identical. Check production build and TypeScript, all routes at desktop/tablet/mobile widths, real browser navigation, keyboard menu and anchors, reduced motion, no-JavaScript content, image loading and axe. Document any existing uncertain contact information without claiming it was newly verified.
