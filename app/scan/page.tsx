"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScanForm from "../../components/ScanForm";
import ScanLoading from "../../components/loading/ScanLoading";
import { ResultsDisplay } from "../../components/ResultsDisplay";
import { ReportSummary } from "../../components/ReportSummary";
import ComplianceRisk from "../../components/ComplianceRisk";
import NavBar from "../../components/NavBar";
import { UsageIndicator } from "../../components/UsageIndicator";
import Link from "next/link";

export default function FreeScanPage() {
  const [results, setResults] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [usageData, setUsageData] = useState<{
    scansUsed: number;
    scansLimit: number;
    plan: 'free' | 'pro' | 'enterprise';
    period: 'total' | 'daily';
  } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Fetch usage data
    fetch('/api/usage')
      .then((res) => res.json())
      .then((data) => setUsageData(data))
      .catch((err) => console.error('Failed to fetch usage:', err));
  }, []);

  return (
    <>
      <NavBar />
      <main className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
              Free Accessibility Scan
            </h1>
            <p className="text-gray-800 text-lg max-w-2xl mx-auto">
              One free scan per account. Sign in to unlock more and see full reports.<br />
              <span className="inline-block mt-3 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-md">
                <span className="text-base font-bold text-white">✨ Pro Plan: $19/month for unlimited scans & advanced features</span>
              </span>
            </p>
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

          <motion.div 
            className="mb-10 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div id="scan" />
            <ScanForm onScanComplete={setResults} onLoadingChange={setLoading} inputRef={inputRef} />
          </motion.div>

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

          <AnimatePresence mode="wait">
            {results && (
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="glass p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-md"
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                >
                  <ResultsDisplay 
                    results={(results as { results: any }).results} // eslint-disable-line @typescript-eslint/no-explicit-any
                    scanId={(results as { id?: string }).id}
                    userPlan={usageData?.plan || 'free'}
                    showPdfExport={true}
                  />
                </motion.div>
                
                {(results as { risk?: unknown }).risk ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ComplianceRisk risk={(results as { risk: { standards: string[]; fines: { usUSD: number; euEUR: { min: number; max: number }; note?: string } } }).risk} />
                  </motion.div>
                ) : null}
                
                <motion.div 
                  className="glass p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.005 }}
                >
                  {/* @ts-expect-error - Type casting from unknown */}
                  <ReportSummary results={(results as { results: unknown }).results} />
                </motion.div>
                
                {(results as { id?: string }).id && (
                  <motion.div 
                    className="text-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link href={`/scan/${(results as { id: string }).id}`}>
                      <motion.span
                        className="inline-block px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-lg cursor-pointer"
                        whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Full Report
                      </motion.span>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
