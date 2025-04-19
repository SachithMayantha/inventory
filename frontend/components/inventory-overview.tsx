"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowUpDown, Clock, Filter, Plus } from "lucide-react";
import { fetchData, postData } from "@/lib/api-service";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

export function InventoryOverview() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({
    "All Items": true,
    "Low Stock": false,
    "Expiring Soon": false,
    "Out of Stock": false,
  });
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Dairy",
    quantity: "",
    unit: "Kg",
    status: "In Stock",
    exp_date: "",
  });

  // Fetch inventory data
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetchData<InventoryItem[]>("/inventory/getAll");
        if (response) {
          setInventoryItems(response);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch inventory data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryData();
  }, [toast]);

  // Handle filter changes
  const handleFilterChange = (filter: string) => {
    if (filter === "All Items") {
      // If "All Items" is clicked, toggle it and set all others to the opposite
      const newValue = !statusFilters["All Items"];
      setStatusFilters({
        "All Items": newValue,
        "Low Stock": false,
        "Expiring Soon": false,
        "Out of Stock": false,
      });
    } else {
      // If any other filter is clicked, turn off "All Items" and toggle that filter
      setStatusFilters({
        ...statusFilters,
        "All Items": false,
        [filter]: !statusFilters[filter],
      });

      // If no filters are selected, turn "All Items" back on
      const anyFilterSelected = Object.entries(statusFilters)
        .filter(([key]) => key !== "All Items")
        .some(
          ([_, value]) => value === true || statusFilters[filter] === false
        );

      if (!anyFilterSelected) {
        setStatusFilters((prev) => ({ ...prev, "All Items": true }));
      }
    }
  };

  // Apply filters to inventory data
  const filteredItems = inventoryItems.filter((item) => {
    // First apply search filter
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Then apply status filters
    if (statusFilters["All Items"]) {
      return matchesSearch;
    }

    return (
      matchesSearch &&
      ((statusFilters["Low Stock"] && item.status === "Low Stock") ||
        (statusFilters["Expiring Soon"] && item.status === "Expiring Soon") ||
        (statusFilters["Out of Stock"] && item.status === "Out of Stock"))
    );
  });

  const handleRowClick = (id: number) => {
    router.push(`/dashboard/inventory/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      case "Expiring Soon":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddItem = async () => {
    // Validate form
    if (
      !newItem.name ||
      !newItem.category ||
      !newItem.quantity ||
      !newItem.exp_date
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await postData("/inventory/save", newItem);
      if (response) {
        toast({
          title: "Success",
          description: `${newItem.name} has been added to inventory`,
        });
        // Refresh the inventory list
        const updatedItems = await fetchData<InventoryItem[]>(
          "/inventory/getAll"
        );
        if (updatedItems) {
          setInventoryItems(updatedItems);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to inventory",
        variant: "destructive",
      });
    }

    // Close dialog and reset form
    setIsAddItemDialogOpen(false);
    setNewItem({
      name: "",
      category: "Dairy",
      quantity: "",
      unit: "Kg",
      status: "In Stock",
      exp_date: "",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>
            Manage your restaurant inventory items
          </CardDescription>
        </div>
        <Dialog
          open={isAddItemDialogOpen}
          onOpenChange={setIsAddItemDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="ml-auto" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
              <DialogDescription>
                Enter the details of the new inventory item below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, category: value })
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
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: e.target.value })
                  }
                  className="col-span-2"
                />
                <Select
                  value={newItem.unit}
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, unit: value })
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
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newItem.status}
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Stock">In Stock</SelectItem>
                    <SelectItem value="Low Stock">Low Stock</SelectItem>
                    <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="exp_date" className="text-right">
                  Expiry Date
                </Label>
                <Input
                  id="exp_date"
                  type="date"
                  value={newItem.exp_date}
                  onChange={(e) =>
                    setNewItem({ ...newItem, exp_date: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddItemDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={statusFilters["All Items"]}
                    onCheckedChange={() => handleFilterChange("All Items")}
                  >
                    All Items
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilters["Low Stock"]}
                    onCheckedChange={() => handleFilterChange("Low Stock")}
                  >
                    Low Stock
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilters["Expiring Soon"]}
                    onCheckedChange={() => handleFilterChange("Expiring Soon")}
                  >
                    Expiring Soon
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilters["Out of Stock"]}
                    onCheckedChange={() => handleFilterChange("Out of Stock")}
                  >
                    Out of Stock
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Quantity
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Expiry Date
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading inventory data...
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow
                      key={item.inventory_id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRowClick(item.inventory_id)}
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status === "Low Stock" ||
                          item.status === "Expiring Soon" ? (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          ) : null}
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center">
                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                        {new Date(item.exp_date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
