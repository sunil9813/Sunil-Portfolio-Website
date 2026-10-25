# Feature refinement — 2026-10-11

## Paired refinement with NextSteps — 2026-10-17

The four capability panels now share one structural frame and internal separators. CSS subgrid aligns the copy and diagram rows (all four copy blocks measure175px at1280px); phones stack with intrinsic rows. No fixed clipping height is introduced. The closing image-library row is open, with existing UI8 labels and assets preserved. Original canvas and compact controls remain.

MERN schematic now traces a warm return signal after the interface→API→data sequence; content preview lines render sequentially. All animation remains bounded, viewport/page-visibility gated and reduced-motion aware. Replay retains its keyboard interaction and observer remounting. Feature padding32/64px joins NextSteps64/32px to halve the former excess spacing between them; phones use24/48px. Existing headings, capability copy and routes are unchanged.

Verification: scoped lint/build/detector pass; desktop1280px and mobile390px layouts fit without section overflow. Paired desktop image: workspace work/feature-paired-desktop.png. This supersedes the separate-card composition from the preceding refinement below.

## Current refinement — 2026-10-17

This update refines the restored diagram-panel design; it does not reinstate the historical open-row redesign below. Mode: Persuade. All six capabilities, copy, image references and project route are preserved. Original homepage canvas remains transparent through this section.

Copy leads each panel in DOM and visual order. The lead pairs the explanation with React/Node/Mongo diagrams; four capability panels retain their paired desktop layout and stack on mobile. Consistent 32px desktop, 24px phone and 20px narrow-phone insets replace competing padding. Header spacing is 32px; heading caps at 40px and reaches 32px on mobile. The project action is 40px tall. Diagram areas use content-safe minimum heights rather than fixed clipped boxes. Image-library offset is removed so captions and attribution retain clearance. Teal, soft champagne and existing white/slate roles unify the diagrams without changing global tokens.

Motion follows the product: interface rendering, API connection and sequential database writes; architecture connections, milestone flow, device assembly and publishing preview remain bounded. The keyboard-accessible Replay diagrams control remounts each panel together with its visibility observer. Animations are gated by viewport, document visibility and reduced motion. Static copy no longer fades or moves on entry, and generic card hover lifts are removed. The new #features anchor resolves correctly.

Verification: scoped ESLint, production build and detector passed. Browser inspection covered 1280px desktop, 820px tablet, 390px and 360px phones. Keyboard replay activates feature-record-write; project link remains /project. Header computes to 40px and 32px margin at desktop; 360px copy and lead insets both compute to20px, action40px. No Feature descendants overflow. A pre-existing 2px page overflow was isolated to BeyondJustCode and left unchanged. Screenshots: workspace work/feature-refined-desktop.png and work/feature-refined-mobile.png. No new dependencies or raster assets.

## Historical versions

Status: reverted at the user's request. Feature.jsx and Feature.scss are restored
exactly to the recorded pre-refinement snapshot from 2026-10-11 04:43 UTC.
The directions below are historical, not the current shipped design.

## Confirmed replacement direction

User rejected apricot and the boxed design, then explicitly selected **Neutral
white** and **All capabilities visible**. Keep the established dark canvas,
Poppins and existing product facts. No new visual identity or global theme change.

THESIS: a capability index, not a grid of enclosing cards or hidden tabs.
OWN-WORLD: neutral white, existing muted slate, open space and quiet rules.
STORY: explain all six capabilities and preserve the project route.
FIRST VIEWPORT: heading and introduction; copy paired with the React/Node/Mongo
system; subsequent open rows give each capability a larger diagram.
FORM: user-pinned all-visible local component layout; no concept tournament.
MOTION: only bounded diagram connections and response, with static copy.

Remove enclosing panel fills, rounded containers and the 2×2 grid. Each capability
is an open two-column row on desktop and a stacked row on phones. White replaces
all apricot accents in Feature only. Keep the 161.3×40px action, now in the header's
neutral white treatment. Existing UI8 references become grayscale through CSS;
their original assets and disclosure remain. NextSteps is untouched.

## Superseded apricot draft

Mode: Persuade. User requested better Feature design using the preceding
component's primary color. Apricot #eab997 is scoped to Feature; the homepage
canvas and other sections remain unchanged. Preserve all capability copy,
diagram meanings, UI8 reference images/disclosure, and the /project action.

Composition: apricot heading emphasis; copy-first lead panel paired with the
connected React / Node / MongoDB illustration. Compact copy-and-diagram panels
replace the tall image-above-copy presentation on laptops. At intermediate
widths use one panel per row; phones stack copy above each diagram. Finish with
an open project-library row rather than another full enclosing card. Its contact-
style action matches the approved 161.3×40px pill dimensions.

Motion: retain bounded relationship animations inside visible diagrams, gated
by visibility and reduced motion. Remove repeated article fade-and-rise reveals
and generic hover lifts so readable content stays still. No new packages, media,
canvas or expensive effects. Existing reference imagery is not claimed as work.
