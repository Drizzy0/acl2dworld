"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllProducts } from "@/lib/appwrite";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("cart");
      if (saved) {
        try {
          const parsed = JSON.parse(saved).map((item) => ({
            ...item,
            quantity: Number(item.quantity) || 1,
            lineId: item.lineId || `${item.id}-${Date.now()}`,
          }));
          setCartItems(parsed);
        } catch (error) {
          console.error("Error parsing cart from storage:", error);
          setCartItems([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        const normalizedProducts = fetchedProducts.map((product) => ({
          ...product,
          id: product.$id,
        }));
        setProducts(normalizedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const getAvailableStock = (productId) => {
    const product = products.find(
      (p) => p.$id === productId || p.id === productId
    );
    if (!product) return 0;

    const cartItem = cartItems.find((item) => item.id === productId);
    const inCart = cartItem ? cartItem.quantity : 0;

    return product.stock - inCart;
  };

  const addToCart = (item) => {
    const availableStock = getAvailableStock(item.id);
    const quantityToAdd = Number(item.quantity || 1);

    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);

      if (existing) {
        const newQuantity = Number(existing.quantity) + quantityToAdd;

        if (newQuantity > availableStock) {
          toast.error(`Only ${availableStock} items available in stock!`);
          return prev;
        }

        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      }

      if (quantityToAdd > availableStock) {
        toast.error(`Only ${availableStock} items available in stock!`);
        return prev;
      }

      const uniqueLineId = `${item.id}-${Date.now()}`;
      return [
        ...prev,
        { ...item, quantity: quantityToAdd, lineId: uniqueLineId },
      ];
    });
  };

  const removeFromCart = (lineId) => {
    setCartItems((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  const updateQuantity = (lineId, delta) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.lineId === lineId) {
            const newQuantity = Number(item.quantity) + delta;
            const availableStock = getAvailableStock(item.id);

            if (newQuantity < 1) {
              toast.error("Quantity cannot be less than 1");
              return item;
            }

            if (newQuantity > availableStock) {
              toast.error(`Only ${availableStock} items available in stock!`);
              return item;
            }

            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("cart");
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
        getAvailableStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
