import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CreditCard,
  Truck,
  Shield,
  Mail,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing! You'll receive updates soon.");
  };

  return (
    <footer className="relative z-10 w-full bg-gray-900 text-white border-t border-gray-800 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/images/newest.PNG" alt="Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold">Air Clothing Line</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Elevate your style with premium, sustainable clothing designed for
              the modern individual.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/airclothingline"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com/airclothingline"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/airclothingline"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/airclothingline"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-white transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="hover:text-white transition-colors"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Customer Service</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <button
                  disabled
                  className="hover:text-white transition-colors cursor-not-allowed bg-transparent"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  disabled
                  className="hover:text-white transition-colors cursor-not-allowed bg-transparent"
                >
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button
                  disabled
                  className="hover:text-white transition-colors cursor-not-allowed bg-transparent"
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <button
                  disabled
                  className="hover:text-white transition-colors cursor-not-allowed bg-transparent"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe for exclusive offers, new arrivals, and style tips.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
            <div className="flex items-center space-x-2 text-gray-400 text-sm flex-wrap">
              <Truck size={16} />
              <span>Free Shipping on Orders Over ₦10,000</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm flex-wrap">
              <CreditCard size={16} />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm flex-wrap">
              <Shield size={16} />
              <span>Buyer Protection</span>
            </div>
          </div>

          <div className="text-center md:text-right space-y-2 text-sm text-gray-400">
            <p>&copy; {currentYear} Air Clothing Line. All rights reserved.</p>
            <div className="flex items-center justify-center md:justify-end space-x-4">
              <Mail size={16} />
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                support@airclothing.com
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}