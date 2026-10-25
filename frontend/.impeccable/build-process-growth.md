# BuildProcess growth sequence — 2026-10-25

The user requested a seed-to-flower-to-picking story using the earlier musical
timeline and the hero's scroll-driven flower as motion reference. The section
retains its heading scale, shared blue/copper background and six stage colors.

## Motion

One Framer Motion spring drives both the horizontal task track and the botanical
artwork. Six original photographic states blend continuously as progress passes
between stages. The seed lowers toward the soil; subsequent stages grow into
view, ending with a hand holding the picked flower. Reverse scrolling reverses
the sequence. This is a layered six-state animation, not a generated video.

Clicking a stage or the previous/next buttons moves the same spring; keyboard
left/right/Home/End navigation works. Small screens and short windows use direct
selection without scroll pinning. Reduced motion renders the selected state
immediately. No loops or added animation dependencies.

## Generated artwork

Built-in image-generation tool. Saved asset:
`public/image/home/process-growth-stages.png` (1536×1024, alpha PNG).
Six cells form a 3×2 sprite sheet, cropped in CSS without modifying the source.

Generation prompt:

> Create an original photorealistic botanical animation sprite sheet: EXACTLY SIX square cells arranged in a strict 3-column by 2-row grid, no gaps, no dividers, no text, no labels. Overall landscape image aspect ratio 3:2. Every cell has fully transparent background and same locked camera, same scale and lighting. Each cell contains a tiny isolated oval island of textured dark soil near bottom at 86% cell height. Same white anemone plant across all cells, creamy white petals and charcoal center, desaturated sage leaves. Render as high-end realistic botanical macro photography, subtle studio sidelight; objects fully within their cells with 10% empty margins. Top row left: a clearly visible brown oval seed hanging just above soil, before planting. Top row middle: a tiny tender curved seedling emerging from the soil with two cotyledon leaves. Top row right: a young taller leafy plant with 4 small leaves, no bud. Bottom row left: mature slender leafy stem with a single closed pearly flower bud, centered. Bottom row middle: the SAME plant with one fully open beautiful white anemone flower, taking most of upper half of cell. Bottom row right: a farmer's realistic lightly weathered hand entering from right, gently holding and lifting the cut stem of the same open white flower just above the remaining small rooted plant and soil. No tools, no sleeves spilling outside cell, no pots, no environment, no white or black background. Precise equal 3x2 sprite grid for CSS frame cropping; no subject may cross a cell boundary. Keep plant rooted at horizontal center and soil at the same baseline in every cell. The six stages must read unambiguously as seed, sprout, leaves, bud, bloom, harvest.

Final cutout edit prompt:

> Remove ALL background pixels and all colored light halos from this botanical 3-column 2-row sprite sheet. Keep exactly the same six plant/soil/seed/hand subjects in exactly the same grid positions, scale, proportions, framing and lighting. Background between and around subjects must be completely transparent alpha=0, with no glow, no blur, no scenery, no colored mist, no opaque black or gray. Preserve realistic fine leaf edges and soil islands. Each subject isolated as clean product photography cutout. Do not change or rearrange objects. Do not add labels or borders.

The previous botanical version is saved in `/tmp/BuildProcess-before-growth.jsx`
and `/tmp/BuildProcess-before-growth.scss` for easy restoration.
