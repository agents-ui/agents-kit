# Migrating to Agents Kit v0.2

Agents Kit v0.2 changes the primary catalog and design direction while keeping the v0.1 public component paths available. Existing applications can migrate incrementally.

Version 0.2.0 is dated 2026-09-05. The previous public source is preserved at the v0.1.0 tag, and the previous collection remains available in the v0.1 archive.

The new direction reflects how agent products are changing. Models increasingly return structured answers, stream tool work, expose context limits, pause for approval, and create artifacts that users refine. Version 0.2 makes those interactions the main library surface while keeping role-specific v0.1 components available for existing applications.

## Compatibility contract

Version 0.2 keeps the existing `components/agents-ui/agent-*.tsx` entry files and registry slugs. Existing imports do not receive an automatic rename, and the established public prop and type contracts remain available.

The main `/components` catalog now prioritizes the new generative UI collections and groups equivalent source variants into one family. The previous component gallery remains at `/v0.1`. Moving a component out of the main catalog does not remove its source or registry entry.

The archive uses the current shared theme. It preserves access to the v0.1 components, but it is not an exact pixel reproduction of the historical v0.1 site.

## What changes for new work

Use the v0.2 families when building a new answer or agent interaction:

| Need                                                                        | Start with                                                |
| --------------------------------------------------------------------------- | --------------------------------------------------------- |
| Generated answer card                                                       | `AgentGenerativeSurface`                                  |
| Structured comparison, recommendation, document, checklist, or source brief | Generative UI work-output patterns                        |
| Animated model activity                                                     | `ThinkingIndicator` or `ThinkingOrb`                      |
| Token and context visibility                                                | `AgentContextMeter`                                       |
| Save or restore a workflow point                                            | `AgentCheckpoint`                                         |
| Messages, prompts, approvals, tasks, citations, code, or generated media    | The matching Beautiful UI or beUI family in `/components` |
| File, setup, task-table, or workspace composition                           | The matching Blocks.so adaptation                         |

The components are model-provider independent. Continue to own model calls, streaming transport, tool execution, persistence, authorization, and error handling in the host application. Pass current state through props and handle actions through callbacks.

## Incremental migration

1. Keep the current v0.1 component in place.
2. Find its user-facing family in `/components`.
3. Add the v0.2 component beside the current implementation and map existing data into its props.
4. Connect callbacks to the same host-owned actions and permissions.
5. Verify ready, loading, error, disabled, empty, light, dark, and narrow-layout states that apply to the interaction.
6. Switch the product surface after behavior and visual review.
7. Remove the old local copy only when your application no longer imports it.

This process allows one surface to move at a time and does not require a repository-wide rewrite.

## Example: add a generated answer

```tsx
import { AgentGenerativeSurface } from "@/components/agents-ui/agent-generative-surface"

export function ActivityAnswer() {
  return (
    <AgentGenerativeSurface
      content={{
        type: "activity",
        title: "Weekly activity",
        value: "42",
        unit: "tasks",
        description: "Completed across the selected workspace.",
        points: [
          { label: "Mon", value: 6 },
          { label: "Tue", value: 9 },
          { label: "Wed", value: 12 },
        ],
      }}
    />
  )
}
```

The example renders only the supplied data. It makes no network request and starts no model run.

## Copy-source installation

Agents Kit uses registry items that copy source and its public dependency closure into the host project. Keep the shared stylesheet imports installed by the registry. Review the copied callbacks before connecting them to write operations or external services.

If your v0.1 component is already copied into the application, it stays under your control. Installing a new v0.2 family does not silently replace that file.

## Source and license notices

Keep the license and notice files included by a registry item. Exact upstream revisions and whether source was copied, adapted, or independently implemented are recorded in `THIRD_PARTY_NOTICES.md` and in metadata beside the relevant component family.
