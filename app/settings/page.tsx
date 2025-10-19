"use client";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import SettingsLayout from "../../components/profile/SettingsLayout";
import NavBar from "../../components/NavBar";
import { useOptimizedAnimations } from "../../hooks/useOptimizedAnimations";

export default function SettingsPage() {
  // Use optimized animation hook
  const { mounted, mousePos, particles, handleMouseMove } = useOptimizedAnimations({
    particleCount: 5,
    enableMouseTracking: true,
    throttleMs: 100
  });

  return (
    <>
      <SignedIn>
        <NavBar />
        <main className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 overflow-hidden" onMouseMove={handleMouseMove}>
          {/* Animated Background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
                transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`
              }}
            />
            {mounted && particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  opacity: p.opacity,
                  animation: `float ${p.duration}s ease-in-out infinite ${p.delay}s`,
                }}
              />
            ))}
          </div>

          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(20px, -20px) scale(1.05); }
              66% { transform: translate(-15px, 15px) scale(0.95); }
            }
          `}</style>

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 md:py-24">
            <motion.div 
              className="flex justify-end mb-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link 
                href="/dashboard" 
                className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:border-blue-200 transition-all hover:shadow-md text-gray-700 font-medium"
              >
                Back to Dashboard
              </Link>
            </motion.div>

            <SettingsLayout />
          </div>
        </main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

