"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email, password) => {
    const newUser = { email, isAdmin: email === "admin@example.com" }; 
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    toast.success("Logged in successfully!");
  };

  const register = (email, password) => {
    const newUser = { email, isAdmin: false };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    toast.success("Registered successfully!");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);