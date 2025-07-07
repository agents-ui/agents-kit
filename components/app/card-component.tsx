"use client"

import { cloneElement, useState } from "react"

type CardComponentProps = {
  children: React.ReactElement
  hasReTrigger?: boolean
}

export default function CardComponent({
  children,
  hasReTrigger,
}: CardComponentProps) {
  const [reTriggerKey, setReTriggerKey] = useState<number>(Date.now())

  const reTrigger = () => {
    setReTriggerKey(Date.now())
  }

  return (
    <div className="relative -mx-6 flex items-start justify-center border-y border-zinc-200 bg-white px-6 py-12 sm:mx-0 sm:rounded-lg sm:border sm:px-8 dark:border-white/10 dark:bg-zinc-900">
      {hasReTrigger && (
        <button
          className={`absolute top-3 right-4 cursor-pointer`}
          onClick={reTrigger}
        >
          r
        </button>
      )}
      {hasReTrigger ? cloneElement(children, { key: reTriggerKey }) : children}
    </div>
  )
}
