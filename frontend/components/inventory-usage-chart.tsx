"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import { apiService } from "@/lib/api-service"
import { AlertCircle } from "lucide-react"

interface UsageData {
  date: string
  usage: number
}

interface InventoryUsageChartProps {
  timeframe: string
}

export function InventoryUsageChart({ timeframe }: InventoryUsageChartProps) {
  const [data, setData] = useState<UsageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const chartData = await apiService.getInventoryUsageData(timeframe)
        setData(chartData)

        // If we got data but it's from the mock data, show a notification
        if (chartData && chartData.length > 0 && chartData[0].date === getMockData(timeframe)[0].date) {
          setError("Could not connect to the server. Showing mock data instead.")
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
        // Always fall back to mock data
        setData(getMockData(timeframe))
        setError("Could not connect to the server. Showing mock data instead.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeframe])

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
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis label={{ value: "Usage (kg)", angle: -90, position: "insideLeft" }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                          <span className="font-bold text-muted-foreground">{payload[0].payload.date}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Usage</span>
                          <span className="font-bold">{payload[0].value} kg</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="usage"
              strokeWidth={2}
              activeDot={{
                r: 6,
                style: { fill: "var(--theme-primary)", opacity: 0.8 },
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Mock data generator based on timeframe
function getMockData(timeframe: string): UsageData[] {
  switch (timeframe) {
    case "week":
      return [
        { date: "Monday", usage: 25.5 },
        { date: "Tuesday", usage: 28.2 },
        { date: "Wednesday", usage: 32.1 },
        { date: "Thursday", usage: 30.5 },
        { date: "Friday", usage: 35.8 },
        { date: "Saturday", usage: 40.2 },
        { date: "Sunday", usage: 38.5 },
      ]
    case "month":
      return [
        { date: "Week 1", usage: 120.5 },
        { date: "Week 2", usage: 135.2 },
        { date: "Week 3", usage: 128.7 },
        { date: "Week 4", usage: 142.3 },
      ]
    case "quarter":
      return [
        { date: "January", usage: 450.5 },
        { date: "February", usage: 420.2 },
        { date: "March", usage: 480.7 },
      ]
    case "year":
      return [
        { date: "Q1", usage: 1250.5 },
        { date: "Q2", usage: 1320.2 },
        { date: "Q3", usage: 1180.7 },
        { date: "Q4", usage: 1420.3 },
      ]
    default:
      return [
        { date: "Week 1", usage: 120.5 },
        { date: "Week 2", usage: 135.2 },
        { date: "Week 3", usage: 128.7 },
        { date: "Week 4", usage: 142.3 },
      ]
  }
}

