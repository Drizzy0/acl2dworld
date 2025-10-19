"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu as MenuIcon, X, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({ setActive, active, item, children, isActive }) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className={cn(
          "cursor-pointer text-white font-bold px-3 py-1 rounded transition-colors",
          isActive
            ? "bg-gray-800 text-white"
            : "hover:bg-gray-700 hover:text-primary"
        )}
      >
        {item}
      </motion.p>
    </div>
  );
};

export const Menu = ({ setActive, children }) => {
  return (
    <nav onMouseLeave={() => setActive(null)} className="flex space-x-6">
      {children}
    </nav>
  );
};

export const HoveredLink = ({ children, ...rest }) => {
  return (
    <a
      {...rest}
      className="text-muted-foreground dark:text-muted-foreground hover:text-primary block py-1"
    >
      {children}
    </a>
  );
};

export const Navbar = () => {
  const [active, setActive] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems } = useCart();

  const user = null;

  const isCartActive = pathname === "/cart";
  const isProfileActive = pathname === "/profile";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 flex justify-between items-center lg:px-16 px-4 py-4",
        "bg-green-950/50 backdrop-blur-sm border-b border-border",
        "dark:bg-blue-950/95 dark:text-foreground"
      )}
    >
      <Link href="/">
        <div className="flex items-center space-x-1">
          <img
            src="/images/newest.PNG"
            alt="Logo"
            className="h-10 w-15 object-cover"
          />
          <span className="text-sm font-mono font-normal text-white">
            Air Clothing Line
          </span>
        </div>
      </Link>

      <div className="hidden md:flex flex-1 justify-center">
        <Menu setActive={setActive}>
          <Link href="/">
            <MenuItem
              setActive={setActive}
              active={active}
              item="Home"
              isActive={pathname === "/"}
            />
          </Link>
          <Link href="/shop">
            <MenuItem
              setActive={setActive}
              active={active}
              item="Shop"
              isActive={pathname === "/shop"}
            />
          </Link>
          <Link href="/about">
            <MenuItem
              setActive={setActive}
              active={active}
              item="About"
              isActive={pathname === "/about"}
            />
          </Link>
          <Link href="/profile">
            <MenuItem
              setActive={setActive}
              active={active}
              item="Profile"
              isActive={isProfileActive}
            />
          </Link>
          <Link href="/contact">
            <MenuItem
              setActive={setActive}
              active={active}
              item="Contact"
              isActive={pathname === "/contact"}
            />
          </Link>
        </Menu>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/cart" className="relative">
          <ShoppingCart
            className={cn(
              "cursor-pointer",
              isCartActive ? "text-black fill-current" : "text-white"
            )}
            size={24}
          />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <Link href="/profile">
              <button className="hidden md:block px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
                Profile
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="hidden md:block px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition ml-2"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">
            <button className="hidden md:block px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/80 transition">
              Login
            </button>
          </Link>
        )}

        <button className="md:hidden text-white" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-black/95 dark:bg-blue-950/95 p-6 z-50 md:hidden shadow-lg"
          >
            <ul className="flex flex-col space-y-4 text-center">
              <li>
                <Link
                  href="/"
                  className={cn(
                    "block text-lg px-3 py-1 rounded transition-colors",
                    pathname === "/"
                      ? "bg-white text-black"
                      : "text-white hover:bg-gray-700 hover:text-primary"
                  )}
                  onClick={toggleMobileMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className={cn(
                    "block text-lg px-3 py-1 rounded transition-colors",
                    pathname === "/shop"
                      ? "bg-white text-black"
                      : "text-white hover:bg-gray-700 hover:text-primary"
                  )}
                  onClick={toggleMobileMenu}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={cn(
                    "block text-lg px-3 py-1 rounded transition-colors",
                    pathname === "/about"
                      ? "bg-white text-black"
                      : "text-white hover:bg-gray-700 hover:text-primary"
                  )}
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={cn(
                    "block text-lg px-3 py-1 rounded transition-colors",
                    pathname === "/profile"
                      ? "bg-white text-black"
                      : "text-white hover:bg-gray-700 hover:text-primary"
                  )}
                  onClick={toggleMobileMenu}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={cn(
                    "block text-lg px-3 py-1 rounded transition-colors",
                    pathname === "/contact"
                      ? "bg-white text-black"
                      : "text-white hover:bg-gray-700 hover:text-primary"
                  )}
                  onClick={toggleMobileMenu}
                >
                  Contact
                </Link>
              </li>
            </ul>

            <div className="mt-6 text-center">
              {user ? (
                <>
                  <Link href="/profile" onClick={toggleMobileMenu}>
                    <button className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition mb-2">
                      Profile
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={toggleMobileMenu}>
                  <button className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};