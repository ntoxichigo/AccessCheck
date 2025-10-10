"use client";
import PageLayout from "../../components/PageLayout";
import { motion } from "framer-motion";
import { typography } from "../../lib/design-system";
import Link from "next/link";

export default function AccessibilityStatementPage() {
  const sections = [
    {
      title: "Our Commitment",
      icon: "♿",
      content: [
        "AccessCheck is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.",
        "",
        "We believe that everyone should have equal access to information and functionality, regardless of their abilities or the technologies they use to access the web."
      ]
    },
    {
      title: "Conformance Status",
      icon: "✅",
      content: [
        "The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.",
        "",
        "AccessCheck is designed to be partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.",
        "",
        "Current Conformance Level: WCAG 2.1 Level AA (Partial)",
        "Target Conformance Level: WCAG 2.1 Level AA (Full) by Q1 2026"
      ]
    },
    {
      title: "Accessible Features",
      icon: "🎯",
      content: [
        "Our website includes the following accessibility features:",
        "",
        "• Keyboard Navigation: All interactive elements are accessible via keyboard",
        "• Screen Reader Support: Proper ARIA labels and semantic HTML",
        "• Color Contrast: Meets WCAG AA standards (minimum 4.5:1 ratio)",
        "• Responsive Design: Works on various screen sizes and devices",
        "• Focus Indicators: Visible focus states on all interactive elements",
        "• Alternative Text: Images include descriptive alt text",
        "• Form Labels: All form fields have associated labels",
        "• Skip Links: Quick navigation to main content areas",
        "• Error Identification: Clear error messages and validation",
        "• Consistent Navigation: Predictable and consistent UI patterns"
      ]
    },
    {
      title: "Known Issues & Limitations",
      icon: "⚠️",
      content: [
        "We are aware of the following accessibility issues and are working to resolve them:",
        "",
        "• Some third-party components (Stripe Pricing Table, Clerk authentication) may not be fully accessible",
        "• Complex data tables may require additional screen reader support",
        "• Some animations may cause motion sensitivity for certain users",
        "• PDF export functionality may not preserve all accessibility features",
        "",
        "We are actively working to address these issues and improve our accessibility compliance."
      ]
    },
    {
      title: "Assistive Technologies",
      icon: "🔧",
      content: [
        "AccessCheck is designed to work with the following assistive technologies:",
        "",
        "Screen Readers:",
        "• NVDA (Windows)",
        "• JAWS (Windows)",
        "• VoiceOver (macOS, iOS)",
        "• TalkBack (Android)",
        "",
        "Other Technologies:",
        "• Voice recognition software",
        "• Screen magnification software",
        "• Alternative input devices (switch access, eye tracking)",
        "• Browser text-to-speech extensions"
      ]
    },
    {
      title: "Third-Party Content",
      icon: "🔗",
      content: [
        "Some content on AccessCheck is provided by third-party services:",
        "",
        "• Clerk (Authentication): We use Clerk for user authentication. Their accessibility statement: https://clerk.com/accessibility",
        "• Stripe (Payments): We use Stripe for payment processing. Their accessibility statement: https://stripe.com/legal/accessibility",
        "",
        "While we strive to work with accessible third-party providers, we cannot guarantee their full compliance with accessibility standards."
      ]
    },
    {
      title: "Testing & Validation",
      icon: "🧪",
      content: [
        "We regularly test AccessCheck for accessibility using:",
        "",
        "Automated Testing:",
        "• Axe-core accessibility engine (same tool we provide to users)",
        "• Lighthouse accessibility audits",
        "• WAVE browser extension",
        "",
        "Manual Testing:",
        "• Keyboard-only navigation testing",
        "• Screen reader testing (NVDA, VoiceOver)",
        "• Color contrast validation",
        "• Zoom and text resize testing",
        "",
        "User Testing:",
        "• Feedback from users with disabilities",
        "• Accessibility consultants and auditors"
      ]
    },
    {
      title: "Feedback & Contact",
      icon: "📧",
      content: [
        "We welcome your feedback on the accessibility of AccessCheck. Please let us know if you encounter accessibility barriers:",
        "",
        "• Email: accessibility@accesscheck.com",
        "• Contact Form: /contact",
        "• Phone: [Your phone number]",
        "",
        "We try to respond to accessibility feedback within 2 business days.",
        "",
        "When reporting an accessibility issue, please include:",
        "• The page URL where you encountered the issue",
        "• A description of the problem",
        "• The assistive technology you were using (if applicable)",
        "• Your browser and operating system"
      ]
    },
    {
      title: "Remediation Process",
      icon: "🔄",
      content: [
        "When accessibility issues are identified, we follow this process:",
        "",
        "1. Issue Logging: All accessibility issues are logged and tracked",
        "2. Priority Assessment: Issues are prioritized based on severity and impact",
        "3. Resolution: Critical issues are addressed within 48 hours, others within 30 days",
        "4. Testing: All fixes are tested with assistive technologies",
        "5. Documentation: Changes are documented and communicated to users",
        "6. Prevention: We update our development practices to prevent similar issues"
      ]
    },
    {
      title: "Standards & Guidelines",
      icon: "📋",
      content: [
        "AccessCheck follows these accessibility standards:",
        "",
        "• WCAG 2.1 Level AA (Web Content Accessibility Guidelines)",
        "• Section 508 (U.S. Rehabilitation Act)",
        "• EN 301 549 (European accessibility standard)",
        "• ADA Title III (Americans with Disabilities Act)",
        "",
        "We aim to exceed the minimum legal requirements and provide an excellent experience for all users."
      ]
    },
    {
      title: "Continuous Improvement",
      icon: "📈",
      content: [
        "Accessibility is an ongoing effort. We are committed to:",
        "",
        "• Regular Audits: Quarterly accessibility audits of all features",
        "• Team Training: Ongoing accessibility training for developers and designers",
        "• User Research: Regular testing with users who have disabilities",
        "• Technology Updates: Keeping up with latest accessibility best practices",
        "• Community Engagement: Participating in accessibility forums and discussions",
        "",
        "Our goal is to make AccessCheck the most accessible web accessibility tool available."
      ]
    },
    {
      title: "Legal Compliance",
      icon: "⚖️",
      content: [
        "This accessibility statement is kept under review and will be updated as our website changes or as accessibility standards evolve.",
        "",
        "Last Reviewed: October 10, 2025",
        "Next Review: January 10, 2026",
        "",
        "This statement was prepared in accordance with:",
        "• W3C Web Accessibility Initiative guidelines",
        "• ADA Title III requirements",
        "• Section 508 standards",
        "• EN 301 549 European standard"
      ]
    }
  ];

  return (
    <PageLayout theme="dark" containerSize="default">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={`${typography.h1} ${typography.gradient} mb-4`}>
          ♿ Accessibility Statement
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Our commitment to making AccessCheck accessible to everyone, regardless of ability or technology.
        </p>
      </motion.div>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">{section.icon}</span>
              {section.title}
            </h2>
            <div className="space-y-2">
              {section.content.map((paragraph, idx) => (
                <p key={idx} className={`text-gray-300 leading-relaxed ${paragraph === '' ? 'h-2' : ''}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Access Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 grid md:grid-cols-3 gap-6"
      >
        <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <h3 className="text-xl font-bold text-blue-300 mb-2">📧 Report Issue</h3>
          <p className="text-gray-300 mb-4">
            Found an accessibility problem? Let us know and we&apos;ll fix it within 48 hours.
          </p>
          <Link 
            href="/contact?topic=accessibility" 
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Report Accessibility Issue →
          </Link>
        </div>
        
        <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <h3 className="text-xl font-bold text-purple-300 mb-2">🔧 Keyboard Shortcuts</h3>
          <p className="text-gray-300 mb-2">Essential keyboard navigation:</p>
          <ul className="text-gray-400 text-sm space-y-1">
            <li><kbd className="px-2 py-1 bg-white/10 rounded">Tab</kbd> Navigate forward</li>
            <li><kbd className="px-2 py-1 bg-white/10 rounded">Shift+Tab</kbd> Navigate back</li>
            <li><kbd className="px-2 py-1 bg-white/10 rounded">Enter</kbd> Activate links/buttons</li>
            <li><kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd> Close modals/menus</li>
          </ul>
        </div>
        
        <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
          <h3 className="text-xl font-bold text-green-300 mb-2">✅ WCAG 2.1 AA</h3>
          <p className="text-gray-300 mb-4">
            We follow international accessibility standards to ensure everyone can use our service.
          </p>
          <a 
            href="https://www.w3.org/WAI/WCAG21/quickref/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 underline"
          >
            Learn about WCAG →
          </a>
        </div>
      </motion.div>

      {/* Compliance Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 p-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 border border-white/10 rounded-xl text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          ♿ We Practice What We Preach
        </h3>
        <p className="text-gray-300 max-w-3xl mx-auto mb-6">
          As a web accessibility scanning tool, we hold ourselves to the highest accessibility standards. 
          We use the same Axe-core engine to test our own site that we provide to our customers. 
          Our team includes accessibility experts and advocates who ensure that everyone can use AccessCheck.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <span className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">
            ✅ WCAG 2.1 Level AA
          </span>
          <span className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">
            ✅ Section 508 Compliant
          </span>
          <span className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">
            ✅ EN 301 549 Aligned
          </span>
          <span className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">
            ✅ ADA Title III
          </span>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12 text-center text-gray-500 text-sm"
      >
        <p>
          This statement was last updated on October 10, 2025.{" "}
          <Link href="/contact" className="text-blue-400 hover:text-blue-300">
            Contact us
          </Link>{" "}
          if you have questions or suggestions.
        </p>
      </motion.div>
    </PageLayout>
  );
}
