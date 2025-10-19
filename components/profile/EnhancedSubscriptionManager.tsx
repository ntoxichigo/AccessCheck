'use client';

/**
 * Enhanced Subscription Manager
 * Supports upgrade, downgrade, cancellation with prorations
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { useUser } from '@clerk/nextjs';
import { notify } from '@/lib/notifications';
import { analytics } from '@/lib/analytics';
import {
  CreditCard,
  Crown,
  Building2,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  priceId?: string;
  icon: typeof Crown;
  features: string[];
  popular?: boolean;
  cta: string;
}

interface SubscriptionData {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export function EnhancedSubscriptionManager() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Fetch real subscription data
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
          setSubscription({
            plan: data.subscription || 'free',
            status: data.status || 'active',
            currentPeriodEnd: data.currentPeriodEnd,
            cancelAtPeriodEnd: data.cancelAtPeriodEnd,
          });
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      }
    };

    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      icon: CreditCard,
      cta: 'Current Plan',
      features: [
        '5 scans per month',
        'Basic accessibility reports',
        'Email support',
  'WCAG 2.1 AA compliance checks',
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 19,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      icon: Crown,
      popular: true,
      cta: 'Upgrade to Pro',
      features: [
        'Unlimited scans',
        'Detailed reports with remediation tips',
        'Priority email & chat support',
        'API access',
        'PDF export',
        'Team collaboration (up to 5 users)',
        'Advanced analytics',
        'Custom branding',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 0,
      icon: Building2,
      cta: 'Contact Sales',
      features: [
        'Everything in Professional',
        'Unlimited team members',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantees (99.9% uptime)',
        'Custom reporting & dashboards',
        'SSO & advanced security',
        'Training & onboarding',
      ],
    },
  ];

  const currentPlan = plans.find((p) => p.id === subscription.plan);

  const handleUpgrade = async (planId: string) => {
    if (planId === 'enterprise') {
      window.location.href = '/contact?topic=enterprise';
      return;
    }

    if (!user) {
      notify.error('Please sign in to upgrade');
      return;
    }

    setLoading(true);
    setSelectedPlan(planId);

    try {
      const plan = plans.find((p) => p.id === planId);
      if (!plan?.priceId) {
        throw new Error('Invalid plan');
      }

      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      analytics.trackConversion({
        from: subscription.plan === 'enterprise' ? 'free' : subscription.plan,
        to: planId as 'free' | 'pro',
        plan: plan.name,
        revenue: plan.price,
      });

      window.location.href = url;
    } catch (error) {
      notify.error('Failed to upgrade', error instanceof Error ? error.message : undefined);
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const handleDowngrade = async (planId: string) => {
    if (!confirm('Are you sure you want to downgrade? This will take effect at the end of your billing period.')) {
      return;
    }

    setLoading(true);

    try {
      // Call API to schedule downgrade
      const response = await fetch('/api/billing/downgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error('Failed to downgrade');
      }

      notify.success('Downgrade scheduled', 'Your plan will change at the end of the billing period');
      setSubscription({ ...subscription, cancelAtPeriodEnd: true });
    } catch (error) {
      notify.error('Failed to downgrade', error instanceof Error ? error.message : undefined);
    } finally {
      setLoading(false);
    }
  };

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
        // Show error from API
        const message = result.error || result.details || 'Failed to cancel subscription';
        throw new Error(message);
      }

      notify.success('Subscription canceled', 'Your subscription will remain active until the end of the billing period');
      setSubscription({ ...subscription, cancelAtPeriodEnd: true, status: 'canceled' });
      setShowCancelModal(false);
      setCancelReason('');

      analytics.track('subscription_canceled', { reason: cancelReason });
    } catch (error) {
  notify.error('Failed to cancel subscription', error instanceof Error ? error.message : 'Unknown error');
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

  return (
    <div className="space-y-8">
      {/* Current Subscription Status */}
      {subscription.plan !== 'free' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border-2 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300 shadow-md"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {currentPlan?.icon && <currentPlan.icon className="h-6 w-6 text-blue-600" />}
                <h3 className="text-xl font-bold text-gray-900">
                  {subscription.plan === 'trial' ? 'Pro Plan (Trial Active)' : currentPlan?.name}
                </h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    subscription.cancelAtPeriodEnd 
                      ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                      : 'bg-green-100 text-green-700 border border-green-300'
                  }`}>
                    {subscription.cancelAtPeriodEnd ? '⚠️ Canceling' : '✅ Active'}
                  </span>
                </div>
                
                {subscription.currentPeriodEnd && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-medium">
                      {subscription.cancelAtPeriodEnd ? 'Ends on:' : subscription.plan === 'trial' ? 'Trial ends:' : 'Next payment:'}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
                
                {subscription.plan === 'trial' && !subscription.cancelAtPeriodEnd && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      💡 Your trial will automatically convert to Pro ($19/month) after the trial period. Cancel anytime before then.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {subscription.cancelAtPeriodEnd ? (
                <Button
                  onClick={handleReactivate}
                  disabled={loading}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reactivate'}
                </Button>
              ) : (
                <Button
                  onClick={() => setShowCancelModal(true)}
                  disabled={loading}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const isCurrent = plan.id === subscription.plan;
          const isUpgrade = plan.price > (currentPlan?.price || 0);
          const isDowngrade = plan.price < (currentPlan?.price || 0) && plan.id !== 'free';

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: isCurrent ? 1 : 1.03, y: isCurrent ? 0 : -4 }}
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                  isCurrent
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-blue-500 shadow-xl'
                    : plan.popular
                    ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 shadow-md hover:shadow-lg'
                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-300 hover:border-gray-400 hover:shadow-md'
                }`}
            >
              {plan.popular && !isCurrent && (
                <div className="absolute top-0 left-0 right-0 -mt-1 flex justify-center">
                  <div className="px-3 py-1 rounded-b-lg bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-semibold text-white shadow-md">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={plan.popular && !isCurrent ? 'mt-4' : ''}>
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${isCurrent ? 'text-white' : 'text-blue-600'}`} />
                  {isCurrent && (
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30">
                      ✓ Current Plan
                    </span>
                  )}
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-2 ${isCurrent ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
              
              <div className="mb-4">
                {plan.price === 0 && plan.id !== 'free' ? (
                  <div className="text-2xl font-bold text-white">Custom Pricing</div>
                ) : (
                  <div className="flex items-baseline">
                    <span className={`text-4xl font-bold ${isCurrent ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                      ${plan.price}
                    </span>
                    {plan.price > 0 && <span className={`ml-2 ${isCurrent ? 'text-gray-200' : 'text-gray-700'}`}>/month</span>}
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + idx * 0.03 }}
                    className={`flex items-start text-sm ${isCurrent ? 'text-white' : 'text-gray-700'}`}
                  >
                    <Check className={`h-4 w-4 mr-2 ${isCurrent ? 'text-white' : 'text-blue-600'} flex-shrink-0 mt-0.5`} />
                    <span className="font-medium">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Button
                onClick={() => {
                  if (isUpgrade) {
                    handleUpgrade(plan.id);
                  } else if (isDowngrade) {
                    handleDowngrade(plan.id);
                  }
                }}
                disabled={loading || isCurrent}
                className={`w-full ${
                  isCurrent
                    ? 'bg-white/10 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
                variant={isCurrent ? 'outline' : 'default'}
              >
                {loading && selectedPlan === plan.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isCurrent ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Current Plan
                  </>
                ) : isUpgrade ? (
                  <>
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : isDowngrade ? (
                  'Downgrade'
                ) : (
                  plan.cta
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-xl bg-gray-900 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-bold text-white">Cancel Subscription</h3>
              </div>

              <p className="text-gray-300 mb-4">
                We&apos;re sorry to see you go. Please tell us why you&apos;re canceling so we can improve:
              </p>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Your feedback helps us improve..."
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 mb-4"
                rows={4}
              />

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowCancelModal(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Keep Subscription
                </Button>
                <Button
                  onClick={handleCancel}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={loading || !cancelReason.trim()}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Confirm Cancel
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
