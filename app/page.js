"use client";
import { HeroParallaxDemo } from "@/components/hero-parallax-demo";
import { MarqueeDemo } from "@/components/MarqueeDemo";
import { PulsatingButton } from "@/components/magicui/pulsating-button";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loadingUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loadingUser && user?.document?.role === "Admin") {
      router.push("/dashboard");
    }
  }, [user, loadingUser, router]);

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading page...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-8">
      <HeroParallaxDemo />
      <section className="py-5 px-6 my-9 bg-gray-100 dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">
            More Products
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Browse our entire collection for even more amazing deals and
            categories.
          </p>
          <Link href="/shop">
            <div className="flex justify-center">
              <PulsatingButton pulseColor="#22c55e" duration="5s">
                Shop Now
              </PulsatingButton>
            </div>
          </Link>
        </div>
      </section>
      <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
        Reviews
      </h2>
      <MarqueeDemo />
    </main>
  );
}