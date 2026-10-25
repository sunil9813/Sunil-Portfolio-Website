# Project bloom

Current homepage refinement: .impeccable/button-bloom.md supersedes the oval anchor. The stem begins below the CTA's left side; mobile follows the outer gutter. Bloom has stronger text hierarchy, unboxed icons and reaches full bloom at 68% scroll progress. Original asset provenance and global design files remain unchanged.

Local homepage extension after ProjectConversation, before MoreContent. Experience mode: connect the visitor's project idea to Sunil's full-stack work. User explicitly requested the supplied Dialedweb MP4 composition and animation, with portfolio-specific text. Keep the incumbent dark canvas and typography. Reference: https://www.dialedweb.com/, bloom sequence section, not its KPI cards or sales claims. The supplied video is the visual authority, so no concept selection or generated comps are needed.

## Direction contract

THESIS: A branch blooming under scroll expresses an idea becoming a complete product.

OWN-WORLD: Inherit the homepage dark canvas, off-white Poppins lettering, purple source flowers, small inset interface/code icons.

STORY: Read “From your first idea to a full-stack experience.” while the branch opens; continue into the existing homepage.

FIRST VIEWPORT: One viewport, diagonal full-width branch, three centered text lines in the lower-left negative space. No added navigation or CTA.

FORM: User-pinned Dialedweb bloom section; no seed. Signature interaction: bidirectional scroll-scrubbed local image sequence plus sequential word emphasis. Mobile retains the whole branch above centered text. Reduced motion shows a complete flower and all text.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Asset provenance

90 source frames sampled across https://www.dialedweb.com/imageSequence/image1.webp through image300.webp. Locally resized to 1280×720 WebP, source URL embedded in every file's XMP. No reference site's text, branding, code, tracking or KPI claims are included. Assets are loaded only near the section. Decode cache is bounded and cleaned on unmount.

## Shipped design and behavior

ProjectBloom is mounted immediately after ProjectConversation and before MoreContent. The existing #13161c canvas is explicitly carried into the isolated section so the black-backed source frames blend cleanly with screen compositing. The full-width artwork follows the reference's diagonal silhouette. Inherited Poppins sets the three-line headline at clamp(30px, 3.25vw, 52px), weight600, line-height1.2 and tracking−.03em. The lower-left text occupies39% of the desktop width; small monitor/code icons sit inline. At760px and below, the whole branch is contained above centered text with a27–38px scale.

Framer Motion tracks the section from entering the bottom of the viewport to leaving the top. Scroll progress selects90 image frames in either direction and raises each word from55% opacity/7px offset to fully visible. Native scrolling remains in control. Reduced motion removes the canvas and shows the fully bloomed static frame with complete, stationary text. Imagery and inline icons are decorative; one labeled h2 supplies the complete accessible sentence.

IntersectionObserver activates sequence work within600px. At most3 requests run concurrently,7 neighboring frames are prefetched in either direction, and decoded images beyond12 frame indices are closed. Cleanup aborts requests, cancels the pending render and releases all decoded bitmaps. Missing frames retain the static poster. The sequence uses about1.3MiB of local assets, without runtime requests to the reference website.

## Finish verification

Independent reviewer disposition: ship; no material fixes. Both desktop1280×720 and mobile390×844 captures were valid and matched the user-pinned reference with the documented dark-canvas, copy and responsive adaptations. Section placement and absence of horizontal overflow were confirmed in the browser; no console errors were captured. Scoped ESLint, production build and git diff whitespace checks pass. Design detector returned no findings. Asset provenance scan:90 rasters,0 missing.

Evidence: /Users/gorkcoder/Documents/Codex/2026-10-06/ple/work/project-bloom-desktop.png and /Users/gorkcoder/Documents/Codex/2026-10-06/ple/work/project-bloom-mobile.png.

## Current connected homepage refinement

The homepage now shares an isolated, clipped wrapper with ProjectConversation. Bloom's source stem anchors beneath the stationary oval's lower-left tangent, with 12px hidden overlap; poster and canvas share uniform geometry. Scroll progress begins at the connected root. This supersedes the standalone placement description above for the homepage; standalone rendering remains available. Original sequence provenance, copy and loading behavior remain unchanged. No new assets, dependencies or global tokens were introduced; DESIGN.md and .impeccable/design.json remain unchanged. Current finish evidence and source-only verification limits are recorded in .impeccable/project-bloom-connection.md. Reviewer disposition: ship, no UI fixes.
