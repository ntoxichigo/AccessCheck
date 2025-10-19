import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import "../lib/env-validation"; // Validate environment variables on startup
import { QueryProvider } from "@/components/providers/QueryProvider";
import { FeatureFlagProvider } from "@/lib/feature-flags";
import { Toaster } from "@/lib/notifications";
import { Analytics } from "@vercel/analytics/react";
import { UserSyncProvider } from "@/components/providers/UserSyncProvider";

export const metadata: Metadata = {
  title: "AccessCheck - Website Accessibility Scanner",
  description: "Professional WCAG accessibility scanning and compliance reporting for websites. Detect accessibility issues, get detailed reports, and ensure compliance.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};




export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignOutUrl="/"
    >
      <html lang="en">
        <body className="bg-black text-white" suppressHydrationWarning>
          <QueryProvider>
            <FeatureFlagProvider>
              <UserSyncProvider />
              <a href="#main-content" className="skip-to-content">
                Skip to main content
              </a>
              {children}
              <Toaster />
              <Analytics />
            </FeatureFlagProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
