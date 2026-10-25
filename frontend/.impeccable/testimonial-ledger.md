# Customer review journal

Scope: Testimonial only, Persuade. Inherit the existing homepage identity and live API. Previous reel is an anti-reference. No customer data changes.

## Direction contract

THESIS: A readable collection of customer voices, presented as open correspondence.

OWN-WORLD: Original dark canvas, warm white type, muted metadata, restrained cyan actions. Poppins and compact header-like buttons.

STORY: Scan who wrote each review, read their feedback, expand longer entries, browse more.

FIRST VIEWPORT: Left-aligned heading with a compact review summary opposite. Full-width ruled rows align customer identity at left and a medium-scale quote at right. Two genuine reviews visible together on laptop.

FORM: Code-led local redesign; no identity seed. Rows reveal with a subtle directional wipe, disclosures unfold inline. Mobile aligns identity above each quote. Six entries per page bounds rendering.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. Documentation stays in this component brief; no global identity changes or new rasters.

## Verification

Production build, scoped ESLint, six existing data tests and isolated SSR checks passed. SSR checks loading/error/empty and 0/1/1,000 records, six-row bounded rendering and full long-text availability. One detector pass returned no findings. The API currently returns three reviews; no records were changed by this task.

Viewport captures: `.impeccable/review/testimonial-ledger/desktop.png` (1280×1000), `mobile.png` (390×844), `user-360.png` (360×749). All opened and checked with loaded data. No local horizontal overflow at these widths. Computed main button height is 40px. Keyboard expansion opens full feedback; measured content and scroll height match at 355px. Browser viewport override reset after inspection. Captures are viewport evidence, not full-section captures; lower rows and footer continue in page flow.

Previous source preserved in workspace `work/testimonial-before-ledger.jsx` and `work/testimonial-before-ledger.scss`.

## Implemented composition and finish

This local journal inherits Home.scss typography and color tokens. The heading and live summary precede open, ruled rows: customer identity and date at left, rating and quotation at right. Six reviews render per page; longer quotations expand inline. Circular API avatars fall back to initials. No new shipping rasters or global design-system changes.

At 760px and below, heading and row columns stack; below 400px, dates indent beneath identity. Rows enter with a restrained wipe, fade and rise; disclosures animate height and opacity. Reduced motion removes these animations and CSS transitions. Controls expose focus, expanded and disabled states. Loading, retryable error and empty states are explicit.

Fresh finish disposition: **ship**, no material findings. Evidence is source and supplied screenshots; the lower third row and footer received source review only. Browser viewports were 1280×1000, 390×844 and 360×749; saved images were downscaled to 1265×988, 375×812 and 345×718 respectively. These are not full-section captures.
