"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import NavBar from "../../components/NavBar";
import { LegalFooter } from "../../components/legal/LegalFooter";
import { useOptimizedAnimations } from "../../hooks/useOptimizedAnimations";

export default function PrivacyPage() {
  // Use optimized animation hook
  const { mounted, mousePos, particles, handleMouseMove } = useOptimizedAnimations({
    particleCount: 5,
    enableMouseTracking: true,
    throttleMs: 100
  });

  return (
    <>
      <NavBar />
      <main className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 overflow-hidden" onMouseMove={handleMouseMove}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            transform: 'translate(' + (mousePos.x * 10) + 'px, ' + (mousePos.y * 10) + 'px)'
          }}
        />
        {mounted && particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20"
            style={{
              left: p.x + '%',
              top: p.y + '%',
              width: p.size + 'px',
              height: p.size + 'px',
              opacity: p.opacity,
              animation: `float ${p.duration}s ease-in-out infinite ${p.delay}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }
      `}</style>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">AC</div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AccessCheck</span>
            </Link>
            <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Back to Home</Link>
          </nav>
        </div>
      </header>
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 backdrop-blur-sm mb-6">
            <span className="text-xs font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent uppercase tracking-wide">Legal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4"><span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Privacy Policy</span></h1>
          <p className="text-gray-800">Last updated: October 12, 2025</p>
        </motion.div>
        <motion.div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-gray-200/50 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <div className="prose prose-lg prose-gray max-w-none">
            <div className="space-y-8">
              <section><p className="text-gray-700 leading-relaxed">At AccessCheck, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our accessibility scanning service.</p></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">1. Information We Collect</h2><p className="text-gray-700 leading-relaxed mb-4">We collect the following types of information:</p><ul className="list-disc pl-6 space-y-2 text-gray-700"><li><strong>URLs Scanned:</strong> The website URLs you submit for accessibility scanning.</li><li><strong>Account Information:</strong> Email address and authentication data when you create an account.</li><li><strong>Usage Data:</strong> Information about how you interact with our service, including scan history and results.</li><li><strong>Technical Data:</strong> IP address, browser type, and device information for security and service improvement.</li></ul></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">2. How We Use Your Information</h2><p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p><ul className="list-disc pl-6 space-y-2 text-gray-700"><li>Provide accessibility scanning and reporting services</li><li>Maintain and improve our service quality</li><li>Communicate with you about your account and scans</li><li>Ensure security and prevent fraud</li><li>Comply with legal obligations</li></ul></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3. Data Sharing and Disclosure</h2><p className="text-gray-700 leading-relaxed">We do not sell your personal information. We may share your data only in the following circumstances:</p><ul className="list-disc pl-6 space-y-2 text-gray-700"><li>With service providers who help us operate our platform (e.g., hosting, analytics)</li><li>When required by law or to protect our legal rights</li><li>With your explicit consent</li></ul></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">4. Data Security</h2><p className="text-gray-700 leading-relaxed">We implement industry-standard security measures to protect your data, including encryption, secure connections (HTTPS), and regular security audits. However, no method of transmission over the internet is 100% secure.</p></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">5. Your Rights</h2><p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p><ul className="list-disc pl-6 space-y-2 text-gray-700"><li>Access your personal data</li><li>Request correction of inaccurate data</li><li>Request deletion of your account and data</li><li>Opt-out of marketing communications</li><li>Export your scan history and results</li></ul><p className="text-gray-700 leading-relaxed mt-4">To exercise these rights, please <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold underline">contact us</Link>.</p></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">6. Cookies and Tracking</h2><p className="text-gray-700 leading-relaxed">We use essential cookies to maintain your session and preferences. We do not use third-party advertising cookies. You can control cookie settings through your browser.</p></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">7. Data Retention</h2><p className="text-gray-700 leading-relaxed">We retain your scan data and account information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time.</p></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">8. Changes to This Policy</h2><p className="text-gray-700 leading-relaxed">We may update this Privacy Policy periodically. We will notify you of significant changes by email or through a prominent notice on our service.</p></section>
              <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/50"><p className="text-sm text-gray-700 text-center">Questions about your privacy? <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold underline">Contact us</Link> for more information.</p></div>
            </div>
          </div>
        </motion.div>
      </div>
      <LegalFooter />
    </main>
    </>
  );
}
