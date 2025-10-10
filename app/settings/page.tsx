"use client";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import SettingsLayout from "../../components/profile/SettingsLayout";
import PageLayout from "../../components/PageLayout";

export default function SettingsPage() {
  return (
    <>
      <SignedIn>
        <PageLayout theme="dark" containerSize="default">
          <SettingsLayout />
        </PageLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

