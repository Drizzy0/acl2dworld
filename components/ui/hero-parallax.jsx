// components/ui/hero-parallax.jsx
"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

export const HeroParallax = ({ products }) => {
    const firstRow = products.slice(0, 3);
    const secondRow = products.slice(3, 5);

    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

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
        <section ref={ref} className="relative h-[195vh] md:h-[140vh] overflow-hidden">
            {/* HERO CONTENT */}
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 sticky top-0 z-10 bg-white dark:bg-black">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold dark:text-white text-center md:text-left">
                    Explore Our Clothing Collection
                </h1>
                <p className="mt-4 max-w-xl text-base md:text-lg text-gray-600 dark:text-neutral-200 text-center md:text-left">
                    Discover stylish, high-quality clothing designed for every occasion.
                </p>

                <center>
                <a
                    href="/products"
                    className="mt-52 inline-block px-6 py-3 text-center bg-black text-white rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition"
                >
                    View Collection
                </a> 

                </center>
            </div>

            {/* FEATURED CLOTHES TITLE */}
            <motion.h2
                style={{ opacity }}
                className="text-center text-2xl md:text-3xl font-semibold mb-6 md:mb-8 dark:text-white relative z-20"
            >
                Featured Clothes
            </motion.h2>

            {/* PRODUCT ROWS WITH DRAMATIC EFFECT */}
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
                <motion.div
                    className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 md:mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2 },
                        },
                    }}
                >
                    {firstRow.map((product) => (
                        <ProductCard product={product} key={product.title} />
                    ))}
                </motion.div>
                <motion.div
                    className="flex flex-wrap justify-center gap-4 md:gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2 },
                        },
                    }}
                >
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
            className="group/product h-64 w-full sm:w-[18rem] md:w-[20rem] lg:w-[22rem] relative"
        >
            <a href={product.link} className="block">

                

                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="object-cover absolute h-full w-full inset-0 rounded-xl shadow-md"
                />
               
            </a>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/product:opacity-100 transition duration-300 rounded-xl"></div>
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end opacity-0 group-hover/product:opacity-100 transition duration-300">
                <h3 className="text-base md:text-lg font-semibold text-white">
                    {product.title}
                </h3>
                <span className="text-sm text-white/80">Shop Now</span>
            </div>
        </motion.div>
    );
};