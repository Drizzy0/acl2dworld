"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite";

export default function Verify() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    const userId = params.get("userId");
    const secret = params.get("secret");

    if (!userId || !secret) {
      setStatus("Invalid verification link.");
      return;
    }

    async function verifyEmail() {
      try {
        await account.updateVerification(userId, secret);
        setStatus("✅ Email verified successfully!");
        setTimeout(() => router.push("/sign-in"), 2000);
      } catch (error) {
        console.error("❌ Verification failed:", error);
        setStatus("Verification failed or link expired.");
      }
    }

    verifyEmail();
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow text-center max-w-sm">
        <p className="text-gray-700 text-lg font-medium">{status}</p>
      </div>
    </div>
  );
}