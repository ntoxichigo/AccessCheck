"use client";"use client";

import PageLayout from "../../components/PageLayout";import PageLayout from "../../components/PageLayout";

import { motion } from "framer-motion";import { motion } from "framer-motion";

import { Shield } from "lucide-react";import { typography } from "../../lib/design-system";



export default function PrivacyPage() {export default function PrivacyPolicyPage() {

  return (  const sections = [

    <PageLayout theme="dark" containerSize="wide">    {

      <div className="max-w-4xl mx-auto">      title: "1. Information We Collect",

        <motion.div      content: [

          initial={{ opacity: 0, y: 20 }}        "When you use AccessCheck, we collect the following information:",

          animate={{ opacity: 1, y: 0 }}        "• Account Information: Name, email address, and authentication data through Clerk",

          transition={{ duration: 0.5 }}        "• Website Scan Data: URLs you submit for accessibility scanning and the results",

          className="mb-8"        "• Payment Information: Processed securely through Stripe (we don't store card details)",

        >        "• Usage Data: How you interact with our service, pages visited, and features used",

          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 mb-4">        "• Technical Data: IP address, browser type, device information, and cookies"

            Privacy Policy      ]

          </h1>    },

          <p className="text-gray-400 text-sm">Last Updated: January 2025</p>    {

        </motion.div>      title: "2. How We Use Your Information",

      content: [

        <motion.div        "We use your information to:",

          className="mb-8 p-6 rounded-xl bg-blue-900/20 border-2 border-blue-600/50"        "• Provide accessibility scanning services",

          initial={{ opacity: 0, scale: 0.95 }}        "• Process payments and manage subscriptions",

          animate={{ opacity: 1, scale: 1 }}        "• Send you scan results and important account notifications",

          transition={{ delay: 0.2, duration: 0.5 }}        "• Improve our service and develop new features",

        >        "• Comply with legal obligations and prevent fraud",

          <div className="flex gap-3">        "• Provide customer support"

            <Shield className="w-6 h-6 text-blue-400 shrink-0 mt-1" />      ]

            <div>    },

              <h2 className="text-xl font-bold text-blue-400 mb-2">Your Privacy Rights</h2>    {

              <p className="text-gray-200">      title: "3. Data Sharing and Third Parties",

                This Privacy Policy describes how AccessCheck collects, uses, and protects your personal data       content: [

                in compliance with GDPR and UK data protection laws.        "We share your data with:",

              </p>        "• Clerk: For authentication and user management",

            </div>        "• Stripe: For payment processing (PCI-DSS compliant)",

          </div>        "• Upstash Redis: For caching and rate limiting",

        </motion.div>        "• Vercel: For hosting and infrastructure",

        "We never sell your personal data to third parties."

        <motion.div      ]

          className="prose prose-invert prose-blue max-w-none"    },

          initial={{ opacity: 0 }}    {

          animate={{ opacity: 1 }}      title: "4. Data Storage and Security",

          transition={{ delay: 0.4, duration: 0.5 }}      content: [

        >        "• All data is encrypted in transit using TLS 1.3",

          <section className="mb-8">        "• Database stored in secure PostgreSQL instance",

            <h2 className="text-2xl font-bold text-white mb-4">1. Data Controller</h2>        "• Regular security audits and monitoring",

            <p className="text-gray-300">        "• Access controls and authentication required",

              AccessCheck is the data controller responsible for your personal data. For privacy questions or to exercise         "• Automatic backups and disaster recovery"

              your rights, contact us through our <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact Page</a>.      ]

            </p>    },

          </section>    {

      title: "5. Your Rights (GDPR Compliance)",

          <section className="mb-8">      content: [

            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>        "You have the right to:",

                    "• Access your personal data",

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.1 Account Information</h3>        "• Correct inaccurate data",

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">        "• Request deletion of your data",

              <li><strong>Email address</strong> - Required for account creation and login</li>        "• Export your data in a portable format",

              <li><strong>Name</strong> - Optional, provided during signup</li>        "• Object to processing of your data",

              <li><strong>Authentication data</strong> - Managed by Clerk (third-party authentication provider)</li>        "• Withdraw consent at any time",

              <li><strong>Profile photo</strong> - Optional, if provided through OAuth providers</li>        "To exercise these rights, contact us at support@accesscheck.com"

            </ul>      ]

    },

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.2 Scan Data</h3>    {

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">      title: "6. Cookies and Tracking",

              <li><strong>Website URLs</strong> - URLs you submit for accessibility scanning</li>      content: [

              <li><strong>Scan results</strong> - Accessibility issues detected by the scanner</li>        "We use cookies for:",

              <li><strong>Scan history</strong> - Date, time, and results of previous scans</li>        "• Authentication (required for login)",

              <li><strong>User preferences</strong> - Settings and configurations</li>        "• Session management",

            </ul>        "• Analytics (anonymous usage data)",

        "You can disable cookies in your browser, but some features may not work."

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.3 Payment Information</h3>      ]

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">    },

              <li><strong>Billing details</strong> - Processed and stored by Stripe (PCI-DSS compliant)</li>    {

              <li><strong>Subscription status</strong> - Active/cancelled status, renewal dates</li>      title: "7. Data Retention",

              <li><strong>Transaction history</strong> - Payment receipts and invoices</li>      content: [

            </ul>        "• Active accounts: Data retained while account is active",

            <p className="text-gray-300 mt-2 italic">        "• Deleted accounts: Personal data deleted within 30 days",

              Note: We do NOT store credit card numbers or payment details. All payment processing is handled by Stripe.        "• Scan results: Retained for 90 days unless deleted earlier",

            </p>        "• Billing records: Retained for 7 years (legal requirement)"

      ]

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.4 Usage and Technical Data</h3>    },

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">    {

              <li><strong>IP address</strong> - For security, rate limiting, and fraud prevention</li>      title: "8. Children's Privacy",

              <li><strong>Browser and device information</strong> - Type, version, operating system</li>      content: [

              <li><strong>Usage patterns</strong> - Pages visited, features used, time spent</li>        "AccessCheck is not intended for users under 18 years of age. We do not knowingly collect data from children."

              <li><strong>Cookies</strong> - For authentication, preferences, and analytics (see Section 8)</li>      ]

            </ul>    },

          </section>    {

      title: "9. International Data Transfers",

          <section className="mb-8">      content: [

            <h2 className="text-2xl font-bold text-white mb-4">3. Legal Basis for Processing (GDPR)</h2>        "Your data may be transferred to and processed in countries outside your residence. We ensure appropriate safeguards are in place through:",

            <p className="text-gray-300 mb-3">We process your data under the following legal bases:</p>        "• Standard contractual clauses",

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">        "• Privacy Shield frameworks where applicable",

              <li><strong>Contract Performance</strong> - To provide the scanning service you requested</li>        "• Vendor compliance certifications"

              <li><strong>Consent</strong> - For marketing emails and optional features (you can withdraw consent anytime)</li>      ]

              <li><strong>Legitimate Interests</strong> - To improve the service, prevent fraud, and ensure security</li>    },

              <li><strong>Legal Obligations</strong> - To comply with tax, accounting, and legal requirements</li>    {

            </ul>      title: "10. Changes to This Policy",

          </section>      content: [

        "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through our service.",

          <section className="mb-8">        "Last updated: October 10, 2025"

            <h2 className="text-2xl font-bold text-white mb-4">4. How We Use Your Data</h2>      ]

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">    },

              <li><strong>Provide Services</strong> - Perform accessibility scans, generate reports, store scan history</li>    {

              <li><strong>Account Management</strong> - Create and maintain your account, authenticate logins</li>      title: "11. Contact Us",

              <li><strong>Billing</strong> - Process payments, manage subscriptions, send receipts</li>      content: [

              <li><strong>Communications</strong> - Send scan results, account notifications, support responses</li>        "For privacy-related questions or concerns:",

              <li><strong>Service Improvement</strong> - Analyze usage patterns, develop new features, fix bugs</li>        "• Email: privacy@accesscheck.com",

              <li><strong>Security</strong> - Detect and prevent fraud, abuse, and security incidents</li>        "• Support: support@accesscheck.com",

              <li><strong>Legal Compliance</strong> - Comply with laws, respond to legal requests</li>        "• Address: [Your Company Address]"

            </ul>      ]

          </section>    }

  ];

          <section className="mb-8">

            <h2 className="text-2xl font-bold text-white mb-4">5. Data Sharing and Third Parties</h2>  return (

            <p className="text-gray-300 mb-3">We share your data only with trusted third-party service providers:</p>    <PageLayout theme="dark" containerSize="default">

                  <motion.div

            <div className="space-y-3 ml-4">        initial={{ opacity: 0, y: -20 }}

              <div>        animate={{ opacity: 1, y: 0 }}

                <h4 className="font-semibold text-white">Clerk (Authentication)</h4>        transition={{ duration: 0.6 }}

                <p className="text-gray-300 text-sm">Manages user authentication and account data. <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a></p>      >

              </div>        <h1 className={`${typography.h1} ${typography.gradient} mb-4`}>

                        Privacy Policy

              <div>        </h1>

                <h4 className="font-semibold text-white">Stripe (Payments)</h4>        <p className="text-xl text-gray-400 mb-12">

                <p className="text-gray-300 text-sm">Processes payments securely (PCI-DSS Level 1 certified). <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a></p>          Your privacy is important to us. This policy explains how we collect, use, and protect your data.

              </div>        </p>

                    </motion.div>

              <div>

                <h4 className="font-semibold text-white">Vercel (Hosting)</h4>      <div className="space-y-8">

                <p className="text-gray-300 text-sm">Hosts the application and database. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a></p>        {sections.map((section, index) => (

              </div>          <motion.div

                          key={section.title}

              <div>            initial={{ opacity: 0, y: 20 }}

                <h4 className="font-semibold text-white">Upstash Redis (Caching)</h4>            animate={{ opacity: 1, y: 0 }}

                <p className="text-gray-300 text-sm">Provides rate limiting and caching services. <a href="https://upstash.com/trust/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a></p>            transition={{ delay: index * 0.1 }}

              </div>            className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"

            </div>          >

            <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>

            <p className="text-gray-300 mt-4 font-semibold">            <div className="space-y-2">

              We do NOT sell, rent, or trade your personal data to third parties for marketing purposes.              {section.content.map((paragraph, idx) => (

            </p>                <p key={idx} className="text-gray-300 leading-relaxed">

          </section>                  {paragraph}

                </p>

          <section className="mb-8">              ))}

            <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>            </div>

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">          </motion.div>

              <li><strong>Account Data</strong> - Retained while your account is active, plus 30 days after deletion</li>        ))}

              <li><strong>Scan History</strong> - Retained for 12 months (or longer if you have an active Pro subscription)</li>      </div>

              <li><strong>Payment Records</strong> - Retained for 7 years for tax and accounting compliance</li>

              <li><strong>Logs and Analytics</strong> - Retained for 90 days for security and troubleshooting</li>      <motion.div

            </ul>        initial={{ opacity: 0 }}

            <p className="text-gray-300 mt-3">        animate={{ opacity: 1 }}

              You can request deletion of your data at any time (subject to legal retention requirements).        transition={{ delay: 0.8 }}

            </p>        className="mt-12 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl"

          </section>      >

        <h3 className="text-xl font-bold text-blue-300 mb-2">🔒 Your Data is Safe</h3>

          <section className="mb-8">        <p className="text-gray-300">

            <h2 className="text-2xl font-bold text-white mb-4">7. Data Security</h2>          We are committed to protecting your privacy and ensuring transparency in how we handle your data. 

            <p className="text-gray-300 mb-3">We implement industry-standard security measures:</p>          If you have any questions, please don&apos;t hesitate to contact us.

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">        </p>

              <li><strong>Encryption</strong> - TLS 1.3 for data in transit, AES-256 for data at rest</li>      </motion.div>

              <li><strong>Access Controls</strong> - Role-based permissions, multi-factor authentication</li>    </PageLayout>

              <li><strong>Monitoring</strong> - 24/7 security monitoring and incident response</li>  );

              <li><strong>Regular Audits</strong> - Security assessments and vulnerability scanning</li>}

              <li><strong>Data Backups</strong> - Automated daily backups with disaster recovery</li>
            </ul>
            <p className="text-gray-300 mt-3 text-sm italic">
              Note: While we implement strong security measures, no system is 100% secure. Use strong passwords and enable 2FA.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-300 mb-3">We use the following types of cookies:</p>
            
            <div className="space-y-3 ml-4">
              <div>
                <h4 className="font-semibold text-white">Essential Cookies (Required)</h4>
                <p className="text-gray-300 text-sm">Authentication, session management, security. Cannot be disabled.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white">Functional Cookies (Optional)</h4>
                <p className="text-gray-300 text-sm">Remember preferences and settings. Can be disabled in Settings.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white">Analytics Cookies (Optional)</h4>
                <p className="text-gray-300 text-sm">Understand usage patterns to improve the service. Can be disabled.</p>
              </div>
            </div>

            <p className="text-gray-300 mt-3">
              You can manage cookie preferences in your browser settings or through our cookie consent banner.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Your GDPR Rights</h2>
            <p className="text-gray-300 mb-3">Under GDPR and UK data protection laws, you have the following rights:</p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li><strong>Right to Access</strong> - Request a copy of your personal data</li>
              <li><strong>Right to Rectification</strong> - Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;)</strong> - Delete your account and data</li>
              <li><strong>Right to Restriction</strong> - Limit how we process your data</li>
              <li><strong>Right to Data Portability</strong> - Receive your data in a machine-readable format</li>
              <li><strong>Right to Object</strong> - Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent</strong> - Unsubscribe from marketing emails anytime</li>
              <li><strong>Right to Lodge a Complaint</strong> - File a complaint with the ICO (UK) or your local data protection authority</li>
            </ul>

            <p className="text-gray-300 mt-4">
              To exercise these rights, contact us through the <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact Page</a> or 
              email us directly. We will respond within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
            <p className="text-gray-300">
              Your data may be processed in countries outside the UK/EEA (e.g., United States for Stripe and Clerk). 
              We ensure adequate safeguards through:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mt-2">
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Adequacy decisions for certain countries</li>
              <li>Privacy Shield frameworks (where applicable)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Children&apos;s Privacy</h2>
            <p className="text-gray-300">
              AccessCheck is not intended for children under 18. We do not knowingly collect data from children. 
              If you believe we have collected data from a child, contact us immediately for deletion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">12. Marketing Communications</h2>
            <p className="text-gray-300">
              We may send you:</
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mt-2">
              <li><strong>Transactional Emails</strong> - Scan results, receipts, security alerts (cannot opt out)</li>
              <li><strong>Marketing Emails</strong> - Product updates, tips, promotions (opt-out anytime via unsubscribe link)</li>
            </ul>
            <p className="text-gray-300 mt-3">
              Manage email preferences in <a href="/settings" className="text-blue-400 hover:text-blue-300 underline">Settings</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">13. Changes to Privacy Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy periodically. Material changes will be communicated via email and/or prominent notice 
              in the Service. Continued use after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">14. Contact and Data Protection Officer</h2>
            <p className="text-gray-300">
              For privacy questions, data requests, or to exercise your rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mt-2">
              <li><a href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact Page</a></li>
              <li>Email: privacy@accesscheck.app (if configured)</li>
            </ul>
            <p className="text-gray-300 mt-3">
              UK Data Protection Authority: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Information Commissioner&apos;s Office (ICO)</a>
            </p>
          </section>

          <section className="mb-8 p-6 rounded-xl bg-blue-900/20 border-2 border-blue-600/50">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Summary</h2>
            <p className="text-gray-200">
              We respect your privacy and are committed to protecting your personal data. We collect only what&apos;s necessary 
              to provide our service, use industry-standard security measures, and give you full control over your data. 
              You can request access, correction, or deletion of your data at any time.
            </p>
          </section>
        </motion.div>
      </div>
    </PageLayout>
  );
}
