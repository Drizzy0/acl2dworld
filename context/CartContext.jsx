"use client";
import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return [...state, { ...action.payload, quantity: 1, lineId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }];
    case "REMOVE_ITEM":
      return state.filter((item) => item.lineId !== action.payload);
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const addToCart = (item) => {
    console.log("Adding item to cart:", item);
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeFromCart = (lineId) => {
    console.log("Removing line with ID:", lineId);
    dispatch({ type: "REMOVE_ITEM", payload: lineId });
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