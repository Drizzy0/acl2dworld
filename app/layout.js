"use client";
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
  const isAdmin =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/users");

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {isAdmin || isAuthPage ? (
            children
          ) : (
            <AuroraBackground>
              <Navbar />
              {children}
              <Footer />
            </AuroraBackground>
          )}
          <ToastContainer position="top-right" autoClose={3000} />
        </CartProvider>
      </body>
    </html>
  );
}