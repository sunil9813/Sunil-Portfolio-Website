# Hero reference video adaptation

## Flower roadmap addendum

Hero refinement: opening headline has a neutral-gray second line and reduced-motion-aware text entrances. CTAs are 44px high with 13px labels and a subtle primary arrow interaction. The flower roadmap has a centered “Ideas take shape.” heading, a short introduction, wider annotations and curved monochrome connectors. Roadmap entrance now starts at .44, after introductory copy is hidden, to avoid competing text. White flower, selected surrounding-roadmap composition and approved gallery animation remain.

Monochrome refinement (2026-10-24): user requested black and white instead of purple. The flower roadmap now uses white connectors, neutral gray secondary copy and heading emphasis, and numbered markers that transition from charcoal to white with black numerals. Removed redundant short progress rules; descriptions align beneath milestone headings. Increased unreached milestone opacity for readability. Desktop and mobile preview checked; gallery and shared page theme are unchanged.

User-selected visual roadmap revision supersedes the chapter design below. At 900px and above, three visible milestone annotations surround the centered white flower; thin lavender SVG connectors draw with scroll progress. Heading sits upper left with clear branch separation. Below 900px, a centered heading and flower lead into three readable stacked milestones. Reduced motion keeps all milestones visible in normal flow. Existing descriptions, white flower treatment, dark canvas and rotating gallery remain. Desktop/mobile visual checks and scoped lint passed.

Chapter revision replaces the rejected all-visible roadmap: one active chapter sits beside the white flower, progressing at .44/.62/.80 through “It starts with an idea.”, “Connect every layer.” and “Ready to bloom.” Existing milestone descriptions remain. Framer Motion uses a 340ms clipped text entrance and shorter spatial exit; segmented progress below follows the scroll value. Reduced motion displays every description in normal flow. Mobile places the flower above the active chapter. Original rotating gallery and dark/lavender palette are preserved. Desktop/mobile captures and forward/backward chapter changes inspected; scoped lint passed.

Horizontal-roadmap revision supersedes the vertical list below: desktop heading and introduction sit at upper left, white flower occupies the upper right, and three equal roadmap columns span the lower composition. Slim connected progress rules and small lavender nodes replace filled number circles. Below 700px, each milestone becomes a compact two-column row below the flower and heading. Existing copy, palette, gallery background, frame animation and reduced-motion fallback are retained. Desktop 1280×720 and mobile 390×844 captures reviewed without overlap; scoped lint passed.

White-flower refinement: the hero art alone uses grayscale and 1.45 brightness, retaining the original frame sequence and petal shading. Lavender roadmap accents and the dark canvas remain. The heading scales from 32px on mobile to 56px on wide screens; intro text is 13px with a more generous heading gap. Milestones rise 6px and slide 10px into place while their markers scale from .88 to 1 as scrolling reaches each step. Reduced motion renders final positions. Gallery geometry, timing, and other sections are unchanged.

Approved Idea → Build → Bloom timeline accompanies the existing flower. Gallery background remains unchanged. At700px and above timeline sitsleft, flower right; below700px flower sitsabove timeline. Heading “Good ideas grow.” and shortintro introduce three numbered milestones. Timeline enters .36–.46 scroll; milestones emphasize at.44/.64/.84 and connectors fill between them. Lavender #c9b9ee extends existingfloweraccent; palette detector advisory is intentional and local. Reducedmotion displays all content and connections in normalflow.

Build, scopedlint, twoscrolltests passed. Fresh bounded desktop/mobile review passed /tmp/hero-timeline-refined-desktop.png and /tmp/hero-timeline-refined-mobile.png. Initialreviewer failed to initialize; replacement reviewer completed. Scoped documenter recorded these decisions without changing globalDESIGN.md.

## Current circular-gallery revision

Supersedes the black hero canvas and vertical gallery motion below. Original var(--home-canvas) restored. Four clockwise circular rings contain9/13/17/21 tiles with50/85/120/155-second base cycles and0/24/42/60-degree phases. Radii use min(.20vmax,280px), min(.385vmax,580px), min(.57vmax,880px), min(.755vmax,1180px). Rounded image windows turn with their orbit while photographs counter-rotate upright. Scroll velocity temporarily accelerates and expands the rings. Field extends64px upward to align with viewportcenter. DOM/CSS transforms, no added dependency. Header, othersections, hero copy and flower unchanged.

Scoped lint/build/two scroll tests passed; detector[]. Runtime measured inner ring82.2degrees in11.417seconds, matching7.2degrees/sec. Fresh bounded desktop/mobile/flower review passed; final center-alignment review confirmed no material regressions. Captures /tmp/hero-rings-desktop.png, /tmp/hero-rings-mobile.png, /tmp/hero-rings-flower.png. Scoped documenter recorded the model. This verifies matched geometry/timing, not pixel-exact rendering. Previous backdrop preserved in Codex workspace work/before-hero-gallery/HeroGalleryBackdrop-before-rings.jsx.

## Current full-reference hero contract — 2026-10-23

This latest request supersedes the earlier preservation of Poppins, lavender accents, and the original hero canvas documented below. Hero only: near-black #0a0a0a, system sans-serif matching the reference, near-white #fafafa heading at clamp(42px,5.84vw,84px), medium weight, 1.02 line height, -.025em tracking. At desktop 1440×800 the heading begins at242px (reference242.32px). Description max448px,16px/26px,#a1a1a1,24px heading gap; actions52px high with36px topgap, white primary and subtle outlined secondary. Existing shared navigation, portfolio context, UI8 imagery, and flower sequence remain. No play control.

Build, scoped lint, two scroll tests, and detector[] passed. Fresh reviewer passed desktop, mobile and flower captures /tmp/hero-reference-desktop.png, /tmp/hero-reference-mobile.png, /tmp/hero-reference-flower.png. This is bounded visual acceptance, not pixel-exact identity or verified video-motion equivalence. Scoped documenter recorded this contract; global DESIGN.md unchanged. Backup: Codex workspace work/before-hero-gallery/Hero-before-full-reference.jsx.

## Earlier revision history

Mode: Persuade. User supplied AI App Template.mp4 and https://rbp-ai-app-template.vercel.app/ and requested the same background/composition with the existing flower replacing the media during scroll. Existing copy, Poppins, dark canvas, lavender actions, navigation, UI8 thumbnails, and all other sections stay scoped out of replacement.

## Direction contract

THESIS: A moving image field frames the developer's introduction and gives way to the existing growing flower.

OWN-WORLD: Original dark canvas, lavender type and compact pill actions; dim rounded UI8 image planes.

STORY: Read Sunil's offer, explore projects or contact him, then scroll into the flower.

FIRST VIEWPORT: Centered two-line title in the upper-middle, supporting text and actions below; image planes travel behind a clear central mask.

FORM: User-pinned reference video, code-led. Staggered vertical image orbits replace the rejected horizontal rows: 28 image planes across seven columns, with eight planes across two columns below 700px. This is not a pixel-identical reproduction.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Implementation and assets

Native browser transform animation moves images upward with lateral drift and changing XYZ rotations. Cycles last 26–30.8 seconds with staggered phases. Loops pause offscreen, when the document is hidden, after scroll progress .46, and on hidden mobile tiles. Reduced motion leaves stationary art and a normal-flow flower.

A radial mask clears the central image field; below 700px, a wider radial mask protects the centered copy.

Scroll over a 210svh section lifts/fades the copy and scales the existing flower from .55 to 1 while revealing its existing WebP sequence. It reverses naturally. Hidden copy uses CSS visibility so its links are not keyboard stops. No playback control or new dependency.

Source and rights remain in hero-ui8-thumbnails.md; no new image assets. The original flower's provenance is project-bloom.md. This is a reference adaptation using UI8 thumbnails, not the reference site's licensed source or exact imagery. Global DESIGN.md remains authoritative.

Backups in Codex workspace work/before-hero-gallery/: Hero-before-video-match.jsx and HeroGalleryBackdrop-before-video-match.jsx.

## Verification

Two scroll-state tests, the production build, scoped lint, and diff whitespace checks passed. The detector ran once and returned `[]`. Desktop/mobile opening and flower-state screenshots are saved in the Codex workspace at `work/hero-video-review/`: `desktop.png`, `desktop-flower.png`, `mobile.png`, and `mobile-flower.png`.

Finish review: Ship after density and desktop title-clearance corrections. Both findings scored resolved; no material findings remain in the reviewed captures. This is a reference adaptation, not an exact reproduction. Static review does not certify animation smoothness. Documentation checked against implementation by the scoped documenter; global DESIGN.md unchanged.

Source/provenance is unchanged: existing UI8 thumbnails and existing flower; no new image assets.

### Vertical-orbit revision — 2026-10-23

Scoped lint, production build, and two scroll-state tests passed again. Detector returned []. Bounded screenshot/source review passed using /tmp/hero-desktop-new.png, /tmp/hero-mobile-new.png, and /tmp/hero-flower-new.png. Live loop timing and pixel identity were not independently certified. Existing project typography, content, dark canvas, CTAs, UI8 imagery and flower remain unchanged. Scoped documenter checked this update; global DESIGN.md unchanged.
