

"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}

export const products = [
  {
    title: "Classic White Shirt",
    link: "/products/white-shirt",
    thumbnail: "/images/car1.JPG",
  },
  {
    title: "Denim Jacket",
    link: "/products/denim-jacket",
    thumbnail: "/images/car4.JPG",
  },
  {
    title: "Black Slim Jeans",
    link: "/products/slim-jeans",
    thumbnail: "/images/IMG_7104.jpg",
  },
  {
    title: "Summer Dress",
    link: "/products/summer-dress",
    thumbnail: "/images/IMG_7105.jpg",
  },
  {
    title: "Leather Boots",
    link: "/products/leather-boots",
    thumbnail: "/images/replace3.HEIC",
  },
];