---
name: Sunil B.K / GORKcoder homepage
description: Inspected inherited homepage visual tokens; individual sections retain their own composition.
colors:
  home-canvas: "#13161c"
  home-panel: "#191e26"
  home-ink: "#f3f2ef"
  home-muted: "#adb3bf"
  home-accent: "#92d8df"
  home-line: "rgba(243, 242, 239, .1)"
  home-panel-hover: "#202731"
typography:
  headline:
    fontFamily: '"Poppins", sans-serif'
    fontSize: "clamp(32px, 3.7vw, 56px)"
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: "-.03em"
  body:
    fontFamily: '"Poppins", sans-serif'
    fontSize: "clamp(14px, 1.1vw, 16px)"
    lineHeight: 1.8
rounded:
  home-panel: "16px"
spacing:
  home-section: "clamp(48px, 6vw, 88px)"
  home-heading: "clamp(28px, 4vw, 52px)"
---

# Design System: Sunil B.K / GORKcoder homepage

## Overview

This captures the inspected homepage system in `src/pages/home/Home.scss` and the Poppins body family in `src/styles/base/_reset.scss`. It preserves the original dark canvas, existing typography and cyan shared accent confirmed in PRODUCT.md. It does not define a new brand identity or claim to catalogue every route.

**Key Characteristics:**

- Dark canvas with restrained tonal panels and muted supporting text.
- Poppins headings and body copy with fluid section spacing.
- Shared cyan actions and focus cues; section-specific compositions remain local.

## Colors

### Primary

`home-accent` is the shared pale cyan used by homepage actions, emphasis and focus outlines.

### Neutral

`home-canvas` is the homepage background. `home-panel` and `home-panel-hover` distinguish surfaces and interactive states. `home-ink` carries primary text; `home-muted` supports it. `home-line` supplies quiet dividers and borders.

**The Scope Rule.** Per-review hues belong to the testimonial spotlight and do not replace shared homepage colors.

## Typography

Poppins with a sans-serif fallback is inherited from the body. The extracted headline role describes shared homepage section headings; shared introductory copy uses the body role. Existing sections can have their own hierarchy: the hero and testimonial spotlight are not normalized to the shared section heading.

## Layout

The homepage container is `min(88%, 1240px)`, capped at 1240px. At 680px and below it becomes `calc(100% - 40px)`. Section and heading spacing use the fluid tokens above. Shared section headings switch to `clamp(30px, 8vw, 38px)` at that breakpoint.

## Elevation & Depth

Tonal panels, low-contrast borders and selective shadows provide depth. Individual sections own their shadow treatments; this document establishes no global elevation scale.

## Shapes

Inspected homepage panels commonly use the home-panel radius. Action shapes vary by section. Circular portraits and pill controls in the spotlight remain component-specific.

## Components

Homepage links and buttons retain the inherited cyan focus outline (2px, offset 5px); scoped components may supply their own color. Existing action dimensions and finishes remain section-specific.

The sidecar contains two self-contained examples from the implemented testimonial spotlight: its full-review link and next arrow. Their compact sizing and pill/circle shapes describe that carousel only. See `.impeccable/testimonial-spotlight-addendum.md` for its complete behavior and preservation contract.

## Do's and Don'ts

### Do

- Do preserve the original homepage canvas, Poppins and shared cyan tokens.
- Do keep section-specific geometry and accents scoped to their component.
- Do retain visible focus states and reduced-motion alternatives.

### Don't

- Don't make the spotlight's per-review colors global theme defaults.
- Don't replace existing homepage sections or typography as a side effect of carousel work.
