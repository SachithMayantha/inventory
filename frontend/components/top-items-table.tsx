"use client"

import { useState, useEffect } from "react"
import { AlertCircle, ArrowUpDown } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiService } from "@/lib/api-service"

interface TopItem {
  id: string
  name: string
  category: string
  usageAmount: number
  usageUnit: string
  costPerUnit: number
  totalCost: number
}

export function TopItemsTable() {
  const [items, setItems] = useState<TopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiService.getTopItems()
        setItems(data)

        // If we got data but it's from the mock data, show a notification
        if (data && data.length > 0 && data[0].id === mockTopItems[0].id) {
          setError("Could not connect to the server. Showing mock data instead.")
        }
      } catch (error) {
        console.error("Failed to fetch top items:", error)
        // Always fall back to mock data
        setItems(mockTopItems)
        setError("Could not connect to the server. Showing mock data instead.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="w-full py-8 text-center">
        <div className="animate-pulse text-muted-foreground">Loading top items...</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-yellow-50 p-2 text-sm text-yellow-800">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Usage
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Cost Per Unit</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end">
                  Total Cost
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  {item.usageAmount} {item.usageUnit}
                </TableCell>
                <TableCell>${item.costPerUnit.toFixed(2)}</TableCell>
                <TableCell className="text-right">${item.totalCost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Mock data for top items
const mockTopItems: TopItem[] = [
  {
    id: "item1",
    name: "Chicken Breast",
    category: "Meat",
    usageAmount: 120,
    usageUnit: "kg",
    costPerUnit: 8.5,
    totalCost: 1020.0,
  },
  {
    id: "item2",
    name: "Fresh Tomatoes",
    category: "Produce",
    usageAmount: 85,
    usageUnit: "kg",
    costPerUnit: 3.25,
    totalCost: 276.25,
  },
  {
    id: "item3",
    name: "Olive Oil",
    category: "Pantry",
    usageAmount: 45,
    usageUnit: "liters",
    costPerUnit: 12.0,
    totalCost: 540.0,
  },
  {
    id: "item4",
    name: "Parmesan Cheese",
    category: "Dairy",
    usageAmount: 30,
    usageUnit: "kg",
    costPerUnit: 18.75,
    totalCost: 562.5,
  },
  {
    id: "item5",
    name: "Flour",
    category: "Bakery",
    usageAmount: 75,
    usageUnit: "kg",
    costPerUnit: 2.5,
    totalCost: 187.5,
  },
]

