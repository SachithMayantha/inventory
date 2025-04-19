"use client";

import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

import { DropdownMenuContent } from "@/components/ui/dropdown-menu";

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { DropdownMenu } from "@/components/ui/dropdown-menu";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
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
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/lib/api-service";
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
import { Checkbox } from "@/components/ui/checkbox";

interface Supplier {
  supplier_id: number;
  company: string;
  contact_person: string;
  email: string;
  mobile: string;
  address: string;
  status: "Active" | "Inactive" | "Pending";
  categories: string;
}

export function SuppliersList() {
  const router = useRouter();
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddSupplierDialogOpen, setIsAddSupplierDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    company: "",
    contact_person: "",
    email: "",
    mobile: "",
    address: "",
    categories: [] as string[],
    status: "Active" as "Active" | "Inactive" | "Pending",
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSuppliers();
        if (data && Array.isArray(data)) {
          setSuppliers(data);
        }
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
        toast({
          title: "Error",
          description: "Failed to load suppliers. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [toast]);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.categories.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter) {
      return matchesSearch && supplier.status === statusFilter;
    }

    return matchesSearch;
  });

  const handleCardClick = (id: number) => {
    router.push(`/dashboard/suppliers/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddSupplier = async () => {
    if (!newSupplier.company || !newSupplier.email || !newSupplier.mobile) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const supplierData = {
        ...newSupplier,
        categories: newSupplier.categories.join(","),
      };

      const response = await apiService.postSupplier(supplierData);
      if (response) {
        toast({
          title: "Success",
          description: `${newSupplier.company} has been added to your suppliers`,
        });
        // Refresh the suppliers list
        const updatedSuppliers = await apiService.getSuppliers();
        if (updatedSuppliers && Array.isArray(updatedSuppliers)) {
          setSuppliers(updatedSuppliers);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add supplier",
        variant: "destructive",
      });
    }

    setIsAddSupplierDialogOpen(false);
    setNewSupplier({
      company: "",
      contact_person: "",
      email: "",
      mobile: "",
      address: "",
      categories: [],
      status: "Active",
    });
  };

  const toggleCategory = (category: string) => {
    setNewSupplier((prev) => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter((c) => c !== category),
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category],
        };
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Suppliers</CardTitle>
            <CardDescription>
              Manage your inventory suppliers and vendors
            </CardDescription>
          </div>
          <Dialog
            open={isAddSupplierDialogOpen}
            onOpenChange={setIsAddSupplierDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>
                  Enter the details of the new supplier below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier-name" className="text-right">
                    Company Name
                  </Label>
                  <Input
                    id="supplier-name"
                    value={newSupplier.company}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        company: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact-name" className="text-right">
                    Contact Person
                  </Label>
                  <Input
                    id="contact-name"
                    value={newSupplier.contact_person}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        contact_person: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, email: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={newSupplier.mobile}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, mobile: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={newSupplier.address}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        address: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Categories</Label>
                  <div className="col-span-3 flex flex-wrap gap-2">
                    {[
                      "Produce",
                      "Meat",
                      "Dairy",
                      "Seafood",
                      "Bakery",
                      "Pantry",
                      "Spices",
                    ].map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={newSupplier.categories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={newSupplier.status}
                    onValueChange={(value: "Active" | "Inactive" | "Pending") =>
                      setNewSupplier({ ...newSupplier, status: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddSupplierDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddSupplier}>Add Supplier</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8"
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
                  checked={statusFilter === null}
                  onCheckedChange={() => setStatusFilter(null)}
                >
                  All Suppliers
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "Active"}
                  onCheckedChange={() =>
                    setStatusFilter(statusFilter === "Active" ? null : "Active")
                  }
                >
                  Active Only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "Pending"}
                  onCheckedChange={() =>
                    setStatusFilter(
                      statusFilter === "Pending" ? null : "Pending"
                    )
                  }
                >
                  Pending Only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "Inactive"}
                  onCheckedChange={() =>
                    setStatusFilter(
                      statusFilter === "Inactive" ? null : "Inactive"
                    )
                  }
                >
                  Inactive Only
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No suppliers found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSuppliers.map((supplier) => (
              <Card
                key={supplier.supplier_id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCardClick(supplier.supplier_id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {supplier.company}
                      </CardTitle>
                      <CardDescription>
                        {supplier.contact_person}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(supplier.status)}>
                      {supplier.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{supplier.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{supplier.mobile}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{supplier.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-wrap gap-1">
                        {supplier.categories.split(",").map((category) => (
                          <Badge
                            key={category}
                            variant="outline"
                            className="text-xs"
                          >
                            {category.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
