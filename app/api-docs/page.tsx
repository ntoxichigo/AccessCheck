"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import NavBar from "../../components/NavBar";
import { LegalFooter } from "../../components/legal/LegalFooter";
import { Code, Copy, Check, Terminal, Key, BookOpen, Zap, Shield, ArrowRight } from "lucide-react";

export default function APIDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/scan",
      title: "Scan URL",
      description: "Performs a comprehensive accessibility scan on a given URL",
      auth: true,
      params: [
        { name: "url", type: "string", required: true, description: "The URL to scan (must be publicly accessible)" },
        { name: "standard", type: "string", required: false, description: "WCAG standard to test against (default: 'wcag2aa')" },
      ],
      response: `{
  "success": true,
  "scanId": "scan_abc123",
  "url": "https://example.com",
  "violations": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "description": "Elements must have sufficient color contrast",
      "nodes": [...]
    }
  ],
  "passes": 45,
  "incomplete": 2,
  "timestamp": "2025-10-15T12:00:00Z"
}`,
      example: `curl -X POST https://accesscheck.app/api/v1/scan \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "standard": "wcag2aa"
  }'`
    },
    {
      method: "GET",
      path: "/api/v1/scan/:scanId",
      title: "Get Scan Results",
      description: "Retrieves the results of a previously completed scan",
      auth: true,
      params: [
        { name: "scanId", type: "string", required: true, description: "The unique identifier of the scan" },
      ],
      response: `{
  "success": true,
  "scanId": "scan_abc123",
  "status": "completed",
  "url": "https://example.com",
  "violations": [...],
  "passes": 45,
  "incomplete": 2,
  "createdAt": "2025-10-15T12:00:00Z",
  "completedAt": "2025-10-15T12:00:15Z"
}`,
      example: `curl -X GET https://accesscheck.app/api/v1/scan/scan_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`
    },
    {
      method: "POST",
      path: "/api/v1/scheduled-scans",
      title: "Create Scheduled Scan",
      description: "Sets up automated recurring scans for a URL",
      auth: true,
      params: [
        { name: "url", type: "string", required: true, description: "The URL to monitor" },
        { name: "frequency", type: "string", required: true, description: "Scan frequency: 'daily', 'weekly', or 'monthly'" },
        { name: "notifyEmail", type: "boolean", required: false, description: "Send email notifications on issues (default: true)" },
      ],
      response: `{
  "success": true,
  "scheduledScanId": "sched_xyz789",
  "url": "https://example.com",
  "frequency": "daily",
  "nextScan": "2025-10-16T12:00:00Z",
  "status": "active"
}`,
      example: `curl -X POST https://accesscheck.app/api/v1/scheduled-scans \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "frequency": "daily",
    "notifyEmail": true
  }'`
    },
    {
      method: "GET",
      path: "/api/v1/user/usage",
      title: "Get Usage Statistics",
      description: "Retrieves your current API usage and limits",
      auth: true,
      params: [],
      response: `{
  "success": true,
  "plan": "pro",
  "scansUsed": 245,
  "scansLimit": 10000,
  "resetDate": "2025-11-01T00:00:00Z",
  "apiKeyStatus": "active"
}`,
      example: `curl -X GET https://accesscheck.app/api/v1/user/usage \\
  -H "Authorization: Bearer YOUR_API_KEY"`
    }
  ];

  const quickStart = `# Install via npm (optional helper)
npm install @accesscheck/sdk

# Or use direct API calls
const response = await fetch('https://accesscheck.app/api/v1/scan', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://your-website.com'
  })
});

const data = await response.json();
console.log(\`Found \${data.violations.length} accessibility issues\`);`;

  return (
    <>
      <NavBar />
      <main className="relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 mb-6">
                <Code className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">REST API v1</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                Accessibility API
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Developer Documentation
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Integrate WCAG compliance testing into your CI/CD pipeline. Automate accessibility scans with our powerful REST API.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="#quick-start" className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Start
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="/settings?tab=api" className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold border-2 border-gray-200 hover:border-blue-600 transition-all flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Get API Key
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100"
              >
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Reliable</h3>
                <p className="text-gray-600">
                  Enterprise-grade security with rate limiting and API key authentication.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100"
              >
                <Zap className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">
                  Complete accessibility scans in under 60 seconds with detailed results.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100"
              >
                <BookOpen className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Well Documented</h3>
                <p className="text-gray-600">
                  Clear examples and comprehensive guides to get you started quickly.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quick-start" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Terminal className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">Quick Start</h2>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 relative overflow-hidden">
                <button
                  onClick={() => copyToClipboard(quickStart, 'quickstart')}
                  className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy code"
                >
                  {copiedCode === 'quickstart' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <pre className="text-sm text-gray-100 overflow-x-auto">
                  <code>{quickStart}</code>
                </pre>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong className="font-semibold">💡 Pro Tip:</strong> Get your API key from{" "}
                  <a href="/settings?tab=api" className="underline font-semibold hover:text-blue-700">
                    Settings → API Keys
                  </a>{" "}
                  and start scanning immediately!
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Authentication */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Key className="w-8 h-8 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900">Authentication</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-6">
                  All API requests require authentication using a Bearer token in the Authorization header.
                </p>
                
                <div className="bg-gray-900 rounded-xl p-6 relative">
                  <button
                    onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth')}
                    className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copiedCode === 'auth' ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <pre className="text-sm text-gray-100">
                    <code>Authorization: Bearer YOUR_API_KEY</code>
                  </pre>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-900 mb-2">✅ Correct</p>
                    <code className="text-xs text-green-800">Bearer sk_live_abc123...</code>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-semibold text-red-900 mb-2">❌ Incorrect</p>
                    <code className="text-xs text-red-800">sk_live_abc123... (missing &quot;Bearer&quot;)</code>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Code className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">API Endpoints</h2>
              </div>

              <div className="space-y-8">
                {endpoints.map((endpoint, idx) => (
                  <motion.div
                    key={endpoint.path}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    {/* Endpoint Header */}
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                          endpoint.method === 'PUT' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                          {endpoint.path}
                        </code>
                        {endpoint.auth && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg">
                            🔐 Auth Required
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{endpoint.title}</h3>
                      <p className="text-gray-600">{endpoint.description}</p>
                    </div>

                    {/* Parameters */}
                    {endpoint.params.length > 0 && (
                      <div className="p-6 border-b border-gray-200">
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Parameters</h4>
                        <div className="space-y-3">
                          {endpoint.params.map((param) => (
                            <div key={param.name} className="flex flex-col sm:flex-row sm:items-start gap-2 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2 min-w-[200px]">
                                <code className="text-sm font-mono font-semibold text-blue-600">
                                  {param.name}
                                </code>
                                <span className="text-xs text-gray-500">{param.type}</span>
                                {param.required && (
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                    required
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 flex-1">{param.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Example Request */}
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Example Request</h4>
                      <div className="bg-gray-900 rounded-lg p-4 relative">
                        <button
                          onClick={() => copyToClipboard(endpoint.example, `example-${idx}`)}
                          className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {copiedCode === `example-${idx}` ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <pre className="text-xs text-gray-100 overflow-x-auto">
                          <code>{endpoint.example}</code>
                        </pre>
                      </div>
                    </div>

                    {/* Response */}
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Response</h4>
                      <div className="bg-gray-900 rounded-lg p-4 relative">
                        <button
                          onClick={() => copyToClipboard(endpoint.response, `response-${idx}`)}
                          className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {copiedCode === `response-${idx}` ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <pre className="text-xs text-gray-100 overflow-x-auto">
                          <code>{endpoint.response}</code>
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Rate Limits</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Free Plan</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      10 scans per day
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      60 requests per minute
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Trial features included
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pro Plan</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      10,000 scans per month
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      300 requests per minute
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      Priority support
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-900">
                  <strong className="font-semibold">⚠️ Rate Limit Headers:</strong> Check{" "}
                  <code className="bg-yellow-100 px-2 py-0.5 rounded">X-RateLimit-Remaining</code> and{" "}
                  <code className="bg-yellow-100 px-2 py-0.5 rounded">X-RateLimit-Reset</code>{" "}
                  headers in API responses to monitor your usage.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Error Codes */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Error Codes</h2>
              
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status Code</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-green-600 font-semibold">200</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Success - Request completed successfully</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-red-600 font-semibold">400</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Bad Request - Invalid parameters or malformed request</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-red-600 font-semibold">401</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Unauthorized - Missing or invalid API key</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-red-600 font-semibold">403</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Forbidden - API key doesn&apos;t have required permissions</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-red-600 font-semibold">404</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Not Found - Resource doesn&apos;t exist</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-red-600 font-semibold">429</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Too Many Requests - Rate limit exceeded</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-red-600 font-semibold">500</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Internal Server Error - Something went wrong on our end</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Get your API key and start scanning in minutes
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/settings?tab=api"
                  className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Get API Key
                </a>
                <a
                  href="/contact"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/30 transition-all"
                >
                  Contact Sales
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <LegalFooter />
      </main>
    </>
  );
}
