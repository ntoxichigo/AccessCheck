"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ScanSearch,
  FileStack,
  Clock,
  FileText,
  Settings,
  TrendingUp,
  Shield,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Crown,
  Zap
} from "lucide-react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setFeaturesOpen(false);
  }, [pathname]);

  // Fetch user plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch('/api/user/subscription');
        if (res.ok) {
          const data = await res.json();
          setUserPlan(data.subscription);
        }
      } catch (error) {
        console.error('Failed to fetch plan:', error);
      }
    };
    fetchPlan();
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const getPlanBadge = () => {
    if (!userPlan || userPlan === 'free') return null;
    
    if (userPlan === 'trial') {
      return (
        <motion.div
          className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-bold shadow-md"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Zap className="w-3 h-3" />
          TRIAL
        </motion.div>
      );
    }
    
    if (userPlan === 'pro') {
      return (
        <motion.div
          className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-xs font-bold shadow-md"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Crown className="w-3 h-3" />
          PRO
        </motion.div>
      );
    }
    
    return null;
  };

  const features = [
    {
      icon: ScanSearch,
      title: "Single Scan",
      desc: "Test any URL instantly",
      href: "/scan",
      color: "from-blue-500 to-cyan-500",
      badge: null
    },
    {
      icon: FileStack,
      title: "Bulk Scan",
      desc: "Upload CSV for multiple URLs",
      href: "/bulk-scan",
      color: "from-purple-500 to-pink-500",
      badge: "PRO"
    },
    {
      icon: Clock,
      title: "Scheduled Scans",
      desc: "Automated monitoring",
      href: "/dashboard?tab=scheduled",
      color: "from-orange-500 to-red-500",
      badge: null
    },
    {
      icon: FileText,
      title: "PDF Reports",
      desc: "Export compliance docs",
      href: "/dashboard?tab=reports",
      color: "from-green-500 to-emerald-500",
      badge: null
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      desc: "Track improvement trends",
      href: "/dashboard?tab=analytics",
      color: "from-indigo-500 to-purple-500",
      badge: null
    },
    {
      icon: Shield,
      title: "API Access",
      desc: "CI/CD integration",
      href: "/settings?tab=api",
      color: "from-cyan-500 to-blue-500",
      badge: "PRO"
    }
  ];

  const publicLinks = [
    { href: "/pricing", label: "Pricing", icon: Sparkles },
    { href: "/api-docs", label: "API Docs", icon: FileText },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-lg"
          : "bg-white/90 backdrop-blur-md"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 z-50">
            <motion.div
              className="flex items-center gap-2.5 group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-purple-600 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-600 to-purple-600 shadow-xl">
                  <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <motion.p className="font-black text-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  AccessCheck
                </motion.p>
                <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">WCAG Compliance</p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation - SAME FOR ALL USERS */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Features Dropdown - Always visible */}
            <div
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <motion.button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                  featuresOpen
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles className="w-4 h-4" />
                Features
                <ChevronDown className={`w-4 h-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {featuresOpen && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-[600px] bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/80 overflow-hidden z-40"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                      <div className="p-4">
                        <div className="mb-3 px-3">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">All Features</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {features.map((feature) => (
                            <Link key={feature.href} href={feature.href}>
                              <motion.div
                                className="group p-4 rounded-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50/50 transition-all duration-200 border border-transparent hover:border-blue-200/50 cursor-pointer"
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} shadow-lg`}>
                                    <feature.icon className="w-5 h-5 text-white" strokeWidth={2} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-bold text-gray-900 text-sm mb-0.5 group-hover:text-blue-600 transition-colors">
                                        {feature.title}
                                      </h3>
                                      {feature.badge && (
                                        <span className="px-1.5 py-0.5 text-[9px] font-black bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded uppercase tracking-wide">
                                          {feature.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600">{feature.desc}</p>
                                  </div>
                                </div>
                              </motion.div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200/50">
                          <Link href="/dashboard">
                            <motion.button
                              className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-xl transition-all text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              View All in Dashboard →
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Public Links - Always visible */}
            {publicLinks.map((link) => {
              // Only pricing needs special scroll handling (it's a section on homepage)
              // About, Contact, and API Docs are separate pages
              const handleClick = (e: React.MouseEvent) => {
                if (link.href === '/pricing') {
                  if (pathname === '/') {
                    // Already on homepage, scroll to pricing section
                    e.preventDefault();
                    const element = document.getElementById('pricing');
                    if (element) {
                      const offset = 80;
                      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                      window.scrollTo({
                        top: elementPosition - offset,
                        behavior: 'smooth'
                      });
                    }
                  } else {
                    // Navigate to homepage pricing section
                    e.preventDefault();
                    window.location.href = '/#pricing';
                  }
                }
                // About, Contact, and API Docs don't need special handling - they're regular pages
              };

              return (
              <Link key={link.href} href={link.href === '/pricing' ? '/#pricing' : link.href} onClick={handleClick}>
                <motion.div
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                    isActive(link.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </motion.div>
              </Link>
              );
            })}

            {/* Dashboard Link - Only when signed in */}
            <SignedIn>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/dashboard">
                  <div
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                      isActive('/dashboard')
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </div>
                </Link>
              </motion.div>
            </SignedIn>
          </div>

          {/* Right side - Auth & CTA - SAME LAYOUT */}
          <div className="hidden lg:flex items-center gap-3">
            <SignedOut>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/sign-in">
                  <button
                    className="px-5 py-2.5 text-gray-700 font-semibold hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50"
                  >
                    Sign In
                  </button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.5)" }} whileTap={{ scale: 0.97 }}>
                <Link href="/sign-up">
                  <button
                    className="relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 text-white font-bold rounded-lg shadow-lg group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </Link>
              </motion.div>
            </SignedOut>

            <SignedIn>
              <Link href="/settings">
                <motion.button
                  className="flex items-center gap-2 px-5 py-2.5 text-gray-700 font-semibold hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </motion.button>
              </Link>
              <div className="flex items-center gap-2">
                {getPlanBadge()}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 ring-2 ring-blue-100 hover:ring-blue-200 transition-all"
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors z-50"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            {open ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation - SAME FOR ALL USERS */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
                {/* Mobile Features - Always visible */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Features</p>
                  <div className="space-y-2">
                    {features.map((feature) => (
                      <Link key={feature.href} href={feature.href}>
                        <motion.div
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors"
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color}`}>
                            <feature.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900 text-sm">{feature.title}</p>
                              {feature.badge && (
                                <span className="px-1.5 py-0.5 text-[9px] font-black bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded uppercase tracking-wide">
                                  {feature.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{feature.desc}</p>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Public Links - Always visible */}
                <div className="border-t border-gray-200/50 pt-3 space-y-2">
                  {publicLinks.map((link) => {
                    // Only pricing needs special scroll handling (it's a section on homepage)
                    // About, Contact, and API Docs are separate pages
                    const handleClick = (e: React.MouseEvent) => {
                      if (link.href === '/pricing') {
                        e.preventDefault();
                        if (pathname === '/') {
                          const element = document.getElementById('pricing');
                          if (element) {
                            const offset = 80;
                            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                            window.scrollTo({
                              top: elementPosition - offset,
                              behavior: 'smooth'
                            });
                          }
                        } else {
                          window.location.href = '/#pricing';
                        }
                      }
                      // About, Contact, and API Docs don't need special handling - they're regular pages
                      // Close mobile menu after navigation
                      setOpen(false);
                    };

                    return (
                      <Link key={link.href} href={link.href === '/pricing' ? '/#pricing' : link.href} onClick={handleClick}>
                        <motion.div
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold ${
                            isActive(link.href)
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:bg-blue-50/50"
                          }`}
                          whileTap={{ scale: 0.98 }}
                        >
                          {link.icon && <link.icon className="w-4 h-4" />}
                          {link.label}
                        </motion.div>
                      </Link>
                    );
                  })}

                  {/* Dashboard Link - Only when signed in */}
                  <SignedIn>
                    <Link href="/dashboard">
                      <motion.div
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold ${
                          isActive('/dashboard')
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:bg-blue-50/50"
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </motion.div>
                    </Link>
                    <Link href="/settings">
                      <motion.div
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold ${
                          isActive('/settings')
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:bg-blue-50/50"
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </motion.div>
                    </Link>
                  </SignedIn>
                </div>

                {/* Auth Buttons */}
                <div className="border-t border-gray-200/50 pt-3 space-y-2">
                  <SignedOut>
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Link href="/sign-in">
                        <button
                          className="w-full px-4 py-3 text-gray-700 font-semibold hover:bg-blue-50/50 transition-colors text-left rounded-xl"
                        >
                          Sign In
                        </button>
                      </Link>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Link href="/sign-up">
                        <button
                          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                        >
                          Get Started
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </Link>
                    </motion.div>
                  </SignedOut>

                  <SignedIn>
                    <div className="flex items-center gap-3 px-2 py-2">
                      <UserButton afterSignOutUrl="/" />
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm font-semibold text-gray-700">Account</span>
                        {getPlanBadge()}
                      </div>
                    </div>
                  </SignedIn>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
