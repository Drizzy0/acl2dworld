"use client";
import React, { useState } from "react";
import Slider from "react-slick";
import { newArrivals } from "@/data/newArrivals";
import { useCart } from "@/context/CartContext";

const ProductsPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { addToCart } = useCart();

  const openModal = (item) => {
    console.log("Opening modal for item:", item);
    setSelectedItem(item);
  };
  const closeModal = () => {
    console.log("Closing modal");
    setSelectedItem(null);
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 dark:text-white">
          All Products
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4">
          {newArrivals.map((item) => (
            <div
              key={item.id}
              onClick={() => openModal(item)}
              onKeyDown={(e) => e.key === "Enter" && openModal(item)}
              role="button"
              tabIndex={0}
              className="cursor-pointer bg-transparent rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-48 object-cover border-2"
              />
              <div className="pt-2 text-center">
                <h3 className="text-base sm:text-sm font-normal dark:text-white">
                  {item.name}
                </h3>
                <p className="text-sm sm:text-sm text-black dark:text-white">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Full Details */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 text-2xl"
              aria-label="Close"
            >
              ×
            </button>

            {/* Image Slider with Fallback */}
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
                      className="w-full h-64 object-cover rounded-lg"
                      onError={() => console.error(`Failed to load image: ${img}`)}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-red-500">No images available</p>
            )}

            {/* Product Info */}
            <h3 className="text-xl font-bold dark:text-white">
              {selectedItem.name}
            </h3>
            <p className="text-lg font-bold text-black dark:text-white mt-2">
              ${selectedItem.price.toFixed(2)}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {selectedItem.fullDescription || "No description available"}
            </p>

            {/* Add to Cart */}
            <button
              onClick={() => {
                console.log("Adding to cart:", selectedItem);
                addToCart(selectedItem);
              }}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg w-full hover:bg-gray-800"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsPage;