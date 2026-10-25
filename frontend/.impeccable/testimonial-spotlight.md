# Testimonial spotlight

Current refinement: enhance the accepted split-card composition rather than replace it. Preserve copy, API, distinct review colors and the commented legacy mount. The previous version is backed up in /Users/gorkcoder/Documents/Codex/2026-10-06/ple/work/before-testimonial-enhancement/. Implementation and verification history are in [testimonial-spotlight-addendum.md](testimonial-spotlight-addendum.md). Inherited homepage tokens remain unchanged.

Scope: add a new homepage testimonial component; preserve Testimonial.jsx and Testimonial.scss byte-for-byte and comment out the previous import/render in Home.jsx. Mode: Persuade. Inherit the original dark homepage, Poppins and existing API. References are the three user-supplied Specify screenshots, not a new global identity.

## Direction contract

THESIS: One readable customer story in focus, with neighboring stories waiting at either side.

OWN-WORLD: Dark canvas, hairline rounded frame; each review owns a different colored left panel. Uploaded reviewer portrait replaces the reference's company logo.

STORY: Read the customer's name, role and quote; navigate reviews or open the full record. Customer reviews precede explicitly fictional demos. Missing photos use honest initials.

FIRST VIEWPORT: Centered split card, up to 820px wide with a 420px desktop minimum height; picture, supplied rating and compact full-review action left, identity and quote right. Dimmed side previews, arrows and dots below. Mobile keeps the portrait on the left with readable text beside it and a 400px minimum height.

FORM: User-pinned screenshot composition; code-led refinement. Direct manipulation moves the review rail under the pointer, then a damped spring returns the rail while a finite eased transition selects the next portrait-and-quote pair. Receding previews use subtle perspective; text and portrait settle as one bounded sequence. Larger photographic crops, an accent-aware pager and compact arrow-button feedback strengthen the composition. No autoplay, new dependencies or continuous effects. Keyboard and reduced-motion alternatives remain usable.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Current refinement finish: ship; no material fixes requested. Desktop and mobile captures are in `.impeccable/review/testimonial-refined/`. The global DESIGN.md remains unchanged; the scoped addendum records the implementation and verification limits. No new shipping raster assets were introduced.

## Data and preservation

Use the existing public testimonial service and normalization. Do not edit backend records, ratings or user photos. Unique accent hues are assigned across the complete returned list without a repeating three-color cycle. Quotes are excerpts when long, with a full-record link. Existing demo labels and rating-summary exclusion remain.

Reference paths: /var/folders/2b/fb79y4_j6p34xv4msm7_rxmw0000gn/T/codex-clipboard-183f58a9-a526-4ebd-bc93-0dcc185ce669.png; codex-clipboard-ba4a2314-f36b-4342-8b34-daa5572541e1.png; codex-clipboard-3c3ce957-f05e-4817-aa2e-05a2d8b55886.png in the same directory. Existing API portraits are sourced from each record's avatar, not stock replacements. Pre-change backup: /Users/gorkcoder/Documents/Codex/2026-10-06/ple/work/before-spotlight-testimonials/.
