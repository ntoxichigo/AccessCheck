"use client";
import PageLayout from "../../components/PageLayout";
import { motion } from "framer-motion";
import { useEffect } from "react";

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
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Choose the plan that fits your needs. Upgrade or downgrade anytime.
        </p>
      </motion.div>

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
