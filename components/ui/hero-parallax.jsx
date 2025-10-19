"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const HeroParallax = ({ products }) => {
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
      <div className="flex flex-col justify-center items-center h-screen px-4 max-w-7xl mx-auto text-center md:text-left z-10 relative">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold dark:text-white">
          Explore Our Clothing Collection
        </h1>
        <p className="mt-4 max-w-xl text-base md:text-lg text-gray-600 dark:text-neutral-200">
          Discover stylish, high-quality clothing designed for every occasion.
        </p>
        <div className="flex justify-center mt-8">
          <a
            href="/shop"
            className="inline-block px-6 py-3 text-center bg-black text-white rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition"
          >
            View Collection
          </a>
        </div>
      </div>

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
          {firstRow.map((product) => (
            <ProductCard product={product} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {secondRow.map((product) => (
            <ProductCard product={product} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
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