'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn } = (function(){
    try { return useAuth(); } catch { return { isSignedIn: false } as any; }
  })();
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [mounted, setMounted] = useState(false);

  const particles = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      left: 20 + Math.random() * 60,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 3,
      delay: Math.random() * 2
    }));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

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
    };

    // On-scroll fade-in
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-fadeIn');
        }),
      { threshold: 0.18 }
    );
    document.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) => observer.observe(el));

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Soft gradient blobs (background) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -right-1/4 -top-1/4 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute -left-1/4 bottom-0 w-[800px] h-[800px] bg-gradient-to-tr from-purple-200 via-pink-200 to-rose-200 rounded-full blur-3xl opacity-35" />
        <div className="absolute right-1/3 top-1/2 w-[600px] h-[600px] bg-gradient-to-bl from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Local animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fadeIn { animation: fadeIn 0.7s ease-out both; }
        .tilt-hover {
          transform-style: preserve-3d;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .tilt-hover:hover {
          transform: translateY(-6px) rotateX(2deg) rotateY(-4deg);
          box-shadow: 0 18px 50px rgba(31, 38, 135, 0.15);
        }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => scrollToSection('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                AC
              </div>
              <div>
                <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AccessCheck
                </div>
                <div className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">
                  WCAG Compliance
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
              {[
                { id: 'features', label: 'Features' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'success', label: 'Success Stories' },
                { id: 'faq', label: 'FAQ' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-colors ${
                    activeSection === item.id ? 'text-blue-600' : 'hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button className="hidden md:block px-5 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                Sign In
              </button>
              <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg transition-all">
                Start Free Scan
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative py-20 lg:py-32" data-fade>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent uppercase tracking-wide">
                  WCAG 2.1 AA Certified
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight text-gray-900">
                  Make Accessibility
                  <span
                    className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    style={{ backgroundSize: '200% auto', animation: 'gradient 3s ease infinite' }}
                  >
                    Simple & Fast
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Scan your website in{' '}
                  <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    60 seconds
                  </span>
                  . Get actionable WCAG compliance reports with prioritized fixes. No technical expertise required.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={isSignedIn ? "/dashboard#scan" : "/scan#scan"}
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                  style={{ backgroundSize: '200% auto', animation: 'gradient 3s ease infinite' }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Try Free Scan
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </a>
                <button className="px-8 py-4 rounded-xl border-2 border-gray-300 font-bold text-gray-800 hover:border-indigo-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
                  Watch Demo
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                {[
                  { num: '10K+', label: 'Sites Scanned', gradient: 'from-blue-600 to-cyan-500' },
                  { num: '500K+', label: 'Issues Fixed', gradient: 'from-indigo-600 to-purple-500' },
                  { num: '99.2%', label: 'Accuracy', gradient: 'from-purple-600 to-pink-500' }
                ].map((stat, i) => (
                  <div key={i} data-fade style={{ animationDelay: `${i * 60}ms` }}>
                    <div
                      className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      {stat.num}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="relative" style={{ transform: `translateY(${scrollY * -0.1}px)` }}>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500 tilt-hover">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl opacity-60" />

                <div className="relative space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Scan Complete</div>
                        <div className="text-sm text-gray-500">yoursite.com</div>
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300">
                      <span className="font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent text-sm">
                        94% Score
                      </span>
                    </div>
                  </div>

                  {[
                    { severity: 'Critical', count: '3', gradient: 'from-red-500 to-rose-500' },
                    { severity: 'Warning', count: '12', gradient: 'from-yellow-500 to-orange-500' },
                    { severity: 'Info', count: '8', gradient: 'from-blue-500 to-cyan-500' }
                  ].map((issue, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                      data-fade
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${issue.gradient}`} />
                        <span className="font-semibold text-gray-700">{issue.severity}</span>
                      </div>
                      <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {issue.count}
                      </span>
                    </div>
                  ))}

                  <a
                    href={isSignedIn ? "/pricing" : "/sign-in?redirect_url=/pricing?from=report"}
                    className="w-full inline-block text-center py-3 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold hover:shadow-lg transition-all"
                    style={{ backgroundSize: '200% auto', animation: 'gradient 3s ease infinite' }}
                  >
                    View Full Report
                  </a>
                </div>
              </div>

              <div
                className="absolute -top-4 -right-4 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-xl transform rotate-6"
                style={{ animation: 'float 3s ease-in-out infinite' }}
              >
                ✓ SOC 2 Certified
              </div>

              {mounted &&
                particles.map((p, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 opacity-40"
                    style={{
                      left: `${p.left}%`,
                      top: `${p.top}%`,
                      animation: `float ${p.duration}s ease-in-out infinite ${p.delay}s`
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white" data-fade>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 text-xs font-bold uppercase mb-4">
              <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Complete Solution
              </span>
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Everything You Need For{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                WCAG Compliance
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial scan to full remediation, our platform guides you every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                title: 'Automated Scanning',
                desc: 'Test 50+ WCAG criteria in seconds — color contrast, keyboard navigation, screen readers, and more.',
                gradient: 'from-blue-500 to-cyan-400'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Instant Reports',
                desc: 'Get detailed, actionable reports with exact locations, severity levels, and ready-to-fix solutions.',
                gradient: 'from-indigo-500 to-purple-400'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Legal Protection',
                desc: 'Reduce ADA lawsuit risk with documented compliance and continuous improvement tracking.',
                gradient: 'from-purple-500 to-pink-400'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                ),
                title: 'Code Snippets & Fixes',
                desc: 'Copy-paste solutions for the most common accessibility issues straight into your codebase.',
                gradient: 'from-emerald-500 to-teal-400'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17a4 4 0 100-8 4 4 0 000 8z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
                  </svg>
                ),
                title: 'Continuous Monitoring',
                desc: 'Schedule rescans, track regressions, and get alerted the moment accessibility breaks.',
                gradient: 'from-cyan-500 to-sky-400'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ),
                title: 'Audit-Ready PDFs',
                desc: 'Export branded, executive-ready PDF reports for stakeholders, clients, and compliance officers.',
                gradient: 'from-pink-500 to-rose-400'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 tilt-hover"
                data-fade
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                <div className={`mt-6 h-1 w-0 bg-gradient-to-r ${feature.gradient} group-hover:w-full transition-all duration-500 rounded-full`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden" data-fade>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase mb-4">
              Simple Pricing
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Choose Your{' '}
              <span
                className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                style={{ backgroundSize: '200% auto', animation: 'gradient 3s ease infinite' }}
              >
                Perfect Plan
              </span>
            </h2>
            <p className="text-xl text-blue-100">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                className={`relative group ${plan.popular ? 'md:scale-105' : ''}`}
                data-fade
                style={{ animationDelay: `${i * 90}ms` }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold shadow-lg"
                    style={{ animation: 'float 2s ease-in-out infinite' }}
                  >
                    ⭐ MOST POPULAR
                  </div>
                )}

                <div
                  className={`relative overflow-hidden rounded-2xl p-8 transition-all duration-500 ${
                    plan.popular
                      ? 'bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border-2 border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50'
                      : 'bg-white/10 backdrop-blur-lg border-2 border-white/20 hover:bg-white/15'
                  }`}
                >
                  {plan.popular && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      style={{ backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }}
                    />
                  )}

                  <div className="relative">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-5xl font-black">{plan.price}</span>
                      <span className="text-sm text-blue-200">/{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, j) => (
                        <li
                          key={j}
                          className="flex items-center gap-2"
                          style={{ animation: `slideIn 0.5s ease-out ${j * 0.08}s both` }}
                        >
                          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`w-full py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-xl'
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                      style={plan.popular ? { backgroundSize: '200% auto', animation: 'gradient 3s ease infinite' } : {}}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-blue-200 mt-12 text-sm">
            All plans include SSL encryption, GDPR compliance, and 99.9% uptime SLA
          </p>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section id="success" className="py-24 bg-white" data-fade>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-xs font-bold uppercase mb-4">
              <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">Success Stories</span>
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Real Results From{' '}
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Real Companies
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                company: 'Finverta Bank',
                industry: 'Fintech',
                result: '97% WCAG AA in 8 weeks',
                quote:
                  '“AccessCheck let us turn a pending compliance audit into a win. We cut our manual audit time by half and cleared procurement without blockers.”',
                author: 'Laura Mitchell, Head of Risk & Compliance',
                gradient: 'from-blue-500 to-cyan-400',
                bullets: ['−51% manual audit hours', 'Passed vendor review on first try', 'Quarterly monitoring automated']
              },
              {
                company: 'EduNexa Learning',
                industry: 'EdTech',
                result: '$1.4M contract renewed',
                quote:
                  '“The PDF reports were exec-ready. Our board finally understood the scope and progress. We hit our AA target one month ahead.”',
                author: 'Daniel Rivera, CTO',
                gradient: 'from-purple-500 to-pink-400',
                bullets: ['+32% student completion (keyboard users)', 'AA certification verified', 'Stakeholder sign-off in 3 days']
              },
              {
                company: 'Mercato Italia',
                industry: 'E-commerce',
                result: 'Bounce rate −18% after fixes',
                quote:
                  '“Fix suggestions mapped perfectly to our codebase. Contrast and labels alone moved our conversion by 7%.”',
                author: 'Giulia Bianchi, Growth Lead',
                gradient: 'from-rose-500 to-orange-400',
                bullets: ['+7% checkout conversion', 'No ADA complaints in last 2 quarters', 'Nightly scans via CI']
              },
              {
                company: 'CivicPortal EU',
                industry: 'Public Sector',
                result: 'EU Accessibility Act readiness',
                quote:
                  '“The scan history let our legal team document continuous compliance. That made procurement painless.”',
                author: 'Matteo Rossi, Program Manager',
                gradient: 'from-emerald-500 to-teal-400',
                bullets: ['AA conformance evidence archive', 'API integrated with staging', 'All regressions auto-flagged']
              }
            ].map((story, i) => (
              <div
                key={i}
                className="relative group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 tilt-hover"
                data-fade
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${story.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
                <div className="relative">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-1">{story.company}</h3>
                    <p className="text-sm text-gray-600">{story.industry}</p>
                  </div>
                  <div className={`mb-6 px-6 py-3 inline-block rounded-lg bg-gradient-to-r ${story.gradient} text-white font-bold`}>
                    {story.result}
                  </div>
                  <blockquote className="mb-5 text-gray-700 italic leading-relaxed">“{story.quote}”</blockquote>
                  <ul className="mb-5 space-y-2 text-sm text-gray-700">
                    {story.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm font-semibold text-gray-600">— {story.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-gradient-to-b from-gray-50 to-white" data-fade>
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 text-xs font-bold uppercase mb-4">
              <span className="bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">Common Questions</span>
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is WCAG compliance and why does it matter?',
                a: 'WCAG are international standards ensuring digital content is accessible to people with disabilities. Compliance reduces legal risk, improves UX, and expands your market reach.'
              },
              {
                q: 'How does the scanning process work?',
                a: 'Enter your URL and run a scan. We test against 50+ WCAG 2.1 criteria (contrast, keyboard nav, labels, ARIA, landmarks). Results arrive in under 60 seconds.'
              },
              {
                q: 'Can I avoid ADA lawsuits with this tool?',
                a: 'No tool guarantees 100% protection, but AccessCheck documents good-faith efforts and helps you remediate quickly, greatly reducing risk.'
              },
              {
                q: 'Do you offer API access?',
                a: 'Yes. The Business plan provides API access for CI/CD integration, scheduled rescans, and bulk operations.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, Pro and Business include a 14-day free trial. No credit card required.'
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-400 transition-all duration-300 hover:shadow-lg"
                data-fade
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <summary className="flex items-center justify-between cursor-pointer font-bold text-lg">
                  <span className="pr-8">{faq.q}</span>
                  <svg
                    className="w-6 h-6 flex-shrink-0 transform group-open:rotate-180 transition-transform duration-300 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>

          <div
            className="mt-12 text-center p-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-indigo-200"
            data-fade
          >
            <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
            <p className="text-gray-600 mb-6">Our support team is here to help you succeed.</p>
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-xl transition-all transform hover:-translate-y-1">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden" data-fade>
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,.05) 50px, rgba(255,255,255,.05) 100px)'
            }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">Ready to Make Your Website Accessible?</h2>
          <p className="text-xl mb-8 text-blue-100">Join 10,000+ companies protecting their users and their business</p>
          <a href={isSignedIn ? "/dashboard#scan" : "/scan#scan"} className="group inline-block px-10 py-5 rounded-xl bg-white text-indigo-600 font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl transform hover:-translate-y-1 hover:shadow-white/30">
            <span className="flex items-center justify-center gap-2">
              Start Free Scan Now
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>
          <p className="mt-6 text-sm text-blue-100">No credit card required • Free plan available • Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-400">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  AC
                </div>
                <div>
                  <div className="font-bold text-xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">AccessCheck</div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">WCAG Compliance</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-md mb-6">
                Making the web accessible for everyone. Automated WCAG scanning, detailed reports, and actionable insights to help you build inclusive digital experiences.
              </p>
              <div className="flex gap-3">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                    aria-label={social}
                  >
                    <span className="text-xs">🔗</span>
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API', 'Integrations'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Contact', 'Blog'] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© {new Date().getFullYear()} AccessCheck. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
