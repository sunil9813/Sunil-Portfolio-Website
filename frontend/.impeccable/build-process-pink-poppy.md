# BuildProcess pink poppy background — 2026-10-25

The latest user brief asks for the realistic tall pink flower in the supplied
Blayden screenshot, animated behind the readable timeline, with the original
six process diagrams restored. This supersedes the small foreground white-flower
sprite sequence. Other homepage sections are unchanged.

## Implementation

An original photographic poppy cutout is split into root, stem and crown layers
using CSS clipping. Framer Motion connects their reveals to the same spring as
the timeline: the seed lowers, roots extend downward, stem and side buds reveal
upward, and the crown unfolds. This is image-layer animation, not a Three.js
simulation or a video. Reverse scrolling reverses the sequence. Reduced motion
shows each selected growth state immediately without spatial movement.

The existing ProcessVisual component is restored, including the brief, journey,
wireframes, MERN architecture, testing and release diagrams. Diagram colors match
the active timeline stage. Mobile diagram labels are increased for legibility.
The timeline keeps its musical ruler and staggered clips, with larger labels and
a dark reading layer in front of the flower. The heading scale is unchanged.

## Artwork

Generated with the built-in image tool using the user-supplied screenshot as a
visual reference. It is original artwork inspired by that flower, not the exact
template asset. Saved at `public/image/home/process-pink-poppy.png`.
The seed reuses a cropped cell from `public/image/home/process-growth-stages.png`.

Exact generation prompt:

> Use the attached website screenshot ONLY as a reference for the pink flower's botanical species, realistic sculptural form, colors and translucent petal material. Generate an ORIGINAL single tall pink poppy plant isolated on truly transparent alpha background. Portrait 2:3 composition. Main open flower is large and faces camera slightly upward, occupying upper 0–35% of canvas, centered horizontally. Silky pale pink finely crinkled petals with rich magenta bases, dark plum ring of fine stamens and pale green spherical center, as realistic as the reference. The flower connects at y35% to a long gently curving olive green stem. One small pink closed bud branches right at y53%, another small bud branches left at y67%. Few delicate narrow leaves. Stem ends at y80%; below it, exposed fine ivory-brown branching ROOTS spreading downward occupy y80–97%, naturally connected to the same stem. No soil, no pot, no hand, no text, no other props. Entire plant within frame with 5% margin. Clean separate photographic cutout, absolutely no backdrop, no colored halo, no glow. Macro product photography with soft directional light revealing petal veins and fine stem hairs. A single coherent beautiful living plant, not a diagram or sprite sheet. The exact vertical division of bloom upper35%, stem35–80%, roots80–97% is essential for animation.

Previous component snapshots: `/tmp/BuildProcess-before-poppy.jsx`,
`/tmp/BuildProcess-before-poppy.scss`, `/tmp/ProcessGrowth-before-poppy.jsx`.

Verification: production build and scoped ESLint pass. Desktop 1280×720 and
mobile 390×844 inspected without horizontal overflow. Keyboard stage selection
and rapid previous/next changes work. ProcessVisual now unmounts the old SVG
immediately while animating the incoming diagram, preventing hidden stale
diagrams from remaining accessible. Reduced motion is supported in source;
browser motion-preference emulation was not performed.
