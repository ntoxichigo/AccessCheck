'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { useUser } from '@clerk/nextjs';
import { Crown, CreditCard, Building2, X, AlertTriangle, Check, Loader2 } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  current: boolean;
  icon: React.ReactNode;
}

export default function SubscriptionManager() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userPlan, setUserPlan] = useState<'free' | 'trial' | 'pro' | 'enterprise'>('free');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    // Fetch user's current plan
    const fetchUserPlan = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        if (response.ok) {
          const data = await response.json();
          setUserPlan(data.subscription || 'free');
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      }
    };

    if (user) {
      fetchUserPlan();
    }
  }, [user]);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0/month',
      icon: '🆓',
      features: [
        '1 scan per day',
        'Basic accessibility reports',
        'Email support'
      ],
      current: true
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$19/month',
      icon: '💎',
      features: [
        'Unlimited scans',
        'Detailed reports with remediation tips',
        'Priority support',
        'API access',
        'PDF exports',
        'Bulk scanning'
      ],
      current: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      icon: '🏢',
      features: [
        'Unlimited scans',
        'Everything in Professional',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantees',
        'Custom reporting'
      ],
      current: false
    }
  ];

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    setMessage('');

    try {
      // Here you would integrate with your payment provider (e.g., Stripe)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (planId === 'enterprise') {
        window.location.href = '/contact?topic=enterprise';
        return;
      }

      setMessage('Redirecting to payment...');
    } catch {
      setMessage('Failed to process upgrade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: plan.current ? 1 : 1.05, y: plan.current ? 0 : -8 }}
            className={`p-6 rounded-xl transition-all duration-300 ${
              plan.current
                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-blue-500 shadow-lg'
                : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-900'
            }`}
          >
            <div className="text-4xl mb-3">{plan.icon}</div>
            <h3 className={`text-xl font-bold mb-2 ${plan.current ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
            {plan.current ? (
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                {plan.price}
              </div>
            ) : (
              <div className="text-3xl font-bold text-gray-900 mb-4">{plan.price}</div>
            )}
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + idx * 0.05 }}
                  className={`flex items-center text-sm ${plan.current ? 'text-gray-800 font-medium' : 'text-gray-700'}`}
                >
                  <svg
                    className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </motion.li>
              ))}
            </ul>

            <motion.div
              whileHover={{ scale: plan.current ? 1 : 1.05 }}
              whileTap={{ scale: plan.current ? 1 : 0.95 }}
            >
              <Button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading || plan.current}
                className={`w-full ${plan.current ? 'bg-white/10 cursor-not-allowed text-white/70' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'}`}
                variant={plan.current ? 'outline' : 'default'}
              >
                {plan.current
                  ? '✅ Current Plan'
                  : plan.id === 'enterprise'
                  ? '📞 Contact Sales'
                  : '⚡ Upgrade'}
              </Button>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`p-3 rounded-lg text-center ${
              message.includes('Redirecting') 
                ? 'bg-blue-500/20 text-blue-200' 
                : 'bg-red-500/20 text-red-200'
            }`}
          >
            {message.includes('Redirecting') ? '⏳ ' : '❌ '}{message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}