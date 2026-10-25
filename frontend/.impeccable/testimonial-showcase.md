# Customer voices showcase

Local homepage redesign, Persuade. Inherit the dark canvas, typography, cyan accent, compact controls and API data. User rejected the moving rows and requested a genuinely different design with animation.

## Direction contract

THESIS: Give each person room to be heard; replace the moving card wall with a quote-led conversation.

OWN-WORLD: Open charcoal canvas, white oversized quotation, cyan selection surface, structural dividers, compact round navigation.

STORY: Read a perspective, choose another person, open complete feedback. Demo content remains explicitly fictional.

FIRST VIEWPORT: Two-line heading and short introduction; broad quote left, four-person selector right; attribution and navigation below the quote; collection link at the close.

FORM: Code-led local replacement. Shared selection highlight glides between people; directional quote exchange responds to navigation. No autoplay. Responsive stacked quote and two-column selector. No seed: local component inherits established identity.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. Scope documentation to this component; no new raster assets.

## Implementation and finish

Latest compact refinement (2026-10-17): supersedes the lavender palette below with muted teal actions/selection (#9ccfc5), warm ivory text (#eee9df), champagne ratings (#dec69e), and a deep teal selected surface (#1d302f). Original canvas remains untouched. Heading is capped at 40px (32px mobile); quotes at 27px (22px mobile). Selector rows are 68px, controls remain 40px, and the quote area has less reserved space. Framer Motion arrivals are 0.32s with 0.04s detail follow-through; reviewer buttons acknowledge pressing and selected arrows/avatars transition with the highlight. Reduced-motion alternatives remain intact. Desktop 1280px and mobile 390px captures verified, including no mobile horizontal overflow and mouse/keyboard reviewer selection. Production build, scoped lint, seven data tests, SSR edge cases, and scoped detector passed. No review data or backend changes.

Palette/motion refinement: retain the original section canvas and scope ivory text (#f2eee7), lavender selection/actions (#c7b6ed), and soft-gold ratings (#e6c48b) to this section. Muted plum selection surface replaces the full cyan fill; avatar, border, icon and aria-pressed continue to identify selection. Compact spacing and 40px controls are retained. Quote exchanges use a 0.16s exit, 0.4s arrival with 0.06s quote/attribution follow-through, and a brief counter transition. Motion remains user-triggered and reduced-motion aware. These implemented local roles supersede the original cyan-specific description above without changing the global homepage theme.

Refinement verification: production build, scoped lint, seven data tests, SSR edge cases and scoped detector passed. Desktop/mobile captures checked; reviewer selection reached the correct quote. Measured contrast ratios: body 15.66:1, secondary 8.58:1, selected secondary 8.02:1, action text 9.78:1 and stars 10.90:1 against their rendered surfaces. This is a scoped polish pass, not a new whole-surface review verdict.

Desktop pairs a broad quote with a 300px four-person selector. At 700px and below, the selector moves beneath the quote in two columns. Quote containers grow with content. Existing --home-* theme variables, typography, dark canvas and compact controls remain in place; no global identity changes or raster assets.

Excerpts use up to 330 Unicode characters, preferring a word boundary, with full-review links. Navigation wraps and advances the visible group every four people. There is no autoplay. Framer Motion drives directional quote exit/enter at 0.32s and the shared selection highlight at 0.35s; reduced motion removes those durations and CSS transitions. Focus, pressed selection, live review status and single-review disabled states are supported.

Loading, retry, empty, and avatar fallback states remain supported. Fictional demos are labeled and excluded from the customer rating average. Backend data is unchanged in this redesign.

Finish verdict: SHIP. Fresh review found no material issues at 1280px, 390px and 360px, captured in .impeccable/review/testimonial-showcase/. Production build, scoped lint, seven data tests and SSR 0/1/1000-record cases passed, including bounded one-quote/four-person rendering. Browser checks covered selector group 4 to 5, wrapping 13 to 1, and long-quote container growth at 360px. Scoped detector returned no findings. Documentation handoff completed against the built component.
