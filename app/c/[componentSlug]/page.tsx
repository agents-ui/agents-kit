import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import React from "react"

async function importComponent(componentName: string) {
  try {
    const module = await import(`@/components/blocks/${componentName}`)
    
    // Handle default export
    if (module.default) {
      return module.default
    }
    
    // Handle named exports - try to find a component that matches the file name
    // Convert kebab-case to PascalCase
    const pascalCase = componentName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
    
    // Try exact match first
    if (module[pascalCase]) {
      return module[pascalCase]
    }
    
    // Try with "Component" suffix
    if (module[`${pascalCase}Component`]) {
      return module[`${pascalCase}Component`]
    }
    
    // Fall back to first exported component
    const exports = Object.values(module).filter(
      exp => typeof exp === 'function' && exp.prototype?.isReactComponent !== false
    )
    
    if (exports.length > 0) {
      return exports[0]
    }
    
    console.error(`No valid component export found in ${componentName}`)
    return null
  } catch (error) {
    console.error(`Failed to import component ${componentName}:`, error)
    return null
  }
}

type Params = Promise<{ componentSlug: string }>

export default async function ComponentPage(props: { params: Params }) {
  const params = await props.params
  const componentSlug = params.componentSlug

  if (!componentSlug) {
    console.error("No component slug provided")
    notFound()
  }

  const Component = await importComponent(componentSlug)

  if (!Component) {
    console.error(`Component not found: ${componentSlug}`)
    notFound()
  }

  return (
    <div className="bg-background relative isolate min-h-svh">
      <Component />
    </div>
  )
}
export async function generateStaticParams() {
  try {
    const componentsDir = path.join(
      process.cwd(),
      "components",
      "blocks"
    )

    if (!fs.existsSync(componentsDir)) {
      console.warn("Blocks directory not found at:", componentsDir)
      return []
    }

    const files = fs.readdirSync(componentsDir)
    const params = files
      .filter((file: string) => file.endsWith(".tsx") || file.endsWith(".jsx"))
      .map((file: string) => {
        const componentSlug = file.replace(/\.(tsx|jsx)$/, "")
        console.log("Generated param for component:", componentSlug)
        return {
          componentSlug,
        }
      })

    console.log("Generated params:", params)
    return params
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}
