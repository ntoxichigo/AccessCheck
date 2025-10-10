import redis, { setMetric } from '../lib/redis';

async function initializeRedis() {
  try {
    console.log('Initializing Redis...');

    // Initialize metrics
    await Promise.all([
      setMetric('totalScans', 0),
      setMetric('activeUsers', 0),
      setMetric('successfulScans', 0),
      setMetric('failedScans', 0),
      setMetric('averageResponseTime', 0),
    ]);

    // Set initial rate limits
    await Promise.all([
      redis.set('ratelimit:scan:free', { tokens: 5, interval: 86400000 }),
      redis.set('ratelimit:scan:pro', { tokens: 100, interval: 86400000 }),
      redis.set('ratelimit:api:free', { tokens: 100, interval: 3600000 }),
      redis.set('ratelimit:api:pro', { tokens: 1000, interval: 3600000 }),
    ]);

    // Set admin users (replace with actual admin user IDs)
    const adminUsers = [
      'user_2Nm1234567890', // Replace with your admin user ID from Clerk
    ];

    await Promise.all(
      adminUsers.map(userId => 
        redis.set(`user:${userId}:isAdmin`, true)
      )
    );

    console.log('Redis initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Redis initialization failed:', error);
    process.exit(1);
  }
}

initializeRedis();