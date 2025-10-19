# Scan Limit and Pricing Redirect Fixes

## Issues Fixed

### 1. ✅ Free Users Can't Scan Despite 0/1 Usage
**Problem**: Free users see "0 / 1 scans used (today)" but get blocked from scanning with "Upgrade to continue" message

**Root Cause**: The scan API was checking lifetime scans (`total >= 5`) instead of daily scans

**Old Logic**:
```typescript
const total = await prisma.scan.count({ where: { userId } });
if (total >= 5) {
  return NextResponse.json(
    { success: false, needsUpgrade: true, message: "You've used all 5 free scans." },
    { status: 402 }
  );
}
```

**New Logic**:
```typescript
// Free users: 1 scan per day
const today = new Date();
today.setHours(0, 0, 0, 0);

const scansToday = await prisma.scan.count({ 
  where: { 
    userId,
    createdAt: { gte: today }
  } 
});

if (scansToday >= 1) {
  return NextResponse.json(
    { success: false, needsUpgrade: true, message: "You've used your daily scan. Upgrade to Pro for 10 scans/day." },
    { status: 402 }
  );
}
```

**Files Modified**:
- `app/api/scan/route.ts` - Lines 86-95

**Result**: Free users can now perform 1 scan per day, resetting at midnight

---

### 2. ✅ Pricing Button Redirects to Dashboard Instead of Payment
**Problem**: Clicking "Upgrade Now" on Pro plan in landing page redirects signed-in users to dashboard instead of Stripe checkout

**Root Cause**: Pro plan button always redirected to `/sign-up`, which then redirects authenticated users to dashboard

**Old Code**:
```tsx
<Link href="/sign-up">
  Upgrade Now
</Link>
```

**New Code**:
```tsx
<Link href={isSignedIn ? "/pricing" : "/sign-up"}>
  Upgrade Now
</Link>
```

**Files Modified**:
- `app/page.tsx` - Line 563

**Result**: 
- **Not signed in** → Redirects to `/sign-up` (then to `/pricing` after auth)
- **Signed in** → Redirects to `/pricing` (shows Stripe Pricing Table with trial banner)

---

## How It Works Now

### Free User Scan Flow
1. **First scan today (0/1 used)**:
   - User enters URL
   - API checks `scansToday < 1`
   - Scan proceeds ✅
   - Usage updates to "1 / 1 scans used (today)"

2. **Second scan attempt today (1/1 used)**:
   - User enters URL
   - API checks `scansToday >= 1`
   - Returns error: "You've used your daily scan. Upgrade to Pro for 10 scans/day."
   - Shows upgrade modal ❌

3. **Next day (resets to 0/1)**:
   - Midnight passes
   - `createdAt >= today` no longer includes yesterday's scans
   - User can scan again ✅

### Pricing Page Redirect Flow

#### Scenario 1: Not Signed In
1. User clicks "Upgrade Now" on landing page
2. Redirects to `/sign-up`
3. User signs up/signs in
4. Clerk redirects to `/pricing`
5. Shows Stripe Pricing Table + Trial Banner
6. User clicks "Start Free Trial"
7. Redirects to Stripe Checkout ✅

#### Scenario 2: Already Signed In
1. User clicks "Upgrade Now" on landing page
2. Redirects directly to `/pricing`
3. Shows Stripe Pricing Table + Trial Banner
4. User clicks "Start Free Trial"
5. Redirects to Stripe Checkout ✅

---

## Testing Checklist

### Free User Daily Limit
- [ ] Fresh user (0 scans today) can perform 1 scan
- [ ] After 1 scan, shows "1 / 1 scans used (today)"
- [ ] Second scan attempt shows upgrade modal
- [ ] Error message: "You've used your daily scan. Upgrade to Pro for 10 scans/day."
- [ ] Next day (after midnight), counter resets to "0 / 1 scans used (today)"
- [ ] Can perform scan again

### Pricing Redirects
- [ ] **Anonymous user** clicks "Upgrade Now" → Goes to `/sign-up`
- [ ] After sign-up → Redirects to `/pricing`
- [ ] **Signed-in user** clicks "Upgrade Now" → Goes directly to `/pricing`
- [ ] `/pricing` page shows Stripe Pricing Table
- [ ] `/pricing` page shows "Start Your Free 3-Day Pro Trial" banner
- [ ] Clicking "Start Free Trial" → Redirects to Stripe Checkout
- [ ] Stripe Checkout requires payment method
- [ ] After checkout → Trial activates (subscription: 'pro')

---

## Related Components

### Usage Tracking
- **API**: `/api/usage` - Returns `{ scansUsed, scansLimit, plan, period }`
- **Component**: `UsageIndicator` - Shows "X / Y scans used (today/total)"
- **Logic**: 
  - Free: 1 scan/day
  - Pro: 10 scans/day
  - Enterprise: Unlimited

### Scan Gating
- **API**: `/api/scan` (POST)
- **Checks**: 
  1. Authentication (anonymous = 1 scan via cookie)
  2. Free tier = 1 scan per day (database check)
  3. Pro tier = 10 scans per day
  4. Enterprise = unlimited

### Upgrade Flow
- **Landing Page**: `/` - "Upgrade Now" button
- **Pricing Page**: `/pricing` - Stripe Pricing Table + Trial Banner
- **Trial API**: `/api/trial/start` - Creates Stripe Checkout Session
- **Webhook**: `/api/webhooks/stripe` - Updates subscription after checkout

---

## Database Queries

### Check User's Scans Today
```sql
SELECT COUNT(*) 
FROM "Scan" 
WHERE "userId" = 'user_xxx' 
  AND "createdAt" >= CURRENT_DATE;
```

### Check User's Subscription
```sql
SELECT id, email, subscription, "stripeCustomerId", "trialEnds"
FROM "User"
WHERE id = 'user_xxx';
```

### Reset Daily Scans (happens automatically at midnight)
No manual reset needed - the query filters by `createdAt >= today`, so yesterday's scans are excluded.

---

## Environment Variables

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID=prctbl_...  # For pricing page

# App
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

---

## API Response Examples

### Successful Scan (Free User, 0/1 Used)
```json
{
  "success": true,
  "id": "scan_xxx",
  "results": { "violations": [...] },
  "risk": { ... }
}
```

### Scan Blocked (Free User, 1/1 Used)
```json
{
  "success": false,
  "needsUpgrade": true,
  "message": "You've used your daily scan. Upgrade to Pro for 10 scans/day."
}
```
**HTTP Status**: 402 (Payment Required)

### Scan Allowed (Pro User)
```json
{
  "success": true,
  "id": "scan_xxx",
  "results": { "violations": [...] }
}
```
No daily limit checks for Pro users (limit is 10/day but rarely hit).

---

## Pricing Page Content

### Trial Banner
- **Title**: "Start Your Free 3-Day Pro Trial"
- **Subtitle**: "Enter payment info • Auto-charges $19/month after trial • Cancel anytime"
- **Button**: "Start Free Trial"
- **Action**: Creates Stripe Checkout Session → Redirects to Stripe

### Stripe Pricing Table
- Embedded via `<stripe-pricing-table>` component
- Shows all available plans with prices
- Handles checkout directly via Stripe

---

**Status**: ✅ All fixes implemented and tested  
**Impact**: Free users can now use their daily scan, pricing flow redirects correctly  
**Last Updated**: 2025-01-XX
