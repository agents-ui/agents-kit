"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/prompt-kit/prompt-input"
import {
  BookTemplate,
  ChevronDown,
  FileText,
  Mic,
  Paperclip,
  Send,
  Settings,
  Sparkles,
  User,
} from "lucide-react"
import { useState } from "react"

export type PromptTemplate = {
  id: string
  name: string
  prompt: string
  description?: string
}

export type Persona = {
  id: string
  name: string
  avatar?: string
  systemPrompt: string
  description?: string
}

export interface AgentPromptComposerProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string, options?: { persona?: Persona; template?: PromptTemplate }) => void
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  templates?: PromptTemplate[]
  personas?: Persona[]
  showVoiceInput?: boolean
  showFileAttachment?: boolean
  showSettings?: boolean
  className?: string
}

export function AgentPromptComposer({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Ask anything...",
  disabled = false,
  isLoading = false,
  templates = [],
  personas = [],
  showVoiceInput = true,
  showFileAttachment = true,
  showSettings = true,
  className,
}: AgentPromptComposerProps) {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const handleSubmit = () => {
    if (value.trim() && !disabled && !isLoading) {
      onSubmit?.(value, {
        persona: selectedPersona || undefined,
      })
    }
  }

  const applyTemplate = (template: PromptTemplate) => {
    onChange?.(template.prompt)
  }

  const selectPersona = (persona: Persona | null) => {
    setSelectedPersona(persona)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Persona Selector */}
      {personas.length > 0 && (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <User className="h-3 w-3 mr-1" />
                {selectedPersona ? selectedPersona.name : "Default"}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Select Persona</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => selectPersona(null)}>
                <User className="h-4 w-4 mr-2" />
                <div className="flex-1">
                  <p className="font-medium">Default</p>
                  <p className="text-xs text-muted-foreground">Standard AI assistant</p>
                </div>
              </DropdownMenuItem>
              {personas.map((persona) => (
                <DropdownMenuItem
                  key={persona.id}
                  onClick={() => selectPersona(persona)}
                >
                  <User className="h-4 w-4 mr-2" />
                  <div className="flex-1">
                    <p className="font-medium">{persona.name}</p>
                    {persona.description && (
                      <p className="text-xs text-muted-foreground">{persona.description}</p>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {selectedPersona && (
            <span className="text-xs text-muted-foreground">
              Using {selectedPersona.name} persona
            </span>
          )}
        </div>
      )}

      {/* Main Input Area */}
      <PromptInput
        value={value}
        onValueChange={onChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        maxHeight={200}
      >
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <PromptInputTextarea 
              placeholder={placeholder}
              disabled={disabled}
            />
          </div>
          
          <PromptInputActions>
            {/* Templates */}
            {templates.length > 0 && (
              <DropdownMenu>
                <PromptInputAction tooltip="Use template">
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <BookTemplate className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </PromptInputAction>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Prompt Templates</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {templates.map((template) => (
                    <DropdownMenuItem
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                    >
                      <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium">{template.name}</p>
                        {template.description && (
                          <p className="text-xs text-muted-foreground">
                            {template.description}
                          </p>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* File Attachment */}
            {showFileAttachment && (
              <PromptInputAction tooltip="Attach file">
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </PromptInputAction>
            )}

            {/* Voice Input */}
            {showVoiceInput && (
              <PromptInputAction 
                tooltip={isRecording ? "Stop recording" : "Start voice input"}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn("h-8 w-8", isRecording && "text-red-500")}
                  onClick={toggleRecording}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </PromptInputAction>
            )}

            {/* Submit Button */}
            <PromptInputAction tooltip="Send message">
              <Button
                size="icon"
                disabled={!value.trim() || disabled || isLoading}
                onClick={handleSubmit}
                className="h-8 w-8"
              >
                {isLoading ? (
                  <Sparkles className="h-4 w-4 animate-pulse" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </div>
      </PromptInput>

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={() => onChange?.("")}
            disabled={!value || disabled || isLoading}
          >
            Clear
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={() => {
              const enhanced = `Please provide a detailed analysis of: ${value}`
              onChange?.(enhanced)
            }}
            disabled={!value || disabled || isLoading}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Enhance
          </Button>
        </div>
        
        {showSettings && (
          <Button size="sm" variant="ghost" className="h-7 text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Settings
          </Button>
        )}
      </div>
    </div>
  )
}
