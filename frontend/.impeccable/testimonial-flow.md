# A moving collection of voices

Local redesign, Persuade. Inherit homepage dark canvas and compact controls. User requested a wholly new animated design and approved ten labeled backend demo records.

## Direction contract

THESIS: Two flowing rows turn individual customer perspectives into an explorable collection.

OWN-WORLD: Original charcoal background, compact slate quote panels, white copy and restrained cyan controls. Names and initials bring human detail without fabricated portraits.

STORY: Scan voices, pause to read, open full feedback, distinguish demonstration content from customer endorsements.

FIRST VIEWPORT: Left-aligned heading, right-aligned pause control, two offset rows traveling in opposite directions, then genuine rating summary and all-review action.

FORM: Code-led local component. Native scroll positions drift slowly and reverse at row boundaries. Hover, focus, touch, hidden document and offscreen section stop movement. Reduced motion uses manually scrollable rows. Max24 records, no duplicate cards or WebGL.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. Local documentation only, no new raster assets.

## Data

Ten fictional reviews are explicitly labeled in names, content and isDemo=true. Customer aggregates exclude demos. Seed is additive and idempotent; existing records are preserved. Review-detail links target anchors on the complete feedback page.

## Shipped implementation

One to three reviews use one native scrolling row; larger collections alternate across two rows, with a maximum of 24 unique cards. The second row starts at its far end. The original canvas and existing --home-* color tokens remain unchanged; panel and transparent rows distinguish the layers. No new raster assets or global theme tokens were introduced.

Desktop: 56px section padding, 34–48px heading, 14px supporting copy, 360px cards with 24px padding and 16px corners/gaps. At 700px and below: stacked heading/controls, 40px section padding, 82vw cards with 20px padding, 34px heading, 13px supporting copy, and 15px quotes. Controls retain a compact 40px minimum height.

Rows drift at approximately 23px/s and reverse at boundaries. Hover, focus, hidden document, and offscreen section suspend motion. Touch/pen and wheel interactions latch the pause state; Resume motion restores automatic movement. Reduced motion disables automatic movement and transitions. Native scrolling, focusable rows, and accent focus rings remain available.

The API request supports cancellation, a 15-second timeout, loading, empty, error, and retry states. Normalization sanitizes rich text, validates optional data, deduplicates records, and excludes private fields. Avatars fall back to initials. Quote excerpts link to the full review; hash navigation selects the matching feedback pagination page.

Demo records carry visible badges, a collection-level fictional-preview notice, example-rating labels, and backend markers in names, content, and isDemo. Demo records do not contribute to customer rating summaries. The deterministic ten-record seed is additive and idempotent, preserves existing records, and refuses a non-demo ID collision.

## Finish record

Disposition: ship. Fresh finish review reported no material findings across the required 1280px, 390px, and 360px captures in .impeccable/review/testimonial-flow/. The scoped detector returned no findings.

Production build, scoped lint, seven data tests, and server rendering with 0/1/1000 input records passed. Rendering is capped at 24 cards. Browser checks confirmed opposite-direction movement, pause behavior, and navigation to a review on the second pagination page. The seed inserted ten records, then zero on rerun; the API returned thirteen records, including ten labeled demos.

Documentation handoff completed from implemented source. This brief describes a local surface, not a replacement global design system.

## Framer Motion refinement

Focal motion: preserve the two opposing review lanes while replacing the manual animation-frame loop with Framer Motion's numeric animate playback. Continuity: stopping preserves the native scroll position; resuming and resizing create a new journey from that position. Feedback: compact spring press responses on pause and all-review controls, plus a brief play/pause icon transition. Budget: one active playback per overflowing row; cancel on pause, hover/focus, hidden document, offscreen section, or unmount. Existing reduced-motion alternatives, content, colors, spacing, and backend data stay unchanged. Uses the existing framer-motion dependency without installing packages.

Verification: production build, scoped ESLint, and seven data tests passed. Browser observations confirmed opposing scroll positions, an unchanged position while paused, and continued travel after resume. Desktop and mobile captures showed the existing layout retained. Scoped detector returned no findings. This is a narrow animation refinement, not a new visual-world review.
