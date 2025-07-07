import {
  bundledLanguages,
  createHighlighter,
  Highlighter,
} from "shiki/bundle/web"

// This variable will hold the cached highlighter instance
let highlighter: Highlighter | null = null

const getHighlighter = async (): Promise<Highlighter> => {
  if (!highlighter) {
    // Create it only once
    highlighter = await createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: [...Object.keys(bundledLanguages)],
    })
  }
  return highlighter
}

export const codeToHtml = async ({
  code,
  lang,
}: {
  code: string
  lang: string
}): Promise<string> => {
  const highlighterInstance = await getHighlighter()

  // Ensure highlighterInstance is not null
  if (!highlighterInstance) {
    throw new Error("Highlighter instance is null")
  }

  if (!code) {
    return "<pre><code></code></pre>"
  }

  try {
    // For TypeScript/TSX, check if the code contains problematic patterns
    const problematicPattern = /\*\[_\$\[:alpha:\]\]\)\)\(/
    if ((lang === 'typescript' || lang === 'tsx' || lang === 'ts') && problematicPattern.test(code)) {
      // Use JavaScript highlighting as fallback for problematic TypeScript code
      return highlighterInstance.codeToHtml(code, {
        lang: 'javascript',
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        defaultColor: false,
        cssVariablePrefix: "--shiki-",
      })
    }

    return highlighterInstance.codeToHtml(code, {
      lang: lang,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      cssVariablePrefix: "--shiki-",
    })
  } catch (error) {
    // If it's a specific regex error, try with JavaScript highlighting
    if (error instanceof Error && error.message.includes('[_$[:alpha:]]')) {
      try {
        return highlighterInstance.codeToHtml(code, {
          lang: 'javascript',
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
          defaultColor: false,
          cssVariablePrefix: "--shiki-",
        })
      } catch (fallbackError) {
        console.warn("Shiki highlighting fallback error:", fallbackError)
      }
    }
    
    console.warn("Shiki highlighting error:", error)
    // Final fallback to plain code
    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
    
    return `<pre class="shiki shiki-themes github-light github-dark"><code>${escapedCode}</code></pre>`
  }
}

// Function to dispose of the highlighter when done (e.g., server-side cleanup)
export const disposeHighlighter = async (): Promise<void> => {
  if (highlighter) {
    highlighter.dispose()
    highlighter = null // Reset the cached instance
  }
}
