"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const PulsatingButton = React.forwardRef(
  (
    {
      className,
      children,
      pulseColor = "#808080",
      duration = "1.5s",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative flex cursor-pointer items-center justify-center rounded-lg bg-primary px-3 py-2 text-center text-primary-foreground font-light",
          className
        )}
        style={{
          "--pulse-color": pulseColor,
          "--duration": duration,
        }}
        {...props}
      >
        {/* Pulsating ring */}
        <span className="absolute left-1/2 top-1/2 size-full rounded-lg bg-[var(--pulse-color)] animate-pulseRing" />

        {/* Button text/content */}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

PulsatingButton.displayName = "PulsatingButton";