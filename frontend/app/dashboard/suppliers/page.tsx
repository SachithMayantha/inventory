import { SuppliersList } from "@/components/suppliers-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">Manage your restaurant's suppliers and vendor relationships</p>
        </div>
      </div>
      <SuppliersList />
    </div>
  )
}

