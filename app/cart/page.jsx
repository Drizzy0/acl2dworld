"use client";
import React, { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart(); 

  useEffect(() => {
    console.log("CartPage re-rendered with cartItems:", cartItems);
  }, [cartItems]);

  const handleRemove = (lineId) => {
    removeFromCart(lineId);
    toast.error("Item removed from cart"); 
  };

  const updateQuantity = (lineId, delta) => {
    console.log(`Update qty for ${lineId} by ${delta}`);
  };

  const totalPrice = cartItems.reduce((total, item) => total + (Number(item.price || 0) * (item.quantity || 1)), 0);

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
          Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Your cart is empty
            </p>
            <Link href="/shop">
              <button className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.lineId} 
                  className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      ${Number(item.price ?? 0).toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => updateQuantity(item.lineId, -1)} className="p-1 text-gray-500 hover:text-gray-700">
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.lineId, 1)} className="p-1 text-gray-500 hover:text-gray-700">
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="font-bold dark:text-white">
                      ${(Number(item.price ?? 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.lineId)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-bold dark:text-white mb-4">Total: ${totalPrice.toFixed(2)}</h3>
              <Link href="/checkout">
                <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartPage;