# Changelog

This file records user-visible changes to Agents Kit.

## 0.2.0

Date: 2026-09-05

The generative UI release keeps v0.1 source paths and registry slugs available.

This release responds to a change in product shape: models increasingly return structured answers, stream tool work, expose context limits, pause for approval, and produce artifacts that users refine. The primary library now centers those generative interactions instead of presenting every role-specific component as a separate top-level concept.

### Added

- Optional Border Beam and Gooey effects with standalone source-registry entries.
- Updated Thinking Orbs with a compact 32px size and optional color and dot controls.

- Expand, edit, compare, save, share, and copy workflows for all 16 generated result types.

- All 21 public Beautiful UI component families, reauthored as controlled React components.
- All 17 public beUI AI agent families, represented by 19 installable registry slugs.
- A generative surface for 11 answer types: audio, focus, flight, location, weather, stories, inbox, note, collection, event, and activity.
- Five structured work-output examples: comparison, recommendation, document, checklist, and source brief.
- A source-faithful Thinking Orb canvas with all nine public states.
- Context usage and checkpoint components independently implemented from public AI Elements interaction patterns.
- Four attributed Blocks.so adaptations for composing prompts, managing files, completing setup, and reviewing tasks.
- A focused v0.2 component catalog, a generative UI showcase, and a v0.1 archive gallery.

### Changed

- Regenerate `llms.txt` and `llms-full.txt` from the current registry, guides, and TypeScript APIs during builds.
- Configure component discovery through the current shadcn MCP server and the `@agents-kit` registry namespace.
- Correct installation URLs, shared-style instructions, documentation branding, and preview URLs for GitHub Pages.
- Organized the main catalog by user-facing component family so related source variants appear together.
- Shifted the primary design direction toward compact generative answers and production agent interactions.
- Standardized public examples on controlled data, explicit callbacks, synthetic fixtures, responsive layouts, and light and dark themes.
- Updated documentation for a model-provider-independent integration. Agents Kit does not perform model calls or backend work.

### Compatibility

- Existing v0.1 `components/agents-ui/agent-*.tsx` entry paths remain available.
- Existing v0.1 registry slugs remain available.
- Existing public prop and type contracts are retained; v0.2 does not apply an automatic breaking rename.
- The v0.1 components are removed from the main v0.2 catalog to reduce repetition, but remain visible in the `/v0.1` archive.
- The archive uses the current shared theme and is not an exact pixel reproduction of the historical v0.1 site.

### Provenance

Public upstream source relationships and licenses are recorded in `THIRD_PARTY_NOTICES.md` and the `SOURCE.json`, `NOTICE.md`, and license files stored with adapted components.

## 0.1.0

- Established the original Agents Kit agent component collection.
- Extended the retained Prompt Kit conversational primitives with agent-specific interfaces.
