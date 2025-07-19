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
import { Input } from "@/components/ui/input";
import { CalendarIcon, Search, List, Grid } from "lucide-react";
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

interface ReportData {
  id: string;
  customer: string;
  region: string;
  gameType: string;
  totalAmount: number;
  totalBets: number;
  winAmount: number;
  date: string;
  winRate: number;
}

const mockReportData: ReportData[] = [
  {
    id: "1",
    customer: "John Doe",
    region: "North",
    gameType: "2D",
    totalAmount: 2500000,
    totalBets: 5,
    winAmount: 500000,
    date: "2024-01-15",
    winRate: 20,
  },
  {
    id: "2",
    customer: "Jane Smith",
    region: "Central",
    gameType: "3D",
    totalAmount: 1500000,
    totalBets: 2,
    winAmount: 750000,
    date: "2024-01-15",
    winRate: 50,
  },
  {
    id: "3",
    customer: "Mike Johnson",
    region: "South",
    gameType: "2D",
    totalAmount: 900000,
    totalBets: 3,
    winAmount: 0,
    date: "2024-01-14",
    winRate: 0,
  },
  {
    id: "4",
    customer: "Sarah Wilson",
    region: "North",
    gameType: "3D",
    totalAmount: 3000000,
    totalBets: 3,
    winAmount: 1200000,
    date: "2024-01-14",
    winRate: 40,
  },
];

export default function Reports() {
  const [viewType, setViewType] = useState<string>("table");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedGameType, setSelectedGameType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredData = mockReportData.filter((record) => {
    if (selectedRegion !== "all" && record.region !== selectedRegion) {
      return false;
    }
    if (selectedGameType !== "all" && record.gameType !== selectedGameType) {
      return false;
    }
    if (selectedDate && record.date !== format(selectedDate, "yyyy-MM-dd")) {
      return false;
    }
    if (
      searchQuery &&
      !record.customer.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const renderTableView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Report Data - Table View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Game Type</TableHead>
                <TableHead>Total Bets</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Win Amount</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {record.customer}
                    </TableCell>
                    <TableCell>{record.region}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                        {record.gameType}
                      </span>
                    </TableCell>
                    <TableCell>{record.totalBets}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(record.totalAmount)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrency(record.winAmount)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                          record.winRate > 30
                            ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/30"
                            : record.winRate > 0
                              ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/30"
                              : "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/30",
                        )}
                      >
                        {record.winRate}%
                      </span>
                    </TableCell>
                    <TableCell>{record.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No report data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const renderListView = () => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Report Data - List View</h3>
      {filteredData.length > 0 ? (
        filteredData.map((record) => (
          <Card key={record.id}>
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-lg">{record.customer}</h4>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                      {record.gameType}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {record.region} • {record.date}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Total Bets</div>
                    <div className="text-muted-foreground">
                      {record.totalBets}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Total Amount</div>
                    <div className="text-muted-foreground">
                      {formatCurrency(record.totalAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Win Amount</div>
                    <div className="text-green-600 font-medium">
                      {formatCurrency(record.winAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Win Rate</div>
                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                          record.winRate > 30
                            ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/30"
                            : record.winRate > 0
                              ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/30"
                              : "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/30",
                        )}
                      >
                        {record.winRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              No report data found.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <div className="text-sm text-muted-foreground">
            {filteredData.length} records
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* View Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">View As</label>
                <Select value={viewType} onValueChange={setViewType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">
                      <div className="flex items-center">
                        <Grid className="mr-2 h-4 w-4" />
                        Table
                      </div>
                    </SelectItem>
                    <SelectItem value="list">
                      <div className="flex items-center">
                        <List className="mr-2 h-4 w-4" />
                        List
                      </div>
                    </SelectItem>
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

              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Game Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Game Type</label>
                <Select
                  value={selectedGameType}
                  onValueChange={setSelectedGameType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="2D">2D</SelectItem>
                    <SelectItem value="3D">3D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {viewType === "table" ? renderTableView() : renderListView()}
      </div>
    </Layout>
  );
}
