"use client"

import { FormGenerator } from "@/components/agents-ui/application/form-generator/form-generator"

export type FormFieldType =
  | "text"
  | "number"
  | "select"
  | "checkbox"
  | "date"
  | "email"
  | "textarea"
export interface FormFieldValidation {
  minLength?: number
  maxLength?: number
  pattern?: string
  min?: number
  max?: number
}
export interface FormField {
  id: string
  label: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  validation?: FormFieldValidation
  options?: string[]
}
export interface AgentFormGeneratorProps {
  formTitle?: string
  formDescription?: string
  fields?: FormField[]
  isGenerating?: boolean
  showPreview?: boolean
  className?: string
  onAddField?: () => void
  onRemoveField?: (fieldId: string) => void
  onRegenerate?: () => void
  onExportSchema?: () => void
  onFieldReorder?: (fieldIds: string[]) => void
}
export function AgentFormGenerator(props: AgentFormGeneratorProps) {
  return <FormGenerator {...props} />
}
