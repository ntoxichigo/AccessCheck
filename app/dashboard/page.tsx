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
import { SignedIn, SignedOut, RedirectToSignIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { DisclaimerBanner } from "../../components/legal/DisclaimerBanner";

export default function DashboardPage() {
  const [results, setResults] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#scan') {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const content = (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Account toolbar */}
          <motion.div 
            className="flex justify-end mb-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SignedIn>
              <div className="flex items-center gap-3">
                <Link 
                  href="/settings" 
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 transition-all hover:shadow-lg"
                >
                  Settings
                </Link>
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
              </div>
            </SignedIn>
          </motion.div>

          {/* Personalized user info */}
          <SignedIn>
            {user && (
              <motion.div 
                className="flex items-center gap-4 mb-8 p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg"
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
                  <div className="font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Welcome back, {user.firstName || user.username || 'User'}!
                  </div>
                  <div className="text-gray-300 text-sm">{user.emailAddresses?.[0]?.emailAddress}</div>
                </div>
              </motion.div>
            )}
          </SignedIn>

          {/* Legal Disclaimer */}
          <div className="mb-6">
            <DisclaimerBanner variant="compact" />
          </div>

          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 mb-4">
              Accessibility Scanner Dashboard
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Scan your website and get instant insights to improve accessibility.
            </p>
          </motion.div>

          {/* Scan Form */}
          <motion.div 
            className="mb-10 glass p-6 rounded-2xl shadow-xl bg-white/10 backdrop-blur-lg border border-white/10"
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
                  className="glass p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-md"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* @ts-expect-error - Type casting from Record<string, unknown> */}
                  <ResultsDisplay results={results} />
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
                  className="glass p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-md"
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
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg font-semibold"
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
                  <p className="text-xl text-gray-400">Enter a URL above to start your accessibility analysis.</p>
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
