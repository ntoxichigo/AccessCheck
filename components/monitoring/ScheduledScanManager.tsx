'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Play, Pause, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScheduledScan {
  id: string;
  url: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
  alertOnNewIssues: boolean;
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
}

export function ScheduledScanManager() {
  const [scheduledScans, setScheduledScans] = useState<ScheduledScan[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newScan, setNewScan] = useState({
    url: '',
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    alertOnNewIssues: true,
  });

  useEffect(() => {
    fetchScheduledScans();
  }, []);

  const fetchScheduledScans = async () => {
    try {
      const response = await fetch('/api/scheduled-scans');
      if (response.ok) {
        const data = await response.json();
        setScheduledScans(data.scans || []);
      }
    } catch (error) {
      console.error('Failed to fetch scheduled scans:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newScan.url) return;

    try {
      const response = await fetch('/api/scheduled-scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newScan),
      });

      if (response.ok) {
        setIsCreating(false);
        setNewScan({ url: '', frequency: 'weekly', alertOnNewIssues: true });
        fetchScheduledScans();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create scheduled scan');
      }
    } catch (error) {
      console.error('Create scheduled scan error:', error);
      alert('An error occurred');
    }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/scheduled-scans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        fetchScheduledScans();
      }
    } catch (error) {
      console.error('Toggle scheduled scan error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scheduled scan?')) return;

    try {
      const response = await fetch(`/api/scheduled-scans/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchScheduledScans();
      }
    } catch (error) {
      console.error('Delete scheduled scan error:', error);
    }
  };

  const frequencyLabels = {
    daily: 'Every Day',
    weekly: 'Every Week',
    monthly: 'Every Month',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold">Scheduled Scans</h3>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Schedule
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Automatically scan your websites on a regular schedule and get alerts when new issues are detected.
      </p>

      {/* Create Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.form
            onSubmit={handleCreate}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <h4 className="font-semibold mb-3">Create Scheduled Scan</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={newScan.url}
                  onChange={(e) => setNewScan({ ...newScan, url: e.target.value })}
                  placeholder="https://example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={newScan.frequency}
                  onChange={(e) =>
                    setNewScan({
                      ...newScan,
                      frequency: e.target.value as 'daily' | 'weekly' | 'monthly',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="alertOnNewIssues"
                  checked={newScan.alertOnNewIssues}
                  onChange={(e) =>
                    setNewScan({ ...newScan, alertOnNewIssues: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="alertOnNewIssues" className="text-sm text-gray-700">
                  Send email alerts when new issues are detected
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Scheduled Scans List */}
      {scheduledScans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No scheduled scans yet</p>
          <p className="text-sm mt-2">Create one to start monitoring your websites</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scheduledScans.map((scan) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <a
                      href={scan.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {scan.url}
                    </a>
                    {!scan.enabled && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Paused
                      </span>
                    )}
                    {scan.alertOnNewIssues && (
                      <AlertCircle className="h-4 w-4 text-orange-500" aria-label="Alerts enabled" />
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {frequencyLabels[scan.frequency]}
                    </span>
                    {scan.lastRun && (
                      <span>Last: {new Date(scan.lastRun).toLocaleDateString()}</span>
                    )}
                    {scan.nextRun && (
                      <span>Next: {new Date(scan.nextRun).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(scan.id, !scan.enabled)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={scan.enabled ? 'Pause' : 'Resume'}
                  >
                    {scan.enabled ? (
                      <Pause className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Play className="h-4 w-4 text-green-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(scan.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Scheduled scans require Pro plan or higher and count toward your daily scan limit.
        </p>
      </div>
    </div>
  );
}
