"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, User, Menu as MenuIcon, X } from "lucide-react"; // Renamed Menu to MenuIcon

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
                className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
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
                                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
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
                <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
                    {title}
                </h4>
                <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
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
            className="text-neutral-700 dark:text-neutral-200 hover:text-black block py-1"
        >
            {children}
        </a>
    );
};

export const Navbar = () => {
    const [active, setActive] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="w-full flex justify-between items-center px-4 py-4 bg-white dark:bg-black shadow-md md:px-8">
            {/* Left: Logo */}
            <div className="flex items-center space-x-2">
                <img src="/images/acl_logo.jpg" alt="Logo" className="h-10 w-15 ms-2 object-cover" />
                <span className="text-xl font-bold text-black dark:text-white">
                    {/* ACL2dWorld  */}
                </span>
            </div>

            {/* Center: Menu Links (Hidden on mobile, shown on md and up) */}
            <div
                className={`${isMobileMenuOpen ? "flex" : "hidden"
                    } md:flex absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-black md:bg-transparent dark:md:bg-transparent flex-col md:flex-row items-center px-4 md:px-0 py-4 md:py-0 shadow-md md:shadow-none z-10`}
            >
                <Menu setActive={setActive}>
                    <MenuItem setActive={setActive} active={active} item="Home">
                        <HoveredLink href="/">Go to Home</HoveredLink>
                    </MenuItem>
                    <MenuItem setActive={setActive} active={active} item="Products">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProductItem
                                title="Laptop"
                                description="Latest models"
                                href="/products/laptop"
                                src="/images/laptop.jpg"
                            />
                            <ProductItem
                                title="Phone"
                                description="Smartphones"
                                href="/products/phone"
                                src="/images/phone.jpg"
                            />
                        </div>
                    </MenuItem>
                    <MenuItem setActive={setActive} active={active} item="Contact">
                        <HoveredLink href="/contact">Get in Touch</HoveredLink>
                    </MenuItem>
                </Menu>
            </div>

            {/* Right: Icons and Hamburger */}
            <div className="flex items-center space-x-4">
                <ShoppingCart className="cursor-pointer text-black dark:text-white" />
                <User className="cursor-pointer text-black dark:text-white" />
                <button
                    className="md:hidden text-black dark:text-white"
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </button>
            </div>
        </nav>
    );
};