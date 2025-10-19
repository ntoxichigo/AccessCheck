"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";
import Link from "next/link";
import NavBar from "../../components/NavBar";
import { LegalFooter } from "../../components/legal/LegalFooter";
import { useOptimizedAnimations } from "../../hooks/useOptimizedAnimations";

export default function AboutPage() {
  // Use optimized animation hook (reduced particles for better performance)
  const { mounted, mousePos, particles, handleMouseMove } = useOptimizedAnimations({
    particleCount: 8,
    enableMouseTracking: true,
    throttleMs: 100
  });

  const features = useMemo(() => [
    { 
      title: "Lightning Fast", 
      description: "Scan your entire website in under 60 seconds. Get instant results with zero wait time.",
      icon: "⚡",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      title: "99% Accuracy", 
      description: "Powered by axe-core, the industry-leading accessibility testing engine trusted by Fortune 500 companies.",
      icon: "🎯",
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      title: "Crystal Clear Reports", 
      description: "No technical jargon. Get actionable insights with exact locations and copy-paste fixes.",
      icon: "✨",
      gradient: "from-green-500 to-emerald-500"
    }
  ], []);

  const team = useMemo(() => [
    {
      role: "Our Vision",
      title: "Making the Web Accessible to Everyone",
      description: "We believe that every person, regardless of ability, deserves equal access to digital content. AccessCheck was born from the frustration of complex, expensive accessibility tools that slow down development teams.",
      icon: "🌍"
    },
    {
      role: "Our Approach",
      title: "Developer-First, User-Focused",
      description: "We combine powerful automation with human-friendly insights. Our tools integrate seamlessly into your workflow, providing actionable guidance without the complexity.",
      icon: "🚀"
    },
    {
      role: "Our Commitment",
      title: "Continuous Innovation",
      description: "Accessibility standards evolve, and so do we. We're constantly updating our detection algorithms and adding new features based on real-world feedback from teams like yours.",
      icon: "💡"
    }
  ], []);

  return (
    <>
      <NavBar />
      <main className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900" onMouseMove={handleMouseMove}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)
            `,
            transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`
          }}
        />
        
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
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  AC
                </div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AccessCheck
              </span>
            </Link>
            <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
              Back to Home
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 backdrop-blur-sm mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent uppercase tracking-wide">
              About Us
            </span>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Building a More{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Accessible Web
            </span>
          </motion.h1>

          <motion.p 
            className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            We build fast, developer-friendly accessibility tooling so teams can meet WCAG standards without slowing down.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-2xl transition-all hover-lift"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-gray-800 leading-relaxed">{feature.description}</p>
                <div className={`mt-6 h-1 w-0 bg-gradient-to-r ${feature.gradient} group-hover:w-full transition-all duration-700 rounded-full`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {team.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl p-8 border border-blue-200/30 hover:shadow-xl transition-all hover-lift"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">{item.role}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
              <p className="text-gray-800 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* axe-core Attribution */}
        <motion.div 
          className="relative overflow-hidden p-10 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative">
            <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powered by axe-core
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed text-lg">
              AccessCheck uses{' '}
              <a 
                href="https://github.com/dequelabs/axe-core" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-bold underline"
              >
                axe-core
              </a>
              , the world&apos;s leading open-source accessibility testing engine developed by{' '}
              <a 
                href="https://www.deque.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-bold underline"
              >
                Deque Systems, Inc.
              </a>
            </p>
            <p className="text-sm text-gray-800">
              axe-core is licensed under the{' '}
              <a 
                href="https://www.mozilla.org/en-US/MPL/2.0/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-semibold underline"
              >
                Mozilla Public License 2.0 (MPL 2.0)
              </a>
              . We extend our gratitude to Deque Systems for making this powerful technology available to the community.
            </p>
          </div>
        </motion.div>
      </div>

      <LegalFooter />
    </main>
    </>
  );
}

