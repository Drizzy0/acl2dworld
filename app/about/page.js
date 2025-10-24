"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Heart, Shirt, Users, Award, Truck } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative bg-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-gray-900"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About Air Clothing Line
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
            Elevating everyday style with timeless pieces crafted for the modern
            wardrobe. Where fashion meets sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/shop"
              className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Shop Collection
            </Link>
            <Link
              href="/contact"
              className="flex items-center px-8 py-4 text-white border-2 border-white rounded-full font-semibold hover:bg-white hover:text-black transition"
            >
              Contact Us <ChevronRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold dark:text-white mb-4">
              Our Story
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Founded in 2020, Air Clothing Line was born from a passion for
              effortless style and ethical fashion. We believe clothing should
              empower, not overwhelm.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/about-story.jpg"
                alt="Our story"
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                From sketching designs in a small studio to curating collections
                worn by trendsetters worldwide, our journey is about blending
                urban edge with timeless elegance. Every stitch tells a story of
                innovation and care.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Shirt
                    size={32}
                    className="mx-auto mb-2 text-black dark:text-white"
                  />
                  <p className="font-bold dark:text-white">Premium Fabrics</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Heart
                    size={32}
                    className="mx-auto mb-2 text-black dark:text-white"
                  />
                  <p className="font-bold dark:text-white">Ethical Craft</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Truck
                    size={32}
                    className="mx-auto mb-2 text-black dark:text-white"
                  />
                  <p className="font-bold dark:text-white">Global Shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              To redefine fashion with pieces that are versatile, sustainable,
              and designed to last.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold dark:text-white">
                Community First
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Building a global community of style enthusiasts who value
                quality over quantity.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold dark:text-white">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Committed to superior craftsmanship and innovative designs that
                stand the test of time.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Shirt size={24} />
              </div>
              <h3 className="text-xl font-bold dark:text-white">
                Sustainability
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Using eco-friendly materials and processes to minimize our
                environmental footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Join the Air Movement</h2>
          <p className="text-xl mb-8 opacity-90">
            Sign up for exclusive updates, styling tips, and early access to new
            drops.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-black focus:outline-none"
            />
            <button className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}