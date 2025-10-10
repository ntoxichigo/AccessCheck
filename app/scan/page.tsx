"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScanForm from "../../components/ScanForm";
import ScanLoading from "../../components/loading/ScanLoading";
import { ResultsDisplay } from "../../components/ResultsDisplay";
import { ReportSummary } from "../../components/ReportSummary";
import ComplianceRisk from "../../components/ComplianceRisk";
import NavBar from "../../components/NavBar";
import Link from "next/link";

export default function FreeScanPage() {
  const [results, setResults] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 mb-4">
              Free Accessibility Scan
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              One free scan per account. Sign in to unlock more and see full reports.
            </p>
          </motion.div>

          <motion.div 
            className="mb-10 glass p-6 rounded-2xl shadow-xl bg-white/10 backdrop-blur-lg border border-white/10"
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
                  {/* @ts-expect-error - Type casting from unknown */}
                  <ResultsDisplay results={(results as { results: unknown }).results} />
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
