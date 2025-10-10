'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Crown, Download, FileText, TrendingUp } from 'lucide-react';

interface AxeNode {
  html: string;
}

interface AxeViolation {
  help: string;
  description: string;
  impact: string;
  helpUrl: string;
  nodes?: AxeNode[];
}

interface AxeResults {
  violations: AxeViolation[];
}

interface ResultsDisplayProps {
  results: AxeResults;
  issuesFound?: number;
  userPlan?: 'free' | 'pro' | 'enterprise';
}


export function ResultsDisplay({ results, userPlan = 'free' }: ResultsDisplayProps) {
  const { user } = useUser();
  if (!results) return null;

  const violations = results.violations || [];
  const isFreeUser = userPlan === 'free' || !user;
  
  // Show only first 3 violations for free users
  const displayedViolations = isFreeUser ? violations.slice(0, 3) : violations;
  const hiddenCount = violations.length - displayedViolations.length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Accessibility Report</h2>
      {violations.length === 0 ? (
        <p className="text-green-600 text-lg font-semibold">✅ No accessibility issues found!</p>
      ) : (
        <>
          <ul className="space-y-6">
            {displayedViolations.map((v, i) => (
              <li key={i} className="border p-6 rounded-xl bg-white/80 shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: v.impact === 'critical' ? '#dc2626' : v.impact === 'serious' ? '#f59e42' : v.impact === 'moderate' ? '#fbbf24' : '#a3e635' }}></span>
                  <h3 className="font-semibold text-lg">{v.help}</h3>
                </div>
                <p className="text-sm text-gray-700 mb-2">{v.description}</p>
                <p className="text-sm mb-2">
                  <strong>Impact:</strong> <span className="font-bold text-red-700">{v.impact}</span>
                </p>
                <a
                  href={v.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm mb-2 inline-block"
                >
                  Learn more
                </a>
                {isFreeUser ? (
                  <p className="mt-2 text-sm text-gray-500 italic">
                    🔒 Upgrade to Pro to see affected elements and detailed remediation steps
                  </p>
                ) : (
                  v.nodes && v.nodes.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                      {v.nodes.map((node, j) => (
                        <li key={j} className="mb-1"><code className="bg-gray-100 px-2 py-1 rounded">{node.html}</code></li>
                      ))}
                    </ul>
                  )
                )}
              </li>
            ))}
          </ul>

          {/* Upgrade CTA for free users */}
          {isFreeUser && hiddenCount > 0 && (
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Crown className="h-12 w-12 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    🚀 Unlock Full Report with Pro
                  </h3>
                  <p className="text-gray-300 mb-4">
                    You&apos;re viewing a limited preview. <span className="font-semibold text-yellow-300">{hiddenCount} more issue{hiddenCount > 1 ? 's' : ''}</span> found but hidden in the free plan.
                  </p>
                  <div className="grid md:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span>Unlimited scans</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span>Detailed reports</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <Download className="h-4 w-4 text-purple-400" />
                      <span>Download CSV/PDF</span>
                    </div>
                  </div>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Crown className="h-5 w-5" />
                    Upgrade to Pro - $29/month
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
