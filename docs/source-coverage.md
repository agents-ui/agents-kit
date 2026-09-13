# Public AI source coverage

## v0.3 voice collection

Added September 13, 2026. The dedicated `/voice` page exposes all 37 entries, with an optional grouped-family view. The original collections below remain available.

| Collection | Public source | Gallery |
| --- | --- | --- |
| LiveKit | 15 registry entries: four audio visualizers, media/transcript controls, session context, shader helper, and session/popup blocks | Manual visualizer states and actual disconnected SDK components; no usable token or automatic capture |
| ElevenLabs | All 17 UI families and dependency closure; MIT Orb shaders run on the existing Three.js version | Manual Orb/waveform data, all seven waveform exports, user-initiated tone playback, and disabled provider/microphone controls |
| OrbKit | Four MIT shaders and their shared WebGL core, pinned to `35e42484560fd35e8502703ba58fa99541d8c686` | Hydrogen, Ion, Dither, and Nimbus with idle/thinking/speaking states; 19 non-commercial ports excluded |
| Agents Kit | Controlled `VoiceAgentSession` combining both sources | Listening, thinking, speaking, ended, and failed states with local callbacks |

LiveKit is pinned to `20aa613fcab699385fe7385d0bf31a9262210421`; ElevenLabs is pinned to `88a5342ee74632a3f66f3cf9a75cbe87f97007f9`. Their licenses, notices, source entries, and adaptations are shipped with the install registry. LiveKit Aura is excluded because its file-specific PolyForm Non-Resale license text could not be verified. The ElevenLabs Orb supplies the spherical visualizer instead.

The Orb’s Perlin-noise texture remains externally hosted at the upstream URL, with a deterministic local fallback while it loads. The four-second WAV is an original generated tone. Orb UI was reviewed as a motion and signal-control reference; no Orb UI source was copied.

## Existing collections

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
