# Design

## Source of truth

- Status: Active
- Last refreshed: 2026-09-13
- Primary product surfaces: component catalog, voice section, generative previews, landing page, source registry.
- User-approved direction: the compact, restrained Beautiful UI visual language across every collection in Agents Kit.
- Evidence reviewed: Beautiful UI at `ff0f74d62d8be9d89bcb735b3632e31a6ccf88dc`, its live gallery and compiled CSS; local and deployed computed styles; all collection catalogs; shared BoardUI foundations and `styles/agents.css`.
- The local diagnostic showed missing compiled theme utilities, omitted body typography and an unbound monospace font. A source file existing is not proof that its styles render.

## Brand

- Personality: quiet, precise, compact, useful.
- Trust signals: readable states, consistent controls, accurate source attribution, working examples.
- Avoid: oversized empty preview stages, multiple nested frames, gratuitous bold text, arbitrary accents, decorative controls.

## Product goals

- Give all collections one coherent design foundation while keeping their APIs, distinct capabilities and complete variants.
- Let people judge and copy real working components.
- Success: correct rendered tokens, consistent hierarchy and spacing, accessible interactions, no clipped controls, and screenshot evidence for every catalog entry.
- Non-goals: replacing component behavior, inventing a dashboard, changing the model/backend boundary, flattening diagrams or artwork into ordinary form controls.

## Personas and jobs

- Product engineers and designers building agent interfaces.
- Browse a family, compare its variants, exercise controls, inspect source, and integrate it into an existing application.
- Desktop inspection and narrow-screen review both matter.

## Information architecture

- Keep the existing component families, collection filter, search and explicit variant labels.
- Core surfaces: `/`, `/components`, `/voice`, `/generative`, `/docs`, and the retained `/v0.1` archive.
- Component content leads; source and variant controls are secondary chrome.

## Design principles

- Typography, surface color and space carry hierarchy before borders or weight.
- Reuse the existing shared tokens. No second parallel design system or per-library palette patchwork.
- Preserve required component states and meaningful special-purpose layouts.
- Optical alignment is the goal; equal numeric padding is useful only when the result looks balanced.

## Visual language

- Color: Beautiful UI's cool neutral light/dark surfaces and restrained semantic accents. Map BoardUI and shadcn aliases to the same roles. Preserve provider identities, chart distinctions and image content. Primary/secondary readable text must meet 4.5:1 contrast; adjust tertiary source values when they carry readable information.
- Typography: Inter, with `cv11` and `ss01`; JetBrains Mono for code and machine-readable labels. UI baseline 14px/21px, tracking -0.01em. Secondary labels 12–13px; field and card headings 14px/500; section titles 13px/600. Long-form reading and document previews may remain 16px with a comfortable line height. Do not reduce every font or weight blindly.
- Spacing: reuse the 4px rhythm, with intentional 2px optical corrections. Common inline gaps 4/6/8px, control insets 8/12px, card padding 12/16px, and between-group spacing 20/24px. Avoid padding a framed component inside several more padded frames.
- Shape/radius/elevation: chips 6px, controls 8px, cards 10px, windows 14px, pills fully rounded. Borders are 1px hairlines. Use the original restrained shadow scale, not thick outlines.
- Motion: retain each source's meaningful loading, progress, expansion and interaction motion. Preserve reduced-motion behavior and interruptible controls.
- Imagery/iconography: existing artwork and licensed icons; controls typically use 14–16px icons with consistent optical centering. Keep clear provider logos and semantic status marks.

## Components

- Reuse the existing BoardUI/shadcn controls and imported source components.
- Shared tokens and typography belong in the existing stylesheet pipeline; Beautiful UI utilities must compile with Tailwind before reaching the browser.
- Preserve all existing catalog examples and variants, callbacks, source paths, model-independent behavior, and license notices.
- Local source adaptations should repair styling at the shared boundary first; use a component edit only for a demonstrated local mismatch.

## Accessibility

- Target WCAG 2.2 AA for readable text and core interactions.
- Keep semantic controls, accessible names, keyboard behavior, visible neutral focus rings and adequate hit areas.
- Small visual controls may use larger invisible hit areas without colliding with neighbours.
- Never remove labels, disable focus outlines, or use color as the only state cue.
- Honor reduced motion. No automatic audio capture or real model calls in demos.

## Responsive behavior

- Verify desktop and 390px layouts; inspect 320px where controls are compact.
- Components adapt to their available container, not only viewport width.
- Wide tables and code may scroll horizontally from the leading edge; the page itself must not overflow or clip actions.
- Mobile inputs remain 16px to avoid iOS zoom. Preserve compact desktop typography.
- Portals receive the correct theme, fonts and surface tokens.

## Interaction states

- Loading preserves useful prior content and shows clear progress.
- Empty and error states retain readable explanations and available recovery controls.
- Success and selected states remain visibly distinct after theme unification.
- Disabled controls remain identifiable without becoming the only source of explanatory text.
- External media failures must not collapse the surrounding layout.

## Content voice

- Plain, concise UI labels and realistic sample content.
- Avoid exposing implementation details in ordinary component controls.
- Label preview-only behavior accurately; do not imply real backend work.

## Implementation constraints

- React 19, Next.js 15, Tailwind 4, existing dependencies plus the explicitly requested LiveKit and ElevenLabs provider packages.
- Fix the real global CSS pipeline; do not ship a generated demo-only override as the production foundation.
- Existing imports, registry names, behavior and source attribution stay compatible.
- All source variants require screenshots with typography, spacing, border, corner, alignment and clipping review. Use matched content when attributing geometry differences.
- Verify compiled CSS, local interactions, typecheck, lint, targeted tests and an isolated production build. Rebuild registry and LLM payloads after source changes.
- Private local prototypes remain uncommitted unless explicitly selected for publication.

## Open questions

- LiveKit Aura is excluded because its file-specific Non-Resale license text could not be verified. ElevenLabs MIT Orb supplies the spherical voice visualization. Scope is all current catalog collections; importing additional upstream application templates is separate work.
