"use client"

import type {
  AgentFormGeneratorProps,
  FormField,
  FormFieldValidation,
} from "@/components/agents-ui/agent-form-generator"
import { Button } from "@/components/boardui/base/buttons/button"
import { Checkbox } from "@/components/boardui/base/checkbox/checkbox"
import { InputBase, TextField } from "@/components/boardui/base/input/input"
import { Label } from "@/components/boardui/base/input/label"
import { cx } from "@/components/boardui/utils/cx"
import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckSquare,
  FileJson,
  Hash,
  Mail,
  Plus,
  RefreshCw,
  Trash2,
  Type,
} from "lucide-react"

const fields0: FormField[] = [
  {
    id: "account",
    label: "Account name",
    type: "text",
    placeholder: "Northwind",
    required: true,
    validation: { minLength: 2, maxLength: 80 },
  },
  {
    id: "email",
    label: "Account owner email",
    type: "email",
    placeholder: "owner@company.com",
    required: true,
    validation: { pattern: "^[^@]+@[^@]+$" },
  },
  {
    id: "risk",
    label: "Renewal risk",
    type: "select",
    required: true,
    options: ["Low", "Medium", "High"],
  },
  {
    id: "action",
    label: "Recommended action",
    type: "textarea",
    placeholder: "Describe the next action",
    required: true,
    validation: { maxLength: 500 },
  },
  { id: "date", label: "Due date", type: "date" },
  { id: "notify", label: "Notify account owner", type: "checkbox" },
]
const icons = {
  text: Type,
  email: Mail,
  select: AlignLeft,
  textarea: AlignLeft,
  number: Hash,
  date: Calendar,
  checkbox: CheckSquare,
}
function rules(v?: FormFieldValidation) {
  return [
    v?.minLength != null ? `Minimum ${v.minLength} characters` : null,
    v?.maxLength != null ? `Maximum ${v.maxLength} characters` : null,
    v?.pattern ? "Pattern validation" : null,
    v?.min != null ? `Minimum ${v.min}` : null,
    v?.max != null ? `Maximum ${v.max}` : null,
  ]
    .filter(Boolean)
    .join(" · ")
}
function Preview({ f }: { f: FormField }) {
  if (f.type === "checkbox") return <Checkbox size="sm">{f.label}</Checkbox>
  if (f.type === "textarea")
    return (
      <label className="block text-xs font-medium">
        {f.label}
        <textarea
          className="bg-background-tertiary-default mt-1 min-h-20 w-full rounded-lg p-3 text-sm"
          placeholder={f.placeholder}
        />
      </label>
    )
  if (f.type === "select")
    return (
      <label className="block text-xs font-medium">
        {f.label}
        <select className="border-separator-border bg-background-primary-default mt-1 h-9 w-full rounded-lg border px-3 text-sm">
          {f.options?.map((x) => <option key={x}>{x}</option>)}
        </select>
      </label>
    )
  return (
    <TextField isRequired={f.required}>
      <Label isRequired={f.required}>{f.label}</Label>
      <InputBase
        type={f.type}
        placeholder={f.placeholder}
        minLength={f.validation?.minLength}
        maxLength={f.validation?.maxLength}
        pattern={f.validation?.pattern}
        min={f.validation?.min}
        max={f.validation?.max}
      />
    </TextField>
  )
}
export function FormGenerator({
  formTitle = "Renewal action request",
  formDescription = "Collect the owner, risk level, and next action.",
  fields,
  isGenerating = false,
  showPreview = true,
  onAddField,
  onRemoveField,
  onRegenerate,
  onExportSchema,
  onFieldReorder,
  className,
}: AgentFormGeneratorProps) {
  const data = fields?.length ? fields : fields0
  const move = (i: number, d: number) => {
    const j = i + d
    if (j < 0 || j >= data.length) return
    const ids = data.map((x) => x.id)
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    onFieldReorder?.(ids)
  }
  return (
    <section
      className={cx(
        "border-separator-border bg-background-primary-default overflow-hidden rounded-xl border",
        className
      )}
    >
      <header className="border-separator-border flex flex-wrap justify-between gap-3 border-b p-5">
        <div>
          <h2 className="text-lg font-semibold">Form builder</h2>
          <p className="text-text-secondary mt-1 text-sm">
            {formTitle} · {formDescription}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            leadingIcon={RefreshCw}
            onClick={onRegenerate}
          >
            Regenerate
          </Button>
          <Button
            variant="secondary"
            size="small"
            leadingIcon={FileJson}
            onClick={onExportSchema}
          >
            Export schema
          </Button>
        </div>
      </header>
      {isGenerating && (
        <p className="border-separator-border text-text-secondary border-b px-5 py-2 text-xs">
          Generating schema
        </p>
      )}
      <div className={cx("grid", showPreview && "lg:grid-cols-[3fr_2fr]")}>
        <div className="p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-sm font-medium">Fields</h3>
              <p className="text-text-secondary text-xs">
                Order and validation
              </p>
            </div>
            <Button
              variant="secondary"
              size="small"
              leadingIcon={Plus}
              onClick={onAddField}
            >
              Add field
            </Button>
          </div>
          <div className="divide-separator-border border-separator-border mt-3 divide-y border-y">
            {data.map((f, i) => {
              const I = icons[f.type]
              return (
                <div
                  key={f.id}
                  className="grid grid-cols-[20px_1fr_auto] gap-3 py-3"
                >
                  <I className="text-text-secondary mt-1 size-4" />
                  <div>
                    <p className="text-sm font-medium">
                      {f.label}{" "}
                      <span className="border-separator-border text-text-secondary ml-2 rounded-sm border px-1.5 py-0.5 text-xs font-normal">
                        {f.type}
                      </span>
                    </p>
                    <p className="text-text-secondary mt-1 text-xs">
                      {f.required ? "Required" : "Optional"}
                      {rules(f.validation) ? ` · ${rules(f.validation)}` : ""}
                    </p>
                  </div>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="xs"
                      iconOnly
                      disabled={i === 0}
                      onClick={() => move(i, -1)}
                      aria-label={`Move ${f.label} up`}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      iconOnly
                      disabled={i === data.length - 1}
                      onClick={() => move(i, 1)}
                      aria-label={`Move ${f.label} down`}
                    >
                      <ArrowDown />
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      iconOnly
                      onClick={() => onRemoveField?.(f.id)}
                      aria-label={`Remove ${f.label}`}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {showPreview && (
          <aside className="border-separator-border border-t p-5 lg:border-t-0 lg:border-l">
            <h3 className="text-base font-semibold">{formTitle}</h3>
            <p className="text-text-secondary mt-1 text-sm">
              {formDescription}
            </p>
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              {data.map((f) => (
                <div key={f.id}>
                  <Preview f={f} />
                </div>
              ))}
              <div className="border-separator-border flex justify-end border-t pt-4">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </aside>
        )}
      </div>
      <p className="border-separator-border text-text-secondary border-t p-4 text-xs">
        {data.length} fields · {data.filter((x) => x.required).length} required
        · Schema version 1
      </p>
    </section>
  )
}
