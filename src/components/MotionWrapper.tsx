"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import * as React from "react";
import { useRef, useEffect, useState } from "react";

/**
 * Reveal: Animates an element as it enters the viewport.
 */
export function Reveal({ 
  children, 
  direction = "up", 
  delay = 0, 
  fullWidth = false,
  className
}: { 
  children: React.ReactNode; 
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  fullWidth?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ width: fullWidth ? "100%" : "auto" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parallax: Moves an element at a different speed than the scroll.
 */
export function Parallax({ children, offset = 50, className }: { children: React.ReactNode; offset?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Floating: Adds a subtle constant floating animation.
 */
export function Floating({ children, duration = 4, delay = 0, className }: { children: React.ReactNode; duration?: number; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -15, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Counter: Animates a number from 0 to target.
 */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / end));
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, stepTime);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}
