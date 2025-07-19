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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  Check,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface BettingEntry {
  id: string;
  numbers: string;
  amount: number;
  type: string;
}

interface FormData {
  stationNumberType: string;
  region: string;
  date: Date | undefined;
  customer1: string;
  customer1Type: string;
  customer2: string;
  customer2Type: string;
  bettingContent: string;
}

const stationOptions = [
  "Station-001-2D",
  "Station-002-3D",
  "Station-003-2D",
  "Station-004-3D",
  "Station-005-2D",
];

const customerTypes = ["Regular", "VIP", "New"];

const customers = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Sarah Wilson",
  "David Brown",
  "Lisa Chen",
  "Tom Wilson",
];

export default function AddEntry() {
  const [formData, setFormData] = useState<FormData>({
    stationNumberType: "",
    region: "",
    date: undefined,
    customer1: "",
    customer1Type: "",
    customer2: "",
    customer2Type: "",
    bettingContent: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [parsedEntries, setParsedEntries] = useState<BettingEntry[]>([]);

  const loadSampleData = () => {
    const sampleData = {
      stationNumberType: "Station-001-2D",
      region: "North",
      date: new Date(),
      customer1: "John Doe",
      customer1Type: "VIP",
      customer2: "Jane Smith",
      customer2Type: "Regular",
      bettingContent: `12, 45 500000 2D
123, 456 750000 3D
89, 90 300000 2D
234, 567 1000000 3D
78, 91 450000 2D
555, 666 800000 3D
11, 22 600000 2D
777, 888 950000 3D`,
    };

    setFormData(sampleData);
    setIsChecked(false);
    setValidationErrors([]);
    setParsedEntries([]);
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsChecked(false);
  };

  const validateAndParseBettingContent = () => {
    const errors: string[] = [];
    const entries: BettingEntry[] = [];

    // Required field validation
    if (!formData.stationNumberType) {
      errors.push("Station-Number-Type is required");
    }
    if (!formData.region) {
      errors.push("Region is required");
    }
    if (!formData.date) {
      errors.push("Date is required");
    }
    if (!formData.customer1) {
      errors.push("Customer 1 is required");
    }
    if (!formData.bettingContent.trim()) {
      errors.push("Betting content is required");
    }

    // Parse betting content
    if (formData.bettingContent.trim()) {
      const lines = formData.bettingContent
        .split("\n")
        .filter((line) => line.trim());

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const match = line.match(
          /^(\d+(?:,\s*\d+)*)\s+(\d+(?:,\d+)*)\s*(2D|3D)?/i,
        );

        if (match) {
          const numbers = match[1];
          const amount = parseInt(match[2].replace(/,/g, ""));
          const type =
            match[3] || formData.stationNumberType.includes("2D") ? "2D" : "3D";

          if (amount > 0) {
            entries.push({
              id: `entry-${i + 1}`,
              numbers,
              amount,
              type,
            });
          } else {
            errors.push(`Line ${i + 1}: Invalid amount`);
          }
        } else {
          errors.push(
            `Line ${i + 1}: Invalid format. Use "numbers amount type"`,
          );
        }
      }
    }

    setValidationErrors(errors);
    setParsedEntries(entries);
    setIsChecked(true);

    return errors.length === 0;
  };

  const handleCheck = () => {
    validateAndParseBettingContent();
  };

  const handleSave = () => {
    if (!isChecked) {
      validateAndParseBettingContent();
    }

    if (validationErrors.length === 0) {
      console.log("Saving entry:", { formData, parsedEntries });
      // Here you would typically send the data to your backend
      alert("Entry saved successfully!");
    }
  };

  const handleDelete = () => {
    setFormData({
      stationNumberType: "",
      region: "",
      date: undefined,
      customer1: "",
      customer1Type: "",
      customer2: "",
      customer2Type: "",
      bettingContent: "",
    });
    setParsedEntries([]);
    setIsChecked(false);
    setValidationErrors([]);
  };

  const calculateTotals = () => {
    const total = parsedEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const count = parsedEntries.length;
    const by2D = parsedEntries.filter((e) => e.type === "2D").length;
    const by3D = parsedEntries.filter((e) => e.type === "3D").length;

    return { total, count, by2D, by3D };
  };

  // Mock financial data - in real app this would come from backend
  const calculateFinancials = () => {
    const totalSpent = parsedEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0,
    );
    // Mock winnings calculation (in reality this would be based on actual lottery results)
    const mockWinRate = 0.15; // 15% win rate
    const winnings = Math.floor(
      totalSpent * mockWinRate * (1 + Math.random() * 0.5),
    );
    const profitLoss = winnings - totalSpent;
    const winPercentage = totalSpent > 0 ? (winnings / totalSpent) * 100 : 0;

    return {
      totalSpent,
      winnings,
      profitLoss,
      winPercentage,
      entries: parsedEntries.length,
      winningEntries: Math.floor(parsedEntries.length * mockWinRate),
    };
  };

  const totals = calculateTotals();

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
          <h1 className="text-2xl font-bold tracking-tight">Add Entry</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Form Section */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Entry Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Station-Number-Type */}
                  <div className="space-y-2">
                    <Label htmlFor="station">Station-Number-Type</Label>
                    <Select
                      value={formData.stationNumberType}
                      onValueChange={(value) =>
                        handleInputChange("stationNumberType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select station type" />
                      </SelectTrigger>
                      <SelectContent>
                        {stationOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Region */}
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) =>
                        handleInputChange("region", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="North">North</SelectItem>
                        <SelectItem value="Central">Central</SelectItem>
                        <SelectItem value="South">South</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? (
                            format(formData.date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => handleInputChange("date", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Customer 1 */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="customer1">Customer 1</Label>
                    <Select
                      value={formData.customer1}
                      onValueChange={(value) =>
                        handleInputChange("customer1", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer} value={customer}>
                            {customer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer1Type">Type</Label>
                    <Select
                      value={formData.customer1Type}
                      onValueChange={(value) =>
                        handleInputChange("customer1Type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Customer 2 (Optional) */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="customer2">Customer 2 (Optional)</Label>
                    <Select
                      value={formData.customer2}
                      onValueChange={(value) =>
                        handleInputChange("customer2", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {customers.map((customer) => (
                          <SelectItem key={customer} value={customer}>
                            {customer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer2Type">Type</Label>
                    <Select
                      value={formData.customer2Type}
                      onValueChange={(value) =>
                        handleInputChange("customer2Type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Betting Content - Priority Section */}
                <div className="space-y-2 md:col-span-3">
                  <Label
                    htmlFor="bettingContent"
                    className="text-base font-semibold"
                  >
                    Betting Content
                  </Label>
                  <Textarea
                    id="bettingContent"
                    placeholder="Enter betting data (Format: numbers amount type)&#10;Example:&#10;12, 45 500000 2D&#10;123, 456 750000 3D&#10;89, 90 300000 2D&#10;234, 567 1000000 3D"
                    value={formData.bettingContent}
                    onChange={(e) =>
                      handleInputChange("bettingContent", e.target.value)
                    }
                    className="min-h-[250px] font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground">
                    <strong>Format:</strong> numbers amount type (one per line)
                    | <strong>Tip:</strong> Copy/paste multiple entries for
                    faster input
                  </p>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" onClick={handleCheck}>
                      <Check className="mr-2 h-4 w-4" />
                      Check
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={!isChecked || validationErrors.length > 0}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Table - Show after Check/Save */}
            {isChecked && parsedEntries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Parsed Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Numbers</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedEntries.map((entry, index) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-mono">
                              {entry.numbers}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  entry.type === "2D" ? "default" : "secondary"
                                }
                              >
                                {entry.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(entry.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-green-600"
                              >
                                Valid
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {totals.count}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Entries
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(totals.total)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Amount
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {totals.by2D}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        2D Bets
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {totals.by3D}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        3D Bets
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Summary Table */}
            {isChecked && parsedEntries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const financials = calculateFinancials();
                    return (
                      <>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-semibold">
                                  Metric
                                </TableHead>
                                <TableHead className="font-semibold">
                                  Amount
                                </TableHead>
                                <TableHead className="font-semibold">
                                  Details
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">
                                  Số tiền đã mua
                                </TableCell>
                                <TableCell className="font-bold text-lg">
                                  {formatCurrency(financials.totalSpent)}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {financials.entries} entries
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">
                                  Số đã trúng
                                </TableCell>
                                <TableCell className="font-bold text-lg text-green-600">
                                  {formatCurrency(financials.winnings)}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {financials.winningEntries} winning entries
                                </TableCell>
                              </TableRow>
                              <TableRow
                                className={
                                  financials.profitLoss >= 0
                                    ? "bg-green-50 dark:bg-green-900/10"
                                    : "bg-red-50 dark:bg-red-900/10"
                                }
                              >
                                <TableCell className="font-medium">
                                  Lời/Lỗ
                                </TableCell>
                                <TableCell
                                  className={cn(
                                    "font-bold text-lg",
                                    financials.profitLoss >= 0
                                      ? "text-green-600"
                                      : "text-red-600",
                                  )}
                                >
                                  {financials.profitLoss >= 0 ? "+" : ""}
                                  {formatCurrency(financials.profitLoss)}
                                </TableCell>
                                <TableCell
                                  className={cn(
                                    "font-medium",
                                    financials.profitLoss >= 0
                                      ? "text-green-600"
                                      : "text-red-600",
                                  )}
                                >
                                  {financials.profitLoss >= 0 ? "Lời" : "Lỗ"}{" "}
                                  {financials.winPercentage.toFixed(1)}%
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {financials.entries}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-400">
                              Tổng entries
                            </div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {financials.winningEntries}
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-400">
                              Entries trúng
                            </div>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {(
                                (financials.winningEntries /
                                  financials.entries) *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                            <div className="text-sm text-purple-700 dark:text-purple-400">
                              Tỷ lệ trúng
                            </div>
                          </div>
                          <div
                            className={cn(
                              "p-4 rounded-lg text-center",
                              financials.profitLoss >= 0
                                ? "bg-green-50 dark:bg-green-900/20"
                                : "bg-red-50 dark:bg-red-900/20",
                            )}
                          >
                            <div
                              className={cn(
                                "text-2xl font-bold",
                                financials.profitLoss >= 0
                                  ? "text-green-600"
                                  : "text-red-600",
                              )}
                            >
                              {financials.winPercentage.toFixed(1)}%
                            </div>
                            <div
                              className={cn(
                                "text-sm",
                                financials.profitLoss >= 0
                                  ? "text-green-700 dark:text-green-400"
                                  : "text-red-700 dark:text-red-400",
                              )}
                            >
                              ROI
                            </div>
                          </div>
                        </div>

                        {/* Performance Indicator */}
                        <div className="mt-4 p-4 rounded-lg border-2 border-dashed">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-base">
                                Performance Status
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {financials.profitLoss >= 0
                                  ? "Đang có lãi với tổng số tiền trúng cao hơn số tiền đã mua"
                                  : "Đang bị lỗ, cần cải thiện chiến lược betting"}
                              </p>
                            </div>
                            <div
                              className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium",
                                financials.profitLoss >= 0
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
                              )}
                            >
                              {financials.profitLoss >= 0
                                ? "Profitable"
                                : "Loss"}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Validation Status */}
            {validationErrors.length > 0 ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div>
                    <p className="font-medium mb-2">Validation Errors:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-sm">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            ) : isChecked ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All validation checks passed! Ready to save.
                </AlertDescription>
              </Alert>
            ) : null}

            {/* Preview Card */}
            {isChecked && (
              <Card>
                <CardHeader>
                  <CardTitle>Entry Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Station:</span>{" "}
                      {formData.stationNumberType}
                    </div>
                    <div>
                      <span className="font-medium">Region:</span>{" "}
                      {formData.region}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {formData.date ? format(formData.date, "PPP") : ""}
                    </div>
                    <div>
                      <span className="font-medium">Customer 1:</span>{" "}
                      {formData.customer1}
                      {formData.customer1Type && (
                        <Badge variant="secondary" className="ml-2">
                          {formData.customer1Type}
                        </Badge>
                      )}
                    </div>
                    {formData.customer2 && formData.customer2 !== "none" && (
                      <>
                        <div>
                          <span className="font-medium">Customer 2:</span>{" "}
                          {formData.customer2}
                          {formData.customer2Type && (
                            <Badge variant="secondary" className="ml-2">
                              {formData.customer2Type}
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
