"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "react-toastify";
import ResponsiveTable from "@/components/ui/responsive-table";
import ConfirmModal from "@/components/ui/confirm-modal";

export default function AdminProducts() {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [products, setProducts] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("products");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      images: formData.image ? [formData.image] : [],
    };

    if (editingId) {
      setProducts(
        products.map((p) => (p.id === editingId ? { ...p, ...updatedData } : p))
      );
      toast.success("Product updated!");
    } else {
      const newProduct = { id: Date.now(), ...updatedData };
      setProducts([...products, newProduct]);
      toast.success("Product added!");
    }

    setIsOpen(false);
    setEditingId(null);
    setFormData({ name: "", price: "", stock: "", image: "" });
  };
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.images?.[0] || "",
    });
    setEditingId(product.id);
    setIsOpen(true);
  };

  const confirmDeleteAction = () => {
    setProducts(products.filter((p) => p.id !== confirmDelete));
    toast.error("Product deleted!");
    setConfirmDelete(null);
  };

  const handleDelete = (id) => {
    setConfirmDelete(id);
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) => (
        <img
          src={row.images?.[0] || "/placeholder.png"}
          alt={row.name}
          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded"
        />
      ),
    },
    { key: "name", label: "Name" },
    {
      key: "price",
      label: "Price",
      render: (row) => `₦${row.price.toLocaleString()}`,
    },
    { key: "stock", label: "Stock" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => handleEdit(row)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          Manage Products
        </h1>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <Input
            placeholders={["Search products..."]}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-sm"
          />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Product" : "Add Product"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholders={["Name"]}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholders={["Price"]}
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholders={["Stock"]}
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                />
                <FileUpload
                  onChange={(files) => {
                    if (files.length > 0) {
                      const file = files[0];
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData({ ...formData, image: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <Button type="submit" className="w-full">
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteAction}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />

      <div className="overflow-x-auto">
        <ResponsiveTable
          columns={columns}
          data={filteredProducts}
          type="product"
        />
      </div>
    </div>
  );
}