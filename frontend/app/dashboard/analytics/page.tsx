import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Track inventory usage, costs, and trends over time</p>
      </div>
      <AnalyticsDashboard />
    </div>
  )
}

