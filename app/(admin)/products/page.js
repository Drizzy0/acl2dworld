"use client";
import { useState } from "react";
import { mockProducts } from "@/data/adminData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; 
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", image: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...p, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) } : p));
      toast.success("Product updated!");
    } else {
      const newProduct = { id: Date.now(), ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) };
      setProducts([...products, newProduct]);
      toast.success("Product added!");
    }
    setIsOpen(false);
    setEditingId(null);
    setFormData({ name: "", price: "", stock: "", image: "" });
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, price: product.price, stock: product.stock, image: product.image });
    setEditingId(product.id);
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
      toast.error("Product deleted!");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Manage Products</h1>
        <div className="flex items-center gap-4">
          <Input 
            placeholder="Search products..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="max-w-sm"
          />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <Input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                <Input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
                <Input placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required />
                <Button type="submit" className="w-full">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3"><img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" /></td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">${product.price.toFixed(2)}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3 space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No products found.</p>}
      </div>
    </div>
  );
}