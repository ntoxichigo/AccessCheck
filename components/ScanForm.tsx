'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScanAgreementCheckbox } from './legal/ScanAgreementCheckbox';
import { UpgradeModal } from './UpgradeModal';

interface ScanFormProps {
  onScanComplete: (results: Record<string, unknown>) => void;
  onLoadingChange?: (loading: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement | null> | null;
}

export default function ScanForm({ onScanComplete, onLoadingChange, inputRef }: ScanFormProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authPrompt, setAuthPrompt] = useState(false);
  const [upgradePrompt, setUpgradePrompt] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [focused, setFocused] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / rect.width,
      y: (e.clientY - rect.top - rect.height / 2) / rect.height
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    if (formRef.current) {
      observer.observe(formRef.current);
    }
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check agreement first
    if (!agreedToTerms) {
      setError('Please agree to the disclaimer before scanning');
      return;
    }
    
    // URL validation with better UX
    if (!url) {
      setError('Please enter a website URL to scan');
      return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('Please include https:// or http:// in your URL');
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
        // Pass the complete data structure including nested results
        onScanComplete({
          ...data.results,  // Spread the axe results
          id: data.id,      // Add scan ID
          risk: data.risk,  // Add risk assessment
          success: data.success
        });
        setUpgradePrompt(false);
        setAuthPrompt(false);
      } else {
        // Handle error message that could be a string or an object
        let errorMessage: string;
        
        if (typeof data.error === 'object' && data.error !== null) {
          // Extract message from error object
          errorMessage = data.error.message || JSON.stringify(data.error);
        } else if (typeof data.error === 'string') {
          errorMessage = data.error;
        } else if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else {
          errorMessage = 'Scan failed. Please try again.';
        }
        
        if (data.needsAuth) {
          setError(errorMessage || 'Sign in to run your free scan.');
          setAuthPrompt(true);
          setUpgradePrompt(false);
          setShowUpgradeModal(false);
        } else if (data.needsUpgrade) {
          setError(errorMessage || 'You\'ve used all your free scans. Upgrade to continue.');
          setUpgradePrompt(true);
          setAuthPrompt(false);
          setShowUpgradeModal(true);
        } else {
          setError(errorMessage);
          setUpgradePrompt(false);
          setAuthPrompt(false);
          setShowUpgradeModal(false);
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Connection error: ${errorMsg}. Please check your internet and try again.`);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-3xl mx-auto"
      style={{
        transform: `perspective(1000px) rotateY(${mousePos.x * 2}deg) rotateX(${-mousePos.y * 2}deg)`,
        transition: 'transform 0.3s ease-out'
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5),
                        0 0 40px rgba(139, 92, 246, 0.3);
          }
          50% { 
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.7),
                        0 0 60px rgba(139, 92, 246, 0.5);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .gradient-animated {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .scan-button-glow {
          position: relative;
          overflow: hidden;
        }
        
        .scan-button-glow::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
          background-size: 400% 400%;
          animation: gradientShift 3s ease infinite;
          border-radius: 12px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        
        .scan-button-glow:hover::before {
          opacity: 1;
        }
        
        .input-glow {
          transition: all 0.3s ease;
        }
        
        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1),
                      0 0 20px rgba(59, 130, 246, 0.2),
                      0 10px 40px -10px rgba(59, 130, 246, 0.3);
        }
      `}</style>

      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 60%)
            `,
            filter: 'blur(40px)',
            transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`
          }}
        />
      </div>

      <form
        ref={formRef}
        onSubmit={handleScan}
        className={`relative p-8 rounded-3xl border border-gray-200/50 bg-white/80 backdrop-blur-2xl shadow-2xl transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } ${focused ? 'scale-[1.02]' : ''}`}
        style={{
          animation: visible ? 'slideUp 0.6s ease-out' : 'none',
          boxShadow: focused 
            ? '0 20px 60px -15px rgba(59, 130, 246, 0.3), 0 10px 40px -20px rgba(139, 92, 246, 0.4)'
            : '0 20px 40px -15px rgba(0, 0, 0, 0.15)'
        }}
        aria-label="Accessibility Compliance Scanner"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent gradient-animated mb-2">
            Test Your Website Accessibility
          </h2>
          <p className="text-sm text-gray-600">
            Get instant WCAG 2.1 compliance report in 60 seconds
          </p>
        </div>

        {/* Progress indicators */}
        {loading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-3xl overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              style={{
                width: '40%',
                animation: 'shimmer 1.5s ease-in-out infinite'
              }}
            />
          </div>
        )}

        <label 
          htmlFor="website-url" 
          className="block text-sm font-semibold text-gray-700 mb-3"
        >
          Website URL
        </label>

        <div className="space-y-4">
          <div className="flex gap-3 items-stretch">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg 
                  className={`w-5 h-5 transition-colors ${
                    focused ? 'text-blue-500' : 'text-gray-400'
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              
              <input
                id="website-url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required
                disabled={loading}
                ref={inputRef as React.Ref<HTMLInputElement>}
                autoComplete="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                inputMode="url"
                className={`input-glow w-full pl-12 pr-4 py-4 rounded-xl border-2 ${
                  error 
                    ? 'border-red-400 bg-red-50/50' 
                    : focused 
                      ? 'border-blue-400 bg-white' 
                      : 'border-gray-200 bg-white/70'
                } backdrop-blur-sm outline-none text-gray-800 font-medium transition-all duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-invalid={!!error}
                aria-describedby={error ? 'scan-error' : undefined}
              />
              
              {/* Floating particles when focused */}
              {focused && !loading && (
                <div className="absolute -inset-2 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full"
                      style={{
                        top: `${20 + i * 30}%`,
                        left: `${10 + i * 35}%`,
                        animation: `float ${2 + i}s ease-in-out infinite ${i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className={`scan-button-glow relative px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 ${
                loading || !agreedToTerms
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 gradient-animated'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <span>Scan Now</span>
                    <svg
                      className="w-5 h-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Legal Agreement Checkbox */}
          <ScanAgreementCheckbox 
            onAgreementChange={setAgreedToTerms}
            required={true}
          />

          {/* Error messages with enhanced styling */}
          {error && (
            <div 
              className="relative overflow-hidden rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-4"
              style={{ animation: 'shake 0.4s ease-in-out' }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p
                    id="scan-error"
                    className="text-sm text-red-700 font-medium"
                    role="alert"
                  >
                    {error}
                  </p>
                  
                  {/* Action buttons */}
                  <div className="flex gap-3 mt-3">
                    {authPrompt && (
                      <a
                        href={`/sign-in?redirect_url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname + '#scan') : '/pricing'}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all hover:-translate-y-0.5"
                        aria-label="Sign in to run your free scan"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Sign In to Continue
                      </a>
                    )}
                    {upgradePrompt && (
                      <a
                        href="/pricing"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all hover:-translate-y-0.5"
                        aria-label="Upgrade your account"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        Upgrade for 10 Scans/Day
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success state - remove if not needed */}
          {!error && !loading && (
            <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                <p className="text-xs text-gray-600 font-medium">
                  Ready to scan • WCAG 2.1 AA compliant
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure scan</span>
              </div>
            </div>
          )}
        </div>

        {/* Features badges */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-200/50">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>60s scan</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>50+ checks</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>PDF reports</span>
          </div>
        </div>
      </form>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="scan_limit"
      />
    </div>
  );
}