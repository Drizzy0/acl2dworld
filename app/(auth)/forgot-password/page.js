"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/lib/appwrite";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await requestPasswordReset(email);
      setMessage("✅ Password reset link sent! Check your email to continue.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 ml-11 -mt-16">
        <Image
          src="/images/newest.PNG"
          alt="Clothing background"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <Image
          src="/images/newest.PNG"
          alt="Air Clothing Line Logo"
          width={100}
          height={30}
          className="mx-auto mb-4"
        />
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Forgot Password?{" "}
        </h2>{" "}
        <p className="text-center text-gray-500 mb-8">
          Enter your email to receive a password reset link.{" "}
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-gray-900 rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              {error}
            </p>
          )}
          {message && (
            <p className="text-green-600 bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Remembered your password?{" "}
          <a href="/sign-in" className="text-indigo-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}