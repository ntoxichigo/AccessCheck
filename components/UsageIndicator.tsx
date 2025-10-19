'use client';

import { motion } from 'framer-motion';
import { BarChart3, AlertCircle, Crown } from 'lucide-react';
import Link from 'next/link';

interface UsageIndicatorProps {
  scansUsed: number;
  scansLimit: number;
  plan: 'free' | 'trial' | 'pro' | 'enterprise';
  period: 'total' | 'daily';
}

export function UsageIndicator({ scansUsed, scansLimit, plan, period }: UsageIndicatorProps) {
  const percentage = (scansUsed / scansLimit) * 100;
  const remaining = scansLimit - scansUsed;
  const isNearLimit = percentage >= 80;
  const isAtLimit = scansUsed >= scansLimit;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border backdrop-blur-sm ${
        isAtLimit
          ? 'bg-red-50/80 border-red-200'
          : isNearLimit
          ? 'bg-yellow-50/80 border-yellow-200'
          : 'bg-white/80 border-gray-200/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3
            className={`h-5 w-5 ${
              isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-blue-600'
            }`}
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              Scan Usage
              {period === 'daily' && (plan === 'pro' || plan === 'trial') && ' (Today)'}
            </h3>
            <p className="text-xs text-gray-600">
              {plan === 'free' ? 'Free Plan' : plan === 'trial' ? 'Trial (Pro Features)' : plan === 'pro' ? 'Pro Plan' : 'Enterprise'}
            </p>
          </div>
        </div>
        {isNearLimit && !isAtLimit && (
          <AlertCircle className="h-5 w-5 text-yellow-600" />
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isAtLimit
              ? 'bg-gradient-to-r from-red-600 to-red-500'
              : isNearLimit
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-500'
              : 'bg-gradient-to-r from-blue-600 to-purple-600'
          }`}
        />
      </div>

      {/* Usage Text */}
      <div className="flex items-center justify-between text-sm">
        <span className={`font-semibold ${isAtLimit ? 'text-red-700' : 'text-gray-700'}`}>
          {scansUsed} / {scansLimit} scans used {period === 'daily' ? '(today)' : ''}
        </span>
        {remaining > 0 && !isAtLimit && (
          <span className="text-gray-600">
            {remaining} remaining {period === 'daily' ? 'today' : ''}
          </span>
        )}
      </div>

      {/* Warning Messages */}
      {isAtLimit && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-red-200"
        >
          <p className="text-sm text-red-700 font-medium mb-2">
            {plan === 'free'
              ? "You've used your daily scan! Come back tomorrow for another free scan."
              : "You've used all scans for today!"}
          </p>
          {plan === 'free' && (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md"
            >
              <Crown className="h-4 w-4" />
              Upgrade to Pro (10 scans/day)
            </Link>
          )}
          {(plan === 'pro' || plan === 'trial') && (
            <p className="text-xs text-gray-600">Your limit resets tomorrow at midnight.</p>
          )}
        </motion.div>
      )}

      {/* Near Limit Warning */}
      {isNearLimit && !isAtLimit && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-yellow-200"
        >
          <p className="text-sm text-yellow-700 font-medium">
            Only {remaining} scan{remaining !== 1 ? 's' : ''} remaining!
          </p>
          {plan === 'free' && (
            <Link
              href="/pricing"
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline mt-1 inline-block"
            >
              Upgrade for unlimited scans
            </Link>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
