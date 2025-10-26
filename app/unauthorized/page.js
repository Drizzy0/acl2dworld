"use client";
import Link from "next/link";
import { Shield, Home, LogIn, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";

export default function Unauthorized() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-full">
              <Shield className="w-24 h-24 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 mb-4">
            403
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {user
              ? "You don't have permission to access this page. This area is restricted to administrators only."
              : "You need to sign in to access this page. Please log in with an authorized account."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <Link href="/">
                  <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold shadow-lg">
                    <Home size={20} />
                    <span>Go Home</span>
                  </button>
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
                >
                  <ArrowLeft size={20} />
                  <span>Go Back</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold shadow-lg">
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </button>
                </Link>
                <Link href="/">
                  <button className="flex items-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold">
                    <Home size={20} />
                    <span>Go Home</span>
                  </button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              If you believe this is a mistake, please{" "}
              <Link
                href="/contact"
                className="text-green-600 dark:text-green-400 hover:underline font-semibold"
              >
                contact support
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}