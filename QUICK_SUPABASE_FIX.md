# 🚨 QUICK FIX - Supabase Project Not Found

## The Problem
```
DATABASE_URL="...@db.yliqulqaeiyqpuxdybay.supabase.co:5432/postgres"
                        ↑
                 This project doesn't exist in your account!
```

## The Solution (5 Minutes)

### ✅ Step 1: Create New Supabase Project
```
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: AccessCheck
4. Set a strong password (copy it!)
5. Click Create
6. Wait 2 minutes...
```

### ✅ Step 2: Find Your Connection String
```
1. In Supabase: Settings → Database → Connection string (URI)
2. Copy the entire string that looks like:
   postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres

3. The important part is [PROJECT_ID]
```

### ✅ Step 3: Update `.env.local`
Edit: `accessibility-checker/.env.local`

Replace this line:
```env
DATABASE_URL="postgresql://postgres:Kurosaki_950@db.yliqulqaeiyqpuxdybay.supabase.co:5432/postgres"
```

With YOUR connection string from Supabase:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres"
```

**Example:**
```env
DATABASE_URL="postgresql://postgres:abc123def456@db.myprojid789xyz.supabase.co:5432/postgres"
```

### ✅ Step 4: Initialize Database
```powershell
cd "c:\Users\anton\OneDrive\Desktop\AccessCheck-main\accessibility-checker"
npx prisma migrate dev --name init
```

### ✅ Step 5: Restart Dev Server
```powershell
npm run dev
```

## ✅ Test It Works
Go to: http://localhost:3001/settings?tab=api  
Click: "Generate New API Key"  
Should work without database errors! ✨

---

## 📋 Your Credentials (Update These)

| Item | Old Value | Your New Value |
|------|-----------|----------------|
| Project ID | yliqulqaeiyqpuxdybay | **[YOUR_PROJECT_ID]** |
| Password | Kurosaki_950 | **[YOUR_PASSWORD]** |

---

**Need help?** See `SUPABASE_SETUP_GUIDE.md` for detailed steps
