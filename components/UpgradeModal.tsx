'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Check, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'scan_limit' | 'export' | 'feature';
  scansUsed?: number;
  scansLimit?: number;
}

export function UpgradeModal({ isOpen, onClose, reason, scansUsed, scansLimit }: UpgradeModalProps) {
  const modalContent = {
    scan_limit: {
      title: "You've Reached Your Scan Limit",
      subtitle: `You've used ${scansUsed ?? 1} out of ${scansLimit ?? 1} daily scans` +
        "\nFree users get 1 scan per day. Upgrade for more!",
      icon: TrendingUp,
      benefits: [
        '10 scans per day (70+ per week)',
        'Full violation details with remediation tips',
        'Export reports as PDF, CSV, and JSON',
        'Priority email support',
        'Historical tracking & analytics',
        'API access',
        'Cancel anytime, no commitment',
      ],
    },
    export: {
      title: 'Export Available with Pro',
      subtitle: 'Unlock professional reporting features',
      icon: Crown,
      benefits: [
        'Export as PDF, CSV, and JSON',
        '10 scans per day',
        'Priority support',
        'API access',
      ],
    },
    feature: {
      title: 'Unlock Pro Features',
      subtitle: 'Get the full accessibility testing experience',
      icon: Zap,
      benefits: [
        '10 scans per day',
        'Full violation details with remediation tips',
        'Export as PDF, CSV, and JSON',
        'Priority email support',
        'Historical tracking & analytics',
        'API access',
        'Cancel anytime, no commitment',
      ],
    },
  };

  const content = modalContent[reason];
  const Icon = content.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-2xl border border-gray-200"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {content.title}
            </h2>
            <p className="text-center text-gray-600 mb-6">{content.subtitle}</p>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              {content.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  $19
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-center text-sm text-gray-600 mt-1">Cancel anytime, no commitment</p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link
                href="/pricing"
                className="block w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl text-center"
              >
                Upgrade to Pro
              </Link>
              <button
                onClick={onClose}
                className="block w-full py-3 px-6 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 transition-colors text-center"
              >
                Maybe Later
              </button>
            </div>

            {/* Trust Badge */}
            <p className="text-center text-xs text-gray-500 mt-4">
              Join 1,000+ teams ensuring accessibility compliance
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
