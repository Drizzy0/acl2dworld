"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "@/contexts/CartContext";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
    getAvailableStock,
  } = useCart();

  const handleRemove = (lineId) => {
    removeFromCart(lineId);
    toast.error("Item removed from cart");
  };

  const handleUpdateQuantity = (lineId, delta) => {
    updateQuantity(lineId, delta);
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
          Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 relative z-10">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Your cart is empty
            </p>
            <Link href="/shop" passHref legacyBehavior>
              <a className="inline-block px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer text-center">
                Start Shopping
              </a>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6 relative z-10">
              {cartItems.map((item) => {
                const availableStock = getAvailableStock(item.id);
                const isOverStock = item.quantity > availableStock;

                return (
                  <div
                    key={item.lineId}
                    className={`flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md ${
                      isOverStock ? "border-2 border-red-500" : ""
                    }`}
                  >
                    <img
                      src={item.images?.[0] || "/placeholder.png"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md mr-4"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        ₦{Number(item.price ?? 0).toLocaleString()} each
                      </p>
                      {isOverStock && (
                        <p className="text-red-500 text-sm mt-1">
                          Only {availableStock} available in stock!
                        </p>
                      )}
                      {availableStock === 0 && (
                        <p className="text-red-500 text-sm mt-1 font-semibold">
                          Out of stock
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUpdateQuantity(item.lineId, -1);
                          }}
                          type="button"
                          className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold dark:text-white">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUpdateQuantity(item.lineId, 1);
                          }}
                          type="button"
                          disabled={item.quantity >= availableStock}
                          className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="font-bold dark:text-white min-w-[80px] text-right">
                        ₦
                        {(
                          Number(item.price ?? 0) * (item.quantity || 1)
                        ).toLocaleString()}
                      </p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(item.lineId);
                        }}
                        type="button"
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold dark:text-white">Total:</h3>
                <p className="text-2xl font-bold text-black dark:text-white">
                  ₦{totalPrice.toLocaleString()}
                </p>
              </div>
              <Link
                href="/checkout"
                className="w-full block py-3 bg-black text-white text-center rounded-lg hover:bg-gray-800 transition cursor-pointer font-semibold"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartPage;