"use client";
import { useEffect, useRef, useState } from "react";
import ScanForm from "../../components/ScanForm";
import { ResultsDisplay } from "../../components/ResultsDisplay";
import { ReportSummary } from "../../components/ReportSummary";
import ScanLoading from "../../components/loading/ScanLoading";
import ComplianceRisk from "../../components/ComplianceRisk";

export default function DashboardPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#scan') {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600">
            Accessibility Scanner Dashboard
          </h1>
          <p className="text-gray-300 mt-4 text-lg">
            Scan your website and get instant insights to improve accessibility.
          </p>
        </div>

        {/* Scan Form */}
        <div className="mb-10 glass p-6 rounded-2xl shadow-xl bg-white/10 backdrop-blur-lg border border-white/10">
          <div id="scan" />
          <ScanForm onScanComplete={setResults} onLoadingChange={setLoading} inputRef={inputRef} />
        </div>

        {/* Loading */}
        {loading && (
          <div className="mb-10">
            <ScanLoading />
          </div>
        )}

        {/* Results */}
        {results ? (
          <div className="space-y-8">
            {results.teaser ? (
              <div className="space-y-6">
                <div className="glass p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">High‑Level Findings</h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {Object.entries(results.summary.severityCounts || {}).map(([k,v]) => (
                      <div key={k} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-sm capitalize text-gray-300">{k}</div>
                        <div className="text-3xl font-bold">{v as number}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Sources</h3>
                    <ul className="text-sm text-gray-300 list-disc list-inside">
                      {results.summary.sources?.map((s: any, i: number) => (
                        <li key={i}>{s.help} {s.impact ? `· ${s.impact}` : ''}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {results.risk && (
                  <ComplianceRisk risk={results.risk} />
                )}
                <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600/30 to-cyan-600/30">
                  <div className="md:flex items-center justify-between gap-6">
                    <div className="mb-4 md:mb-0">
                      <div className="text-xl font-semibold">See full report and scan more pages</div>
                      <div className="text-sm text-gray-200">Create an account to unlock detailed nodes, remediation tips, and unlimited scans.</div>
                    </div>
                    <div className="flex gap-3">
                      <a href="/sign-in?redirect_url=/pricing?from=report" className="px-5 py-2 rounded-lg bg-white text-gray-900 font-medium">See Full Report</a>
                      <a href="/sign-in?redirect_url=/pricing?from=more-scans" className="px-5 py-2 rounded-lg border border-white/40 font-medium">Scan More</a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="glass p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-md">
                  <ResultsDisplay results={results} />
                </div>
                {results.risk && (
                  <ComplianceRisk risk={results.risk} />
                )}
                <div className="glass p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-md">
                  <ReportSummary results={results} />
                </div>
              </>
            )}

            <div className="text-center mt-8">
              <button
                onClick={() => setResults(null)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg transition-all duration-200"
              >
                Scan Another Website
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-20 opacity-75">
            <div className="text-6xl mb-4">🔎</div>
            <p className="text-xl text-gray-400">Enter a URL above to start your accessibility analysis.</p>
          </div>
        )}
      </div>
    </main>
  );
}
