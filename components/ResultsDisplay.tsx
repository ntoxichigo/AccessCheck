'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Crown, Download, FileText, TrendingUp, Code, Copy, Check } from 'lucide-react';
import { PDFExportButton } from './PDFExportButton';
import { getFixSuggestions, getQuickFix } from '@/lib/accessibility-fixes';
import { useState } from 'react';

interface AxeNode {
  html: string;
}

interface AxeViolation {
  help: string;
  description: string;
  impact: string;
  helpUrl: string;
  id?: string;
  nodes?: AxeNode[];
}

interface AxeResults {
  violations: AxeViolation[];
}

interface ResultsDisplayProps {
  results: AxeResults;
  issuesFound?: number;
  userPlan?: 'free' | 'pro' | 'enterprise';
  scanId?: string;
  showPdfExport?: boolean;
}

function CodeSnippet({ code, language, label }: { code: string; language: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-300">{label}</span>
          <span className="text-xs text-gray-500">({language})</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-gray-100 font-mono">{code}</code>
      </pre>
    </div>
  );
}

export function ResultsDisplay({ results, userPlan = 'free', scanId, showPdfExport = false }: ResultsDisplayProps) {
  const { user } = useUser();
  if (!results) return null;

  const violations = results.violations || [];
  const isFreeUser = userPlan === 'free' || !user;

  // Show only first 3 violations for free users
  const displayedViolations = isFreeUser ? violations.slice(0, 3) : violations;
  const hiddenCount = violations.length - displayedViolations.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Accessibility Report</h2>
        {showPdfExport && scanId && !isFreeUser && (
          <PDFExportButton scanId={scanId} />
        )}
      </div>
      {violations.length === 0 ? (
        <div className="p-6 rounded-lg bg-green-50 border-2 border-green-500">
          <p className="text-green-700 text-lg font-semibold">✅ No accessibility issues found!</p>
          <p className="text-green-600 text-sm mt-2">
            This scan detected no WCAG violations. However, automated tools can only catch ~30-40% of accessibility issues. 
            Consider manual testing for complete coverage.
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-6">
            {displayedViolations.map((v, i) => {
              const fixSuggestion = !isFreeUser ? getFixSuggestions(v.id || '', v.help) : null;
              const quickFix = !isFreeUser ? getQuickFix(v.id || '') : null;
              
              return (
                <li key={i} className="border p-6 rounded-xl bg-white/80 shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: v.impact === 'critical' ? '#dc2626' : v.impact === 'serious' ? '#f59e42' : v.impact === 'moderate' ? '#fbbf24' : '#a3e635' }}></span>
                    <h3 className="font-semibold text-lg">{v.help}</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{v.description}</p>
                  <p className="text-sm mb-2">
                    <strong>Impact:</strong> <span className="font-bold text-red-700">{v.impact}</span>
                  </p>
                  
                  {/* Quick Fix */}
                  {!isFreeUser && quickFix && (
                    <div className="my-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-sm font-semibold text-blue-900 mb-1">⚡ Quick Fix:</p>
                      <p className="text-sm text-blue-800">{quickFix}</p>
                    </div>
                  )}
                  
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
                      🔒 Upgrade to Pro to see affected elements, code snippets, and detailed remediation steps
                    </p>
                  ) : (
                    <>
                      {v.nodes && v.nodes.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Affected Elements:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {v.nodes.map((node, j) => (
                              <li key={j}><code className="bg-gray-100 px-2 py-1 rounded text-xs">{node.html}</code></li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Code Snippets */}
                      {fixSuggestion && (
                        <div className="mt-4 border-t pt-4">
                          <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            {fixSuggestion.title}
                          </h4>
                          <p className="text-sm text-gray-700 mb-3">{fixSuggestion.description}</p>
                          <div className="space-y-3">
                            {fixSuggestion.codeSnippets.map((snippet, idx) => (
                              <CodeSnippet 
                                key={idx}
                                code={snippet.code}
                                language={snippet.language}
                                label={snippet.label}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Upgrade CTA for free users */}
          {isFreeUser && hiddenCount > 0 && (
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Crown className="h-12 w-12 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🚀 Unlock Full Report with Pro
                  </h3>
                  <p className="text-gray-700 mb-4">
                    You&apos;re viewing a limited preview. <span className="font-semibold text-red-600">{hiddenCount} more issue{hiddenCount > 1 ? 's' : ''}</span> found but hidden in the free plan.
                  </p>
                  <div className="grid md:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span>10 scans per day</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>Detailed reports</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Download className="h-4 w-4 text-purple-600" />
                      <span>Download CSV/PDF</span>
                    </div>
                  </div>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Crown className="h-5 w-5" />
                    Upgrade to Pro - $19/month
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
