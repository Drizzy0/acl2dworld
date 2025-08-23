"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}

export const products = [
  {
    title: "",
    link: "/products/white-shirt",
    thumbnail: "/images/num2.jpg",
  },
  {
    title: "",
    link: "/products/denim-jacket",
    thumbnail: "/images/pleasework.jpg",
  },
  {
    title: "",
    link: "/products/slim-jeans",
    thumbnail: "/images/num1.jpg",
  },
];