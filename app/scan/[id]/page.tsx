"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ReportSummary } from "../../../components/ReportSummary";
import ComplianceRisk from "../../../components/ComplianceRisk";
import { ResultsDisplay } from "../../../components/ResultsDisplay";
import NavBar from "../../../components/NavBar";
import { useSubscription } from "../../../lib/hooks/useQueries";
import { DisclaimerBanner } from "../../../components/legal/DisclaimerBanner";

interface ScanData {
  id: string;
  url: string;
  createdAt: string;
  status: string;
  issuesFound: number;
  results: any;
}

export default function ScanReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [scan, setScan] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: subscription } = useSubscription();

  useEffect(() => {
    let mounted = true;
    async function fetchScan() {
      setLoading(true);
      try {
        const res = await fetch(`/api/scans/${id}`);
        const data = await res.json();
        if (mounted && data?.success) {
          setScan(data.scan as ScanData);
        }
      } catch (e) {
        if (mounted) setScan(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchScan();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-6"
              >
                ⚙️
              </motion.div>
              <div className="text-2xl text-white font-semibold">Loading accessibility report...</div>
            </motion.div>
          </div>
        </main>
      </>
    );
  }

  if (!scan) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">❌</div>
              <div className="text-3xl font-bold text-red-400 mb-2">Report not found</div>
              <div className="text-gray-400">Please check the scan ID or try again later.</div>
            </motion.div>
          </div>
        </main>
      </>
    );
  }

  const plan = subscription?.plan ?? 'free';

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Legal Disclaimer */}
          <div className="mb-6">
            <DisclaimerBanner variant="compact" />
          </div>

          <motion.div
            className="mb-8 flex items-center gap-4 p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-5xl">📊</div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Accessibility Scan Report</h1>
              <div className="font-medium text-lg text-blue-400">{scan.url}</div>
              <div className="text-sm text-gray-400">
                {new Date(scan.createdAt).toLocaleString()} • <span className="font-semibold text-white">
                  {((scan.results as { violations?: unknown[] })?.violations?.length ?? scan.issuesFound)} {((((scan.results as { violations?: unknown[] })?.violations?.length ?? scan.issuesFound)) === 1 ? 'issue' : 'issues')} found
                </span>
              </div>
            </div>
          </motion.div>

          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {/* @ts-expect-error - Type casting from unknown */}
            <ReportSummary results={scan.results} />
          </motion.section>

          {(scan.results as { risk?: { standards: string[]; fines: { usUSD: number; euEUR: { min: number; max: number }; note?: string } } })?.risk && (
            <motion.section
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <ComplianceRisk risk={(scan.results as { risk: { standards: string[]; fines: { usUSD: number; euEUR: { min: number; max: number }; note?: string } } }).risk} />
            </motion.section>
          )}

          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* @ts-expect-error - Type casting from unknown */}
            <ResultsDisplay results={scan.results} issuesFound={scan.issuesFound} userPlan={plan} />
          </motion.section>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.a
              href="/dashboard"
              className="inline-block bg-white/10 border border-white/20 text-white px-8 py-3 rounded-lg shadow-lg font-semibold"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Dashboard
            </motion.a>

            {plan === 'pro' || plan === 'enterprise' || plan === 'business' ? (
              <>
                <motion.a
                  href={`/api/scans/${scan.id}/export`}
                  download
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg font-semibold"
                  whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
                  whileTap={{ scale: 0.95 }}
                >
                  📥 Export JSON
                </motion.a>

                <motion.a
                  href={`/api/scans/${scan.id}/export/csv`}
                  download
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg font-semibold"
                  whileHover={{ scale: 1.05, backgroundColor: "#16a34a" }}
                  whileTap={{ scale: 0.95 }}
                >
                  📊 Export CSV
                </motion.a>
              </>
            ) : (
              <motion.a
                href="/pricing"
                className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-lg shadow-lg font-semibold"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                🔓 Upgrade to Pro to export full reports
              </motion.a>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}
