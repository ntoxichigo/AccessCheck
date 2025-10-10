"use client";
import PageLayout from "../../components/PageLayout";
import { motion } from "framer-motion";
import { typography } from "../../lib/design-system";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        "When you use AccessCheck, we collect the following information:",
        "• Account Information: Name, email address, and authentication data through Clerk",
        "• Website Scan Data: URLs you submit for accessibility scanning and the results",
        "• Payment Information: Processed securely through Stripe (we don't store card details)",
        "• Usage Data: How you interact with our service, pages visited, and features used",
        "• Technical Data: IP address, browser type, device information, and cookies"
      ]
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "We use your information to:",
        "• Provide accessibility scanning services",
        "• Process payments and manage subscriptions",
        "• Send you scan results and important account notifications",
        "• Improve our service and develop new features",
        "• Comply with legal obligations and prevent fraud",
        "• Provide customer support"
      ]
    },
    {
      title: "3. Data Sharing and Third Parties",
      content: [
        "We share your data with:",
        "• Clerk: For authentication and user management",
        "• Stripe: For payment processing (PCI-DSS compliant)",
        "• Upstash Redis: For caching and rate limiting",
        "• Vercel: For hosting and infrastructure",
        "We never sell your personal data to third parties."
      ]
    },
    {
      title: "4. Data Storage and Security",
      content: [
        "• All data is encrypted in transit using TLS 1.3",
        "• Database stored in secure PostgreSQL instance",
        "• Regular security audits and monitoring",
        "• Access controls and authentication required",
        "• Automatic backups and disaster recovery"
      ]
    },
    {
      title: "5. Your Rights (GDPR Compliance)",
      content: [
        "You have the right to:",
        "• Access your personal data",
        "• Correct inaccurate data",
        "• Request deletion of your data",
        "• Export your data in a portable format",
        "• Object to processing of your data",
        "• Withdraw consent at any time",
        "To exercise these rights, contact us at support@accesscheck.com"
      ]
    },
    {
      title: "6. Cookies and Tracking",
      content: [
        "We use cookies for:",
        "• Authentication (required for login)",
        "• Session management",
        "• Analytics (anonymous usage data)",
        "You can disable cookies in your browser, but some features may not work."
      ]
    },
    {
      title: "7. Data Retention",
      content: [
        "• Active accounts: Data retained while account is active",
        "• Deleted accounts: Personal data deleted within 30 days",
        "• Scan results: Retained for 90 days unless deleted earlier",
        "• Billing records: Retained for 7 years (legal requirement)"
      ]
    },
    {
      title: "8. Children's Privacy",
      content: [
        "AccessCheck is not intended for users under 18 years of age. We do not knowingly collect data from children."
      ]
    },
    {
      title: "9. International Data Transfers",
      content: [
        "Your data may be transferred to and processed in countries outside your residence. We ensure appropriate safeguards are in place through:",
        "• Standard contractual clauses",
        "• Privacy Shield frameworks where applicable",
        "• Vendor compliance certifications"
      ]
    },
    {
      title: "10. Changes to This Policy",
      content: [
        "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through our service.",
        "Last updated: October 10, 2025"
      ]
    },
    {
      title: "11. Contact Us",
      content: [
        "For privacy-related questions or concerns:",
        "• Email: privacy@accesscheck.com",
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
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Your privacy is important to us. This policy explains how we collect, use, and protect your data.
        </p>
      </motion.div>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
            <div className="space-y-2">
              {section.content.map((paragraph, idx) => (
                <p key={idx} className="text-gray-300 leading-relaxed">
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
        className="mt-12 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl"
      >
        <h3 className="text-xl font-bold text-blue-300 mb-2">🔒 Your Data is Safe</h3>
        <p className="text-gray-300">
          We are committed to protecting your privacy and ensuring transparency in how we handle your data. 
          If you have any questions, please don&apos;t hesitate to contact us.
        </p>
      </motion.div>
    </PageLayout>
  );
}
