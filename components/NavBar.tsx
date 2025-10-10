"use client";
import Link from "next/link";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  
  const publicLinks = [
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  const authLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/scan", label: "Scan" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-gradient-to-r from-blue-950 via-purple-950 to-black/90 border-b border-gray-800 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span className="font-black text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition">
            AccessCheck
          </span>
        </Link>

        <button
          className="sm:hidden flex items-center px-3 py-2 border rounded text-gray-300 border-gray-700 hover:text-white hover:border-blue-500 transition"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className={`flex-col sm:flex-row sm:flex gap-2 sm:gap-4 text-sm font-semibold items-center ${open ? 'flex' : 'hidden'} sm:flex bg-black/90 sm:bg-transparent absolute sm:static top-full left-0 w-full sm:w-auto px-4 sm:px-0 py-2 sm:py-0 border-t sm:border-none border-gray-800 sm:shadow-none shadow-xl`}> 
          {publicLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 rounded-lg text-white hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 hover:text-yellow-200 transition"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <SignedIn>
            {authLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 rounded-lg text-white hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 hover:text-yellow-200 transition"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-2">
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
            </div>
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="block px-4 py-2 rounded-lg text-white hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 hover:text-yellow-200 transition"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
