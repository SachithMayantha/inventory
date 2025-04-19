import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Edit, Package, ShoppingCart, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { IngredientUsageChart } from "@/components/ingredient-usage-chart"
import { RecipeUsageList } from "@/components/recipe-usage-list"

// Mock data for a single inventory item
const inventoryItem = {
  id: "INV001",
  name: "Fresh Tomatoes",
  category: "Produce",
  quantity: 12.5,
  unit: "kg",
  status: "Low Stock",
  expiryDate: "2023-06-15",
  lastUpdated: "2023-06-01",
  supplier: "Farm Fresh Produce",
  location: "Walk-in Refrigerator",
  minStockLevel: 20,
  costPerUnit: 2.5,
  description: "Fresh Roma tomatoes used in various dishes including pasta sauces, salads, and garnishes.",
}

interface InventoryItemPageProps {
  params: {
    id: string
  }
}

export default function InventoryItemPage({ params }: InventoryItemPageProps) {
  // In a real app, you would fetch the item data based on the ID
  // For demo purposes, we'll just check if the ID matches our mock data
  if (params.id !== inventoryItem.id) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800"
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800"
      case "Out of Stock":
        return "bg-red-100 text-red-800"
      case "Expiring Soon":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{inventoryItem.name}</h1>
        <Badge className={getStatusColor(inventoryItem.status)}>{inventoryItem.status}</Badge>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Order More
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>Detailed information about this inventory item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p>{inventoryItem.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Quantity</p>
                <p>
                  {inventoryItem.quantity} {inventoryItem.unit}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Minimum Stock Level</p>
                <p>
                  {inventoryItem.minStockLevel} {inventoryItem.unit}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Per Unit</p>
                <p>${inventoryItem.costPerUnit.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                <p>{inventoryItem.supplier}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Location</p>
                <p>{inventoryItem.location}</p>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                  <p>{new Date(inventoryItem.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p>{new Date(inventoryItem.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{inventoryItem.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Analytics</CardTitle>
            <CardDescription>Track how this item is being used</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Usage Trend</TabsTrigger>
                <TabsTrigger value="recipes">Recipes</TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <IngredientUsageChart />
              </TabsContent>
              <TabsContent value="recipes">
                <RecipeUsageList ingredientId={inventoryItem.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory History</CardTitle>
          <CardDescription>Track changes to this inventory item</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-2">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Stock Updated</p>
                  <span className="text-xs text-muted-foreground">June 1, 2023</span>
                </div>
                <p className="text-sm text-muted-foreground">Quantity changed from 20kg to 12.5kg (Used 7.5kg)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-green-100 p-2">
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">New Stock Received</p>
                  <span className="text-xs text-muted-foreground">May 25, 2023</span>
                </div>
                <p className="text-sm text-muted-foreground">Received 20kg from Farm Fresh Produce</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-yellow-100 p-2">
                <Edit className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Item Details Updated</p>
                  <span className="text-xs text-muted-foreground">May 20, 2023</span>
                </div>
                <p className="text-sm text-muted-foreground">Updated minimum stock level from 15kg to 20kg</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

