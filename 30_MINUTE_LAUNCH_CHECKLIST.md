# ⚡ 30-Minute Launch Checklist

**Goal:** Get AccessCheck production-ready in 30 minutes

---

## 🔴 CRITICAL (Must Do - 10 minutes)

### 1. Fix Prisma Client (5 minutes)
```powershell
# Step 1: Close VS Code completely
# Step 2: Reopen VS Code
# Step 3: Run this command
npx prisma generate
```

**Why:** Fixes TypeScript errors in billing portal and webhook routes

**Verify:**
```powershell
# Should show no errors
npm run build
```

---

### 2. Verify Environment Variables (5 minutes)

Check `.env.local` has these CRITICAL variables:

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://..."

# Clerk (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Stripe (REQUIRED)
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID_PRO="price_..."

# App (REQUIRED)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**Test:**
```powershell
npm run dev
# Visit http://localhost:3000
# Try to sign up
# Try to scan
```

---

## 🟡 IMPORTANT (Should Do - 15 minutes)

### 3. Test Payment Flow (10 minutes)

1. **Start trial:**
   - Sign in
   - Go to pricing page
   - Click "Start Free Trial"
   - Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

2. **Verify trial activated:**
   - Check dashboard shows "Pro Trial Active"
   - Try scanning (should allow 10/day)
   - Check database: `subscription` should be 'pro'

3. **Test cancellation:**
   - Visit `/api/billing/portal` (creates portal session)
   - Cancel subscription in Stripe portal
   - Verify access continues until trial end

---

### 4. Test Core Features (5 minutes)

```
✅ Sign up → Works?
✅ Sign in → Works?
✅ Scan URL → Returns results?
✅ View scan history → Shows past scans?
✅ Upgrade modal → Shows correct pricing?
✅ PDF export → Downloads (Pro users)?
```

---

## 🟢 OPTIONAL (Nice to Have - 5 minutes)

### 5. Create .env.example

```powershell
# Copy your .env.local
cp .env.local .env.example

# Remove sensitive values
# Replace with placeholders
```

**`.env.example` template:**
```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/database"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID_PRO="price_..."
NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID="prctbl_..."

# Email (Optional)
RESEND_API_KEY="re_..."
CONTACT_EMAIL="support@yourdomain.com"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
CRON_SECRET="random-secret-string"

# Monitoring (Optional)
SENTRY_AUTH_TOKEN=""
NEXT_PUBLIC_POSTHOG_KEY=""
```

---

## ✅ DONE! You're Ready to Deploy

### Deploy to Vercel (10 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Set environment variables in Vercel dashboard:**
- Project Settings → Environment Variables
- Add all variables from `.env.local`
- Redeploy

---

## 🎉 POST-LAUNCH (First Hour)

### Monitor These:

1. **Sentry Dashboard**
   - Watch for errors
   - Fix critical issues immediately

2. **Stripe Dashboard**
   - Verify webhooks are firing
   - Check test payments going through

3. **Database**
   - Monitor connection count
   - Check query performance

4. **Vercel Analytics**
   - Track visitor count
   - Monitor page load times

---

## 🚨 EMERGENCY CONTACTS

If something breaks:

1. **Check Sentry** (errors)
2. **Check Vercel Logs** (deployment issues)
3. **Check Stripe Webhooks** (payment issues)
4. **Check Database Logs** (query issues)

**Rollback command:**
```bash
vercel rollback
```

---

## 📞 SUPPORT CHANNELS

- **Email:** User sees contact form
- **Dashboard:** Users can open support ticket
- **Admin:** Check `/admin` for user issues

---

**Total Time:** 30 minutes  
**Difficulty:** Easy  
**Result:** Production-ready app! 🚀

---

**Last Updated:** October 17, 2025  
**Next Review:** After first 10 signups
