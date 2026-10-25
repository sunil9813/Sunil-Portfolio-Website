# Review reel

Local redesign of the rejected rating studio. Inherit dark homepage, Poppins, compact controls and authentic API feedback; no customer records changed. Mode: Persuade.

## Direction contract

THESIS: Customer voices become an editorial reel, not a ratings dashboard.

OWN-WORLD: Warm white and muted slate on the original canvas, restrained pale cyan controls; an open oversized quote beside a compact next-review panel.

STORY: Read a clear excerpt, identify the customer, expand the complete feedback, or move to the next voice.

FIRST VIEWPORT: Short heading and compact navigation above an asymmetric main quote and next-review preview. Actual rating summary and all-review action close the section.

FORM: Code-led local design, no identity seed. Directional clip reveals accompany manual selection, with inline full-review expansion and no autoplay. Narrow screens stack preview below the main quote.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. Documentation remains component scoped; no global identity replacement or new shipping rasters.

## Verification

Production build, scoped ESLint, six normalization/data tests and isolated SSR checks pass. SSR covers loading/error/empty, 0/1/1,000 reviews, bounded main+next articles and five selectors, complete long text and private-field exclusion. Existing API data remains unchanged. Excerpts are literal leading text, ending at a complete sentence where possible, otherwise a word boundary; omitted content is indicated and the full source text remains available.

Two batched visual rounds validated `.impeccable/review/testimonial-reel/desktop.png` 1280×900, `tablet.png` 900×1100, `mobile.png` 390×1600 and `user-360.png` 360×1600. All show loaded API data. Laptop read/all-review actions are visible; additional customer selectors follow in page flow. No local horizontal overflow on measured desktop/mobile/narrow widths. Button height is 40px and computed section top padding is 48px.

Keyboard Next selected Sita Gurung; Read their story exposes full text (mobile content and scroll height both 778px, aria-hidden=false). One detector pass identified width animation on a selection marker; it was replaced with a transform animation before final captures. No second detector was run. Proof images are development-only, not shipping assets; avatars stay API-sourced with initials fallback.

## Shipped component record

Final fresh review verdict: **ship the UI**, no material findings across all four captures. The documentation handoff records an open main quote and one 16px-bordered next-review preview, stacked below 760px. Poppins and existing dark homepage tokens remain. Computed section padding is 48px; navigation is 44×40px and other controls have 40px minimum height.

Excerpts preserve literal leading text and indicate omissions; full source feedback expands inline. Customer selection uses directional clip reveals, with no autoplay. Reduced motion removes reveal/expansion animation and CSS transitions. Previous/next, preview action and bounded selectors all remain manual. Ratings and the average derive from normalized API data. Loading/error/retry/empty/single-record states, accessible control names, pressed/expanded state, focus outlines and polite announcements are implemented.

Review evidence is source and supplied screenshots; the reviewer did not independently rerun build or functional checks. No customer records or claims were added. Photos remain backend-sourced with initials fallback. No new shipping rasters exist; screenshots are development-only. Documentation is component-scoped, not a replacement global identity.
