# Public AI source coverage

The September 11, 2026 sweep includes the public AI component catalogs below. Source revisions and adaptations are recorded in each collection's `SOURCE.json`; original licenses travel with registry payloads. Counts refer to the pinned sources, not future upstream additions.

| Collection         | Imported public scope                                                                                   | Gallery coverage                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Beautiful UI       | 21 original primitives, six internals, complete component stylesheet; earlier adapters retained         | All 16 documented variant states across six families, plus the other 15 families |
| beUI               | 16 AI families, 19 registry roots, 56 files in their dependency closure                                 | All 28 documented demos                                                          |
| Blocks.so          | AI 01–05 and their isolated Base UI controls; four earlier controlled compositions retained             | All five AI compositions with input, attachment, model, and suggestion controls  |
| Prompt Kit         | All 21 public primitives, loader styles, and local control dependencies                                 | All 52 documented variants plus two local chat compositions                      |
| Vercel AI Elements | All 49 public elements, 84 documented examples, 25 isolated shadcn controls                             | 91 entries including seven views of the workflow example                         |
| BoardUI AI         | Agent Thinking, Composer Loader, and the free Chat Starter source and local transport                   | Four thinking styles, animated composer rim, and interactive chat                |
| Libraries.dev      | Thinking Orbs, Border Beam, Gooey, Metal FX v2, Image FX, plus the legacy Metal FX v1 playground source | Public states, presets, variants, and motion controls                            |

The install registry includes local imports recursively, npm dependencies with compatible versions, styles, source metadata, and applicable license notices. The generated LLM reference includes every registry entry and public TypeScript declaration. See the installation guide for stylesheet imports and the Beautiful UI scope wrapper.

## Deliberate adaptations

- Existing public component paths and registry names remain available. Full Beautiful UI sources use new `beautiful-original-*` registry names.
- Demonstrations use local sample state and callbacks. Prompt Kit's two server-backed examples, AI Elements' speech fallback, and BoardUI Chat Starter run without model credentials or a backend.
- Beautiful UI's proprietary Iconists icon package is replaced by Lucide equivalents. Its loading video uses local Fieldwork demonstration media.
- External AI Elements Rive and voice binaries remain at official demo URLs because the repository does not state their redistribution terms. Provider logos, Unsplash sample images, and a GitHub avatar remain external. The Web Preview uses a local static HTML fixture. They were checked for successful responses during the sweep.
- A stale WebGL-context callback in the original Metal FX v1 source is guarded so a previous canvas cannot stop a newly mounted renderer. Other import, lint, and accessibility adaptations are recorded with the source.

## Scope boundary

Moumen Lab remains a general interaction reference (13 components and one theme), not an AI component collection. Commercial-only assets and components are not redistributed. BoardUI's free AI source is included; its Pro-only product presentations are not reproduced.
