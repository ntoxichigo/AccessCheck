'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Code,
  Terminal
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
  isActive: boolean;
}

export default function ApiKeySettings() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'enterprise'>('free');

  // Fetch user plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch('/api/usage');
        const data = await res.json();
        if (res.ok) {
          setUserPlan(data.plan || 'free');
        }
      } catch (error) {
        console.error('Failed to fetch user plan:', error);
      }
    };
    fetchPlan();
  }, []);

  // Fetch API keys on mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/api-key');
      const data = await res.json();

      if (res.ok) {
        setApiKeys(data.apiKeys || []);
      } else {
        toast.error(data.error || 'Failed to load API keys');
      }
    } catch (error) {
      toast.error('Failed to load API keys');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    try {
      setCreating(true);
      const res = await fetch('/api/user/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setNewlyCreatedKey(data.apiKey);
        setNewKeyName('');
        await fetchApiKeys();
        toast.success('API key created successfully!');
      } else {
        toast.error(data.error || 'Failed to create API key');
      }
    } catch (error) {
      toast.error('Failed to create API key');
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (keyId: string, keyName: string) => {
    if (!confirm(`Are you sure you want to revoke the API key "${keyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/user/api-key?keyId=${keyId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('API key revoked successfully');
        await fetchApiKeys();
      } else {
        toast.error(data.error || 'Failed to revoke API key');
      }
    } catch (error) {
      toast.error('Failed to revoke API key');
      console.error(error);
    }
  };

  const copyToClipboard = async (text: string, keyId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');

      if (keyId) {
        setCopiedKeyId(keyId);
        setTimeout(() => setCopiedKeyId(null), 2000);
      }
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg">
            <Key className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-gray-900 mb-2">API Access</h2>
            <p className="text-gray-700 leading-relaxed">
              Integrate AccessCheck into your CI/CD pipeline with our REST API. Generate and manage API keys below.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="/api-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg text-sm font-semibold text-blue-600 hover:bg-white transition-all border border-blue-200/50"
              >
                <Code className="w-4 h-4" />
                API Docs
              </a>
              <a
                href="/api-docs#examples"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg text-sm font-semibold text-blue-600 hover:bg-white transition-all border border-blue-200/50"
              >
                <Terminal className="w-4 h-4" />
                Code Examples
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Pro-only Warning for Free Users */}
      {userPlan === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-5 shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                🔒 API Access is Pro-Only
              </h3>
              <p className="text-amber-800 mb-3">
                API key generation is only available for <strong>Pro</strong> and <strong>Enterprise</strong> plans. 
                Upgrade now to integrate AccessCheck into your CI/CD pipeline and automate accessibility testing.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                <Shield className="w-4 h-4" />
                Upgrade to Pro ($19/month)
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Create New Key Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Your API Keys</h3>
          <p className="text-sm text-gray-600">Maximum 5 active keys per account</p>
        </div>
        <motion.button
          onClick={() => setShowNewKeyModal(true)}
          disabled={apiKeys.length >= 5}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Create API Key
        </motion.button>
      </div>

      {/* API Keys List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Key className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No API keys yet</h3>
          <p className="text-gray-600 mb-4">Create your first API key to get started</p>
          <motion.button
            onClick={() => setShowNewKeyModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Create API Key
          </motion.button>
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((apiKey) => (
            <motion.div
              key={apiKey.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-gray-900">{apiKey.name}</h4>
                    {apiKey.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Revoked
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <code className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-lg font-mono text-sm">
                      {apiKey.key}
                    </code>
                    <motion.button
                      onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      {copiedKeyId === apiKey.id ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </motion.button>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Created {formatDate(apiKey.createdAt)}
                    </span>
                    {apiKey.lastUsedAt && (
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Last used {formatDate(apiKey.lastUsedAt)}
                      </span>
                    )}
                  </div>
                </div>

                <motion.button
                  onClick={() => deleteApiKey(apiKey.id, apiKey.name)}
                  disabled={!apiKey.isActive}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Revoke API key"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create API Key Modal */}
      <AnimatePresence>
        {showNewKeyModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !newlyCreatedKey && setShowNewKeyModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {newlyCreatedKey ? (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900">API Key Created!</h3>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-yellow-800 font-semibold">
                        ⚠️ This is the only time you'll see this API key. Please copy and save it securely.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <label className="text-sm font-semibold text-gray-700">Your API Key</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-mono text-sm break-all">
                        {newlyCreatedKey}
                      </code>
                      <motion.button
                        onClick={() => copyToClipboard(newlyCreatedKey)}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Copy className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => {
                      setNewlyCreatedKey(null);
                      setShowNewKeyModal(false);
                    }}
                    className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    I've Saved My Key
                  </motion.button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-black text-gray-900 mb-4">Create New API Key</h3>

                  <div className="space-y-3 mb-6">
                    <label className="text-sm font-semibold text-gray-700">Key Name</label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production CI/CD"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <p className="text-xs text-gray-600">
                      Choose a descriptive name to help you identify this key later
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => {
                        setShowNewKeyModal(false);
                        setNewKeyName('');
                      }}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={createApiKey}
                      disabled={creating || !newKeyName.trim()}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {creating ? 'Creating...' : 'Create Key'}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
