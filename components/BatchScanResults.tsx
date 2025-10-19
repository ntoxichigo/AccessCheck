"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ScanResult {
  id: string;
  url: string;
  status: string;
  issuesFound: number;
  createdAt: string;
  results?: {
    violations?: Array<{
      id: string;
      impact: string;
      description: string;
      nodes: Array<{ html: string }>;
    }>;
  };
}

interface BatchScan {
  id: string;
  name: string;
  totalUrls: number;
  completedUrls: number;
  failedUrls: number;
  status: string;
  createdAt: string;
  completedAt?: string;
  scans: ScanResult[];
}

interface BatchScanResultsProps {
  batchId: string;
}

export function BatchScanResults({ batchId }: BatchScanResultsProps) {
  const [batch, setBatch] = useState<BatchScan | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "failed" | "pending">("all");
  const [sortBy, setSortBy] = useState<"url" | "issues" | "date">("date");

  useEffect(() => {
    fetchBatchData();
    const interval = setInterval(fetchBatchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [batchId]);

  const fetchBatchData = async () => {
    try {
      const response = await fetch(`/api/bulk-scan?batchId=${batchId}`);
      if (response.ok) {
        const data = await response.json();
        setBatch(data);
      }
    } catch (err) {
      console.error("Failed to fetch batch data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Batch scan not found</p>
      </div>
    );
  }

  const filteredScans = batch.scans.filter((scan) => {
    if (filter === "all") return true;
    return scan.status === filter;
  });

  const sortedScans = [...filteredScans].sort((a, b) => {
    if (sortBy === "url") return a.url.localeCompare(b.url);
    if (sortBy === "issues") return b.issuesFound - a.issuesFound;
    if (sortBy === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  const totalIssues = batch.scans.reduce((sum, scan) => sum + scan.issuesFound, 0);
  const avgIssues = batch.completedUrls > 0 ? Math.round(totalIssues / batch.completedUrls) : 0;

  const exportToCSV = () => {
    const headers = ["URL", "Status", "Issues Found", "Scan Date"];
    const rows = batch.scans.map((scan) => [
      scan.url,
      scan.status,
      scan.issuesFound,
      new Date(scan.createdAt).toLocaleString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch-scan-${batch.id}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {batch.name || "Batch Scan"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Created {new Date(batch.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow text-sm"
            >
              Export CSV
            </button>
            <button
              onClick={fetchBatchData}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-sm text-blue-600 font-medium mb-1">Total URLs</p>
            <p className="text-2xl font-bold text-blue-900">{batch.totalUrls}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p className="text-sm text-green-600 font-medium mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-900">{batch.completedUrls}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <p className="text-sm text-purple-600 font-medium mb-1">Total Issues</p>
            <p className="text-2xl font-bold text-purple-900">{totalIssues}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <p className="text-sm text-orange-600 font-medium mb-1">Avg. Issues</p>
            <p className="text-2xl font-bold text-orange-900">{avgIssues}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {batch.status === "processing" && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Progress</p>
              <p className="text-sm text-gray-600">
                {Math.round((batch.completedUrls / batch.totalUrls) * 100)}%
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${(batch.completedUrls / batch.totalUrls) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === "all"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({batch.scans.length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === "completed"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed ({batch.completedUrls})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === "pending"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({batch.scans.filter((s) => s.status === "pending").length})
            </button>
            {batch.failedUrls > 0 && (
              <button
                onClick={() => setFilter("failed")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "failed"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Failed ({batch.failedUrls})
              </button>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="url">URL</option>
              <option value="issues">Issues</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scanned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedScans.map((scan, index) => (
                <motion.tr
                  key={scan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <a
                        href={scan.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline max-w-md truncate block"
                      >
                        {scan.url}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        scan.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : scan.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {scan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {scan.status === "completed" ? (
                      <span className="text-sm font-medium text-gray-900">
                        {scan.issuesFound}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {scan.status === "completed" && (
                      <Link
                        href={`/results?id=${scan.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View Report
                      </Link>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedScans.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No scans match the current filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
