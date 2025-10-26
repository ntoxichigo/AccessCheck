'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { useUser } from '@clerk/nextjs';
import { notify } from '@/lib/notifications';
import {
  Crown,
  Loader2,
  Calendar,
  CreditCard,
  AlertCircle,
  Receipt,
  Download,
  ExternalLink,
  X,
} from 'lucide-react';

interface SubscriptionData {
  plan: 'free' | 'trial' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd?: string;
  trialEnds?: string;
  cancelAtPeriodEnd?: boolean;
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  invoicePdf?: string;
  hostedInvoiceUrl?: string;
  description: string;
}

export function SimpleSubscriptionManager() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  const [subscription, setSubscription] = useState<SubscriptionData>({
    plan: 'free',
    status: 'active',
  });

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Subscription data received:', data);
          setSubscription({
            plan: data.subscription || 'free',
            status: data.status || 'active',
            currentPeriodEnd: data.currentPeriodEnd,
            trialEnds: data.trialEnds,
            cancelAtPeriodEnd: data.cancelAtPeriodEnd,
          });
        } else {
          console.error('Failed to fetch subscription:', await response.text());
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      }
    };

    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      notify.warning('Please tell us why you\'re canceling');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/billing/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Show the custom message from the API if available
        const displayMessage = result.message || result.error || result.details || 'Failed to cancel subscription';
        throw new Error(displayMessage);
      }

      notify.success('Subscription canceled', 'Your subscription will remain active until the end of the billing period');
      setSubscription({ ...subscription, cancelAtPeriodEnd: true, status: 'canceled' });
      setShowCancelModal(false);
      setCancelReason('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      notify.error('Cannot cancel', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/billing/reactivate', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reactivate subscription');
      }

      notify.success('Subscription reactivated', 'Your subscription will continue automatically');
      setSubscription({ ...subscription, cancelAtPeriodEnd: false, status: 'active' });
    } catch (error) {
      notify.error('Failed to reactivate', error instanceof Error ? error.message : undefined);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const response = await fetch('/api/billing/invoices');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch invoices:', errorData);
        notify.error('Failed to load invoices', errorData.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      notify.error('Failed to load invoices', error instanceof Error ? error.message : 'Network error');
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handleShowInvoices = () => {
    setShowInvoices(true);
    if (invoices.length === 0) {
      fetchInvoices();
    }
  };

  const handleManageBilling = async () => {
    try {
      setLoading(true);
      window.location.href = '/api/billing/portal';
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      notify.error('Failed to open billing portal');
      setLoading(false);
    }
  };

  const getPlanName = () => {
    switch (subscription.plan) {
      case 'trial': return 'Pro Plan (Trial)';
      case 'pro': return 'Pro Plan';
      case 'enterprise': return 'Enterprise Plan';
      default: return 'Free Plan';
    }
  };

  const getPlanPrice = () => {
    switch (subscription.plan) {
      case 'pro': return '$19/month';
      case 'enterprise': return 'Custom';
      case 'trial': return 'Free Trial';
      default: return 'Free';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl border-2 shadow-lg ${
          subscription.plan === 'free' 
            ? 'bg-white border-gray-300'
            : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300'
        }`}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              {subscription.plan !== 'free' && <Crown className="h-7 w-7 text-blue-600" />}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {getPlanName()}
                </h3>
                <p className="text-lg font-semibold text-gray-700 mt-1">
                  {getPlanPrice()}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  subscription.cancelAtPeriodEnd 
                    ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                    : subscription.plan === 'free'
                    ? 'bg-gray-100 text-gray-700 border border-gray-300'
                    : 'bg-green-100 text-green-700 border border-green-300'
                }`}>
                  {subscription.cancelAtPeriodEnd ? '⚠️ Canceling' : subscription.plan === 'free' ? 'Free' : '✅ Active'}
                </span>
              </div>
              
              {/* Trial End / Next Payment / Subscription End */}
              {(subscription.trialEnds || subscription.currentPeriodEnd) && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-600">
                    {subscription.cancelAtPeriodEnd 
                      ? 'Access ends:' 
                      : subscription.plan === 'trial' 
                      ? 'Trial ends:' 
                      : 'Next billing:'}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {(() => {
                      const dateStr = subscription.plan === 'trial' && subscription.trialEnds 
                        ? subscription.trialEnds 
                        : subscription.currentPeriodEnd;
                      
                      console.log('📅 Date to display:', dateStr, 'Plan:', subscription.plan);
                      
                      if (!dateStr) return 'N/A';
                      
                      return new Date(dateStr).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      });
                    })()}
                  </span>
                </div>
              )}
              
              {/* Trial Notice */}
              {subscription.plan === 'trial' && !subscription.cancelAtPeriodEnd && (
                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Your trial will convert to Pro automatically</p>
                    <p>You&apos;ll be charged $19/month after your trial ends. Cancel anytime before then to avoid charges.</p>
                  </div>
                </div>
              )}
              
              {/* Canceled Pro/Enterprise Notice */}
              {subscription.plan !== 'free' && subscription.plan !== 'trial' && subscription.cancelAtPeriodEnd && (
                <div className="mt-3 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-900">
                    <p className="font-semibold mb-1">Subscription Canceled</p>
                    <p>You&apos;ll keep {subscription.plan === 'pro' ? 'Pro' : 'Enterprise'} access until {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'the end of your billing period'}. After that, you&apos;ll be downgraded to Free.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          {subscription.plan !== 'free' && (
            <div className="flex gap-2">
              {subscription.cancelAtPeriodEnd ? (
                <Button
                  onClick={handleReactivate}
                  disabled={loading}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reactivate Subscription'}
                </Button>
              ) : (
                <Button
                  onClick={() => setShowCancelModal(true)}
                  disabled={loading}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Upgrade CTA for Free Users */}
      {subscription.plan === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h4 className="text-xl font-bold mb-2">Upgrade to Pro</h4>
              <p className="text-blue-100 mb-3">Get unlimited scans, PDF exports, and priority support</p>
              <p className="text-2xl font-bold">$19/month • 3-day free trial</p>
            </div>
            <Button
              onClick={() => window.location.href = '/pricing'}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold"
            >
              Start Free Trial
            </Button>
          </div>
        </motion.div>
      )}

      {/* Manage Payment Method & Invoices */}
      {subscription.plan !== 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-white border border-gray-300 shadow-md"
        >
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="h-6 w-6 text-gray-700" />
            <h4 className="text-lg font-bold text-gray-900">Billing & Invoices</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Manage your payment method and view billing history
          </p>
          <div className="flex gap-3">
            <Button
              onClick={handleManageBilling}
              variant="outline"
              className="font-semibold"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Manage Billing'}
            </Button>
            <Button
              onClick={handleShowInvoices}
              variant="outline"
              className="font-semibold flex items-center gap-2"
            >
              <Receipt className="h-4 w-4" />
              View Invoices
            </Button>
          </div>
        </motion.div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Subscription</h3>
            <p className="text-gray-700 mb-4">
              We&apos;re sorry to see you go. Please let us know why you&apos;re canceling:
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Your feedback helps us improve..."
            />
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowCancelModal(false)}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Keep Subscription
              </Button>
              <Button
                onClick={handleCancel}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Cancel'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Invoices Modal */}
      <AnimatePresence>
        {showInvoices && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Receipt className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Billing History</h3>
                </div>
                <button
                  onClick={() => setShowInvoices(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {loadingInvoices ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : invoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Receipt className="h-12 w-12 mb-3 opacity-30" />
                  <p>No invoices found</p>
                </div>
              ) : (
                <div className="overflow-y-auto flex-1">
                  <div className="space-y-3">
                    {invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">
                                {invoice.currency} ${invoice.amount.toFixed(2)}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                invoice.status === 'paid' 
                                  ? 'bg-green-100 text-green-700' 
                                  : invoice.status === 'open'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {invoice.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{invoice.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {new Date(invoice.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {invoice.invoicePdf && (
                              <a
                                href={invoice.invoicePdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Download PDF"
                              >
                                <Download className="h-4 w-4 text-blue-600" />
                              </a>
                            )}
                            {invoice.hostedInvoiceUrl && (
                              <a
                                href={invoice.hostedInvoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Invoice"
                              >
                                <ExternalLink className="h-4 w-4 text-blue-600" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
