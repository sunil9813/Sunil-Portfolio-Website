# Testimonial spotlight implementation addendum

Scope: the accepted screenshot-led split-card carousel in `src/screen/home/TestimonialSpotlight.jsx`, its SCSS and `testimonialSpotlightData.js`. Direction remains in `.impeccable/testimonial-spotlight.md`. The completed refinement received a fresh finish-review disposition of **ship**, with no material fixes requested.

## Preservation and visual scope

`Home.jsx` retains the commented legacy Testimonial import/render and mounts TestimonialSpotlight. `Testimonial.jsx` and `Testimonial.scss` remain byte-for-byte identical to the pre-addition backup at `/Users/gorkcoder/Documents/Codex/2026-10-06/ple/work/before-spotlight-testimonials/`. The pre-refinement spotlight is backed up at `/Users/gorkcoder/Documents/Codex/2026-10-06/ple/work/before-testimonial-enhancement/`.

The original dark homepage, Poppins and cyan shared tokens remain inherited; root DESIGN.md is unchanged. All geometry, computed hues and motion below belong to this carousel. The refinement keeps the approximately 820px desktop split card and 34% portrait column, increases its minimum height to 420px, and uses 400px on mobile. Section padding is `clamp(48px, 5vw, 72px)`, with 30px heading and 20px footer gaps; mobile overrides these gaps to 26px and 16px.

Portraits use larger rounded crops: 148px wide with 16px corners on desktop, 104px at 761–1000px, then 76px with 12px corners below 761px, 64px at 440px and below, and 56px at 350px and below. Portraits stay beside the readable quote on mobile. A decorative quote mark, receding side previews and the active-review accent strengthen the existing composition.

The compact full-review link keeps a 40px minimum height on desktop/mobile (48px at 350px and below). Its dark arrow disc exchanges two arrows on hover/focus and scales the link to .98 on press. The 44px previous/next buttons use the current review's accent on hover/focus and scale to .94 on press. The active pager dot stretches horizontally and takes that accent. The sidecar's two component examples reflect these local patterns only.

Each ordered review retains a deterministic hue: `(270 + index × 137.50776405) mod 360`, with accent `hsl(hue 68% 77%)` and wash `hsl(hue 66% 35% / .65)`. These do not replace shared homepage colors or repeat on a three-color cycle.

## Data and interaction

The existing public testimonial service and normalization remain unchanged, with no backend or record mutations. Real records precede explicitly labeled fictional demos; only real supplied ratings contribute to the customer summary. The inspected API snapshot contained three real records with uploaded photos and ten fictional demos without photos. Counts, ratings and content remain dynamic. Missing or failed photos use the record's initials; avatar images remain existing API URL references. No new raster assets or dependencies ship.

Long quotes are cut within 240 Unicode characters at a word boundary where possible, then receive an ellipsis. Full-review links target `/customer-feedback#review-{id}`. Previous/next, pager buttons, swipe and focused-carousel ArrowLeft/ArrowRight navigate with wraparound; Home/End select first/last. Direct horizontal dragging moves the rail under the pointer while preserving vertical scrolling, then returns it with a spring (stiffness 260, damping 30). There is no autoplay or continuous effect.

Card transforms use a finite 0.65s transition with easing `cubic-bezier(.16, 1, .3, 1)`; opacity uses 0.3s. Receding previews add restrained perspective, while portrait and quote settle within the same manual sequence. Long jumps use presence direction data and an object exit with a finite transition, so outgoing slides unmount. After settling, this multi-record carousel has exactly three cards and one active card. Exiting slides and previews are inert and hidden from assistive technology; position changes are announced politely. Height measurement selects the exact current `data-review-position` and active card.

Reduced motion makes positional, scale, rotation and depth changes instant, retains a 0.12s opacity transition, makes height changes instant, suppresses direct-drag movement and CSS press/arrow motion, and returns the rail immediately. These branches were inspected in source; runtime reduced-motion emulation was not performed.

Loading exposes a status message and skeleton, errors provide retry, and empty results provide an honest waiting message. Requests retain abort cleanup and a 15-second timeout. Loading/error/empty states were inspected in source only.

## Verification record

The refinement's production build, targeted lint and all 11 Node tests passed. Runtime checks covered keyboard Home/End, a direct jump from index 0 to 4, direct mouse dragging, settled card count/activity and exact current-card height measurement. Overflow was zero at 1470×744, 1280×720 and 390×844.

The final detector pass returned seven advisories: secondary rating text `#d4d8df`, full-review hover `#fff`, inactive dots `#69717f`, three local 99px pill radii and the 12px mobile portrait radius. These are intentional component-local treatments, not global tokens. The earlier detector result `[]` belongs to the first spotlight version only.

Current review captures are `.impeccable/review/testimonial-refined/desktop.png`, `mobile.png` and `user-1470.png`. Earlier captures under `testimonial-spotlight/` document the first version. These are review evidence rather than shipped imagery; the user's Specify screenshots informed the local composition, and reviewer photos retain their existing API provenance.

Not canonized: live average/counts, API record contents, carousel geometry, per-review hues, local interaction patterns or new brand language are not global design defaults.
