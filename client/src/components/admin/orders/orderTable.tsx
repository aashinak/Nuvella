"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getOrders } from "@/api/admin/product/product";

/* eslint-disable */
// Dummy order data
const dummyOrders = [
  { id: "1", customer: "john@example.com", status: "Pending", total: "$120" },
  { id: "2", customer: "jane@example.com", status: "Shipped", total: "$90" },
  { id: "3", customer: "mike@example.com", status: "Delivered", total: "$200" },
  { id: "4", customer: "anna@example.com", status: "Canceled", total: "$50" },
  // Add more orders if needed...
];

const statusColors: Record<string, string> = {
  Processing: "text-yellow-500",
  Shipped: "text-blue-500",
  Delivered: "text-green-500",
  Cancelled: "text-red-500",
};

const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const ordersPerPage = 10; // Display 10 orders per page

  const updateOrderStatus = (id: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order._id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(2024, i).toLocaleString("en-US", { month: "long" })
  );

  // Filter orders based on search input
  const filteredOrders = orders.filter((order) =>
    order.customerDetails.email.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate pagination details
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Reset to the first page whenever the search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Function to generate and download the PDF sales report
  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Customer Email", "Total", "Status"];
    const tableRows: any[] = [];

    // Option: Include all filtered orders, or use `orders` to include all
    orders.forEach((order) => {
      const orderData = [order.id, order.customer, order.total, order.status];
      tableRows.push(orderData);
    });

    // Add title to the PDF
    doc.setFontSize(18);
    doc.text("Sales Report", 14, 22);

    // Generate table using autoTable plugin
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    // Save the PDF
    doc.save("sales_report.pdf");
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await getOrders();
      setOrders(res.orders);
      console.log(res);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error fetching products:", error.message);
      } else {
        console.log("Error fetching products:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {/* Controls */}
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Search by customer email"
          value={search}
          onChange={handleSearchChange}
        />
        <Button variant="outline" onClick={downloadPDF}>
          Download Sales Report
        </Button>
      </div>
      <div>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer Email</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Current Status</TableHead>
            <TableHead>Update Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentOrders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.orderId}</TableCell>
              <TableCell>{order.customerDetails.email}</TableCell>
              <TableCell>₹{order.totalAmount}</TableCell>
              <TableCell className={statusColors[order.status]}>
                {order.status}
              </TableCell>
              <TableCell>
                <Select
                  disabled={order.status === "Cancelled"}
                  onValueChange={(value) => updateOrderStatus(order._id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button variant="outline">View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-4 space-x-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span className="flex items-center">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
/* eslint-disable */