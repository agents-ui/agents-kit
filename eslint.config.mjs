import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  { ignores: ["vendor/**", "out/**", ".next/**", ".next-release/**"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: [
      "components/agents-ui/application/thinking-indicator/upstream/**/*.{ts,tsx}",
      "components/effects/border-beam/upstream/**/*.{ts,tsx}",
    ],
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },
]

export default eslintConfig
