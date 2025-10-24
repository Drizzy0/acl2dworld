"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import {
  loginUser,
  logoutUser,
  getUserDocument,
  account,
  createUserDocument,
  resendVerificationEmail,
} from "@/lib/appwrite";
import { useUser } from "@/contexts/UserContext";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [showResend, setShowResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [resendEmail, setResendEmail] = useState("");
  const router = useRouter();
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await logoutUser();

      const session = await loginUser(email, password);
      console.log("✅ Session created");

      await new Promise((r) => setTimeout(r, 800));

      const currentUser = await account.get();
      console.log("✅ Got user:", currentUser.$id);

      if (!currentUser.emailVerification) {
        setError("Please verify your email before signing in.");
        setShowResend(true);
        setResendEmail(email);
        await logoutUser();
        setLoading(false);
        return;
      }

      let userDoc = await getUserDocument(currentUser.$id);

      if (!userDoc) {
        console.log("📄 No user document found. Creating one...");
        userDoc = await createUserDocument(
          currentUser.$id,
          currentUser.name.split(" ")[0] || "User",
          currentUser.name.split(" ")[1] || "",
          currentUser.email
        );
        console.log("✅ User document created after login:", userDoc.$id);
      }

      toast.success("Login successful! Redirecting...");

      if (userDoc.role === "Admin") {
        console.log("➡️ Redirecting to /dashboard");
        window.location.href = "/dashboard";
      } else {
        console.log("➡️ Redirecting to /");
        window.location.href = "/";
      }
    } catch (error) {
      console.error(`❌ Sign-in failed for ${email}: ${error.message}`);
      setError(error.message || "Something went wrong. Please try again!");
      toast.error("Login failed");
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!canResend || !resendEmail) return;

    setIsResending(true);
    try {
      await loginUser(resendEmail, password);

      await resendVerificationEmail();
      toast.success("Verification email resent successfully!");

      setCanResend(false);
      setCountdown(180);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      await logoutUser();
    } catch (error) {
      console.error("Resend error:", error);
      toast.error(
        "Failed to resend verification email. Please check your credentials."
      );
      await logoutUser();
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    async function checkSession() {
      setChecking(true);
      try {
        const currentUser = await account.get();
        console.log(
          "ℹ️ Active session found during initial check:",
          currentUser.email
        );

        if (!currentUser.emailVerification) {
          setError("Please verify your email before signing in.");
          await logoutUser();
          return;
        }

        const userDoc = await getUserDocument(currentUser.$id);
        if (!userDoc) return;

        await refreshUser();

        if (userDoc.role === "Admin") {
          console.log("➡️ Initial check: Redirecting admin to /dashboard");
          router.push("/dashboard");
        } else {
          console.log("➡️ Initial check: Redirecting user to /");
          router.push("/");
        }
      } catch (err) {
        if (err.code === 401) {
          console.log("ℹ️ No active session during initial check");
        } else {
          console.error("❌ Initial session check error:", err.message);
        }
      } finally {
        setChecking(false);
      }
    }

    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 ml-11">
        <Image
          src="/images/newest.PNG"
          alt="Air Clothing Line Logo"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/images/newest.PNG"
              alt="Air Clothing Line Logo"
              width={120}
              height={40}
              className="mx-auto"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Sign in to your account to continue shopping
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6"
        >
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-4 rounded-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {showResend && (
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={isResending || !canResend}
              className="w-full mt-4 px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <span>
                {isResending
                  ? "Resending..."
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend Verification Email"}
              </span>
              <Mail className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center justify-end text-sm">
            <Link
              href="/forgot-password"
              className="text-black dark:text-white hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-semibold hover:bg-gray-900 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white dark:border-black"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-black dark:text-white font-semibold hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Air Clothing Line. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}