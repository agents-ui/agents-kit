# Theming in agents-ui-kit

## How Dark Mode Works

The agents-ui-kit uses **next-themes** for theme management, which provides:

1. **System Theme Detection**: Automatically detects and follows your OS theme preference
2. **Manual Toggle**: Users can override system preference using the theme toggle in the header
3. **Persistence**: Theme choice is saved in localStorage

## Default Behavior

All components use CSS variables and Tailwind's `dark:` modifier:

```css
/* Light mode */
bg-white text-gray-900 border-gray-200

/* Dark mode */
dark:bg-zinc-900 dark:text-white dark:border-zinc-700
```

## Component-Level Theme Control

Some components like `AgentCard` support theme overrides via props:

### 1. Variant Prop
Controls the visual style:
```tsx
<AgentCard variant="dark" />     // Always dark
<AgentCard variant="light" />    // Always light
<AgentCard variant="gradient" /> // Gradient style
<AgentCard variant="default" />  // Follows system theme
```

### 2. Theme Prop
Force a specific theme mode:
```tsx
<AgentCard theme="dark" />  // Force dark mode
<AgentCard theme="light" /> // Force light mode
<AgentCard theme="auto" />  // Follow system (default)
```

## CSS Variables

The theme system uses CSS variables defined in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  /* ... more variables */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --card: 0 0% 3.9%;
  --card-foreground: 0 0% 98%;
  /* ... more variables */
}
```

## Using Theme in Your Components

### Option 1: Tailwind Dark Mode (Recommended)
```tsx
<div className="bg-white dark:bg-zinc-900 text-black dark:text-white">
  Content adapts to theme
</div>
```

### Option 2: CSS Variables
```tsx
<div className="bg-background text-foreground">
  Uses theme variables
</div>
```

### Option 3: useTheme Hook
```tsx
import { useTheme } from 'next-themes'

function MyComponent() {
  const { theme, setTheme } = useTheme()
  
  return (
    <div>
      Current theme: {theme}
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
    </div>
  )
}
```

## Theme Provider Setup

The theme provider is configured in `app/providers.tsx`:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

## Best Practices

1. **Use Semantic Colors**: Use `bg-background`, `text-foreground` instead of hardcoded colors
2. **Support Both Modes**: Always provide `dark:` variants for colors
3. **Test Both Themes**: Check your component in both light and dark modes
4. **Respect User Choice**: Default to system theme unless there's a specific need

## Component Examples

### Adaptive Component (Default)
```tsx
function MyCard() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
      Adapts to current theme
    </div>
  )
}
```

### Forced Theme Component
```tsx
function AlwaysDarkCard() {
  return (
    <div className="bg-zinc-900 text-white border-zinc-700">
      Always dark regardless of system theme
    </div>
  )
}
