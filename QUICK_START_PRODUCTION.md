# 📋 Quick Reference - Production Setup

## ⚡ **30-SECOND OVERVIEW**

Total Time: ~2-3 hours to production  
Main Tasks: Set up 5 services + Deploy

---

## 🔑 **WHAT YOU NEED**

### 1. **Stripe** (Payments) - 30 min
- [ ] Create account: https://dashboard.stripe.com/register
- [ ] Switch to Live mode
- [ ] Create "Pro Plan" product ($19/month)
- [ ] Copy API keys (pk_live_, sk_live_)
- [ ] Copy Price ID (price_xxxxx)
- **Save:** 3 keys

### 2. **Supabase** (Database) - 15 min
- [ ] Check if project is active: https://supabase.com/dashboard
- [ ] Resume if paused
- [ ] Get connection string (port 6543 - pooler)
- **Save:** 1 connection string

### 3. **Upstash** (Redis) - 10 min
- [ ] Create account: https://console.upstash.com
- [ ] Create database (regional, closest region)
- [ ] Copy REST API credentials
- **Save:** 2 keys (URL + token)

### 4. **Resend** (Email) - 20 min
- [ ] Create account: https://resend.com/signup
- [ ] Get API key
- [ ] (Optional) Verify domain
- **Save:** 1 API key + 1 email address

### 5. **Clerk** (Auth) - 15 min
- [ ] Go to: https://dashboard.clerk.com
- [ ] Create production instance
- [ ] Copy API keys (pk_live_, sk_live_)
- **Save:** 2 keys

### 6. **Vercel** (Hosting) - 30 min
- [ ] Create account: https://vercel.com/signup
- [ ] Import GitHub repository
- [ ] Add all environment variables
- [ ] Deploy
- **Save:** Your deployed URL

---

## 📝 **ENVIRONMENT VARIABLES CHECKLIST**

Copy this list and fill in as you go:

```bash
✅ DATABASE_URL=_______________
✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=_______________
✅ CLERK_SECRET_KEY=_______________
✅ STRIPE_SECRET_KEY=_______________
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=_______________
✅ STRIPE_PRICE_ID_PRO=_______________
✅ STRIPE_WEBHOOK_SECRET=_______________ (do this AFTER deploying)
✅ UPSTASH_REDIS_REST_URL=_______________
✅ UPSTASH_REDIS_REST_TOKEN=_______________
✅ RESEND_API_KEY=_______________
✅ CONTACT_EMAIL=_______________
✅ NEXT_PUBLIC_BASE_URL=_______________ (your Vercel URL)
✅ ADMIN_USER_IDS=_______________ (do this AFTER signing up)
✅ NODE_ENV=production
```

**Total:** 14 required variables

---

## 🚀 **SIMPLIFIED WORKFLOW**

### Phase 1: Setup Services (90 min)
1. **Stripe** → Get 3 keys
2. **Supabase** → Get 1 string
3. **Upstash** → Get 2 keys
4. **Resend** → Get 1 key + email
5. **Clerk** → Get 2 keys

### Phase 2: Deploy (30 min)
1. Sign up for Vercel
2. Import your GitHub repo
3. Add all environment variables
4. Click Deploy
5. Copy your URL

### Phase 3: Post-Deploy (15 min)
1. Configure Stripe webhook
2. Sign up on your site
3. Get your admin ID
4. Add to environment variables
5. Test everything

**DONE!** 🎉

---

## 🆘 **STUCK? SKIP TO:**

- **Page 1** of `PRODUCTION_LAUNCH_GUIDE.md` → Stripe setup
- **Page 2** → Database setup
- **Page 3** → Redis setup
- **Page 4** → Email setup
- **Page 5** → Clerk setup
- **Page 6** → Vercel deployment
- **Page 7** → Testing

---

## 💬 **COMMON QUESTIONS**

**Q: Can I use free tiers?**  
A: Yes! Supabase, Upstash, and Resend have free tiers. Stripe and Clerk are free until you get customers.

**Q: Do I need my own domain?**  
A: No! Vercel gives you a free subdomain. You can add your own domain later.

**Q: What if I get stuck?**  
A: Check the detailed guide (`PRODUCTION_LAUNCH_GUIDE.md`) for step-by-step screenshots and troubleshooting.

**Q: Can I test payments without a real card?**  
A: Yes! Use Stripe test card: `4242 4242 4242 4242`

**Q: How much will this cost?**  
A: $0 to start! All services have free tiers. You only pay when you get customers.

---

## ✅ **READY TO START?**

Open: `PRODUCTION_LAUNCH_GUIDE.md`

Start with Step 1: Stripe Setup

Good luck! 🚀
