/**
 * Environment Variable Validation
 * Validates all required environment variables at app startup
 * Prevents runtime crashes due to missing configuration
 */

const requiredEnvVars = [
  // Database
  "DATABASE_URL",
  
  // Clerk Authentication
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  
  // Stripe
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  
  // Redis (Upstash)
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  
  // App Configuration
  "NEXT_PUBLIC_BASE_URL",
] as const;

const optionalEnvVars = [
  "STRIPE_PRICE_ID_PRO",
  "STRIPE_PRICE_ID_BUSINESS",
  "NODE_ENV",
  "ENABLE_ERROR_LOGGING",
  "ERROR_LOG_LEVEL",
] as const;

export function validateEnv() {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check optional but recommended variables
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  }

  // Report missing required variables
  if (missing.length > 0) {
    const errorMessage = `
╔════════════════════════════════════════════════════════════════╗
║                  ❌ MISSING ENVIRONMENT VARIABLES               ║
╚════════════════════════════════════════════════════════════════╝

The following required environment variables are missing:

${missing.map(v => `  ❌ ${v}`).join('\n')}

Please add these to your .env.local file or environment configuration.
See .env.example for reference.

The application cannot start without these variables.
╔════════════════════════════════════════════════════════════════╗
`;
    console.error(errorMessage);
    
    // Only throw in production - allow development to continue with warnings
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    } else {
      console.warn('\n⚠️  Running in development mode with missing env vars - some features may not work!\n');
    }
  }

  // Report warnings for optional variables
  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn(`
⚠️  Optional environment variables not set:
${warnings.map(v => `  ⚠️  ${v}`).join('\n')}

These are optional but recommended for full functionality.
See .env.example for details.
`);
  }

  // Validate formats
  validateEnvFormats();

  if (missing.length === 0 && process.env.NODE_ENV !== 'test') {
    console.log('✅ Environment variables validated successfully');
  }
};

function validateEnvFormats() {
  // Validate DATABASE_URL format
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
    console.warn('⚠️  DATABASE_URL should start with postgresql://');
  }

  // Validate Stripe keys format
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    console.warn('⚠️  STRIPE_SECRET_KEY should start with sk_test_ or sk_live_');
  }

  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
      !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
    console.warn('⚠️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY should start with pk_test_ or pk_live_');
  }

  // Validate Clerk keys format
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
      !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_')) {
    console.warn('⚠️  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY should start with pk_test_ or pk_live_');
  }

  // Validate Redis URL format
  if (process.env.UPSTASH_REDIS_REST_URL && 
      !process.env.UPSTASH_REDIS_REST_URL.startsWith('https://')) {
    console.warn('⚠️  UPSTASH_REDIS_REST_URL should start with https://');
  }

  // Validate BASE_URL format
  if (process.env.NEXT_PUBLIC_BASE_URL && 
      !process.env.NEXT_PUBLIC_BASE_URL.startsWith('http')) {
    console.warn('⚠️  NEXT_PUBLIC_BASE_URL should start with http:// or https://');
  }

  // Production-specific warnings
  if (process.env.NODE_ENV === 'production') {
    if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
      console.warn('⚠️  WARNING: Using Stripe TEST keys in production!');
    }
    
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('test')) {
      console.warn('⚠️  WARNING: Using Clerk TEST keys in production!');
    }

    if (process.env.NEXT_PUBLIC_BASE_URL === 'http://localhost:3000') {
      console.error('❌ ERROR: NEXT_PUBLIC_BASE_URL is still set to localhost in production!');
      throw new Error('Invalid NEXT_PUBLIC_BASE_URL for production');
    }
  }
}

// Auto-validate on import in non-test environments
if (process.env.NODE_ENV !== 'test') {
  validateEnv();
}
