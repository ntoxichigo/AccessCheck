# Production Deployment Checklist

## ✅ Already Configured
- [x] Database (Supabase PostgreSQL)
- [x] Authentication (Clerk - using test keys, need to switch to live)
- [x] Payments (Stripe - LIVE mode ✅)
- [x] Database tables and schema

## ⚠️ Need to Configure

### 1. **Redis (Upstash) - Rate Limiting** 
**Status:** Not configured  
**Priority:** HIGH - Without this, API rate limiting won't work

**Setup Steps:**
1. Go to https://upstash.com
2. Sign up for free account
3. Create a new Redis database
4. Copy the REST URL and Token
5. Add to `.env.local`:
   ```bash
   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
   ```

### 2. **Resend - Email Service**
**Status:** Not configured  
**Priority:** MEDIUM - Contact forms and notifications won't send emails

**Setup Steps:**
1. Go to https://resend.com
2. Sign up (FREE: 3,000 emails/month, 100/day)
3. Get API key from https://resend.com/api-keys
4. Add to `.env.local`:
   ```bash
   RESEND_API_KEY=re_your_actual_key_here
   CONTACT_EMAIL=contact@accesscheck.pro
   ```

### 3. **Clerk Webhook Secret**
**Status:** Not configured  
**Priority:** MEDIUM - User creation/update webhooks won't work

**Setup Steps:**
1. Go to Clerk Dashboard
2. Navigate to Webhooks section
3. Add endpoint: `https://accesscheck.pro/api/webhooks/clerk`
4. Enable events: `user.created`, `user.updated`
5. Copy the "Signing Secret"
6. Add to `.env.local`:
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

### 4. **Update Base URL**
**Status:** Using localhost  
**Priority:** HIGH - Required for production

**Setup Steps:**
1. Update `.env.local` (or production env vars):
   ```bash
   NEXT_PUBLIC_BASE_URL=https://accesscheck.pro
   ```

### 5. **Switch Clerk to Live Keys**
**Status:** Using test mode  
**Priority:** HIGH for production

**Setup Steps:**
1. Go to Clerk Dashboard
2. Switch to Production keys
3. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY
   CLERK_SECRET_KEY=sk_live_YOUR_SECRET_KEY
   ```

## 📝 Optional (Nice to Have)

### Cron Secret (for scheduled tasks)
```bash
CRON_SECRET=generate_random_secret_here
```

## 🚀 Deployment Steps

1. **Configure all missing services** (see above)
2. **Run production readiness check:**
   ```bash
   npx tsx scripts/check-production-readiness.ts
   ```
3. **Verify all checks pass** (0 warnings, 0 failures)
4. **Deploy to your hosting provider** (Vercel recommended)
5. **Set environment variables** in hosting dashboard
6. **Configure Stripe webhook** endpoint in Stripe dashboard:
   - URL: `https://accesscheck.pro/api/webhooks/stripe`
   - Events: All subscription events
7. **Configure Clerk webhook** endpoint in Clerk dashboard:
   - URL: `https://accesscheck.pro/api/webhooks/clerk`
   - Events: user.created, user.updated
8. **Test critical flows:**
   - [ ] Sign up
   - [ ] Sign in
   - [ ] Start trial
   - [ ] Subscribe to Pro
   - [ ] Run scan
   - [ ] Cancel subscription
   - [ ] Contact form

## 🛡️ Security Checklist

- [ ] All API keys are in environment variables (not hardcoded)
- [ ] Stripe webhook secret is configured
- [ ] Clerk webhook secret is configured
- [ ] Database password is secure
- [ ] CORS is properly configured
- [ ] Rate limiting is active (requires Redis)

## 📊 Current Status

Based on latest check:
- ✅ **13 items configured**
- ⚠️  **10 warnings** (can deploy but some features limited)
- ❌ **0 critical failures**

**Recommendation:** 
- Can deploy NOW for basic functionality
- Configure Redis + Resend for full functionality
- Switch to Clerk live keys before going public

## 🔧 Quick Setup Commands

```bash
# Check production readiness
npx tsx scripts/check-production-readiness.ts

# Sync database with Stripe (if needed)
npx tsx scripts/sync-stripe-subscriptions.ts

# Generate Prisma client (if needed)
npx prisma generate

# Run database migrations (if needed)
npx prisma migrate deploy
```

## 📞 Support

If you encounter issues:
1. Check logs in your hosting platform
2. Verify all environment variables are set
3. Run the production readiness check
4. Check Stripe webhook logs
5. Check Clerk webhook logs
