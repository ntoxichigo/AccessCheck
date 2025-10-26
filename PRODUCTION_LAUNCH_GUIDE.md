# 🚀 Production Launch Guide - Step by Step

**Total Time:** ~2-3 hours  
**Date:** October 22, 2025  
**Status:** Ready to begin

---

## 📋 **OVERVIEW**

This guide will walk you through **every single step** to launch AccessCheck to production. Follow each section in order.

### What We'll Set Up:
1. ✅ Stripe (Payments)
2. ✅ Database (Supabase)
3. ✅ Redis (Upstash)
4. ✅ Email (Resend)
5. ✅ Authentication (Clerk)
6. ✅ Hosting (Vercel)
7. ✅ Security fixes
8. ✅ Testing

**Let's get started!** 🎯

---

## 🔥 **STEP 1: STRIPE PRODUCTION SETUP** (30 minutes)

### 1.1 Create Stripe Account (if you haven't)

1. Go to: **https://dashboard.stripe.com/register**
2. Sign up with your email
3. Complete business verification (required for live payments)
4. Add your bank account for payouts

### 1.2 Switch to Live Mode

1. In Stripe Dashboard, look for the **"Test mode"** toggle in top-right
2. Click it to switch to **"Live mode"**
3. You should see "Viewing live data" message

### 1.3 Create Products

**Create Pro Plan:**
1. Click **"Products"** in left sidebar
2. Click **"+ Add product"**
3. Fill in:
   - **Name:** `Pro Plan`
   - **Description:** `Full accessibility reports, 1000 scans/month, PDF exports`
   - **Pricing:** 
     - **Price:** `$19`
     - **Billing period:** `Monthly`
     - **Currency:** `USD`
4. Click **"Save product"**
5. **COPY THE PRICE ID** (starts with `price_`) - you'll need this!

**Create Business Plan (Optional):**
1. Repeat above steps with:
   - **Name:** `Business Plan`
   - **Price:** `$99/month`
   - **Description:** `Unlimited scans, API access, priority support`
2. **COPY THE PRICE ID**

### 1.4 Get API Keys

1. Click **"Developers"** in top-right
2. Click **"API keys"**
3. You should see:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`) - Click **"Reveal live key"**
4. **COPY BOTH KEYS** - save them somewhere safe!

### 1.5 Set Up Webhook

**IMPORTANT:** We'll do this in Step 7 after deploying. For now, just note it down.

---

## 💾 **STEP 2: DATABASE PRODUCTION SETUP** (15 minutes)

### 2.1 Check Your Supabase Project

1. Go to: **https://supabase.com/dashboard**
2. Sign in
3. Find your project: `yliqulqaeiyqpuxdybay`
4. Check if it's **paused** or **active**
5. If paused, click **"Resume project"** and wait 30-60 seconds

### 2.2 Get Production Connection String

1. In Supabase Dashboard, click your project
2. Click **"Project Settings"** (gear icon)
3. Click **"Database"** in left sidebar
4. Find **"Connection string"** section
5. Select **"Connection pooling"** tab (IMPORTANT!)
6. Copy the connection string with **port 6543** (not 5432)
7. It should look like:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

### 2.3 Important Note

⚠️ **DO NOT commit this URL to Git!** We'll add it as environment variable in Step 7.

---

## 🔴 **STEP 3: REDIS SETUP (UPSTASH)** (10 minutes)

### 3.1 Create Upstash Account

1. Go to: **https://console.upstash.com/**
2. Sign up with GitHub or email
3. Verify your email

### 3.2 Create Redis Database

1. Click **"Create Database"**
2. Fill in:
   - **Name:** `accesscheck-prod`
   - **Type:** Select **"Regional"**
   - **Region:** Choose closest to your users (e.g., `us-east-1`)
   - **TLS:** ✅ Enabled
3. Click **"Create"**
4. Wait 10-20 seconds for provisioning

### 3.3 Get Connection Details

1. Click on your newly created database
2. Scroll to **"REST API"** section
3. Copy:
   - **UPSTASH_REDIS_REST_URL** (starts with `https://`)
   - **UPSTASH_REDIS_REST_TOKEN** (long string)
4. **SAVE THESE** - you'll need them soon!

---

## 📧 **STEP 4: EMAIL SETUP (RESEND)** (20 minutes)

### 4.1 Create Resend Account

1. Go to: **https://resend.com/signup**
2. Sign up with your email
3. Verify your email address

### 4.2 Verify Your Domain (IMPORTANT for production)

**Option A: Use Your Own Domain (Recommended)**

1. In Resend Dashboard, click **"Domains"**
2. Click **"+ Add Domain"**
3. Enter your domain (e.g., `accesscheck.com`)
4. You'll get DNS records to add:
   ```
   Type: TXT
   Name: _resend
   Value: [provided by Resend]
   ```
5. Add these to your domain registrar (GoDaddy, Namecheap, etc.)
6. Wait 5-10 minutes for DNS propagation
7. Click **"Verify"** in Resend

**Option B: Use Resend's Test Domain (Quick start)**

1. You can use `onboarding.resend.dev` for now
2. Note: Emails may go to spam
3. **Switch to your own domain before real launch**

### 4.3 Get API Key

1. Click **"API Keys"** in sidebar
2. Click **"+ Create API Key"**
3. Name it: `AccessCheck Production`
4. Copy the key (starts with `re_`)
5. **SAVE THIS KEY** - you can't see it again!

### 4.4 Set Contact Email

Decide which email receives contact form submissions:
- Example: `support@yourdomain.com`
- Or use: `your-email@gmail.com` (for testing)

---

## 🔐 **STEP 5: CLERK PRODUCTION SETUP** (15 minutes)

### 5.1 Check Current Setup

Your current keys are **test keys** (they have `pk_test_` and `sk_test_`).

### 5.2 Activate Production Instance

1. Go to: **https://dashboard.clerk.com**
2. Sign in
3. Select your application
4. Look for **"Production"** instance toggle
5. If you only see "Development":
   - Click **"Settings"** → **"Instances"**
   - Click **"Create production instance"**
   - Follow the prompts

### 5.3 Get Production Keys

1. Make sure you're on **"Production"** instance (check top of dashboard)
2. Click **"API Keys"** in sidebar
3. Copy:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)
4. **SAVE THESE KEYS**

### 5.4 Configure URLs (We'll do this in Step 7)

Note down that you'll need to add your production domain to Clerk's allowed origins.

---

## 🔧 **STEP 6: FIX SECURITY ISSUES** (5 minutes)

Let's fix the hardcoded admin IDs before deploying.

### 6.1 Update Admin Check Route

I'll do this for you now:

```typescript
// app/api/admin/check/route.ts
// Change from hardcoded array to environment variable
```

### 6.2 Add to Environment Variables

You'll add this in Step 7:
```
ADMIN_USER_IDS=your_clerk_user_id_here
```

**How to get your User ID:**
1. After deploying, sign up on your site
2. Go to Clerk Dashboard → Users
3. Find your user → Copy the ID (starts with `user_`)

---

## 🌐 **STEP 7: DEPLOY TO VERCEL** (30 minutes)

### 7.1 Create Vercel Account

1. Go to: **https://vercel.com/signup**
2. Sign up with **GitHub** (recommended)
3. Authorize Vercel to access your repositories

### 7.2 Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find your repository: `AccessCheck`
3. Click **"Import"**
4. **Framework Preset:** Next.js (should auto-detect)
5. **Root Directory:** `accessibility-checker`
6. Click **"Deploy"** (it will fail first - that's OK!)

### 7.3 Add Environment Variables

1. Go to your project in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add ALL of these (one by one):

#### Required Variables:

```bash
# Database
DATABASE_URL=
# [Paste your Supabase connection string from Step 2]

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
# [Paste pk_live_ key from Step 5]

CLERK_SECRET_KEY=
# [Paste sk_live_ key from Step 5]

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe Payments
STRIPE_SECRET_KEY=
# [Paste sk_live_ key from Step 1]

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# [Paste pk_live_ key from Step 1]

STRIPE_PRICE_ID_PRO=
# [Paste price_xxx from Step 1]

STRIPE_PRICE_ID_BUSINESS=
# [Paste price_xxx from Step 1 - or leave empty if you didn't create it]

STRIPE_WEBHOOK_SECRET=
# [Leave empty for now - we'll add this in Step 7.5]

# Redis
UPSTASH_REDIS_REST_URL=
# [Paste from Step 3]

UPSTASH_REDIS_REST_TOKEN=
# [Paste from Step 3]

# Email
RESEND_API_KEY=
# [Paste re_ key from Step 4]

CONTACT_EMAIL=
# [Your support email from Step 4]

# App Configuration
NEXT_PUBLIC_BASE_URL=
# [Your Vercel URL - see next step]

NODE_ENV=production

# Security
ADMIN_USER_IDS=
# [Leave empty for now - add after you create your account]

# Optional - Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=
# [Can leave empty or add if you want error tracking]

SENTRY_AUTH_TOKEN=
# [Can leave empty]
```

### 7.4 Get Your Vercel URL

1. After adding environment variables, go to **"Deployments"**
2. Click **"Redeploy"**
3. Wait 2-3 minutes for build
4. You'll get a URL like: `https://accesscheck-xxxx.vercel.app`
5. **Copy this URL**
6. Go back to **Settings** → **Environment Variables**
7. Edit `NEXT_PUBLIC_BASE_URL` and paste your URL

### 7.5 Configure Stripe Webhook (IMPORTANT!)

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click **"+ Add endpoint"**
3. **Endpoint URL:** `https://your-vercel-url.vercel.app/api/webhooks/stripe`
4. Click **"Select events"**
5. Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
6. Click **"Add endpoint"**
7. **Copy the webhook secret** (starts with `whsec_`)
8. Go back to Vercel → **Settings** → **Environment Variables**
9. Edit `STRIPE_WEBHOOK_SECRET` and paste the secret
10. **Redeploy** your app

### 7.6 Configure Clerk Allowed Origins

1. Go to **Clerk Dashboard** → **Settings** → **Domains**
2. Add your Vercel URL: `https://your-app.vercel.app`
3. Save

### 7.7 Final Redeploy

1. In Vercel, go to **Deployments**
2. Click **"Redeploy"** button
3. Wait 2-3 minutes
4. Your app should now be live! 🎉

---

## ✅ **STEP 8: TEST EVERYTHING** (20 minutes)

### 8.1 Database Test

1. Visit: `https://your-app.vercel.app`
2. Sign up for an account
3. Go to Settings → API Keys
4. Try to generate an API key
5. ✅ Should work without errors

### 8.2 Scanning Test

1. Go to **Scan** page
2. Enter a URL (e.g., `https://google.com`)
3. Click **"Scan"**
4. ✅ Should complete and show results

### 8.3 Payment Test (USE TEST CARD!)

1. Go to **Pricing** page
2. Click **"Start Trial"** or **"Upgrade to Pro"**
3. Use Stripe test card:
   - **Card Number:** `4242 4242 4242 4242`
   - **Expiry:** Any future date (e.g., `12/25`)
   - **CVC:** Any 3 digits (e.g., `123`)
   - **ZIP:** Any 5 digits (e.g., `12345`)
4. Complete checkout
5. ✅ Check Stripe Dashboard → Customers (should see your test payment)

### 8.4 Subscription Cancellation Test

1. Go to **Settings** → **Subscription**
2. Click **"Cancel Subscription"**
3. Enter a reason
4. ✅ Check Stripe Dashboard → Subscription should show "Cancels at period end"

### 8.5 Email Test

1. Go to **Contact** page
2. Fill out the form
3. Submit
4. ✅ Check your email (from Step 4.4)

### 8.6 Get Your Admin ID

1. Go to **Clerk Dashboard** → **Users**
2. Find your newly created user
3. Copy your **User ID** (starts with `user_`)
4. Go to Vercel → **Settings** → **Environment Variables**
5. Edit `ADMIN_USER_IDS` and paste your user ID
6. **Redeploy**
7. Visit: `https://your-app.vercel.app/admin`
8. ✅ You should see the admin panel

---

## 🎯 **STEP 9: CUSTOM DOMAIN (OPTIONAL)** (30 minutes)

### 9.1 Add Domain to Vercel

1. In Vercel project, go to **Settings** → **Domains**
2. Enter your domain: `accesscheck.com`
3. Click **"Add"**
4. Vercel will show DNS records to add

### 9.2 Configure DNS

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add the DNS records Vercel provided
3. Wait 5-10 minutes for propagation
4. Vercel will auto-verify and enable SSL

### 9.3 Update Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Edit `NEXT_PUBLIC_BASE_URL` to `https://accesscheck.com`
3. Update Stripe webhook URL to use your domain
4. Update Clerk allowed origins
5. **Redeploy**

---

## 📋 **FINAL CHECKLIST**

Go through this list to make sure everything is set up:

### Stripe
- [x] Live API keys added
- [x] Products created (Pro plan)
- [x] Webhook configured with production URL
- [x] Test payment completed successfully

### Database
- [x] Supabase project active
- [x] Connection string added to Vercel
- [x] Can create users and scan

### Redis
- [x] Upstash database created
- [x] REST API credentials added
- [x] Rate limiting working

### Email
- [x] Resend API key added
- [x] Domain verified (or using test domain)
- [x] Contact form sends emails

### Clerk
- [x] Production instance active
- [x] Live API keys added
- [x] Domain added to allowed origins
- [x] Can sign up and sign in

### Vercel
- [x] All environment variables set
- [x] App deployed successfully
- [x] No build errors
- [x] SSL certificate active

### Security
- [x] Admin ID moved to environment variable
- [x] No sensitive data in code
- [x] Webhook secrets configured

### Testing
- [x] Sign up works
- [x] Scanning works
- [x] Payments work
- [x] Cancellation works
- [x] Email works
- [x] Admin panel accessible

---

## 🚨 **COMMON ISSUES & SOLUTIONS**

### Issue: "Database connection failed"
**Solution:** 
- Check if Supabase project is paused
- Verify DATABASE_URL is correct
- Make sure you're using port 6543 (pooler)

### Issue: "Stripe webhook not receiving events"
**Solution:**
- Check webhook URL matches your deployment
- Verify STRIPE_WEBHOOK_SECRET is correct
- Check Stripe Dashboard → Webhooks → Events

### Issue: "Clerk authentication not working"
**Solution:**
- Verify you're using LIVE keys (pk_live_, not pk_test_)
- Check domain is added to Clerk allowed origins
- Clear browser cache and try again

### Issue: "Build fails on Vercel"
**Solution:**
- Check Vercel logs for specific error
- Ensure all environment variables are set
- Try: `npm run build` locally first

---

## 🎉 **CONGRATULATIONS!**

If you've completed all steps, your app is now **LIVE IN PRODUCTION**! 

### Next Steps:
1. Share your app with friends for beta testing
2. Monitor Stripe Dashboard for payments
3. Check Vercel Analytics for traffic
4. Set up monitoring alerts (optional)
5. Create marketing materials

### Support:
- **Stripe Issues:** https://support.stripe.com
- **Vercel Issues:** https://vercel.com/support
- **Clerk Issues:** https://clerk.com/support

---

**Need help?** Let me know which step you're on and I'll guide you through it! 🚀
