"use client";
import { useState } from "react";
import ResponsiveTable from "@/components/ui/responsive-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
const statusColors = {
  Pending: "default",
  Shipped: "secondary",
  Delivered: "default",
};
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const filteredOrders = orders
    .filter((o) => o.userEmail.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b[sortBy]) - new Date(a[sortBy]));
  const handleUpdateStatus = (id, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    toast.success("Status updated!");
  };
  const handleDelete = (id) => {
    if (confirm("Delete order?")) {
      setOrders(orders.filter((o) => o.id !== id));
      toast.error("Order deleted!");
    }
  };
  const columns = [
    { key: "id", label: "ID" },
    { key: "userEmail", label: "User" },
    { key: "total", label: "Total", render: (row) => `$${row.total}` },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={statusColors[row.status]}>{row.status}</Badge>
      ),
    },
    { key: "date", label: "Date" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          <select
            defaultValue={row.status}
            onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
            className="p-1 border rounded text-xs md:text-sm"
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <Button
            variant="destructive"
            size="xs"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          Manage Orders
        </h1>
        <Input
          placeholders={["Search by email..."]}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <ResponsiveTable columns={columns} data={filteredOrders} type="order" />
      </div>
    </div>
  );
}