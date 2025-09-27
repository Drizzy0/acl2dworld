"use client";
import { useState } from "react";
import { mockOrders } from "@/data/adminData";
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
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const filteredOrders = orders
    .filter(o => o.userEmail.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b[sortBy]) - new Date(a[sortBy]));

  const handleUpdateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    toast.success("Status updated!");
  };

  const handleDelete = (id) => {
    if (confirm("Delete order?")) {
      setOrders(orders.filter(o => o.id !== id));
      toast.error("Order deleted!");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Manage Orders</h1>
        <Input 
          placeholder="Search by email..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="max-w-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="p-3 text-left cursor-pointer" onClick={() => setSortBy("id")}>ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left cursor-pointer" onClick={() => setSortBy("date")}>Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.userEmail}</td>
                <td className="p-3">${order.total}</td>
                <td className="p-3">
                  <Badge variant={statusColors[order.status]}>{order.status}</Badge>
                </td>
                <td className="p-3">{order.date}</td>
                <td className="p-3 space-x-2">
                  <select 
                    defaultValue={order.status} 
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="p-1 border rounded text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(order.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No orders found.</p>}
      </div>
    </div>
  );
}