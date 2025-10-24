"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { checkProfileCompletion } from "@/lib/appwrite";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const HeroParallax = ({ products }) => {
  const { user } = useUser();
  console.log("HeroParallax user:", user);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [profileStatus, setProfileStatus] = useState({
    isComplete: false,
    completionPercentage: 0,
    missingFields: [],
  });

  useEffect(() => {
    async function checkProfile() {
      if (user?.document && user?.$id) {
        const status = await checkProfileCompletion(user.document, user.$id);
        setProfileStatus(status);
      }
    }
    checkProfile();
  }, [user]);

  const firstRow = products.slice(0, 3);
  const secondRow = products.slice(3, 5);

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30 };

  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-500, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [10, 0]),
    springConfig
  );

  return (
    <section ref={ref} className="relative md:h-[150vh] overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center h-auto md:h-[60vh] px-4 max-w-7xl mx-auto gap-8 z-10 relative pt-12 md:pt-20">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold dark:text-white">
            {isMounted && user
              ? `Welcome back, ${
                  user.document?.firstName ||
                  user.name?.split(" ")[0] ||
                  "there"
                }!`
              : "Explore Our Clothing Collection"}
          </h1>

          <p className="mt-4 max-w-xl text-base md:text-lg text-gray-600 dark:text-neutral-200 mx-auto md:mx-0">
            Discover stylish, high-quality clothing designed for every occasion.
          </p>

          <div className="flex justify-center md:justify-start mt-8">
            <Link
              href="/shop"
              className="inline-block px-6 py-3 text-center bg-black text-white rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition shadow-md"
            >
              View Collection
            </Link>
          </div>
        </div>

        {isMounted && user?.document && (
          <div className="flex-1 max-w-md w-full">
            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-gray-700 shadow-xl">
              <h3 className="text-xl text-gray-900 font-semibold mb-4">
                Profile Status
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Completion</span>
                  <span
                    className={cn(
                      "font-bold text-lg",
                      profileStatus.isComplete
                        ? "text-green-400"
                        : "text-yellow-400"
                    )}
                  >
                    {profileStatus.completionPercentage}%
                  </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className={cn(
                      "h-3 rounded-full transition-all duration-500",
                      profileStatus.isComplete
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    )}
                    style={{ width: `${profileStatus.completionPercentage}%` }}
                  />
                </div>

                {profileStatus.isComplete ? (
                  <div className="flex items-center space-x-2 text-green-400 bg-green-900/20 p-3 rounded-lg">
                    <Check size={20} />
                    <span className="font-semibold">Profile Complete ✓</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-yellow-400 mb-2 font-semibold">
                      Incomplete Fields:
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1 mb-4">
                      {profileStatus.missingFields.map((field) => (
                        <li key={field} className="flex items-center space-x-2">
                          <span className="text-yellow-400">•</span>
                          <span>{field.replace(/([A-Z])/g, " $1").trim()}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/profile">
                      <button className="w-full px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition font-semibold shadow-lg">
                        Complete Profile Now
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-[40vh]">
        <motion.h2
          style={{ opacity }}
          className="text-center text-2xl md:text-3xl font-semibold mb-6 md:mb-8 dark:text-white relative z-20"
        >
          Featured Clothes
        </motion.h2>

        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
            perspective: 1000,
          }}
          className="px-4 max-w-7xl mx-auto relative z-20"
        >
          <motion.div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 md:mb-8">
            {firstRow.map((product, index) => (
              <ProductCard product={product} key={product.link || index} />
            ))}
          </motion.div>

          <motion.div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {secondRow.map((product, index) => (
              <ProductCard
                product={product}
                key={product.link || index + firstRow.length}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export const ProductCard = ({ product }) => {
  return (
    <motion.div
      variants={{
        hidden: { y: 50, opacity: 0, scale: 0.9 },
        visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5 } },
      }}
      whileHover={{ y: -15, scale: 1.05, rotateZ: 2 }}
      className="group/product w-full max-w-[20rem] mx-auto relative"
    >
      <a href={product.link} className="block w-full relative">
        <div className="w-full aspect-[4/5] relative">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="object-contain w-full h-full mx-auto rounded-xl shadow-md brightness-110"
          />
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl"></div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition duration-300">
          <h3 className="text-base md:text-lg font-semibold text-white">
            {product.title}
          </h3>
          <span className="text-sm text-white/80">Shop Now</span>
        </div>
      </a>
    </motion.div>
  );
};