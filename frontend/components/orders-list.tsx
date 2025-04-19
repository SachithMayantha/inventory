"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Filter,
  Search,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  apiService,
  checkApiAvailability,
  fetchData,
  postData,
} from "@/lib/api-service";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Order {
  order_id: string;
  name: string;
  category: string;
  supplier: string;
  created: string;
  delivery: string;
  status: "Requested" | "In Transit" | "Delivered" | "Cancelled";
  quantity: string;
  unit: string;
  price: string;
}

interface SupplierName {
  company: string;
}

export function OrdersList() {
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchData<Order[]>("/order/getAll");
        if (data && Array.isArray(data)) {
          setOrders(data);
        } else {
          setError("Failed to fetch orders from the server");
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Could not connect to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchSupplierNames = async () => {
      try {
        const data = await apiService.getSupplierNames();
        if (data && Array.isArray(data)) {
          setSupplierNames(data);
        }
      } catch (error) {
        console.error("Failed to fetch supplier names:", error);
        toast({
          title: "Error",
          description: "Failed to load supplier names",
          variant: "destructive",
        });
      }
    };

    fetchSupplierNames();
  }, [toast]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "requested")
      return matchesSearch && order.status === "Requested";
    if (activeTab === "delivered")
      return matchesSearch && order.status === "Delivered";
    return matchesSearch;
  });

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/orders/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Requested":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "In Transit":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateOrder = async () => {
    // Validate form
    if (
      !newOrder.name ||
      !newOrder.category ||
      !newOrder.supplier ||
      !newOrder.delivery ||
      !newOrder.quantity ||
      !newOrder.price
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await postData("/order/save", newOrder);
      if (response) {
        toast({
          title: "Success",
          description: `Order for ${newOrder.name} has been created`,
        });
        // Refresh the orders list
        const updatedOrders = await fetchData<Order[]>("/order/getAll");
        if (updatedOrders && Array.isArray(updatedOrders)) {
          setOrders(updatedOrders);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    }

    // Close dialog and reset form
    setIsNewOrderDialogOpen(false);
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
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              View and manage your inventory orders
            </CardDescription>
          </div>
          <Dialog
            open={isNewOrderDialogOpen}
            onOpenChange={setIsNewOrderDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <ShoppingCart className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </DialogTrigger>
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
                        <SelectItem
                          key={supplier.company}
                          value={supplier.company}
                        >
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
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="requested">Requested</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex justify-center">
                      <ShoppingCart className="h-8 w-8 animate-pulse text-muted-foreground" />
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      Loading orders...
                    </p>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-muted-foreground">No orders found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow
                    key={order.order_id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(order.order_id)}
                  >
                    <TableCell className="font-medium">
                      {order.order_id}
                    </TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.category}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>
                      <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                      {new Date(order.created).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.delivery
                        ? new Date(order.delivery).toLocaleDateString()
                        : "TBD"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.quantity} {order.unit}
                    </TableCell>
                    <TableCell className="text-right">${order.price}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
