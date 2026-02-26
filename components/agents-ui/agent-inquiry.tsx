"use client"

import * as React from "react"
import {
  Bot,
  Check,
  ChevronRight,
  Send,
  SkipForward,
  Star,
  User,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type InquiryType = "multipleChoice" | "text" | "confirmation" | "scale"

export interface Inquiry {
  id: string
  question: string
  type: InquiryType
  options?: string[]
  required?: boolean
}

export interface InquiryHistoryItem {
  question: string
  answer: string
  timestamp: string
}

export interface AgentInquiryProps {
  agentName?: string
  taskContext?: string
  inquiry?: Inquiry
  inquiryHistory?: InquiryHistoryItem[]
  remainingInquiries?: number
  className?: string
  onSubmit?: (inquiryId: string, answer: string) => void
  onSkip?: (inquiryId: string) => void
}

export function AgentInquiry({
  agentName,
  taskContext,
  inquiry,
  inquiryHistory,
  remainingInquiries,
  className,
  onSubmit,
  onSkip,
}: AgentInquiryProps) {
  const defaultInquiry: Inquiry = React.useMemo(
    () => ({
      id: "inq-1",
      question: "Which migration strategy do you prefer?",
      type: "multipleChoice",
      options: [
        "Blue-green deployment",
        "Rolling migration",
        "Canary release",
      ],
      required: true,
    }),
    []
  )

  const defaultHistory: InquiryHistoryItem[] = React.useMemo(
    () => [
      {
        question: "Should the migration include legacy tables?",
        answer: "Yes, include all legacy tables",
        timestamp: "2 min ago",
      },
      {
        question: "Preferred maintenance window?",
        answer: "Saturday 02:00-06:00 UTC",
        timestamp: "5 min ago",
      },
    ],
    []
  )

  const activeInquiry = inquiry ?? defaultInquiry
  const history = inquiryHistory ?? defaultHistory
  const remaining = remainingInquiries ?? 2
  const agent = agentName ?? "Migration Agent"
  const context = taskContext ?? "Database Migration Plan"

  const [selected, setSelected] = React.useState<string>("")
  const [textValue, setTextValue] = React.useState("")
  const [scaleValue, setScaleValue] = React.useState<number | null>(null)
  const [hoveredStar, setHoveredStar] = React.useState<number | null>(null)

  const currentAnswer =
    activeInquiry.type === "multipleChoice" || activeInquiry.type === "confirmation"
      ? selected
      : activeInquiry.type === "scale"
        ? scaleValue !== null
          ? String(scaleValue)
          : ""
        : textValue

  const canSubmit = activeInquiry.required ? currentAnswer.length > 0 : true
  const totalDecisions = history.length + remaining + 1
  const currentStep = history.length + 1
  const progressPercent = (currentStep / totalDecisions) * 100

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit?.(activeInquiry.id, currentAnswer)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canSubmit) {
      handleSubmit()
    }
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col w-full max-w-2xl mx-auto rounded-2xl border border-border/60 bg-background shadow-lg overflow-hidden",
          className
        )}
      >
        {/* Top bar: agent info + progress */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 shadow-sm">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold truncate">{agent}</span>
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800 text-[10px] px-1.5 py-0">
                Active
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              Working on: {context}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[11px] font-medium text-muted-foreground">
              Question {currentStep} of {totalDecisions}
            </span>
            <Progress
              value={progressPercent}
              className="h-1.5 w-20 bg-muted [&>div]:bg-zinc-900 dark:[&>div]:bg-zinc-100"
            />
          </div>
        </div>

        {/* Chat area with gradient background */}
        <ScrollArea className="flex-1 max-h-[420px] min-h-[200px]">
          <div className="bg-muted/30 px-4 py-4 space-y-4">

            {/* Chat history: alternating bubbles */}
            {history.length > 0 && (
              <div className="space-y-3">
                {history.map((item, i) => (
                  <React.Fragment key={i}>
                    {/* Agent question bubble (left) */}
                    <div className="flex items-start gap-2.5 max-w-[85%]">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 shadow-sm mt-0.5">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="relative">
                        <div className="absolute -left-1.5 top-2.5 w-3 h-3 bg-white dark:bg-muted/60 rotate-45 border-l border-b border-border/40" />
                        <div className="relative rounded-2xl rounded-tl-sm bg-white dark:bg-muted/60 border border-border/40 px-3.5 py-2.5 shadow-sm">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.question}
                          </p>
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 ml-1 mt-0.5 block">
                          {item.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* User answer bubble (right) */}
                    <div className="flex items-start gap-2.5 max-w-[85%] ml-auto flex-row-reverse">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-700 dark:bg-zinc-400 text-white shadow-sm mt-0.5">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <div className="relative">
                        <div className="absolute -right-1.5 top-2.5 w-3 h-3 bg-zinc-900 dark:bg-zinc-100 rotate-45" />
                        <div className="relative rounded-2xl rounded-tr-sm bg-zinc-900 dark:bg-zinc-100 px-3.5 py-2.5 shadow-sm">
                          <p className="text-sm text-white dark:text-zinc-900 font-medium leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-border/40" />
                  <span className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-wider">
                    Now
                  </span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
              </div>
            )}

            {/* Current question: agent chat bubble */}
            <div className="flex items-start gap-2.5 max-w-[85%]">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 shadow-sm mt-0.5">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="relative">
                <div className="absolute -left-1.5 top-2.5 w-3 h-3 bg-white dark:bg-muted/60 rotate-45 border-l border-b border-border/40" />
                <div className="relative rounded-2xl rounded-tl-sm bg-white dark:bg-muted/60 border border-border/40 px-3.5 py-2.5 shadow-sm">
                  <p className="text-sm font-medium leading-relaxed">
                    {activeInquiry.question}
                    {activeInquiry.required && (
                      <span className="inline-block ml-1.5 h-2 w-2 rounded-full bg-red-500 align-middle" />
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer area based on type */}
            <div className="pl-9">
              {/* Multiple choice: pill buttons */}
              {activeInquiry.type === "multipleChoice" && activeInquiry.options && (
                <div className="flex flex-wrap gap-2">
                  {activeInquiry.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelected(option)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border",
                        selected === option
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-sm scale-[1.02]"
                          : "bg-white dark:bg-muted/40 border-border/60 text-foreground hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:shadow-sm"
                      )}
                    >
                      {selected === option && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Scale: interactive stars */}
              {activeInquiry.type === "scale" && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => {
                      const filled = hoveredStar !== null ? n <= hoveredStar : scaleValue !== null && n <= scaleValue
                      return (
                        <Tooltip key={n}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => setScaleValue(n)}
                              onMouseEnter={() => setHoveredStar(n)}
                              onMouseLeave={() => setHoveredStar(null)}
                              className="p-1 transition-transform duration-150 hover:scale-110 focus:outline-none"
                            >
                              <Star
                                className={cn(
                                  "h-7 w-7 transition-colors duration-150",
                                  filled
                                    ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                                    : "fill-none text-muted-foreground/30"
                                )}
                              />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="text-xs">
                            {n} of 5
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                    {scaleValue !== null && (
                      <span className="ml-2 text-xs text-muted-foreground font-medium">
                        {scaleValue}/5
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Confirmation: large Yes/No cards */}
              {activeInquiry.type === "confirmation" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelected("Yes")}
                    className={cn(
                      "group flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-5 transition-all duration-200",
                      selected === "Yes"
                        ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 shadow-sm"
                        : "border-border/60 bg-white dark:bg-muted/30 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                        selected === "Yes"
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground group-hover:bg-emerald-100 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/40"
                      )}
                    >
                      <Check className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        selected === "Yes"
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-foreground"
                      )}
                    >
                      Yes, proceed
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelected("No")}
                    className={cn(
                      "group flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-5 transition-all duration-200",
                      selected === "No"
                        ? "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 shadow-sm"
                        : "border-border/60 bg-white dark:bg-muted/30 hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-900/10"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                        selected === "No"
                          ? "bg-red-500 text-white"
                          : "bg-muted text-muted-foreground group-hover:bg-red-100 group-hover:text-red-600 dark:group-hover:bg-red-900/40"
                      )}
                    >
                      <X className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        selected === "No"
                          ? "text-red-700 dark:text-red-300"
                          : "text-foreground"
                      )}
                    >
                      No, skip this
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Bottom: messenger-style input bar */}
        {activeInquiry.type === "text" ? (
          <div className="border-t border-border/50 bg-muted/20 px-3 py-3">
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background pl-4 pr-1.5 py-1 shadow-sm focus-within:ring-2 focus-within:ring-zinc-500/30 focus-within:border-zinc-400 transition-all">
              <Input
                placeholder="Type your response..."
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 h-9 text-sm placeholder:text-muted-foreground/60 px-0"
              />
              <Button
                size="sm"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className={cn(
                  "h-8 w-8 rounded-full p-0 shrink-0 transition-all",
                  canSubmit
                    ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm"
                    : "bg-muted"
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!activeInquiry.required && (
              <button
                type="button"
                onClick={() => onSkip?.(activeInquiry.id)}
                className="mt-2 ml-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipForward className="h-3 w-3" />
                Skip this question
              </button>
            )}
          </div>
        ) : (
          <div className="border-t border-border/50 bg-muted/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className={cn(
                  "h-9 rounded-full px-5 transition-all font-medium",
                  canSubmit
                    ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm"
                    : ""
                )}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit answer
              </Button>
              {!activeInquiry.required && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => onSkip?.(activeInquiry.id)}
                >
                  <SkipForward className="mr-1.5 h-3.5 w-3.5" />
                  Skip
                </Button>
              )}
              {remaining > 0 && (
                <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ChevronRight className="h-3 w-3" />
                  {remaining} more after this
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

AgentInquiry.displayName = "AgentInquiry"
