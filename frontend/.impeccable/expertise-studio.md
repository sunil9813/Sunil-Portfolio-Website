# Expertise studio surface brief

## Monochrome refinement — 2026-10-24
This update supersedes the color/layout specifications below: match the hero with white/gray text, monochrome technology icons, and the unchanged dark page canvas. Center the two-tone heading and compact horizontal pill selector. Place the animated network beside the selected tools on desktop; stack them on smaller screens. Preserve all 27 technologies, keyboard controls, and reduced-motion behavior. Heading and introductory layout use Tailwind; scoped SCSS handles the diagram and component states.
Verified the 1280px desktop and 390px mobile layouts, all four selections, keyboard navigation, targeted ESLint, and production build. Other homepage sections are unchanged.

## Overview
Scope: the homepage Expertise component. Mode: Experience.
Preserve the existing 27 technology names and four disciplines: Interface, Systems, Data, Delivery.
Concept: a guided, connected-stack workspace. A discipline selector highlights a branch of the central application diagram and changes the description and tool list together. The user rejected tilted, overlapping layer plates; preserve upright labels and clear connections instead.
No fabricated proficiency percentages, credentials, client names, or production statuses.

## Colors and typography
Inherit homepage Poppins, canvas #13161c, ink #f3f2ef, muted #adb3bf, and cyan #92d8df.
Interface uses cyan #92d8df, Systems lavender #b3aef5 from the original expertise palette, Data champagne #dfb28a, and Delivery ivory #f3f2ef.
The section has no background fill. Restrained tint belongs only to the selected icon and control; the page canvas is unchanged.
Heading: Every layer. / One connected stack.; second line is cyan, not gradient text.
Heading clamp(32px,3.65vw,52px), weight500, line-height1.16, tracking-.035em. Mobile clamp(30px,6.7vw,44px).
Body15px desktop,14px mobile; selected summary27px in its discipline color. Tool labels13px desktop,12px below1100px. Monospace is not used as a decorative technical costume.

## Layout
Desktop editorial heading/intro grid: 1.3fr/.7fr, gap64px. Workspace: 290px selector and flexible detail panel, gap64px.
At1100px workspace uses235px/1fr and40px gap; tools change from three to two columns.
At760px heading stacks, selector becomes four equal columns, and detail follows underneath.
Tool rows use authentic24px Devicon logos on38px inset icon tiles, readable labels,60px minimum height, and thin rules rather than small chips. Preserve label readability when an icon fails.
The 320px desktop /280px mobile diagram connects four peripheral technology nodes to a central web application. Native SVG linework uses separate desktop and mobile routes so connectors meet icons without crossing labels. Nodes stay upright with no perspective transforms or overlapping plates.
Minimum list space keeps category changes from collapsing the section. Footer counts derive from the actual arrays and links to /project.
No numbered decorative rows, ghost numbers, or heading eyebrow.

## Interaction and motion
Expertise.jsx owns the existing skills array, discipline selection, keyboard shortcuts, accessible region, and native SVG connected-application diagram.
Expertise.scss is scoped to .home-page .expertise-studio and its BEM descendants; surrounding components and global styles are unchanged.
Buttons expose aria-pressed and aria-controls. Arrow keys cycle disciplines; Home/End select the first/last and move focus. Enter/Space retain native button behavior.
The panel is labelled by its selected control; a short polite status announces the discipline and tool count. The diagram is decorative, aria-hidden, and captioned as an illustration.
The focal sequence draws four connectors over800ms with80ms branch spacing. Selection highlights the chosen branch and central application outline over250ms while a shared380ms highlight moves between controls.
Panel changes use300ms ease-out; the incoming tool list reveals over280ms with a capped150ms stagger. All content has already-visible defaults.
Motion is bounded to entry and selection, with no continuous loops or added dependency. Reduced motion makes these transitions immediate while retaining color, outline, and selected state.
Inherited cyan keyboard focus remains visible.
Native fragment #expertise addresses the section and uses the existing96px section scroll margin.

## Verification
Production build, targeted component ESLint, and diff whitespace checks passed. One detector pass returned no findings.
Desktop1440px and mobile390px screenshots inspected; compact320px and intermediate900px bounds checks show no horizontal overflow.
All views verified: Interface12, Systems2, Data3, Delivery10 tools. Keyboard Home and visible focus passed; browser errors none in the inspected preview.
Section background verified as rgba(0,0,0,0). Original component source is preserved in the task workspace at work/expertise-before/Expertise.jsx.
Desktop: /Users/gorkcoder/Documents/Codex/2026-10-06/ple/outputs/expertise-network-desktop.jpg
Mobile: /Users/gorkcoder/Documents/Codex/2026-10-06/ple/outputs/expertise-network-mobile.jpg
