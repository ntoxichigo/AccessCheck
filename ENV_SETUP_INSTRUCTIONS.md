# Environment Setup Instructions

## Critical Issues to Fix

Your application is missing required environment variables and has database connection issues. Follow these steps to resolve them:

---

## 1. Database Connection (CRITICAL)

**Issue:** Cannot connect to Supabase database at `db.yliqulqaeiyqpuxdybay.supabase.co:5432`

**Possible Causes:**
- Database is paused (Supabase pauses inactive free-tier databases)
- Database credentials are incorrect
- Network/firewall issue

**Solutions:**

### Option A: Reactivate Supabase Database
1. Go to https://supabase.com/dashboard
2. Find your project
3. Check if it's paused - if so, click "Resume"
4. Verify your database is running

### Option B: Use Connection Pooling (Recommended for Production)
Supabase provides two connection strings:
- **Direct connection:** `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`
- **Connection pooler:** `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:6543/postgres?pgbouncer=true`

Try using the connection pooler (port 6543):
```bash
DATABASE_URL="postgresql://postgres:Kurosaki_950@db.yliqulqaeiyqpuxdybay.supabase.co:6543/postgres?pgbouncer=true"
```

### Option C: Create New Database
If your Supabase database is deleted or inaccessible:
1. Create a new Supabase project at https://supabase.com
2. Get the connection string from Project Settings → Database
3. Update `DATABASE_URL` in `.env.local`
4. Run `npx prisma db push` to create tables

---

## 2. Redis (Upstash) Setup (CRITICAL)

**Issue:** Missing `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

**Solution:**
1. Sign up at https://upstash.com (free tier available)
2. Create a new Redis database
3. Copy the REST URL and REST TOKEN
4. Add to `.env.local`:
```bash
UPSTASH_REDIS_REST_URL=https://your-redis-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXAbCdEfGhIjKlMnOpQrStUvWxYz...
```

---

## 3. Stripe Webhook Secret (CRITICAL)

**Issue:** Missing `STRIPE_WEBHOOK_SECRET`

**Solution:**
1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Enter your endpoint URL: `http://localhost:3000/api/webhooks/stripe` (for local testing)
4. Select events to listen to (at minimum: `checkout.session.completed`, `customer.subscription.updated`)
5. Copy the webhook signing secret (starts with `whsec_`)
6. Add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

---

## 4. Optional but Recommended Variables

### Stripe Price IDs
Get these from Stripe Dashboard → Products:
```bash
STRIPE_PRICE_ID_PRO=price_xxxxx
STRIPE_PRICE_ID_BUSINESS=price_xxxxx
```

### Email Service (Resend)
Sign up at https://resend.com and get your API key:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=support@yourdomain.com
```

---

## 5. Updated .env.local Template

Here's what your complete `.env.local` should look like:

```bash
# Database (CRITICAL - Check if Supabase is paused or use connection pooler)
DATABASE_URL="postgresql://postgres:Kurosaki_950@db.yliqulqaeiyqpuxdybay.supabase.co:6543/postgres?pgbouncer=true"

# Clerk Authentication (Already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bm90YWJsZS1oZXJyaW5nLTYzLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_E0ErNZ0jquIsNOLgeJQgU5LKN9zSRJXp3cMbG650uY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
STRIPE_PRICE_ID_PRO=price_your_pro_price_id
STRIPE_PRICE_ID_BUSINESS=price_your_business_price_id

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Redis (Upstash) - REQUIRED
UPSTASH_REDIS_REST_URL=https://your-redis-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_actual_token

# Environment
NODE_ENV=development

# Error Reporting
ENABLE_ERROR_LOGGING=true
ERROR_LOG_LEVEL=debug

# Email Service (Resend)
RESEND_API_KEY=re_your_actual_api_key
CONTACT_EMAIL=support@accesscheck.com
```

---

## 6. Cron Job Secret (for Trial Reminder Emails)

**Issue:** Missing `CRON_SECRET` for securing cron job endpoints

**Solution:**
1. Generate a secure random string:
   ```bash
   # On Windows (PowerShell):
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
   
   # On Linux/Mac:
   openssl rand -base64 32
   ```
2. Add to `.env.local`:
   ```bash
   CRON_SECRET=your-generated-secure-random-string
   ```

This secret is used to authenticate the daily cron job that sends trial reminder emails.

---

## 7. After Updating Environment Variables

1. **Stop the dev server** (Ctrl+C)
2. **Restart the dev server:**
   ```bash
   npm run dev
   ```
3. **Verify database connection:**
   ```bash
   npx prisma db pull
   ```
4. **Test the application** at http://localhost:3000

---

## 8. Quick Checklist

- [ ] Supabase database is running (not paused)
- [ ] DATABASE_URL is correct and accessible
- [ ] Upstash Redis account created
- [ ] UPSTASH_REDIS_REST_URL and TOKEN added
- [ ] Stripe webhook endpoint created
- [ ] STRIPE_WEBHOOK_SECRET added
- [ ] NEXT_PUBLIC_BASE_URL is set
- [ ] CRON_SECRET generated and added
- [ ] Dev server restarted after changes

---

## Need Help?

If you're still experiencing issues:

1. **Database issues:** Check Supabase dashboard for database status
2. **Redis issues:** Verify Upstash credentials are copied correctly
3. **Stripe issues:** Ensure webhook endpoint matches your local URL
4. **Cron job issues:** Ensure CRON_SECRET is set in both local `.env.local` and Vercel environment variables
5. **General issues:** Check the terminal output for specific error messages

All environment variables must be set for the application to work correctly.
