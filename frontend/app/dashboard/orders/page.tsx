import { OrdersList } from "@/components/orders-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage incoming and outgoing orders for your restaurant</p>
        </div>
      </div>
      <OrdersList />
    </div>
  )
}

