"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeCheckout({ plan, amount, onSuccess }: { plan: string; amount: number; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }), // Email is fetched server-side from authenticated user
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error || "Failed to create checkout session");

      // If server returned a hosted checkout URL (newer Stripe sessions), redirect there first
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (!data.sessionId) throw new Error("No sessionId returned by billing API");

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      // @ts-expect-error - redirectToCheckout types may vary
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (stripeError) setError(stripeError.message || 'Unknown error');
      else onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing…" : `Subscribe to ${plan.charAt(0).toUpperCase() + plan.slice(1)} - $${amount / 100}/mo`}
      </button>
      {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
    </div>
  );
}
