'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface Scan {
  id: string;
  url: string;
  createdAt: string;
  status: string;
  issueCount: number;
}

export default function ScanHistory() {
  const { user } = useUser();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await fetch('/api/scans/history');
        const data = await response.json();
        if (data.success) {
          setScans(data.scans);
        }
      } catch (error) {
        console.error('Error fetching scan history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchScans();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="animate-pulse p-6 rounded-2xl bg-white/10">
        <div className="h-6 bg-white/20 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white/20 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="text-center p-6 rounded-2xl bg-white/10">
        <p className="text-gray-300 mb-4">No scans yet. Start by scanning your first website!</p>
        <Link 
          href="#scan"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Start Scanning
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white/10">
      <h2 className="text-xl font-bold mb-4">Recent Scans</h2>
      <div className="space-y-3">
        {scans.map((scan) => (
          <div
            key={scan.id}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            <div>
              <p className="font-medium text-white">{scan.url}</p>
              <p className="text-sm text-gray-400">
                {new Date(scan.createdAt).toLocaleDateString()} • 
                {scan.issueCount} issues found
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.location.href = `/scan/${scan.id}`}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Report
              </button>
              <button
                onClick={() => window.location.href = `/scan?url=${encodeURIComponent(scan.url)}`}
                className="px-3 py-1.5 text-sm border border-white/20 rounded-lg hover:bg-white/10 transition"
              >
                Scan Again
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}