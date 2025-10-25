"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/ui/confirm-modal";
import { useUser } from "@/contexts/UserContext";
import {
  databases,
  storage,
  DATABASE_ID,
  USERS_COLLECTION_ID,
  ADDRESSES_COLLECTION_ID,
  ORDERS_COLLECTION_ID,
  ORDER_ITEMS_COLLECTION_ID,
  ALLFILES_BUCKET_ID,
  Query,
  setUserRole,
} from "@/lib/appwrite";

export default function AdminUsers() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    loadUsers(page);
  }, [page]);

  async function loadUsers() {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.orderDesc("$createdAt")]
      );
      setUsers(response.documents);
      setFilteredUsers(response.documents);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const handleRoleChange = async (userId, docId, newRole) => {
    try {
      await setUserRole(userId, docId, newRole);
      setUsers(
        users.map((u) => (u.$id === docId ? { ...u, role: newRole } : u))
      );
      toast.success("Role updated successfully!");
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
    }
  };

  const confirmDeleteUser = (user) => {
    if (user.userId === currentUser?.document?.userId) {
      toast.error("You cannot delete your own account from here!");
      return;
    }
    setConfirmDelete(user);
  };

  const handleDeleteUser = async () => {
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const userId = confirmDelete.userId;
      const docId = confirmDelete.$id;

      console.log(`🗑️ Starting deletion for user: ${userId}`);

      try {
        const addresses = await databases.listDocuments(
          DATABASE_ID,
          ADDRESSES_COLLECTION_ID,
          [Query.equal("userId", userId)]
        );
        for (const addr of addresses.documents) {
          await databases.deleteDocument(
            DATABASE_ID,
            ADDRESSES_COLLECTION_ID,
            addr.$id
          );
        }
        console.log(`✅ Deleted ${addresses.documents.length} addresses`);
      } catch (err) {
        console.warn("⚠️ Could not delete addresses:", err.message);
      }

      try {
        const orders = await databases.listDocuments(
          DATABASE_ID,
          ORDERS_COLLECTION_ID,
          [Query.equal("userId", userId)]
        );

        for (const order of orders.documents) {
          const orderItems = await databases.listDocuments(
            DATABASE_ID,
            ORDER_ITEMS_COLLECTION_ID,
            [Query.equal("orderId", order.$id)]
          );

          for (const item of orderItems.documents) {
            await databases.deleteDocument(
              DATABASE_ID,
              ORDER_ITEMS_COLLECTION_ID,
              item.$id
            );
          }

          await databases.deleteDocument(
            DATABASE_ID,
            ORDERS_COLLECTION_ID,
            order.$id
          );
        }
        console.log(`✅ Deleted ${orders.documents.length} orders`);
      } catch (err) {
        console.warn("⚠️ Could not delete orders:", err.message);
      }

      try {
        const files = await storage.listFiles(ALLFILES_BUCKET_ID);
        for (const file of files.files) {
          if (file.name.startsWith(`avatar-${userId}`)) {
            await storage.deleteFile(ALLFILES_BUCKET_ID, file.$id);
            console.log(`✅ Deleted file: ${file.name}`);
          }
        }
      } catch (err) {
        console.warn("⚠️ Could not delete user files:", err.message);
      }

      await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, docId);
      console.log(`✅ Deleted user document: ${docId}`);

      setUsers(users.filter((u) => u.$id !== docId));
      toast.success("User and all associated data deleted successfully!");
    } catch (error) {
      console.error("❌ Failed to delete user:", error);
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading users...</p>
        </div>
      </div>
    );
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatarUrl || "/placeholder.png"}
            alt={`${row.firstName} ${row.lastName}`}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
          <span className="text-sm font-medium dark:text-white">
            {row.firstName} {row.lastName}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (row) => (
        <span className="text-sm dark:text-gray-300">{row.email}</span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => {
        const isCurrentUser = row.userId === currentUser?.document?.userId;
        return (
          <select
            value={row.role}
            onChange={(e) =>
              handleRoleChange(row.userId, row.$id, e.target.value)
            }
            disabled={isCurrentUser}
            className={`px-2 py-1 border rounded text-xs md:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              isCurrentUser ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        );
      },
    },
    {
      key: "joined",
      label: "Joined",
      render: (row) => (
        <span className="text-xs md:text-sm dark:text-gray-300">
          {new Date(row.joined).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => {
        const isCurrentUser = row.userId === currentUser?.document?.userId;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => confirmDeleteUser(row)}
              disabled={isCurrentUser}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                isCurrentUser
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
              title={
                isCurrentUser ? "Cannot delete your own account" : "Delete user"
              }
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
            Manage Users
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total Users: {users.length}
          </p>
        </div>
        <Input
          placeholders={["Search by name or email..."]}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-sm"
        />
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
            {currentUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers.map((row) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${confirmDelete?.firstName} ${confirmDelete?.lastName}? This will permanently delete their account and ALL associated data including addresses, orders, and files. This action cannot be undone.`}
        isDangerous={true}
        loading={deleting}
      />
      {filteredUsers.length > usersPerPage && (
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