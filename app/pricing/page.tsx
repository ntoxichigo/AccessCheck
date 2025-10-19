"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import NavBar from "../../components/NavBar";
import { LegalFooter } from "../../components/legal/LegalFooter";
import { useOptimizedAnimations } from "../../hooks/useOptimizedAnimations";
import { CheckCircle2 } from "lucide-react";

export default function PricingPage() {
  const { user } = useUser();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const [loadingTrial, setLoadingTrial] = useState(false);
  const [loadingPro, setLoadingPro] = useState(false);
  const [hadTrial, setHadTrial] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use optimized animation hook
  const { mounted, mousePos, particles, handleMouseMove } = useOptimizedAnimations({
    particleCount: 6,
    enableMouseTracking: true,
    throttleMs: 100
  });

  useEffect(() => {
    // Dynamically inject Stripe Pricing Table script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    // Check if user had trial
    const checkTrialStatus = async () => {
      if (user) {
        try {
          const response = await fetch('/api/user/subscription');
          if (response.ok) {
            const data = await response.json();
            // Check if they're currently on trial or had one
            const isOnTrial = data.subscription === 'trial';
            const trialEnds = data.trialEnds ? new Date(data.trialEnds) : null;
            const trialExpired = trialEnds && trialEnds < new Date();
            
            setHadTrial(isOnTrial || trialExpired);
          }
        } catch (error) {
          console.error('Failed to check trial status:', error);
        }
      }
      setLoading(false);
    };

    checkTrialStatus();

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [user]);

  const features = useMemo(() => [
    { icon: '�', title: '10 Scans per Day', desc: 'Run up to 10 accessibility scans every day with the Pro plan.' },
    { icon: '📊', title: 'Full Accessibility Reports', desc: 'Branded PDF reports for clients and stakeholders.' },
    { icon: '⚡', title: 'Priority Support', desc: 'Get expert help when you need it.' },
    { icon: '�', title: 'Historical Tracking', desc: 'Monitor compliance progress over time.' },
    { icon: '🔧', title: 'PDF Exports', desc: 'Export your results for sharing and compliance.' }
  ], []);

  const handleStartTrial = async () => {
    setLoadingTrial(true);
    try {
      const res = await fetch('/api/trial/start', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start trial');
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Start trial error', err);
      alert(err instanceof Error ? err.message : String(err));
      setLoadingTrial(false);
    }
  };

  const handleSubscribePro = async () => {
    setLoadingPro(true);
    try {
      const res = await fetch('/api/billing/create-checkout-session', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro' })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Subscribe error', err);
      alert(err instanceof Error ? err.message : String(err));
      setLoadingPro(false);
    }
  };

  return (
    <>
      <NavBar />
      <main className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900" onMouseMove={handleMouseMove}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`
          }}
        />
        {mounted && particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `float ${p.duration}s ease-in-out infinite ${p.delay}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  AC
                </div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AccessCheck
              </span>
            </Link>
            <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
              Back to Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 backdrop-blur-sm mb-6">
            <span className="text-xs font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent uppercase tracking-wide">
              Pricing Plans
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-800 max-w-2xl mx-auto mb-4">
            {hadTrial ? 'Choose your subscription plan' : 'Start with a 3-day free trial or go directly to Pro'}
          </p>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            {hadTrial ? 'Full Pro features • 10 scans/day • PDF exports • Priority support' : 'Both options give you full Pro features • 10 scans/day • PDF exports • Priority support'}
          </p>
        </motion.div>

        {/* Pricing Cards - Pro Trial + Enterprise */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Pro Plan with Trial */}
          <motion.div
            className="relative p-8 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl border-4 border-white/20"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="px-6 py-2 rounded-full bg-yellow-400 text-gray-900 text-sm font-bold shadow-lg">
                ⭐ MOST POPULAR
              </div>
            </div>
            
            <div className="mt-4 mb-6">
              <h3 className="text-3xl font-bold mb-3">Pro Plan</h3>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-black">$19</span>
                  <span className="text-xl text-white/90">/month</span>
                </div>
                {!hadTrial && <p className="text-white/80 text-sm">✨ 3-day free trial included</p>}
              </div>
              <p className="text-white/90 text-sm">
                {hadTrial ? 'Full access to all Pro features • $19/month • Cancel anytime' : 'Try free for 3 days, then $19/month • Cancel anytime'}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">10 scans per day</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>Full accessibility reports</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>PDF exports</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>API access</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>Historical tracking</span>
              </li>
            </ul>

            <button
              onClick={hadTrial ? handleSubscribePro : handleStartTrial}
              disabled={loadingTrial || loadingPro || loading}
              className="block w-full py-4 rounded-xl bg-white text-purple-600 font-bold text-lg text-center hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Loading...' : (loadingTrial || loadingPro) ? 'Redirecting...' : hadTrial ? '💳 Subscribe to Pro' : '🎉 Start Free Trial'}
            </button>
            
            {hadTrial && (
              <p className="mt-3 text-center text-sm text-white/80">
                ℹ️ You&apos;ve already used your free trial. Subscribing now for $19/month.
              </p>
            )}
          </motion.div>

          {/* Enterprise Option */}
          <motion.div
            className="relative p-8 rounded-3xl bg-white border-2 border-gray-300 shadow-xl"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Enterprise</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Custom</span>
              </div>
              <p className="text-gray-600 text-sm">Tailored to your needs</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-gray-800">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <span className="font-medium">Unlimited scans</span>
              </li>
              <li className="flex items-center gap-3 text-gray-800">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center gap-3 text-gray-800">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-center gap-3 text-gray-800">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-center gap-3 text-gray-800">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <span>SLA guarantees</span>
              </li>
              <li className="flex items-center gap-3 text-gray-800">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <span>Custom reporting</span>
              </li>
            </ul>

            <a
              href="/contact?topic=enterprise"
              className="block w-full py-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold text-lg text-center hover:from-gray-900 hover:to-black transition-all shadow-lg hover:shadow-xl"
            >
              � Contact Sales
            </a>
          </motion.div>
        </motion.div>

        {/* Trial Banner - Remove */}
        {/* <TrialBanner /> */}

        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 backdrop-blur-sm mb-6">
            <span className="text-xs font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent uppercase tracking-wide">
              Pricing Plans
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Professional Accessibility Platform
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-800 max-w-2xl mx-auto mb-8">
            Comprehensive accessibility audit platform powered by industry-leading open-source technology
          </p>

          {/* Billing Interval Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 p-2 bg-white rounded-full border border-gray-200 shadow-sm"
          >
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingInterval === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={`px-6 py-2 rounded-full font-medium transition-all relative ${
                billingInterval === 'annual'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                Save 20%
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="mb-16 bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-gray-200/50 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              What You Get with AccessCheck
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((item, i) => (
              <motion.div
                key={i}
                className="flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-blue-100/50 hover:border-blue-200/50 hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-800">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-800">
            * Powered by{" "}
            <a 
              href="https://github.com/dequelabs/axe-core" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              axe-core
            </a>
            {" "}open-source testing engine
          </p>
        </motion.div>

        {/* Stripe Pricing Table */}
        <motion.div 
          id="stripe-pricing-table" 
          className="my-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          dangerouslySetInnerHTML={{
            __html: `
              <stripe-pricing-table
                pricing-table-id="${process.env.NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID}"
                publishable-key="${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}"
              ></stripe-pricing-table>
            `
          }}
        />

        {/* No trial info - Pro plan is $19/month for 10 scans/day. */}
      </div>

      <LegalFooter />
    </main>
    </>
  );
}
