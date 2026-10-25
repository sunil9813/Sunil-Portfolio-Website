# UI8 thumbnail hero background

Mode: Persuade; scoped refinement, not a new design system. User explicitly requested UI8 product thumbnails and closer matching of the floating-tile background at https://rbp-ai-app-template.vercel.app/. Retain current hero copy, dark #13161c surface, lavender, actions and scroll-to-flower behavior; no playback controls or other homepage edits.

## Built direction

Twenty irregularly placed square-ish tiles with individual scale, rotation and 3D tilt, clipped at viewport edges. Dark images, an elliptical center clearing, and dimmed lower interior tiles preserve readable copy/actions. Eleven unique public product thumbnails replace three repeated desk photographs. Five tiles remain below 700px. Following the user's renewed reference request, tiles now follow bounded 24–37 second orbits with changing perspective, using browser-native animation without React frame updates. Rounded corners are 20px on mobile and 24px on desktop, matching the supplied reference. Loops pause offscreen, on hidden tabs, above scroll progress .46, and for desktop-only tiles below 700px. Reduced motion retains stationary art. The original hero/flower behavior and action dimensions are unchanged.

This bounded-motion implementation supersedes the reverted traveling-field implementation described in hero-ui8-motion.md. It is a visual adaptation of the reference, not its proprietary Three.js source. The exact pre-change backdrop is preserved in work/before-hero-gallery/HeroGalleryBackdrop-before-continuous-motion.jsx in the Codex workspace.

Source implementation: src/screen/home/HeroGalleryBackdrop.jsx. Previous version backup: /Users/gorkcoder/Documents/Codex/2026-10-06/ple/work/before-hero-gallery/HeroGalleryBackdrop-original-photos.jsx.

## Third-party image provenance and limitations

Observed directly on https://ui8.net/ on 2026-10-20. Public 604×420 WebP product thumbnails, loaded from https://images.ui8.net/product/ (no kit source or paid downloads accessed). IDs and exact filenames live in the photos array. Creators retain rights. These are decorative third-party product references, NOT Sunil's shipped projects, endorsements, or purchased assets. User requested these thumbnails for this preview. No commercial reuse license has been verified or acquired: confirm permissions before public deployment. Attribution is not a license.

- Fruitopia — Pixel Library — 697ec61ebb6c8a00338c0993/604_420_1.webp
- Rebound — SomeHow.Studio — 6acded8b8d94c700338a340d/604_420_1.webp
- Tempo — SomeHow.Studio — 6acb30424d93eb003383fde1/604_420_1.webp
- Instrument — UI8 — 6acdf3f9fb125c0033ad8483/604_420_2.webp
- Cushion — Moyin — 6a96163a75bf2600332c7067/604_420_1.webp
- Vaulta — HeyGar — 6ac98ada5267f500438ff412/604_420_1.webp
- FlyStudio — Natalia Ryasnyanskaya — 6aca6268584cfa0039370558/604_420_1.webp
- PlanIQ — Pixel Library — 690ccc6634a235003345e8d7/604_420_1.webp
- Keepsy — ibraadesign — 6ac129295c5ed1003909ee6c/604_420_1.webp
- Relay — JMJ Studio — 6ac34d13c25f37003597fe24/604_420_1.webp
- Oláq — Podro Supply — 6ac33ec825d0560039295b41/604_420_1.webp

Remote images depend on UI8 CDN availability and visitor network access. referrerPolicy=no-referrer; failed requests fall back once to the existing original responsive.jpg concept image, whose original prompt is in public/image/home/story-editorial/README.md. The thumbnails are decorative, aria-hidden, noninteractive, empty-alt and cannot intercept CTA input.

## Verification

Scoped ESLint, production build, two Node scroll-state tests and git diff --check pass. All twenty remote image loads were verified, with no mobile horizontal overflow. One detector pass returned no findings before the final mobile-only position adjustment; it was not rerun within the review budget. Fresh finish review inspected all seven captures in /Users/gorkcoder/Documents/Codex/2026-10-06/ple/work/hero-ui8-review/ (desktop, mobile, tablet, wide, two flower states and reference): Quality Pass; Fidelity Pass; Functionality Pass; no material findings; Disposition Ship for local preview. Reduced-motion behavior was source-reviewed only, without runtime emulation. Public reuse permission remains unresolved and has been communicated; this remains a local preview. Global DESIGN.md/design.json unchanged. This brief supersedes the asset/placement description in hero-gallery-scroll.md only; its retained scroll/flower implementation remains authoritative.
