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
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "@/lib/appwrite";

export default function AdminProducts() {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.image;

      if (formData.imageFile) {
        imageUrl = await uploadProductImage(
          editingId || "temp",
          formData.imageFile
        );
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrl: imageUrl,
        description: formData.description || "",
      };

      if (editingId) {
        await updateProduct(editingId, productData);
        toast.success("Product updated!");
      } else {
        await createProduct(productData);
        toast.success("Product added!");
      }

      await fetchProducts();
      setIsOpen(false);
      setEditingId(null);
      setFormData({
        name: "",
        price: "",
        stock: "",
        image: "",
        imageFile: null,
        description: "",
      });
    } catch (error) {
      toast.error(
        editingId ? "Failed to update product" : "Failed to add product"
      );
      console.error(error);
    }
  };
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.imageUrl || "",
    });
    setEditingId(product.$id);
    setIsOpen(true);
  };

  const confirmDeleteAction = async () => {
    try {
      await deleteProduct(confirmDelete);
      toast.success("Product deleted!");
      await fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleDelete = (id) => {
    setConfirmDelete(id);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      toast.error("Failed to load products");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) => (
        <img
          src={row.imageUrl || "/placeholder.png"}
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
          <button
            className="px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            onClick={() => handleDelete(row.$id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

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
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />

                <FileUpload
                  onChange={(files) => {
                    if (files.length > 0) {
                      const file = files[0];
                      setFormData({ ...formData, imageFile: file });

                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData((prev) => ({
                          ...prev,
                          image: reader.result,
                        }));
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
          data={currentProducts}
          type="product"
        />
      </div>
      {filteredProducts.length > productsPerPage && (
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