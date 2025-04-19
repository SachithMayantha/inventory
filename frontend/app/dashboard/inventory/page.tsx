import { InventoryOverview } from "@/components/inventory-overview"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage your restaurant's inventory items and stock levels</p>
        </div>
      </div>
      <InventoryOverview />
    </div>
  )
}

