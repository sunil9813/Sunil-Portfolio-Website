# Hero gallery → bloom

## Scope and direction

Mode: Persuade. Scoped refinement of the existing home hero; retain the incumbent design system and all lower homepage components. User reference: https://rbp-ai-app-template.vercel.app/ and supplied screenshot. Reference-inspired spatial composition, not copied premium implementation.

Preserve Poppins, original #13161c canvas, lavender #c9b9ee emphasis, current headline and MERN introduction, /project and /contact routes, and 40px actions. No playback controls, profile, signature, technology list, extra resource links, flower caption, or connector.

The first viewport presents tilted development-themed photo cards around a clear centered headline. One scroll-driven sequence disperses/fades those cards while revealing and opening the existing flower below the actions. The copy lifts 100px without scaling controls. The sticky stage occupies the viewport below the 64px header; section height is 190svh. Flower occupies the lower 40% of the stage. Four cards remain at mobile widths. No autoplay loop.

Reduced motion uses stationary decorative cards and a fully open flower in normal document flow, without a sticky scroll journey.

## Assets and truth

Reuses workspace.jpg, planning.jpg, responsive.jpg from public/image/home/story-editorial. These are original generated concept photographs illustrating development practice, not evidence of shipped customer work. Original prompts/provenance: public/image/home/story-editorial/README.md. No new bitmap assets or dependencies. Avoid expanding use of UI8 screenshots whose license is unconfirmed. Existing 90-frame flower provenance and loader remain unchanged; see .impeccable/project-bloom.md.

## Implementation

src/screen/home/Hero.jsx, HeroGalleryBackdrop.jsx, heroScrollState.js and heroScrollState.test.js. Scroll state is pure, bounded, and reversible; spring smoothing wraps actual scroll progress. Gallery clears by .45; flower fades in over .22–.5 and completes opening by .85. Frame cache/abort/offscreen safeguards remain owned by ProjectBloom.

Previous Hero.jsx backup: /Users/gorkcoder/Documents/Codex/2026-10-06/ple/work/before-hero-gallery/Hero.jsx.

## Verification

Production build, scoped ESLint, two Node scroll-state tests, git diff --check and one final detector pass succeed. Actual keyboard scrolling inspected desktop and mobile; no horizontal overflow mobile/wide. Captures: /Users/gorkcoder/Documents/Codex/2026-10-06/ple/work/hero-gallery-review/{desktop-start,desktop-flower,mobile-start,mobile-flower,intermediate,wide}.png. Viewports 1280×720,390×844,820×1000,1728×1117. Reduced-motion fallback and pointer feedback source-reviewed only; reduced-motion runtime was not emulated, and there is no measured FPS guarantee. Fresh finish review closed after inspecting all six captures: Quality Pass; Fidelity Pass; Functionality source-supported; Material findings None; Disposition Ship. DESIGN.md and design.json intentionally unchanged.
