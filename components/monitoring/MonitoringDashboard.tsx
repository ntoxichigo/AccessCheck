'use client';

import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  lastChecked: string;
  metrics: {
    totalScans: number;
    activeUsers: number;
    averageResponseTime: number;
    errorRate: number;
    successRate: number;
  };
  services: {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    latency: number;
  }[];
}

export default function MonitoringDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/monitoring/health');
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('Failed to fetch health data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white/5 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!health) {
    return (
      <div className="text-center p-6 bg-red-500/10 rounded-lg">
        <h3 className="text-xl font-bold text-red-400">Monitoring System Error</h3>
        <p className="text-gray-400 mt-2">Unable to fetch system health data.</p>
        <Button onClick={fetchHealthData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const statusColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    down: 'bg-red-500',
    operational: 'bg-green-500',
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">System Status</h2>
            <p className="text-sm text-gray-400">
              Last updated: {new Date(health.lastChecked).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${statusColors[health.status]}`}></div>
            <span className="capitalize">{health.status}</span>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400">Total Scans</h3>
          <p className="text-2xl font-bold mt-2">{health.metrics.totalScans}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
          <p className="text-2xl font-bold mt-2">{health.metrics.activeUsers}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400">Avg Response Time</h3>
          <p className="text-2xl font-bold mt-2">{health.metrics.averageResponseTime}ms</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400">Success Rate</h3>
          <p className="text-2xl font-bold mt-2">{health.metrics.successRate}%</p>
        </Card>
      </div>

      {/* Services Status */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Services Status</h2>
        <div className="space-y-4">
          {health.services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-gray-400">{service.latency}ms</p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    statusColors[service.status]
                  }`}
                ></div>
                <span className="text-sm capitalize">{service.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}