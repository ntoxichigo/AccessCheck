'use client';

import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import { LegalFooter } from '../components/legal/LegalFooter';
import { ScanSearch, FileText, Zap, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';


// Optimized intersection observer hook
const useInView = (options: IntersectionObserverInit = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView] as const;
};

// Animated counter component
const AnimatedCounter = ({ end, duration = 2000, prefix = '', suffix = '' }: { end: string; duration?: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const endValue = parseFloat(end.replace(/[^\d.]/g, ''));
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(endValue * easeOutQuart);
      
      setCount(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default function Home() {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);


  // Parallax mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / rect.width,
      y: (e.clientY - rect.top - rect.height / 2) / rect.height
    });
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
      opacity: 0.1 + Math.random() * 0.3
    }));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <NavBar />
      <main className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
            `,
            transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`
          }}
        />
        
        {/* Animated particles */}
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
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        [data-animate] {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        [data-animate].in-view {
          opacity: 1;
          transform: translateY(0);
        }
        
        [data-animate="scale"] {
          transform: scale(0.95);
        }
        
        [data-animate="scale"].in-view {
          transform: scale(1);
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
        }
        
        .gradient-text {
          background-size: 200% auto;
          animation: gradientShift 3s ease infinite;
        }
        
        .shimmer-bg {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* HERO SECTION */}
      <section 
        id="home" 
        className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden"
        ref={heroRef}
        onMouseMove={handleMouseMove}
      >

        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-8">
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 backdrop-blur-sm"
                data-animate
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" 
                     style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                <span className="text-xs font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent uppercase tracking-wide">
                  WCAG 2.1 AA Certified
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight" data-animate>
                  Make Accessibility
                  <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent gradient-text">
                    Simple & Fast
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed max-w-xl" data-animate>
                  Scan your website in{' '}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    60 seconds
                  </span>
                  . Get actionable WCAG compliance reports with prioritized fixes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full" data-animate>
                <Link
                  href={isSignedIn ? "/dashboard#scan" : "/scan#scan"}
                  className="group relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg hover:shadow-2xl transition-all hover-lift"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Try Free Scan
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                
                <Link
                  href="/pricing"
                  className="px-8 py-4 rounded-xl border-2 border-gray-300 font-bold text-gray-800 hover:border-purple-500 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all hover-lift"
                >
                  View Pricing
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-200" data-animate>
                {[
                  { num: '10000', label: 'Sites Scanned', prefix: '', suffix: '+' },
                  { num: '500000', label: 'Issues Fixed', prefix: '', suffix: '+' },
                  { num: '99.2', label: 'Accuracy', prefix: '', suffix: '%' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      <AnimatedCounter 
                        end={stat.num} 
                        prefix={stat.prefix} 
                        suffix={stat.suffix}
                        duration={2000 + i * 500}
                      />
                    </div>
                    <div className="text-sm text-gray-800 font-medium mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Dashboard Preview */}
            <div className="relative w-full" style={{ transform: `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 5}deg)` }}>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-4 sm:p-8 hover-lift" data-animate="scale">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />
                
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg blur opacity-50" />
                        <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Scan Complete</div>
                        <div className="text-sm text-gray-700">yoursite.com</div>
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                      <span className="font-bold text-green-700">94% Score</span>
                    </div>
                  </div>

                  {[
                    { severity: 'Critical', count: 3, color: 'from-red-500 to-rose-500', bg: 'from-red-50 to-rose-50' },
                    { severity: 'Warning', count: 12, color: 'from-yellow-500 to-amber-500', bg: 'from-yellow-50 to-amber-50' },
                    { severity: 'Info', count: 8, color: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50' }
                  ].map((issue, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-4 rounded-lg bg-gradient-to-r ${issue.bg} border border-gray-200/50 hover:shadow-md transition-all`}
                      data-animate
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${issue.color}`} />
                        <span className="font-semibold text-gray-700">{issue.severity}</span>
                      </div>
                      <span className="text-2xl font-black text-gray-900">
                        <AnimatedCounter end={issue.count.toString()} duration={1500} />
                      </span>
                    </div>
                  ))}

                  <Link
                    href={isSignedIn ? "/pricing" : "/sign-in"}
                    className="relative overflow-hidden w-full inline-block text-center py-3 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold hover:shadow-xl transition-all group"
                  >
                    <span className="relative z-10">View Full Report</span>
                    <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </div>

              <div 
                className="absolute -top-4 -right-4 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-xl"
                style={{ animation: 'float 4s ease-in-out infinite' }}
              >
                ✓ SOC 2 Certified
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-xs font-bold uppercase mb-4" data-animate>
              <span className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Complete Solution
              </span>
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4" data-animate>
              Everything You Need For{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent gradient-text">
                WCAG Compliance
              </span>
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto" data-animate>
              From initial scan to full remediation, our platform guides you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📋',
                title: 'Automated Scanning',
                desc: 'Test 50+ WCAG criteria in seconds — color contrast, keyboard navigation, screen readers, and more.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: '⚡',
                title: 'Instant Reports',
                desc: 'Get detailed, actionable reports with exact locations, severity levels, and ready-to-fix solutions.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: '🛡️',
                title: 'Legal Protection',
                desc: 'Reduce ADA lawsuit risk with documented compliance and continuous improvement tracking.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: '💻',
                title: 'Code Snippets & Fixes',
                desc: 'Copy-paste solutions for the most common accessibility issues straight into your codebase.',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                icon: '🔍',
                title: 'Continuous Monitoring',
                desc: 'Schedule rescans, track regressions, and get alerted the moment accessibility breaks.',
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                icon: '📄',
                title: 'Audit-Ready PDFs',
                desc: 'Export branded, executive-ready PDF reports for stakeholders, clients, and compliance officers.',
                gradient: 'from-pink-500 to-rose-500'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-2xl transition-all hover-lift"
                data-animate
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="text-4xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-gray-800 leading-relaxed">{feature.desc}</p>
                  <div className={`mt-6 h-1 w-0 bg-gradient-to-r ${feature.gradient} group-hover:w-full transition-all duration-700 rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold uppercase mb-4" data-animate>
              Simple Pricing
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4" data-animate>
              Choose Your{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent gradient-text">
                Perfect Plan
              </span>
            </h2>
            <p className="text-xl text-blue-100" data-animate>Start free, scale as you grow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: ['1 scan/day', 'Basic reports', 'Community support'],
                cta: 'Start Free',
                popular: false
              },
              {
                name: 'Pro',
                price: '$19',
                period: 'per month',
                features: ['10 scans/day', 'Full accessibility reports', 'Priority support', 'PDF exports'],
                cta: 'Upgrade Now',
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                features: ['Everything in Professional', 'Custom integrations', 'Dedicated account manager', 'SLA guarantees', 'Custom reporting'],
                cta: 'Contact Sales',
                popular: false
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative group ${plan.popular ? 'md:scale-110 z-10' : ''}`}
                data-animate="scale"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`relative overflow-hidden rounded-2xl p-8 h-full transition-all duration-500 ${
                  plan.popular
                    ? 'bg-white/20 backdrop-blur-xl border-2 border-white/40 hover:shadow-2xl hover:shadow-white/20'
                    : 'bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15'
                } hover-lift`}>
                  
                  {plan.popular && (
                    <>
                      <div className="absolute inset-0 shimmer-bg opacity-30" />
                      <div className="absolute top-0 left-0 right-0 -mt-1 flex justify-center">
                        <div className="px-4 py-1.5 rounded-b-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold shadow-lg whitespace-nowrap">
                          ⭐ MOST POPULAR
                        </div>
                      </div>
                    </>
                  )}

                  <div className="relative">
                    {plan.popular && <div className="h-4" />} {/* Spacer for badge */}
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-5xl font-black">{plan.price}</span>
                      <span className="text-sm text-blue-200 ml-1">/{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-100">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.name === 'Free' ? (
                      <Link
                        href="/scan"
                        className={`w-full block py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-center`}
                      >
                        {plan.cta}
                      </Link>
                    ) : plan.name === 'Pro' ? (
                      <Link
                        href={isSignedIn ? "/pricing" : "/sign-up"}
                        className={`w-full block py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white hover:shadow-xl text-center`}
                      >
                        {plan.cta}
                      </Link>
                    ) : (
                      <a
                        href="mailto:sales@yourdomain.com"
                        className={`w-full block py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-center`}
                      >
                        {plan.cta}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED TECHNOLOGY */}
      <section className="py-12 bg-gradient-to-r from-gray-50 via-blue-50/20 to-purple-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider mb-2">
              Powered By Industry-Leading Technology
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            {/* axe-core */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative px-6 py-3 bg-white rounded-lg border-2 border-gray-200 group-hover:border-blue-300 transition-colors">
                  <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">axe</div>
                </div>
              </div>
              <p className="text-xs text-gray-600 font-semibold">Industry Standard</p>
            </div>
            
            {/* Stripe */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative px-6 py-3 bg-white rounded-lg border-2 border-gray-200 group-hover:border-purple-300 transition-colors">
                  <svg className="h-7" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z" fill="url(#stripeGradient)"/>
                    <defs>
                      <linearGradient id="stripeGradient" x1="0" y1="0" x2="60" y2="25" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#8B5CF6"/>
                        <stop offset="1" stopColor="#EC4899"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-600 font-semibold">Secure Payments</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT ACCESSCHECK DELIVERS */}
      <section id="success" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200/50 text-xs font-bold uppercase mb-4" data-animate>
              <span className="bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">What You Get</span>
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4" data-animate>
              Everything You Need To{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent gradient-text">
                Achieve Compliance
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
              Built with axe-core, the same accessibility engine trusted by Fortune 500 companies and government agencies worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: ScanSearch,
                title: 'Industry-Standard Testing',
                description: 'Powered by axe-core, the same accessibility engine used by Google, Microsoft, and government agencies worldwide.',
                gradient: 'from-blue-500 to-cyan-500',
                iconBg: 'from-blue-500/10 to-cyan-500/10',
                features: [
                  'WCAG 2.1 Level A & AA compliance',
                  '90+ automated accessibility checks',
                  'Section 508 compliance testing',
                  'Real browser testing with Puppeteer'
                ]
              },
              {
                icon: FileText,
                title: 'Executive-Ready Reports',
                description: 'Professional PDF reports with detailed findings, fix recommendations, and compliance scores that satisfy auditors.',
                gradient: 'from-purple-500 to-pink-500',
                iconBg: 'from-purple-500/10 to-pink-500/10',
                features: [
                  'Branded compliance certificates',
                  'Detailed issue breakdowns',
                  'Priority-based fix recommendations',
                  'Historical trend analysis'
                ]
              },
              {
                icon: Zap,
                title: 'Developer-Friendly Integration',
                description: 'RESTful API with comprehensive documentation. Integrate accessibility testing into your CI/CD pipeline.',
                gradient: 'from-orange-500 to-red-500',
                iconBg: 'from-orange-500/10 to-red-500/10',
                features: [
                  'Simple REST API with API keys',
                  'Bulk scanning via CSV upload',
                  'Scheduled automated monitoring',
                  'Webhook notifications for issues'
                ]
              },
              {
                icon: Shield,
                title: 'Continuous Compliance',
                description: 'Stay compliant with automated scheduled scans and instant alerts when accessibility issues are detected.',
                gradient: 'from-emerald-500 to-teal-500',
                iconBg: 'from-emerald-500/10 to-teal-500/10',
                features: [
                  'Automated daily/weekly scans',
                  'Email alerts for new issues',
                  'Historical compliance tracking',
                  'Export audit trails for regulators'
                ]
              }
            ].map((story, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-500 hover-lift"
                data-animate="scale"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${story.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                
                <div className="relative">
                  {/* Icon Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      {/* Gradient glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${story.gradient} opacity-20 blur-xl rounded-2xl group-hover:opacity-40 transition-opacity`}></div>
                      {/* Icon container */}
                      <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${story.gradient} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <story.icon className="w-8 h-8 text-white stroke-[2.5]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{story.title}</h3>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="mb-6 text-gray-600 leading-relaxed">
                    {story.description}
                  </p>
                  
                  {/* Features List */}
                  <ul className="space-y-3">
                    {story.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${story.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200/50 text-xs font-bold uppercase mb-4" data-animate>
              <span className="bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">FAQ</span>
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4" data-animate>
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent gradient-text">
                Questions
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is WCAG compliance and why does it matter?',
                a: 'WCAG (Web Content Accessibility Guidelines) are international standards ensuring digital content is accessible to people with disabilities. Compliance reduces legal risk, improves user experience for everyone, and can increase your market reach by up to 15%.'
              },
              {
                q: 'How does the scanning process work?',
                a: 'Simply enter your URL and our engine tests against 50+ WCAG 2.1 criteria including color contrast, keyboard navigation, screen reader compatibility, ARIA labels, and semantic structure. Results are delivered in under 60 seconds with actionable fixes.'
              },
              {
                q: 'Can this tool prevent ADA lawsuits?',
                a: 'While no tool guarantees complete protection, AccessCheck provides documented proof of good-faith efforts toward accessibility compliance, which significantly reduces legal risk and helps you quickly remediate issues before they become problems.'
              },
              {
                q: 'Do you offer API access for CI/CD integration?',
                a: 'Yes! Our Business plan includes full API access for automated testing in your deployment pipeline, scheduled scans, bulk operations, and custom integrations with your existing tools.'
              },
              {
                q: 'Is there a free trial available?',
                a: 'No, we do not offer a free trial. Our Pro plan is $19/month for up to 10 scans per day, with full accessibility reports, priority support, and PDF exports. You can cancel anytime.'
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:border-indigo-400/50 hover:shadow-lg transition-all duration-300"
                data-animate
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <summary className="flex items-center justify-between cursor-pointer font-bold text-lg hover:text-indigo-600 transition-colors">
                  <span className="pr-8">{faq.q}</span>
                  <svg className="w-6 h-6 flex-shrink-0 transform group-open:rotate-180 transition-transform duration-300 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-800 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-16 p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200/50" data-animate="scale">
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Still have questions?
            </h3>
            <p className="text-gray-800 mb-6">Our expert support team is here to help you succeed with accessibility compliance.</p>
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-xl transition-all hover-lift">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-svg-pattern" />
        </div>

  <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6" data-animate>
            Ready to Make Your Website{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-yellow-300">
              Accessible to Everyone?
            </span>
          </h2>
          <p className="text-xl mb-8 text-blue-100" data-animate>
            Join 10,000+ companies building inclusive digital experiences
          </p>
          <Link 
            href={isSignedIn ? "/dashboard#scan" : "/scan#scan"} 
            className="group inline-block px-10 py-5 rounded-xl bg-white text-purple-600 font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover-lift"
            data-animate="scale"
          >
            <span className="flex items-center justify-center gap-2">
              Start Your Free Scan
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          <p className="mt-6 text-sm text-blue-100" data-animate>
            No credit card required • Free plan available • Cancel anytime
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <LegalFooter />
    </main>
    </>
  );
}