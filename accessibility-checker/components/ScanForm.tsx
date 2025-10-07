'use client';
import React, { useState, useEffect, useRef } from 'react';

interface ScanFormProps {
  onScanComplete: (results: any) => void;
  onLoadingChange?: (loading: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement | null> | null;
}

export default function ScanForm({ onScanComplete, onLoadingChange, inputRef }: ScanFormProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authPrompt, setAuthPrompt] = useState(false);
  const [visible, setVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (formRef.current) observer.observe(formRef.current);
    return () => observer.disconnect();
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.startsWith('http')) {
      setError('Please enter a valid URL including https://');
      return;
    }

    setLoading(true);
    onLoadingChange?.(true);
    setError('');

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (data.success) {
        onScanComplete(data);
      } else {
        if (data.needsAuth) {
          setError(data.message || 'Sign in to run your free scan.');
          setAuthPrompt(true);
        } else if (data.needsUpgrade) {
          setError(data.message || 'Free plan scan used. Upgrade to continue.');
        } else {
          setError(data.error || 'Scan failed.');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleScan}
      className={`relative w-full max-w-2xl mx-auto p-6 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-xl shadow-xl transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      aria-label="Accessibility Compliance Scanner"
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
      `}</style>

      <label htmlFor="website-url" className="block text-sm font-semibold text-gray-700 mb-2">
        Website URL
      </label>

      <div className="flex gap-3 items-stretch">
        <div className="relative flex-1">
          <input
            id="website-url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            disabled={loading}
            ref={inputRef as any}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              error ? 'border-red-400' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm outline-none text-gray-800 font-medium`}
            aria-invalid={!!error}
            aria-describedby={error ? 'scan-error' : undefined}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`relative px-6 py-3 rounded-xl font-bold text-white transition-all ${
            loading
              ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-lg hover:-translate-y-0.5'
          }`}
          style={{ backgroundSize: '200% auto', animation: loading ? 'shimmer 2s linear infinite' : '' }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin w-5 h-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Scanning...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Scan Now</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-3">
          <p
            id="scan-error"
            className="text-sm text-red-600 animate-[shake_0.4s_ease-in-out]"
            role="alert"
          >
            {error}
          </p>
          {authPrompt && (
            <div className="mt-2">
              <a
                href={`/sign-in?redirect_url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname + '#scan') : '/pricing'}`}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-500"
                aria-label="Sign in to run your free scan"
              >
                Sign in
              </a>
            </div>
          )}
        </div>
      )}

      {!error && !loading && (
        <p className="text-xs text-gray-500 mt-3">
          Your URL data is securely processed according to WCAG 2.1 and GDPR standards.
        </p>
      )}
    </form>
  );
}
