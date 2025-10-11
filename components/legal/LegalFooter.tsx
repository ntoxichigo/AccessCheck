'use client';

import Link from 'next/link';

export function LegalFooter() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Disclaimer */}
        <div className="mb-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-yellow-400 text-lg">⚠️</span>
            <div className="text-sm text-yellow-200 leading-relaxed">
              <strong>Disclaimer:</strong> This tool provides automated accessibility testing only. 
              Not legal advice. Not a guarantee of compliance. Manual review required. Use at your own risk.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">AccessCheck</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional accessibility audit platform powered by open-source technology.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-400 hover:text-white transition">
                  Accessibility Statement
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/dequelabs/axe-core"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  axe-core (GitHub)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* axe-core Attribution */}
        <div className="border-t border-white/10 pt-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-gray-400">
              Powered by{' '}
              <a
                href="https://github.com/dequelabs/axe-core"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                axe-core
              </a>
              {' '}© Deque Systems, Inc. • Licensed under{' '}
              <a
                href="https://www.mozilla.org/en-US/MPL/2.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                MPL 2.0
              </a>
            </div>
            <div className="text-gray-500">
              © {new Date().getFullYear()} AccessCheck. All rights reserved.
            </div>
          </div>
        </div>

        {/* Final Disclaimer */}
        <div className="text-xs text-gray-500 text-center leading-relaxed">
          AccessCheck provides automated testing tools AS-IS with NO WARRANTIES. 
          We are NOT liable for your compliance obligations. 
          You assume ALL risk and responsibility for accessibility compliance.
        </div>
      </div>
    </footer>
  );
}
