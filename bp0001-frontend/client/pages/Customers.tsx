import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Settings,
  Trash2,
  MapPin,
  Calendar,
  UserPlus,
  Filter,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  region: string;
  type: string;
  createdDate: string;
  totalBets: number;
  totalAmount: number;
  status: string;
  phone?: string;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    region: "North",
    type: "VIP",
    createdDate: "2024-01-10",
    totalBets: 25,
    totalAmount: 5000000,
    status: "Active",
    phone: "+84 123 456 789",
  },
  {
    id: "2",
    name: "Jane Smith",
    region: "Central",
    type: "Regular",
    createdDate: "2024-01-12",
    totalBets: 15,
    totalAmount: 3200000,
    status: "Active",
    phone: "+84 987 654 321",
  },
  {
    id: "3",
    name: "Mike Johnson",
    region: "South",
    type: "New",
    createdDate: "2024-01-15",
    totalBets: 3,
    totalAmount: 800000,
    status: "Active",
    phone: "+84 555 123 456",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    region: "North",
    type: "VIP",
    createdDate: "2024-01-08",
    totalBets: 45,
    totalAmount: 8500000,
    status: "Inactive",
    phone: "+84 333 777 888",
  },
  {
    id: "5",
    name: "David Brown",
    region: "Central",
    type: "Regular",
    createdDate: "2024-01-14",
    totalBets: 8,
    totalAmount: 1200000,
    status: "Active",
    phone: "+84 222 333 444",
  },
];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch = customer.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRegion =
      selectedRegion === "all" || customer.region === selectedRegion;
    const matchesType =
      selectedType === "all" || customer.type === selectedType;

    return matchesSearch && matchesRegion && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "VIP":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "Regular":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "New":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <Button size="sm" className="h-9">
            <UserPlus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 px-3">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[300px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Filter customers by region and type
                </SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <Select
                    value={selectedRegion}
                    onValueChange={setSelectedRegion}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="Central">Central</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="New">New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRegion("all");
                    setSelectedType("all");
                    setShowFilters(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground mb-3">
          {filteredCustomers.length} customers found
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto -mr-4 pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-card border rounded-lg p-3 space-y-2"
              >
                {/* Header Row */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm truncate">
                      {customer.name}
                    </h3>
                    <Badge
                      className={cn("text-xs", getStatusColor(customer.status))}
                    >
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {customer.region}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {customer.createdDate}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      {customer.totalBets}
                    </div>
                    <div className="text-xs text-muted-foreground">Bets</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary">
                      {formatCurrency(customer.totalAmount)}
                    </div>
                    <div className="text-xs text-muted-foreground">Amount</div>
                  </div>
                  <div>
                    <Badge
                      className={cn("text-xs", getTypeColor(customer.type))}
                    >
                      {customer.type}
                    </Badge>
                  </div>
                </div>

                {/* Contact Info */}
                {customer.phone && (
                  <div className="text-xs text-muted-foreground border-t pt-1">
                    📞 {customer.phone}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-2">
                No customers found
              </div>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add New Customer
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
