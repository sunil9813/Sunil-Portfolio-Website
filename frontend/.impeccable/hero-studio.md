# Hero studio surface brief

## Overview
Scope: homepage Hero only, within the established homepage identity.
Mode: Experience; visitor actions are project exploration and contact.
Three interwoven particle tori, circuit contours, traveling signals, and a central wireframe application core express a connected MERN product.
Copy names Sunil B.K, MERN development, and the portfolio's projects, courses, and practical resources.
Preserve portfolio facts, existing routes, and surrounding sections. The hero is transparent and inherits the existing page background.

## Colors
Inherit Home.scss: canvas #13161c, ink #f3f2ef, muted #adb3bf, accent #92d8df, line rgba(243,242,239,.1).
Sculpture and controls: Interface/React #92d8df; Systems/Node.js #f3f2ef; Data/MongoDB #dfb28a.
The warm data color belongs to this sculpture and its control.

## Typography
Inherit Poppins, sans-serif from the base reset.
Three heading lines: Ideas, designed. / Systems, built. / People, first.; final line uses cyan.
Desktop display clamp(48px,5.15vw,74px), weight 500, line-height 1.14, tracking -.035em.
At <=1100px: clamp(38px,5.05vw,56px); <=760px: clamp(38px,10.2vw,64px); <=380px: clamp(32px,10vw,38px).
Supporting copy: max 46ch, clamp(15px,1.15vw,17px), line-height 1.8; mobile 14px and 39ch. Name weight 600.

## Layout
Desktop uses a 1fr / 1.06fr grid with copy left and sculpture right; 36px gap.
Hero padding clamp(52px,5vw,76px) 0 30px; minimum composition height 560px.
Square sculpture has a maximum width of 570px. Foundation has a top rule, signature, and layer controls.
At <=760px the composition stacks, with 72px top padding and artwork following the actions.
Mobile foundation stacks the signature above the three layer controls.

## Elevation & Depth
Flat charcoal surface. Perspective projection, depth sorting, and particle light/size create depth.
Native 2D canvas draws 4,608 particles over three tilted torus surfaces, with no added dependency. Projection buffers and contours are allocated once and reused.
Three CSS elliptical rings provide a fallback when the canvas context is unavailable.

## Components
Hero.jsx owns copy, project/contact links, courses/notes links, profile identity, pause state, and toggleable active layer.
Both hero actions reuse the header's tertiary-button class with scoped color overrides, 32px pill corners, 1.5px edges, inset bevels, and at least 54px height. Navigation remains semantic links, not buttons nested in links.
Primary CTA, Explore my projects, uses an icy cyan #d1f3f3 to #91d2d8 material finish with #152e34 text and integrated animated arrows. Mouse movement produces a bounded 3px response without React state updates.
Secondary CTA, Let's build together, uses a dark champagne #34302c to #242220 finish, #ead3ba text, and #74614d edge. Hover lifts it slightly and moves the arrow diagonally.
Both use a restrained hover/focus light sweep; reduced motion disables spatial effects. Below540px both fill the available width in a vertical stack. Inherited keyboard focus remains visible.
Layer selection updates an aria-live explanation beneath the sculpture. Mobile layers occupy three equal grid columns without redundant trailing arrows.
React, Node.js + Express, and MongoDB callouts identify the three sculpture layers. Layer controls use consistent Feather icons.
Layer controls highlight a torus; selecting the same layer clears the emphasis.
Controls expose aria-pressed. The section has a labelled h1 and the decorative canvas is aria-hidden.
Inherited focus-visible outlines use 2px cyan with 5px offset.
HeroSculpture.jsx owns geometry, pointer response, perspective rendering, resizing, visibility, and cleanup.
Non-touch pointer movement adjusts rotation. Pause freezes rotation while layer selection stays available.
Reduced motion uses a static sculpture, immediate layer changes, and no spatial entrances.
Offscreen (intersection threshold .05) and hidden documents suspend frames; settled static scenes stop scheduling.
Canvas width <600px targets 30fps and DPR <=1.5; larger canvas targets 60fps and DPR <=2.
HeroLaunch.scss owns scoped layout, responsive rules, states, fallback, and entrance animations.
Entrances: masked heading lines 900ms with 100ms spacing, copy/actions 850ms with brief delays, sculpture 1100ms. Canvas layers converge into one connected sculpture over 1300ms, using exponential ease-out. Reduced motion presents the assembled state immediately.

## Verification
Targeted ESLint and production build passed. Browser checks: no overflow at 1440px, 900px, 390px, and 320px; keyboard layer selection and pause/resume pass. No browser console errors recorded.
The original homepage background remains rgb(19,22,28); the hero has no explicit background fill.
Static captures do not establish smoothness on every physical device.
Desktop: /Users/gorkcoder/Documents/Codex/2026-10-06/ple/outputs/hero-header-style-desktop.jpg
Mobile: /Users/gorkcoder/Documents/Codex/2026-10-06/ple/outputs/hero-header-style-mobile.jpg
