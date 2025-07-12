"use client"

import { AgentResponse } from "@/components/agents-ui/agent-response"

export default function AgentResponseBasic() {
  const message = `I've analyzed your request and here's what I found:

## Key Insights

1. **Performance Metrics**: The system is performing well with an average response time of 250ms
2. **User Engagement**: Active users have increased by 15% this month
3. **System Health**: All services are operational with 99.9% uptime

### Recommendations

Based on the analysis, I recommend:
- Implementing caching to further reduce response times
- Adding more interactive features to boost engagement
- Setting up automated monitoring for critical services

Let me know if you need more detailed information on any of these points.`

  return (
    <AgentResponse
      message={message}
      onRegenerate={() => console.log("Regenerate clicked")}
      onCopy={() => console.log("Copy clicked")}
    />
  )
}
