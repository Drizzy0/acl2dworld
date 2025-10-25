"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import {
  getAllProducts,
  getAllOrders,
  databases,
  DATABASE_ID,
  USERS_COLLECTION_ID,
} from "@/lib/appwrite";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [salesData, setSalesData] = useState([]);

  function calculateMonthlySales(orders) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const salesByMonth = {};
    const currentDate = new Date();

    for (let i = 4; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthKey = months[date.getMonth()];
      salesByMonth[monthKey] = 0;
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.$createdAt);
      const monthKey = months[orderDate.getMonth()];
      if (salesByMonth.hasOwnProperty(monthKey)) {
        salesByMonth[monthKey] += order.total;
      }
    });

    return Object.entries(salesByMonth).map(([month, sales]) => ({
      month,
      sales,
    }));
  }

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        const usersResponse = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID
        );

        const products = await getAllProducts();

        const orders = await getAllOrders();

        const revenue = orders.reduce((sum, order) => sum + order.total, 0);

        const monthlySales = calculateMonthlySales(orders);

        setStats({
          totalUsers: usersResponse.documents.length,
          totalOrders: orders.length,
          totalRevenue: revenue,
          totalProducts: products.length,
        });

        setSalesData(monthlySales);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl md:text-4xl font-bold text-primary">
              {stats.totalUsers}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl md:text-4xl font-bold text-green-600">
              {stats.totalOrders}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl md:text-4xl font-bold text-blue-600">
              ${stats.totalRevenue}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl md:text-4xl font-bold text-purple-600">
              {stats.totalProducts}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Sales Overview (Last 5 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}