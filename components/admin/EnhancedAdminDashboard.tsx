"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Activity,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  UserX,
  Crown,
  Shield,
  Clock,
  BarChart3,
} from 'lucide-react';
import { Button } from '../ui/button';
import { notify } from '@/lib/notifications';
import { FeatureGate, FEATURES } from '@/lib/feature-flags';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalScans: number;
  revenue: number;
  conversionRate: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'deleted';
  scansCount: number;
  createdAt: string;
  lastActive: string;
}

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

export function EnhancedAdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalScans: 0,
    revenue: 0,
    conversionRate: 0,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'analytics' | 'logs'>('overview');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with real API calls
      setStats({
        totalUsers: 1247,
        activeUsers: 892,
        totalScans: 15389,
        revenue: 36250,
        conversionRate: 12.5,
      });

      setUsers([
        {
          id: '1',
          email: 'john@example.com',
          name: 'John Doe',
          plan: 'pro',
          status: 'active',
          scansCount: 145,
          createdAt: '2025-01-15',
          lastActive: '2025-10-10',
        },
        {
          id: '2',
          email: 'jane@example.com',
          name: 'Jane Smith',
          plan: 'free',
          status: 'active',
          scansCount: 12,
          createdAt: '2025-02-20',
          lastActive: '2025-10-09',
        },
      ]);

      setAuditLogs([
        {
          id: '1',
          userId: '1',
          action: 'subscription_upgrade',
          details: 'Upgraded from Free to Pro',
          timestamp: '2025-10-10T14:30:00Z',
        },
        {
          id: '2',
          userId: '2',
          action: 'scan_completed',
          details: 'Completed scan for example.com',
          timestamp: '2025-10-10T13:15:00Z',
        },
      ]);
    } catch {
      notify.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;

    try {
      await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
      });

      notify.success('User suspended successfully');
      loadAdminData();
    } catch {
      notify.error('Failed to suspend user');
    }
  };

  const handleExportData = () => {
    const data = {
      stats,
      users,
      auditLogs,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    notify.success('Data exported successfully');
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <FeatureGate feature={FEATURES.ADMIN_DASHBOARD}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-500" />
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Manage users, analytics, and system health</p>
            </div>
            {users.some(u => u.plan === 'pro' || u.plan === 'enterprise') ? (
              <Button
                onClick={handleExportData}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span>
                  Upgrade to <span className="font-bold">Pro</span> to see full details and download reports (CSV/PDF).
                </span>
              </div>
            )}
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-white/10">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'logs', label: 'Audit Logs', icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                  className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Overview Tab */}
          <AnimatePresence mode="wait">
            {selectedTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
              >
                {[
                  {
                    label: 'Total Users',
                    value: stats.totalUsers.toLocaleString(),
                    icon: Users,
                    color: 'blue',
                    change: '+12%',
                  },
                  {
                    label: 'Active Users',
                    value: stats.activeUsers.toLocaleString(),
                    icon: Activity,
                    color: 'green',
                    change: '+8%',
                  },
                  {
                    label: 'Total Scans',
                    value: stats.totalScans.toLocaleString(),
                    icon: Eye,
                    color: 'purple',
                    change: '+24%',
                  },
                  {
                    label: 'Revenue',
                    value: `$${stats.revenue.toLocaleString()}`,
                    icon: DollarSign,
                    color: 'yellow',
                    change: '+15%',
                  },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`h-6 w-6 text-${stat.color}-400`} />
                        <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                      </div>
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Users Tab */}
            {selectedTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Search and Filter */}
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={filterPlan}
                      onChange={(e) => setFilterPlan(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    >
                      <option value="all">All Plans</option>
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>

                {/* Users Table */}
                <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Scans
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{user.name}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.plan === 'pro'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : user.plan === 'enterprise'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}
                            >
                              {user.plan === 'pro' && <Crown className="h-3 w-3" />}
                              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {user.scansCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(user.lastActive).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleSuspendUser(user.id)}
                              className="text-red-400 hover:text-red-300 flex items-center gap-1"
                            >
                              <UserX className="h-4 w-4" />
                              Suspend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {selectedTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8 rounded-xl border border-white/10 bg-white/5 text-center"
              >
                <BarChart3 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h3>
                <p className="text-gray-400 mb-4">
                  Detailed charts and graphs will be displayed here
                </p>
                <p className="text-sm text-gray-500">
                  Integration with analytics dashboard coming soon
                </p>
              </motion.div>
            )}

            {/* Audit Logs Tab */}
            {selectedTab === 'logs' && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                {auditLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg border border-white/10 bg-white/5 flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white">{log.action}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{log.details}</p>
                      <p className="text-xs text-gray-500 mt-1">User ID: {log.userId}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </FeatureGate>
  );
}
