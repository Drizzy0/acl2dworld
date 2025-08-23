"use client";
import React, { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();

  useEffect(() => {
    console.log("CartPage re-rendered with cartItems:", cartItems);
  }, [cartItems]);

  const handleRemove = (lineId) => {
    console.log("Clicked remove button for line ID:", lineId);
    removeFromCart(lineId);
    toast.error("Item removed from cart"); 
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 dark:text-white">
          Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              No items in your cart.
            </p>
            <Link href="/products">
              <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {cartItems.map((item) => (
              <div
                key={item.lineId} 
                className="flex items-center border-b border-gray-200 py-4"
              >
                <img
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    ${Number(item.price ?? 0).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.lineId)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <X size={24} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;