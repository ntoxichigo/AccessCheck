"use client";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function PricingPage() {
  const { isSignedIn } = useAuth();
  const [activating, setActivating] = useState(false);

  const tiers = [
    { name: 'Free', price: '$0', features: ['1 scan per account', 'Summary only'], cta: { href: '/scan', label: 'Continue free' } },
    { name: 'Pro', price: '$19/mo', features: ['Unlimited scans', 'Full reports', 'WCAG mapping'], cta: { href: isSignedIn ? '#activate-pro' : '/sign-in?redirect_url=/pricing', label: isSignedIn ? 'Activate Pro (Demo)' : 'Sign in to Upgrade' } },
    { name: 'Business', price: 'Contact', features: ['Team seats', 'SLA', 'Exports'], cta: { href: isSignedIn ? '/contact' : '/sign-in?redirect_url=/contact', label: 'Contact sales' } },
  ];

  async function activatePro() {
    try {
      setActivating(true);
      const res = await fetch('/api/billing/activate-pro', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        window.location.href = '/dashboard';
      } else {
        alert(data.error || 'Activation failed');
      }
    } finally {
      setActivating(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-bold mb-10">Pricing</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div key={t.name} className="rounded-2xl border p-6">
              <div className="text-sm text-gray-500">{t.name}</div>
              <div className="text-3xl font-bold mt-2">{t.price}</div>
              <ul className="mt-6 space-y-2 text-sm text-gray-700">
                {t.features.map((f) => (<li key={f}>• {f}</li>))}
              </ul>
              {t.name === 'Pro' && isSignedIn ? (
                <button onClick={activatePro} disabled={activating} className="mt-8 inline-block px-5 py-2 rounded-lg bg-blue-600 text-white font-medium">
                  {activating ? 'Activating…' : t.cta.label}
                </button>
              ) : (
                <a href={t.cta.href} className="mt-8 inline-block px-5 py-2 rounded-lg bg-blue-600 text-white font-medium">{t.cta.label}</a>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
