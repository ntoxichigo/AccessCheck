# 🚨 QUICK FIX GUIDE - Database Connection Error

## Problem Summary
Your Supabase database at `db.yliqulqaeiyqpuxdybay.supabase.co:5432` is **unreachable**.

## Root Cause
Most likely: **Your Supabase database is PAUSED** (Supabase pauses inactive free-tier databases after a period of inactivity)

---

## ⚡ IMMEDIATE FIX (5 minutes)

### Step 1: Check Supabase Database Status
1. Go to: **https://supabase.com/dashboard**
2. Sign in with your Supabase account
3. Find your project (should match the database URL: `yliqulqaeiyqpuxdybay`)
4. Check if you see a **"Paused"** status or **"Resume"** button
5. If paused, click **"Resume"** or **"Restore"**

### Step 2: Wait for Database to Resume
- This usually takes 1-2 minutes
- The dashboard will show "Active" when ready

### Step 3: Restart Your Dev Server
```powershell
# In your terminal, stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test
- Open http://localhost:3000
- Try accessing the dashboard
- Check if scan history loads

---

## 🔧 ALTERNATIVE FIX (If database is deleted or permanently unavailable)

### Option A: Create New Supabase Database
```powershell
# 1. Create new project at https://supabase.com
# 2. Get new DATABASE_URL from Project Settings → Database
# 3. Update .env.local with new DATABASE_URL
# 4. Run migrations:
npx prisma db push
# 5. Restart server:
npm run dev
```

### Option B: Use Local PostgreSQL (For Testing)
```powershell
# Install PostgreSQL locally or use Docker
# Update .env.local:
DATABASE_URL="postgresql://postgres:password@localhost:5432/accesscheck"
# Run migrations:
npx prisma db push
# Start server:
npm run dev
```

---

## ✅ Verification

After fixing, you should see:
- ✅ No "Can't reach database server" errors
- ✅ Dashboard loads successfully
- ✅ Scan history displays (even if empty)
- ✅ No 500 errors in terminal

---

## 🎯 Quick Checklist

- [ ] Checked Supabase dashboard
- [ ] Database status is "Active" (not "Paused")
- [ ] Dev server restarted after any .env changes
- [ ] Application loads without database errors

---

## 💡 Why This Happened

**Supabase Free Tier Policy:**
- Pauses databases after ~7 days of inactivity
- Automatically resumes when you access the dashboard
- No data loss - everything is preserved

**The Fix:**
- Just resume the database from Supabase dashboard
- Restart your dev server
- Everything will work again

---

## 📞 Still Not Working?

If database is still unreachable after resuming:

1. **Check firewall:** Ensure port 5432 is not blocked
2. **Verify credentials:** Password might have changed
3. **Network issues:** Try different network/VPN
4. **Create new database:** Last resort - set up fresh Supabase project

For detailed setup: See `ENV_SETUP_INSTRUCTIONS.md`
