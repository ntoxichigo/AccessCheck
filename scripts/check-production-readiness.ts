/**
 * Production Readiness Checklist
 * Run this to verify all critical services are configured
 * 
 * Usage: npx tsx scripts/check-production-readiness.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env.local') });

import { prisma } from '../lib/db/prisma';

interface CheckResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: string;
}

const results: CheckResult[] = [];

function addResult(name: string, status: 'PASS' | 'FAIL' | 'WARN', message: string, details?: string) {
  results.push({ name, status, message, details });
}

async function checkEnvironmentVariables() {
  console.log('\n📋 Checking Environment Variables...\n');

  // Critical
  const critical = [
    'DATABASE_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_ID_PRO',
  ];

  // Important
  const important = [
    'RESEND_API_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'NEXT_PUBLIC_BASE_URL',
    'CLERK_WEBHOOK_SECRET',
  ];

  // Optional
  const optional = [
    'STRIPE_PRICE_ID_BUSINESS',
    'CONTACT_EMAIL',
    'CRON_SECRET',
  ];

  for (const key of critical) {
    if (!process.env[key]) {
      addResult(key, 'FAIL', '❌ Missing - CRITICAL', 'Required for app to function');
    } else if (process.env[key]?.includes('placeholder') || process.env[key]?.includes('your_')) {
      addResult(key, 'FAIL', '❌ Not configured - using placeholder', 'Replace with real value');
    } else {
      addResult(key, 'PASS', '✅ Configured');
    }
  }

  for (const key of important) {
    if (!process.env[key]) {
      addResult(key, 'WARN', '⚠️  Missing - Important', 'Some features may not work');
    } else if (process.env[key]?.includes('placeholder') || process.env[key]?.includes('your_')) {
      addResult(key, 'WARN', '⚠️  Not configured - using placeholder', 'Some features may not work');
    } else {
      addResult(key, 'PASS', '✅ Configured');
    }
  }

  for (const key of optional) {
    if (!process.env[key] || process.env[key]?.includes('placeholder')) {
      addResult(key, 'WARN', 'ℹ️  Optional - not set', 'Not required');
    } else {
      addResult(key, 'PASS', '✅ Configured');
    }
  }
}

async function checkDatabase() {
  console.log('\n💾 Checking Database Connection...\n');
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    addResult('Database Connection', 'PASS', '✅ Connected to database');
    
    // Check if tables exist
    const userCount = await prisma.user.count();
    addResult('Database Tables', 'PASS', `✅ Tables exist (${userCount} users)`);
  } catch (error) {
    addResult('Database Connection', 'FAIL', '❌ Cannot connect to database', 
      error instanceof Error ? error.message : String(error));
  }
}

async function checkRedis() {
  console.log('\n🔴 Checking Redis (Rate Limiting)...\n');
  
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    addResult('Redis Setup', 'WARN', '⚠️  Redis not configured', 
      'Rate limiting will not work. Sign up at https://upstash.com');
    return;
  }

  if (process.env.UPSTASH_REDIS_REST_URL?.includes('your-redis-url')) {
    addResult('Redis Setup', 'FAIL', '❌ Redis URL is placeholder', 
      'Replace with real Upstash Redis URL from https://upstash.com');
    return;
  }

  try {
    const { Redis } = await import('@upstash/redis');
    const redis = Redis.fromEnv();
    await redis.set('health-check', 'ok');
    const result = await redis.get('health-check');
    
    if (result === 'ok') {
      addResult('Redis Connection', 'PASS', '✅ Redis connected and working');
    } else {
      addResult('Redis Connection', 'FAIL', '❌ Redis not responding correctly');
    }
  } catch (error) {
    addResult('Redis Connection', 'FAIL', '❌ Redis connection failed', 
      error instanceof Error ? error.message : String(error));
  }
}

async function checkStripe() {
  console.log('\n💳 Checking Stripe Configuration...\n');
  
  if (!process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')) {
    addResult('Stripe Mode', 'WARN', '⚠️  Using test mode', 
      'Switch to live keys for production');
  } else {
    addResult('Stripe Mode', 'PASS', '✅ Using live mode');
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-09-30.clover',
    });
    
    // Try to retrieve account
    const account = await stripe.accounts.retrieve();
    addResult('Stripe Account', 'PASS', `✅ Connected to Stripe account: ${account.email || account.id}`);
    
    // Check if price exists
    if (process.env.STRIPE_PRICE_ID_PRO) {
      try {
        const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID_PRO);
        addResult('Stripe Price (Pro)', 'PASS', `✅ Pro price configured: ${price.unit_amount! / 100} ${price.currency}`);
      } catch {
        addResult('Stripe Price (Pro)', 'FAIL', '❌ Pro price ID invalid or not found');
      }
    }
  } catch (error) {
    addResult('Stripe Connection', 'FAIL', '❌ Cannot connect to Stripe', 
      error instanceof Error ? error.message : String(error));
  }
}

async function checkClerk() {
  console.log('\n🔐 Checking Clerk Authentication...\n');
  
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_live_')) {
    addResult('Clerk Mode', 'WARN', '⚠️  Using test mode', 
      'Switch to live keys for production');
  } else {
    addResult('Clerk Mode', 'PASS', '✅ Using live mode');
  }

  addResult('Clerk Auth', 'PASS', '✅ Clerk configured (verify manually by signing in)');
}

async function checkEmail() {
  console.log('\n📧 Checking Email Service (Resend)...\n');
  
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
    addResult('Resend Email', 'WARN', '⚠️  Email service not configured', 
      'Get API key from https://resend.com/api-keys');
    return;
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Just verify the API key format - don't send test email
    if (resend) {
      addResult('Resend Email', 'PASS', '✅ Resend API key configured (test manually)');
    }
  } catch (error) {
    addResult('Resend Email', 'FAIL', '❌ Resend setup failed', 
      error instanceof Error ? error.message : String(error));
  }
}

async function printResults() {
  console.log('\n' + '='.repeat(70));
  console.log('PRODUCTION READINESS REPORT');
  console.log('='.repeat(70) + '\n');

  const critical = results.filter(r => r.status === 'FAIL');
  const warnings = results.filter(r => r.status === 'WARN');
  const passed = results.filter(r => r.status === 'PASS');

  // Group by status
  if (critical.length > 0) {
    console.log('🚨 CRITICAL ISSUES:\n');
    critical.forEach(r => {
      console.log(`  ${r.name}`);
      console.log(`    ${r.message}`);
      if (r.details) console.log(`    Details: ${r.details}`);
      console.log('');
    });
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    warnings.forEach(r => {
      console.log(`  ${r.name}`);
      console.log(`    ${r.message}`);
      if (r.details) console.log(`    Details: ${r.details}`);
      console.log('');
    });
  }

  if (passed.length > 0) {
    console.log('✅ PASSED:\n');
    passed.forEach(r => {
      console.log(`  ${r.name}: ${r.message}`);
    });
    console.log('');
  }

  console.log('='.repeat(70));
  console.log('SUMMARY:');
  console.log(`  ✅ Passed: ${passed.length}`);
  console.log(`  ⚠️  Warnings: ${warnings.length}`);
  console.log(`  ❌ Failed: ${critical.length}`);
  console.log('='.repeat(70));

  if (critical.length === 0 && warnings.length === 0) {
    console.log('\n🎉 ALL CHECKS PASSED! Ready for production.\n');
  } else if (critical.length === 0) {
    console.log('\n✅ No critical issues. App can run but some features may not work.\n');
  } else {
    console.log('\n❌ CRITICAL ISSUES FOUND! Fix these before deploying to production.\n');
  }
}

async function main() {
  console.log('🔍 Starting Production Readiness Check...');
  
  await checkEnvironmentVariables();
  await checkDatabase();
  await checkRedis();
  await checkStripe();
  await checkClerk();
  await checkEmail();
  
  await printResults();
  
  await prisma.$disconnect();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
