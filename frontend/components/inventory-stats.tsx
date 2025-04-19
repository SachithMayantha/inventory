"use client";

import { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Package,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchData } from "@/lib/api-service";
import { Skeleton } from "@/components/ui/skeleton";

export function InventoryStats() {
  const [totalItems, setTotalItems] = useState<number | null>(null);
  const [lowStockItems, setLowStockItems] = useState<number | null>(null);
  const [expiringItems, setExpiringItems] = useState<number | null>(null);
  const [inventoryValue, setInventoryValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventoryStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch total inventory items
        const availableCount = await fetchData<number>("/inventory/available");
        if (availableCount !== null) {
          setTotalItems(availableCount);
        }

        // Fetch low stock items
        const lowStockCount = await fetchData<number>("/inventory/low-stock");
        if (lowStockCount !== null) {
          setLowStockItems(lowStockCount);
        }

        // Fetch expiring soon items
        const expiringCount = await fetchData<number>(
          "/inventory/expiring-soon"
        );
        if (expiringCount !== null) {
          setExpiringItems(expiringCount);
        }

        // Fetch inventory value
        const value = await fetchData<number>("/order/inventory-value");
        if (value !== null) {
          setInventoryValue(value);
        }
      } catch (error) {
        console.error("Failed to fetch inventory stats:", error);
        setError("Failed to load inventory statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Inventory Items
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : error ? (
            <div className="text-sm text-red-500">Error loading data</div>
          ) : (
            <>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  Current inventory count
                </span>
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : error ? (
            <div className="text-sm text-red-500">Error loading data</div>
          ) : (
            <>
              <div className="text-2xl font-bold">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  Items below threshold
                </span>
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Expiring Soon Items
          </CardTitle>
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : error ? (
            <div className="text-sm text-red-500">Error loading data</div>
          ) : (
            <>
              <div className="text-2xl font-bold">{expiringItems}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-500 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  Items expiring soon
                </span>
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : error ? (
            <div className="text-sm text-red-500">Error loading data</div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {inventoryValue !== null
                  ? `$${inventoryValue.toLocaleString()}`
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-500 flex items-center">
                  <DollarSign className="mr-1 h-3 w-3" />
                  Total inventory value
                </span>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
