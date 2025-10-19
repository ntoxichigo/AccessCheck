# 🚀 Supabase Setup Guide for AccessCheck

**Date:** October 15, 2025

## 🔴 Current Issue

Your `.env.local` file references a Supabase project ID that doesn't exist:
```
DATABASE_URL="postgresql://postgres:Kurosaki_950@db.yliqulqaeiyqpuxdybay.supabase.co:5432/postgres"
```

This project `yliqulqaeiyqpuxdybay` is either:
- ❌ Deleted
- ❌ Not in your account
- ❌ Was a placeholder

---

## ✅ Solution: Create a NEW Supabase Project

### Step 1: Go to Supabase Dashboard
1. Visit: **https://supabase.com/dashboard**
2. Sign in (or create a free account)

### Step 2: Create New Project
1. Click **"New Project"** button
2. Fill in the form:
   - **Project Name:** AccessCheck
   - **Database Password:** Choose a strong password (or use auto-generated)
   - **Region:** Pick closest to you (e.g., us-east-1)
3. Click **"Create new project"**
4. **Wait 2-3 minutes** for database to initialize

### Step 3: Get Your Connection String
1. Go to **Project Settings** (gear icon, bottom left)
2. Click **"Database"** in the left menu
3. Under **Connection string**, select **"URI"**
4. You'll see your connection string:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
   ```
   
   **Copy the PROJECT_ID** (the part after `db.` and before `.supabase.co`)

### Step 4: Update `.env.local`
Replace the entire DATABASE_URL line with your new connection string:

```env
# Database - Your NEW Supabase Project
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_ID].supabase.co:5432/postgres"
```

**Example:**
```env
DATABASE_URL="postgresql://postgres:MySecurePassword123@db.abc123xyz456.supabase.co:5432/postgres"
```

### Step 5: Get Your Database Password

**If you forgot the password:**
1. Go to Supabase Dashboard
2. Click your project
3. **Settings** → **Database** → Click "Reveal" to see password
4. Or click **"Reset password"** to set a new one

---

## 🗄️ Initialize Database Schema

After updating `.env.local`, run this command to set up tables:

```powershell
cd "c:\Users\anton\OneDrive\Desktop\AccessCheck-main\accessibility-checker"
npx prisma migrate dev --name init
```

This will:
1. Create all necessary tables (users, scans, api_keys, etc.)
2. Sync with your Supabase database

---

## 🧪 Test Connection

### Option A: Test in Terminal
```powershell
cd "c:\Users\anton\OneDrive\Desktop\AccessCheck-main\accessibility-checker"
npx prisma db push
```

**Success:** `✓ Prisma schema is in sync with your database`  
**Error:** `Can't reach database server` → Check DATABASE_URL

### Option B: Test in App
1. Start dev server: `npm run dev`
2. Go to: http://localhost:3001/settings?tab=api
3. Click "Generate New API Key"
4. ✅ Should work (or show different error if database is working)

---

## 📋 Checklist

- [ ] Created new Supabase project
- [ ] Copied PROJECT_ID from dashboard
- [ ] Copied database password
- [ ] Updated DATABASE_URL in `.env.local`
- [ ] Restarted dev server (`npm run dev`)
- [ ] Ran `npx prisma migrate dev --name init`
- [ ] Tested API key generation
- [ ] Successfully scanned a URL

---

## 🔑 What You Need to Update

### Current (WRONG):
```env
DATABASE_URL="postgresql://postgres:Kurosaki_950@db.yliqulqaeiyqpuxdybay.supabase.co:5432/postgres"
```

### New (YOUR SUPABASE):
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"
```

**Where:**
- `[PASSWORD]` = Your database password from Supabase
- `[PROJECT_ID]` = Your project ID (visible in Supabase dashboard URL: `supabase.com/project/[PROJECT_ID]`)

---

## 🆘 Troubleshooting

### Error: "Can't reach database server"
**Solutions:**
1. Double-check DATABASE_URL (typo in project ID or password?)
2. Verify password hasn't expired
3. Check Supabase dashboard - is the project running?
4. Try resetting database password in Supabase

### Error: "relation 'User' does not exist"
**Solution:** Run `npx prisma migrate dev --name init` to create tables

### Port Conflicts
If you see `Port 3000 is in use`, the app will use `3001` automatically ✅

---

## 📞 Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Supabase Docs:** https://supabase.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## 🎯 Next Steps (In Order)

1. **NOW:** Set up new Supabase project
2. **Next:** Update DATABASE_URL in `.env.local`
3. **Then:** Restart dev server
4. **Then:** Run Prisma migrations
5. **Finally:** Test everything works

---

**Created by:** GitHub Copilot  
**Last Updated:** October 15, 2025

**Status:** 🔴 AWAITING YOUR ACTION - Database needs to be set up
