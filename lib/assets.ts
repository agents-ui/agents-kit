/**
 * Get the correct asset path based on the environment
 * - On localhost: use normal path like /image.png
 * - On GitHub Pages: use full URL like https://agents-ui.github.io/agents-kit/image.png
 */
export function getAssetPath(path: string): string {
  // Only transform in browser environment
  if (typeof window === 'undefined') {
    return path
  }

  // If localhost, return the path as-is
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return path
  }

  // Otherwise, use the full GitHub Pages URL
  return `https://agents-ui.github.io/agents-kit${path}`
}
