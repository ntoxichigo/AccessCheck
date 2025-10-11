"use client";"use client";"use client";

import PageLayout from "../../components/PageLayout";

import { motion } from "framer-motion";import PageLayout from "../../components/PageLayout";import PageLayout from "../../components/PageLayout";

import { AlertTriangle } from "lucide-react";

import { motion } from "framer-motion";import { motion } from "framer-motion";

export default function TermsPage() {

  return (import { AlertTriangle } from "lucide-react";import { typography } from "../../lib/design-system";

    <PageLayout theme="dark" containerSize="wide">

      <div className="max-w-4xl mx-auto">import Link from "next/link";

        <motion.div

          initial={{ opacity: 0, y: 20 }}export default function TermsPage() {

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.5 }}  return (export default function TermsOfServicePage() {

          className="mb-8"

        >    <PageLayout theme="dark" containerSize="wide">  const sections = [

          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 mb-4">

            Terms of Service      <div className="max-w-4xl mx-auto">    {

          </h1>

          <p className="text-gray-400 text-sm">Last Updated: October 2025</p>        <motion.div      title: "1. Acceptance of Terms",

        </motion.div>

          initial={{ opacity: 0, y: 20 }}      content: [

        {/* Critical Disclaimer */}

        <motion.div          animate={{ opacity: 1, y: 0 }}        "By accessing or using AccessCheck, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service."

          className="mb-8 p-6 rounded-xl bg-yellow-900/20 border-2 border-yellow-600/50"

          initial={{ opacity: 0, scale: 0.95 }}          transition={{ duration: 0.5 }}      ]

          animate={{ opacity: 1, scale: 1 }}

          transition={{ delay: 0.2, duration: 0.5 }}          className="mb-8"    },

        >

          <div className="flex gap-3">        >    {

            <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />

            <div>          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 mb-4">      title: "2. Description of Service",

              <h2 className="text-xl font-bold text-yellow-400 mb-3">IMPORTANT LEGAL NOTICE</h2>

              <div className="space-y-2 text-gray-200">            Terms of Service      content: [

                <p>By using AccessCheck, you explicitly acknowledge and agree that:</p>

                <ul className="list-disc list-inside space-y-1 ml-4">          </h1>        "AccessCheck provides automated web accessibility scanning services that:",

                  <li>This service is provided <strong>AS-IS</strong> with <strong>NO WARRANTIES</strong> of any kind</li>

                  <li>You assume <strong>ALL RISK</strong> for use of this service</li>          <p className="text-gray-400 text-sm">Last Updated: January 2025</p>        "• Analyze websites for WCAG 2.1 compliance",

                  <li>We are <strong>NOT LIABLE</strong> for any compliance failures, legal issues, or damages</li>

                  <li>This tool <strong>DOES NOT GUARANTEE</strong> legal compliance with any accessibility laws</li>        </motion.div>        "• Generate detailed accessibility reports",

                  <li>Manual review by qualified accessibility experts is <strong>REQUIRED</strong></li>

                </ul>        "• Identify issues and provide remediation guidance",

              </div>

            </div>        {/* Critical Disclaimer */}        "• Export results in JSON and CSV formats"

          </div>

        </motion.div>        <motion.div      ]



        <motion.div          className="mb-8 p-6 rounded-xl bg-yellow-900/20 border-2 border-yellow-600/50"    },

          className="prose prose-invert prose-blue max-w-none"

          initial={{ opacity: 0 }}          initial={{ opacity: 0, scale: 0.95 }}    {

          animate={{ opacity: 1 }}

          transition={{ delay: 0.4, duration: 0.5 }}          animate={{ opacity: 1, scale: 1 }}      title: "3. Account Registration",

        >

          <section className="mb-8">          transition={{ delay: 0.2, duration: 0.5 }}      content: [

            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>

            <p className="text-gray-300">        >        "To use AccessCheck, you must:",

              By accessing or using AccessCheck (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). 

              If you do not agree to these Terms, do not use the Service.          <div className="flex gap-3">        "• Be at least 18 years of age",

            </p>

          </section>            <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />        "• Provide accurate and complete registration information",



          <section className="mb-8">            <div>        "• Maintain the security of your account credentials",

            <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>

            <p className="text-gray-300 mb-3">              <h2 className="text-xl font-bold text-yellow-400 mb-3">IMPORTANT LEGAL NOTICE</h2>        "• Notify us immediately of any unauthorized access",

              AccessCheck is an automated web accessibility scanning platform powered by the open-source{" "}

              <a href="https://github.com/dequelabs/axe-core" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">              <div className="space-y-2 text-gray-200">        "You are responsible for all activities under your account."

                axe-core

              </a> testing engine developed by Deque Systems.                <p>By using AccessCheck, you explicitly acknowledge and agree that:</p>      ]

            </p>

            <p className="text-gray-300 mb-3">                <ul className="list-disc list-inside space-y-1 ml-4">    },

              <strong className="text-white">The Service:</strong>

            </p>                  <li>This service is provided <strong>AS-IS</strong> with <strong>NO WARRANTIES</strong> of any kind</li>    {

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">

              <li>Performs automated accessibility scans of websites</li>                  <li>You assume <strong>ALL RISK</strong> for use of this service</li>      title: "4. Subscription Plans and Billing",

              <li>Generates reports identifying potential accessibility issues</li>

              <li>Provides recommendations for remediation</li>                  <li>We are <strong>NOT LIABLE</strong> for any compliance failures, legal issues, or damages</li>      content: [

              <li>Offers historical tracking of scan results (Pro plan)</li>

              <li>Allows export of reports in various formats (Pro plan)</li>                  <li>This tool <strong>DOES NOT GUARANTEE</strong> legal compliance with any accessibility laws</li>        "Free Plan:",

            </ul>

            <p className="text-gray-300 mt-3">                  <li>Manual review by qualified accessibility experts is <strong>REQUIRED</strong></li>        "• 5 scans per month",

              <strong className="text-yellow-400">IMPORTANT:</strong> Automated tools can only detect approximately 30-50% of accessibility issues. 

              Manual testing by qualified accessibility professionals is essential for comprehensive compliance.                </ul>        "• Basic accessibility reports",

            </p>

          </section>              </div>        "• Email support",



          <section className="mb-8">            </div>        "",

            <h2 className="text-2xl font-bold text-white mb-4">3. No Warranties - AS-IS Service</h2>

            <p className="text-gray-300 mb-3">          </div>        "Professional Plan ($29/month):",

              THE SERVICE IS PROVIDED &quot;AS-IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:

            </p>        </motion.div>        "• Unlimited scans",

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">

              <li>NO WARRANTY of merchantability or fitness for a particular purpose</li>        "• Detailed reports with remediation tips",

              <li>NO WARRANTY of accuracy, reliability, or completeness of results</li>

              <li>NO WARRANTY of uninterrupted or error-free service</li>        <motion.div        "• Priority support",

              <li>NO WARRANTY that the Service will detect all accessibility issues</li>

              <li>NO WARRANTY of legal compliance with ADA, WCAG, Section 508, or any accessibility laws</li>          className="prose prose-invert prose-blue max-w-none"        "• API access",

              <li>NO WARRANTY that using the Service will prevent legal claims or lawsuits</li>

            </ul>          initial={{ opacity: 0 }}        "",

          </section>

          animate={{ opacity: 1 }}        "Billing:",

          <section className="mb-8">

            <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>          transition={{ delay: 0.4, duration: 0.5 }}        "• Subscriptions auto-renew monthly",

            <p className="text-gray-300 mb-3">

              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ACCESSCHECK AND ITS OPERATORS SHALL NOT BE LIABLE FOR:        >        "• Payment processed through Stripe",

            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">          <section className="mb-8">        "• Prices in USD, taxes may apply",

              <li>Any legal claims, lawsuits, or penalties related to accessibility compliance</li>

              <li>Damages resulting from reliance on scan results</li>            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>        "• Refunds available within 14 days (see Refund Policy)"

              <li>Lost profits, revenue, data, or business opportunities</li>

              <li>Indirect, incidental, consequential, or punitive damages</li>            <p className="text-gray-300">      ]

              <li>Failures to detect accessibility issues or false positives</li>

              <li>Any claims exceeding the lesser of: (a) the total amount you paid to us in the 12 months immediately preceding the claim, or (b) £100 GBP</li>              By accessing or using AccessCheck (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;).     },

            </ul>

            <p className="text-gray-300 mt-3">              If you do not agree to these Terms, do not use the Service.    {

              <strong className="text-white">Liability Cap Clarification:</strong> For free plan users who have paid £0, the maximum liability is capped at £100 GBP. 

              For paid subscribers, liability is capped at whichever is <em>lesser</em>: your total subscription payments in the preceding 12 months, or £100 GBP.            </p>      title: "5. Refund Policy",

            </p>

            <p className="text-gray-300 mt-3">          </section>      content: [

              You acknowledge that automated accessibility testing has inherent limitations and that you assume all risk associated with using the Service.

            </p>        "We offer a 14-day money-back guarantee:",

          </section>

          <section className="mb-8">        "• Available for new Professional subscriptions only",

          <section className="mb-8">

            <h2 className="text-2xl font-bold text-white mb-4">5. User Responsibilities</h2>            <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>        "• Must request refund within 14 days of purchase",

            <p className="text-gray-300 mb-3">You agree to:</p>

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">            <p className="text-gray-300 mb-3">        "• Contact support@accesscheck.com to process",

              <li>Use the Service only for lawful purposes</li>

              <li>Only scan websites you own or have explicit permission to scan</li>              AccessCheck is an automated web accessibility scanning platform powered by the open-source{" "}        "• Refunds processed within 5-10 business days",

              <li>Not use the Service to scan malicious, illegal, or harmful websites</li>

              <li>Not attempt to reverse engineer, exploit, or abuse the Service</li>              <a href="https://github.com/dequelabs/axe-core" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">        "• Free plan users are not eligible for refunds",

              <li>Verify all scan results with manual testing by qualified professionals</li>

              <li>Not rely solely on automated scan results for legal compliance</li>                axe-core        "• Enterprise plans have custom refund terms"

              <li>Maintain the confidentiality of your account credentials</li>

              <li>Comply with all applicable laws and regulations</li>              </a> testing engine developed by Deque Systems.      ]

            </ul>

          </section>            </p>    },



          <section className="mb-8">            <p className="text-gray-300 mb-3">    {

            <h2 className="text-2xl font-bold text-white mb-4">6. No Legal Advice or Certification</h2>

            <p className="text-gray-300 mb-3">              <strong className="text-white">The Service:</strong>      title: "6. Acceptable Use Policy",

              <strong className="text-white">AccessCheck does NOT provide:</strong>

            </p>            </p>      content: [

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">

              <li>Legal advice or legal opinions</li>            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">        "You agree NOT to:",

              <li>Compliance certification or attestation</li>

              <li>Guarantee of conformance to WCAG, ADA, Section 508, or any standards</li>              <li>Performs automated accessibility scans of websites</li>        "• Scan websites without proper authorization",

              <li>Professional accessibility consulting services</li>

            </ul>              <li>Generates reports identifying potential accessibility issues</li>        "• Use the service for illegal or malicious purposes",

            <p className="text-gray-300 mt-3">

              You should consult with qualified legal and accessibility professionals for compliance guidance.              <li>Provides recommendations for remediation</li>        "• Attempt to bypass rate limits or security measures",

            </p>

          </section>              <li>Offers historical tracking of scan results (Pro plan)</li>        "• Reverse engineer or copy our technology",



          <section className="mb-8">              <li>Allows export of reports in various formats (Pro plan)</li>        "• Share your account credentials with others",

            <h2 className="text-2xl font-bold text-white mb-4">7. Subscription and Billing</h2>

            <p className="text-gray-300 mb-3">            </ul>        "• Use automated tools to create multiple accounts",

              <strong className="text-white">Free Plan:</strong> Limited scans with basic features.

            </p>            <p className="text-gray-300 mt-3">        "• Resell or redistribute our service without permission",

            <p className="text-gray-300 mb-3">

              <strong className="text-white">Pro Plan:</strong> Subscription-based access to advanced features including unlimited scans, exports, and historical tracking.              <strong className="text-yellow-400">IMPORTANT:</strong> Automated tools can only detect approximately 30-50% of accessibility issues.         "",

            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">              Manual testing by qualified accessibility professionals is essential for comprehensive compliance.        "Violation may result in account suspension or termination."

              <li>Subscriptions are billed monthly via Stripe</li>

              <li>You may cancel your subscription at any time</li>            </p>      ]

              <li>No refunds for partial months or unused scans</li>

              <li>We may change pricing with 30 days notice to existing subscribers</li>          </section>    },

            </ul>

          </section>    {



          <section className="mb-8">          <section className="mb-8">      title: "7. Service Availability",

            <h2 className="text-2xl font-bold text-white mb-4">8. Intellectual Property</h2>

            <p className="text-gray-300 mb-3">            <h2 className="text-2xl font-bold text-white mb-4">3. No Warranties - AS-IS Service</h2>      content: [

              The Service uses <strong>axe-core</strong>, an open-source accessibility testing engine licensed under the{" "}

              <a href="https://www.mozilla.org/en-US/MPL/2.0/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">            <p className="text-gray-300 mb-3">        "We strive for 99.9% uptime, but:",

                Mozilla Public License 2.0

              </a>. axe-core is © Deque Systems, Inc. All rights reserved.              THE SERVICE IS PROVIDED &quot;AS-IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:        "• Service may be temporarily unavailable for maintenance",

            </p>

            <p className="text-gray-300 mb-3">            </p>        "• We are not liable for downtime or data loss",

              All other content, trademarks, and intellectual property in the Service remain the property of AccessCheck or their respective owners.

            </p>            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">        "• Professional users receive priority support during outages",

          </section>

              <li>NO WARRANTY of merchantability or fitness for a particular purpose</li>        "• Status updates available at status.accesscheck.com"

          <section className="mb-8">

            <h2 className="text-2xl font-bold text-white mb-4">9. Privacy and Data</h2>              <li>NO WARRANTY of accuracy, reliability, or completeness of results</li>      ]

            <p className="text-gray-300">

              Your use of the Service is also governed by our{" "}              <li>NO WARRANTY of uninterrupted or error-free service</li>    },

              <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>, 

              which describes how we collect, use, and protect your data.              <li>NO WARRANTY that the Service will detect all accessibility issues</li>    {

            </p>

          </section>              <li>NO WARRANTY of legal compliance with ADA, WCAG, Section 508, or any accessibility laws</li>      title: "8. Data Ownership and Usage",



          <section className="mb-8">              <li>NO WARRANTY that using the Service will prevent legal claims or lawsuits</li>      content: [

            <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>

            <p className="text-gray-300">            </ul>        "• You own all scan results and reports you generate",

              You agree to indemnify and hold harmless AccessCheck, its operators, and affiliates from any claims, damages, losses, or expenses 

              (including legal fees) arising from:          </section>        "• We may use anonymized data to improve our service",

            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mt-2">        "• Scan results are retained for 90 days",

              <li>Your use or misuse of the Service</li>

              <li>Your violation of these Terms</li>          <section className="mb-8">        "• You can export or delete your data anytime",

              <li>Your violation of any laws or third-party rights</li>

              <li>Any accessibility compliance claims related to your website</li>            <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>        "• See our Privacy Policy for detailed data practices"

            </ul>

          </section>            <p className="text-gray-300 mb-3">      ]



          <section className="mb-8">              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ACCESSCHECK AND ITS OPERATORS SHALL NOT BE LIABLE FOR:    },

            <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>

            <p className="text-gray-300">            </p>    {

              We reserve the right to suspend or terminate your access to the Service at any time, for any reason, including:

            </p>            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">      title: "9. Intellectual Property",

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mt-2">

              <li>Violation of these Terms</li>              <li>Any legal claims, lawsuits, or penalties related to accessibility compliance</li>      content: [

              <li>Fraudulent or abusive activity</li>

              <li>Non-payment of subscription fees</li>              <li>Damages resulting from reliance on scan results</li>        "AccessCheck and all related technology are owned by us and protected by:",

              <li>At our sole discretion without cause</li>

            </ul>              <li>Lost profits, revenue, data, or business opportunities</li>        "• Copyright laws",

          </section>

              <li>Indirect, incidental, consequential, or punitive damages</li>        "• Trademark laws",

          <section className="mb-8">

            <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>              <li>Failures to detect accessibility issues or false positives</li>        "• Trade secret laws",

            <p className="text-gray-300">

              We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the modified Terms.               <li>Any claims exceeding the amount paid by you in the last 12 months (or $100 if greater)</li>        "",

              Material changes will be communicated via email or prominent notice in the Service.

            </p>            </ul>        "You may not copy, modify, or distribute our software without permission."

          </section>

            <p className="text-gray-300 mt-3">      ]

          <section className="mb-8">

            <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>              You acknowledge that automated accessibility testing has inherent limitations and that you assume all risk associated with using the Service.    },

            <p className="text-gray-300">

              These Terms are governed by the laws of the United Kingdom. Any disputes shall be resolved in the courts of England and Wales.            </p>    {

            </p>

          </section>          </section>      title: "10. Limitation of Liability",



          <section className="mb-8">      content: [

            <h2 className="text-2xl font-bold text-white mb-4">14. Contact</h2>

            <p className="text-gray-300">          <section className="mb-8">        "TO THE MAXIMUM EXTENT PERMITTED BY LAW:",

              For questions about these Terms, contact us at:{" "}

              <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">            <h2 className="text-2xl font-bold text-white mb-4">5. User Responsibilities</h2>        "",

                Contact Page

              </a>            <p className="text-gray-300 mb-3">You agree to:</p>        "• AccessCheck is provided \"AS IS\" without warranties",

            </p>

          </section>            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">        "• We are not liable for indirect, incidental, or consequential damages",



          <section className="mb-8 p-6 rounded-xl bg-red-900/20 border-2 border-red-600/50">              <li>Use the Service only for lawful purposes</li>        "• Our total liability is limited to the amount you paid in the last 12 months",

            <h2 className="text-2xl font-bold text-red-400 mb-4">FINAL ACKNOWLEDGMENT</h2>

            <p className="text-gray-200 font-semibold">              <li>Only scan websites you own or have explicit permission to scan</li>        "• We do not guarantee scan accuracy or WCAG compliance certification",

              By using AccessCheck, you explicitly acknowledge that:

            </p>              <li>Not use the Service to scan malicious, illegal, or harmful websites</li>        "• You are responsible for implementing accessibility fixes",

            <ul className="list-disc list-inside space-y-2 text-gray-200 mt-3 ml-4">

              <li>You have read and understood these Terms</li>              <li>Not attempt to reverse engineer, exploit, or abuse the Service</li>        "",

              <li>You accept all risks associated with using an automated accessibility scanner</li>

              <li>You will not hold AccessCheck liable for any compliance failures or legal issues</li>              <li>Verify all scan results with manual testing by qualified professionals</li>        "Our scans provide guidance, not legal compliance certification."

              <li>You understand this Service does NOT guarantee legal compliance</li>

              <li>You will conduct manual testing and consult qualified professionals</li>              <li>Not rely solely on automated scan results for legal compliance</li>      ]

            </ul>

          </section>              <li>Maintain the confidentiality of your account credentials</li>    },

        </motion.div>

      </div>              <li>Comply with all applicable laws and regulations</li>    {

    </PageLayout>

  );            </ul>      title: "11. Indemnification",

}

          </section>      content: [

        "You agree to indemnify and hold harmless AccessCheck from any claims arising from:",

          <section className="mb-8">        "• Your use of the service",

            <h2 className="text-2xl font-bold text-white mb-4">6. No Legal Advice or Certification</h2>        "• Violation of these terms",

            <p className="text-gray-300 mb-3">        "• Infringement of third-party rights",

              <strong className="text-white">AccessCheck does NOT provide:</strong>        "• Scanning websites without authorization"

            </p>      ]

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">    },

              <li>Legal advice or legal opinions</li>    {

              <li>Compliance certification or attestation</li>      title: "12. Termination",

              <li>Guarantee of conformance to WCAG, ADA, Section 508, or any standards</li>      content: [

              <li>Professional accessibility consulting services</li>        "Either party may terminate the agreement:",

            </ul>        "",

            <p className="text-gray-300 mt-3">        "You can:",

              You should consult with qualified legal and accessibility professionals for compliance guidance.        "• Cancel your subscription anytime from Settings",

            </p>        "• Delete your account and all associated data",

          </section>        "",

        "We may:",

          <section className="mb-8">        "• Suspend or terminate accounts for Terms violations",

            <h2 className="text-2xl font-bold text-white mb-4">7. Subscription and Billing</h2>        "• Discontinue the service with 30 days notice",

            <p className="text-gray-300 mb-3">        "• Modify pricing with 30 days notice to existing users"

              <strong className="text-white">Free Plan:</strong> Limited scans with basic features.      ]

            </p>    },

            <p className="text-gray-300 mb-3">    {

              <strong className="text-white">Pro Plan:</strong> Subscription-based access to advanced features including unlimited scans, exports, and historical tracking.      title: "13. API Terms (Professional & Enterprise)",

            </p>      content: [

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">        "If you use our API:",

              <li>Subscriptions are billed monthly via Stripe</li>        "• Rate limits apply per plan tier",

              <li>You may cancel your subscription at any time</li>        "• API keys must be kept secure",

              <li>No refunds for partial months or unused scans</li>        "• Usage must comply with these Terms",

              <li>We may change pricing with 30 days notice to existing subscribers</li>        "• API documentation at docs.accesscheck.com",

            </ul>        "• Breaking changes announced 60 days in advance"

          </section>      ]

    },

          <section className="mb-8">    {

            <h2 className="text-2xl font-bold text-white mb-4">8. Intellectual Property</h2>      title: "14. Modifications to Terms",

            <p className="text-gray-300 mb-3">      content: [

              The Service uses <strong>axe-core</strong>, an open-source accessibility testing engine licensed under the{" "}        "We may update these Terms from time to time:",

              <a href="https://www.mozilla.org/en-US/MPL/2.0/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">        "• Material changes will be notified via email",

                Mozilla Public License 2.0        "• Continued use constitutes acceptance",

              </a>. axe-core is © Deque Systems, Inc. All rights reserved.        "• Previous versions available upon request",

            </p>        "",

            <p className="text-gray-300 mb-3">        "Last updated: October 10, 2025"

              All other content, trademarks, and intellectual property in the Service remain the property of AccessCheck or their respective owners.      ]

            </p>    },

          </section>    {

      title: "15. Governing Law",

          <section className="mb-8">      content: [

            <h2 className="text-2xl font-bold text-white mb-4">9. Privacy and Data</h2>        "These Terms are governed by the laws of [Your Jurisdiction].",

            <p className="text-gray-300">        "Any disputes will be resolved in the courts of [Your Jurisdiction].",

              Your use of the Service is also governed by our{" "}        "For EU users, EU consumer protection laws apply."

              <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>,       ]

              which describes how we collect, use, and protect your data.    },

            </p>    {

          </section>      title: "16. Contact Information",

      content: [

          <section className="mb-8">        "Questions about these Terms?",

            <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>        "• Email: legal@accesscheck.com",

            <p className="text-gray-300">        "• Support: support@accesscheck.com",

              You agree to indemnify and hold harmless AccessCheck, its operators, and affiliates from any claims, damages, losses, or expenses         "• Address: [Your Company Address]"

              (including legal fees) arising from:      ]

            </p>    }

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mt-2">  ];

              <li>Your use or misuse of the Service</li>

              <li>Your violation of these Terms</li>  return (

              <li>Your violation of any laws or third-party rights</li>    <PageLayout theme="dark" containerSize="default">

              <li>Any accessibility compliance claims related to your website</li>      <motion.div

            </ul>        initial={{ opacity: 0, y: -20 }}

          </section>        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.6 }}

          <section className="mb-8">      >

            <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>        <h1 className={`${typography.h1} ${typography.gradient} mb-4`}>

            <p className="text-gray-300">          Terms of Service

              We reserve the right to suspend or terminate your access to the Service at any time, for any reason, including:        </h1>

            </p>        <p className="text-xl text-gray-400 mb-12">

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mt-2">          Please read these terms carefully before using AccessCheck. By using our service, you agree to these terms.

              <li>Violation of these Terms</li>        </p>

              <li>Fraudulent or abusive activity</li>      </motion.div>

              <li>Non-payment of subscription fees</li>

              <li>At our sole discretion without cause</li>      <div className="space-y-8">

            </ul>        {sections.map((section, index) => (

          </section>          <motion.div

            key={section.title}

          <section className="mb-8">            initial={{ opacity: 0, y: 20 }}

            <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>            animate={{ opacity: 1, y: 0 }}

            <p className="text-gray-300">            transition={{ delay: index * 0.05 }}

              We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the modified Terms.             className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"

              Material changes will be communicated via email or prominent notice in the Service.          >

            </p>            <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>

          </section>            <div className="space-y-2">

              {section.content.map((paragraph, idx) => (

          <section className="mb-8">                <p key={idx} className={`text-gray-300 leading-relaxed ${paragraph === '' ? 'h-2' : ''}`}>

            <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>                  {paragraph}

            <p className="text-gray-300">                </p>

              These Terms are governed by the laws of the United Kingdom. Any disputes shall be resolved in the courts of England and Wales.              ))}

            </p>            </div>

          </section>          </motion.div>

        ))}

          <section className="mb-8">      </div>

            <h2 className="text-2xl font-bold text-white mb-4">14. Contact</h2>

            <p className="text-gray-300">      <motion.div

              For questions about these Terms, contact us at:{" "}        initial={{ opacity: 0 }}

              <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">        animate={{ opacity: 1 }}

                Contact Page        transition={{ delay: 0.8 }}

              </a>        className="mt-12 grid md:grid-cols-2 gap-6"

            </p>      >

          </section>        <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">

          <h3 className="text-xl font-bold text-green-300 mb-2">✅ 14-Day Money-Back Guarantee</h3>

          <section className="mb-8 p-6 rounded-xl bg-red-900/20 border-2 border-red-600/50">          <p className="text-gray-300">

            <h2 className="text-2xl font-bold text-red-400 mb-4">FINAL ACKNOWLEDGMENT</h2>            Try AccessCheck risk-free. If you&apos;re not satisfied, we&apos;ll refund your first payment.

            <p className="text-gray-200 font-semibold">          </p>

              By using AccessCheck, you explicitly acknowledge that:        </div>

            </p>        

            <ul className="list-disc list-inside space-y-2 text-gray-200 mt-3 ml-4">        <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">

              <li>You have read and understood these Terms</li>          <h3 className="text-xl font-bold text-purple-300 mb-2">📄 Questions?</h3>

              <li>You accept all risks associated with using an automated accessibility scanner</li>          <p className="text-gray-300">

              <li>You will not hold AccessCheck liable for any compliance failures or legal issues</li>            Need clarification on any terms? <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact our team</Link> - we&apos;re happy to help!

              <li>You understand this Service does NOT guarantee legal compliance</li>          </p>

              <li>You will conduct manual testing and consult qualified professionals</li>        </div>

            </ul>      </motion.div>

          </section>

        </motion.div>      <motion.div

      </div>        initial={{ opacity: 0 }}

    </PageLayout>        animate={{ opacity: 1 }}

  );        transition={{ delay: 1 }}

}        className="mt-6 text-center text-gray-500 text-sm"

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
