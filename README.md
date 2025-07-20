# agents-ui-kit

**Advanced UI components for building AI agent interfaces.**  
Build sophisticated agent experiences, autonomous assistants, and multi-agent systems with beautiful, customizable components.

![agents-ui-kit hero](/public/screenshots/screenshot.png)

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

![Agent Card Basic](/public/screenshots/screenshot1.png)

![Agent Card Interactive](/public/screenshots/screenshot2.png)

### Navigation Structure
The sidebar clearly separates agents-ui components from the original prompt-kit components.

![Sidebar Navigation](/public/screenshots/sidebar-navigation.png)

## New Specialized Agent Components

We've just shipped 4 powerful new agent components that handle complex media workflows. These aren't just basic UI components - they're full-featured interfaces that developers are using in production AI apps.

### Image Generation & Editing Agent

Handle AI-generated images with proper variation management, export controls, and editing workflows. Supports multiple formats and real-time preview updates.

![Image Agent](/public/screenshots/image_agent.png)

### Video Editor Agent

Professional video editing interface with timeline visualization, clip management, and export controls. Perfect for AI video generation workflows.

![Video Agent](/public/screenshots/video_agent.png)

### Audio Generation Agent

Complete audio synthesis interface with waveform visualization, voice controls, and real-time playback. Handles voice selection, speed control, and multiple export formats.

![Audio Agent](/public/screenshots/audio_agent.png)

### Grammar & Text Analysis Agent

Smart text analysis with categorized suggestions, issue detection, and correction workflows. Shows readability scores and handles bulk text improvements.

![Grammar Agent](/public/screenshots/grammar_agent.png)

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
Specialized components for agent workflows:

#### Core Agent Components
- **AgentCard** - Display agent information, capabilities, and status
- **AgentResponse** - Handle agent messages with tool integration
- **AgentPromptComposer** - Advanced prompt building interface
- **AgentChatHistory** - Conversation history management
- **AgentStatusPanel** - Real-time agent status monitoring
- **AgentToolPalette** - Tool selection and management
- **AgentFeedback** - User satisfaction collection

#### Media Agent Components (New!)
- **AgentImageEditor** - AI image editing with variation management and export controls
- **AgentVideoEditor** - Professional video editing with timeline and playback controls
- **AgentAudioGenerator** - Voice synthesis with waveform visualization and voice controls
- **AgentGrammarChecker** - Smart text analysis with categorized suggestions and corrections

#### Utility Components
- **TaskQueue** - Visualize pending and completed agent tasks
- **SystemPrompt** - Display and edit system prompts
- **MultiAgentView** - Coordinate multiple agents

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

Built on top of [prompt-kit](https://github.com/ibelick/prompt-kit) and [shadcn/ui](https://ui.shadcn.com)
