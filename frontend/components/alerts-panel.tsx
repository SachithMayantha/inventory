"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Clock, ShoppingCart } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchData, postData } from "@/lib/api-service";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  inventory_id: number;
  name: string;
  category: string;
  quantity: string;
  unit: string;
  status: string;
  exp_date: string;
}

interface Alert {
  id: string;
  type: "low_stock" | "expiring" | "out_of_stock";
  title: string;
  description: string;
  time: string;
  priority: "high" | "medium";
  item: InventoryItem;
}

interface SupplierName {
  company: string;
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [supplierNames, setSupplierNames] = useState<SupplierName[]>([]);
  const [newOrder, setNewOrder] = useState({
    name: "",
    category: "Pantry",
    supplier: "",
    created: new Date().toISOString().split("T")[0],
    delivery: "",
    status: "Requested",
    quantity: "",
    unit: "Kg",
    price: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch low stock items
        const lowStockItems = await fetchData<InventoryItem[]>(
          "/inventory/low-stock-all"
        );

        // Fetch expiring soon items
        const expiringItems = await fetchData<InventoryItem[]>(
          "/inventory/expiring-soon-all"
        );

        // Fetch out of stock items
        const outOfStockItems = await fetchData<InventoryItem[]>(
          "/inventory/out-of-stock-all"
        );

        // Combine all alerts
        const allAlerts: Alert[] = [
          // Low stock alerts (medium priority)
          ...(lowStockItems || []).map((item, index) => ({
            id: `low_stock_${item.inventory_id}`,
            type: "low_stock" as const,
            title: "Low Stock Alert",
            description: `${item.name} is running low (${item.quantity} ${item.unit} remaining)`,
            time: "Recent",
            priority: "medium" as const,
            item,
          })),

          // Expiring soon alerts (medium priority)
          ...(expiringItems || []).map((item, index) => ({
            id: `expiring_${item.inventory_id}`,
            type: "expiring" as const,
            title: "Expiring Soon",
            description: `${item.name} expires on ${new Date(
              item.exp_date
            ).toLocaleDateString()}`,
            time: "Recent",
            priority: "medium" as const,
            item,
          })),

          // Out of stock alerts (high priority)
          ...(outOfStockItems || []).map((item, index) => ({
            id: `out_of_stock_${item.inventory_id}`,
            type: "out_of_stock" as const,
            title: "Out of Stock",
            description: `${item.name} is out of stock`,
            time: "Recent",
            priority: "high" as const,
            item,
          })),
        ];

        setAlerts(allAlerts);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
        setError("Failed to load alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  useEffect(() => {
    const fetchSupplierNames = async () => {
      try {
        const data = await fetchData<SupplierName[]>("/supplier/names");
        if (data && Array.isArray(data)) {
          setSupplierNames(data);
        }
      } catch (error) {
        console.error("Failed to fetch supplier names:", error);
      }
    };

    fetchSupplierNames();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "expiring":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "out_of_stock":
        return <ShoppingCart className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500";
      case "medium":
        return "border-l-4 border-yellow-500";
      default:
        return "";
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  const handleTakeAction = (alert: Alert) => {
    // Pre-fill the new order form with data from the alert
    setNewOrder({
      name: alert.item.name,
      category: alert.item.category,
      supplier: "",
      created: new Date().toISOString().split("T")[0],
      delivery: "",
      status: "Requested",
      quantity: alert.type === "out_of_stock" ? "10" : "5", // Default quantities
      unit: alert.item.unit,
      price: "",
    });

    // Open the new order dialog
    setIsNewOrderDialogOpen(true);
  };

  const handleCreateOrder = async () => {
    try {
      // Call the API to create a new order using postData
      const response = await postData("/order/save", newOrder);

      if (response) {
        // Show success toast
        toast({
          title: "Success",
          description: "Order created successfully",
        });

        // Close the dialog
        setIsNewOrderDialogOpen(false);

        // Reset the form
        setNewOrder({
          name: "",
          category: "Pantry",
          supplier: "",
          created: new Date().toISOString().split("T")[0],
          delivery: "",
          status: "Requested",
          quantity: "",
          unit: "Kg",
          price: "",
        });
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Alerts & Notifications</CardTitle>
          <CardDescription>Recent alerts for your inventory</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            // Loading skeletons
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="flex items-start gap-4 rounded-lg border bg-white p-3"
                >
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <div className="flex gap-2 pt-1">
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </div>
              ))
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No alerts at this time
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 rounded-lg border bg-white p-3 ${getPriorityColor(
                  alert.priority
                )}`}
              >
                <div className="mt-1">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{alert.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.description}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDismissAlert(alert.id)}
                    >
                      Dismiss
                    </Button>
                    <Button size="sm" onClick={() => handleTakeAction(alert)}>
                      Take Action
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
          <Button variant="outline" className="w-full">
            View All Alerts
          </Button>
        </CardContent>
      </Card>

      {/* New Order Dialog */}
      <Dialog
        open={isNewOrderDialogOpen}
        onOpenChange={setIsNewOrderDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              Enter the details for your new inventory order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Item Name
              </Label>
              <Input
                id="name"
                value={newOrder.name}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={newOrder.category}
                onValueChange={(value) =>
                  setNewOrder({ ...newOrder, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Produce">Produce</SelectItem>
                  <SelectItem value="Spices">Spices</SelectItem>
                  <SelectItem value="Pantry">Pantry</SelectItem>
                  <SelectItem value="Bakery">Bakery</SelectItem>
                  <SelectItem value="Meat">Meat</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Select
                value={newOrder.supplier}
                onValueChange={(value) =>
                  setNewOrder({ ...newOrder, supplier: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {supplierNames.map((supplier) => (
                    <SelectItem key={supplier.company} value={supplier.company}>
                      {supplier.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="delivery" className="text-right">
                Delivery Date
              </Label>
              <Input
                id="delivery"
                type="date"
                value={newOrder.delivery}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, delivery: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={newOrder.status}
                onValueChange={(value) =>
                  setNewOrder({ ...newOrder, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Requested">Requested</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={newOrder.quantity}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, quantity: e.target.value })
                }
                className="col-span-2"
              />
              <Select
                value={newOrder.unit}
                onValueChange={(value) =>
                  setNewOrder({ ...newOrder, unit: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kg">Kg</SelectItem>
                  <SelectItem value="Liters">Liters</SelectItem>
                  <SelectItem value="Units">Units</SelectItem>
                  <SelectItem value="Boxes">Boxes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newOrder.price}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, price: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewOrderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateOrder}>Create Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
