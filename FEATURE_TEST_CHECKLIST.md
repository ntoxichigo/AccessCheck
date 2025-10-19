# ✅ Feature Testing Checklist - PDF Export & API Key Generation

**Date:** October 16, 2025

---

## 🎯 Features to Test

### 1. ✅ Create API Key
**Endpoint:** `POST /api/user/api-key`  
**Location:** `app/api/user/api-key/route.ts`

**Current Status:** ✅ Code looks good

**Requirements:**
- ✅ User must be authenticated (Clerk)
- ✅ User must have Pro subscription OR be on trial
- ✅ Maximum 5 API keys per user
- ✅ API key name is required
- ✅ Returns unhashed key ONLY on creation

**Potential Issues:**
- 🔴 **Database connection required** (Supabase must be active)
- 🟡 Free users will see error: "API access requires Pro plan or higher"

**Test Steps:**
1. Resume Supabase database (if paused)
2. Sign in to app
3. Go to: http://localhost:3001/settings?tab=api
4. Enter API key name
5. Click "Generate New API Key"
6. Should show new key with warning to save it

---

### 2. ✅ Export PDF Report
**Endpoint:** `GET /api/pdf?scanId={id}`  
**Location:** `app/api/pdf/route.ts`

**Current Status:** ✅ Code looks good

**Requirements:**
- ✅ User must be authenticated (Clerk)
- ✅ User must own the scan
- ✅ User must have Pro subscription OR be on active trial
- ✅ Scan must exist in database
- ✅ Uses `generatePDFReport` from `lib/pdf/generatePDFReport.ts`

**Features:**
- ✅ Trial users get watermarked PDF with 5-issue limit
- ✅ Pro users get full PDF with all issues
- ✅ Includes compliance risk, fines, violations
- ✅ Auto-downloads with filename: `accessibility-report-{url}-{timestamp}.pdf`

**Potential Issues:**
- 🔴 **Database connection required** (Supabase must be active)
- 🟡 Free users will see error: "PDF export requires Pro plan or active trial"
- 🟡 If scan doesn't exist, returns 404

**Test Steps:**
1. Resume Supabase database (if paused)
2. Sign in to app
3. Run a URL scan (e.g., https://example.com)
4. Wait for scan to complete
5. Click "Export PDF Report" button
6. Should download PDF file

---

## 🔴 Critical Blockers

### **Issue 1: Database Connection**
Both features require Supabase database to be active.

**Error you'll see if database is paused:**
```
Can't reach database server at db.yliqulqaeiyqpuxdybay.supabase.co:5432
```

**Fix:**
1. Go to: https://supabase.com/dashboard
2. Click project: yliqulqaeiyqpuxdybay
3. Click "Resume" button
4. Wait 60 seconds
5. Restart dev server: `npm run dev`

---

### **Issue 2: Subscription Tier**
Both features require Pro subscription or active trial.

**Free users will see:**
- API Key: "API access requires Pro plan or higher"
- PDF Export: "PDF export requires Pro plan or active trial"

**To test as Pro user:**
You need to either:
1. **Start a trial** (if trial system is set up)
2. **Manually update database:**
   ```sql
   UPDATE "User" SET subscription = 'pro' WHERE id = 'your-clerk-user-id';
   ```
3. **Complete Stripe payment flow**

---

## 🧪 Quick Test Commands

### Test 1: Check if database is reachable
```powershell
cd "c:\Users\anton\OneDrive\Desktop\AccessCheck-main\accessibility-checker"
npx prisma db push
```

**Success:** `✓ Prisma schema is in sync with your database`  
**Fail:** `Can't reach database server` → Resume Supabase

---

### Test 2: Upgrade user to Pro (for testing)
```powershell
cd "c:\Users\anton\OneDrive\Desktop\AccessCheck-main\accessibility-checker"
npx prisma studio
```

Then:
1. Opens in browser at http://localhost:5555
2. Click "User" table
3. Find your user (by email or Clerk ID)
4. Change `subscription` from `free` to `pro`
5. Save

---

## ✅ Expected Behavior

### **API Key Generation (Working):**
```json
{
  "apiKey": "ak_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "keyId": "clxxx...",
  "name": "My API Key",
  "createdAt": "2025-10-16T...",
  "warning": "This is the only time you will see this API key. Please save it securely."
}
```

### **PDF Export (Working):**
- Downloads file: `accessibility-report-example-com-1729123456789.pdf`
- Contains:
  - ✅ Scan URL
  - ✅ Timestamp
  - ✅ Total issues found
  - ✅ Violations list with descriptions
  - ✅ Compliance risk (US fines, EU fines)
  - ✅ Remediation steps
  - ✅ (Trial users: watermark + 5 issues max)

---

## 🚨 Common Errors & Fixes

### Error: "Unauthorized"
**Cause:** Not signed in  
**Fix:** Sign in at http://localhost:3001/sign-in

### Error: "API access requires Pro plan or higher"
**Cause:** User is on free plan  
**Fix:** Upgrade subscription in database OR start trial

### Error: "Scan not found"
**Cause:** Invalid scan ID or scan doesn't exist  
**Fix:** Run a scan first, then try exporting

### Error: "Can't reach database server"
**Cause:** Supabase database is paused  
**Fix:** Resume database at https://supabase.com/dashboard

### Error: "Failed to generate PDF report"
**Cause:** PDF generation library error  
**Fix:** Check console logs for details, ensure jspdf is installed

---

## 📋 Final Verification Checklist

- [ ] Supabase database is resumed and running
- [ ] User is signed in with Clerk
- [ ] User subscription is set to `pro` or has active trial
- [ ] At least one scan exists in database
- [ ] Dev server is running (`npm run dev`)
- [ ] No TypeScript errors in API routes
- [ ] Browser console shows no errors

---

## ✅ Code Quality Summary

### API Key Generation (`app/api/user/api-key/route.ts`)
- ✅ Proper authentication check
- ✅ Subscription tier validation
- ✅ User creation if not exists
- ✅ API key limit enforcement (5 max)
- ✅ Secure hashing (stores hashed, returns plain once)
- ✅ Proper error handling

### PDF Export (`app/api/pdf/route.ts`)
- ✅ Proper authentication check
- ✅ Ownership verification
- ✅ Subscription/trial validation
- ✅ Trial vs Pro distinction (watermark/limits)
- ✅ Proper PDF content-type headers
- ✅ Descriptive error messages

**Verdict:** Both features are well-implemented. Main blocker is database connection.

---

## 🎯 What You Need to Do NOW

1. **Resume Supabase Database:**
   - https://supabase.com/dashboard → Resume project

2. **Set yourself to Pro (for testing):**
   ```powershell
   npx prisma studio
   # Change subscription to "pro"
   ```

3. **Test API Key:**
   - http://localhost:3001/settings?tab=api
   - Generate new key

4. **Test PDF Export:**
   - Scan a URL
   - Click "Export PDF Report"

---

**Created by:** GitHub Copilot  
**Last Updated:** October 16, 2025  
**Status:** ✅ Code is ready, just needs database + Pro subscription
