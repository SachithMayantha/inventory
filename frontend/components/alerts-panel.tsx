import { AlertTriangle, Clock, ShoppingCart } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Alert {
  id: string
  type: "low_stock" | "expiring" | "order"
  title: string
  description: string
  time: string
  priority: "high" | "medium" | "low"
}

const alerts: Alert[] = [
  {
    id: "alert1",
    type: "low_stock",
    title: "Low Stock Alert",
    description: "Fresh Tomatoes are running low (12.5kg remaining)",
    time: "10 minutes ago",
    priority: "high",
  },
  {
    id: "alert2",
    type: "expiring",
    title: "Expiring Soon",
    description: "Milk expires in 2 days",
    time: "1 hour ago",
    priority: "medium",
  },
  {
    id: "alert3",
    type: "order",
    title: "Order Received",
    description: "New produce delivery scheduled for tomorrow",
    time: "3 hours ago",
    priority: "low",
  },
  {
    id: "alert4",
    type: "low_stock",
    title: "Out of Stock",
    description: "Fresh Basil is out of stock",
    time: "5 hours ago",
    priority: "high",
  },
  {
    id: "alert5",
    type: "expiring",
    title: "Expiring Today",
    description: "Chicken Breast expires today",
    time: "6 hours ago",
    priority: "high",
  },
]

export function AlertsPanel() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "expiring":
        return <Clock className="h-5 w-5 text-orange-500" />
      case "order":
        return <ShoppingCart className="h-5 w-5 text-green-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500"
      case "medium":
        return "border-l-4 border-yellow-500"
      case "low":
        return "border-l-4 border-green-500"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts & Notifications</CardTitle>
        <CardDescription>Recent alerts for your inventory</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start gap-4 rounded-lg border bg-white p-3 ${getPriorityColor(alert.priority)}`}
          >
            <div className="mt-1">{getAlertIcon(alert.type)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">{alert.title}</p>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{alert.description}</p>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm">
                  Dismiss
                </Button>
                <Button size="sm">Take Action</Button>
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  )
}

