# API Pricing & Access Strategy

## Overview
AccessCheck API access strategy designed to maximize user value while driving revenue growth.

---

## Tier Structure

### 1. **Free Tier**
**Access**: Web UI only
- ✅ Manual website scans (up to 10/month)
- ✅ View accessibility reports in browser
- ✅ Basic WCAG violation detection
- ❌ No API key generation
- ❌ No PDF export
- ❌ No bulk scanning
- **Price**: $0/month
- **Goal**: User acquisition, product validation, conversion funnel entry

### 2. **Pro Tier** (Current $15/month)
**Access**: Web UI + Limited API
- ✅ Unlimited manual scans via web UI
- ✅ PDF report export
- ✅ Bulk scanning (up to 100 URLs)
- ✅ **API key generation** (1 key)
- ✅ **API usage**: 1,000 requests/month
- ✅ Priority email support
- **Price**: $19/month (recommend increasing from $15)
- **Goal**: Individual developers, small teams, freelancers

### 3. **Business Tier** (NEW)
**Access**: Web UI + Enhanced API
- ✅ Everything in Pro
- ✅ **API keys**: Up to 5 keys
- ✅ **API usage**: 10,000 requests/month
- ✅ Advanced analytics dashboard
- ✅ Team collaboration (up to 5 users)
- ✅ Webhook notifications
- ✅ Custom report branding
- **Price**: $99/month
- **Goal**: Agencies, growing companies, development teams

### 4. **Enterprise Tier**
**Access**: Custom API + White-label
- ✅ Everything in Business
- ✅ **Unlimited API keys**
- ✅ **Custom API limits** (negotiated)
- ✅ Dedicated account manager
- ✅ SLA guarantees (99.9% uptime)
- ✅ Custom integrations
- ✅ White-label options
- ✅ On-premise deployment options
- **Price**: Custom (starting at $499/month)
- **Goal**: Large enterprises, high-volume users

---

## API Rate Limiting Strategy

### Implementation Approach
1. **Per-API-Key Limits**: Track usage per key, not per user
2. **Monthly Reset**: Limits reset on billing cycle date
3. **Soft Limits**: Warning at 80%, 90% usage
4. **Hard Limits**: 429 error when exceeded, with upgrade CTA
5. **Overage Options**: 
   - Pro: $0.01 per additional request (max $50/month)
   - Business: $0.005 per additional request (max $200/month)

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1672531200
X-RateLimit-Tier: pro
```

---

## Feature Gating Matrix

| Feature | Free | Pro | Business | Enterprise |
|---------|------|-----|----------|------------|
| Web Scans/month | 10 | Unlimited | Unlimited | Unlimited |
| API Keys | 0 | 1 | 5 | Unlimited |
| API Requests/month | 0 | 1,000 | 10,000 | Custom |
| PDF Export | ❌ | ✅ | ✅ | ✅ |
| Bulk Scanning | ❌ | 100 URLs | 500 URLs | Custom |
| Team Members | 1 | 1 | 5 | Custom |
| Support | Email | Priority Email | Priority + Chat | Dedicated |
| Analytics | Basic | Advanced | Advanced | Custom |

---

## Technical Implementation Plan

### Phase 1: Database Schema (Immediate)
```sql
-- Add to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "apiKeysLimit" INTEGER DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "apiRequestsLimit" INTEGER DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "apiRequestsUsed" INTEGER DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "billingCycleStart" TIMESTAMP;

-- Create API key tracking table
CREATE TABLE IF NOT EXISTS "ApiKey" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "key" TEXT UNIQUE NOT NULL,
  "name" TEXT,
  "requestsUsed" INTEGER DEFAULT 0,
  "lastUsedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "expiresAt" TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create API usage log table
CREATE TABLE IF NOT EXISTS "ApiUsageLog" (
  "id" TEXT PRIMARY KEY,
  "apiKeyId" TEXT NOT NULL,
  "endpoint" TEXT NOT NULL,
  "timestamp" TIMESTAMP DEFAULT NOW(),
  "responseStatus" INTEGER,
  "responseTime" INTEGER,
  FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE
);
```

### Phase 2: Middleware & Rate Limiting
1. Create `/lib/api/rateLimiter.ts` - Check limits per key
2. Create `/middleware/apiAuth.ts` - Validate API keys
3. Add rate limit headers to all API responses
4. Implement Redis/in-memory cache for fast lookup

### Phase 3: User Dashboard Updates
1. Show API usage meter (requests used/limit)
2. Show "Upgrade to Pro" CTA for free users
3. Show "Upgrade to Business" CTA when approaching limits
4. Display all API keys with usage stats
5. Add key rotation/regeneration

### Phase 4: Stripe Integration Updates
1. Update Stripe products with new tiers
2. Add metered billing for overages
3. Implement webhook for subscription changes
4. Auto-update user limits on tier change

---

## Pricing Psychology

### Why These Prices?
- **Free**: $0 - No barrier to entry, builds trust
- **Pro**: $19/month - Affordable for individuals, clear value proposition
- **Business**: $99/month - 5x the price for 10x the API usage (perceived value)
- **Enterprise**: Custom - Anchoring effect, makes Business seem reasonable

### Conversion Funnel
1. **Free → Pro**: "Need API access? Upgrade to Pro for just $19/month"
2. **Pro → Business**: "Hit your API limit? Business gives you 10x more for $99"
3. **Business → Enterprise**: "Need more? Let's talk custom pricing"

---

## Competitive Analysis

| Competitor | API Requests | Price |
|------------|-------------|-------|
| Axe DevTools | 1,000/month | Free (limited) |
| WAVE API | 500/month | $49/month |
| Tenon.io | 10,000/month | $99/month |
| **AccessCheck Pro** | **1,000/month** | **$19/month** ✅ |
| **AccessCheck Business** | **10,000/month** | **$99/month** ✅ |

**Our Advantage**: Better pricing, modern UI, easier integration

---

## Success Metrics

### Track Monthly
1. **Conversion Rate**: Free → Pro (target: 2-5%)
2. **Upgrade Rate**: Pro → Business (target: 5-10%)
3. **Churn Rate**: All tiers (target: <5%)
4. **API Usage**: Average % of limit used (target: 60-80%)
5. **CAC**: Cost to acquire customer (target: <$50 for Pro)
6. **LTV**: Lifetime value (target: >$200 for Pro, >$1000 for Business)

### Key Decisions
- If API usage consistently <40%: Limits too high, reduce or add lower tier
- If API usage consistently >90%: Limits too low, increase or add higher tier
- If Free → Pro conversion <1%: Free tier too generous or Pro not compelling
- If churn >10%: Product/pricing mismatch, investigate feedback

---

## Implementation Timeline

### Week 1: Database & Backend
- [ ] Update Prisma schema
- [ ] Create migration scripts
- [ ] Build rate limiter
- [ ] Add API key validation middleware
- [ ] Create usage tracking endpoints

### Week 2: Frontend & Dashboard
- [ ] Update pricing page with new tiers
- [ ] Add API key management UI
- [ ] Show usage meters and limits
- [ ] Add upgrade CTAs
- [ ] Implement key rotation

### Week 3: Stripe & Billing
- [ ] Create new Stripe products
- [ ] Update checkout flow
- [ ] Implement metered billing
- [ ] Add webhook handlers
- [ ] Test subscription changes

### Week 4: Testing & Launch
- [ ] End-to-end testing
- [ ] Load testing for rate limiter
- [ ] Documentation updates
- [ ] Launch announcement
- [ ] Monitor metrics

---

## Risk Mitigation

### Potential Issues
1. **Users hit limits too fast**: Add overage pricing, send warning emails
2. **API abuse**: Implement IP-based rate limiting, CAPTCHA for suspicious activity
3. **Pricing too low**: Easy to increase for new users, grandfather existing
4. **Competition undercuts**: Focus on UX/features, not just price

### Safeguards
- Grace period: 3 days after limit exceeded before hard block
- Email notifications: 80%, 90%, 100% usage
- Easy upgrade path: One-click upgrade in dashboard
- Fair use policy: Detect and warn about abuse patterns

---

## Next Steps

1. ✅ Review and approve this strategy
2. ⏳ Implement database schema changes
3. ⏳ Build rate limiting infrastructure
4. ⏳ Update UI with new tiers and limits
5. ⏳ Configure Stripe products
6. ⏳ Test and launch

---

**Recommendation**: Start with Pro tier ($19/month) gating for API keys, monitor usage for 1-2 months, then introduce Business tier based on data.
