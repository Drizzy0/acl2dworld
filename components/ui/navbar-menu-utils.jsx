"use client";
import React from "react";
import { motion } from "framer-motion";

export const Menu = ({ children, setActive }) => {
  return (
    <nav
      className="flex flex-col md:flex-row gap-6"
      onMouseLeave={() => setActive(null)}
    >
      {children}
    </nav>
  );
};

export const MenuItem = ({ children, setActive, active, item }) => {
  return (
    <div
      className="relative"
      onMouseEnter={() => setActive(item)}
      onMouseLeave={() => setActive(null)}
    >
      {children}
      {active === item && (
        <motion.div
          layoutId="underline"
          className="absolute left-0 right-0 h-[2px] bg-white bottom-0"
        />
      )}
    </div>
  );
};

export const HoveredLink = ({ href, children }) => {
  return (
    <a href={href} className="text-white hover:text-gray-300 transition">
      {children}
    </a>
  );
};