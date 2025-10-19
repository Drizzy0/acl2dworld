"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import ResponsiveTable from "@/components/ui/responsive-table";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ email: "", role: "User" });
  const [editingId, setEditingId] = useState(null);
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setUsers(
        users.map((u) => (u.id === editingId ? { ...u, ...formData } : u))
      );
      toast.success("User updated!");
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
        joined: new Date().toLocaleDateString(),
      };
      setUsers([...users, newUser]);
      toast.success("User added!");
    }
    setIsOpen(false);
    setEditingId(null);
    setFormData({ email: "", role: "User" });
  };
  const handleEdit = (user) => {
    setFormData({
      email: user.email,
      role: user.role,
    });
    setEditingId(user.id);
    setIsOpen(true);
  };
  const handleDelete = (id) => {
    if (confirm("Delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
      toast.error("User deleted!");
    }
  };
  const handleRoleChange = (id, role) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
    toast.success("Role updated!");
  };
  const columns = [
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <select
          defaultValue={row.role}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className="p-1 border rounded text-xs md:text-sm"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      ),
    },
    { key: "joined", label: "Joined" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-1 md:gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
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
          Manage Users
        </h1>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <Input
            placeholders={["Search by email..."]}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-sm"
          />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit User" : "Add New User"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholders={["Email address"]}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="p-2 border rounded w-full text-sm"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
                <Button type="submit" className="w-full">
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="overflow-x-auto">
        <ResponsiveTable columns={columns} data={filteredUsers} type="user" />
      </div>
    </div>
  );
}