"use client"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconDashboard, IconPackage, IconShoppingCart, IconUsers, IconSettings, IconLogout, IconMenu2, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { label: "Dashboard", href: "/admin/dashboard", icon: <IconDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Products", href: "/admin/products", icon: <IconPackage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Orders", href: "/admin/orders", icon: <IconShoppingCart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Users", href: "/admin/users", icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Settings", href: "/admin/settings", icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-green-950/50 dark:bg-blue-950/95 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">ACL Admin</h1>
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2">
            <IconLogout size={20} />
            Logout
          </button>
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar animate={true}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
        <main className="flex-1 p-4 overflow-auto">
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
              <IconX size={24} className="text-white" onClick={toggleMobileMenu} />
            </div>
            <div className="flex flex-col gap-4 mt-8">
              {links.map((link, idx) => (
                <a key={idx} href={link.href} className="text-white text-lg" onClick={toggleMobileMenu}>
                  {link.label}
                </a>
              ))}
            </div>
            <button className="mt-auto flex items-center gap-2 text-white" onClick={() => { toggleMobileMenu(); }}>
              <IconLogout size={20} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}