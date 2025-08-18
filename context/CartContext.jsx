"use client";
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    console.log("Adding item to cart:", item);
    setCartItems((prevItems) => {
      const newItems = [...prevItems, { ...item, quantity: 1 }];
      console.log("New cart items after add:", newItems);
      return newItems;
    });
    alert('Added to cart!');
  };

  const removeFromCart = (itemId) => {
    const id = Number(itemId); // Ensure ID is a number
    console.log("Removing item with ID:", id);
    setCartItems((prevItems) => {
      console.log("Current cart items before removal:", prevItems);
      const newItems = prevItems.filter((item) => {
        console.log(`Comparing item ID: ${item.id} (type: ${typeof item.id}) with ${id} (type: ${typeof id})`);
        return item.id !== id;
      });
      console.log("New cart items after removal:", newItems);
      return newItems;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.error("useCart must be used within a CartProvider");
  }
  return context;
};