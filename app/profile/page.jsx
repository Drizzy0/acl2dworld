"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Edit,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

const mockUser = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+234 123 456 789",
  avatar: "/images/num1.jpg",
  orders: [
    {
      id: "#1001",
      date: "2025-10-15",
      items: 2,
      total: 25000,
      status: "Delivered",
    },
    {
      id: "#1002",
      date: "2025-10-10",
      items: 1,
      total: 15000,
      status: "Pending",
    },
  ],
};

const ProfilePage = () => {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
    phone: mockUser.phone,
  });
  const [activeTab, setActiveTab] = useState("info");
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser({ ...user, ...formData });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  const tabs = [
    { id: "info", label: "Personal Info", icon: User },
    { id: "orders", label: "Order History", icon: ShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-8 dark:text-white"
        >
          My Profile
        </motion.h1>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-center mb-6">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-bold dark:text-white">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-black text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>

          <div className="md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {activeTab === "info" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold dark:text-white">
                    Personal Information
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                  >
                    <Edit size={20} />
                    <span>{isEditing ? "Cancel" : "Edit"}</span>
                  </button>
                </div>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold dark:text-white mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full p-3 rounded-lg border ${
                          isEditing
                            ? "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-black dark:focus:ring-white"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold dark:text-white mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full p-3 rounded-lg border ${
                          isEditing
                            ? "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-black dark:focus:ring-white"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold dark:text-white mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full p-3 rounded-lg border ${
                        isEditing
                          ? "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-black dark:focus:ring-white"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold dark:text-white mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full p-3 rounded-lg border ${
                        isEditing
                          ? "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-2 focus:ring-black dark:focus:ring-white"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    />
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleSave}
                      className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold"
                    >
                      Save Changes
                    </button>
                  )}
                </form>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold dark:text-white">
                  Order History
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left py-3 dark:text-white">
                          Order ID
                        </th>
                        <th className="text-left py-3 dark:text-white">Date</th>
                        <th className="text-left py-3 dark:text-white">
                          Items
                        </th>
                        <th className="text-right py-3 dark:text-white">
                          Total
                        </th>
                        <th className="text-left py-3 dark:text-white">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b dark:border-gray-700"
                        >
                          <td className="py-3">{order.id}</td>
                          <td className="py-3">{order.date}</td>
                          <td className="py-3">{order.items}</td>
                          <td className="py-3 text-right">
                            ₦{order.total.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {user.orders.length === 0 && (
                  <p className="text-center text-gray-600 dark:text-gray-300 py-8">
                    No orders yet. Start shopping!
                  </p>
                )}
              </motion.div>
            )}

            {activeTab === "wishlist" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold dark:text-white">Wishlist</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center"
                    >
                      <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <p className="font-semibold dark:text-white">Item {i}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        ₦5,000
                      </p>
                    </div>
                  ))}
                </div>
                {user.orders.length === 0 && (
                  <p className="text-center text-gray-600 dark:text-gray-300 py-8">
                    Your wishlist is empty.
                  </p>
                )}
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold dark:text-white">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium dark:text-white">
                      Change Password
                    </span>
                    <Link
                      href="/change-password"
                      className="text-black dark:text-white hover:underline"
                    >
                      Manage
                    </Link>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium dark:text-white">
                      Notification Preferences
                    </span>
                    <Link
                      href="/notifications"
                      className="text-black dark:text-white hover:underline"
                    >
                      Manage
                    </Link>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium dark:text-white">
                      Address Book
                    </span>
                    <Link
                      href="/addresses"
                      className="text-black dark:text-white hover:underline"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;