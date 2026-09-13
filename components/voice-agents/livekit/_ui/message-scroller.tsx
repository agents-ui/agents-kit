"use client"

import { cn } from "@/lib/utils"
import { ArrowDownIcon } from "lucide-react"
import * as React from "react"
import { Button } from "./button"

type ScrollerContextValue = {
  autoScroll: boolean
  atEnd: boolean
  atEndRef: React.RefObject<boolean>
  atStart: boolean
  defaultScrollPosition: "first" | "last" | "last-anchor"
  scrollEdgeThreshold: number
  scrollMargin: number
  scrollPreviousItemPeek: number
  setAtEnd: (atEnd: boolean) => void
  setAtStart: (atStart: boolean) => void
  viewportRef: React.RefObject<HTMLDivElement | null>
}

const ScrollerContext = React.createContext<ScrollerContextValue | null>(null)

export interface MessageScrollerProviderProps {
  children?: React.ReactNode
  autoScroll?: boolean
  scrollMargin?: number
  defaultScrollPosition?: "first" | "last" | "last-anchor"
  scrollEdgeThreshold?: number
  scrollPreviousItemPeek?: number
}

function MessageScrollerProvider({
  children,
  autoScroll = true,
  defaultScrollPosition = "last-anchor",
  scrollEdgeThreshold = 8,
  scrollMargin = 0,
  scrollPreviousItemPeek = 0,
}: MessageScrollerProviderProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const atEndRef = React.useRef(true)
  const [atEnd, setAtEnd] = React.useState(true)
  const [atStart, setAtStart] = React.useState(true)
  const updateAtEnd = React.useCallback((nextAtEnd: boolean) => {
    atEndRef.current = nextAtEnd
    setAtEnd(nextAtEnd)
  }, [])
  return (
    <ScrollerContext.Provider
      value={{
        autoScroll,
        atEnd,
        atEndRef,
        atStart,
        defaultScrollPosition,
        scrollEdgeThreshold,
        scrollMargin,
        scrollPreviousItemPeek,
        setAtEnd: updateAtEnd,
        setAtStart,
        viewportRef,
      }}
    >
      {children}
    </ScrollerContext.Provider>
  )
}

function useScroller() {
  const context = React.useContext(ScrollerContext)
  if (!context) {
    throw new Error(
      "MessageScroller components require MessageScrollerProvider"
    )
  }
  return context
}

function MessageScroller({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-scroller"
      className={cn(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function MessageScrollerViewport({
  className,
  preserveScrollOnPrepend = false,
  onScroll,
  style,
  ...props
}: React.ComponentProps<"div"> & { preserveScrollOnPrepend?: boolean }) {
  const {
    atEndRef,
    autoScroll,
    defaultScrollPosition,
    scrollEdgeThreshold,
    scrollMargin,
    scrollPreviousItemPeek,
    setAtEnd,
    setAtStart,
    viewportRef,
  } = useScroller()

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const update = () => {
      const atEnd =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <=
        scrollEdgeThreshold
      setAtEnd(atEnd)
      setAtStart(viewport.scrollTop <= scrollEdgeThreshold)
    }
    if (defaultScrollPosition === "last-anchor") {
      const anchors = viewport.querySelectorAll<HTMLElement>(
        '[data-scroll-anchor="true"]'
      )
      const anchor = anchors.item(anchors.length - 1)
      if (anchor) anchor.scrollIntoView({ block: "end" })
      else viewport.scrollTop = viewport.scrollHeight
    } else if (defaultScrollPosition === "last") {
      viewport.scrollTop = viewport.scrollHeight
    }
    let previousScrollHeight = viewport.scrollHeight
    const observer = new MutationObserver((records) => {
      const nextScrollHeight = viewport.scrollHeight
      const prepended = records.some(
        (record) =>
          record.type === "childList" &&
          record.addedNodes.length > 0 &&
          (record.previousSibling === null ||
            (record.previousSibling instanceof HTMLElement &&
              record.previousSibling.dataset.slot ===
                "message-scroller-spacer"))
      )
      if (preserveScrollOnPrepend && prepended) {
        viewport.scrollTop += nextScrollHeight - previousScrollHeight
      } else if (autoScroll && atEndRef.current) {
        viewport.scrollTo({ top: nextScrollHeight })
      }
      previousScrollHeight = nextScrollHeight
      update()
    })
    observer.observe(viewport, { childList: true, subtree: true })
    update()
    return () => observer.disconnect()
  }, [
    atEndRef,
    autoScroll,
    defaultScrollPosition,
    preserveScrollOnPrepend,
    scrollEdgeThreshold,
    setAtEnd,
    setAtStart,
    viewportRef,
  ])

  return (
    <div
      ref={viewportRef}
      data-slot="message-scroller-viewport"
      className={cn(
        "size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain",
        className
      )}
      style={{
        scrollPaddingBlockStart: scrollPreviousItemPeek,
        scrollPaddingBlockEnd: scrollMargin,
        ...style,
      }}
      onScroll={(event) => {
        const viewport = event.currentTarget
        setAtEnd(
          viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <=
            scrollEdgeThreshold
        )
        setAtStart(viewport.scrollTop <= scrollEdgeThreshold)
        onScroll?.(event)
      }}
      {...props}
    />
  )
}

function MessageScrollerContent({
  className,
  spacerClassName,
  children,
  ...props
}: React.ComponentProps<"div"> & { spacerClassName?: string }) {
  return (
    <div
      data-slot="message-scroller-content"
      className={cn("flex min-h-full flex-col gap-8", className)}
      {...props}
    >
      {spacerClassName ? (
        <div
          aria-hidden="true"
          data-slot="message-scroller-spacer"
          className={cn("flex-1", spacerClassName)}
        />
      ) : null}
      {children}
    </div>
  )
}

function MessageScrollerItem({
  className,
  messageId,
  scrollAnchor,
  ...props
}: React.ComponentProps<"div"> & {
  messageId?: string
  scrollAnchor?: boolean
}) {
  return (
    <div
      data-slot="message-scroller-item"
      data-message-id={messageId}
      data-scroll-anchor={scrollAnchor || undefined}
      className={cn("min-w-0 shrink-0", className)}
      {...props}
    />
  )
}

export interface MessageScrollerButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "children"> {
  behavior?: ScrollBehavior
  direction?: "start" | "end"
  render?: React.ReactElement
  children?: React.ReactNode
}

function MessageScrollerButton({
  behavior = "smooth",
  direction = "end",
  className,
  children,
  render,
  onClick,
  ...props
}: MessageScrollerButtonProps) {
  const { atEnd, atStart, viewportRef } = useScroller()
  const inactive = direction === "end" ? atEnd : atStart
  return (
    <Button
      asChild={Boolean(render)}
      type="button"
      aria-hidden={inactive}
      tabIndex={inactive ? -1 : 0}
      className={cn(
        "bg-background absolute left-1/2 -translate-x-1/2 border transition-[opacity,transform] duration-200",
        direction === "end" ? "bottom-4" : "top-4",
        inactive && "pointer-events-none translate-y-2 opacity-0",
        className
      )}
      onClick={(event) => {
        const viewport = viewportRef.current
        viewport?.scrollTo({
          top: direction === "end" ? viewport.scrollHeight : 0,
          behavior,
        })
        onClick?.(event)
      }}
      {...props}
    >
      {render ?? (
        <>
          {children ?? (
            <ArrowDownIcon
              className={cn(direction === "start" && "rotate-180")}
            />
          )}
          <span className="sr-only">
            {direction === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </>
      )}
    </Button>
  )
}

export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
}
