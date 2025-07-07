# agents-ui-kit

**Advanced UI components for building AI agent interfaces.**  
Build sophisticated agent experiences, autonomous assistants, and multi-agent systems with beautiful, customizable components.

![agents-ui-kit hero](/screenshot.png)

## About

`agents-ui-kit` extends the excellent [prompt-kit](https://github.com/ibelick/prompt-kit) library with additional components specifically designed for AI agent interfaces. This library includes all the original prompt-kit components plus new agent-focused components.

### Attribution

This project is built on top of prompt-kit. We maintain all original components and functionality while adding new agent-specific features.

## Installation

### Install shadcn/ui

First, you'll need to install and configure [shadcn/ui](https://ui.shadcn.com) in your project.  
Follow the installation guide in the shadcn/ui documentation.

### Install agents-ui-kit components

Once shadcn/ui is set up, you can install components using the shadcn CLI:

#### Original prompt-kit components:
```sh
npx shadcn@latest add agents-ui-kit/prompt-kit/[component]
```

#### New agent-specific components:
```sh
npx shadcn@latest add agents-ui-kit/agents-ui/[component]
```

### Usage

After installation, import and start using the components in your project:

```tsx
// Original prompt-kit components
import { PromptInput } from "@/components/prompt-kit/prompt-input"
import { Message } from "@/components/prompt-kit/message"

// New agent-specific components
import { AgentCard } from "@/components/agents-ui/agent-card"
import { TaskQueue } from "@/components/agents-ui/task-queue"
```

## Components Preview

### Agent Card Component
The Agent Card displays agent information with real-time status, capabilities, and interactive controls.

![Agent Card Basic](/public/screenshots/agent-card-basic.png)

![Agent Card Interactive](/public/screenshots/agent-card-interactive.png)

### Navigation Structure
The sidebar clearly separates agents-ui components from the original prompt-kit components.

![Sidebar Navigation](/public/screenshots/sidebar-navigation.png)

## Component Libraries

### prompt-kit (Original Components)
All original prompt-kit components are preserved:
- **Message** - Display chat messages with avatars and actions
- **PromptInput** - Enhanced input for prompts
- **ResponseStream** - Streaming text responses
- **CodeBlock** - Syntax-highlighted code display
- **Markdown** - Rich markdown rendering
- **ChatContainer** - Full chat interface
- **Loader** - Loading states
- **ScrollButton** - Scroll controls
- And more...

### agents-ui (New Components)
New components designed for agent interfaces:
- **AgentCard** - Display agent information, capabilities, and status
- **TaskQueue** - Visualize pending and completed agent tasks
- **ToolCall** - Show tool/function calls made by agents
- **AgentConversation** - Extended chat interface for agent interactions
- **SystemPrompt** - Display and edit system prompts
- **AgentStatus** - Real-time agent status indicators
- **MultiAgentView** - Coordinate multiple agents
- More components coming soon...

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Build component registry
npm run build:registry
```

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

## Author

**Abhishek Gahlot**  
Email: me@abhishek.it

---

Built with ❤️ on top of [prompt-kit](https://github.com/[original-repo]/prompt-kit) and [shadcn/ui](https://ui.shadcn.com)
