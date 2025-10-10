'use client';

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import MonitoringDashboard from "../../components/monitoring/MonitoringDashboard";
import AdminUserManager from "../../components/admin/AdminUserManager";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";

export default function AdminPage() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/admin/check');
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error('Failed to check admin status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white/5 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SignedIn>
        <>
          <NavBar />
          <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">System Monitoring</h1>
            <MonitoringDashboard />
            <AdminUserManager />
          </div>
        </main>
        </>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}