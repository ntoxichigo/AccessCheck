"use client";
import { SignUp } from "@clerk/nextjs";
import NavBar from "../../../components/NavBar";

export default function SignUpPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen flex items-center justify-center p-6">
        <SignUp redirectUrl="/dashboard" afterSignUpUrl="/dashboard" />
      </main>
    </>
  );
}

