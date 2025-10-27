"use client";

type Risk = {
  standards: string[];
  fines: { usUSD: number; euEUR: { min: number; max: number }; note?: string };
};

export default function ComplianceRisk({ risk }: { risk: Risk }) {
  if (!risk) return null;
  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const eur = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  return (
    <div className="glass p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Compliance & Risk</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm text-gray-300 mb-2">Recognized frameworks</div>
          <ul className="list-disc list-inside text-gray-200 text-sm space-y-1">
            {risk.standards.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm text-gray-300 mb-2">Estimated exposure</div>
          <div className="grid grid-cols-2 gap-3 text-white">
            <div className="p-4 rounded-xl bg-white/10 border border-white/10">
              <div className="text-xs text-gray-300">U.S. (ADA Title III)</div>
              <div className="text-xl font-bold">{usd.format(risk.fines.usUSD)}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/10">
              <div className="text-xs text-gray-300">EU (EAA / EN 301 549)</div>
              <div className="text-xl font-bold">{eur.format(risk.fines.euEUR.min)}–{eur.format(risk.fines.euEUR.max)}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-300">Estimates only. Not legal advice.</p>
        </div>
      </div>
    </div>
  );
}

