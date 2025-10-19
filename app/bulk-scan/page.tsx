"use client";

import { useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "../../components/NavBar";

interface BatchScan {
  id: string;
  name: string;
  totalUrls: number;
  completedUrls: number;
  failedUrls: number;
  status: string;
  createdAt: string;
  completedAt?: string;
}

interface ScanResult {
  id: string;
  url: string;
  status: string;
  issuesFound: number;
  createdAt: string;
}

export default function BulkScanPage() {
  const { user } = useUser();
  const router = useRouter();
  const [urls, setUrls] = useState<string[]>([]);
  const [batchName, setBatchName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [batches, setBatches] = useState<BatchScan[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [batchDetails, setBatchDetails] = useState<BatchScan & { scans: ScanResult[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  // Check subscription tier - bulk scan is Pro+ only
  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setIsCheckingAccess(false);
        return;
      }

      try {
        const response = await fetch("/api/usage");
        if (response.ok) {
          const data = await response.json();
          // Check if user has Pro or Enterprise plan (trial users also have 'pro' subscription)
          const isPro = data.plan === 'pro' || data.plan === 'enterprise';
          setHasAccess(isPro);
          
          if (!isPro) {
            // Redirect free users to pricing page
            router.push('/pricing?feature=bulk-scan');
            return;
          }
        } else {
          // If API call fails, deny access by default
          setHasAccess(false);
          router.push('/pricing?feature=bulk-scan');
        }
      } catch (err) {
        console.error("Failed to check subscription:", err);
        // If error, deny access by default
        setHasAccess(false);
        router.push('/pricing?feature=bulk-scan');
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [user, router]);

  // Fetch user's batches on mount
  useEffect(() => {
    if (user && hasAccess) {
      fetchBatches();
    }
  }, [user, hasAccess]);

  const fetchBatches = async () => {
    try {
      const response = await fetch("/api/bulk-scan");
      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches || []);
      }
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    }
  };

  const fetchBatchDetails = async (batchId: string) => {
    try {
      const response = await fetch(`/api/bulk-scan?batchId=${batchId}`);
      if (response.ok) {
        const data = await response.json();
        setBatchDetails(data);
        setSelectedBatch(batchId);
      }
    } catch (err) {
      console.error("Failed to fetch batch details:", err);
    }
  };

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).filter((line) => line.trim());

      // Parse CSV - handle both comma and newline separated
      const urlList: string[] = [];
      lines.forEach((line) => {
        const cells = line.split(",");
        cells.forEach((cell) => {
          const trimmed = cell.trim();
          if (trimmed && (trimmed.startsWith("http://") || trimmed.startsWith("https://"))) {
            urlList.push(trimmed);
          }
        });
      });

      setUrls(urlList);
      setError(null);
    };
    reader.readAsText(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  const handleTextInput = (text: string) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim());
    const urlList = lines.filter((line) =>
      line.startsWith("http://") || line.startsWith("https://")
    );
    setUrls(urlList);
    setError(null);
  };

  const handleSubmit = async () => {
    if (urls.length === 0) {
      setError("Please add at least one URL");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/bulk-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls,
          name: batchName || `Batch scan ${new Date().toLocaleDateString()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create batch scan");
        return;
      }

      // Reset form
      setUrls([]);
      setBatchName("");

      // Refresh batches list
      await fetchBatches();

      // Show success message
      alert(`Batch scan created! ${data.totalUrls} URLs will be scanned.`);
    } catch (err) {
      setError("An error occurred while creating the batch scan");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state while checking subscription access
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Bulk Scan
            </h2>

            {/* Batch Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Name (Optional)
              </label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g., Homepage Audit October 2025"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* File Upload */}
            <div
              className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-4xl mb-4">📁</div>
              <p className="text-gray-700 font-medium mb-2">
                Drop CSV file here or click to upload
              </p>
              <p className="text-sm text-gray-500 mb-4">
                CSV should contain one URL per line or comma-separated
              </p>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium cursor-pointer hover:shadow-lg transition-shadow"
              >
                Choose File
              </label>
            </div>

            {/* Manual URL Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or paste URLs (one per line)
              </label>
              <textarea
                placeholder="https://example.com&#10;https://example.com/about&#10;https://example.com/contact"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                onChange={(e) => handleTextInput(e.target.value)}
              />
            </div>

            {/* URL List */}
            {urls.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    URLs to scan ({urls.length})
                  </label>
                  <button
                    onClick={() => setUrls([])}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear all
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {urls.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-sm text-gray-700 truncate flex-1">
                        {url}
                      </span>
                      <button
                        onClick={() => removeUrl(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isUploading || urls.length === 0}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Creating Batch Scan..." : `Scan ${urls.length} URL${urls.length !== 1 ? 's' : ''}`}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Pro plan: up to 50 URLs | Enterprise: up to 500 URLs
            </p>
          </motion.div>

          {/* Batches List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Batch Scans
            </h2>

            {batches.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-4">📋</div>
                <p>No batch scans yet</p>
                <p className="text-sm mt-2">Upload a CSV to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {batches.map((batch) => (
                  <motion.div
                    key={batch.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => fetchBatchDetails(batch.id)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {batch.name || "Untitled Batch"}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          batch.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : batch.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : batch.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {batch.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        {batch.completedUrls} / {batch.totalUrls} completed
                      </p>
                      {batch.failedUrls > 0 && (
                        <p className="text-red-600">{batch.failedUrls} failed</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(batch.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {batch.status === "processing" && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(batch.completedUrls / batch.totalUrls) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Batch Details Modal */}
        <AnimatePresence>
          {selectedBatch && batchDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedBatch(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {batchDetails.name || "Batch Scan Details"}
                    </h2>
                    <button
                      onClick={() => setSelectedBatch(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex gap-4 mt-4 text-sm">
                    <div className="px-3 py-1 bg-blue-50 rounded-full">
                      <span className="font-medium">Total: </span>
                      {batchDetails.totalUrls}
                    </div>
                    <div className="px-3 py-1 bg-green-50 rounded-full">
                      <span className="font-medium">Completed: </span>
                      {batchDetails.completedUrls}
                    </div>
                    {batchDetails.failedUrls > 0 && (
                      <div className="px-3 py-1 bg-red-50 rounded-full">
                        <span className="font-medium">Failed: </span>
                        {batchDetails.failedUrls}
                      </div>
                    )}
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[60vh] p-6">
                  {batchDetails.scans && batchDetails.scans.length > 0 ? (
                    <div className="space-y-3">
                      {batchDetails.scans.map((scan) => (
                        <div
                          key={scan.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <a
                                href={`/results?id=${scan.id}`}
                                className="text-blue-600 hover:underline font-medium"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {scan.url}
                              </a>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(scan.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {scan.status === "completed" && (
                                <span className="text-sm font-medium text-gray-700">
                                  {scan.issuesFound} issues
                                </span>
                              )}
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No scans available
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>
    </>
  );
}
