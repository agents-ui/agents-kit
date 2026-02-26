"use client"

import * as React from "react"
import {
  AlignLeft,
  Calendar,
  CheckSquare,
  ChevronDown,
  ClipboardCopy,
  Clock,
  FileJson,
  GripVertical,
  Hash,
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Type,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type FormFieldType = "text" | "number" | "select" | "checkbox" | "date" | "email" | "textarea"

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

/* ------------------------------------------------------------------ */
/*  Style maps per field type                                         */
/* ------------------------------------------------------------------ */

const typeGradient: Record<FormFieldType, string> = {
  text:     "bg-zinc-50 dark:bg-zinc-900/50 border-l-2 border-l-blue-400",
  email:    "bg-zinc-50 dark:bg-zinc-900/50 border-l-2 border-l-sky-400",
  select:   "bg-zinc-50 dark:bg-zinc-900/50 border-l-2 border-l-zinc-400",
  textarea: "bg-zinc-50 dark:bg-zinc-900/50 border-l-2 border-l-amber-400",
  number:   "bg-zinc-50 dark:bg-zinc-900/50 border-l-2 border-l-emerald-400",
  date:     "bg-zinc-50 dark:bg-zinc-900/50 border-l-2 border-l-pink-400",
  checkbox: "bg-zinc-50 dark:bg-zinc-900/50 border-l-2 border-l-indigo-400",
}

const typeIconColor: Record<FormFieldType, string> = {
  text:     "text-blue-600 dark:text-blue-400",
  email:    "text-sky-600 dark:text-sky-400",
  select:   "text-zinc-600 dark:text-zinc-400",
  textarea: "text-amber-600 dark:text-amber-400",
  number:   "text-emerald-600 dark:text-emerald-400",
  date:     "text-pink-600 dark:text-pink-400",
  checkbox: "text-indigo-600 dark:text-indigo-400",
}

const typeDotColor: Record<FormFieldType, string> = {
  text:     "bg-blue-400 dark:bg-blue-500",
  email:    "bg-sky-400 dark:bg-sky-500",
  select:   "bg-zinc-400 dark:bg-zinc-500",
  textarea: "bg-amber-400 dark:bg-amber-500",
  number:   "bg-emerald-400 dark:bg-emerald-500",
  date:     "bg-pink-400 dark:bg-pink-500",
  checkbox: "bg-indigo-400 dark:bg-indigo-500",
}

const typePillColor: Record<FormFieldType, string> = {
  text:     "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  email:    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  select:   "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  textarea: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  number:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  date:     "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  checkbox: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
}

const typePreviewAccent: Record<FormFieldType, string> = {
  text:     "focus-within:ring-blue-400/40",
  email:    "focus-within:ring-sky-400/40",
  select:   "focus-within:ring-zinc-400/40",
  textarea: "focus-within:ring-amber-400/40",
  number:   "focus-within:ring-emerald-400/40",
  date:     "focus-within:ring-pink-400/40",
  checkbox: "focus-within:ring-indigo-400/40",
}

function FieldIcon({ type, className }: { type: FormFieldType; className?: string }) {
  const props = { className: cn("h-4 w-4", typeIconColor[type], className) }
  switch (type) {
    case "text":     return <Type {...props} />
    case "email":    return <Mail {...props} />
    case "select":   return <ChevronDown {...props} />
    case "textarea": return <AlignLeft {...props} />
    case "number":   return <Hash {...props} />
    case "date":     return <Calendar {...props} />
    case "checkbox": return <CheckSquare {...props} />
    default:         return <Type {...props} />
  }
}

/* ------------------------------------------------------------------ */
/*  Validation formatter                                              */
/* ------------------------------------------------------------------ */

function formatValidation(v?: FormFieldValidation): string[] {
  if (!v) return []
  const rules: string[] = []
  if (v.minLength != null) rules.push(`min ${v.minLength} chars`)
  if (v.maxLength != null) rules.push(`max ${v.maxLength} chars`)
  if (v.pattern) rules.push("pattern")
  if (v.min != null) rules.push(`min: ${v.min}`)
  if (v.max != null) rules.push(`max: ${v.max}`)
  return rules
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function AgentFormGenerator({
  formTitle = "Customer Feedback Form",
  formDescription = "AI-generated form to collect structured customer feedback across product experience, satisfaction, and follow-up preferences.",
  fields,
  isGenerating = false,
  showPreview = true,
  className,
  onAddField,
  onRemoveField,
  onRegenerate,
  onExportSchema,
  onFieldReorder,
}: AgentFormGeneratorProps) {
  const defaultFields: FormField[] = React.useMemo(
    () => [
      { id: "f1", label: "Full Name", type: "text", placeholder: "Jane Doe", required: true, validation: { minLength: 2, maxLength: 80 } },
      { id: "f2", label: "Email Address", type: "email", placeholder: "jane@company.com", required: true, validation: { pattern: "^[^@]+@[^@]+$" } },
      { id: "f3", label: "Rating", type: "select", placeholder: "Select a rating", required: true, options: ["Excellent", "Good", "Average", "Poor"] },
      { id: "f4", label: "Comments", type: "textarea", placeholder: "Tell us more about your experience...", required: false, validation: { maxLength: 500 } },
      { id: "f5", label: "Age", type: "number", placeholder: "25", required: false, validation: { min: 1, max: 120 } },
      { id: "f6", label: "Preferred Date", type: "date", placeholder: "YYYY-MM-DD", required: false },
      { id: "f7", label: "Subscribe to updates", type: "checkbox", required: false },
    ],
    []
  )

  const displayFields = fields && fields.length > 0 ? fields : defaultFields
  const requiredCount = displayFields.filter((f) => f.required).length
  const estimatedMinutes = Math.max(1, Math.ceil(displayFields.length * 0.4))

  const [hoveredFieldId, setHoveredFieldId] = React.useState<string | null>(null)

  return (
    <TooltipProvider>
      <div className={cn("relative w-full", className)}>
        {/* ============================================================ */}
        {/* Header                                                       */}
        {/* ============================================================ */}
        <div className="mb-6 space-y-3">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                <span className="relative flex h-5 w-5 items-center justify-center rounded-md bg-zinc-900 dark:bg-zinc-100">
                  <Sparkles className="h-3 w-3 text-white dark:text-zinc-900" />
                </span>
                Form Builder Agent
              </div>
              <h2 className="text-lg font-semibold tracking-tight">{formTitle}</h2>
              <p className="text-sm text-muted-foreground/80 max-w-lg leading-relaxed">{formDescription}</p>
            </div>

            {/* Stats capsule */}
            <div className="flex shrink-0 items-center gap-3 rounded-full border bg-muted/30 px-4 py-2 text-xs text-muted-foreground backdrop-blur-sm">
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-foreground">{displayFields.length} fields</span>
                  <span className="h-3 w-px bg-border" />
                  <Clock className="h-3 w-3" />
                  <span>~{estimatedMinutes} min</span>
                  <span className="h-3 w-px bg-border" />
                  <span>{requiredCount} required</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Two-panel layout                                             */}
        {/* ============================================================ */}
        <div className={cn(
          "grid gap-0 overflow-hidden rounded-xl border shadow-sm",
          showPreview ? "lg:grid-cols-[1fr,1fr]" : "lg:grid-cols-1"
        )}>
          {/* ---------------------------------------------------------- */}
          {/* Left: Field Palette                                        */}
          {/* ---------------------------------------------------------- */}
          <div className="flex flex-col border-b lg:border-b-0 lg:border-r bg-muted/20">
            {/* Palette header */}
            <div className="flex items-center justify-between border-b px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground/5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-foreground">
                    <rect x="0" y="0" width="5" height="5" rx="1" fill="currentColor" opacity="0.5"/>
                    <rect x="7" y="0" width="5" height="5" rx="1" fill="currentColor" opacity="0.3"/>
                    <rect x="0" y="7" width="5" height="5" rx="1" fill="currentColor" opacity="0.3"/>
                    <rect x="7" y="7" width="5" height="5" rx="1" fill="currentColor" opacity="0.5"/>
                  </svg>
                </div>
                <span className="text-sm font-medium">Field Palette</span>
              </div>
              <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                {displayFields.length} items
              </Badge>
            </div>

            {/* Field cards */}
            <ScrollArea className="h-[480px]">
              <div className="space-y-2 p-4">
                {displayFields.map((field, index) => {
                  const rules = formatValidation(field.validation)
                  const isHovered = hoveredFieldId === field.id
                  return (
                    <div
                      key={field.id}
                      className={cn(
                        "group relative flex items-start gap-3 rounded-lg border p-3 transition-all duration-200 cursor-grab active:cursor-grabbing",
                        typeGradient[field.type],
                        isHovered
                          ? "ring-2 ring-blue-200/50 dark:ring-blue-500/30 shadow-md scale-[1.01]"
                          : "hover:shadow-sm border-black/[0.04] dark:border-white/[0.06]"
                      )}
                      onMouseEnter={() => setHoveredFieldId(field.id)}
                      onMouseLeave={() => setHoveredFieldId(null)}
                    >
                      {/* Drag handle */}
                      <div className="mt-0.5 flex flex-col items-center gap-px shrink-0 opacity-40 group-hover:opacity-70 transition-opacity">
                        <GripVertical className="h-4 w-4 text-foreground/50" />
                      </div>

                      {/* Field type icon */}
                      <div className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-white/80 dark:bg-black/20 shadow-sm",
                        "border-black/[0.06] dark:border-white/[0.08]"
                      )}>
                        <FieldIcon type={field.type} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{field.label}</span>
                          {field.required && (
                            <span className="text-red-500 text-xs font-bold">*</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                            typePillColor[field.type]
                          )}>
                            {field.type}
                          </span>
                          {field.options && field.options.length > 0 && (
                            <span className="text-[10px] text-muted-foreground/70 truncate">
                              {field.options.length} options
                            </span>
                          )}
                        </div>
                        {/* Validation tag pills */}
                        {(rules.length > 0 || field.required) && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {field.required && (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                required
                              </span>
                            )}
                            {rules.map((rule) => (
                              <span
                                key={rule}
                                className="inline-flex items-center rounded-full bg-foreground/[0.06] px-1.5 py-0.5 text-[9px] font-normal text-muted-foreground"
                              >
                                {rule}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Delete button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                            onClick={() => onRemoveField?.(field.id)}
                          >
                            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500 transition-colors" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="text-xs">Remove field</TooltipContent>
                      </Tooltip>

                      {/* Connection dot on right edge */}
                      <div className={cn(
                        "absolute -right-[5px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-2 border-background shadow-sm transition-all duration-200",
                        typeDotColor[field.type],
                        isHovered ? "scale-125" : "scale-100"
                      )} />
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* Right: Live Preview                                        */}
          {/* ---------------------------------------------------------- */}
          {showPreview && (
            <div className="flex flex-col bg-zinc-50/80 dark:bg-zinc-950">
              {/* Preview header */}
              <div className="flex items-center justify-between border-b px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium">Live Preview</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
                </div>
              </div>

              {/* Preview form */}
              <ScrollArea className="h-[480px]">
                <div className="p-6">
                  {/* Paper card */}
                  <div className={cn(
                    "mx-auto max-w-md rounded-xl border bg-white p-6 shadow-lg dark:bg-zinc-900 dark:border-zinc-800",
                    "ring-1 ring-black/[0.03] dark:ring-white/[0.05]"
                  )}>
                    {/* Form header in preview */}
                    <div className="mb-6 space-y-1 text-center">
                      <h3 className="text-base font-semibold">{formTitle}</h3>
                      <p className="text-xs text-muted-foreground">
                        {displayFields.length} fields &middot; ~{estimatedMinutes} min to complete
                      </p>
                    </div>

                    {/* Rendered form fields */}
                    <div className="space-y-5">
                      {displayFields.map((field) => (
                        <div
                          key={field.id}
                          className={cn(
                            "space-y-1.5 rounded-lg p-3 transition-all duration-200 -mx-1",
                            hoveredFieldId === field.id
                              ? "bg-blue-50/60 dark:bg-blue-950/20 ring-1 ring-blue-200/60 dark:ring-blue-800/40"
                              : ""
                          )}
                          onMouseEnter={() => setHoveredFieldId(field.id)}
                          onMouseLeave={() => setHoveredFieldId(null)}
                        >
                          {field.type !== "checkbox" && (
                            <Label className="text-xs font-medium text-foreground/80">
                              {field.label}
                              {field.required && <span className="ml-0.5 text-red-500">*</span>}
                            </Label>
                          )}
                          {field.type === "textarea" ? (
                            <textarea
                              className={cn(
                                "flex min-h-[72px] w-full rounded-lg border border-input bg-white/80 dark:bg-zinc-800/60 px-3 py-2 text-sm",
                                "placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 transition-shadow",
                                typePreviewAccent[field.type]
                              )}
                              placeholder={field.placeholder}
                              readOnly
                            />
                          ) : field.type === "select" ? (
                            <div className={cn(
                              "relative flex h-9 w-full items-center rounded-lg border border-input bg-white/80 dark:bg-zinc-800/60 px-3 text-sm transition-shadow",
                              typePreviewAccent[field.type]
                            )}>
                              <span className="text-muted-foreground/50 flex-1 truncate">{field.placeholder || "Select..."}</span>
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                            </div>
                          ) : field.type === "checkbox" ? (
                            <label className="flex items-center gap-2.5 cursor-pointer">
                              <div className={cn(
                                "flex h-4 w-4 items-center justify-center rounded border border-input bg-white/80 dark:bg-zinc-800/60 transition-shadow",
                                typePreviewAccent[field.type]
                              )}>
                                <CheckSquare className="h-3 w-3 text-indigo-500 opacity-0" />
                              </div>
                              <span className="text-sm text-foreground/70">{field.label}</span>
                            </label>
                          ) : (
                            <Input
                              type={field.type}
                              placeholder={field.placeholder}
                              readOnly
                              className={cn(
                                "h-9 rounded-lg bg-white/80 dark:bg-zinc-800/60 border-input text-sm",
                                "placeholder:text-muted-foreground/50 focus-visible:ring-2 transition-shadow",
                                typePreviewAccent[field.type]
                              )}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Submit button */}
                    <div className="mt-6">
                      <Button className="w-full h-10 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 text-sm font-medium shadow-sm transition-all">
                        Submit
                      </Button>
                    </div>

                    {/* Footer */}
                    <p className="mt-4 text-center text-[10px] text-muted-foreground/40">
                      Powered by Form Builder Agent
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* Floating action bar                                          */}
        {/* ============================================================ */}
        <div className="mt-4 flex items-center justify-center">
          <div className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-1.5 shadow-lg",
            "bg-white/80 backdrop-blur-xl dark:bg-zinc-900/80",
            "ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
          )}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  className="h-8 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 px-4 text-xs font-medium shadow-sm"
                  onClick={onAddField}
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Add field
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Add a new form field</TooltipContent>
            </Tooltip>

            <div className="h-5 w-px bg-border mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={onRegenerate}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Regenerate form</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={onExportSchema}
                >
                  <FileJson className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Export JSON schema</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={() => navigator.clipboard?.writeText(formTitle ?? "")}
                >
                  <ClipboardCopy className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Copy form code</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

AgentFormGenerator.displayName = "AgentFormGenerator"
