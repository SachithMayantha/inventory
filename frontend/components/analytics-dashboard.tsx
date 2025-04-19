"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Calendar, DollarSign, TrendingDown, TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiService, checkApiAvailability } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import { InventoryUsageChart } from "@/components/inventory-usage-chart"
import { CategoryBreakdownChart } from "@/components/category-breakdown-chart"
import { TopItemsTable } from "@/components/top-items-table"

interface AnalyticsSummary {
  totalSpent: number
  totalItems: number
  averageCost: number
  wastagePercentage: number
  spendingTrend: "up" | "down"
  spendingChange: number
  wasteTrend: "up" | "down"
  wasteChange: number
}

export function AnalyticsDashboard() {
  const { toast } = useToast()
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("month")
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check API availability on component mount
  useEffect(() => {
    const checkApi = async () => {
      const isAvailable = await checkApiAvailability()
      setApiAvailable(isAvailable)

      if (!isAvailable) {
        setError("Could not connect to the server. Showing mock data instead.")
        toast({
          title: "Connection Error",
          description: "Could not connect to the backend server. Using mock data instead.",
          variant: "destructive",
        })
      }
    }

    checkApi()
  }, [toast])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)

        // If we already know the API is unavailable, don't try to fetch
        if (apiAvailable === false) {
          setSummary(mockSummary)
          setError("Could not connect to the server. Showing mock data instead.")
          return
        }

        const data = await apiService.getAnalyticsSummary(timeframe)
        setSummary(data)

        // If we got data but it's from the mock data, show a notification
        if (data && data.totalSpent === mockSummary.totalSpent) {
          setError("Could not connect to the server. Showing mock data instead.")
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
        // Always fall back to mock data
        setSummary(mockSummary)
        setError("Could not connect to the server. Showing mock data instead.")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeframe, apiAvailable])

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value)
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-yellow-50 p-3 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">Connection Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="month" value={timeframe} onValueChange={handleTimeframeChange}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="quarter">This Quarter</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <TabsContent value="week" className="space-y-6">
          <AnalyticsSummaryCards summary={summary} loading={loading} />
        </TabsContent>
        <TabsContent value="month" className="space-y-6">
          <AnalyticsSummaryCards summary={summary} loading={loading} />
        </TabsContent>
        <TabsContent value="quarter" className="space-y-6">
          <AnalyticsSummaryCards summary={summary} loading={loading} />
        </TabsContent>
        <TabsContent value="year" className="space-y-6">
          <AnalyticsSummaryCards summary={summary} loading={loading} />
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Usage Over Time</CardTitle>
            <CardDescription>Track how your inventory is being used</CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryUsageChart timeframe={timeframe} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Inventory distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBreakdownChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Items by Usage</CardTitle>
          <CardDescription>Most frequently used inventory items</CardDescription>
        </CardHeader>
        <CardContent>
          <TopItemsTable />
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsSummaryCards({ summary, loading }: { summary: AnalyticsSummary | null; loading: boolean }) {
  if (loading || !summary) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.totalSpent.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {summary.spendingTrend === "up" ? (
              <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
            )}
            <span className={summary.spendingTrend === "up" ? "text-red-500" : "text-green-500"}>
              {summary.spendingChange}% from previous period
            </span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items Purchased</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalItems}</div>
          <p className="text-xs text-muted-foreground">Avg. cost: ${summary.averageCost.toFixed(2)} per item</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wastage</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.wastagePercentage}%</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {summary.wasteTrend === "up" ? (
              <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
            )}
            <span className={summary.wasteTrend === "up" ? "text-red-500" : "text-green-500"}>
              {summary.wasteChange}% from previous period
            </span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85%</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              5% improvement
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Mock data to use as fallback if API fails
const mockSummary: AnalyticsSummary = {
  totalSpent: 12450.75,
  totalItems: 345,
  averageCost: 36.09,
  wastagePercentage: 8.5,
  spendingTrend: "up",
  spendingChange: 4.2,
  wasteTrend: "down",
  wasteChange: 2.1,
}

