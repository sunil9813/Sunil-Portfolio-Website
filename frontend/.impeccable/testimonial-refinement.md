# Testimonial refinement

## Dynamic customer review update

The user clarified that this is dynamic customer feedback. This update supersedes
the sample-data and hidden-all-quotes implementation notes below. Testimonial now
uses the existing public portfolio/testimonial service, with abort on unmount,
15s timeout and local loading/error/retry state. No backend changes or fabricated
fallback reviews. Public feedback fields are normalized to name, plain-text
content, role/company, optional safe avatar and optional actual rating; contact
and inquiry records are excluded. Avatar failures fall back to initials.

Selection uses stable record IDs; disappearing records fall back safely to the
first review. Any result count is supported; only five selectors and one quote
are rendered at a time. Arrows navigate all records. Single-review navigation is
disabled and play hidden. Full long text remains accessible in a focused,
scrollable quote region with bounded stage height (350px desktop, 440px phone),
preserving layout without measuring/rendering every record. Missing names/roles,
empty lists, malformed entries, slow responses and API failures have safe states.
Do not expose email, phone, inquiry details or invent verification claims.

Dynamic verification: the configured live API returned two feedback records;
names, avatars and actual ratings rendered, keyboard Next selected the second
record, and keyboard End reached the bottom of a long review (scrollTop 572,
scrollHeight 918, clientHeight 346 on mobile). Long reviews show a reading hint.
Desktop 1280px and phone 390px had no component overflow. Build and scoped lint
pass. Four persistent normalization tests pass via
`node --test src/screen/home/testimonialData.test.js`; an isolated server-render
harness also passes loading/error/empty, single-record disabled controls, safe
plain-text content and bounded 1000-record rendering. Empty/error/single-record
states were verified in tests, not by altering real backend data. Captures are
workspace work/testimonial-dynamic-desktop.png and testimonial-dynamic-mobile.png.
The prior static-content design-review verdict does not certify this API update.

Scope: Testimonial only. Mode: Persuade. The dark homepage, Poppins, spacing
tokens and cyan accent are inherited; no global theme or other section changes.
Existing literary excerpts and attributions stay intact. They are sample content,
not evidence of client relationships, and must be visibly labelled as such.

## Direction contract

THESIS: give each voice room to be read, rather than repeat two moving walls.
OWN-WORLD: original dark canvas, off-white typography, muted slate, restrained
cyan, open composition and thin rules; no portraits, stars or fabricated proof.
STORY: select a voice, read its complete quote, move to another or opt into play.
FIRST VIEWPORT: split heading and disclosure; generous quote at left, five named
selectors at right. Attribution and compact transport controls finish the quote.
FORM: local component extension of the established homepage; no seed required.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

Motion: one short clipped quote transition. Manual mode by default; optional
autoplay pauses offscreen, on hidden pages, interaction and reduced motion.
No new raster assets or packages. Source snapshot saved in workspace work/.

## Shipped ground truth

Documenter handoff: this scoped record documents Testimonial only, not a new
visual identity. No global PRODUCT.md, DESIGN.md or design.json was introduced.
The original direction contract above remains historical intent; source is truth.

Colors and type inherit Home.scss: transparent surface on #13161c, ink #f3f2ef,
muted #adb3bf, cyan #92d8df, rules rgba(243,242,239,.1), Poppins/sans-serif.
Quote type is clamp(21px,1.85vw,28px)/1.65, weight 400, tracking -.018em;
21px below 1000px and 20px/1.7 below 760px. Author name is 14px/500, title 12px.

The min(88%,1240px) container has an open split quote/voice grid at desktop.
Below 1000px the heading stacks. Below 760px, the five 220px-wide selectors
become a horizontally scrollable row above the quote, with automatic horizontal
centering of the selected voice. All quotes share one grid cell; inactive quotes
retain layout but are visibility:hidden, pointer-events:none and aria-hidden.
The longest determines reserved height: no collapsing stage during selection.
Quote-area minimum is 330px desktop, 380px phone. There are no enclosing panels,
shadows or new portraits. Arrow buttons are 44x44px; playback is a 44px pill.
Focus is a 2px cyan outline with 4px offset; selected voice gets a cyan hairline.

Manual reading is default. Voice and previous/next selection stop playback;
previous/next wrap around. Optional playback advances after max(10000ms,
quote.length*65ms), only when 25% of the section is visible, document is visible,
mouse hover/focus are absent and reduced motion is not requested. Suspending a
gate preserves opt-in; removing it starts a fresh full reading interval.
The quote reveal uses 400ms opacity, inset clipping and 8px offset with
cubic-bezier(.16,1,.3,1); selected rule uses 450ms. Reduced motion removes
playback, zeroes quote duration and CSS transitions, and centers voices instantly.
Native buttons expose aria-pressed and meaningful labels. Inactive quotes are
hidden to assistive technology; the manual live region is polite/atomic, off
while playback is opted in. All five original literary excerpts and attributions
are preserved. Visible disclosure identifies samples, not client reviews.
Replace them with authentic approved feedback before using this as client proof.

## Verification and disposition

Independent finish reviewer: ship, no required component corrections.
Production build, component ESLint and diff check pass; detector returned [].
Live checks: no local overflow at 1440,1280,900,390,360px; author selection,
keyboard Next and Play/Pause work. Runtime timing gates/reduced-motion are
documented from source, not separately live-tested. Reviewer assessed source
and screenshots; no independent screen-reader test was performed.
Proofs: .impeccable/review/testimonial/testimonial-{desktop,laptop,tablet,mobile,user-360}.png.
These captures are development evidence, not shipped assets. No new shipping
rasters or dependencies. Original source is saved in the shared workspace at
work/testimonial-before-refinement.jsx for exact recovery.
# Superseded presentation

The current visual contract is in `testimonial-showcase.md`. The API integration and normalization described below remain valid; the single-quote/sidebar presentation, autoplay and fixed scrolling quote region are historical and have been replaced by a two-review showcase with inline expansion.

