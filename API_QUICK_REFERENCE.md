# API Access - Quick Reference Card

## 🎯 Tier Limits at a Glance

```
FREE        → 0 keys, 0 requests,    $0/mo
PRO         → 1 key,  1,000 req/mo,  $19/mo  ⭐ RECOMMENDED
BUSINESS    → 5 keys, 10,000 req/mo, $99/mo
ENTERPRISE  → ∞ keys, ∞ requests,    Custom
```

## ⚡ Quick Commands

```powershell
# Run migration
npx prisma migrate dev --name add_api_rate_limiting

# Regenerate Prisma client
npx prisma generate

# Start dev server
npm run dev

# Test database connection
npx prisma db pull
```

## 🔑 API Key Format

```
ak_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
│   │    └─ 40 random characters (base62)
│   └─ Environment (live/test)
└─ Prefix (api key)
```

## 📊 Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1672531200
X-RateLimit-Tier: pro
```

## 🚨 HTTP Status Codes

```
200 OK              → Success
401 Unauthorized    → Missing/invalid API key
403 Forbidden       → Not subscribed to plan
429 Too Many Requests → Rate limit exceeded
500 Internal Error  → Server error
```

## 📂 Key Files

```
STRATEGY:
├─ API_PRICING_STRATEGY.md          → Business plan
├─ API_IMPLEMENTATION_SUMMARY.md    → Technical overview
├─ API_IMPLEMENTATION_GUIDE.md      → Step-by-step guide
└─ IMMEDIATE_ACTION_PLAN.md         → Quick start

CODE:
├─ prisma/schema.prisma                     → Database schema
├─ prisma/migrations/add_api_rate_limiting.sql → Migration
├─ lib/api/rateLimiter.ts                   → Core logic
└─ app/api/user/api-key/route.ts            → API endpoint
```

## 🎨 Database Schema (New Fields)

```sql
-- User table
ALTER TABLE "User" ADD COLUMN "apiKeysLimit" INTEGER;
ALTER TABLE "User" ADD COLUMN "apiRequestsLimit" INTEGER;
ALTER TABLE "User" ADD COLUMN "apiRequestsUsed" INTEGER;
ALTER TABLE "User" ADD COLUMN "billingCycleStart" TIMESTAMP;

-- ApiKey table
ALTER TABLE "ApiKey" ADD COLUMN "requestsUsed" INTEGER;

-- ApiUsageLog table (new)
CREATE TABLE "ApiUsageLog" (
  id, apiKeyId, userId, endpoint, timestamp, 
  responseStatus, responseTime
);
```

## 🔧 Core Functions (rateLimiter.ts)

```typescript
getTierConfig(subscription)      → Get limits for tier
canCreateApiKey(userId)          → Check if user can create more keys
checkRateLimit(apiKey)           → Validate request against limits
incrementUsage(...)              → Track API call
getUsageStats(userId)            → Get usage metrics
createRateLimitHeaders(result)   → Generate response headers
createRateLimitError(result)     → Generate 429 response
```

## 🧪 Test Scenarios

```javascript
// 1. Free user tries to create API key
→ 403 Forbidden: "API access requires Pro plan"

// 2. Pro user creates first key
→ 201 Created: Returns plain API key (only once!)

// 3. Pro user tries to create second key
→ 400 Bad Request: "API key limit reached"

// 4. User makes 1001st API request
→ 429 Too Many Requests: "Rate limit exceeded"

// 5. User checks usage stats
→ 200 OK: { limit: 1000, used: 500, remaining: 500, ... }
```

## 💡 Common Tasks

### Upgrade user to Pro manually:
```sql
UPDATE "User" 
SET subscription = 'pro',
    "apiKeysLimit" = 1,
    "apiRequestsLimit" = 1000,
    "billingCycleStart" = NOW()
WHERE email = 'user@example.com';
```

### Check user's API usage:
```sql
SELECT email, subscription, 
       "apiRequestsUsed", "apiRequestsLimit",
       ROUND(("apiRequestsUsed"::FLOAT / "apiRequestsLimit"::FLOAT) * 100, 2) as percentage
FROM "User"
WHERE "apiRequestsLimit" > 0;
```

### Reset user's usage counter:
```sql
UPDATE "User" 
SET "apiRequestsUsed" = 0,
    "billingCycleStart" = NOW()
WHERE id = 'user_xxxxx';
```

### List all API keys for a user:
```sql
SELECT name, key, "createdAt", "lastUsedAt", "isActive"
FROM "ApiKey"
WHERE "userId" = 'user_xxxxx'
ORDER BY "createdAt" DESC;
```

### Check API usage logs:
```sql
SELECT endpoint, COUNT(*) as requests, AVG("responseTime") as avg_ms
FROM "ApiUsageLog"
WHERE "userId" = 'user_xxxxx'
  AND timestamp >= NOW() - INTERVAL '30 days'
GROUP BY endpoint
ORDER BY requests DESC;
```

## 🎯 Success Metrics

```
WEEK 1:
→ API keys created: Target 2-5
→ Error rate: <5%
→ No critical bugs

MONTH 1:
→ Free→Pro conversion: 2-5%
→ MRR: $50-100
→ Avg API usage: 40-60%

MONTH 3:
→ MRR: $200-500
→ Churn: <5%
→ Pro→Business: 5-10%
```

## 🚀 Launch Checklist

- [ ] Database migrated
- [ ] Prisma client regenerated
- [ ] API key creation tested
- [ ] Rate limiting working
- [ ] Usage stats accurate
- [ ] Stripe webhook updated
- [ ] Pricing page updated
- [ ] Dashboard UI ready
- [ ] Documentation complete
- [ ] Email notifications set up
- [ ] Monitoring enabled
- [ ] Launch announcement prepared

## 📞 Support Resources

```
Technical Issues:
→ API_IMPLEMENTATION_GUIDE.md (Troubleshooting section)

Business Questions:
→ API_PRICING_STRATEGY.md (Competitive analysis, pricing rationale)

Quick Start:
→ IMMEDIATE_ACTION_PLAN.md (15-minute setup)

Complete Overview:
→ API_IMPLEMENTATION_SUMMARY.md (Everything in one place)
```

## ⚠️ Important Notes

1. **TypeScript Errors**: Will resolve after `npx prisma generate`
2. **API Keys**: Never stored in plain text - always hashed
3. **Rate Limits**: Reset monthly on billing cycle date
4. **Free Users**: Cannot create API keys (feature gate working as intended)
5. **Testing**: Use Postman/curl with `X-API-Key` header

## 🎓 Example API Request

```bash
curl -X POST https://your-domain.com/api/v1/scan \
  -H "X-API-Key: ak_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## 🔒 Security Best Practices

1. ✅ Hash API keys before database storage
2. ✅ Use HTTPS only for API endpoints
3. ✅ Rate limit by API key, not IP
4. ✅ Log all API usage for audit trail
5. ✅ Revoke compromised keys immediately
6. ✅ Rotate keys periodically
7. ✅ Never expose keys in client-side code

---

**Ready to implement?** → Open `IMMEDIATE_ACTION_PLAN.md`

**Need details?** → Open `API_IMPLEMENTATION_GUIDE.md`

**Want strategy context?** → Open `API_PRICING_STRATEGY.md`

---

*Last updated: October 16, 2025*
