"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, User, Menu as MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import Link from 'next/link';

const transition = {
    type: "spring",
    mass: 0.5,
    damping: 11.5,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001,
};

export const MenuItem = ({ setActive, active, item, children }) => {
    return (
        <div onMouseEnter={() => setActive(item)} className="relative">
            <motion.p
                transition={{ duration: 0.3 }}
                className="cursor-pointer text-foreground text-white font-bold dark:text-foreground dark:hover:text-primary"
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
        <div
            onMouseLeave={() => setActive(null)}
            className="flex flex-col md:flex-row md:space-x-6"
        >
            {children}
        </div>
    );
};

export const ProductItem = ({ title, description, href, src }) => {
    return (
        <a href={href} className="flex space-x-2">
            <img
                src={src}
                width={140}
                height={70}
                alt={title}
                className="shrink-0 rounded-md shadow-2xl"
            />
            <div>
                <h4 className="text-xl font-bold mb-1 text-foreground dark:text-foreground">
                    {title}
                </h4>
                <p className="text-muted-foreground text-sm max-w-[10rem] dark:text-muted-foreground">
                    {description}
                </p>
            </div>
        </a>
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

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 flex justify-between items-center px-2 py-2",
                "bg-green-950/50 backdrop-blur-sm border-b border-border",
                "text-foreground dark:bg-blue-950/95 dark:text-foreground",
                "md:px-8"
            )}
        >
            {/* Left: Logo */}
            <a href="/">
            <div className="flex items-center space-x-1">
                <img
                    src="/images/newest.PNG"
                    alt="Logo"
                    className="h-10 w-15 ms-2 object-cover"
                />
                <span className="text-sm font-mono font-normal text-foreground dark:text-foreground ">
                    Air Clothing Line
                </span>
            </div>

            </a>

            {/* Center: Menu Links */}
            <div
                className={cn(
                    "absolute md:static top-16 right-4 md:right-0 md:w-auto",
                    "flex-col md:flex-row items-center px-6 py-4 md:px-0 md:py-0",
                    "bg-black/100 dark:bg-blue-950/95 md:bg-transparent dark:md:bg-transparent",
                    "rounded-xl shadow-lg md:shadow-none z-2000 w-[80%] max-w-xs",
                    { flex: isMobileMenuOpen, hidden: !isMobileMenuOpen }
                )}
            >
                <Menu setActive={setActive}>
                    <a href="/"
                    className="border-1">
                    <MenuItem setActive={setActive} active={active} item="Home">
                        <HoveredLink href="/"></HoveredLink>
                    </MenuItem>
                    </a>

                    <a href="/products">
                    <MenuItem setActive={setActive} active={active} item="Products">   
                    </MenuItem>
                    </a>


                    <a href="/contact">
                    <MenuItem setActive={setActive} active={active} item="Contact">
                        <HoveredLink href="/contact"></HoveredLink>
                    </MenuItem>
                    </a>

                </Menu>
            </div>

            {/* Right: Icons + Hamburger */}
            <div className="flex items-center space-x-4">
                <Link href="/cart" className="relative">
                    <ShoppingCart className="cursor-pointer text-foreground dark:text-foreground" />
                    {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItems.length}
                        </span>
                    )}
                </Link>
                {/* <User className="cursor-pointer text-foreground dark:text-foreground" /> */}
                <button
                    className="md:hidden text-foreground dark:text-foreground"
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </button>
            </div>
        </nav>
    );
};