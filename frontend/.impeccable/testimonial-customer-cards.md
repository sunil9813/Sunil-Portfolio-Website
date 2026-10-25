# Customer review collection

Local component redesign, Persuade. Preserve established homepage identity and live data. The overlapped deck and ruled journal are rejected anti-references.

## Direction contract

THESIS: Several customer voices can be read together without overlap or hidden text.

OWN-WORLD: Existing charcoal canvas, slate cards, warm white type, cyan ratings and compact controls. No section background change.

STORY: Compare genuine customer experiences, expand full text, swipe through more reviews.

FIRST VIEWPORT: Heading and brief introduction above three equal-width customer cards. Stars and quote lead each card; customer identity anchors its foot. Compact browse controls and all-review action close the composition.

FORM: Code-led local component, no identity seed. Staggered short reveals, subtle hover tint and native scroll-snap with smooth arrow navigation. Reduced-motion support. At most twelve records rendered; all-review route exposes the complete collection.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. Record this local design here; no global identity replacement or new rasters.

## References

https://www.framer.com/blog/testimonials-on-website-examples/ — Cartesia's clearly attributed customer cards and horizontal browsing inspire composition. Adapt to existing dark tokens; no copied content, logos, imagery or claims. Published source inspected; direct image retrieval failed.

## Implemented design and verification

Three equal-height cards display on desktop, two at 1000px and below, and 90%-width cards at 600px and below. Corners are 16px with subtle borders, cyan ratings and attributed customer identities. Rendering is bounded to twelve API records, with the complete collection at `/customer-feedback`. Source excerpts and complete text are available through accessible inline expansion. Native scroll-snap, arrow controls, focus states and reduced-motion handling support browsing.

Fresh finish verdict: **ship**, no material findings. Production build, scoped lint, six data tests and SSR for 0/1/1,000 records pass. Keyboard Next changed “1 of 3” to “2 of 3”; full-review expansion sets aria-expanded=true. Desktop card heights match at 432.58px; main button height40px. No local horizontal overflow measured at 1280,390,360px.

Final viewport captures live in `.impeccable/review/testimonial-customer-cards/`: desktop.png (1280×900), mobile.png (390×844), user-360.png (360×749). Controls continue below the fold at360px. Reviewer inspected source and these captures; runtime checks are parent evidence, not independently repeated by reviewer. Two bounded visual rounds, one detector pass with no findings. No API writes or new shipping rasters. Original dark canvas unchanged; local documentation only.
