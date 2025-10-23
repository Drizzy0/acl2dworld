"use client";
import { Check, Mail, AlertCircle } from "lucide-react";
import { useState } from "react";
import { resendVerificationEmail } from "@/lib/appwrite";
import { toast } from "react-toastify";
import Link from "next/link";

export default function SuccessScreen({ email }) {
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-4">
          Account Created Successfully! 🎉
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-blue-800 dark:text-blue-300 text-sm text-center font-medium mb-2">
            📧 Verification Email Sent
          </p>
          <p className="text-blue-700 dark:text-blue-400 text-sm text-center">
            We've sent a verification link to <strong>{email}</strong>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6">
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
            <strong>Next steps:</strong>
          </p>
          <ol className="text-gray-600 dark:text-gray-400 text-sm space-y-2 list-decimal list-inside">
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the verification link in the email</li>
            <li>Return here and sign in to your account</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 dark:text-amber-300 text-sm font-medium mb-1">
                Didn&apos;t receive the email?
              </p>
              <p className="text-amber-700 dark:text-amber-400 text-xs">
                Check your spam folder, or you can resend the verification email
                from the sign-in page.
              </p>
            </div>
          </div>
        </div>

        <Link href="/sign-in">
          <button className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
            <span>Go to Sign In</span>
          </button>
        </Link>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
          Check your spam folder or contact support if issues persist
        </p>
      </div>
    </div>
  );
}