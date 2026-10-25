# BuildProcess botanical timeline — 2026-10-25

The user requested flowers in each stage and a redesigned animated timeline,
referencing https://mixdesign.dev/templates/blayden/index-demo-2.html.
This is a local section redesign within the existing homepage visual system.

Six connected floral milestones replace the task-bar sequencer. Desktop scrolling
advances the selected stage; buttons and left/right/Home/End keys also select a
stage. Mobile, short viewports and reduced-motion preferences use a static section
with direct stage selection. All six milestones remain visible in a three-column
mobile grid. The stage copy keeps its measured height during transitions.

The white anemone turns and settles once per stage change; the selection ring
travels along the six existing pastel stage colors. No continuous decorative
animation or new runtime dependency. The heading matches Expertise's 32px mobile /
clamp(40px, 4vw, 58px) desktop scale. The shared blue/copper background is inherited.

## Original flower asset

Built-in image generation tool; transparent PNG saved at
`public/image/home/process-anemone.png`. One reusable asset serves the primary
flower and all six milestones. The reference template's assets were not copied.

Exact generation prompt:

> Create a single original photorealistic botanical cutout asset for a dark developer portfolio process timeline. One exquisite ivory white anemone flower, fully open, viewed nearly face on with slight three-quarter tilt, delicate layered silky petals and a small charcoal center of fine stamens. A graceful short slender dark green stem curves downward with two small natural leaves. Studio botanical photography, luminous soft side light, beautifully detailed petal veins and natural irregularity, sculptural and elegant. Flower head fills top 75% of square composition, whole stem within bottom 25%, complete subject with 8% margin. Truly transparent background, clean alpha edges. No text, no logo, no vase, no ground shadow, no extra flowers. Neutral white petals suitable for subtle CSS color tinting.

## Verification

Production build and scoped ESLint pass. Inspected at 1280×720 and 390×844;
no horizontal document overflow. Direct selection and keyboard progression work.
Reduced-motion handling verified in source, not browser-emulated.

Pre-redesign component snapshots are preserved at
`/tmp/BuildProcess-before-botanical.jsx` and `/tmp/BuildProcess-before-botanical.scss`.
