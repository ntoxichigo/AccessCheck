# Stripe Customer Portal Setup - Final Step

## 🎯 What Was Done

### 1. Database Schema Update
Added `stripeCustomerId` field to User model:
```prisma
model User {
  // ... existing fields
  stripeCustomerId   String?         @unique
  // ... rest of fields
}
```

✅ **Database migration completed successfully** (`prisma db push`)

### 2. Webhook Updated
Updated `app/api/webhooks/stripe/route.ts` to store Stripe customer ID when checkout completes:
```typescript
await prisma.user.upsert({
  // ...
  update: {
    subscription: plan,
    stripeCustomerId: session.customer as string,
  },
});
```

### 3. Customer Portal Route Created
Created `app/api/billing/portal/route.ts` that:
- ✅ Retrieves user's Stripe customer ID from database
- ✅ Creates or finds Stripe customer if missing
- ✅ Generates Stripe Customer Portal session
- ✅ Returns portal URL for frontend redirect

---

## ⚠️ Action Required: Regenerate Prisma Client

The database schema was updated, but TypeScript types need to be regenerated. There's a Windows file locking issue preventing `prisma generate` from completing.

### Fix Steps:

**Option 1: Restart VS Code (Recommended)**
1. Close VS Code completely
2. Reopen the workspace
3. Run: `npx prisma generate`
4. Verify no TypeScript errors in:
   - `app/api/billing/portal/route.ts`
   - `app/api/webhooks/stripe/route.ts`

**Option 2: Manual Process Kill**
1. Open Task Manager
2. Find any Node.js processes holding files in `node_modules/.prisma/`
3. End those processes
4. Run: `npx prisma generate`

---

## 🚀 Using the Customer Portal

### Frontend Integration

Add a "Manage Subscription" button in your settings/dashboard:

```tsx
// components/settings/SubscriptionSettings.tsx
const handleManageSubscription = async () => {
  try {
    const response = await fetch('/api/billing/portal', {
      method: 'POST',
    });
    
    const data = await response.json();
    
    if (data.url) {
      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    }
  } catch (error) {
    console.error('Failed to open portal:', error);
  }
};

return (
  <button onClick={handleManageSubscription}>
    Manage Subscription
  </button>
);
```

### What Users Can Do in Portal
- ✅ Update payment method
- ✅ View invoices and payment history
- ✅ Cancel subscription (cancels at period end)
- ✅ Reactivate canceled subscription
- ✅ Update billing email
- ✅ Download receipts

---

## 🔧 Stripe Dashboard Configuration

### Enable Customer Portal Features
1. Go to https://dashboard.stripe.com/settings/billing/portal
2. Configure allowed features:
   - ✅ **Update payment method** - Enabled
   - ✅ **View invoice history** - Enabled
   - ✅ **Cancel subscription** - Enabled (choose "Cancel at end of period")
   - ⚠️ **Update subscription** - Optional (if you want users to upgrade/downgrade)
3. Set **Return URL**: `https://your-domain.com/dashboard`
4. Customize branding (logo, colors, terms)

### Recommended Settings
- **Cancellation behavior**: "Cancel at period end" (user keeps access until end of billing cycle)
- **Proration behavior**: "Always prorate" (fair billing when upgrading/downgrading)
- **Invoice history**: Show last 12 months
- **Payment method updates**: Allow all

---

## 📊 Complete Flow Diagram

### Trial → Subscription → Portal Management

```
1. USER CLICKS "START TRIAL"
   ↓
2. Frontend calls /api/trial/start
   ↓
3. Creates Stripe Checkout Session
   - trial_period_days: 3
   - Requires payment method
   - Metadata: { userId }
   ↓
4. User enters card on Stripe-hosted page
   ↓
5. Stripe fires "checkout.session.completed" webhook
   ↓
6. Webhook updates database:
   - subscription: 'free' → 'pro'
   - stripeCustomerId: 'cus_xxx'
   ↓
7. Trial active (3 days)
   ↓
8. After 3 days, Stripe auto-charges $19
   ↓
9. User wants to manage subscription
   ↓
10. Frontend calls /api/billing/portal
    ↓
11. Returns Stripe portal URL
    ↓
12. User redirected to portal
    - Can cancel, update card, view invoices
    ↓
13. Portal redirects back to /dashboard
```

---

## 🧪 Testing Checklist

### Before Going Live
- [ ] Run `npx prisma generate` successfully (no errors)
- [ ] Verify TypeScript compiles with no errors
- [ ] Test trial flow end-to-end with test card 4242 4242 4242 4242
- [ ] Verify `stripeCustomerId` is saved to database after checkout
- [ ] Test Customer Portal access (should load Stripe hosted page)
- [ ] Test cancellation in portal (should cancel at period end)
- [ ] Test payment method update
- [ ] Configure portal settings in Stripe Dashboard
- [ ] Set production webhook endpoint in Stripe
- [ ] Test webhook signature verification

### Environment Variables Required
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...  # or sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # or pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO=price_...  # From Stripe Dashboard
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://...
```

---

## 🔒 Security Notes

### Webhook Signature Verification
The webhook handler already verifies Stripe signatures:
```typescript
const sig = request.headers.get('stripe-signature')!;
const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
```
✅ **This prevents fake webhook calls**

### Customer ID Validation
The portal route ensures:
- ✅ User is authenticated (Clerk auth)
- ✅ Customer ID matches user in database
- ✅ Returns user back to your domain after portal session

---

## 📝 API Reference

### POST /api/billing/portal
**Purpose**: Generate Stripe Customer Portal session  
**Auth**: Required (Clerk)  
**Response**:
```json
{
  "url": "https://billing.stripe.com/p/session/test_xxx"
}
```

**Error Responses**:
- `401 Unauthorized` - No auth token
- `404 User not found` - User doesn't exist in database
- `500 Internal error` - Stripe API error

---

## 🎉 Benefits of Customer Portal

### For Users
- 🔒 Secure, PCI-compliant payment updates
- 📄 Professional invoice management
- ⚡ Instant subscription control
- 🌍 Works in 135+ currencies

### For You (Developer)
- ✅ No need to build custom billing UI
- ✅ Stripe handles all PCI compliance
- ✅ Automatic invoice generation
- ✅ Built-in cancellation flow
- ✅ Mobile-responsive out of the box
- ✅ Maintained by Stripe (always up-to-date)

---

## 🆘 Troubleshooting

### "stripeCustomerId does not exist on User"
**Cause**: Prisma client not regenerated  
**Fix**: Close VS Code, reopen, run `npx prisma generate`

### User has no stripeCustomerId in database
**Cause**: Existing users created before schema update  
**Fix**: Portal route handles this - finds customer by email or creates new one

### Portal returns 404 for customer
**Cause**: Customer deleted in Stripe Dashboard  
**Fix**: Portal route creates new customer automatically

### Users can't see invoices in portal
**Cause**: Portal not configured in Stripe Dashboard  
**Fix**: Go to Stripe Dashboard → Settings → Billing → Customer Portal → Enable "Invoice history"

---

## 🔗 Related Documentation
- [STRIPE_TRIAL_AND_CANCELLATION_GUIDE.md](./STRIPE_TRIAL_AND_CANCELLATION_GUIDE.md) - Trial system setup
- [Stripe Customer Portal Docs](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)

---

**Status**: ⚠️ **Almost Complete** - Just need to regenerate Prisma client (restart VS Code and run `npx prisma generate`)

**Last Updated**: 2025-01-XX
