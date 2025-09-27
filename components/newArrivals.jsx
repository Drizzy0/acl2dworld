"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { newArrivals } from "@/data/newArrivals";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

const NewArrivals = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const openModal = (item) => {
    setSelectedItem(item);
  };
  const closeModal = () => setSelectedItem(null);

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

  const handleAddToCart = async (item) => {
    setIsLoading(true);
    try {
      addToCart(item);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <section className="py-12 isolate relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 dark:text-white">
          New Arrivals
        </h2>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {newArrivals.map((item) => (
            <div
              key={item.id}
              onClick={() => openModal(item)}
              onKeyDown={(e) => (e.key === "Enter" ? openModal(item) : null)}
              role="button"
              tabIndex={0}
              className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.src = "/placeholder.png"; }}
              />
              <div className="p-3 text-center">
                <h3 className="text-sm font-semibold dark:text-white">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
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
              aria-label="Close"
            >
              ×
            </button>

            {selectedItem.images?.length > 1 ? (
              <Slider {...sliderSettings} className="mb-4">
                {selectedItem.images.map((img, index) => (
                  <div key={index}>
                    <img
                      src={img}
                      alt={`${selectedItem.name} view ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg mx-auto"
                      onError={(e) => { e.target.src = "/placeholder.png"; }}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <img
                src={selectedItem.images[0]}
                alt={selectedItem.name}
                className="w-full h-64 object-cover rounded-lg mb-4 mx-auto block"
                onError={(e) => { e.target.src = "/placeholder.png"; }}
              />
            )}

            <h3 className="text-xl font-bold dark:text-white mb-2">
              {selectedItem.name}
            </h3>
            <p className="text-lg font-bold text-primary dark:text-white mb-2">
              ${selectedItem.price.toFixed(2)}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {selectedItem.fullDescription || "No description available."}
            </p>

            <button
              onClick={() => handleAddToCart(selectedItem)}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewArrivals;