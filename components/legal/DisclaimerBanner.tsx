'use client';

import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DisclaimerBannerProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function DisclaimerBanner({ variant = 'full', className = '' }: DisclaimerBannerProps) {
  if (variant === 'compact') {
    return (
      <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-3 ${className}`}>
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This tool provides automated testing only. Not legal advice. 
            Manual review required. No compliance guarantees. Use at your own risk.
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 shadow-lg ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="bg-yellow-400 rounded-full p-2 flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-yellow-900" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-yellow-900 mb-3">
            ⚠️ IMPORTANT DISCLAIMER
          </h3>
          <div className="text-yellow-900 space-y-2 text-sm leading-relaxed">
            <p className="font-semibold">
              This tool provides automated accessibility testing using axe-core technology.
            </p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>This is <strong>NOT legal advice</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>This is <strong>NOT a guarantee of compliance</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>This is <strong>NOT a certification service</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>Automated tools <strong>cannot detect all accessibility issues</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span><strong>Manual review by qualified professionals is REQUIRED</strong></span>
              </li>
            </ul>
            <p className="font-bold text-yellow-950 mt-4 pt-3 border-t border-yellow-300">
              You are solely responsible for your own legal compliance.
            </p>
            <p className="text-yellow-800 italic">
              Use at your own risk. We provide NO warranties of any kind.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
