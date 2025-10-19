"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import Slider from "react-slick";
import { toast } from "react-toastify";

const ShopPage = () => {
  const { addToCart, getAvailableStock } = useCart();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newArrivals, setNewArrivals] = useState([]);

  const openModal = (item) => {
    const availableStock = getAvailableStock(item.id);
    setSelectedItem({ ...item, quantity: 1, availableStock });
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedItem]);

  const handleAddToCart = async () => {
    if (!selectedItem) return;

    const availableStock = getAvailableStock(selectedItem.id);

    if (availableStock === 0) {
      toast.error("This product is out of stock!");
      return;
    }

    if (selectedItem.quantity > availableStock) {
      toast.error(`Only ${availableStock} items available in stock!`);
      return;
    }

    setIsLoading(true);
    try {
      addToCart({
        id: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        images: selectedItem.images,
        quantity: selectedItem.quantity || 1,
      });
      toast.success("Added to cart!");
      closeModal();
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("products");
      setNewArrivals(saved ? JSON.parse(saved) : []);
    }
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 dark:text-white">
          All Products
        </h2>

        {newArrivals.length === 0 ? (
          <div className="h-[50vh] flex items-center justify-center">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No Products Available
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {newArrivals.map((item) => {
              const stock = getAvailableStock(item.id);
              const isOutOfStock = stock === 0;

              return (
                <div
                  key={item.id}
                  onClick={() => !isOutOfStock && openModal(item)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !isOutOfStock && openModal(item)
                  }
                  role="button"
                  tabIndex={0}
                  className={`relative z-[10] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary ${
                    isOutOfStock
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                        OUT OF STOCK
                      </span>
                    </div>
                  )}
                  <img
                    src={item.images?.[0] || item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-semibold dark:text-white truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      ₦{item.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stock > 0 ? `${stock} in stock` : "Out of stock"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-2xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>

            {selectedItem.images?.length > 0 ? (
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                arrows={true}
                className="mb-4"
              >
                {selectedItem.images.map((img, index) => (
                  <div key={index}>
                    <img
                      src={img}
                      alt={`${selectedItem.name} view ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg mx-auto"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-red-500 text-center mb-4">
                No images available
              </p>
            )}

            <h3 className="text-xl font-bold dark:text-white mb-2">
              {selectedItem.name}
            </h3>
            <p className="text-lg font-bold text-primary dark:text-white mb-2">
              ₦{selectedItem.price.toLocaleString()}
            </p>
            <p className="text-sm font-medium mb-2">
              <span
                className={
                  selectedItem.availableStock > 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {selectedItem.availableStock > 0
                  ? `${selectedItem.availableStock} available in stock`
                  : "Out of stock"}
              </span>
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {selectedItem.fullDescription || "No description available."}
            </p>

            {selectedItem.availableStock > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="dark:text-white font-medium">Quantity:</p>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        setSelectedItem((prev) => ({
                          ...prev,
                          quantity: Math.max(1, (prev.quantity || 1) - 1),
                        }))
                      }
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span className="w-12 text-center dark:text-white font-semibold">
                      {selectedItem.quantity || 1}
                    </span>
                    <button
                      onClick={() =>
                        setSelectedItem((prev) => ({
                          ...prev,
                          quantity: Math.min(
                            prev.availableStock,
                            (prev.quantity || 1) + 1
                          ),
                        }))
                      }
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Adding..." : "Add to Cart"}
                </button>
              </>
            )}

            {selectedItem.availableStock === 0 && (
              <div className="w-full px-4 py-2 bg-red-500 text-white rounded-lg text-center font-semibold">
                Out of Stock
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ShopPage;