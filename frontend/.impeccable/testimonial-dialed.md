# Dialedweb testimonial adaptation

Local homepage presentation replacement, Persuade mode. User pins https://www.dialedweb.com/ testimonial section. Preserve dynamic API, original dark canvas, factual reviews, labeled fictional demos, full-review links and loading/error/empty handling. Do not import reference customers or social identities. Former quote/selector design is superseded.

## Direction contract

THESIS: Customer voices together in a horizontally browsable row matching the pinned reference.

OWN-WORLD: Existing dark canvas and Poppins; off-white type, rounded dark cards, subtle grid lines, circular avatars and small review-link pills.

STORY: Read multiple reviews, drag or navigate to more, open full feedback or start a conversation.

FIRST VIEWPORT: Centered heading/description; three complete cards and a fourth peeking on desktop; arrows and slim progress track below. Phone shows one card plus the next edge.

FORM: User-pinned reference, no seed or generated comp. Native touch scrolling, mouse drag, smooth arrow navigation, bounded card arrivals and reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

The small Testimonials label,25px corners, grid and soft bottom lighting are pinned-reference features. Missing portraits use honest initials; review-link pills use existing full-review anchors. No new rasters or backend writes.

## Implemented design

Centered heading, horizontal rounded dark cards, circular avatars, review-link pills, faint grid lines, soft bottom lighting, slim progress track and circular arrows reproduce the reference structure. Existing Poppins and the original #13161c canvas remain. Missing or failed portraits use initials. Full-review anchors replace unavailable social URLs. Fictional reviews retain visible demo labels and are excluded from the customer rating summary. Excerpts use up to200 Unicode characters with ellipses and full-feedback links. Taller cards accommodate actual content and disclosures.

## Responsive layout and motion

At1280px, three complete cards plus a fourth edge are visible; at390px, one card plus the next edge establishes horizontal browsing. Breakpoint760px narrows gutters and increases arrow controls. Both inspected widths have no page overflow. Cards arrive once with28px vertical travel,600ms duration and stagger capped at a four-card cycle. Reduced motion removes arrival travel, smooth scrolling and control transitions. Native touch scrolling, mouse dragging, snapping, arrow buttons and keyboard Home/End/left/right support browsing without autoplay.

## Verification and finish

Next advanced320px; End reached the3443px maximum and disabled Next; Home returned to the start. A290px mouse drag scrolled the deck and release cleared its dragging state. Browser console errors were empty. Seven normalization tests and SSR loading/error/empty/one-record/1000-record checks passed, including excerpt limits, full-review anchors and real-only ratings. Scoped lint, production build and diff checks passed. The detector's decorative-grid advisory is the explicitly pinned reference detail recorded above.

Independent review disposition: ship, no material fixes. Documentation handoff completed for this scoped surface; no global brand documents were created. Evidence: /Users/gorkcoder/Documents/Codex/2026-10-06/ple/work/testimonial-dialed-desktop.png and testimonial-dialed-mobile.png; reference dialed-testimonial-reference.png in the same directory. Previous component source is preserved in /Users/gorkcoder/Documents/Codex/2026-10-06/ple/work/before-dialed-testimonials/.
