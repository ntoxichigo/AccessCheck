"use client";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { CheckCircle2, Zap, Lock, BarChart3 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignUpForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Features showcase */}
            <div className="hidden lg:flex flex-col gap-8 text-white order-2">
              <div className="space-y-2">
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Join AccessCheck
                </h2>
                <p className="text-lg text-slate-300">Start making the web more accessible today</p>
              </div>

              <div className="space-y-6 mt-8">
                {[
                  {
                    icon: Zap,
                    title: "Start Free",
                    desc: "No credit card required to begin scanning",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Instant Results",
                    desc: "Get accessibility reports in seconds",
                  },
                  {
                    icon: Lock,
                    title: "Secure & Private",
                    desc: "Enterprise-grade security for your data",
                  },
                  {
                    icon: BarChart3,
                    title: "Advanced Insights",
                    desc: "Detailed analytics and improvement recommendations",
                  },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="flex gap-4 group cursor-pointer">
                      <div className="flex-shrink-0">
                        <Icon className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-400">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trust badge */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-sm text-slate-400 mb-4">Trusted by web developers worldwide</p>
                <div className="flex gap-4 flex-wrap">
                  {["⭐ 4.9/5 rating", "🚀 1000+ scans/day", "🔒 GDPR compliant"].map(
                    (badge, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300"
                      >
                        {badge}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right side - Sign up form */}
            <div className="flex flex-col justify-center order-1 lg:order-1">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 sm:p-10 hover:border-white/30 transition-all duration-300">
                {/* Header */}
                <div className="mb-8 text-center">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Get Started</h1>
                  <p className="text-slate-300">Create your AccessCheck account in 2 minutes</p>
                </div>

                {/* Sign Up Form */}
                <div className="mb-6">
                  <SignUp
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "bg-transparent border-0 shadow-none",
                        formButtonPrimary:
                          "w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-base",
                        formFieldInput:
                          "w-full bg-white/5 border border-white/10 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-all duration-200 backdrop-blur-sm",
                        formFieldLabel: "text-slate-200 font-medium text-sm",
                        headerTitle: "text-2xl font-bold text-white",
                        headerSubtitle: "text-slate-300",
                        socialButtonsBlockButton:
                          "w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 mb-3 hover:border-white/20",
                        dividerLine: "bg-white/10",
                        dividerText: "text-slate-400",
                        footerActionLink: "text-purple-400 hover:text-purple-300 font-medium",
                        footerAction: "text-slate-300",
                        identifierMobileDrawer: "bg-slate-900",
                        backButton: "text-slate-300 hover:text-white",
                        tagElement: "text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded px-2 py-1",
                      },
                    }}
                    redirectUrl={redirectUrl}
                    afterSignUpUrl={redirectUrl}
                    signInUrl="/sign-in"
                  />
                </div>

                {/* Additional links */}
                <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                  <p className="text-center text-slate-300">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 font-medium">
                      Sign in
                    </Link>
                  </p>

                  <div className="text-xs text-slate-400 text-center space-y-2">
                    <p>
                      By signing up, you agree to our{" "}
                      <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                        Terms of Service
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer text */}
              <p className="text-center text-slate-400 text-sm mt-6">
                ✨ Free for life with core features
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900"><div className="text-white">Loading...</div></div>}>
      <SignUpForm />
    </Suspense>
  );
}
