# NextSteps refinement — 2026-10-11

## Paired journey / capabilities refinement — 2026-10-17

Retains the approved apricot palette, header-sized CTA, original canvas, five visible steps and scroll-linked selection. The headline now caps at40px (32px phone), descriptions13px, step titles20px (18px phone). The intro's measured590px height stays sticky at88px on a1280×720 laptop; below680px viewport height it returns to normal flow. The diagram is capped at380px wide. This leaves navigation reachable on a13-inch-sized viewport.

A shared Motion reading surface follows the active step without moving paragraph text. Blueprint stages crossfade with short positional assembly; brief linework draws, application rows assemble sequentially, and API/release paths retain their staged connection motion. Reduced motion removes these spatial transitions. Section padding64/32px meets Feature's32/64px to create a64px inter-section gap; on phones48/24 meets24/48 for48px. No other section or global palette was changed.

Verified desktop1280×720 and mobile390×844: step3 click and step4 Enter update the selection/diagram; mobile step2 works; one reading surface is present. Both sections fit the viewport width. Contact action computes161.297×40px and keeps /contact. Scoped lint, production build, detector and diff checks pass. Reduced-motion path reviewed in source. Desktop preview: workspace work/next-steps-paired-desktop.png.

## Open journey refinement

User requested better design after approving apricot and header-sized CTA.
Preserve those exact choices, all copy and the five-step reading behavior. Replace
repeated full card borders with open numbered rows and fine separators. Stage
numbers now lead the sequence; small Feather icons sit alongside titles. The
current title/number/icon receive apricot emphasis without adding a new surface
color. Strengthen diagram geometry contrast and text, keep the persistent browser
frame and bounded stage animations. No images, dependencies or other sections
changed. Maintain the original transparent section on the dark homepage canvas.
Corrected selection handoff so a previous scrollend cannot release a newer
navigation request; manual-scroll interruption and the existing timeout still
release it. Production build, scoped ESLint, diff checks and layout detector pass.
Reviewed laptop 1280×800, intermediate 900×760 and phone 390×844 / 320×740.
No NextSteps overflow at 320px. The action remains 161.3×40px and routes to
/contact. Stage navigation exercises both click and Enter; reduced-motion
behavior remains the previously verified source path, not browser-emulated.

## Header-sized contact action

User approved apricot and requested the exact header button size for a 13-inch
Mac. Header measured 161.289×40px, padding 0 28px, font 12px/18px at weight 400.
NextSteps now uses the same dimensions (width rounded to 161.3px), typography
and padding. Remove the extra circular arrow so the CTA matches the header's
simple pill silhouette. Preserve its apricot finish, contact link, focus feedback
and section motion. Match the header's 48px height above its 1700px breakpoint.

## Warm apricot color refinement

User requested another color change. Replace lavender with the existing project
palette's warm apricot #eab997. Keep its dosage and roles unchanged: primary
action, heading emphasis, diagram connections, selected step, rail and focus.
CTA gradient uses pale peach #f8dfcd → apricot, with a lighter hover ramp.
No canvas, neutral panels, content, layout, animation or JSX changes.

## Lavender color refinement

User requested a color change. Replace the component's cyan accent with the
existing site's soft lavender #c3b7ee, scoped to NextSteps only. Apply it to the
heading, action, diagram linework, navigation selection, rail, active icons and
focus feedback. Keep dark canvas, neutral panels, text, layout and motion intact.
The beveled button uses a pale lavender ramp rather than cyan. No JSX changes.
Verified computed desktop colors, unchanged transparent section and unchanged
global cyan theme. Production build and diff whitespace checks pass. Desktop
and phone inspected. Accent/text contrast is above AA thresholds on the existing
canvas and panel; button dark text passes at the darkest gradient stop.

## Product-blueprint enhancement

Requested: more refined animation and a diagram. Preserve the prior journey,
copy, CTA, dark canvas and surrounding sections. The focal moment is now an
illustrative browser blueprint: brief → wireframe → milestone plan → connected
application → release. SVG geometry crossfades inside a persistent browser frame;
bounded line drawing explains the plan, API/data connections and release handoff.
Navigation and scroll position control the same diagram. No loops, canvas,
images or packages added. Reduced motion changes the diagram instantly. The
intro is not sticky on shorter desktop viewports so controls remain reachable.
Direct navigation aligns the selected milestone to the same 42% reading line
used by scroll tracking, rather than centering unequal-height cards. A temporary
selection lock avoids intermediate diagram flashes; wheel/touch/scroll keys or
scroll completion release it, with a bounded timeout fallback and full cleanup.

Verification: scoped ESLint, production build, diff whitespace and layout
detector pass. Reviewed at 1440×900, 900×760, 390×844 and 320×740. This section
has no overflowing children at phone sizes. Keyboard Enter and click navigation
exercise the plan, connected application and release states; contact stays at
/contact. Reduced motion reviewed in source (not browser-emulated).

## Prior refinement

Scope: NextSteps.jsx and NextSteps.scss only. Mode: Persuade. Retain the original
five stages, descriptions, launch/support details, contact route, Poppins typography,
homepage canvas and two-column journey composition. Other homepage sections are
unchanged. No images, dependencies, Three.js or factual claims added.

Direction: replace the decorative introductory scribble with a meaningful connected
five-step navigator. Keep the heading, contact action and journey map beside the
reading path on desktop, in normal flow on phones. A cyan heading accent and a
header-style, cyan material CTA reuse the existing visual vocabulary. Quiet slate
icons replace the unrelated multicolor tiles. Only the current reading stage receives
the stronger panel treatment; every stage remains fully readable.

Motion thesis: a connected thread follows the visitor through the five stages. The
vertical rail tracks actual milestone coordinates rather than equal-sized card
assumptions. The selected navigation node moves between stages and its connector
fills smoothly; the short current-title caption reveals through a bounded clip mask.
Supporting colors transition without moving readable paragraphs. No loops or
delayed content entrances. Reduced motion uses native instant navigation, static
rail visibility and immediate selection/caption changes, retaining quiet color feedback.

Implementation: scroll position selects the nearest milestone at 42% viewport height;
this is reading position, never a completed-project status. React state changes only
when the nearest stage changes. ResizeObserver updates the exact rail length and is
disconnected on unmount; resize listeners are removed. Native smooth scrolling
supports direct stage selection. Buttons expose aria-controls and aria-current, use
44px targets and inherited visible keyboard focus. Scroll changes are not aria-live.

Verification: production build, scoped ESLint, diff whitespace check and layout
detector pass. Desktop 1440×900, intermediate 900×760, phone 390×844 and compact
320×740 reviewed. Direct 05/03 selection and keyboard 01 selection pass. The CTA
still points to /contact. NextSteps has no overflowing children at 320px; the page's
325px width is caused by the existing BeyondJustCode/beyond-reel section, out of
scope. The section background is transparent over the unchanged homepage canvas.
Reduced-motion behavior reviewed in source, not emulated in the browser.
