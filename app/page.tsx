'use client';

import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useAuth, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

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
  const [activeSection, setActiveSection] = useState('home');
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
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = ['home', 'features', 'pricing', 'success', 'faq'];
          const current = sections.find(section => {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              return rect.top <= 100 && rect.bottom >= 100;
            }
            return false;
          });
          if (current) setActiveSection(current);
          
          ticking = false;
        });
        ticking = true;
      }
    };

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
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 overflow-hidden">
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

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <nav className="flex flex-wrap items-center justify-between gap-y-4">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => scrollToSection('home')}
            >
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  AC
                </div>
              </div>
              <div>
                <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AccessCheck
                </div>
                <div className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">
                  WCAG Compliance
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {['features', 'pricing', 'success', 'faq'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`text-sm font-semibold capitalize transition-all relative ${
                    activeSection === item ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item}
                  {activeSection === item && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <SignedOut>
                <Link href="/sign-in" className="hidden md:block px-5 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                  Sign In
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/settings" className="hidden md:block px-5 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                  Settings
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <button className="relative overflow-hidden px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:shadow-xl transition-all group">
                <span className="relative z-10">Start Free Scan</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section 
        id="home" 
        className="relative py-16 sm:py-20 md:py-24 lg:py-32"
        ref={heroRef}
        onMouseMove={handleMouseMove}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
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

                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl" data-animate>
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
                
                <button className="px-8 py-4 rounded-xl border-2 border-gray-300 font-bold text-gray-800 hover:border-purple-500 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all hover-lift">
                  Watch Demo
                </button>
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
                    <div className="text-sm text-gray-600 font-medium mt-1">{stat.label}</div>
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
                        <div className="text-sm text-gray-500">yoursite.com</div>
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-animate>
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
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
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
                features: ['10 scans/day', 'Full reports', 'Priority support', 'PDF exports'],
                cta: 'Start Trial',
                popular: true
              },
              {
                name: 'Business',
                price: '$59',
                period: 'per month',
                features: ['Unlimited scans', 'API access', 'Team dashboard', 'Dedicated support'],
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
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold shadow-lg whitespace-nowrap">
                    ⭐ MOST POPULAR
                  </div>
                )}

                <div className={`relative overflow-hidden rounded-2xl p-8 h-full transition-all duration-500 ${
                  plan.popular
                    ? 'bg-white/20 backdrop-blur-xl border-2 border-white/40 hover:shadow-2xl hover:shadow-white/20'
                    : 'bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15'
                } hover-lift`}>
                  
                  {plan.popular && (
                    <div className="absolute inset-0 shimmer-bg opacity-30" />
                  )}

                  <div className="relative">
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
                        href="/sign-up"
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

      {/* SUCCESS STORIES */}
      <section id="success" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 text-xs font-bold uppercase mb-4" data-animate>
              <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">Success Stories</span>
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4" data-animate>
              Real Results From{' '}
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent gradient-text">
                Real Companies
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                company: 'Finverta Bank',
                industry: 'Fintech',
                result: '97% WCAG AA',
                metric: '8 weeks',
                quote: 'AccessCheck transformed our compliance audit from a blocker to a competitive advantage. We cut manual audit time by half.',
                author: 'Laura Mitchell',
                role: 'Head of Risk & Compliance',
                gradient: 'from-blue-500 to-cyan-500',
                stats: [
                  { value: '51%', label: 'Less audit time' },
                  { value: '100%', label: 'Vendor approval' }
                ]
              },
              {
                company: 'EduNexa Learning',
                industry: 'EdTech',
                result: '$1.4M Contract',
                metric: 'Renewed',
                quote: 'The executive-ready reports made board buy-in instant. We exceeded our AA target ahead of schedule.',
                author: 'Daniel Rivera',
                role: 'CTO',
                gradient: 'from-purple-500 to-pink-500',
                stats: [
                  { value: '32%', label: 'Better completion' },
                  { value: '3 days', label: 'To approval' }
                ]
              },
              {
                company: 'Mercato Italia',
                industry: 'E-commerce',
                result: '18% Lower',
                metric: 'Bounce rate',
                quote: 'The fix suggestions were perfect for our stack. Simple contrast and label improvements boosted conversions significantly.',
                author: 'Giulia Bianchi',
                role: 'Growth Lead',
                gradient: 'from-rose-500 to-orange-500',
                stats: [
                  { value: '7%', label: 'More conversions' },
                  { value: '0', label: 'ADA complaints' }
                ]
              },
              {
                company: 'CivicPortal EU',
                industry: 'Public Sector',
                result: 'EU Act',
                metric: 'Compliant',
                quote: 'Documented continuous compliance made procurement seamless. The API integration catches issues before deployment.',
                author: 'Matteo Rossi',
                role: 'Program Manager',
                gradient: 'from-emerald-500 to-teal-500',
                stats: [
                  { value: 'AA', label: 'Certification' },
                  { value: '24/7', label: 'Monitoring' }
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
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{story.company}</h3>
                      <p className="text-sm text-gray-500 font-medium">{story.industry}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${story.gradient} text-white`}>
                      <div className="font-black text-lg">{story.result}</div>
                      <div className="text-xs opacity-90">{story.metric}</div>
                    </div>
                  </div>
                  
                  <blockquote className="mb-6 text-gray-700 leading-relaxed italic">
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {story.stats.map((stat, j) => (
                      <div key={j} className="text-center p-3 rounded-lg bg-gray-50 group-hover:bg-gradient-to-br group-hover:from-gray-50 group-hover:to-white transition-colors">
                        <div className={`text-2xl font-black bg-gradient-to-r ${story.gradient} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${story.gradient} opacity-20`} />
                    <div>
                      <div className="font-semibold text-gray-900">{story.author}</div>
                      <div className="text-sm text-gray-500">{story.role}</div>
                    </div>
                  </div>
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
                a: 'Absolutely. Both Pro and Business plans include a 14-day free trial with full features. No credit card required to start, and you can downgrade to our free plan anytime.'
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
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-16 p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200/50" data-animate="scale">
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">Our expert support team is here to help you succeed with accessibility compliance.</p>
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
      <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur opacity-50" />
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    AC
                  </div>
                </div>
                <div>
                  <div className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    AccessCheck
                  </div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">WCAG Compliance</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-md mb-6 text-gray-500">
                Making the web accessible for everyone. Automated WCAG scanning, detailed reports, and actionable insights to help you build inclusive digital experiences.
              </p>
              <div className="flex gap-3">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-purple-600/20 hover:border-purple-500/50 transition-all duration-300"
                    aria-label={social}
                  >
                    <span className="text-xs">🔗</span>
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API Docs', 'Integrations', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact', 'Press'] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-gray-500 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} AccessCheck. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}