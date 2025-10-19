"use client";
import React from "react";

interface ReportSummaryProps {
  results: {
    violations?: {
      id?: string;
      impact?: string;
      description?: string;
      help?: string;
      helpUrl?: string;
      nodes?: unknown[];
    }[];
  };
}

export function ReportSummary({ results }: ReportSummaryProps) {
  if (!results || !results.violations) return null;

  const counts = results.violations.reduce(
    (acc, v) => {
      const impact = v.impact || "unknown";
      acc[impact] = (acc[impact] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const total = results.violations.length;

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 p-6 rounded-xl mt-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        📊 Accessibility Report Summary
      </h2>
      <p className="text-gray-700 mb-6 text-lg">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200">
          <span className="font-bold text-blue-900">Total issues found: {total}</span>
        </span>
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(counts).map(([impact, count]) => {
          const getImpactStyle = (impact: string) => {
            switch (impact.toLowerCase()) {
              case 'critical':
                return {
                  bg: 'bg-gradient-to-br from-red-50 to-rose-50',
                  border: 'border-red-200',
                  text: 'text-red-800',
                  icon: '🚨'
                };
              case 'serious':
                return {
                  bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
                  border: 'border-orange-200',
                  text: 'text-orange-800',
                  icon: '⚠️'
                };
              case 'moderate':
                return {
                  bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
                  border: 'border-yellow-200',
                  text: 'text-yellow-800',
                  icon: '🔔'
                };
              case 'minor':
                return {
                  bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
                  border: 'border-blue-200',
                  text: 'text-blue-800',
                  icon: 'ℹ️'
                };
              default:
                return {
                  bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
                  border: 'border-gray-200',
                  text: 'text-gray-800',
                  icon: '❓'
                };
            }
          };

          const style = getImpactStyle(impact);
          
          return (
            <div
              key={impact}
              className={`p-4 ${style.bg} rounded-lg border ${style.border} shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{style.icon}</span>
                  <span className={`capitalize font-semibold ${style.text}`}>
                    {impact}
                  </span>
                </div>
                <span className={`text-2xl font-black ${style.text}`}>
                  {count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
