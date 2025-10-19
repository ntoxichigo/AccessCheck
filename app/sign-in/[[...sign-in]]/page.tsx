"use client";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { CheckCircle2, Zap, Lock, BarChart3 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Features showcase */}
            <div className="hidden lg:flex flex-col gap-8 text-white">
              <div className="space-y-2">
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AccessCheck
                </h2>
                <p className="text-lg text-slate-300">Make your web more accessible</p>
              </div>

              <div className="space-y-6 mt-8">
                {[
                  {
                    icon: Zap,
                    title: "Instant Scanning",
                    desc: "Get real-time accessibility insights in seconds",
                  },
                  {
                    icon: CheckCircle2,
                    title: "WCAG Compliance",
                    desc: "Ensure your site meets international standards",
                  },
                  {
                    icon: Lock,
                    title: "Data Private",
                    desc: "Your scans are secure and never shared",
                  },
                  {
                    icon: BarChart3,
                    title: "Detailed Reports",
                    desc: "Actionable insights with code fixes included",
                  },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="flex gap-4 group cursor-pointer">
                      <div className="flex-shrink-0">
                        <Icon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-400">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right side - Sign in form */}
            <div className="flex flex-col justify-center">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 sm:p-10 hover:border-white/30 transition-all duration-300">
                {/* Header */}
                <div className="mb-8 text-center">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Welcome Back!</h1>
                  <p className="text-slate-300">Sign in to your AccessCheck account</p>
                </div>

                {/* Sign In Form */}
                <div className="mb-6">
                  <SignIn
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "bg-transparent border-0 shadow-none",
                        formButtonPrimary:
                          "w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-base",
                        formFieldInput:
                          "w-full bg-white/5 border border-white/10 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all duration-200 backdrop-blur-sm",
                        formFieldLabel: "text-slate-200 font-medium text-sm",
                        headerTitle: "text-2xl font-bold text-white",
                        headerSubtitle: "text-slate-300",
                        socialButtonsBlockButton:
                          "w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 mb-3 hover:border-white/20",
                        dividerLine: "bg-white/10",
                        dividerText: "text-slate-400",
                        footerActionLink: "text-cyan-400 hover:text-cyan-300 font-medium",
                        footerAction: "text-slate-300",
                        identifierMobileDrawer: "bg-slate-900",
                        backButton: "text-slate-300 hover:text-white",
                        tagElement: "text-xs bg-blue-500/20 text-cyan-300 border border-cyan-500/30 rounded px-2 py-1",
                      },
                    }}
                    redirectUrl={redirectUrl}
                    afterSignInUrl={redirectUrl}
                    signUpUrl="/sign-up"
                    path="/sign-in"
                  />
                </div>

                {/* Additional links */}
                <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                  <Link
                    href="/sign-up"
                    className="block text-center text-slate-300 hover:text-cyan-400 transition-colors font-medium"
                  >
                    Don&apos;t have an account?{" "}
                    <span className="text-cyan-400 hover:text-cyan-300">Sign up</span>
                  </Link>

                  <div className="text-xs text-slate-400 text-center space-y-2">
                    <p>
                      By signing in, you agree to our{" "}
                      <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 underline">
                        Terms of Service
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer text */}
              <p className="text-center text-slate-400 text-sm mt-6">
                🔐 Your data is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"><div className="text-white">Loading...</div></div>}>
      <SignInForm />
    </Suspense>
  );
}
