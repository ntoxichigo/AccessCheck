# 🚀 IMMEDIATE ACTION PLAN - API Rate Limiting

## 📋 Current Status

### ✅ Completed
1. **Strategic Planning**: Comprehensive pricing strategy documented
2. **Database Schema**: Updated Prisma schema with new fields
3. **Migration Script**: SQL script ready to add columns and tables
4. **Rate Limiter**: Core logic implemented in `lib/api/rateLimiter.ts`
5. **API Route Updated**: Enhanced API key creation with tier checks
6. **Documentation**: Complete implementation guide and summary

### ⚠️ Known Issues
**TypeScript Errors in `rateLimiter.ts`**
- These are expected and will resolve after running `npx prisma generate`
- The Prisma client needs to be regenerated with the new schema
- **DO NOT** try to fix these manually - they will auto-resolve

---

## 🎯 Your Next 3 Steps (In Order)

### Step 1: Database Migration (5-10 minutes)

```powershell
# Navigate to project
cd c:\Users\anton\OneDrive\Desktop\AccessCheck-main\accessibility-checker

# Run migration
npx prisma migrate dev --name add_api_rate_limiting

# This will:
# - Apply schema changes to database
# - Create migration files
# - Automatically run `prisma generate`
```

**Alternative** (if you prefer manual SQL):
```powershell
# Get your database connection string from .env.local
$env:DATABASE_URL = "postgresql://..."

# Run the SQL migration
# (Use your preferred PostgreSQL client or psql command)
psql $env:DATABASE_URL -f prisma\migrations\add_api_rate_limiting.sql
```

### Step 2: Regenerate Prisma Client (1 minute)

```powershell
# If you used manual SQL migration, regenerate Prisma client
npx prisma generate
```

**Expected Result:**
- ✅ TypeScript errors in `rateLimiter.ts` disappear
- ✅ New fields available on User and ApiKey types
- ✅ ApiUsageLog model available in Prisma client

### Step 3: Test API Key Creation (5 minutes)

```powershell
# Start development server
npm run dev

# In browser:
# 1. Login to your app
# 2. Upgrade your test user to "pro" in database:
#    UPDATE "User" SET subscription = 'pro', "apiKeysLimit" = 1, "apiRequestsLimit" = 1000 WHERE email = 'your@email.com';
# 3. Navigate to dashboard
# 4. Try creating an API key

# Expected behavior:
# - Free users: Error message "API access requires Pro plan"
# - Pro users: Successfully creates key, shows warning to save it
# - Usage stats visible
```

---

## 📊 Verification Checklist

After completing the 3 steps above, verify:

- [ ] No TypeScript errors in `rateLimiter.ts`
- [ ] No TypeScript errors in `app/api/user/api-key/route.ts`
- [ ] Database has new columns: `User.apiKeysLimit`, `User.apiRequestsLimit`, etc.
- [ ] Database has `ApiUsageLog` table
- [ ] Pro users can create API keys
- [ ] Free users get blocked with clear error message
- [ ] Usage stats show in API key GET response

---

## 🔧 What Each Tier Gets (Reference)

| Subscription | apiKeysLimit | apiRequestsLimit |
|--------------|--------------|------------------|
| Free         | 0            | 0                |
| Trial        | 0            | 0                |
| Pro          | 1            | 1,000            |
| Business     | 5            | 10,000           |
| Enterprise   | 999,999      | 999,999          |

These limits are set:
1. **Automatically** by migration script for existing users
2. **Automatically** by `getTierConfig()` for new users
3. **Manually** in Stripe webhook when subscription changes

---

## 🚨 Troubleshooting

### Issue: Migration fails with "column already exists"
**Solution**: The migration has `IF NOT EXISTS` clauses, so this shouldn't happen. If it does, the columns are already there - just run `npx prisma generate`.

### Issue: TypeScript errors don't go away after `prisma generate`
**Solution**: 
1. Restart VS Code: `Ctrl+Shift+P` → "Reload Window"
2. Check that `node_modules/.prisma/client` was regenerated
3. Verify schema.prisma matches the updated version

### Issue: Can't create API keys even as Pro user
**Solution**: 
1. Check user's `apiKeysLimit` in database: `SELECT * FROM "User" WHERE id = 'user_xxx';`
2. If it's 0, update it: `UPDATE "User" SET "apiKeysLimit" = 1, "apiRequestsLimit" = 1000 WHERE id = 'user_xxx';`

### Issue: Database connection error during migration
**Solution**: 
1. Resume your Supabase database (it may be paused)
2. Check `.env.local` has correct `DATABASE_URL`
3. Test connection: `npx prisma db pull` (should succeed)

---

## 📚 Documentation Reference

### For Strategy & Planning
→ Read: `API_PRICING_STRATEGY.md`

### For Implementation Steps
→ Read: `API_IMPLEMENTATION_GUIDE.md`

### For Overview & Summary
→ Read: `API_IMPLEMENTATION_SUMMARY.md`

### For Immediate Actions
→ **You're here!** `IMMEDIATE_ACTION_PLAN.md`

---

## 💰 Business Recap

**Why we're doing this:**
- ✅ Gate API access to drive Pro subscriptions
- ✅ Prevent abuse and control costs
- ✅ Create clear upgrade path (Free → Pro → Business → Enterprise)
- ✅ Competitive pricing vs industry leaders
- ✅ Scalable architecture for growth

**Expected Revenue (Conservative):**
- Month 1: ~$60 MRR (2 Pro users)
- Month 3: ~$200 MRR (8 Pro users, 1 Business)
- Month 6: ~$500 MRR (20 Pro users, 3 Business)
- Year 1: ~$2,000 ARR

**Key Metrics to Track:**
- Free → Pro conversion rate (target: 2-5%)
- API usage per user (target: 60-80% of limit)
- Churn rate (target: <5%)
- CAC vs LTV ratio (target: 1:3 minimum)

---

## ⏱️ Time Estimate

| Task | Time | Complexity |
|------|------|------------|
| Run migration | 5 min | Low |
| Generate Prisma client | 1 min | Low |
| Test API key creation | 5 min | Low |
| **Total** | **~15 min** | **Low** |

---

## 🎓 After Implementation

Once the database migration is complete and tested:

### Immediate (This Week)
1. Create middleware for `/api/v1/*` endpoints
2. Build API key management UI component
3. Update pricing page with tier comparison

### Short-term (Next 2 Weeks)
1. Enhance Stripe webhook to set limits on subscription
2. Add email notifications for usage warnings
3. Create API documentation page

### Medium-term (Next Month)
1. Build analytics dashboard for API usage
2. Add overage billing option
3. Launch Business tier officially

---

## 🎯 Success Criteria

You'll know this is working when:

1. ✅ Free users see "Upgrade to Pro" message when trying to create API keys
2. ✅ Pro users can create exactly 1 API key
3. ✅ Business users can create up to 5 API keys
4. ✅ Usage stats show correctly in dashboard
5. ✅ Rate limiting headers appear in API responses
6. ✅ 429 errors returned when limit exceeded

---

## 🚦 Ready to Start?

**START HERE:**

```powershell
cd c:\Users\anton\OneDrive\Desktop\AccessCheck-main\accessibility-checker
npx prisma migrate dev --name add_api_rate_limiting
```

Then verify TypeScript errors are gone, and test API key creation!

**Questions?** Check the troubleshooting section above or refer to `API_IMPLEMENTATION_GUIDE.md` for detailed steps.

**Good luck! 🚀**
