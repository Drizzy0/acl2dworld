import { Navbar } from "@/components/ui/navbar-menu";
import NewArrivals from "@/components/newArrivals";
import { HeroParallaxDemo } from "@/components/hero-parallax-demo";
import { MarqueeDemo } from "@/components/MarqueeDemo";
import { Footer } from "@/components/Footer";
import { PulsatingButton } from "@/components/magicui/pulsating-button";

export default function Home() {
  return (
    <div>

      <main className="p-8">
        <HeroParallaxDemo />

        <NewArrivals />


        <section className="py-5 px-6 my-9 bg-gray-100 dark:bg-neutral-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">
              More Products
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Browse our entire collection for even more amazing deals and
              categories.
            </p>

            <a
                href="/products"
                className="hover:text-primary transition-colors"
              >

            <center className="mt-5">
              <PulsatingButton pulseColor="#22c55e" duration="5s">Click Me</PulsatingButton>
            </center>

              </a>

          </div>
        </section>

        <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white  h-10 w-25">
          Reviews
        </h2>

        <MarqueeDemo />





      </main>
    </div>




  );
}





