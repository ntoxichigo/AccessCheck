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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-[2px] shadow-xl">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Compliance & Risk
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-semibold text-blue-300 mb-3">Recognized frameworks</div>
              <ul className="list-disc list-inside text-gray-200 text-sm space-y-2">
                {risk.standards.map((s) => (
                  <li key={s} className="text-gray-300">{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-purple-300 mb-3">Estimated exposure</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-400/30 backdrop-blur-sm">
                  <div className="text-xs font-medium text-orange-300 mb-1">U.S. (ADA Title III)</div>
                  <div className="text-xl font-bold text-white">{usd.format(risk.fines.usUSD)}</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-400/30 backdrop-blur-sm">
                  <div className="text-xs font-medium text-pink-300 mb-1">EU (EAA / EN 301 549)</div>
                  <div className="text-xl font-bold text-white">{eur.format(risk.fines.euEUR.min)}–{eur.format(risk.fines.euEUR.max)}</div>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400 italic">Estimates only. Not legal advice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

