# BeyondJustCode showcase

Scope: BeyondJustCode.jsx and its scoped SCSS only. Mode: Experience. Local composition refinement within the existing homepage, not a new brand. Preserve the five editorial subjects, descriptions, four category filters, and project/about/notes/courses/contact destinations. Preserve Poppins and the default dark canvas. No new dependencies, invented metrics, completed projects, or credentials.

## Direction contract

THESIS: Build, learn, and share become an explorable studio collection, with a dominant application study rather than an equal-weight carousel.
OWN-WORLD: Charcoal surfaces, ivory typography, cyan engineering accents, lavender notes, champagne learning; precise borders and upright artifacts.
STORY: Visitors see the full-stack focus, find notes or courses, then explore projects or start a conversation.
FIRST VIEWPORT: Large heading and category controls above a two-thirds application feature and two compact editorial previews. Architecture and interface studies follow; contact anchors the collection.
FORM: Local asymmetric collection; no seed or brand replacement. Signature interaction: category reflow and restrained window reveal, immediate under reduced motion.
FINISH: Complete the finish review, resolve its findings, record the verdict and as-built details in this local brief. This refinement inherits the homepage; it does not establish a global design system. Shipping raster assets require provenance; none were introduced here.

## Constraints

Native HTML/CSS study visuals are decorative and honestly captioned as illustrative. No external imagery is needed. Keep all destinations visible in All work, readable filter names, native links, visible keyboard focus, and 44px control targets. All content is visible by default; no autoplay, perpetual motion, or hidden carousel links. Record the built component here; do not rewrite unrelated global design rules.

## As built

- Typography and color: Inherited Poppins and homepage charcoal canvas, panel, ivory ink, muted text, cyan accent, fine border, section spacing, and easing. The section background is transparent. Its heading uses a fluid 32–52px size, weight 500, tight tracking, and a cyan terminal dot; card titles use 20–28px, descriptions 11–13px with generous leading. Monospace is confined to decorative code and architecture studies. Lavender marks notes and architecture; champagne marks learning and the contact action.
- Layout: The desktop collection uses six columns with 20px gaps: the application spans four columns and two 218px rows, notes and learning occupy the remaining third, and architecture and details each span half the next row. Cards use 16px corners and fine inherited borders. At 1100px the application spans a two-column grid; at 760px the collection and footer stack with 16px card gaps. Filtered collections use two equal columns, then one on mobile. The inherited container is capped at 1240px and uses 20px mobile gutters.
- Motion: Category selection moves the cyan pill over 300ms and reflows cards over 350ms; decorative studies settle by 6px over 700ms on first view. Hover shifts action arrows and gently raises the code slip. The illustrative cursor stays anchored to its example action. Reduced-motion branches remove layout/reveal motion and CSS transitions; source support was checked, but the preference was not emulated at runtime.
- Accessibility and content: Four native filter buttons expose pressed state, control the named collection, support Arrow/Home/End selection with focus movement, and meet a 44px minimum height. Homepage cyan focus outlines remain visible. Each native card link is named and described by its editorial text; decorative studies are hidden from assistive technology, while a polite status announces the active category and count. All five original subjects and descriptions remain, with `/project`, `/about`, `/notes`, `/courses`, and the persistent `/contact` footer destination. The visible caption identifies every native HTML/CSS study as illustrative.

## Finish and verification

The finish reviewer first returned **fix** with two P2 findings: narrow code wrapping and illustrative cursor drift. One correction batch resolved both; the final verdict is **ship**, covering those two scored fixes. The final build, scoped ESLint, and diff check passed. The single design-detector pass returned `[]`; it was not rerun. All four filters functioned, Home selected and focused All work, and keyboard focus was visible. Checks at 320, 390, 900, and 1440px found no horizontal overflow; the section's computed background was transparent and the inspected console had no errors.

Final evidence lives in `.impeccable/review/beyond/`: `desktop.png`, `mobile.png`, `compact-320.png`, `intermediate-900.png`, `design-900.png`, and `learning-desktop.png`. These are verification captures, not shipping raster assets. This brief is the component's local design record; no root DESIGN.md, PRODUCT.md, global tokens, or design sidecar was created or rewritten for this refinement.
