"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu as MenuIcon, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";

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
                    isActive ? "bg-gray-800 text-white" : "hover:bg-gray-700 hover:text-primary"
                )}
            >
                {item}
            </motion.p>
            {active !== null && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={transition}
                >
                    {active === item && (
                        <div className="absolute top-[calc(100%_+_0.5rem)] left-1/2 transform -translate-x-1/2 pt-2 md:top-[calc(100%_+_1.2rem)]">
                            <motion.div
                                transition={transition}
                                layoutId="active"
                                className="bg-background dark:bg-background backdrop-blur-sm rounded-2xl overflow-hidden border border-border shadow-xl"
                            >
                                <motion.div layout className="w-max h-full p-4">
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export const Menu = ({ setActive, children }) => {
    return (
        <nav
            onMouseLeave={() => setActive(null)}
            className="flex space-x-6"
        >
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
    const { cartItems } = useCart();
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

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
        logout();
        router.push("/");
    };

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 flex justify-between items-center px-4 py-2",
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
                        <MenuItem setActive={setActive} active={active} item="Home" isActive={pathname === "/"} />
                    </Link>
                    <Link href="/shop">
                        <MenuItem setActive={setActive} active={active} item="Shop" isActive={pathname === "/shop"} />
                    </Link>
                    <Link href="/about">
                        <MenuItem setActive={setActive} active={active} item="About" isActive={pathname === "/about"} />
                    </Link>
                    <Link href="/contact">
                        <MenuItem setActive={setActive} active={active} item="Contact" isActive={pathname === "/contact"} />
                    </Link>
                </Menu>
            </div>

            <div className="flex items-center space-x-4">
                <form onSubmit={handleSearch} className="hidden md:flex items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-2 py-1 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-600 focus:outline-none"
                    />
                    <button type="submit" className="px-2 py-2 bg-black text-white rounded-r-md hover:bg-gray-900">
                        <Search size={20} />
                    </button>
                </form>

                <Link href="/cart" className="relative">
                    <ShoppingCart className="cursor-pointer text-white" size={24} />
                    {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItems.length}
                        </span>
                    )}
                </Link>

                {user ? (
                    <button onClick={handleLogout} className="hidden md:block px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                        Logout
                    </button>
                ) : (
                    <Link href="/login">
                        <button className="hidden md:block px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/80 transition">
                            Login
                        </button>
                    </Link>
                )}

                <button
                    className="md:hidden text-white"
                    onClick={toggleMobileMenu}
                >
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
                        <form onSubmit={handleSearch} className="flex items-center mb-6">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-l-md bg-gray-800 text-white border border-gray-600 focus:outline-none"
                            />
                            <button type="submit" className="px-4 py-2 bg-black text-white rounded-r-md hover:bg-gray-900">
                                <Search size={20} />
                            </button>
                        </form>

                        <ul className="flex flex-col space-y-4 text-center">
                            <li>
                                <Link href="/" className={cn(
                                    "block text-white text-lg px-3 py-1 rounded transition-colors",
                                    pathname === "/" ? "bg-gray-800 text-primary" : "hover:bg-gray-700 hover:text-primary"
                                )} onClick={toggleMobileMenu}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop" className={cn(
                                    "block text-white text-lg px-3 py-1 rounded transition-colors",
                                    pathname === "/shop" ? "bg-gray-800 text-primary" : "hover:bg-gray-700 hover:text-primary"
                                )} onClick={toggleMobileMenu}>
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className={cn(
                                    "block text-white text-lg px-3 py-1 rounded transition-colors",
                                    pathname === "/about" ? "bg-gray-800 text-primary" : "hover:bg-gray-700 hover:text-primary"
                                )} onClick={toggleMobileMenu}>
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className={cn(
                                    "block text-white text-lg px-3 py-1 rounded transition-colors",
                                    pathname === "/contact" ? "bg-gray-800 text-primary" : "hover:bg-gray-700 hover:text-primary"
                                )} onClick={toggleMobileMenu}>
                                    Contact
                                </Link>
                            </li>
                        </ul>

                        <div className="mt-6 text-center">
                            {user ? (
                                <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                                    Logout
                                </button>
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