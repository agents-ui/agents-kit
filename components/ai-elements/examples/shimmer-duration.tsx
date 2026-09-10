"use client"

import { Shimmer } from "@/components/ai-elements/shimmer"

const Example = () => (
  <div className="flex flex-col gap-6 p-8">
    <div className="text-center">
      <p className="text-muted-foreground mb-3 text-sm">Fast (1 second)</p>
      <Shimmer duration={1}>Loading quickly...</Shimmer>
    </div>

    <div className="text-center">
      <p className="text-muted-foreground mb-3 text-sm">Default (2 seconds)</p>
      <Shimmer duration={2}>Loading at normal speed...</Shimmer>
    </div>

    <div className="text-center">
      <p className="text-muted-foreground mb-3 text-sm">Slow (4 seconds)</p>
      <Shimmer duration={4}>Loading slowly...</Shimmer>
    </div>

    <div className="text-center">
      <p className="text-muted-foreground mb-3 text-sm">
        Very Slow (6 seconds)
      </p>
      <Shimmer duration={6}>Loading very slowly...</Shimmer>
    </div>
  </div>
)

export default Example
