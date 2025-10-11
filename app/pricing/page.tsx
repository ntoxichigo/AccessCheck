"use client";
import PageLayout from "../../components/PageLayout";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { DisclaimerBanner } from "../../components/legal/DisclaimerBanner";

export default function PricingPage() {
  useEffect(() => {
    // Dynamically inject Stripe Pricing Table script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <PageLayout theme="dark" containerSize="wide">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 mb-6">
          Professional Accessibility Platform
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Comprehensive accessibility audit platform powered by industry-leading open-source technology
        </p>
      </motion.div>

      {/* Value Proposition */}
      <motion.div
        className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">What You Get with AccessCheck</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🚀', title: 'Unlimited Scans', desc: 'Scan as many sites as you need, whenever you need' },
            { icon: '📊', title: 'Professional Reports', desc: 'Branded PDF reports for clients and stakeholders' },
            { icon: '📈', title: 'Historical Tracking', desc: 'Monitor compliance progress over time' },
            { icon: '👥', title: 'Team Collaboration', desc: 'Work together with your team on remediation' },
            { icon: '⚡', title: 'Priority Support', desc: 'Get expert help when you need it' },
            { icon: '🔧', title: 'Advanced Features', desc: 'API access, webhooks, and custom integrations' }
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-6 text-sm text-gray-400">
          * Powered by <a href="https://github.com/dequelabs/axe-core" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">axe-core</a> open-source testing engine
        </p>
      </motion.div>

      {/* Legal Disclaimer */}
      <div className="mb-8">
        <DisclaimerBanner variant="compact" />
      </div>

      {/* Stripe Pricing Table Embed */}
      <motion.div 
        id="stripe-pricing-table" 
        className="my-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        dangerouslySetInnerHTML={{
          __html: `
            <stripe-pricing-table
              pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID}
              publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
            ></stripe-pricing-table>
          `
        }}
      />

      <motion.div 
        className="mt-16 text-center text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p>All plans include a 14-day free trial. No credit card required.</p>
        <p className="mt-2">Cancel anytime with one click.</p>
      </motion.div>
    </PageLayout>
  );
}
