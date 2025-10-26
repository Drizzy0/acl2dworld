"use client";
import { useState } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { AuroraBackground } from "@/components/ui/aurora-background";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navbar } from "@/components/ui/navbar-menu";
import { Footer } from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import { ShellContext } from "@/contexts/ShellContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [hideShell, setHideShell] = useState(false);

  const isAdmin =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/users");

  const isAuthPage =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/unauthorized" ||
    pathname === "/verify";

  const showShell = !(isAdmin || isAuthPage || hideShell);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <CartProvider>
            <ShellContext.Provider value={{ hideShell, setHideShell }}>
              {showShell ? (
                <AuroraBackground>
                  <Navbar />
                  {children}
                  <Footer />
                </AuroraBackground>
              ) : (
                children
              )}
              <ToastContainer position="top-right" autoClose={3000} />
            </ShellContext.Provider>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}