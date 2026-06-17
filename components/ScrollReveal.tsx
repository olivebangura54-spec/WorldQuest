"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const directionClass =
      direction === "left"
        ? "scroll-reveal-left"
        : direction === "right"
        ? "scroll-reveal-right"
        : direction === "scale"
        ? "scroll-reveal-scale"
        : "scroll-reveal";

    el.classList.add(directionClass);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("revealed");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [delay, direction, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}