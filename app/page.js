import { HeroParallaxDemo } from "@/components/hero-parallax-demo";
import { MarqueeDemo } from "@/components/MarqueeDemo";
import { PulsatingButton } from "@/components/magicui/pulsating-button";
import Link from "next/link";

export default function Home() {
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