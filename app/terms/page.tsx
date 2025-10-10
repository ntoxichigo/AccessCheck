"use client";
import PageLayout from "../../components/PageLayout";
import { motion } from "framer-motion";
import { typography } from "../../lib/design-system";
import Link from "next/link";

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing or using AccessCheck, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service."
      ]
    },
    {
      title: "2. Description of Service",
      content: [
        "AccessCheck provides automated web accessibility scanning services that:",
        "• Analyze websites for WCAG 2.1 compliance",
        "• Generate detailed accessibility reports",
        "• Identify issues and provide remediation guidance",
        "• Export results in JSON and CSV formats"
      ]
    },
    {
      title: "3. Account Registration",
      content: [
        "To use AccessCheck, you must:",
        "• Be at least 18 years of age",
        "• Provide accurate and complete registration information",
        "• Maintain the security of your account credentials",
        "• Notify us immediately of any unauthorized access",
        "You are responsible for all activities under your account."
      ]
    },
    {
      title: "4. Subscription Plans and Billing",
      content: [
        "Free Plan:",
        "• 5 scans per month",
        "• Basic accessibility reports",
        "• Email support",
        "",
        "Professional Plan ($29/month):",
        "• Unlimited scans",
        "• Detailed reports with remediation tips",
        "• Priority support",
        "• API access",
        "",
        "Billing:",
        "• Subscriptions auto-renew monthly",
        "• Payment processed through Stripe",
        "• Prices in USD, taxes may apply",
        "• Refunds available within 14 days (see Refund Policy)"
      ]
    },
    {
      title: "5. Refund Policy",
      content: [
        "We offer a 14-day money-back guarantee:",
        "• Available for new Professional subscriptions only",
        "• Must request refund within 14 days of purchase",
        "• Contact support@accesscheck.com to process",
        "• Refunds processed within 5-10 business days",
        "• Free plan users are not eligible for refunds",
        "• Enterprise plans have custom refund terms"
      ]
    },
    {
      title: "6. Acceptable Use Policy",
      content: [
        "You agree NOT to:",
        "• Scan websites without proper authorization",
        "• Use the service for illegal or malicious purposes",
        "• Attempt to bypass rate limits or security measures",
        "• Reverse engineer or copy our technology",
        "• Share your account credentials with others",
        "• Use automated tools to create multiple accounts",
        "• Resell or redistribute our service without permission",
        "",
        "Violation may result in account suspension or termination."
      ]
    },
    {
      title: "7. Service Availability",
      content: [
        "We strive for 99.9% uptime, but:",
        "• Service may be temporarily unavailable for maintenance",
        "• We are not liable for downtime or data loss",
        "• Professional users receive priority support during outages",
        "• Status updates available at status.accesscheck.com"
      ]
    },
    {
      title: "8. Data Ownership and Usage",
      content: [
        "• You own all scan results and reports you generate",
        "• We may use anonymized data to improve our service",
        "• Scan results are retained for 90 days",
        "• You can export or delete your data anytime",
        "• See our Privacy Policy for detailed data practices"
      ]
    },
    {
      title: "9. Intellectual Property",
      content: [
        "AccessCheck and all related technology are owned by us and protected by:",
        "• Copyright laws",
        "• Trademark laws",
        "• Trade secret laws",
        "",
        "You may not copy, modify, or distribute our software without permission."
      ]
    },
    {
      title: "10. Limitation of Liability",
      content: [
        "TO THE MAXIMUM EXTENT PERMITTED BY LAW:",
        "",
        "• AccessCheck is provided \"AS IS\" without warranties",
        "• We are not liable for indirect, incidental, or consequential damages",
        "• Our total liability is limited to the amount you paid in the last 12 months",
        "• We do not guarantee scan accuracy or WCAG compliance certification",
        "• You are responsible for implementing accessibility fixes",
        "",
        "Our scans provide guidance, not legal compliance certification."
      ]
    },
    {
      title: "11. Indemnification",
      content: [
        "You agree to indemnify and hold harmless AccessCheck from any claims arising from:",
        "• Your use of the service",
        "• Violation of these terms",
        "• Infringement of third-party rights",
        "• Scanning websites without authorization"
      ]
    },
    {
      title: "12. Termination",
      content: [
        "Either party may terminate the agreement:",
        "",
        "You can:",
        "• Cancel your subscription anytime from Settings",
        "• Delete your account and all associated data",
        "",
        "We may:",
        "• Suspend or terminate accounts for Terms violations",
        "• Discontinue the service with 30 days notice",
        "• Modify pricing with 30 days notice to existing users"
      ]
    },
    {
      title: "13. API Terms (Professional & Enterprise)",
      content: [
        "If you use our API:",
        "• Rate limits apply per plan tier",
        "• API keys must be kept secure",
        "• Usage must comply with these Terms",
        "• API documentation at docs.accesscheck.com",
        "• Breaking changes announced 60 days in advance"
      ]
    },
    {
      title: "14. Modifications to Terms",
      content: [
        "We may update these Terms from time to time:",
        "• Material changes will be notified via email",
        "• Continued use constitutes acceptance",
        "• Previous versions available upon request",
        "",
        "Last updated: October 10, 2025"
      ]
    },
    {
      title: "15. Governing Law",
      content: [
        "These Terms are governed by the laws of [Your Jurisdiction].",
        "Any disputes will be resolved in the courts of [Your Jurisdiction].",
        "For EU users, EU consumer protection laws apply."
      ]
    },
    {
      title: "16. Contact Information",
      content: [
        "Questions about these Terms?",
        "• Email: legal@accesscheck.com",
        "• Support: support@accesscheck.com",
        "• Address: [Your Company Address]"
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
          Terms of Service
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Please read these terms carefully before using AccessCheck. By using our service, you agree to these terms.
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
            <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 grid md:grid-cols-2 gap-6"
      >
        <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
          <h3 className="text-xl font-bold text-green-300 mb-2">✅ 14-Day Money-Back Guarantee</h3>
          <p className="text-gray-300">
            Try AccessCheck risk-free. If you&apos;re not satisfied, we&apos;ll refund your first payment.
          </p>
        </div>
        
        <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <h3 className="text-xl font-bold text-purple-300 mb-2">📄 Questions?</h3>
          <p className="text-gray-300">
            Need clarification on any terms? <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact our team</Link> - we&apos;re happy to help!
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-center text-gray-500 text-sm"
      >
        <p>
          By using AccessCheck, you agree to our{" "}
          <Link href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
        </p>
      </motion.div>
    </PageLayout>
  );
}
