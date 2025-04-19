import { InventoryOverview } from "@/components/inventory-overview"
import { AlertsPanel } from "@/components/alerts-panel"
import { DashboardHeader } from "@/components/dashboard-header"
import { InventoryStats } from "@/components/inventory-stats"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <InventoryStats />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InventoryOverview />
        </div>
        <div>
          <AlertsPanel />
        </div>
      </div>
    </div>
  )
}

