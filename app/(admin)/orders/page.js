"use client";
import { useState, useEffect } from "react";
import ResponsiveTable from "@/components/ui/responsive-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/ui/confirm-modal";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderItems,
} from "@/lib/appwrite";

const statusColors = {
  Pending: "default",
  Paid: "secondary",
  Shipped: "secondary",
  Delivered: "default",
  Cancelled: "destructive",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    loadAllOrders();
  }, []);

  async function loadAllOrders() {
    try {
      setLoading(true);
      const allOrders = await getAllOrders();
      setOrders(allOrders);
      setFilteredOrders(allOrders);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);

      setOrders(
        orders.map((o) => (o.$id === orderId ? { ...o, status: newStatus } : o))
      );

      toast.success("Status updated!");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const confirmDeleteAction = async () => {
    try {
      await deleteOrder(confirmDelete);
      setOrders(orders.filter((o) => o.$id !== confirmDelete));
      toast.success("Order deleted!");
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast.error("Failed to delete order");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleViewDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    try {
      const items = await getOrderItems(orderId);
      setOrderItems({ ...orderItems, [orderId]: items });
      setExpandedOrder(orderId);
    } catch (error) {
      console.error("Failed to load order items:", error);
      toast.error("Failed to load order details");
    }
  };

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch = order.userEmail
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesDate = dateFilter
        ? new Date(order.$createdAt).toLocaleDateString() ===
          new Date(dateFilter).toLocaleDateString()
        : true;

      return matchesSearch && matchesDate;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, searchTerm, dateFilter]);

  const columns = [
    {
      key: "id",
      label: "Order ID",
      render: (row) => (
        <span className="text-xs md:text-sm font-mono">
          {row.$id.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: "userEmail",
      label: "Customer",
      render: (row) => (
        <span className="text-xs md:text-sm">{row.userEmail}</span>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (row) => (
        <span className="font-semibold">₦{row.total.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={statusColors[row.status] || "default"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (row) => (
        <span className="text-xs md:text-sm">
          {new Date(row.$createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <select
            value={row.status}
            onChange={(e) => handleUpdateStatus(row.$id, e.target.value)}
            className="px-2 py-1 border rounded text-xs md:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => handleViewDetails(row.$id)}
            className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            {expandedOrder === row.$id ? "Hide" : "Details"}
          </button>
          <button
            onClick={() => setConfirmDelete(row.$id)}
            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading orders...</p>
        </div>
      </div>
    );
  }

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
            Manage Orders
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total Orders: {orders.length}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholders={["Search by email..."]}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-sm"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              currentOrders.map((row) => (
                <>
                  <tr
                    key={row.$id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                  {expandedOrder === row.$id && orderItems[row.$id] && (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-4 py-4 bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm dark:text-white mb-2">
                            Order Items:
                          </h4>
                          {orderItems[row.$id].map((item) => (
                            <div
                              key={item.$id}
                              className="flex justify-between items-center text-sm dark:text-gray-300 border-b dark:border-gray-700 pb-2"
                            >
                              <span>
                                {item.name} x {item.quantity}
                              </span>
                              <span className="font-semibold">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteAction}
        title="Delete Order"
        message="Are you sure you want to delete this order? This will also delete all order items. This action cannot be undone."
        isDangerous={true}
      />
      {filteredOrders.length > ordersPerPage && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm dark:text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}