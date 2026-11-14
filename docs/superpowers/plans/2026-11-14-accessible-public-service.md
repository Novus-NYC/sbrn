# Accessible public-service implementation plan

**Goal:** Make the standard site useful without learning a scrolling interaction.
**Architecture:** Server-rendered Next.js pages and shared content; existing translation stays intact. Keep the optional walk isolated in its own route and replace shared gate chrome with conventional headers.
**Tech stack:** Next.js, React, TypeScript, existing CSS, Playwright and axe.
**Spec:** `docs/superpowers/specs/2026-11-14-accessible-public-service-design.md`

## Constraints
Keep sourced content and assets, preserve original branch, no new dependencies, no em dashes, no fabricated sponsor logos, no changes to translation API or provider.

## Tasks
- [x] Preserve the current working tree on the archive branch and record its commit.
- [x] Build `src/app/page.tsx` and `src/app/services/page.tsx` around visible services, real photography and direct contact links; centralize service summaries in `src/lib/data/site.ts`.
- [x] Move the walk to `src/app/walk/page.tsx`, with prominent persistent exit, and remove its misleading in-page skip target.
- [x] Simplify `page-header.tsx`, update internal callers, remove global GateCurtain, replace site motion with short nonblocking reveals, and simplify the website process to a readable static sequence.
- [x] Add scoped presentation in `src/app/styles/public-service.css`; redesign funders using existing source groups and actual assets.
- [x] Verify actual rendered routes, mobile menu keyboard behavior, normal client navigation and anchors, no-JavaScript content and reduced motion. Check overflow at 390/768/1440 widths and reflow at 320px. Run axe, typecheck and production build; inspect screenshots. Record evidence and comparison instructions.

## Review focus
- Small screens and long sponsor names must wrap without horizontal scrolling.
- All service descriptions must remain readable at arbitrary scroll positions.
- An anchor reached by keyboard must be clear of the fixed navbar.
- Disabling JavaScript or enabling reduced motion must never hide essential content.
- Existing translation controls and external business profile destination must remain available.

## Validation record
Production build and TypeScript pass. The browser audit checks 36 route/viewport combinations and the navigation, motion, no-JavaScript and image invariants listed above. See `docs/public-service-qa.json` for the current results. A separate read-only crawl resolved 348 internal links and anchors. The business profile form, all five Chamber sites and Novus returned HTTP 200. Live Spanish translation was checked on the homepage and after navigating to Services. These checks do not submit the external form or verify mailbox ownership.

Independent review found one overlap on the optional walk: the new fixed exit covered its heading. `WalkExit` now measures its own rendered height and the walk reserves that space, including wrapped translations. The browser audit asserts the heading clears the bar on desktop and mobile.
