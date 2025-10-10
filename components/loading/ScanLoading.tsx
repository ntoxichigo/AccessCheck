"use client";

export default function ScanLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-sm text-gray-200">Running accessibility checks… this takes ~20–60s</span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[0,1,2].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/10">
            <div className="h-5 w-24 bg-white/20 rounded animate-pulse" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

