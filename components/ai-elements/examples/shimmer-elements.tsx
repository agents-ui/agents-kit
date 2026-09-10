"use client"

import { Shimmer } from "@/components/ai-elements/shimmer"

const Example = () => (
  <div className="flex flex-col gap-6 p-8">
    <div className="text-center">
      <p className="text-muted-foreground mb-3 text-sm">
        As paragraph (default)
      </p>
      <Shimmer as="p">This is rendered as a paragraph</Shimmer>
    </div>

    <div className="text-center">
      <p className="text-muted-foreground mb-3 text-sm">As heading</p>
      <Shimmer as="h2" className="text-2xl font-bold">
        Large Heading with Shimmer
      </Shimmer>
    </div>

    <div className="text-center">
      <p className="text-muted-foreground mb-3 text-sm">As span (inline)</p>
      <div>
        Processing your request{" "}
        <Shimmer as="span" className="inline">
          with AI magic
        </Shimmer>
        ...
      </div>
    </div>

    <div className="text-center">
      <p className="text-muted-foreground mb-3 text-sm">
        As div with custom styling
      </p>
      <Shimmer as="div" className="text-lg font-semibold">
        Custom styled shimmer text
      </Shimmer>
    </div>
  </div>
)

export default Example
