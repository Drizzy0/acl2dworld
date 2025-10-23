"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu as MenuIcon, X, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { account, logoutUser } from "@/lib/appwrite";
import { toast } from "react-toastify";
import { useUser } from "@/contexts/UserContext";

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
          "cursor-pointer text-white font-bold rounded transition-colors",
          "text-xs md:text-sm lg:text-base xl:text-lg",
          "px-1 md:px-2 lg:px-3 xl:px-4 py-1 md:py-1.5 lg:py-2 xl:py-2.5",
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
  const { user, setUser, loadingUser } = useUser();

  const isCartActive = pathname === "/cart";
  const isProfileActive = pathname === "/profile";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success("Logged out successfully");
      setIsMobileMenuOpen(false);
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
    }
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
        <div className="flex items-center">
          <img
            src="/images/newest.PNG"
            alt="Logo"
            className="h-6 w-10 md:h-8 md:w-12 lg:h-12 lg:w-15 object-cover"
          />
          <span className="text-xs md:text-sm lg:text-base xl:text-lg font-mono font-normal text-white">
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
          {user && (
            <Link href="/profile">
              <MenuItem
                setActive={setActive}
                active={active}
                item="Profile"
                isActive={isProfileActive}
              />
            </Link>
          )}
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
            size={20}
            style={{
              width: "clamp(20px, 2.5vw, 32px)",
              height: "clamp(20px, 2.5vw, 32px)",
            }}
          />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Link>

        {user ? (
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center space-x-2 px-3 md:px-4 lg:px-5 xl:px-6 py-1 md:py-1.5 lg:py-2 xl:py-2.5 text-xs md:text-sm lg:text-base bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            <span>Sign Out</span>
          </button>
        ) : (
          <Link href="/sign-in">
            <button
              className="hidden md:flex items-center space-x-2 
  px-3 md:px-4 lg:px-5 xl:px-6
  py-1 md:py-1.5 lg:py-2 xl:py-2.5
  text-xs md:text-sm lg:text-base xl:text-lg
  bg-primary text-white rounded-md hover:bg-primary/80 transition"
            >
              <span>Sign In</span>
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
              {user && (
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
              )}
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
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link href="/sign-in" onClick={toggleMobileMenu}>
                  <button className="w-full flex items-center justify-center space-x-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition">
                    <LogIn size={18} />
                    <span>Sign In</span>
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