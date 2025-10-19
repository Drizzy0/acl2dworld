"use client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconPackage,
  IconShoppingCart,
  IconUsers,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Products",
      href: "/products",
      icon: (
        <IconPackage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Orders",
      href: "/orders",
      icon: (
        <IconShoppingCart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Users",
      href: "/users",
      icon: (
        <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-green-950/50 dark:bg-blue-950/95 text-white p-3 md:p-4 flex justify-between items-center shadow-md">
        <Link href="/dashboard">
          <h1 className="text-lg md:text-xl font-bold">ACL Admin</h1>
        </Link>
        <div className="flex items-center gap-3 md:gap-4">
          <button className="hidden md:flex items-center gap-2 hover:bg-gray-700/50 px-2 md:px-3 py-1 rounded transition-colors text-sm md:text-base">
            <IconLogout size={20} />
            Logout
          </button>
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </button>
        </div>
      </nav>

      <div className="relative flex-1 overflow-hidden">
        <Sidebar open={open} setOpen={setOpen} animate={true}>
          <div className="fixed left-0 top-[64px] h-[calc(100%-64px)] bg-white dark:bg-gray-800 shadow-lg z-40 overflow-hidden">
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden mt-8 gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </SidebarBody>
          </div>
        </Sidebar>

        <main className="relative md:p-4 md:ml-16 ml-0 h-full overflow-auto bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-full bg-green-950/95 dark:bg-blue-950/95 p-6 z-50 md:hidden flex flex-col justify-between"
          >
            <div className="flex justify-end">
              <IconX
                size={24}
                className="text-white cursor-pointer"
                onClick={toggleMobileMenu}
              />
            </div>
            <div className="flex flex-col gap-4 mt-8">
              {links.map((link, idx) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(link.href + "/");
                return (
                  <a
                    key={idx}
                    href={link.href}
                    className={cn(
                      "text-white text-lg py-2 px-4 rounded transition-colors",
                      isActive
                        ? "bg-primary/50 font-semibold"
                        : "hover:bg-gray-700/50"
                    )}
                    onClick={toggleMobileMenu}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
            <button
              className="mt-auto flex items-center gap-2 text-white py-2 px-4 hover:bg-gray-700/50 rounded transition-colors"
              onClick={toggleMobileMenu}
            >
              <IconLogout size={20} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}