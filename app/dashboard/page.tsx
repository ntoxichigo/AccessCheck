"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ScanForm from "../../components/ScanForm";
import { ResultsDisplay } from "../../components/ResultsDisplay";
import { ReportSummary } from "../../components/ReportSummary";
import ScanLoading from "../../components/loading/ScanLoading";
import ComplianceRisk from "../../components/ComplianceRisk";
import ScanHistory from "../../components/ScanHistory";
import NavBar from "../../components/NavBar";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useOptimizedAnimations } from "../../hooks/useOptimizedAnimations";
import { UsageIndicator } from "../../components/UsageIndicator";
import { OnboardingTutorial } from "../../components/OnboardingTutorial";

export default function DashboardPage() {
  const [results, setResults] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [usageData, setUsageData] = useState<{
    scansUsed: number;
    scansLimit: number;
    plan: 'free' | 'pro' | 'enterprise';
    period: 'total' | 'daily';
  } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useUser();
  
  // Use optimized animation hook
  const { mounted, mousePos, particles, handleMouseMove } = useOptimizedAnimations({
    particleCount: 6,
    enableMouseTracking: true,
    throttleMs: 100
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#scan') {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Fetch usage data
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/usage');
        if (response.ok) {
          const data = await response.json();
          setUsageData(data);
        }
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
      }
    };

    if (user) {
      fetchUsage();
    }
  }, [user, results]); // Refetch when results change (after a scan)

  const content = (
    <>
      <NavBar />
      <OnboardingTutorial />
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

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          {/* Quick action button - NavBar already has Settings & Account */}
          <motion.div
            className="flex justify-end mb-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SignedIn>
              <Link
                href="/bulk-scan"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all font-semibold"
              >
                📊 Bulk Scan
              </Link>
            </SignedIn>
          </motion.div>

          {/* Personalized user info */}
          <SignedIn>
            {user && (
              <motion.div 
                className="flex items-center gap-4 mb-8 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.01 }}
              >
                {user.imageUrl && (
                  <Image 
                    src={user.imageUrl} 
                    alt="User avatar" 
                    width={56} 
                    height={56} 
                    className="rounded-full border-2 border-blue-400/50 shadow-lg" 
                  />
                )}
                <div>
                  <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome back, {user.firstName || user.username || 'User'}!
                  </div>
                  <div className="text-gray-800 text-sm">{user.emailAddresses?.[0]?.emailAddress}</div>
                </div>
              </motion.div>
            )}
          </SignedIn>

          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 backdrop-blur-sm mb-6">
              <span className="text-xs font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent uppercase tracking-wide">
                Dashboard
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Accessibility Scanner
              </span>
            </h1>
            {usageData?.plan === 'free' && (
              <p className="text-gray-800 text-lg max-w-2xl mx-auto">
                <span className="inline-block px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-md">
                  <span className="font-bold text-white">✨ Pro Plan: $19/month for unlimited scans & advanced features</span>
                </span>
                <br className="mt-2" />
                Full accessibility reports, priority support, and PDF exports.
              </p>
            )}
          </motion.div>

          {/* Usage Indicator */}
          {usageData && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <UsageIndicator
                scansUsed={usageData.scansUsed}
                scansLimit={usageData.scansLimit}
                plan={usageData.plan}
                period={usageData.period}
              />
            </motion.div>
          )}

          {/* Scan Form */}
          <motion.div 
            className="mb-10 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div id="scan" />
            <ScanForm onScanComplete={setResults} onLoadingChange={setLoading} inputRef={inputRef} />
          </motion.div>

          {/* Loading */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                className="mb-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ScanLoading />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence mode="wait">
            {results ? (
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <ResultsDisplay 
                    results={results as any} // eslint-disable-line @typescript-eslint/no-explicit-any
                    userPlan={usageData?.plan || 'free'}
                    scanId={(results as { id?: string }).id}
                    showPdfExport={true}
                  />
                </motion.div>
                
                {(results as { risk?: { standards: string[]; fines: { usUSD: number; euEUR: { min: number; max: number }; note?: string } } }).risk && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ComplianceRisk risk={(results as { risk: { standards: string[]; fines: { usUSD: number; euEUR: { min: number; max: number }; note?: string } } }).risk} />
                  </motion.div>
                )}
                
                <motion.div 
                  className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <ReportSummary results={results} />
                </motion.div>

                <motion.div 
                  className="text-center mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    onClick={() => setResults(null)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Scan Another Website
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ScanHistory />
                <motion.div 
                  className="text-center mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div 
                    className="text-6xl mb-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    🔎
                  </motion.div>
                  <p className="text-xl text-gray-800">Enter a URL above to start your accessibility analysis.</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );

  return (
    <>
      <SignedIn>{content}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
