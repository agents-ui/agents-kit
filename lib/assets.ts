// Helper to get the correct asset path for both local dev and production
export function getAssetPath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // In production, prepend the basePath
  if (process.env.NODE_ENV === 'production') {
    return `/agents-kit/${cleanPath}`
  }
  
  // In development, just return the path
  return `/${cleanPath}`
}

// For use in components where we need runtime path resolution
export function useAssetPath() {
  const isProd = process.env.NODE_ENV === 'production'
  const basePath = isProd ? '/agents-kit' : ''
  
  return (path: string) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${basePath}/${cleanPath}`
  }
}
