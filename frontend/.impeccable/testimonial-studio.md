# Customer review studio

Historical rating-dashboard presentation. The current editorial review reel is documented in `testimonial-reel.md`; retain this file as the prior-version record.

Local redesign of Testimonial only. Persuade mode; established dark homepage, Poppins and compact header-like buttons remain. User will provide more real reviews later; do not manufacture customer records.

## Direction contract

THESIS: A review spotlight supported by transparent data, replacing identical paired cards.

OWN-WORLD: Original dark canvas, warm-white typography and pale cyan; open rating breakdown next to one bordered quote surface.

STORY: Understand actual feedback, inspect its rating/date and author, read the full quote, then choose another customer or open all reviews.

FIRST VIEWPORT: Two-line heading above an open left summary and broad right review; compact customer selectors sit below the quote. Rating average/count/distribution derive solely from loaded valid ratings.

FORM: Code-led local composition, no visual-world seed required. One clipped crossfade on selection and inline text expansion; no autoplay. Mobile leads with the review and places summary below.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. Documentation remains component-scoped; no global identity change.

## Verification

Build, scoped ESLint, diff whitespace and six data tests pass. An isolated SSR harness covers loading/error/empty, 0/1/1,000 reviews, bounded rendering (one review plus five selectors), private-field exclusion and complete long text. Live API has two supplied reviews, both rated 5/5, dated June 2025; no records were created or changed. New reviews are awaiting the user.

Keyboard Next selects Sita Gurung; inline expansion exposes all text (mobile content/scroll height both 960px). Laptop CTA height is 40px; local overflow checks passed laptop/mobile/narrow. Validated final captures: `.impeccable/review/testimonial-studio/desktop.png` 1280×900, `tablet.png` 900×1100, `mobile.png` 390×1600, `user-360.png` 360×1600. The desktop image includes previous/next controls and the top of the selector row; the section continues normally below the viewport. Two batched inspection rounds completed; one detector pass returned [].

## Shipped component record

Finish verdict: **ship**. The fresh reviewer found no material issues in the scoped source and four supplied captures. The documentation handoff records one active article plus at most five customer selectors, an open average/count/distribution summary and a 40px all-reviews CTA. Below 760px, the article and browsing controls lead, with the summary below. Selection is manual; there is no autoplay.

Only valid supplied ratings contribute to the average; histogram rounding is disclosed. Valid backend creation timestamps display UTC month/year, while missing dates omit the label. The full quote remains available and expands from a 160px clipped area without internal scrolling; switching customers resets expansion. Loading, empty, retryable errors, missing ratings, failed portraits, visible focus and reduced motion remain supported.

The homepage's canvas, Poppins, warm white, slate and pale cyan are inherited. The scoped 48px padding declaration competes with global section styling and is not a confirmed rendered value. No global design identity or customer records were changed. Additional reviews are pending from the user.

Evidence limits: loaded captures contain the actual two-review dataset; alternate states and large counts are covered by the recorded harness, not screenshots. No new shipping raster assets were created or downloaded. Portraits use backend URLs with initials fallback; screenshots are development-only QA artifacts.
