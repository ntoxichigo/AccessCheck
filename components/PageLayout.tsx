"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import NavBar from "./NavBar";

interface PageLayoutProps {
  children: ReactNode;
  theme?: "dark" | "light";
  showNav?: boolean;
  containerSize?: "narrow" | "default" | "wide";
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number]
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

export default function PageLayout({ 
  children, 
  theme = "dark",
  showNav = true,
  containerSize = "default"
}: PageLayoutProps) {
  const bgClass = theme === "dark" 
    ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
    : "bg-white text-gray-900";
  
  const containerClass = {
    narrow: "max-w-4xl",
    default: "max-w-6xl",
    wide: "max-w-7xl"
  }[containerSize];

  return (
    <>
      {showNav && <NavBar />}
      <motion.main
        id="main-content"
        className={`min-h-screen ${bgClass}`}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className={`${containerClass} mx-auto px-6 py-16`}>
          {children}
        </div>
      </motion.main>
    </>
  );
}
