# ✅ Production Deployment Checklist

**Print this and check off as you go!**

---

## 🎯 PHASE 1: SERVICE SETUP

### Stripe (Payments)
- [ ] Created Stripe account
- [ ] Switched to Live mode
- [ ] Created Pro product ($19/month)
- [ ] Copied `STRIPE_SECRET_KEY` (sk_live_...)
- [ ] Copied `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...)
- [ ] Copied `STRIPE_PRICE_ID_PRO` (price_...)
- [ ] **Time:** 30 minutes

### Supabase (Database)
- [ ] Logged into Supabase dashboard
- [ ] Checked project is active (not paused)
- [ ] Copied connection string with port 6543
- [ ] Copied `DATABASE_URL`
- [ ] **Time:** 15 minutes

### Upstash (Redis)
- [ ] Created Upstash account
- [ ] Created new Redis database
- [ ] Selected region closest to users
- [ ] Copied `UPSTASH_REDIS_REST_URL`
- [ ] Copied `UPSTASH_REDIS_REST_TOKEN`
- [ ] **Time:** 10 minutes

### Resend (Email)
- [ ] Created Resend account
- [ ] Created API key
- [ ] Copied `RESEND_API_KEY` (re_...)
- [ ] Decided on `CONTACT_EMAIL`
- [ ] (Optional) Verified domain
- [ ] **Time:** 20 minutes

### Clerk (Authentication)
- [ ] Logged into Clerk dashboard
- [ ] Created production instance
- [ ] Copied `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (pk_live_...)
- [ ] Copied `CLERK_SECRET_KEY` (sk_live_...)
- [ ] **Time:** 15 minutes

---

## 🚀 PHASE 2: DEPLOYMENT

### Code Fixes
- [ ] Admin IDs moved to environment variable ✅ (already done!)
- [ ] `.env.example` updated ✅ (already done!)

### Vercel Setup
- [ ] Created Vercel account
- [ ] Connected to GitHub
- [ ] Imported AccessCheck repository
- [ ] Set root directory to `accessibility-checker`

### Environment Variables (14 total)
- [ ] `DATABASE_URL`
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_PRICE_ID_PRO`
- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `RESEND_API_KEY`
- [ ] `CONTACT_EMAIL`
- [ ] `NEXT_PUBLIC_BASE_URL` (your Vercel URL)
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`

### Deploy
- [ ] Clicked "Deploy" in Vercel
- [ ] Wait for build (2-3 minutes)
- [ ] Copied deployment URL
- [ ] Updated `NEXT_PUBLIC_BASE_URL` with URL
- [ ] Redeployed
- [ ] **Time:** 30 minutes

---

## 🔧 PHASE 3: POST-DEPLOYMENT

### Stripe Webhook
- [ ] Opened Stripe Dashboard → Webhooks
- [ ] Added endpoint: `https://your-url.vercel.app/api/webhooks/stripe`
- [ ] Selected all 6 events
- [ ] Copied webhook secret
- [ ] Added `STRIPE_WEBHOOK_SECRET` to Vercel
- [ ] Redeployed

### Clerk Configuration
- [ ] Opened Clerk Dashboard → Settings → Domains
- [ ] Added Vercel URL to allowed origins
- [ ] Saved

### Admin Access
- [ ] Signed up on your live site
- [ ] Went to Clerk Dashboard → Users
- [ ] Copied your User ID
- [ ] Added to `ADMIN_USER_IDS` in Vercel
- [ ] Redeployed
- [ ] **Time:** 15 minutes

---

## ✅ PHASE 4: TESTING

### Database Test
- [ ] Visited your site
- [ ] Signed up successfully
- [ ] Went to Settings → API Keys
- [ ] Generated an API key
- [ ] ✅ No errors

### Scanning Test
- [ ] Went to Scan page
- [ ] Entered URL: `https://google.com`
- [ ] Clicked Scan
- [ ] ✅ Got results

### Payment Test (Use Test Card!)
- [ ] Went to Pricing page
- [ ] Clicked "Upgrade to Pro"
- [ ] Card: `4242 4242 4242 4242`
- [ ] Expiry: `12/25`
- [ ] CVC: `123`
- [ ] ZIP: `12345`
- [ ] ✅ Payment successful
- [ ] ✅ Checked Stripe Dashboard

### Cancellation Test
- [ ] Went to Settings → Subscription
- [ ] Clicked Cancel
- [ ] Entered reason
- [ ] ✅ Confirmed
- [ ] ✅ Checked Stripe Dashboard shows "Cancels at period end"

### Email Test
- [ ] Went to Contact page
- [ ] Filled form
- [ ] Submitted
- [ ] ✅ Received email

### Admin Test
- [ ] Visited `/admin` page
- [ ] ✅ Can access admin panel
- [ ] **Time:** 20 minutes

---

## 🎉 LAUNCH!

### Pre-Launch Final Checks
- [ ] All tests passed
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SSL certificate active (https://)
- [ ] All links work

### Optional: Custom Domain
- [ ] Purchased domain
- [ ] Added to Vercel
- [ ] Updated DNS records
- [ ] Updated environment variables
- [ ] Updated Stripe webhook URL
- [ ] Updated Clerk allowed origins

### Marketing
- [ ] Shared on social media
- [ ] Told friends
- [ ] Posted on relevant forums
- [ ] Created Product Hunt listing

---

## 📊 PROGRESS TRACKER

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| 1. Service Setup | 5 services | 90 min | ⬜ |
| 2. Deployment | Vercel + env vars | 30 min | ⬜ |
| 3. Post-Deploy | Webhooks + admin | 15 min | ⬜ |
| 4. Testing | 6 tests | 20 min | ⬜ |

**Total:** ~2.5 hours to production! 🚀

---

## 🆘 NEED HELP?

**Detailed Guide:** `PRODUCTION_LAUNCH_GUIDE.md`  
**Quick Reference:** `QUICK_START_PRODUCTION.md`  
**Environment Template:** `.env.example`

**Stuck on a specific service?**
- Stripe: https://stripe.com/docs
- Supabase: https://supabase.com/docs
- Upstash: https://docs.upstash.com
- Resend: https://resend.com/docs
- Clerk: https://clerk.com/docs
- Vercel: https://vercel.com/docs

---

**You got this! 💪**
