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
      <div className="animate-pulse p-6 rounded-2xl bg-white border border-gray-200 shadow-md">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="text-center p-8 rounded-2xl bg-white border border-gray-200 shadow-md">
        <p className="text-gray-700 mb-4 text-lg font-medium">No scans in the last 24 hours. Start by scanning your first website!</p>
        <Link 
          href="#scan"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
        >
          Start Scanning
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Scans</h2>
        <p className="text-sm text-gray-600 font-medium">Last 24 hours • Max 10 scans</p>
      </div>
      <div className="space-y-4">
        {scans.map((scan) => (
          <div
            key={scan.id}
            className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex-1 min-w-0 mr-4">
              <p className="font-bold text-gray-900 truncate mb-1 text-lg">{scan.url}</p>
              <p className="text-sm text-gray-600 font-medium">
                {new Date(scan.createdAt).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })} • 
                <span className="ml-1 font-bold text-orange-600">{scan.issueCount} issues found</span>
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => window.location.href = `/scan/${scan.id}`}
                className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                View Report
              </button>
              <button
                onClick={() => window.location.href = `/scan?url=${encodeURIComponent(scan.url)}`}
                className="px-4 py-2 text-sm font-bold border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all"
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