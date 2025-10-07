"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-50 to-white">
      <div className="p-6 rounded-2xl border bg-white shadow-sm">
        <SignUp routing="hash" />
      </div>
    </main>
  );
}

