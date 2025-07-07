/**
 * Get the correct asset path based on the environment
 * - On localhost: use normal path like /image.png
 * - On GitHub Pages: use base path like /agents-kit/image.png
 */
export function getAssetPath(path: string): string {
  // Use NEXT_PUBLIC_BASE_PATH if it's set (for GitHub Pages)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  return `${basePath}${path}`
}
