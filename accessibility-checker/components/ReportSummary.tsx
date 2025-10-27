"use client";
import React from "react";

interface ReportSummaryProps {
  results: {
    violations?: {
      id: string;
      impact?: string;
      description?: string;
      help?: string;
      helpUrl?: string;
      nodes?: any[];
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
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-white/10 mt-8 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Accessibility Report Summary
      </h2>
      <p className="text-gray-300 mb-4">
        Total issues found: <strong>{total}</strong>
      </p>

      <ul className="grid md:grid-cols-2 gap-4">
        {Object.entries(counts).map(([impact, count]) => (
          <li
            key={impact}
            className="p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <p className="capitalize text-gray-200">
              {impact}: <span className="font-bold text-white">{count}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
