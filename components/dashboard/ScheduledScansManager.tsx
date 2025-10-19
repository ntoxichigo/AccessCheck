'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Plus,
  Play,
  Pause,
  Trash2,
  Bell,
  BellOff,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ScheduledScan {
  id: string;
  url: string;
  frequency: string;
  enabled: boolean;
  alertOnNewIssues: boolean;
  nextRun: string;
  lastRun: string | null;
  createdAt: string;
}

export default function ScheduledScansManager() {
  const [scans, setScans] = useState<ScheduledScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newScan, setNewScan] = useState({
    url: '',
    frequency: 'daily',
    alertOnNewIssues: true,
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchScheduledScans();
  }, []);

  const fetchScheduledScans = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/scheduled-scans');
      const data = await res.json();

      if (res.ok) {
        setScans(data.scans || []);
      } else {
        toast.error(data.error || 'Failed to load scheduled scans');
      }
    } catch (error) {
      toast.error('Failed to load scheduled scans');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createScheduledScan = async () => {
    if (!newScan.url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      setCreating(true);
      const res = await fetch('/api/scheduled-scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newScan),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Scheduled scan created!');
        setNewScan({ url: '', frequency: 'daily', alertOnNewIssues: true });
        setShowCreateModal(false);
        await fetchScheduledScans();
      } else {
        toast.error(data.error || 'Failed to create scheduled scan');
      }
    } catch (error) {
      toast.error('Failed to create scheduled scan');
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const toggleScan = async (scanId: string, enabled: boolean) => {
    try {
      const res = await fetch(`/api/scheduled-scans/${scanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !enabled }),
      });

      if (res.ok) {
        toast.success(enabled ? 'Scan paused' : 'Scan resumed');
        await fetchScheduledScans();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update scan');
      }
    } catch (error) {
      toast.error('Failed to update scan');
      console.error(error);
    }
  };

  const toggleAlerts = async (scanId: string, alertOnNewIssues: boolean) => {
    try {
      const res = await fetch(`/api/scheduled-scans/${scanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertOnNewIssues: !alertOnNewIssues }),
      });

      if (res.ok) {
        toast.success(alertOnNewIssues ? 'Alerts disabled' : 'Alerts enabled');
        await fetchScheduledScans();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update alerts');
      }
    } catch (error) {
      toast.error('Failed to update alerts');
      console.error(error);
    }
  };

  const deleteScan = async (scanId: string, url: string) => {
    if (!confirm(`Are you sure you want to delete the scheduled scan for "${url}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/scheduled-scans/${scanId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Scheduled scan deleted');
        await fetchScheduledScans();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete scan');
      }
    } catch (error) {
      toast.error('Failed to delete scan');
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      daily: 'from-blue-500 to-cyan-500',
      weekly: 'from-purple-500 to-pink-500',
      monthly: 'from-green-500 to-emerald-500',
    };
    return colors[frequency as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl p-6 border border-orange-200/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Scheduled Scans</h2>
            <p className="text-gray-700 leading-relaxed">
              Automate accessibility monitoring with scheduled scans. Get notified when new issues are detected.
            </p>
          </div>
        </div>
      </div>

      {/* Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Your Scheduled Scans</h3>
          <p className="text-sm text-gray-600">Maximum 10 scheduled scans</p>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          disabled={scans.length >= 10}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Schedule Scan
        </motion.button>
      </div>

      {/* Scans List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      ) : scans.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No scheduled scans yet</h3>
          <p className="text-gray-600 mb-4">Create your first scheduled scan to automate monitoring</p>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Schedule Scan
          </motion.button>
        </div>
      ) : (
        <div className="space-y-3">
          {scans.map((scan) => (
            <motion.div
              key={scan.id}
              className={`bg-white rounded-xl border-2 p-5 transition-all ${
                scan.enabled ? 'border-green-200 shadow-sm' : 'border-gray-200 opacity-60'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-bold text-gray-900 truncate">{scan.url}</h4>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${getFrequencyBadge(
                        scan.frequency
                      )} text-white text-xs font-bold rounded-full capitalize`}
                    >
                      {scan.frequency}
                    </span>
                    {scan.enabled ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                        <Pause className="w-3 h-3" />
                        Paused
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Next run: {formatDate(scan.nextRun)}
                    </span>
                    {scan.lastRun && (
                      <span className="flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" />
                        Last run: {formatDate(scan.lastRun)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      onClick={() => toggleScan(scan.id, scan.enabled)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        scan.enabled
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {scan.enabled ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      {scan.enabled ? 'Pause' : 'Resume'}
                    </motion.button>

                    <motion.button
                      onClick={() => toggleAlerts(scan.id, scan.alertOnNewIssues)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        scan.alertOnNewIssues
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {scan.alertOnNewIssues ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                      Alerts {scan.alertOnNewIssues ? 'On' : 'Off'}
                    </motion.button>

                    <motion.button
                      onClick={() => deleteScan(scan.id, scan.url)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-semibold transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-black text-gray-900 mb-6">Schedule New Scan</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Website URL</label>
                  <input
                    type="url"
                    value={newScan.url}
                    onChange={(e) => setNewScan({ ...newScan, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Scan Frequency</label>
                  <select
                    value={newScan.frequency}
                    onChange={(e) => setNewScan({ ...newScan, frequency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="daily">Daily (9 AM)</option>
                    <option value="weekly">Weekly (Mondays, 9 AM)</option>
                    <option value="monthly">Monthly (1st of month, 9 AM)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="checkbox"
                    id="alerts"
                    checked={newScan.alertOnNewIssues}
                    onChange={(e) => setNewScan({ ...newScan, alertOnNewIssues: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="alerts" className="flex-1 text-sm font-semibold text-gray-900">
                    Email me when new issues are detected
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={createScheduledScan}
                  disabled={creating || !newScan.url.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {creating ? 'Creating...' : 'Schedule Scan'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
