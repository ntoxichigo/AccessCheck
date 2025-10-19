"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import NavBar from "../../components/NavBar";
import { LegalFooter } from "../../components/legal/LegalFooter";
import { useOptimizedAnimations } from "../../hooks/useOptimizedAnimations";

export default function TermsPage() {
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
          <h1 className="text-4xl sm:text-5xl font-black mb-4"><span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Terms of Service</span></h1>
          <p className="text-gray-800">Last updated: October 12, 2025</p>
        </motion.div>
        <motion.div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-gray-200/50 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <div className="prose prose-lg prose-gray max-w-none">
            <div className="space-y-8">
              <section><p className="text-gray-700 leading-relaxed">By using AccessCheck, you agree to comply with all applicable laws and regulations. The information and results provided by this service are for informational purposes only and do not constitute legal advice. AccessCheck is not liable for any actions taken based on the results of accessibility scans.</p></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">1. Acceptance of Terms</h2><p className="text-gray-700 leading-relaxed">Your use of AccessCheck constitutes acceptance of these Terms of Service. If you do not agree, please discontinue use of the service.</p></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">2. Service Description</h2><p className="text-gray-700 leading-relaxed">AccessCheck provides automated accessibility scanning and reporting. Results are generated using industry-standard tools but may not capture all compliance issues. Manual review is recommended for full compliance.</p></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3. Limitation of Liability</h2><p className="text-gray-700 leading-relaxed">AccessCheck and its creators are not responsible for any damages, losses, or liabilities arising from the use of this service. All results are provided &quot;as is&quot; without warranty of any kind.</p></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">4. Privacy</h2><p className="text-gray-700 leading-relaxed">Please refer to our <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold underline">Privacy Policy</Link> for details on data collection and usage.</p></section>
              <section><h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">5. Changes to Terms</h2><p className="text-gray-700 leading-relaxed">AccessCheck reserves the right to update these Terms of Service at any time. Continued use of the service constitutes acceptance of any changes.</p></section>
              <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/50"><p className="text-sm text-gray-700 text-center">Questions about our terms? <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold underline">Contact us</Link> for clarification.</p></div>
            </div>
          </div>
        </motion.div>
      </div>
      <LegalFooter />
    </main>
    </>
  );
}
