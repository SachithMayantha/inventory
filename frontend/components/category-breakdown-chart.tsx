"use client"

import { useState, useEffect } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/components/ui/chart"
import { apiService } from "@/lib/api-service"
import { AlertCircle } from "lucide-react"

interface CategoryData {
  name: string
  value: number
  color: string
}

export function CategoryBreakdownChart() {
  const [data, setData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const chartData = await apiService.getCategoryBreakdownData()
        setData(chartData)

        // If we got data but it's from the mock data, show a notification
        if (chartData && chartData.length > 0 && chartData[0].name === mockCategoryData[0].name) {
          setError("Could not connect to the server. Showing mock data instead.")
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error)
        // Always fall back to mock data
        setData(mockCategoryData)
        setError("Could not connect to the server. Showing mock data instead.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
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
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Category</span>
                          <span className="font-bold text-muted-foreground">{payload[0].name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                          <span className="font-bold">${payload[0].value}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:flex md:justify-center">
          {data.map((category) => (
            <div key={category.name} className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-sm">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Mock data for category breakdown
const mockCategoryData: CategoryData[] = [
  { name: "Produce", value: 3500, color: "#4CAF50" },
  { name: "Meat", value: 4200, color: "#F44336" },
  { name: "Dairy", value: 2100, color: "#2196F3" },
  { name: "Bakery", value: 1800, color: "#FFC107" },
  { name: "Pantry", value: 2800, color: "#9C27B0" },
]

