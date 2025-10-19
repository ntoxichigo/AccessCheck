'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  CheckCircle2,
  Code,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { FixSuggestion } from '../../lib/fixes/wcag-fixes';

interface FixSuggestionCardProps {
  violation: {
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl: string;
    nodes: Array<{ html: string; target: string[] }>;
  };
  fixSuggestion: FixSuggestion | null;
}

export default function FixSuggestionCard({ violation, fixSuggestion }: FixSuggestionCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copiedCode, setCopiedCode] = useState<'before' | 'after' | null>(null);

  const copyToClipboard = async (text: string, type: 'before' | 'after') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'from-red-500 to-rose-500';
      case 'serious':
        return 'from-orange-500 to-amber-500';
      case 'moderate':
        return 'from-yellow-500 to-orange-400';
      case 'minor':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'serious':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'minor':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getImpactBadgeColor(violation.impact)}`}>
                {violation.impact}
              </span>
              <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{violation.id}</code>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{violation.help}</h3>
            <p className="text-sm text-gray-600">{violation.description}</p>
          </div>

          <a
            href={violation.helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View WCAG documentation"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        {/* Affected Elements Count */}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          <AlertCircle className="w-4 h-4 text-orange-600" />
          <span className="font-semibold">{violation.nodes.length} element{violation.nodes.length > 1 ? 's' : ''} affected</span>
        </div>
      </div>

      {/* Fix Suggestion */}
      {fixSuggestion && (
        <div className="p-5 bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 border-b border-green-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-lg">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-1">How to Fix</h4>
              <p className="text-sm text-gray-700">{fixSuggestion.explanation}</p>
            </div>
          </div>

          {/* WCAG Criteria Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {fixSuggestion.wcagCriteria.map((criteria, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 border border-green-200"
              >
                <Code className="w-3 h-3" />
                {criteria}
              </span>
            ))}
          </div>

          {/* Code Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Before */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-700 uppercase tracking-wide">❌ Before (Incorrect)</span>
                <motion.button
                  onClick={() => copyToClipboard(fixSuggestion.before, 'before')}
                  className="p-1.5 text-gray-600 hover:bg-white/80 rounded-lg transition-colors"
                  whileTap={{ scale: 0.95 }}
                  title="Copy code"
                >
                  {copiedCode === 'before' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
              <div className="relative group">
                <pre className="p-4 bg-red-900/10 border-2 border-red-200 rounded-lg overflow-x-auto">
                  <code className="text-xs text-gray-900 font-mono">
                    {fixSuggestion.before}
                  </code>
                </pre>
              </div>
            </div>

            {/* After */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-green-700 uppercase tracking-wide">✓ After (Correct)</span>
                <motion.button
                  onClick={() => copyToClipboard(fixSuggestion.after, 'after')}
                  className="p-1.5 text-gray-600 hover:bg-white/80 rounded-lg transition-colors"
                  whileTap={{ scale: 0.95 }}
                  title="Copy code"
                >
                  {copiedCode === 'after' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
              <div className="relative group">
                <pre className="p-4 bg-green-900/10 border-2 border-green-200 rounded-lg overflow-x-auto">
                  <code className="text-xs text-gray-900 font-mono">
                    {fixSuggestion.after}
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* Learn More Links */}
          {fixSuggestion.links.length > 0 && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">📚 Learn More</p>
              <div className="flex flex-wrap gap-2">
                {fixSuggestion.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 hover:bg-white border border-green-200 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {link.title}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Affected Elements (Collapsible) */}
      <div className="border-t border-gray-200">
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          whileTap={{ scale: 0.99 }}
        >
          <span className="text-sm font-bold text-gray-900">
            View Affected Elements ({violation.nodes.length})
          </span>
          {showDetails ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </motion.button>

        {showDetails && (
          <motion.div
            className="px-5 pb-5 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {violation.nodes.map((node, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="mb-2">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Selector</span>
                  <code className="block mt-1 text-xs text-blue-600 font-mono">
                    {node.target.join(' > ')}
                  </code>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">HTML</span>
                  <pre className="mt-1 p-2 bg-white rounded border border-gray-200 overflow-x-auto">
                    <code className="text-xs text-gray-900 font-mono">
                      {node.html}
                    </code>
                  </pre>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
