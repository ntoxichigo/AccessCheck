"use client";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import NavBar from "../../../components/NavBar";


export default function SignInPage() {
  // const { user } = useUser();

  return (
    <>
      <NavBar />
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-lg border border-white/20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome to AccessCheck!</h1>
          <p className="text-gray-700">Sign in to continue to your dashboard and start scanning for accessibility.</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition",
              socialButtonsBlockButton: "bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded mb-2",
              card: "shadow-lg border border-gray-200",
            },
          }}
          redirectUrl="/dashboard"
          afterSignInUrl="/dashboard"
          signUpUrl="/sign-up"
          path="/sign-in"
        />
        <div className="mt-6 flex flex-col gap-2 text-center">
          <Link href="/sign-up" className="text-blue-600 hover:underline">Don&apos;t have an account? Sign up</Link>
          <Link href="/sign-in/reset-password" className="text-blue-600 hover:underline">Forgot password?</Link>
          <label className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2">
            <input type="checkbox" className="accent-blue-600" /> Remember me
          </label>
        </div>
        <div className="mt-6 text-xs text-gray-500 text-center">
          By signing in, you agree to our <Link href="/privacy" className="underline">Privacy Policy</Link> and <Link href="/terms" className="underline">Terms of Service</Link>.
        </div>
      </div>
    </main>
    </>
  );
}

