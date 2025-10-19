'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, CheckCircle2, Loader2 } from 'lucide-react';

export function TrialBanner() {
  const [trialStatus, setTrialStatus] = useState<{
    hadTrial: boolean;
    isTrialActive: boolean;
    daysRemaining: number;
    trialEnds?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetchTrialStatus();
  }, []);

  const fetchTrialStatus = async () => {
    try {
      const response = await fetch('/api/trial/status');
      if (response.ok) {
        const data = await response.json();
        setTrialStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch trial status:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTrial = async () => {
    setStarting(true);
    try {
      const response = await fetch('/api/trial/start', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || 'Failed to start trial');
        setStarting(false);
      }
    } catch (error) {
      console.error('Failed to start trial:', error);
      alert('Failed to start trial. Please try again.');
      setStarting(false);
    }
  };

  if (loading) {
    return null;
  }

  // Show trial CTA if user hasn't had a trial
  if (!trialStatus?.hadTrial && !trialStatus?.isTrialActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-2xl relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
        </div>

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">🎉 Start Your Free 3-Day Pro Trial</h3>
              <p className="text-white/90 text-sm">
                Full Pro features • Then $19/month • Enter payment info required • Cancel anytime
              </p>
            </div>
          </div>
          <button
            onClick={startTrial}
            disabled={starting}
            className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {starting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Start Free Trial
              </>
            )}
          </button>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-shimmer {
            animation: shimmer 3s infinite;
          }
        `}</style>
      </motion.div>
    );
  }

  // Show trial active status
  if (trialStatus?.isTrialActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Pro Trial Active</h3>
              <p className="text-white/90 text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? 's' : ''}{' '}
                remaining
                {trialStatus.trialEnds && (
                  <span className="text-xs">
                    (until {new Date(trialStatus.trialEnds).toLocaleDateString()})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
