import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { log } from '../../../../lib/logger';
import { AppError, handleApiError } from '../../../../lib/errors';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    // Check if user is admin
    const isAdmin = await redis.get(`user:${user.id}:isAdmin`);
    if (!isAdmin) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }

    // Get system metrics
    const [
      totalScans,
      activeUsers,
      successfulScans,
      failedScans,
    ] = await Promise.all([
      redis.get('metrics:totalScans'),
      redis.get('metrics:activeUsers'),
      redis.get('metrics:successfulScans'),
      redis.get('metrics:failedScans'),
    ]);

    // Calculate metrics
    const totalScansCount = Number(totalScans) || 0;
    const successfulScansCount = Number(successfulScans) || 0;
    const failedScansCount = Number(failedScans) || 0;
    const errorRate = totalScansCount ? (failedScansCount / totalScansCount) * 100 : 0;
    const successRate = totalScansCount ? (successfulScansCount / totalScansCount) * 100 : 0;

    // Get service status
    const services: Array<{
      name: string;
      status: 'operational' | 'degraded' | 'down';
      latency: number;
    }> = [
      {
        name: 'Scan Engine',
        status: errorRate < 5 ? 'operational' : errorRate < 15 ? 'degraded' : 'down',
        latency: await getServiceLatency('scan'),
      },
      {
        name: 'Database',
        status: await checkDatabaseHealth(),
        latency: await getServiceLatency('database'),
      },
      {
        name: 'Authentication',
        status: 'operational' as const,
        latency: await getServiceLatency('auth'),
      },
    ];

    // Determine overall system status
    const status = determineSystemStatus(services);

    return NextResponse.json({
      status,
      lastChecked: new Date().toISOString(),
      metrics: {
        totalScans: totalScansCount,
        activeUsers: Number(activeUsers) || 0,
        averageResponseTime: await getAverageResponseTime(),
        errorRate,
        successRate,
      },
      services,
    });

  } catch (error) {
    log.error('Health check failed', { error: error instanceof Error ? error : new Error(String(error)) });
    return handleApiError(error);
  }
}

async function getServiceLatency(service: string): Promise<number> {
  const latency = await redis.get(`metrics:latency:${service}`);
  return Number(latency) || 0;
}

async function checkDatabaseHealth(): Promise<'operational' | 'degraded' | 'down'> {
  try {
    const startTime = Date.now();
    await redis.ping();
    const latency = Date.now() - startTime;
    
    if (latency < 100) return 'operational';
    if (latency < 500) return 'degraded';
    return 'down';
  } catch {
    return 'down';
  }
}

async function getAverageResponseTime(): Promise<number> {
  const times = await redis.get('metrics:averageResponseTime');
  return Number(times) || 0;
}

function determineSystemStatus(
  services: Array<{ status: 'operational' | 'degraded' | 'down' }>
): 'healthy' | 'degraded' | 'down' {
  const statuses = services.map(s => s.status);
  
  if (statuses.includes('down')) return 'down';
  if (statuses.includes('degraded')) return 'degraded';
  return 'healthy';
}