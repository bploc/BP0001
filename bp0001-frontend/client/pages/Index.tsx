import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BettingRecord {
  id: string;
  customer: string;
  region: string;
  betType: string;
  amount: number;
  date: string;
  status: string;
  numbers: string;
  hasIncorrectInfo: boolean;
}

const mockBettingData: BettingRecord[] = [
  {
    id: "1",
    customer: "John Doe",
    region: "North",
    betType: "2D",
    amount: 500000,
    date: "2024-01-15",
    status: "Active",
    numbers: "12, 45",
    hasIncorrectInfo: false,
  },
  {
    id: "2",
    customer: "Jane Smith",
    region: "Central",
    betType: "3D",
    amount: 750000,
    date: "2024-01-15",
    status: "Active",
    numbers: "123, 456",
    hasIncorrectInfo: true,
  },
  {
    id: "3",
    customer: "Mike Johnson",
    region: "South",
    betType: "2D",
    amount: 300000,
    date: "2024-01-14",
    status: "Completed",
    numbers: "89, 90",
    hasIncorrectInfo: false,
  },
  {
    id: "4",
    customer: "Sarah Wilson",
    region: "North",
    betType: "3D",
    amount: 1000000,
    date: "2024-01-14",
    status: "Active",
    numbers: "234, 567",
    hasIncorrectInfo: false,
  },
  {
    id: "5",
    customer: "David Brown",
    region: "Central",
    betType: "2D",
    amount: 450000,
    date: "2024-01-13",
    status: "Cancelled",
    numbers: "78, 91",
    hasIncorrectInfo: true,
  },
];

export default function Index() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showIncorrectInfo, setShowIncorrectInfo] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredData = mockBettingData.filter((record) => {
    if (selectedCustomer !== "all" && record.customer !== selectedCustomer) {
      return false;
    }
    if (selectedRegion !== "all" && record.region !== selectedRegion) {
      return false;
    }
    if (selectedDate && record.date !== format(selectedDate, "yyyy-MM-dd")) {
      return false;
    }
    if (showIncorrectInfo && !record.hasIncorrectInfo) {
      return false;
    }
    return true;
  });

  const toggleRowSelection = (id: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const handleDeleteSelected = () => {
    if (selectedRows.size > 0) {
      console.log("Deleting records:", Array.from(selectedRows));
      setSelectedRows(new Set());
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Betting List</h1>
          <div className="text-sm text-muted-foreground">
            {filteredData.length} records
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Customer Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer</label>
                <Select
                  value={selectedCustomer}
                  onValueChange={setSelectedCustomer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {Array.from(
                      new Set(mockBettingData.map((record) => record.customer)),
                    ).map((customer) => (
                      <SelectItem key={customer} value={customer}>
                        {customer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Region Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Region</label>
                <Select
                  value={selectedRegion}
                  onValueChange={setSelectedRegion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="North">North</SelectItem>
                    <SelectItem value="Central">Central</SelectItem>
                    <SelectItem value="South">South</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Incorrect Info Checkbox */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter Options</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="incorrect-info"
                    checked={showIncorrectInfo}
                    onCheckedChange={setShowIncorrectInfo}
                  />
                  <label
                    htmlFor="incorrect-info"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Incorrect Info
                  </label>
                </div>
              </div>

              {/* Delete Button */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  disabled={selectedRows.size === 0}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedRows.size})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Betting Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Numbers</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((record) => (
                      <TableRow
                        key={record.id}
                        className={cn(
                          "cursor-pointer hover:bg-muted/50",
                          selectedRows.has(record.id) && "bg-muted",
                        )}
                        onClick={() => toggleRowSelection(record.id)}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.has(record.id)}
                            onChange={() => {}}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {record.customer}
                        </TableCell>
                        <TableCell>{record.region}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                            {record.betType}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {record.numbers}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(record.amount)}
                        </TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                              record.status === "Active" &&
                                "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/30",
                              record.status === "Completed" &&
                                "bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/30",
                              record.status === "Cancelled" &&
                                "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/30",
                            )}
                          >
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {record.hasIncorrectInfo && (
                            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/30">
                              Incorrect
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No betting records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
